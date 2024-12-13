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

const StatisticStaff = () => {
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [selectOptionCinemaCode, setSelectOptionCinemaCode] = useState('');
    const [addressCinema, setAddressCinema] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [customerCode, setCustomerCode] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(["", ""]);
    const [page, setPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    const { RangePicker } = DatePicker;
    
    const fetchStaff = async () => {
        const staffResponse = await axios.get('api/users');
        const arrayCustomer = staffResponse.data.map((item) => ({
            code: item.code,
            name: item.name,
        }));
        return { optionCustomer: arrayCustomer };
    };
    const fetchStatisticSaleInvoice = async (page, filter = {}) => {
        try {
            const response = await axios.get('api/statistics/getStatisticsByCustomer', { params: { page, ...filter } });
            const data = response.data;

            return { invoices: data.items,data: data, totalPages: data.totalPages };
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
        data: { optionCustomer = [] } = {},
        isError: isErrorStaff,
        isLoading: isLoadingStaff,
        isFetched: isFetchedStaff,
    } = useQuery('staffInvoiceStatistic', fetchStaff, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isFetched: isFetchedCinemas,
    } = useQuery('cinemasFullAddressInvoiceStatistic', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });
    const getActiveFilter = () => {
        const filters = {};
        if (customerCode !== "") filters.customerCode = customerCode;

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
        // refetch: refetchInvoice,
    } = useQuery(
        ['fetchStatisticCustomer', page,activeFilters],
        () => fetchStatisticSaleInvoice(page,activeFilters),
        {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const handleFilterClick = () => {
        const filters = getActiveFilter();
        if (!filters.fromDate || !filters.toDate) {
            toast.warning('Vui lòng ngày bán để thống kê!');
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
    const handleStaff = (value) => {
        setStaffFilter(value);
        const customerCode = optionCustomer.find((item) => item.name === value);
        setCustomerCode(customerCode?.code);
       
    };

    const handleOptionCinemas = (value) => {
        setSelectedOptionFilterCinema(value);
        const cinemaCode = optionNameCinema.find((item) => item.name === value);
        setAddressCinema(cinemaCode?.address);
       setSelectOptionCinemaCode(cinemaCode?.code);
    };
    useEffect(() => {
        setPage(1); 
    }, [staffFilter, selectOptionCinemaCode, rangePickerValue]);

    const exportToExcel = async() => {
        let loadingId;
        if(data.length === 0){
            toast.warning('Không có dữ liệu để xuất file Excel');
            return;
        }
        const filters = getActiveFilter();
        filters.isExportAllData = 'true';
        loadingId = toast.loading('Đang xuất file...');
        const { invoices = []} = await fetchStatisticSaleInvoice(1, filters);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('DSBH_TheoKH', { views: [{ showGridLines: false }] });
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
        sheet.addRow(['Địa chỉ rạp: ' + (addressCinema || 'Tất cả rạp')]);
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
        const titleRow = sheet.addRow(['DOANH SỐ THEO KHÁCH HÀNG']);
        titleRow.eachCell((cell) => {
        cell.font = boldFont; 
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        sheet.mergeCells('A4:K4');

        const date = sheet.addRow(['Từ ngày: ' + getFormatteNgay(rangePickerValue[0]) + '      Đến ngày ' + getFormatteNgay(rangePickerValue[1])]);
        date.eachCell((cell) => {
            cell.font = defaultFont; 
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        sheet.mergeCells('A5:K5');
        sheet.addRow([]); 
    
           const headerRow = sheet.addRow([
            'STT',
            'Mã KH',
            'Tên KH',
            'Địa chỉ',
            'Phường/Xã',
            'Quận/Huyện',
            'Tỉnh/Thành',
            'Loại sản phẩm',
            'Doanh Số Trước CK',
            'Chiết Khấu',
            'Doanh Số Sau CK'
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

        let previousSTT = null;
        let customerRows = {};
        invoices.forEach((item, index) => {
            Object.keys(item.totalsByType).forEach((key, subIndex) => {
                const { totalAmount, discountAmount, totalAfterDiscount } = item.totalsByType[key];
                const typeLabel = key === '0' ? 'Vé' : 'Đồ ăn và nước';
                const row = sheet.addRow([
                    previousSTT === item.customer.code ? '' : index + 1,
                    item.customer.code,
                    item.customer.name,
                    item.customer.addressDetail,
                    item.customer.ward,
                    item.customer.district,
                    item.customer.province,
                    typeLabel,
                    totalAmount,
                    discountAmount,
                    totalAfterDiscount
                ]);
        
                if (!customerRows[item.customer.code]) {
                    customerRows[item.customer.code] = [];
                }
                customerRows[item.customer.code].push(row.number);
    
                if (subIndex === Object.keys(item.totalsByType).length - 1) { 
                    for (let col = 1; col <= 11; col++) {  
                        const cell = row.getCell(col);
                        cell.border = {
                            bottom: { style: 'thin', color: { argb: '000000' } },
                            left: { style: 'thin', color: { argb: '000000' } },
                            right: { style: 'thin', color: { argb: '000000' } },
                            top: { style: 'thin', color: { argb: '000000' } }
                           
                        };
                    }
                }
                row.eachCell((cell, colNumber) => {
                    cell.font = defaultFont;
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    cell.border = {
                        bottom: { style: 'thin', color: { argb: '000000' } },
                        left: { style: 'thin', color: { argb: '000000' } },
                        right: { style: 'thin', color: { argb: '000000' } },
                        top: { style: 'thin', color: { argb: '000000' } }
                    };
                    if (typeof cell.value === 'number') {
                        if (colNumber === 9 || colNumber === 10 || colNumber === 11) {
                            cell.numFmt = currencyFormat;
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        }
                    }
                  
                });
        
                previousSTT = item.customer.code; 
            });
        });
        for (const customerCode in customerRows) {
            const rows = customerRows[customerCode];
            const startRow = rows[0];
            const endRow = rows[rows.length - 1];
            sheet.mergeCells(`A${startRow}:A${endRow}`);  
            sheet.mergeCells(`B${startRow}:B${endRow}`); 
            sheet.mergeCells(`C${startRow}:C${endRow}`);  
            sheet.mergeCells(`D${startRow}:D${endRow}`); 
            sheet.mergeCells(`E${startRow}:E${endRow}`);  
            sheet.mergeCells(`F${startRow}:F${endRow}`);
            sheet.mergeCells(`G${startRow}:G${endRow}`);
        }
        sheet.columns = [
            { width: 10 }, 
            { width: 13 },
            { width: 25 },
            { width: 25 },
            { width: 17 },
            { width: 20 },
            { width: 25 },
            { width: 20 },
            { width: 25 },
            { width: 20 },
            { width: 25 }
        ];
    
        // Xuất file Excel
        workbook.xlsx.writeBuffer()
            .then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                const fileName = `BaoCaoThongKeTheoKH ${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
        isLoadingCinemas ||
        isLoadingStaff
    )
        return <Loading />;
    if (!isFetched || !isFetchedCinemas || !isFetchedStaff) return <div>Fetching...</div>;
    if (isError || CinemaError || isErrorStaff )
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    CinemaError.message ||
                    isErrorStaff.message 
                   }
            </div>
        );

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[125px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Thống kê doanh số theo khách hàng</h1>
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-10 gap-5 mb-2 items-center w-full h-16 px-3">
                        <div className='grid col-span-8 grid-cols-7 gap-5'>
                            <div className="col-span-3">
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
                                options={optionCustomer.map((item) => item.name)}
                                value={staffFilter}
                                onChange={(newValue) => handleStaff(newValue)}
                                title="Tên khách hàng"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập"
                                heightSelect={200}
                                borderRadius="10px"
                                className1="col-span-2"
                            />
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
                                className1="col-span-2"
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
                    <div className="gradient-button py-3 text-[13px] rounded-ss-md rounded-se-md uppercase font-semibold text-white flex items-center min-w-[1200px]">
                       <h1 className="w-[5%] flex justify-center items-center">STT</h1>
                       <div className='grid grid-cols-8 w-[95%]'>
                           <div className='grid grid-cols-4 col-span-2'>
                                <h1 className="grid justify-center items-center ">Mã KH</h1>
                                <h1 className="grid justify-center items-center col-span-3">Tên KH</h1>
                           </div>
                            <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                            <h1 className="grid justify-center items-center">Loại sản phẩm</h1>
                            <h1 className="grid justify-center items-center">Doanh số trước CK</h1>
                            <h1 className="grid justify-center items-center ">Chiết khấu</h1>
                            <h1 className="grid justify-center items-center ">Doanh số sau CK</h1>
                        </div>
                    </div>
                    <div className=" min-w-[1200px] h-[430px] overflow-auto custom-height-sm30 custom-height-md9 custom-height-lg8 custom-height-xl7 custom-hubmax7">
                    {invoices.map((item, index) => (
                    <div
                        className="border-b border-black text-[14px] font-normal text-slate-500 flex items-center"
                        key={index}
                    >
                        <h1 className="flex w-[5%] justify-center items-center">{index + 1}</h1>
                        <div className="grid w-[95%] border-l">
                          { Object.entries(item.totalsByType).map(([key, invoice], subIndex) => (
                            <div className="grid grid-cols-8 col-span-11 border-b py-3" key={subIndex}>
                              <div className="grid grid-cols-4 col-span-2">
                                <h1 className="grid ml-1 items-center">{item?.customer.code}</h1>
                                <h1 className="grid ml-2 items-center col-span-3">{item?.customer.name}</h1>
                              </div>
                              <h1 className="grid col-span-2 items-center">
                                {item?.customer.address}
                              </h1>
                              <h1 className="grid col-span-1 ml-6 items-center"> {key === "0" ? "Vé" : "Đồ ăn và nước"}</h1>
                              <h1 className="grid justify-end items-center">{formatCurrency(invoice.totalAmount)}</h1>
                              <h1 className="grid justify-end items-center">{formatCurrency(invoice.discountAmount)}</h1>
                              <h1 className="grid justify-end items-center mr-4">{formatCurrency(invoice.totalAfterDiscount)}</h1>
                            </div>
                          ))}
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

export default StatisticStaff;
