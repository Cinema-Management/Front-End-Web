import React, { useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { DatePicker } from 'antd';
import { FormatDate, FormatSchedule } from '~/utils/dateUtils';
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightReturnInVoiceComponent from '~/components/HeightComponent/HeightReturnInVoiceComponent';

const SaleInvoice = () => {
    const [open, setOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceFilter, setInvoiceFilter] = useState([]);
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [searchCodeHD, setSearchCodeHD] = useState('');
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);

    const height = HeightReturnInVoiceComponent();

    const handleOpen = () => {
        setOpen(true);
    };
    const { RangePicker } = DatePicker;
    const handleClose = () => setOpen(false);

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
    const fetchReturnInvoice = async () => {
        try {
            const response = await axios.get('api/return-invoices');
            const data = response.data;

            return { invoices: data };
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

    const fetchPromotionResult = async (promotionResultCode) => {
        try {
            const response = await axios.get('api/promotion-results/' + promotionResultCode);
            const data = response.data;

            return data;
        } catch (error) {
            console.log('error', error);
        }
    };

    const {
        data: { invoices = [] } = {},
        isLoading,
        isFetched,
        isError,
        // refetch,
    } = useQuery('fetchReturnInvoice', fetchReturnInvoice, {
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
    } = useQuery(
        ['fetchPromotionResult', selectedInvoice?.salesInvoiceCode],
        () => fetchPromotionResult(selectedInvoice?.salesInvoiceCode),
        {
            staleTime: 1000 * 60 * 7, // Thời gian dữ liệu được xem là "cũ"
            cacheTime: 1000 * 60 * 10, // Thời gian dữ liệu được lưu trong bộ nhớ cache
            refetchInterval: 1000 * 60 * 7, // Tần suất làm mới dữ liệu
            enabled: !!selectedInvoice?.salesInvoiceCode, // Chỉ thực hiện truy vấn khi có mã hóa đơn
        },
    );

    if (isLoading || isLoadingMovies || isLoadingCinemas || isLoadingStaff || isLoadingPromotionResult)
        return <Loading />;
    if (!isFetched || !isFetchedMovies || !isFetchedCinemas || !isFetchedStaff) return <div>Fetching...</div>;
    if (isError || isErrorMovies || CinemaError || isErrorStaff || errorPromotionResult)
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    isErrorMovies.message ||
                    CinemaError.message ||
                    isErrorStaff.message ||
                    errorPromotionResult.message}
            </div>
        );

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
            setSearchSDT('');
            setSearchCodeHD('');
            setSelectedOptionFilterCinema('');
            setStaffFilter('');
            return;
        }

        setInvoiceFilter(filterDate);
        setInputSearch('');
        setSearchSDT('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
        setStaffFilter('');
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

    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data].reverse();
        const item = reversedData[index];

        return (
            <div
                className="border-b py-3 text-[15px] font-normal gap-2 text-slate-500 grid grid-cols-8 items-center pr-2"
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
                <h1 className="grid items-center uppercase">   {item?.scheduleCode?.movieCode?.name.length > 45
                        ? item?.scheduleCode.movieCode.name.slice(0, 45) + '...'
                        : item?.scheduleCode.movieCode.name}</h1>
                <h1 className="grid items-center justify-center ">{FormatSchedule(item.createdAt)}</h1>

                <div className=" grid grid-cols-8 col-span-2 gap-x-0">
                    <h1 className="grid justify-center col-span-3 items-center ">
                        {formatCurrency(calculateTotal(item.details) - item.discountAmount)}
                    </h1>
                    <h1 className="grid justify-center col-span-3 items-center ">{item.salesInvoiceCode}</h1>
                    <div className="grid col-span-2 justify-center">
                        <button
                            className="ml-2"
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

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[195px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Hóa đơn trả</h1>

                <div className="min-w-[900px]">
                    <div className="grid grid-cols-4  gap-10 mb-2 items-center w-full h-16 px-3">
                        <AutoInputComponent
                            value={searchCodeHD}
                            onChange={(newValue) => handleSearchCodeHD(newValue)}
                            title="Mã hóa đơn trả"
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
                                <h1 className="text-[16px] truncate mb-1">Ngày trả</h1>
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
                    <div className="grid grid-cols-3 gap-10 items-center w-full h-16 px-3">
                        <AutoInputComponent
                            options={optionStaff.map((item) => item.name)}
                            value={staffFilter}
                            onChange={(newValue) => handleStaff(newValue)}
                            title="Nhân viên trả"
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
                    </div>
                </div>
            </div>
            <div className="bg-white border shadow-md rounded-[10px] box-border  py-2 h-[455px] custom-height-xs2 max-h-screen custom-height-sm25 custom-height-md5 custom-height-lg4 custom-height-xl3 custom-hubmax3">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b py-2 gap-2 text-sm uppercase font-bold text-slate-500 grid grid-cols-8 items-center min-w-[1200px] pr-2">
                        <div className="grid grid-cols-3">
                            <h1 className="grid justify-center items-center ">STT</h1>
                            <h1 className="grid justify-center items-center col-span-2  ">Mã HĐ Trả</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Nhân viên trả</h1>
                        <h1 className="grid col-span-1 justify-center items-center">Khách hàng</h1>
                        <h1 className="grid justify-center items-center">Rạp</h1>
                        <h1 className="grid justify-center items-center">Tên phim</h1>
                        <h1 className="grid justify-center items-center">Ngày Trả</h1>
                        <div className=" grid col-span-2 grid-cols-8 ">
                            <h1 className="grid justify-center items-center col-span-3 ">Tổng tiền</h1>
                            <h1 className="grid justify-center items-center col-span-3">Mã HĐ bán</h1>
                            <h1 className="grid justify-center items-center col-span-2">{''}</h1>
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
                title="Chi tiết hóa đơn trả"
            >
                <div className="h-90p grid grid-rows-12 gap-2  px-2">
                    <div className="grid row-span-4 pb-2  ">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid  grid-cols-2 gap-2 ">
                                    <h1 className=" font-bold">Mã hóa đơn trả:</h1>
                                    <h1 className=" font-normal">{selectedInvoice?.code}</h1>
                                </div>
                                <div className="grid grid-cols-8 gap-2">
                                    <h1 className="font-bold  col-span-3 ">Ngày trả</h1>
                                    <h1 className="grid col-span-5 font-normal  items-center">
                                        {FormatSchedule(selectedInvoice?.createdAt)}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Nhân viên trả:</h1>
                                    <h1 className="font-normal">
                                        {selectedInvoice?.staffCode === null ? 'App' : selectedInvoice?.staffCode.name}
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

                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Mã hóa đơn bán:</h1>
                                    <h1 className="font-normal items-center">{selectedInvoice?.salesInvoiceCode}</h1>
                                </div>
                                <div className="grid grid-cols-8 gap-2">
                                    <h1 className="font-bold  col-span-3 ">Lý do trả:</h1>
                                    <h1 className="grid col-span-5 font-normal  items-center text-red-500">
                                        {selectedInvoice?.returnReason}
                                    </h1>
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
                                console.log('groupedDetails', groupedDetails);
                                console.log('items', firstItem);
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
        </div>
    );
};

export default SaleInvoice;
