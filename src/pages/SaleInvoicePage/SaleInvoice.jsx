import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';

import { IoIosArrowBack, IoIosArrowForward, IoIosPrint } from 'react-icons/io';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiRefund2Fill } from 'react-icons/ri';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { Button, DatePicker } from 'antd';
import { FormatDate, FormatSchedule, getFormattedDateTime, getFormatteNgay, handleChangAge } from '~/utils/dateUtils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightInVoiceComponent from '~/components/HeightComponent/HeightInVoiceComponent';
import { useSelector } from 'react-redux';
import Barcode from 'react-barcode';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const fetchAddressCinemaCode = async (code) => {
    try {
        const response = await axios.get(`api/hierarchy-values/${code}`);
        const addressCinema = response.data;
        return addressCinema.fullAddress;
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
const SaleInvoice = () => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const descriptionRef = useRef('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [selectOptionCinemaCode, setSelectOptionCinemaCode] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [movieCodeFilter, setMovieCodeFilter] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [staffCode, setStaffCode] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [searchCodeHD, setSearchCodeHD] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const height = HeightInVoiceComponent();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const optionStatus = [
        { value: 2, name: 'Tất cả' },
        { value: 1, name: 'Đã thanh toán' },
        { value: 0, name: 'Đã hoàn trả' },
    ];
    const [openPrint, setOpenPrint] = useState(false);
    const printRef = useRef(); // Tạo ref để tham chiếu đến phần in

    const handlePrint = async () => {
        let loadingId;
        if (printRef.current) {
            toast.loading('Đang in vé...');
            setOpenPrint(false);

            printRef.current.classList.remove('hidden');

            try {
                const canvas = await html2canvas(printRef.current, {
                    scale: 2,
                    useCORS: true,
                });

                const imgData = canvas.toDataURL('image/png');

                const pdfWidth = 80;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight],
                });

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                pdf.save(`${selectedInvoice?.code}.pdf`);
                printRef.current.classList.add('hidden');
                toast.dismiss(loadingId);
            } catch (error) {
                toast.dismiss(loadingId);
                console.error('Lỗi khi in hoặc lưu PDF:', error);
            }
        }
    };

    const handleOpenPrint = () => {
        setOpenPrint(true);
    };
    const handleClosePrint = () => {
        setOpenPrint(false);
    };

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const handleOpen = () => {
        setOpen(true);
    };
    const { RangePicker } = DatePicker;
    const handleClose = () => {
        setOpen(false);
        setSelectedInvoice(null);
    };
    const handleOpenDelete = () => {
        setOpenDelete(true);
        setSelectedInvoice(null);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedInvoice(null);
        descriptionRef.current = '';
    };
    const handleInputChange = (event) => {
        descriptionRef.current = event.target.value; // Cập nhật giá trị vào ref
    };

    const fetchMovies = async () => {
        const moviesResponse = await axios.get('api/movies');
        const arrayMovies = moviesResponse.data.map((movie) => ({
            code: movie.code,
            name: movie.name,
        }));
        return { optionMovie: arrayMovies };
    };
    const fetchStaff = async () => {
        const staffResponse = await axios.get('api/users/staff');
        const arrayStaff = staffResponse.data.map((item) => ({
            code: item.code,
            name: item.name,
        }));
        return { optionStaff: arrayStaff };
    };
    const fetchSaleInvoice = async (page, filter = {}) => {
        try {
            const response = await axios.get('api/sales-invoices', { params: { page, ...filter } });
            const data = response.data;
            return { invoices: data.items, totalPages: data.totalPages };
        } catch (error) {
            console.log('error', error);
        }
    };

    const fetchPromotionResult = async (promotionResultCode) => {
        try {
            const response = await axios.get('api/promotion-results/' + promotionResultCode);
            const data = response.data;

            return data;
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
    const getActiveFilter = () => {
        if (searchCodeHD !== '') return { invoiceCode: searchCodeHD };
        if (staffCode !== '') return { staffCode: staffCode };
        if (movieCodeFilter !== '') return { movieCode: movieCodeFilter };
        if (searchSDT !== '') return { customerCode: searchSDT };
        if (selectOptionCinemaCode !== '') return { cinemaCode: selectOptionCinemaCode };
        if (selectedStatus.value !== 2) return { status: selectedStatus.value };
        if (Array.isArray(rangePickerValue) && rangePickerValue[0] !== '' && rangePickerValue[1] !== '') {
            return {
                fromDate: FormatDate(rangePickerValue[0]),
                toDate: FormatDate(rangePickerValue[1]),
            };
        }

        return {};
    };
    const {
        data: { invoices = [], totalPages = 1 } = {},
        isLoading,
        isFetched,
        isError,
        refetch: refetchInvoice,
    } = useQuery(['fetchSaleInvoice', page, getActiveFilter()], () => fetchSaleInvoice(page, getActiveFilter()), {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { optionMovie = [] } = {},
        isError: isErrorMovies,
        isLoading: isLoadingMovies,
        isFetched: isFetchedMovies,
    } = useQuery('moviesInvoice', fetchMovies, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { optionStaff = [] } = {},
        isError: isErrorStaff,
        isLoading: isLoadingStaff,
        isFetched: isFetchedStaff,
    } = useQuery('staffInvoice', fetchStaff, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isFetched: isFetchedCinemas,
    } = useQuery('cinemasFullAddressInvoice', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: promotionResult = '',
        isLoading: isLoadingPromotionResult,
        error: errorPromotionResult,
    } = useQuery(['fetchPromotionResult', selectedInvoice?.code], () => fetchPromotionResult(selectedInvoice?.code), {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        enabled: !!selectedInvoice?.code,
    });

    const {
        data: addressCinema = '',
        isLoading: isLoadingAddressCinema,
        error: errorAddressCinema,
    } = useQuery(
        ['addressCinemaByCode', selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.code],
        () => fetchAddressCinemaCode(selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.code),
        {
            staleTime: 1000 * 60 * 3,
            cacheTime: 1000 * 60 * 10,
            refetchInterval: 1000 * 60 * 7, // Tần suất làm mới dữ liệu

            enabled: !!selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.code,
        },
    );

    const canRefund = () => {
        const startTime = dayjs(selectedInvoice?.scheduleCode?.startTime);
        const currentTime = dayjs();

        // Kiểm tra nếu thời gian hiện tại trước giờ chiếu ít nhất 1 giờ
        return currentTime.isBefore(startTime.subtract(1, 'hour'));
    };

    const handleReturnInvoice = async () => {
        if (!descriptionRef.current || descriptionRef.current.trim() === '') {
            toast.warning('Vui lòng nhập lý do trả hóa đơn!');
            return;
        }

        try {
            if (!canRefund()) {
                toast.warning('Hóa đơn chỉ trả trong ngày và trước 1 giờ của suất chiếu !');
                return;
            }
            setLoading(true);
            await axios.post('api/return-invoices', {
                staffCode: user.code,
                customerCode: selectedInvoice.customerCode?.code,
                scheduleCode: selectedInvoice.scheduleCode?.code,
                paymentMethod: 0,
                type: 0,
                salesInvoiceCode: selectedInvoice.code,
                returnReason: descriptionRef.current,
            });
            setLoading(false);
            toast.success('Trả hóa đơn thành công!');
            refetchInvoice();
            descriptionRef.current = '';
            handleCloseDelete();
        } catch (error) {
            setLoading(false);
            toast.error('Trả hóa đơn thất bại!');
        }
    };

    const mutation = useMutation(handleReturnInvoice, {
        onSuccess: () => {
            queryClient.refetchQueries('fetchReturnInvoice');
            queryClient.refetchQueries('fetchSeatByRoomCode');
        },
    });
    const onChangeRanger = (dates) => {
        setStaffCode('');
        setStaffFilter('');
        setInputSearch('');
        setMovieCodeFilter('');
        setSearchCodeHD('');
        setSearchSDT('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(dates);
    };

    const sortedStatus = (option) => {
        setStaffCode('');
        setStaffFilter('');
        setInputSearch('');
        setMovieCodeFilter('');
        setSearchCodeHD('');
        setSearchSDT('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setRangePickerValue(['', '']);
        setSelectedStatus(option);
    };

    const handleSearch = (value) => {
        setSearchCodeHD('');
        setSearchSDT('');
        setStaffCode('');
        setStaffFilter('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
        setInputSearch(value);
        const movieCode = optionMovie.find((item) => item.name === value);
        setMovieCodeFilter(movieCode?.code);
    };
    const handleStaff = (value) => {
        setInputSearch('');
        setMovieCodeFilter('');
        setSearchCodeHD('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setSearchSDT('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
        setStaffFilter(value);
        const staffCode = optionStaff.find((item) => item.name === value);
        setStaffCode(staffCode?.code);
    };
    const handleSearchSDT = (value) => {
        setStaffCode('');
        setStaffFilter('');
        setInputSearch('');
        setMovieCodeFilter('');
        setSearchCodeHD('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setRangePickerValue(['', '']);
        setSelectedStatus(optionStatus[0]);
        setSearchSDT(value);
    };

    const handleSearchCodeHD = (value) => {
        setStaffCode('');
        setStaffFilter('');
        setInputSearch('');
        setSearchSDT('');
        setMovieCodeFilter('');
        setSelectOptionCinemaCode('');
        setSelectedOptionFilterCinema('');
        setRangePickerValue(['', '']);
        setSelectedStatus(optionStatus[0]);
        setSearchCodeHD(value);
    };

    const handleEnterPress = (newValue) => {
        handleSearchSDT(newValue);
    };
    const handleEnterPress1 = (newValue) => {
        handleSearchCodeHD(newValue);
    };

    const handleOptionCinemas = (value) => {
        setStaffCode('');
        setStaffFilter('');
        setInputSearch('');
        setMovieCodeFilter('');
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
        setSelectedOptionFilterCinema(value);
        const cinemaCode = optionNameCinema.find((item) => item.name === value);
        setSelectOptionCinemaCode(cinemaCode?.code);
    };
    useEffect(() => {
        setPage(1);
    }, [
        staffFilter,
        inputSearch,
        movieCodeFilter,
        searchSDT,
        searchCodeHD,
        selectOptionCinemaCode,
        selectedStatus,
        rangePickerValue,
    ]);

    const calculateTotal = (details) => {
        return details?.reduce((acc, item) => acc + item.totalAmount, 0);
    };
    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const groupByProductName = (details) => {
        if (!Array.isArray(details)) {
            return {};
        }

        return details.reduce((acc, item) => {
            const productName = item.productCode?.name;
            if (!acc[productName]) {
                acc[productName] = [];
            }
            acc[productName].push(item);
            return acc;
        }, {});
    };

    const groupedDetails = groupByProductName(selectedInvoice?.details || {});

    const groupByProductType = (details) => {
        if (!Array.isArray(details)) {
            return { seat: [], food: [] };
        }

        const result = details.reduce(
            (acc, item) => {
                const productType = item.productCode?.type;

                if (productType === 0) {
                    // Thêm sản phẩm loại ghế vào mảng type0
                    acc.seat.push(item);
                } else if (productType !== 0) {
                    // Thêm sản phẩm loại nước ngọt vào mảng type1
                    acc.food.push(item);
                }

                return acc;
            },
            { seat: [], food: [] }, // Khởi tạo đối tượng với 2 mảng trống
        );

        return result;
    };

    const groupedDetailsByType = groupByProductType(selectedInvoice?.details || {});

    const salesInvoiceTicketPrint = groupedDetailsByType?.seat?.map((seat) => ({
        cinemaName: selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.name,
        cinemaAddress: addressCinema,
        createdAt: FormatSchedule(selectedInvoice?.createdAt),
        staffName: selectedInvoice?.staffCode === null ? 'App' : selectedInvoice?.staffCode.name,
        movieName: selectedInvoice?.scheduleCode?.movieCode?.name,
        ageRestriction: handleChangAge(selectedInvoice?.scheduleCode?.movieCode?.ageRestriction),
        date: getFormatteNgay(selectedInvoice?.scheduleCode?.date),
        startTime: getFormattedDateTime(selectedInvoice?.scheduleCode?.startTime),
        endTime: getFormattedDateTime(selectedInvoice?.scheduleCode?.endTime),
        roomName: selectedInvoice?.scheduleCode?.roomCode?.name,
        seatNumber: seat.productCode.seatNumber,
        seatName: seat.productCode.name,
        price: seat.totalAmount.toLocaleString(),
    }));

    const salesInvoiceFoodPrint = {
        cinemaName: selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.name,
        cinemaAddress: addressCinema,
        createdAt: FormatSchedule(selectedInvoice?.createdAt),
        staffName: selectedInvoice?.staffCode === null ? 'Tại quầy' : selectedInvoice?.staffCode.name,
    };

    const freeProductPrint = {
        productName: promotionResult?.freeProductCode?.name,
        price: 0,
        quantity: promotionResult?.freeQuantity,
        totalPrice: 0,
    };

    const foodPrint = groupedDetailsByType?.food?.map((food) => ({
        productName: food?.productCode?.name,
        price: food.totalAmount / food.quantity,
        quantity: food.quantity,
        totalPrice: food.totalAmount,
    }));

    const combinedPrint = [freeProductPrint, ...foodPrint].filter((item) => item.quantity > 0);

    const calculateTotalPriceForCombos = (foodItems = []) => {
        return foodItems.reduce((total, item) => total + (item?.totalPrice || 0), 0);
    };

    const totalPriceCombo = useMemo(() => calculateTotalPriceForCombos(foodPrint || []), [foodPrint]);

    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data];
        const item = reversedData[index];

        return (
            <div
                className="border-b  text-[15px] font-normal gap-2 text-slate-500 grid grid-cols-8 items-center px-2"
                key={item?.code}
                style={style}
            >
                <div className="grid grid-cols-3 ">
                    <h1 className="grid pl-[10px] items-center ">{index + 1}</h1>
                    <h1 className="grid justify-center items-center col-span-2 pl-1 ">{item?.code}</h1>
                </div>
                <h1 className="grid items-center pl-[5px]">
                    {item?.staffCode === null ? 'App' : item?.staffCode?.name}
                </h1>
                <h1 className="grid items-center pl-[5px] ">
                    {' '}
                    {item?.customerCode === null ? 'Tại quầy' : item?.customerCode?.name}
                </h1>
                <h1 className="grid items-center ">{item?.scheduleCode?.roomCode?.cinemaCode?.name}</h1>
                <h1 className="grid items-center uppercase">
                    {item?.scheduleCode?.movieCode?.name.length > 45
                        ? item?.scheduleCode.movieCode?.name.slice(0, 45) + '...'
                        : item?.scheduleCode.movieCode?.name}
                </h1>

                <div className=" grid grid-cols-12 col-span-3 gap-4 ml-2 ">
                    <h1 className="flex items-center justify-center  col-span-4">{FormatSchedule(item?.createdAt)}</h1>

                    <h1 className="grid justify-center col-span-3 items-center  ">
                        {formatCurrency(calculateTotal(item?.details) - item?.discountAmount)}
                    </h1>
                    <div className="grid col-span-4  justify-center items-center    cursor-default">
                        <h1
                            className={`px-2 py-2 rounded-[40px]    justify-center items-center text-white uppercase text-sm 
                         ${item?.status === 1 ? 'bg-green-500' : 'bg-gray-400'} `}
                        >
                            {item?.status === 1 ? 'Đã thanh toán' : 'Đã hoàn trả'}
                        </h1>
                    </div>
                    <div className="grid grid-rows-1  gap-2">
                        <button
                            className=" "
                            onClick={() => {
                                handleOpenDelete();
                                setSelectedInvoice(item);
                            }}
                            disabled={item?.status === 0 ? true : false}
                        >
                            <RiRefund2Fill color={`${item?.status === 0 ? 'gray' : 'black'}`} size={22} />
                        </button>
                        <button
                            className=""
                            onClick={() => {
                                handleOpen();
                                setSelectedInvoice(item);
                            }}
                        >
                            <FaRegEye color="black" fontSize={22} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (
        isLoading ||
        isLoadingMovies ||
        isLoadingCinemas ||
        isLoadingStaff ||
        isLoadingPromotionResult ||
        isLoadingAddressCinema ||
        loading
    )
        return <Loading />;
    if (!isFetched || !isFetchedMovies || !isFetchedCinemas || !isFetchedStaff) return <div>Fetching...</div>;
    if (isError || isErrorMovies || CinemaError || isErrorStaff || errorPromotionResult || errorAddressCinema)
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    isErrorMovies.message ||
                    CinemaError.message ||
                    isErrorStaff.message ||
                    errorPromotionResult.message ||
                    errorAddressCinema.message}
            </div>
        );
    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[195px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Hóa đơn bán</h1>

                <div className="min-w-[900px]">
                    <div className="grid grid-cols-4  gap-10 mb-2 items-center w-full h-16 px-3">
                        <AutoInputComponent
                            value={searchCodeHD}
                            onChange={(newValue) => handleSearchCodeHD(newValue)}
                            title="Mã hóa đơn bán"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            borderRadius="10px"
                            className1="col-span-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleEnterPress1(e.target.value);
                                }
                            }}
                        />
                        <div className="col-span-3 grid grid-cols-7 gap-10">
                            <AutoInputComponent
                                options={optionMovie.map((item) => item.name.toUpperCase())}
                                value={inputSearch}
                                onChange={(newValue) => handleSearch(newValue)}
                                title="Tên phim"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập"
                                heightSelect={200}
                                borderRadius="10px"
                                className1="col-span-3"
                            />

                            <div className="col-span-4">
                                <h1 className="text-[16px] truncate mb-1">Ngày lập</h1>
                                <RangePicker
                                    value={rangePickerValue}
                                    onChange={onChangeRanger}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    placement="bottomRight"
                                    format={'DD-MM-YYYY'}
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-10 items-center w-full h-16 px-3">
                        <AutoInputComponent
                            options={optionStaff.map((item) => item.name)}
                            value={staffFilter}
                            onChange={(newValue) => handleStaff(newValue)}
                            title="Nhân viên lập"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập"
                            heightSelect={200}
                            borderRadius="10px"
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
                        />
                        <AutoInputComponent
                            value={searchSDT}
                            onChange={(newValue) => handleSearchSDT(newValue)}
                            title="SĐT khách hàng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            borderRadius="10px"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleEnterPress(e.target.value);
                                }
                            }}
                        />
                        <div className="relative w-full ">
                            <AutoInputComponent
                                value={selectedStatus.name}
                                onChange={(newValue) => sortedStatus(newValue)}
                                options={optionStatus}
                                title="Trạng thái"
                                freeSolo={true}
                                disableClearable={true}
                                heightSelect={200}
                                borderRadius="10px"
                                onBlur={(event) => {
                                    event.preventDefault();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white border shadow-md rounded-[10px] box-border  py-2 h-[420px] custom-height-xs2 max-h-screen custom-height-sm26 custom-height-md6 custom-height-lg5 custom-height-xl4 custom-hubmax4">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b py-2 gap-2 text-xs uppercase font-bold text-slate-500 grid grid-cols-8 items-center min-w-[1200px] pr-2">
                        <div className="grid grid-cols-3">
                            <h1 className="grid justify-center items-center ">STT</h1>
                            <h1 className="grid justify-center items-center col-span-2  ">Mã HĐ bán</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Nhân viên lập</h1>
                        <h1 className="grid col-span-1 justify-center items-center">Khách hàng</h1>
                        <h1 className="grid justify-center items-center">Rạp</h1>
                        <h1 className="grid justify-center items-center">Tên phim</h1>

                        <div className=" grid col-span-3 grid-cols-12 gap-4 ">
                            <h1 className="grid justify-center items-center col-span-4">Ngày lập</h1>
                            <h1 className="grid justify-start items-center col-span-4 ">Tổng thanh toán</h1>
                            <h1 className="grid justify-start items-center col-span-3">Trạng thái</h1>
                            <h1 className="grid justify-center items-center ">{''}</h1>
                        </div>
                    </div>

                    <div className="py-1 min-w-[1200px]">
                        <List
                            itemCount={invoices?.length}
                            itemSize={80}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) => rowRenderer({ index, style }, invoices)}
                        </List>
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
                        {[
                            Math.max(1, page - 2),
                            Math.max(1, page - 1),
                            page,
                            Math.min(totalPages, page + 1),
                            Math.min(totalPages, page + 2),
                        ]
                            .filter((pageNumber, index, self) => self.indexOf(pageNumber) === index)
                            .map((pageNumber) => (
                                <span
                                    key={pageNumber}
                                    className={`page-number text-[13px] mx-1 cursor-pointer px-2 py-1 rounded ${
                                        page === pageNumber
                                            ? 'font-bold border-2 border-blue-500 bg-blue-500 text-white'
                                            : 'border bg-white hover:bg-gray-400'
                                    }`}
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

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="60%"
                height="80%"
                smallScreenWidth="80%"
                smallScreenHeight="80%"
                mediumScreenWidth="80%"
                mediumScreenHeight="50%"
                largeScreenHeight="45%"
                largeScreenWidth="70%"
                maxHeightScreenHeight="92%"
                maxHeightScreenWidth="70%"
                heightScreen="75%"
                title="Chi tiết hóa đơn bán"
            >
                <div className="h-90p grid grid-rows-12 gap-2  px-2">
                    <div className="grid row-span-4 pb-2  grid-cols-12">
                        <div className="grid col-span-11 ">
                            <div className="grid text-[15px] items-center px-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid  grid-cols-2 gap-2">
                                        <h1 className=" font-bold">Mã hóa đơn bán:</h1>
                                        <h1 className=" font-normal">{selectedInvoice?.code}</h1>
                                    </div>
                                    <div className="grid grid-cols-8 gap-2">
                                        <h1 className="font-bold  col-span-3 ">Ngày lập</h1>
                                        <h1 className="grid col-span-5 font-normal  items-center">
                                            {FormatSchedule(selectedInvoice?.createdAt)}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="grid text-[15px] items-center px-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <h1 className="font-bold">Nhân viên lập:</h1>
                                        <h1 className="font-normal">
                                            {selectedInvoice?.staffCode === null
                                                ? 'App'
                                                : selectedInvoice?.staffCode?.name}
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-8 gap-2">
                                        <h1 className="font-bold  col-span-3 ">Khách hàng:</h1>
                                        <h1 className="grid col-span-5 font-normal  items-center">
                                            {' '}
                                            {selectedInvoice?.customerCode === null
                                                ? 'Tại quầy'
                                                : selectedInvoice?.customerCode.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="grid text-[15px] items-center px-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <h1 className="font-bold">Rạp:</h1>
                                        <h1 className="font-normal">
                                            {selectedInvoice?.scheduleCode?.roomCode?.cinemaCode?.name}
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-8 gap-2">
                                        <h1 className="font-bold  col-span-3 ">Tên phim:</h1>
                                        <h1 className="grid col-span-5 font-normal  items-center">
                                            {selectedInvoice?.scheduleCode?.movieCode?.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            <div className="grid text-[15px] items-center px-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <h1 className="font-bold">Phòng:</h1>
                                        <h1 className="font-normal">{selectedInvoice?.scheduleCode?.roomCode?.name}</h1>
                                    </div>
                                    <div className="grid grid-cols-8 gap-2">
                                        <h1 className="font-bold  col-span-3 ">Suất chiếu:</h1>
                                        <h1 className="grid col-span-5 font-normal  items-center">
                                            {FormatSchedule(selectedInvoice?.scheduleCode?.startTime)}
                                            {' - '}
                                            {selectedInvoice?.scheduleCode?.screeningFormatCode.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="grid text-[15px] items-center px-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <h1 className="font-bold">Phương thức thanh toán:</h1>
                                        <h1 className="font-normal items-center">
                                            {selectedInvoice?.paymentMethod === 0 ? 'Tiền mặt' : 'ZaloPay'}
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-8 gap-2">
                                        <h1 className="font-bold  col-span-3 ">Mã CT khuyến mãi:</h1>
                                        <h1 className="grid col-span-5 font-normal  items-center">
                                            {promotionResult?.code || 'Không áp dụng'}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" items-center   flex   ">
                            <div
                                className={`grid  font-semibold text-xl uppercase justify-center items-center grid-rows-2
                                ${
                                    selectedInvoice?.status !== 1 ? 'pointer-events-none opacity-50' : ' cursor-pointer'
                                }`}
                                onClick={handleOpenPrint}
                            >
                                <span className="flex justify-center items-center">In vé</span>
                                <div className=" flex justify-center items-center h-full">
                                    <IoIosPrint color="black" size={35} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid row-span-5 ">
                        <div className="grid items-center border-b py-1 ">
                            <div className="grid grid-cols-6 gap-2 text-sm  uppercase font-bold text-slate-700  px-3">
                                <h1 className="  grid justify-center items-center col-span-2 ">Tên sản phẩm</h1>
                                <h1 className=" grid justify-center items-center ">Mô tả</h1>
                                <h1 className=" grid justify-center items-center ">Số lượng</h1>
                                <h1 className=" justify-center grid items-center ">Đơn giá</h1>
                                <h1 className=" justify-end grid items-center ">Thành tiền</h1>
                            </div>
                        </div>
                        <div className="h-[100%] overflow-auto ">
                            {promotionResult?.freeProductCode?.name && (
                                <div className="grid grid-cols-6 gap-2 text-[15px] border-b mb-2 font-normal py-2 px-3">
                                    <h1 className="grid items-center col-span-2 grid-rows-1 ">
                                        <span>
                                            {promotionResult?.freeProductCode?.name}{' '}
                                            <span className="text-red-500">(Quà tặng)</span>
                                        </span>
                                    </h1>

                                    <h1 className="grid items-center">
                                        {promotionResult?.freeProductCode?.description}
                                    </h1>
                                    <h1 className="grid justify-center items-center">
                                        {promotionResult?.freeQuantity}
                                    </h1>
                                    <h1 className="justify-center grid items-center">0đ</h1>
                                    <h1 className="justify-end grid items-center">0đ</h1>
                                </div>
                            )}

                            {Object.entries(groupedDetails).map(([productName, items]) => {
                                const firstItem = items[0];

                                const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
                                const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

                                return (
                                    <div
                                        key={firstItem.code}
                                        className="grid grid-cols-6 gap-2 text-[15px] border-b mb-2 font-normal py-2 px-3"
                                    >
                                        <h1 className="grid items-center col-span-2">{productName}</h1>
                                        <h1 className="grid items-center">
                                            {items.map((item) => item.productCode?.seatNumber).join(', ')}
                                            {items.map((item) => item.productCode?.description)}
                                        </h1>
                                        <h1 className="grid justify-center items-center">{totalQuantity}</h1>
                                        <h1 className="justify-center grid items-center">
                                            {formatCurrency(totalAmount / totalQuantity)}
                                        </h1>
                                        <h1 className="justify-end grid items-center">{formatCurrency(totalAmount)}</h1>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className=" grid grid-rows-10  row-span-3  mt-1  border-t   px-2 pt-1">
                        <div className="grid row-span-7 ">
                            <div className="grid grid-cols-2 gap-5 text-base">
                                <span className="grid   uppercase font-bold text-slate-700">Tổng tiền:</span>
                                <span className="grid justify-end ">
                                    {' '}
                                    {formatCurrency(calculateTotal(selectedInvoice?.details))}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-base">
                                <span className="grid  uppercase font-bold text-slate-700">Giảm giá:</span>
                                <span className="grid justify-end ">
                                    {formatCurrency(
                                        calculateTotal(selectedInvoice?.details) -
                                            (promotionResult?.discountAmount || 0) -
                                            calculateTotal(selectedInvoice?.details),
                                    ) || formatCurrency(0)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-base">
                                <span className="grid  uppercase font-bold text-slate-700">Tổng thanh toán:</span>
                                <span className="grid justify-end ">
                                    {formatCurrency(
                                        calculateTotal(selectedInvoice?.details) -
                                            (promotionResult?.discountAmount || 0),
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="grid   justify-end row-span-3 py-3 border-t">
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleClose} />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDelete}
                handleClose={handleCloseDelete}
                width="30%"
                height="35%"
                smallScreenWidth="40%"
                smallScreenHeight="25%"
                mediumScreenWidth="40%"
                mediumScreenHeight="20%"
                largeScreenHeight="20%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="40%"
                maxHeightScreenWidth="40%"
                title="Trả hóa đơn"
            >
                <div className="h-[80%] grid grid-rows-4 ">
                    <div className="row-span-3 grid-rows-5 grid ">
                        <h1 className="grid row-span-1 px-3 py-2">Vui lòng nhập lý do trả hóa đơn bên dưới:</h1>
                        <div className="px-3 row-span-4 mt-3">
                            <textarea
                                className="border py-[6px] px-3 border-[gray] rounded-[5px] h-[90%] w-full resize-none overflow-auto"
                                placeholder="Nhập ..."
                                defaultValue={descriptionRef.current}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xác nhận"
                                className="bg-blue-500"
                                onClick={() => {
                                    mutation.mutate();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openPrint}
                handleClose={handleClosePrint}
                width="30%"
                height="auto"
                smallScreenWidth="45%"
                smallScreenHeight="33%"
                mediumScreenWidth="45%"
                mediumScreenHeight="30%"
                largeScreenHeight="25%"
                largeScreenWidth="45%"
                maxHeightScreenHeight="55%"
                maxHeightScreenWidth="45%"
                title="Thanh toán"
            >
                <div className=" grid   h-[600px]">
                    {/* Danh sách vé */}
                    <div className="overflow-y-auto  px-4 ">
                        {salesInvoiceTicketPrint?.map((ticket, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2  pb-5"
                            >
                                {/* Tiêu đề vé */}
                                <p className="text-center font-bold text-2xl pb-5">Vé Xem Phim</p>

                                {/* Thông tin rạp */}

                                <p className="text-left font-semibold">{ticket.cinemaName}</p>
                                <p className="text-left font-normal ">{ticket.cinemaAddress}</p>
                                <p className="text-left font-normal">{ticket.createdAt}</p>
                                <p className="text-left font-normal">Staff: {ticket.staffName}</p>

                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                {/* Thông tin phim */}
                                <p className="font-bold text-xl">
                                    {ticket.movieName}
                                    <span className="text-xl ml-2">[{ticket.ageRestriction}]</span>
                                </p>
                                <div className=" flex justify-between ">
                                    <span className>{ticket.date}</span>
                                    <span className>
                                        {ticket.startTime} - {ticket.endTime}
                                    </span>
                                </div>

                                <div className="flex justify-between font-semibold text-xl">
                                    <span>{ticket.roomName}</span>
                                    <span>{ticket.seatNumber}</span>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>

                                {/* Thông tin ghế và giá */}
                                <div className="flex justify-between items-center font-semibold">
                                    <span>{ticket.seatName}</span>
                                    <span> VND</span>
                                    <span>{ticket.price}</span>
                                </div>
                                <p className="text-right">(bao gồm 5% VAT)</p>

                                {/* Mã vạch */}

                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex justify-center">
                                    <Barcode
                                        value={selectedInvoice?.code}
                                        width={1.5}
                                        height={50}
                                        format="CODE128"
                                        displayValue={true}
                                        textAlign="center"
                                        textPosition="top"
                                        textMargin={10}
                                        fontSize={16}
                                        background="transparent "
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Danh sách bắp nước */}
                        {foodPrint?.length > 0 && (
                            <div className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2 pb-5 ">
                                {/* Tiêu đề vé */}
                                <p className="text-center font-bold text-2xl pb-5">Đồ Ăn & Nước</p>
                                {/* Thông tin rạp */}
                                <p className="text-left font-semibold">{salesInvoiceFoodPrint.cinemaName}</p>
                                <p className="text-left font-normal ">{salesInvoiceFoodPrint.cinemaAddress}</p>
                                <p className="text-left font-normal">{salesInvoiceFoodPrint.date}</p>
                                <p className="text-left font-normal">Staff: {salesInvoiceFoodPrint.staffName}</p>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                {/* Thông tin food header */}
                                <div className="grid grid-cols-8 gap-4  ">
                                    <span className="col-span-3 font-semibold whitespace-normal">Tên</span>
                                    <span className="col-span-2 font-semibold whitespace-normal">Giá</span>
                                    <span className="col-span-1 font-semibold whitespace-normal">SL</span>
                                    <span className="col-span-2 font-semibold whitespace-normal text-right">
                                        Thành tiền
                                    </span>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                {/* Thông tin food detail */}
                                {combinedPrint.map((food, index) => (
                                    <div key={index} className="grid grid-cols-8 gap-4 ">
                                        <span className="col-span-3 font-normal whitespace-normal">
                                            {food.productName} {food.price === 0 ? '(Quà tặng)' : ''}
                                        </span>
                                        <span className="col-span-2 font-normal whitespace-normal  ">
                                            {(food.price ?? '(Quà tặng)').toLocaleString()}
                                            {/* Hiển thị giá, nếu undefined thì gán giá trị 0 */}
                                        </span>
                                        <span className="col-span-1 font-normal whitespace-normal">
                                            {food.quantity ?? 0}{' '}
                                            {/* Hiển thị số lượng, nếu undefined thì gán giá trị 0 */}
                                        </span>
                                        <span className="col-span-2 font-normal whitespace-normal text-right">
                                            {(food.totalPrice ?? 0).toLocaleString()}
                                            {/* Hiển thị tổng giá, nếu undefined thì gán giá trị 0 */}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                {/* Thông tin ghế và giá */}
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Tổng tiền</span>
                                    <span> VND</span>
                                    <span>{totalPriceCombo.toLocaleString()} </span>
                                </div>
                                <p className="text-right">(bao gồm 10% VAT)</p>
                                {/* Mã vạch */}
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <div className="flex justify-center ">
                                    <Barcode
                                        value={selectedInvoice?.code}
                                        width={1.5}
                                        height={50}
                                        format="CODE128"
                                        displayValue={true}
                                        textAlign="center"
                                        textPosition="top"
                                        textMargin={10}
                                        fontSize={16}
                                        background="transparent "
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end space-x-3 border-t  mx-2  p-3">
                        <ButtonComponent text="Hủy" className="bg-gray-400" onClick={handleClosePrint} />
                        <ButtonComponent text="In Vé" className="bg-blue-500 text-white" onClick={handlePrint} />
                    </div>
                </div>

                {/* Phần in ẩn */}
                <div className="hidden print:block" ref={printRef}>
                    {salesInvoiceTicketPrint?.map((ticket, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2 pb-5"
                        >
                            {/* Tiêu đề vé */}
                            <p className="text-center font-bold text-2xl pb-5">Vé Xem Phim</p>

                            {/* Thông tin rạp */}

                            <p className="text-left font-semibold">{ticket.cinemaName}</p>
                            <p className="text-left font-normal ">{ticket.cinemaAddress}</p>
                            <p className="text-left font-normal">{ticket.createdAt}</p>
                            <p className="text-left font-normal">Staff: {ticket.staffName}</p>

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            {/* Thông tin phim */}
                            <p className="font-bold text-xl">
                                {ticket.movieName}
                                <span className="text-xl ml-2">[{ticket.ageRestriction}]</span>
                            </p>
                            <div className=" flex justify-between ">
                                <span className>{ticket.date}</span>
                                <span className>
                                    {ticket.startTime} - {ticket.endTime}
                                </span>
                            </div>

                            <div className="flex justify-between font-semibold text-xl">
                                <span>{ticket.roomName}</span>
                                <span>{ticket.seatNumber}</span>
                            </div>
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>

                            {/* Thông tin ghế và giá */}
                            <div className="flex justify-between items-center font-semibold">
                                <span>{ticket.seatName}</span>
                                <span> VND</span>
                                <span>{ticket.price}</span>
                            </div>
                            <p className="text-right">(bao gồm 5% VAT)</p>

                            {/* Mã vạch */}

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex justify-center ">
                                <Barcode
                                    value={selectedInvoice?.code}
                                    width={1.5}
                                    height={50}
                                    format="CODE128"
                                    displayValue={true}
                                    textAlign="center"
                                    textPosition="top"
                                    textMargin={10}
                                    fontSize={16}
                                    background="transparent "
                                />
                            </div>
                        </div>
                    ))}
                    {/* Danh sách bắp nước */}
                    {foodPrint?.length > 0 && (
                        <div className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2 ">
                            {/* Tiêu đề vé */}
                            <p className="text-center font-bold text-2xl pb-5">Bắp Nước</p>

                            {/* Thông tin rạp */}

                            <p className="text-left font-semibold">{salesInvoiceFoodPrint.cinemaName}</p>
                            <p className="text-left font-normal ">{salesInvoiceFoodPrint.cinemaAddress}</p>
                            <p className="text-left font-normal">{salesInvoiceFoodPrint.date}</p>
                            <p className="text-left font-normal">Staff: {salesInvoiceFoodPrint.staffName}</p>

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            {/* Thông tin food header */}

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            {/* Thông tin food detail */}
                            {foodPrint.map((food, index) => (
                                <div key={index} className="grid grid-cols-8 gap-4 ">
                                    <span className="col-span-3 font-normal whitespace-normal">{food.productName}</span>
                                    <span className="col-span-2 font-normal whitespace-normal">
                                        {food.price.toLocaleString()}
                                    </span>
                                    <span className="col-span-1 font-normal whitespace-normal">{food.quantity}</span>
                                    <span className="col-span-2 font-normal whitespace-normal text-right">
                                        {food.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            ))}

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>

                            {/* Thông tin ghế và giá */}
                            <div className="flex justify-between items-center font-semibold">
                                <span>Tổng tiền</span>
                                <span> VND</span>
                                <span>{totalPriceCombo.toLocaleString()} </span>
                            </div>
                            <p className="text-right">(bao gồm 10% VAT)</p>

                            {/* Mã vạch */}

                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <div className="flex justify-center ">
                                <Barcode
                                    value={selectedInvoice?.code}
                                    width={1.5}
                                    height={50}
                                    format="CODE128"
                                    displayValue={true}
                                    textAlign="center"
                                    textPosition="top"
                                    textMargin={10}
                                    fontSize={16}
                                    background="transparent "
                                />
                            </div>
                        </div>
                    )}
                </div>
            </ModalComponent>
        </div>
    );
};

export default SaleInvoice;
