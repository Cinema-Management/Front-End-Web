import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import { RiFileExcel2Fill } from 'react-icons/ri';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { Button, DatePicker } from 'antd';
import { FormatDate, getFormatteNgay} from '~/utils/dateUtils';
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';

const StatisticReturnInvoice = () => {
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [selectOptionCinemaCode, setSelectOptionCinemaCode] = useState('');
    const [addressCinema, setAddressCinema] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(["", ""]);
    const [page, setPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    const { RangePicker } = DatePicker;
    
 
    const fetchStatisticReturn = async (page, filter = {}) => {
        try {
            const response = await axios.get('api/statistics/getReturnInvoiceDetailsByCinemaCode', { params: { page, ...filter } });
            const data = response.data;

            return { invoices: data.data,data: data, totalPages: data.totalPages };
        } catch (error) {
            console.log('error', error);
        }
    };

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;
            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name,
                code: cinema.code,
                address: cinema.fullAddress,
            }));
            return { optionNameCinema: arrayNameCinema };
        } catch (error) {
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                throw new Error('Error: No response received from server');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    };

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isFetched: isFetchedCinemas,
    } = useQuery('cinemasFullAddressStatisticReturn', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const getActiveFilter = () => {
        const filters = {};

        if (selectOptionCinemaCode !== "") filters.cinemaCode = selectOptionCinemaCode;
        if (Array.isArray(rangePickerValue) && rangePickerValue[0] !== "" && rangePickerValue[1] !== "") {
            filters.fromDate = FormatDate(rangePickerValue[0]);
            filters.toDate = FormatDate(rangePickerValue[1]);
        }
        
        return filters; 
    };
    const {
        data: { invoices = [],data = [], totalPages = 0 } = {},
        isLoading,
        isFetched,
        isError,
    } = useQuery(
        ['fetchStatisticInvoiceReturn', page,activeFilters,],
        () => fetchStatisticReturn(page,activeFilters),
        {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,

    });

    const handleFilterClick = () => {
        const filters = getActiveFilter();
        if (!filters.fromDate || !filters.toDate) {
            toast.warning('Vui lòng chọn ngày bán để thống kê!');
            return; 
        }
        setActiveFilters(filters);  
    };

    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const onChangeRanger = (dates) => {
        setRangePickerValue(dates);
        
    };


    const handleOptionCinemas = (value) => {
        setSelectedOptionFilterCinema(value);
        const cinemaCode = optionNameCinema.find((item) => item.name === value);
        setAddressCinema(cinemaCode?.address);
       setSelectOptionCinemaCode(cinemaCode?.code);
    };
    useEffect(() => {
        setPage(1); 
    }, [selectOptionCinemaCode, rangePickerValue]);

    const exportToExcel = async() => {
        let loadingId;
        if(data.length === 0){
            toast.warning('Không có dữ liệu để xuất file Excel');
            return;
        }
        const filters = getActiveFilter();
        filters.isExportAllData = 'true';
        loadingId = toast.loading('Đang xuất file...');
        const { invoices = []} = await fetchStatisticReturn(1, filters);
        
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('BangKeTraHang', { views: [{ showGridLines: false }] });
        const defaultFont = {
                name: 'Times New Roman',
                size: 12,
                bold: false,
                color: { argb: '000000' }
            };
            const boldFont = {
                name: 'Times New Roman',
                size: 12,
                bold: true,
                color: { argb: '000000' }
            };
            const currencyFormat = '#,##0;[Red]"-"#,##0';
            
           
        
            sheet.addRow(['Tên rạp: ' + (selectedOptionFilterCinema || 'Tất cả rạp')]);
            sheet.mergeCells('A1:C1');
            sheet.addRow(['Địa chỉ rạp: ' + (addressCinema || '')]);
            sheet.addRow(['Ngày in: ' + new Date().toLocaleString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric'
            })]);
            sheet.mergeCells('A2:D2');
            sheet.mergeCells('A3:C3');
            sheet.eachRow((row) => {
                row.eachCell((cell) => {
                    if (!cell.font || cell.font.bold !== true) {
                        cell.font = defaultFont;
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    }
                });
            });
            const titleRow = sheet.addRow(['BẢNG KÊ CHI TIẾT HÀNG HÓA ĐƠN TRẢ HÀNG']);
            titleRow.eachCell((cell) => {
            cell.font = boldFont; 
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
            sheet.mergeCells('A4:J4');
    
            const date = sheet.addRow(['Từ ngày: ' + getFormatteNgay(rangePickerValue[0]) + '      Đến ngày ' + getFormatteNgay(rangePickerValue[1])]);
            date.eachCell((cell) => {
                cell.font = defaultFont; 
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            sheet.mergeCells('A5:J5');
            sheet.addRow([]); 
        
               const headerRow = sheet.addRow([
                'STT',
                'Hóa Đơn Mua',
                'Ngày Mua HĐ',
                'Hóa Đơn Trả',
                'Ngày Trả HĐ',
                'Loại SP',
                'Mã SP',
                'Tên SP',
                'Tổng Số Lượng',
                'Doanh Thu',
              
            ]);
            headerRow.height = 35;
            headerRow.eachCell((cell) => {
                cell.font = boldFont; 
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
    
                cell.fill = {
                    type: 'pattern', 
                    pattern: 'solid', 
                    fgColor: { argb: 'DDEBF7' }
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
            

            let promotionRows = {};       
            let previousReturnInvoiceCode = null; 
            let stt = 0; 
            
            invoices.forEach((item, index) => {
                if (item.returnInvoiceCode !== previousReturnInvoiceCode) {
                    stt++; 
                }
            
                const row = sheet.addRow([
                    stt, 
                    item.salesInvoiceCode,
                    getFormatteNgay(item.salesInvoiceCreatedAt),
                    item.returnInvoiceCode,
                    getFormatteNgay(item.returnInvoiceCreatedAt),
                    item.productType === 0 ? 'Ghế' : 'Đồ ăn & nước',
                    item.productCode,
                    item.productName,
                    item.productQuantity,
                    item.totalAmount,
                ]);
            
                if (!promotionRows[item.returnInvoiceCode]) {
                    promotionRows[item.returnInvoiceCode] = [];
                }
                promotionRows[item.returnInvoiceCode].push(row.number);
            
                // Apply formatting to cells
                row.eachCell((cell, colNumber) => {
                    cell.font = defaultFont;
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
            
                    if (colNumber === 3 || colNumber === 5) {
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
            
                    if (typeof cell.value === 'number') {
                        if (colNumber === 9 || colNumber === 10 || colNumber === 11) {
                            cell.numFmt = currencyFormat;
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        }
                    }
            
                    cell.border = {
                        top: { style: 'thin', color: { argb: '000000' } },
                        left: { style: 'thin', color: { argb: '000000' } },
                        bottom: { style: 'thin', color: { argb: '000000' } },
                        right: { style: 'thin', color: { argb: '000000' } }
                    };
                });
                previousReturnInvoiceCode = item.returnInvoiceCode;
            });
            
            for (const promotionCode in promotionRows) {
                const rows = promotionRows[promotionCode];
                const startRow = rows[0];
                const endRow = rows[rows.length - 1];
                sheet.mergeCells(`A${startRow}:A${endRow}`);  
                sheet.mergeCells(`B${startRow}:B${endRow}`); 
                sheet.mergeCells(`C${startRow}:C${endRow}`);  
                sheet.mergeCells(`D${startRow}:D${endRow}`); 
                sheet.mergeCells(`E${startRow}:E${endRow}`);  
            }

            const row = sheet.addRow([
                "", 
                "", 
                '', 
                "", 
                "", 
                "", 
                "", 
                'Tổng cộng', 
                data.totalQuantity,
                data.totalAmount, 
            ]);
            row.eachCell((cell,colNumber) => {
                cell.font = boldFont; 
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
    
                if (typeof cell.value === 'number') {
                    if (colNumber === 10) {
                        cell.numFmt = currencyFormat;
                        cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    }
                }
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
            sheet.columns = [
                { width: 10 }, 
                { width: 25 },
                { width: 20 },
                { width: 25 },
                { width: 20 },
                { width: 20 },
                { width: 17 },
                { width: 30 },
                { width: 18 },
                { width: 25 }
            ];
        
            workbook.xlsx.writeBuffer()
                .then((buffer) => {
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    const fileName = `BaoCaoThongKeChiTietHangHoaDonTraHang_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
                    link.download = fileName;
                    link.click();
                })
                .catch((error) => {
                    console.error('Có lỗi xảy ra khi tạo file Excel:', error);
                });
            toast.dismiss(loadingId);
    
    };
    
    
      
    if (
        isLoading ||
        isLoadingCinemas
    )
        return <Loading />;
    if (!isFetched || !isFetchedCinemas ) return <div>Fetching...</div>;
    if (isError || CinemaError )
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    CinemaError.message 
                  
                   }
            </div>
        );

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[125px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Thống kê chi tiết hàng hóa đơn trả</h1>
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-10 gap-5 mb-2 items-center w-full h-16 px-3">
                        <div className='grid col-span-7 grid-cols-7 gap-5'>
                            <div className="col-span-4">
                                <h1 className="text-[16px] truncate mb-1">Ngày bán</h1>
                                <RangePicker
                                    value={rangePickerValue}
                                    onChange={onChangeRanger}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    placement="bottomLeft"
                                    format={'DD-MM-YYYY'}
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                                />
                            </div>
                            <AutoInputComponent
                                options={optionNameCinema.map((option) => option.name)}
                                value={selectedOptionFilterCinema}
                                onChange={(newValue) => handleOptionCinemas(newValue)}
                                title="Rạp"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Chọn"
                                heightSelect={200}
                                borderRadius="10px"
                                className1="col-span-3"
                            />
                        </div>
                        <div className='col-span-2 gap-5 grid grid-cols-2 mt-7'>
                            <Button type='primary' className='font-bold text-white bg-blue-500' onClick={handleFilterClick}>
                                Thống kê
                            </Button>
                            <Button icon={ <RiFileExcel2Fill size={22} color='#107C41'/>}
                             className='font-bold text-black bg-gray-300' onClick={exportToExcel}>
                                Xuất
                            </Button>
                    </div>
                   </div>
                </div>
            </div>
            <div className="bg-white border shadow-md rounded-[10px] box-border h-[490px] custom-height-xs2 max-h-screen custom-height-sm27 custom-height-md7 custom-height-lg6 custom-height-xl5 custom-hubmax5">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="gradient-button py-3 text-[13px] rounded-ss-md rounded-se-md uppercase font-semibold text-white grid grid-cols-11 items-center min-w-[1200px]">
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-center items-center">STT</h1>
                            <h1 className="grid justify-center items-center col-span-2">Mã HĐ bán</h1>
                        </div>
                       <div className='grid grid-cols-4 col-span-3'>
                            <h1 className="grid justify-center items-center ">Ngày lập</h1>
                            <h1 className="grid justify-center items-center col-span-2">Mã HĐ trả</h1>
                            <h1 className="grid justify-center items-center">Ngày trả</h1>
                       </div>
                        <div className='grid col-span-2 grid-cols-5'>
                            <h1 className="grid justify-center items-center col-span-3">Loại SP</h1>
                            <h1 className="grid justify-center items-center col-span-2">Mã SP</h1>
                        </div>
                        <h1 className="grid justify-center items-center col-span-2">Tên SP</h1>
                       <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-center items-center ">Số lượng</h1>
                            <h1 className="grid justify-center items-center col-span-2">Doanh thu</h1>
                       </div>
                    </div>

                    {data.length !== 0 && (
                            <div className="border-b border-t border-black py-2 text-[14px] uppercase font-semibold text-black items-center min-w-[1200px]">
                            <div className='grid grid-cols-11'>
                                    <h1 className="grid justify-end items-center col-span-9">Tổng cộng</h1>
                                   <div className='grid grid-cols-3 col-span-2'>
                                        <h1 className="grid justify-end items-center ">{data.totalQuantity}</h1>
                                        <h1 className="grid col-span-2 justify-end items-center pr-4">{formatCurrency(data.totalAmount)}</h1>
                                   </div>
                                </div>
                        </div>
                    )}
                    <div className=" min-w-[1200px] h-[400px] overflow-auto custom-height-sm28 custom-height-md8 custom-height-lg7 custom-height-xl6 custom-hubmax6">
                    {invoices.map((item, index) => (
                    <div
                        className="border-b py-2 border-black text-[14px] font-normal text-slate-500 grid  grid-cols-11 items-center"
                        key={index}
                    >
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid pl-2 items-center break-all">{index+1}</h1>
                            <h1 className="grid items-center col-span-2">{item.salesInvoiceCode}</h1>
                        </div>
                        <div className='grid col-span-3 grid-cols-4'>
                                <h1 className="grid justify-center items-center">{getFormatteNgay(item.salesInvoiceCreatedAt)}</h1>
                                <h1 className="grid  items-center col-span-2 pl-2 ">{item.returnInvoiceCode}</h1>
                                <h1 className="grid justify-center items-center">{getFormatteNgay(item.returnInvoiceCreatedAt)}</h1>
                        </div>
                        <div className='grid col-span-2 grid-cols-5'>
                            <h1 className="grid pl-3 items-center col-span-3">{item.productType===0 ? "Ghế" : "Đồ ăn & nước"}</h1>
                            <h1 className="grid pl-1 items-center col-span-2 break-all">{item.productCode}</h1>
                        </div>
                        <h1 className="grid items-center col-span-2">{item.productName} {item.seatNumber}</h1>
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-end items-center">{item.productQuantity}</h1>
                            <h1 className="grid justify-end items-center col-span-2 pr-4">{formatCurrency(item.totalAmount)}</h1>
                        </div>
                    </div>
                    ))}

                      
                    </div>
                </div>
            </div>
            {totalPages > 0 && (
                <div className="justify-end flex items-center mr-7 mt-1">
                    <Button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        style={{ padding: '3px 3px', fontSize: '13px', height: '25px' }}
                    >
                        <IoIosArrowBack size={20} />
                    </Button>

                    <div className="flex items-center mx-2">
                        {page > 3 && (
                            <>
                                <span
                                    className="page-number border text-sm mx-1 cursor-pointer px-2 py-1 bg-gray-200 hover:bg-gray-400 rounded"
                                    onClick={() => setPage(1)}
                                >
                                    1
                                </span>
                                <span className="text-[13px] mx-1">...</span>
                            </>
                        )}
                        {[Math.max(1, page - 2),
                            Math.max(1, page - 1),
                            page,
                            Math.min(totalPages, page + 1),
                            Math.min(totalPages, page + 2)]
                            .filter((pageNumber, index, self) => self.indexOf(pageNumber) === index)
                            .map((pageNumber) => (
                                <span
                                    key={pageNumber}
                                    className={`page-number text-[13px] mx-1 cursor-pointer px-2 py-1 rounded ${page === pageNumber ? 'font-bold border-2 border-blue-500 bg-blue-500 text-white' : 'border bg-white hover:bg-gray-400'}`}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </span>
                            ))}
                        {page < totalPages - 2 && (
                            <>
                                <span className="text-[13px] mx-1">...</span>
                                <span
                                    className="page-number text-[13px] mx-1 cursor-pointer px-2 py-1 bg-gray-200 hover:bg-gray-400 rounded"
                                    onClick={() => setPage(totalPages)}
                                >
                                    {totalPages}
                                </span>
                            </>
                        )}
                    </div>
                    
                    <Button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        style={{ padding: '3px 3px', fontSize: '12px', height: '25px' }}
                    >
                        <IoIosArrowForward size={20} />
                    </Button>
                </div>
            )}

          
       
          
        </div>
    );
};

export default StatisticReturnInvoice;
