import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import { RiFileExcel2Fill } from 'react-icons/ri';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { Button } from 'antd';
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';

const StatisticFilm = () => {
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [selectOptionCinemaCode, setSelectOptionCinemaCode] = useState('');
    const [addressCinema, setAddressCinema] = useState('');
    const [movieFilter, setMovieFilter] = useState('');
    const [movieCode, setMovieCode] = useState('');
    const [page, setPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    
    const fetchMovie = async () => {
        const movieResponse = await axios.get('api/movies');
        const arrayMovie = movieResponse.data.map((item) => ({
            code: item.code,
            name: item.name,
        }));
        return { optionMovie: arrayMovie };
    };
    const fetchStatisticMovie = async (page, filter = {}) => {
        try {
            const response = await axios.get('api/statistics/getTotalByMovie', { params: { page, ...filter } });
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
        data: { optionMovie = [] } = {},
        isError: isErrorMovie,
        isLoading: isLoadingMovie,
        isFetched: isFetchedMovie,
    } = useQuery('statisticMovie', fetchMovie, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isFetched: isFetchedCinemas,
    } = useQuery('cinemasFullAddressInvoiceStatisticMovie', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });
    const getActiveFilter = () => {
        const filters = {};
        if (movieCode !== "") filters.movieCode = movieCode;
        if (selectOptionCinemaCode !== "") filters.cinemaCode = selectOptionCinemaCode;
        return filters; 
    };
    const {
        data: { invoices = [], totalPages = 0 } = {},
        isLoading,
        isFetched,
        isError,
        // refetch: refetchInvoice,
    } = useQuery(
        ['fetchStatisticMovies', page,activeFilters],
        () => fetchStatisticMovie(page,activeFilters),
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

    const handleStaff = (value) => {
        setMovieFilter(value);
        const movieCode = optionMovie.find((item) => item.name.toUpperCase() === value);
        setMovieCode(movieCode?.code);
       
    };

    const handleOptionCinemas = (value) => {
        setSelectedOptionFilterCinema(value);
        const cinemaCode = optionNameCinema.find((item) => item.name === value);
        setAddressCinema(cinemaCode?.address);
       setSelectOptionCinemaCode(cinemaCode?.code);
    };
    useEffect(() => {
        setPage(1); 
    }, [movieFilter, selectOptionCinemaCode]);

    const exportToExcel = async() => {
        let loadingId;
        const filters = getActiveFilter();
        filters.isExportAllData = 'true';
        loadingId = toast.loading('Đang xuất file...');
        const { invoices = []} = await fetchStatisticMovie(1, filters);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Doanh Thu Theo Phim', { views: [{ showGridLines: false }] });
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
       
    
        sheet.addRow(['Tên rạp: ' + (selectedOptionFilterCinema || "Tất cả rạp") ]);
        sheet.mergeCells('A1:C1');
        sheet.addRow(['Địa chỉ rạp: ' + (addressCinema || "Tất cả rạp")]);
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
        const titleRow = sheet.addRow(['DOANH SỐ THEO PHIM']);
        titleRow.eachCell((cell) => {
        cell.font = boldFont; 
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        sheet.mergeCells('A4:E4');
        sheet.addRow([""]);
           const headerRow = sheet.addRow([
            'STT',
            'Mã Phim',
            'Tên Phim',
            'Số lượng vé bán',
            'Doanh thu',
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
        
        invoices.forEach((item, index) => {
            
                const row = sheet.addRow([
                    index + 1,
                    item.movieCode,
                    item.movieName,
                    item.totalQuantity,
                    item.totalRevenue,

                ]);
                
                row.eachCell((cell, colNumber) => {
                    cell.font = defaultFont;
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    
                    if (typeof cell.value === 'number') {
                        if (colNumber === 5 ) {
                            cell.numFmt = currencyFormat;
                            cell.alignment = { horizontal: 'right', vertical: 'middle' };
                        }
                        if (colNumber === 4 ) {
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
       
        });
        
        sheet.columns = [
            { width: 10 }, 
            { width: 18 },
            { width: 65 },
            { width: 20 },
            { width: 25 },
        ];
    
        // Xuất file Excel
        workbook.xlsx.writeBuffer()
            .then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                const fileName = `BaoCaoThongKeDoanhThuTheoPhim ${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
        isLoadingMovie
    )
        return <Loading />;
    if (!isFetched || !isFetchedCinemas || !isFetchedMovie) return <div>Fetching...</div>;
    if (isError || CinemaError || isErrorMovie )
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    CinemaError.message ||
                    isErrorMovie.message 
                   }
            </div>
        );

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[125px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Thống kê doanh thu theo phim</h1>
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-11 gap-5 mb-2 items-center w-full h-16 px-3">
                        <div className='grid col-span-9 grid-cols-8 gap-5'>
                            <AutoInputComponent
                                options={optionMovie.map((item) => item.name.toUpperCase())} 
                                value={movieFilter}
                                onChange={(newValue) => handleStaff(newValue)}
                                title="Tên Phim"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập"
                                heightSelect={200}
                                borderRadius="10px"
                                className1="col-span-3"
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
                    <div className="gradient-button py-3 text-[13px] rounded-ss-md rounded-se-md uppercase font-semibold text-white grid grid-cols-8 items-center min-w-[1200px]">
                        <div className='grid col-span-2 grid-cols-3'>
                            <h1 className="grid justify-center items-center">STT</h1>
                            <h1 className="grid justify-center items-center col-span-2">Mã Phim</h1>
                        </div>
                        <h1 className="grid justify-center items-center col-span-3">Tên Phim</h1>
                        <h1 className="grid justify-center items-center">Vé bán ra</h1>
                        <h1 className="grid justify-center items-center col-span-2">Doanh thu</h1>
                    </div>
                    <div className=" min-w-[1200px] h-[430px] overflow-auto custom-height-sm30 custom-height-md9 custom-height-lg8 custom-height-xl7 custom-hubmax7">
                    {invoices.map((item, index) => (
                        <div
                        className="border-b py-2 border-black text-[14px] font-normal text-slate-500 grid  grid-cols-8 items-center"
                        key={index}
                        >
                            <div className='grid col-span-2 grid-cols-3'>
                                <h1 className="grid pl-3 items-center">{index + 1}</h1>
                                <h1 className="grid pl-3 items-center col-span-2">{item.movieCode}</h1>
                            </div>
                            <h1 className="grid pl-3 items-center col-span-3">{item.movieName}</h1>
                            <h1 className="grid justify-end items-center pr-3">{new Intl.NumberFormat('vi-VN').format(item.totalQuantity)} vé</h1>
                            <h1 className="grid justify-end pr-4 items-center col-span-2">{(formatCurrency(item.totalRevenue))}</h1>
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

export default StatisticFilm;
