import React, { useRef, useState } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiRefund2Fill } from 'react-icons/ri';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { DatePicker } from 'antd';
import { FormatDate, FormatSchedule } from '~/utils/dateUtils';
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightInVoiceComponent from '~/components/HeightComponent/HeightInVoiceComponent';
import { set } from 'date-fns';

const SaleInvoice = () => {
    const [selectedMovie, setSelectedMovie] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const descriptionRef = useRef('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceFilter, setInvoiceFilter] = useState([]);
    const [selectedOptionFilterCinema, setSelectedOptionFilterCinema] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [searchCodeHD, setSearchCodeHD] = useState('');
    const height = HeightInVoiceComponent();
    const handleOpen = () => {
        setOpen(true);
    };
    const { RangePicker } = DatePicker;
    const handleClose = () => setOpen(false);
    const handleOpenDelete = () => {
        setOpenDelete(true);
        setSelectedInvoice(null);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
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
    const fetchSaleInvoice = async () => {
        try {
            const response = await axios.get('api/sales-invoices');
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

    const {
        data: { invoices = [] } = {},
        isLoading,
        isFetched,
        isError,
        // refetch,
    } = useQuery('fetchSaleInvoice', fetchSaleInvoice, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
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
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isFetched: isFetchedCinemas,
    } = useQuery('cinemasFullAddressInvoice', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    if (isLoading || isLoadingMovies || isLoadingCinemas) return <Loading />;
    if (!isFetched || !isFetchedMovies || !isFetchedCinemas) return <div>Fetching...</div>;
    if (isError || isErrorMovies || CinemaError)
        return <div>Error loading data: {isError.message || isErrorMovies.message || CinemaError.message}</div>;

    const optionsSort = [
        { value: '0', label: 'Xếp theo tên' },
        { value: 'A', label: 'A - Z' },
        { value: 'B', label: 'Z - A' },
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const rap = [
        {
            id: 1,
            name: 'Rạp Lotte',
            address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh   ',
            slRoom: '3',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Rạp Galaxy',
            address: '180 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
            slRoom: '2',
            status: 'InActive',
        },
    ];

    const onChangeRanger = (dates, dateStrings) => {
        if (!Array.isArray(dates) || dates.length !== 2) {
            // setMovieFilter(movies);
            return;
        }

        const [startDate, endDate] = dates;
        const startDateFormatted = FormatDate(startDate);
        const endDateFormatted = FormatDate(endDate);
        console.log(startDateFormatted, endDateFormatted);

        const filterDate = rap.filter((item) => {
            const itemDate = FormatDate(new Date(item.startDate));
            console.log(itemDate);
            return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
        });
        console.log(filterDate);
        if (filterDate.length === 0) {
            toast.info('Không tìm thấy phim nào!');
            // setMovieFilter([]);
            // setSelectedSort(null);
            // setInputSearch('');
            // setSelectedStatus(optionStatus[0]);
            return;
        }

        // setSelectedSort(null);
        // setInputSearch('');
        // setMovieFilter(filterDate);
        // setSelectedStatus(optionStatus[0]);
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
    };

    const handleSearchSDT = (value) => {
        setSearchSDT(value);
        if (value === '' || value === null) {
            setInvoiceFilter(invoices);

            return;
        }
        const search = invoices.filter((item) => item.customerCode?.phone === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setInvoiceFilter(search);
        }
        setInputSearch('');
        setSearchCodeHD('');
        setSelectedOptionFilterCinema('');
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
        setInputSearch('');
        setSearchSDT('');
        setSelectedOptionFilterCinema('');
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
                className="border-b py-3 text-[15px] font-normal gap-2 text-slate-500 grid grid-cols-8 items-center  min-w-[1100px] max-lg:pr-24 custom-hubmax2"
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
                <h1 className="grid items-center uppercase">{item.scheduleCode?.movieCode?.name}</h1>
                <h1 className="grid items-center justify-center ">{FormatSchedule(item.createdAt)}</h1>

                <div className=" grid grid-cols-8 col-span-2 gap-x-0">
                    <h1 className="grid justify-center col-span-3 items-center ">
                        {formatCurrency(calculateTotal(item.details))}
                    </h1>
                    <button
                        className={`border col-span-3 text-white text-[14px] py-[3px]  rounded-[40px] ${
                            item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        {item.status === 1 ? 'Đã thanh toán' : 'Đã hủy'}
                    </button>
                    <div className="grid grid-cols-2 col-span-2">
                        <button className="col-span-1 ml-[10px] " onClick={handleOpenDelete}>
                            <RiRefund2Fill color="black" size={22} />
                        </button>
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
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[195px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-1">Hóa đơn bán</h1>
                <div className="overflow-x-auto  xl:overflow-hidden">
                    <div className="min-w-[1100px] max-lg:pr-24 custom-hubmax2">
                        <div className="grid grid-cols-4  max-lg:gap-3 gap-12 mb-2 items-center w-full h-16 px-3">
                            <AutoInputComponent
                                value={searchCodeHD}
                                onChange={(newValue) => handleSearchCodeHD(newValue)}
                                title="Mã hóa đơn"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                borderRadius="10px"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleEnterPress1(e.target.value);
                                    }
                                }}
                            />
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Nhân viên lập"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                borderRadius="10px"
                            />

                            <div className="col-span-2">
                                <h1 className="text-[16px] truncate mb-1">Ngày lập</h1>
                                <RangePicker
                                    onChange={onChangeRanger}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    placement="bottomRight"
                                    format={'YYYY-MM-DD'}
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4  max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
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
                                        handleEnterPress(e.target.value); // Pass the current input value when Enter is pressed
                                    }
                                }}
                            />
                            <div className="relative w-full ">
                                <MdSwapVert className="absolute bottom-[10px] left-2" />
                                <SelectComponent
                                    value={selectedValue}
                                    onChange={handleChange}
                                    options={optionsSort}
                                    title="Sắp xếp"
                                    className="pl-3"
                                    selectStyles={{ borderRadius: '10px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white border shadow-md rounded-[10px] box-border  py-2 h-[455px] custom-height-xs2 max-h-screen custom-height-sm25 custom-height-md5 custom-height-lg4 custom-height-xl3 custom-hubmax3">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b py-2 gap-2 text-sm uppercase font-bold text-slate-500 grid grid-cols-8 items-center min-w-[1200px] max-lg:pr-24 custom-hubmax2 air-pro xxl:pr-3">
                        <div className="grid grid-cols-3">
                            <h1 className="grid justify-center items-center ">STT</h1>
                            <h1 className="grid justify-center items-center col-span-2  ">Mã HĐ</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Nhân viên lập</h1>
                        <h1 className="grid col-span-1 justify-center items-center">Khách hàng</h1>
                        <h1 className="grid justify-center items-center">Rạp</h1>
                        <h1 className="grid justify-center items-center">Tên phim</h1>
                        <h1 className="grid justify-center items-center">Ngày lập</h1>
                        <div className=" grid col-span-2 grid-cols-8 ">
                            <h1 className="grid justify-center items-center col-span-3 ">Tổng tiền</h1>
                            <h1 className="grid justify-center items-center col-span-3">Trạng thái</h1>
                            <h1 className="grid justify-center items-center col-span-2">{''}</h1>
                        </div>
                    </div>

                    <div className="py-1 min-w-[1100px]">
                        <List
                            itemCount={invoiceFilter.length === 0 ? invoices?.length : invoiceFilter.length}
                            itemSize={60}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1000px' }}
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
                smallScreenWidth="65%"
                smallScreenHeight="50%"
                mediumScreenWidth="60%"
                mediumScreenHeight="43%"
                largeScreenHeight="37%"
                largeScreenWidth="60%"
                maxHeightScreenHeight="80%"
                maxHeightScreenWidth="60%"
                heightScreen="62%"
                title="Chi tiết hóa đơn"
            >
                <div className="h-90p grid grid-rows-12 gap-2 ">
                    <div className="grid row-span-5">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid  grid-cols-2 gap-2">
                                    <h1 className=" font-bold">Mã hóa đơn:</h1>
                                    <h1 className=" font-normal">{selectedInvoice?.code}</h1>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày lập:</h1>
                                    <h1 className="grid col-span-2 font-normal">
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
                                            ? 'Tại quầy'
                                            : selectedInvoice?.staffCode.name}
                                    </h1>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <h1 className="font-bold">Khách hàng:</h1>
                                    <h1 className="grid col-span-2 font-normal">
                                        {' '}
                                        {selectedInvoice?.customerCode === null
                                            ? 'App'
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
                                <div className="grid grid-cols-3 gap-2">
                                    <h1 className="font-bold">Tên phim:</h1>
                                    <h1 className="grid col-span-2 font-normal">
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
                                <div className="grid grid-cols-3 gap-2">
                                    <h1 className="font-bold">Suất chiếu:</h1>
                                    <h1 className="grid col-span-2 font-normal">
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
                                    <h1 className="font-normal">
                                        {selectedInvoice?.paymentMethod === 0 ? 'Tiền mặt' : 'VNPay'}
                                    </h1>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <h1 className="font-bold">Tổng tiền:</h1>
                                    <h1 className="grid col-span-2 font-normal">
                                        {formatCurrency(calculateTotal(selectedInvoice?.details))}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid gap-2">
                                <div className="flex">
                                    <h1 className="font-bold">Lý do hủy:</h1>
                                    <h1 className="font-normal ml-2">Không</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid items-center border-b ">
                        <div className="grid grid-cols-6 gap-2 text-sm  uppercase font-bold text-slate-700  px-3">
                            <h1 className="  grid justify-center items-center col-span-2 ">Tên sản phẩm</h1>
                            <h1 className=" grid justify-center items-center ">Mô tả</h1>
                            <h1 className=" grid justify-center items-center ">Số lượng</h1>
                            <h1 className=" justify-center grid items-center ">Đơn giá</h1>
                            <h1 className=" justify-center grid items-center ">Thành tiền</h1>
                        </div>
                    </div>
                    <div className="grid row-span-5">
                        <div className="h-[100%] overflow-auto">
                            {Object.entries(groupedDetails).map(([productName, items]) => {
                                const firstItem = items[0];
                                const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
                                const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
                                console.log('items', items);
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
                                        <h1 className="justify-center grid items-center">
                                            {totalAmount.toLocaleString()} đ
                                        </h1>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="justify-end flex space-x-3 mt-1  border-t pr-4">
                        <div className="space-x-3 mt-[6px]">
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
                title="Hủy hóa đơn"
            >
                <div className="h-[80%] grid grid-rows-4 ">
                    <div className="row-span-3 grid-rows-5 grid ">
                        <h1 className="grid row-span-1 px-3 py-2">Vui lòng nhập lý do hủy hóa đơn bên dưới:</h1>
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
                            <ButtonComponent text="Xác nhận" className="bg-blue-500" />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default SaleInvoice;
