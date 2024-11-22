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

const StatisticPromotion = () => {

    const [promotionFilter, setPromotionFilter] = useState('');
    const [promotionCode, setPromotionCode] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(["", ""]);
    const [page, setPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    const { RangePicker } = DatePicker;
    
    const fetchPromotions = async () => {
        const promotionResponse = await axios.get('api/promotions/getPromotionsWithLines');
        const arrayPromotion = promotionResponse.data.map((item) => ({
            code: item.code,
            name: item.description,
        }));
        return { optionPromotion: arrayPromotion };
    };
    const fetchPromotionResultStatistic = async (page, filter = {}) => {
        try {
            const response = await axios.get('api/statistics/getPromotionResult', { params: { page, ...filter } });
            const data = response.data;

            return { promotions: data.promotions,data: data, totalPages: data.totalPages };
        } catch (error) {
            console.log('error', error);
        }
    };

   
    const {
        data: { optionPromotion = [] } = {},
        isError: isErrorPromotion,
        isLoading: isLoadingPromotion,
        isFetched: isFetchedPromotion,
    } = useQuery('promotionStatistic', fetchPromotions, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const getActiveFilter = () => {
        const filters = {};
        if (promotionCode !== "") {
            filters.promotionCode = promotionCode;
        }
        else if (Array.isArray(rangePickerValue) && rangePickerValue[0] !== "" && rangePickerValue[1] !== "") {
            filters.fromDate = FormatDate(rangePickerValue[0]);
            filters.toDate = FormatDate(rangePickerValue[1]);
        }
    
        return filters;
    };
    const {
        data: { promotions = [],data = [], totalPages = 0 } = {},
        isLoading,
        isFetched,
        isError,
        // refetch: refetchInvoice,
    } = useQuery(
        ['fetchStatisticPromotion', page,activeFilters],
        () => fetchPromotionResultStatistic(page,activeFilters),
        {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const handleFilterClick = () => {
        const filters = getActiveFilter();
        setActiveFilters(filters);  
    };

    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const onChangeRanger = (dates) => {
        setPromotionFilter('');
        setPromotionCode('');
        setRangePickerValue(dates);
        
    };
    const handlePromotion = (value) => {
        setRangePickerValue(["", ""]);
        setPromotionFilter(value);
        const promotionCode = optionPromotion.find((item) => item.name === value);
        setPromotionCode(promotionCode?.code);
       
    };

    useEffect(() => {
        setPage(1); 
    }, [promotionFilter, rangePickerValue]);

    const exportToExcel = async() => {
        let loadingId;
  
        const filters = getActiveFilter();
        filters.isExportAllData = 'true';
        loadingId = toast.loading('Đang xuất file...');
        const { promotions = []} = await fetchPromotionResultStatistic(1, filters);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Tổng kết KM', { views: [{ showGridLines: false }] });
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
        const numberFormat = '#.##0';

        sheet.addRow(['Tên rạp: Tất cả rạp']);
        sheet.mergeCells('A1:C1');
        sheet.addRow(['Ngày in: ' + new Date().toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
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
    
        const titleRow = sheet.addRow(['BÁO CÁO TỔNG KẾT KHUYẾN MÃI']);
        titleRow.eachCell((cell) => {
            cell.font = boldFont;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        sheet.mergeCells('A4:I4');
        const date = sheet.addRow(['Từ ngày: ' + getFormatteNgay(rangePickerValue[0]) + '      Đến ngày ' + getFormatteNgay(rangePickerValue[1])]);
        date.eachCell((cell) => {
            cell.font = defaultFont; 
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        sheet.mergeCells('A5:I5');
        sheet.addRow([]);
    
        const headerRow = sheet.addRow([
            'STT',
            'Mã CTKM',
            'Tên CTKM',
            'Ngày bắt đầu',
            'Ngày kết thúc',
            'Mã SP tặng',
            'Tên SP tặng',
            'SL tặng',
            'Số tiền chiết khấu',
        ]);
        headerRow.height = 35;
        headerRow.eachCell((cell) => {
            cell.font = boldFont;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'DDEBF7' },
            };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
            };
        });
        let previousSTT = null;  
        let promotionRows = {};
        promotions.forEach((promotion, index) => {
            promotion.products.forEach((product, productIndex) => {
                const row = sheet.addRow([
                    previousSTT === promotion.promotionCode ? '' : index + 1,
                    productIndex === 0 ? promotion.promotionCode : '', 
                    productIndex === 0 ? promotion.description : '',
                    productIndex === 0 ? getFormatteNgay(promotion.startDate) : '', 
                    productIndex === 0 ? getFormatteNgay(promotion.endDate) : '', 
                    product.productCode || '', 
                    product.productName || '', 
                    product.totalQuantity || '', 
                    product.totalDiscountAmount || '', 
                ]);
        
                if (!promotionRows[promotion.promotionCode]) {
                    promotionRows[promotion.promotionCode] = [];
                }
                promotionRows[promotion.promotionCode].push(row.number);
        
                row.eachCell((cell, colNumber) => {
                    cell.font = defaultFont;
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 6 || colNumber === 7) {
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    }
                    if (typeof cell.value === 'number') {
                        if (colNumber === 9 ) {
                            cell.numFmt = currencyFormat;
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        }
                        if (colNumber === 8 ) {
                            cell.numberFormat = numberFormat;
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        }
                    }
                    cell.border = {
                        top: { style: 'thin', color: { argb: '000000' } },
                        left: { style: 'thin', color: { argb: '000000' } },
                        bottom: { style: 'thin', color: { argb: '000000' } },
                        right: { style: 'thin', color: { argb: '000000' } },
                    };
                });
                previousSTT = promotion.promotionCode;
            });
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

        const totalRow = sheet.addRow([
            'Tổng CTKM', 
            '', 
            '', 
            '',
            '', 
            '', 
            '',
            data.overallTotalQuantity, 
            data.overallTotalDiscountAmount, 
        ]);
    
        totalRow.eachCell((cell,colNumber) => {
            cell.font = boldFont;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            if (typeof cell.value === 'number') {
                if (colNumber === 9 ) {
                    cell.numFmt = currencyFormat;
                    cell.alignment = { horizontal: 'right', vertical: 'middle' };
                }
                if (colNumber === 8 ) {
                    cell.numberFormat = numberFormat;
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
            { width: 17 },
            { width: 18 },
            { width: 38 },
            { width: 17 },
            { width: 17 },
            { width: 17 },
            { width: 35 },
            { width: 15 },
            { width: 25 },
        ];
    
        workbook.xlsx.writeBuffer()
            .then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                const fileName = `TongKetKM_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
        isLoadingPromotion
    )
        return <Loading />;
    if (!isFetched || !isFetchedPromotion) return <div>Fetching...</div>;
    if (isError || isErrorPromotion)
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    isErrorPromotion.message 
                   }
            </div>
        );

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[125px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Thống kê chương trình khuyến mãi</h1>
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-10 gap-5 mb-2 items-center w-full h-16 px-3">
                        <div className='grid col-span-8 grid-cols-9 gap-5'>
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
                                options={optionPromotion.map((item) => item.name)}
                                value={promotionFilter}
                                onChange={(newValue) => handlePromotion(newValue)}
                                title="Mã CTKM"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập"
                                heightSelect={200}
                                borderRadius="10px"
                                className1="col-span-3"
                            />
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
            </div>
            <div className="bg-white border shadow-md rounded-[10px] box-border h-[490px] custom-height-xs2 max-h-screen custom-height-sm27 custom-height-md7 custom-height-lg6 custom-height-xl5 custom-hubmax5">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="gradient-button py-3 text-[13px] rounded-ss-md rounded-se-md uppercase font-semibold text-white grid grid-cols-9 items-center min-w-[1200px]">
                        <div className='grid col-span-5 grid-cols-6 items-center '>
                            <div className='grid col-span-2 grid-cols-3'>
                                <h1 className="grid justify-center items-center">STT</h1>
                                <h1 className="grid justify-center items-center col-span-2">Mã CTKM</h1>
                            </div>
                            <h1 className="grid justify-center items-center col-span-2">Tên CTKM</h1>
                            <h1 className="grid justify-center items-center ">Ngày bắt đầu</h1>
                            <h1 className="grid justify-center items-center">Ngày kết thúc</h1>
                        </div>
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-center items-center ">Mã SP tặng</h1>
                            <h1 className="grid justify-center items-center col-span-2">Tên SP tặng</h1>
                        </div>
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-center items-center ">Số lượng</h1>
                            <h1 className="grid justify-center items-center col-span-2">Chiết khấu</h1>
                        </div>
                    </div>

                    <div className="border-b border-t border-black py-2 text-[14px] uppercase font-semibold text-black items-center min-w-[1200px]">
                        <div className='grid grid-cols-9'>
                            <h1 className="grid justify-center items-center col-span-5">{""}</h1>
                            <h1 className="grid justify-end items-center col-span-2">Tổng cộng</h1>
                            <div className='grid col-span-2 grid-cols-3'>
                                <h1 className="grid justify-end items-center ">{data.overallTotalQuantity}</h1>
                            <h1 className="grid justify-end pr-4 items-center col-span-2">{formatCurrency(data.overallTotalDiscountAmount)}</h1>
                            </div>
                        </div>
                    </div>
                    <div className=" min-w-[1200px] h-[430px] overflow-auto custom-height-sm30 custom-height-md9 custom-height-lg8 custom-height-xl7 custom-hubmax7">
                    {promotions.map((promotion, index) => (
                    <div
                        className="border-b border-black text-[14px] font-normal text-slate-500 grid  grid-cols-9 "
                        key={index}
                    >
                       <div className='grid col-span-5 grid-cols-6 border-r items-center py-2'>
                            <div className='grid col-span-2 grid-cols-3'>
                                <h1 className="grid ml-2 items-center break-all">{index+1}</h1>
                                <h1 className="grid items-center col-span-2">{promotion.promotionCode}</h1>
                            </div>
                            <h1 className="grid items-center col-span-2">{promotion.description}</h1>
                            <h1 className="grid justify-center items-center">{getFormatteNgay(promotion.startDate)}</h1>
                            <h1 className="grid justify-center items-center">{getFormatteNgay(promotion.endDate)}</h1>
                       </div>
                       <div className='grid col-span-4 grid-cols-4 '>
                        {promotion.products.map((product, index) => (
                           <div className='grid col-span-4 grid-cols-4 border-b py-2' key={index}>
                                <div className='grid col-span-2 grid-cols-3'>
                                    <h1 className="grid pl-2 items-center break-all">{product.productCode}</h1>
                                    <h1 className="grid pl-2 items-center col-span-2">{product.productName} </h1>
                                </div>
                                <div className='grid col-span-2 grid-cols-3'>
                                    <h1 className="grid justify-end items-center ">{product.totalQuantity}</h1>
                                    <h1 className="grid justify-end pr-4 items-center col-span-2">{formatCurrency(product.totalDiscountAmount)}</h1>
                                </div>
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

export default StatisticPromotion;
