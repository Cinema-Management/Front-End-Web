import React, { useMemo, useRef, useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';

import { IoIosPrint } from 'react-icons/io';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiRefund2Fill } from 'react-icons/ri';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { DatePicker } from 'antd';
import { FormatDate, FormatSchedule, getFormattedDateTime, getFormatteNgay, handleChangAge } from '~/utils/dateUtils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightInVoiceComponent from '~/components/HeightComponent/HeightInVoiceComponent';
import { useSelector } from 'react-redux';
import Barcode from 'react-barcode';
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
    const [invoiceFilter, setInvoiceFilter] = useState([]);
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [searchCodeHD, setSearchCodeHD] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const height = HeightInVoiceComponent();
    const queryClient = useQueryClient();
    const optionStatus = [
        { value: 3, name: 'Tất cả' },
        { value: 1, name: 'Đã thanh toán' },
        { value: 2, name: 'Đã trả' },
    ];
    const [openPrint, setOpenPrint] = useState(false);

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
    const fetchSaleInvoice = async () => {
        try {
            const response = await axios.get('api/sales-invoices');
            const data = response.data;

            return { invoices: data };
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

    const {
        data: { invoices = [] } = {},
        isLoading,
        isFetched,
        isError,
        refetch: refetchInvoice,
    } = useQuery('fetchSaleInvoice', fetchSaleInvoice, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        // onSuccess: (data) => {
        //     setFoodFilter(data.product);
        // },
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
        staleTime: 1000 * 60 * 7, // Thời gian dữ liệu được xem là "cũ"
        cacheTime: 1000 * 60 * 10, // Thời gian dữ liệu được lưu trong bộ nhớ cache
        refetchInterval: 1000 * 60 * 7, // Tần suất làm mới dữ liệu
        enabled: !!selectedInvoice?.code, // Chỉ thực hiện truy vấn khi có mã hóa đơn
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

    const handleReturnInvoice = async () => {
        if (!descriptionRef.current || descriptionRef.current.trim() === '') {
            toast.error('Vui lòng nhập lý do trả hóa đơn!');
            return;
        }

        try {
            await axios.post('api/return-invoices', {
                staffCode: user.code,
                customerCode: selectedInvoice.customerCode?.code,
                scheduleCode: selectedInvoice.scheduleCode?.code,
                paymentMethod: 0,
                type: 0,
                salesInvoiceCode: selectedInvoice.code,
                returnReason: descriptionRef.current,
            });

            toast.success('Trả hóa đơn thành công!');
            refetchInvoice();
            descriptionRef.current = '';
            handleCloseDelete();
        } catch (error) {
            console.log('error', error);
            toast.error('Trả hóa đơn thất bại!');
        }
    };

    const mutation = useMutation(handleReturnInvoice, {
        onSuccess: () => {
            queryClient.refetchQueries('fetchReturnInvoice');
        },
    });

    const onChangeRanger = (dates) => {
        if (!Array.isArray(dates) || dates.length !== 2) {
            setInvoiceFilter(invoices);
            return;
        }
        setRangePickerValue(dates);

        const startDateFormatted = FormatDate(dates[0]);
        const endDateFormatted = FormatDate(dates[1]);

        const filterDate = invoices.filter((item) => {
            const itemDate = FormatDate(new Date(item.createdAt));
            console.log(itemDate);
            return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
        });

        if (filterDate.length === 0) {
            toast.info('Không tìm thấy phim nào!');
            setInvoiceFilter(invoices);
            setInputSearch('');
            setSelectedStatus(optionStatus[0]);
            setSearchSDT('');
            setSearchCodeHD('');
            setSelectedOptionFilterCinema('');
            setStaffFilter('');
            return;
        }

        setInvoiceFilter(filterDate);
        setInputSearch('');
        setSelectedStatus(optionStatus[0]);
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setStaffFilter('');
    };

    const sortedStatus = (option) => {
        if (!option) {
            setInvoiceFilter(invoices);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 1) {
            sortedStatus = invoices.filter((item) => item.status === 1);
            setInvoiceFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = invoices.filter((item) => item.status === 0);
            setInvoiceFilter(sortedStatus);
        } else if (option.value === 3) {
            sortedStatus = invoices;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        }
        setInvoiceFilter(sortedStatus);
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setInputSearch('');
        setStaffFilter('');
        setRangePickerValue(['', '']);
    };

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);

            return;
        }
        const search = invoices.filter((item) =>
            item.scheduleCode.movieCode.name.toLowerCase().includes(value.toLowerCase()),
        );

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setInvoiceFilter(search);
        }
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setSelectedStatus(optionStatus[0]);
        setStaffFilter('');
        setRangePickerValue(['', '']);
    };
    const handleStaff = (value) => {
        setStaffFilter(value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);
            return;
        }
        const search = invoices.filter((item) => item.staffCode.name === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setInvoiceFilter(search);
        }
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setInputSearch('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
    };

    const handleSearchSDT = (value) => {
        setSearchSDT(value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);

            return;
        }
        const search = invoices.filter((item) => item.customerCode?.phone === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào!');
        } else {
            setInvoiceFilter(search);
        }
        setStaffFilter('');
        setInputSearch('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setRangePickerValue(['', '']);
        setSelectedStatus(optionStatus[0]);
    };

    const handleSearchCodeHD = (value) => {
        setSearchCodeHD(value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);
            return;
        }
        const search = invoices.filter((item) => item.code === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setInvoiceFilter(search);
        }
        setStaffFilter('');
        setInputSearch('');
        setSearchSDT('');
        setSelectedOptionFilterCinema('');
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
    };

    const handleEnterPress = (newValue) => {
        handleSearchSDT(newValue);
    };
    const handleEnterPress1 = (newValue) => {
        handleSearchCodeHD(newValue);
    };

    const handleOptionCinemas = (value) => {
        setSelectedOptionFilterCinema(value);
        const cinemaCode = optionNameCinema.find((item) => item.name === value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);
            return;
        }
        const fillter = invoices.filter((item) => item.scheduleCode.roomCode.cinemaCode.code === cinemaCode.code);

        if (fillter.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setInvoiceFilter(fillter);
        }
        setStaffFilter('');
        setInputSearch('');
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedStatus(optionStatus[0]);
    };

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
            const productName = item.productCode.name;
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
                const productType = item.productCode.type;

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
        const reversedData = [...data].reverse();
        const item = reversedData[index];

        return (
            <div
                className="border-b  text-[15px] font-normal gap-2 text-slate-500 grid grid-cols-8 items-center px-2"
                key={item.code}
                style={style}
            >
                <div className="grid grid-cols-3 ">
                    <h1 className="grid pl-[10px] items-center ">{index + 1}</h1>
                    <h1 className="grid justify-center items-center col-span-2 pl-1 ">{item.code}</h1>
                </div>
                <h1 className="grid items-center pl-[5px]">{item.staffCode === null ? 'App' : item.staffCode.name}</h1>
                <h1 className="grid items-center pl-[5px] ">
                    {' '}
                    {item.customerCode === null ? 'Tại quầy' : item.customerCode.name}
                </h1>
                <h1 className="grid items-center ">{item.scheduleCode?.roomCode?.cinemaCode?.name}</h1>
                <h1 className="grid items-center uppercase">
                    {item.scheduleCode?.movieCode?.name.length > 50
                        ? item.scheduleCode.movieCode.name.slice(0, 50) + '...'
                        : item.scheduleCode.movieCode.name}
                </h1>

                <div className=" grid grid-cols-12 col-span-3 gap-4 ml-2 ">
                    <h1 className="flex items-center justify-center  col-span-4">{FormatSchedule(item.createdAt)}</h1>

                    <h1 className="grid justify-center col-span-3 items-center  ">
                        {formatCurrency(calculateTotal(item.details) - item.discountAmount)}
                    </h1>
                    <div className="grid col-span-4  justify-center items-center    cursor-default">
                        <h1
                            className={`px-2 py-2 rounded-[40px]    justify-center items-center text-white uppercase text-sm 
                         ${item.status === 1 ? 'bg-green-500' : 'bg-gray-400'} `}
                        >
                            {item.status === 1 ? 'Đã thanh toán' : 'Đã hoàn trả'}
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
                            <RiRefund2Fill color={`${item.status === 0 ? 'gray' : 'black'}`} size={22} />
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
        isLoadingAddressCinema
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
                            title="Số điện thoại"
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
            <div className="bg-white border shadow-md rounded-[10px] box-border  py-2 h-[455px] custom-height-xs2 max-h-screen custom-height-sm25 custom-height-md5 custom-height-lg4 custom-height-xl3 custom-hubmax3">
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
                            itemCount={invoiceFilter.length === 0 ? invoices?.length : invoiceFilter.length}
                            itemSize={80}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, invoiceFilter.length === 0 ? invoices : invoiceFilter)
                            }
                        </List>
                    </div>
                </div>
            </div>

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
                                                : selectedInvoice?.staffCode.name}
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
                                            {items.map((item) => item.productCode.seatNumber).join(', ')}
                                            {items.map((item) => item.productCode.description)}
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
                        <ButtonComponent text="In Vé" className="bg-blue-500 text-white" onClick={handleClosePrint} />
                    </div>
                </div>

                {/* Phần in ẩn */}
                <div className="hidden print:block">
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
