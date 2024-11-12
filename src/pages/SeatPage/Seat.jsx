import React, { useMemo, useState, useRef, useEffect } from 'react';

import { LuArmchair } from 'react-icons/lu';
import { IoIosArrowBack } from 'react-icons/io';
import { ImSpoonKnife } from 'react-icons/im';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { GrFormNext } from 'react-icons/gr';
import { styled } from '@mui/system';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer, getIsSchedule } from '~/redux/apiRequest';
import { resetSeats, resetCombo } from '~/redux/seatSlice';

import { increment, decrement, resetValue } from '~/redux/valueSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Barcode from 'react-barcode';
import { resetPromotionData } from '~/redux/productSlice';
import Loading from '~/components/LoadingComponent/Loading';
import { FaMoneyBills } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const { FormatSchedule, getFormatteNgay } = require('~/utils/dateUtils');
const SeatComponent = React.lazy(() => import('~/components/OrderComponent/SeatComponent'));
const FoodComponent = React.lazy(() => import('~/components/OrderComponent/FoodComponent'));
const PayComponent = React.lazy(() => import('~/components/OrderComponent/PayComponent'));

const CustomTab = styled(({ isActive, ...other }) => <Tab {...other} />)(({ isActive }) => ({
    borderBottom: isActive ? '2px solid red' : '1px solid transparent',
    color: isActive ? 'red' : 'black',
    transition: 'border-bottom 0.3s',
    textTransform: 'none',
    fontSize: '16px',
    width: 'auto',
    '&.Mui-selected': {
        color: 'red',
    },
}));

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

const Seat = () => {
    const value = useSelector((state) => state.value.value);
    const [openPay, setOpenPay] = useState(false);
    const customer = useSelector((state) => state.customers.customer.currentCustomer) || null;
    const promotionDetailCode = useSelector((state) => state.products?.promotionDetailCode);
    const freeProduct = useSelector((state) => state.products?.freeProduct);
    const [selectedCombos, setSelectedCombos] = useState([]);
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const initialTimeLeft = 10 * 60;

    const [timeLeft, setTimeLeft] = useState(() => {
        const savedTime = JSON.parse(localStorage.getItem('timeLeft'));
        return savedTime !== null ? savedTime : initialTimeLeft;
    });
    const formatTime = (timeInSeconds) => {
        const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, '0');
        const seconds = String(timeInSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        let timer;

        // Nếu `value` khác 0 và `timeLeft` vẫn chưa hết thì tiếp tục đếm ngược
        if (value !== 0 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleUpdateStatusSeat(1);
                        dispatch(resetPromotionData());
                        dispatch(resetCombo());
                        dispatch(resetSeats());
                        dispatch(resetValue());
                        setOpenPaymentMethod(false);
                        setOpenPay(false);
                        setOpenPrint(false);
                        toast.info('Hết thời gian giữ ghế vui lòng chọn lại!');
                        localStorage.removeItem('timeLeft');
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
        }

        return () => {
            if (timer) clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, timeLeft]);

    useEffect(() => {
        if (value === 0) {
            setTimeLeft(initialTimeLeft);
            localStorage.removeItem('timeLeft');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleOpenPay = () => setOpenPay(true);
    const handleClosePay = () => {
        setOpenPay(false);
        setChangeAmount(0);
    };
    const handleOpenPaymentMethod = () => setOpenPaymentMethod(true);
    const handleClosePaymentMethod = () => setOpenPaymentMethod(false);
    const queryClient = useQueryClient();
    const priceAfter = useSelector((state) => state.products?.calculatedPrice);

    const [openPrint, setOpenPrint] = useState(false);

    const handleOpenPrint = () => {
        setOpenPrint(true);
    };
    const handleClosePrint = () => {
        setOpenPrint(false);
        dispatch(resetPromotionData());
        dispatch(resetCombo());
        dispatch(resetSeats());
        dispatch(resetValue());
        getIsSchedule(dispatch, false);
    };

    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);
    const arraySeat = useSelector((state) => state.seat.seat?.selectedSeats);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();

    const handleUpdateStatusSeat = async (status) => {
        try {
            if (arraySeat.length === 0) {
                return;
            }
            const arrayCode = arraySeat.map((t) => t.code);

            const seat = {
                scheduleCode: schedule.scheduleCode,
                arrayCode: arrayCode,
                status: status,
            };

            await axios.put('api/seat-status-in-schedules', seat);
        } catch (error) {
            return toast.error(error.message);
        }
    };

    const handleNext = () => {
        if (arraySeat.length === 0) {
            return toast.warning('Vui lòng chọn ghế');
        }
        if (value === 0) {
            const code = arraySeat.map((item) => item.code);
            console.log(code);
            handleUpdateStatusSeat(2);
            dispatch(increment());
            return;
        }

        if (value === 1) {
            dispatch(increment());

            getCustomer(dispatch, null);
            return;
        }
    };

    const handlePrevious = () => {
        if (value === 2) {
            dispatch(decrement());
            dispatch(resetCombo());
            return;
        }
        if (value === 1) {
            handleUpdateStatusSeat(1);
            dispatch(decrement());
            dispatch(resetSeats());
            dispatch(resetCombo());

            return;
        }
    };
    const handleChangDoTuoi = (age) => {
        if (age === 13) {
            return 'C13';
        } else if (age === 16) {
            return 'C16';
        } else if (age === 18) {
            return 'C18';
        } else {
            return 'P';
        }
    };
    const groupProductsByCode = (products) => {
        return products?.reduce((acc, product) => {
            const existingProduct = acc.find((item) => item.code === product.productCode);

            if (existingProduct) {
                existingProduct.quantity += 1; // Tăng số lượng nếu đã tồn tại
                existingProduct.totalPrice += product.price || 0; // Cộng thêm giá vào tổng giá
            } else {
                acc.push({
                    name: product.productName, // Lưu tên sản phẩm
                    quantity: 1, // Khởi tạo số lượng
                    price: product.price || 0, // Lưu giá của sản phẩm
                    priceDetailCode: product.code || null, // Lưu giá của sản phẩm
                    totalPrice: product.price || 0, // Khởi tạo tổng giá
                    code: product.productCode, // Lưu mã sản phẩm
                });
            }

            return acc;
        }, []);
    };
    const combos = useSelector((state) => state.seat.seat.selectedCombo); // Lấy danh sách số lượng sản phẩm

    const groupedCombos = groupProductsByCode(combos); // Nhóm sản phẩm

    const calculateTotalPrice = (seats) => {
        return seats?.reduce((total, seat) => {
            return total + (seat.price || 0); // Thêm giá của ghế vào tổng, nếu không có giá thì cộng 0
        }, 0);
    };
    const calculateTotalPriceForCombos = (groupedCombos) => {
        return groupedCombos?.reduce((total, combo) => total + combo.totalPrice, 0);
    };
    const totalPriceCombo = useMemo(() => calculateTotalPriceForCombos(groupedCombos), [groupedCombos]);

    const totalPrice = useMemo(() => calculateTotalPrice(arraySeat), [arraySeat]);
    const totalPriceMain = useMemo(() => totalPriceCombo + totalPrice, [totalPriceCombo, totalPrice]);
    const discountAmount = totalPriceMain - priceAfter;

    const [cashGiven, setCashGiven] = useState(priceAfter);
    const [changeAmount, setChangeAmount] = useState(0);
    const [salesInvoiceCode, setSalesInvoiceCode] = useState('');

    const calculateChangeAmount = (cashGiven, totalAmount) => {
        const change = cashGiven - totalAmount;
        return change >= 0 ? change : 0;
    };
    useEffect(() => {
        setCashGiven(priceAfter);
    }, [priceAfter]);

    const handleCashGivenChange = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && value >= 0) {
            const cashGiven = Number(value);
            setCashGiven(cashGiven);

            // Kiểm tra xem khách đưa có đủ tiền không

            const changeAmount = calculateChangeAmount(cashGiven, priceAfter);
            setChangeAmount(changeAmount);
        }
    };

    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const printRef = useRef(); // Tạo ref để tham chiếu đến phần in

    const handlePrint = () => {
        setTimeout(() => {
            setOpenPrint(false);
            dispatch(resetCombo());
            dispatch(resetSeats());
            dispatch(resetValue());
            getIsSchedule(dispatch, false);
        }, 1000);
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent; // Chỉ hiển thị phần in

        window.print(); // Thực hiện lệnh in
        document.body.innerHTML = originalContent; // Khôi phục nội dung ban đầu

        document.location.reload(); // Tải lại trang
    };

    const {
        data: addressCinema = '',
        isLoading: isLoadingAddressCinema,
        error: errorAddressCinema,
    } = useQuery(['addressCinemaByCode', schedule.cinemaCode], () => fetchAddressCinemaCode(schedule.cinemaCode), {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        enabled: !!schedule.cinemaCode,
    });

    const handleCheckStatusSeat = async () => {
        try {
            const arrayCode = arraySeat.map((item) => item.code);
            const seatCheck = {
                scheduleCode: schedule.scheduleCode,
                arrayCode: arrayCode,
            };

            const responseCheck = await axios.post('api/seat-status-in-schedules/checkSelectedSeatsStatus', seatCheck);

            if (responseCheck.data.available === true) {
                toast.warning('Ghế đã được đặt, vui lòng chọn ghế khác!');

                return false;
            } else {
                return true;
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    /// action
    const handleAddSalesInvoice = async (paymentMethod) => {
        try {
            navigate('/order');

            if (cashGiven < priceAfter && paymentMethod === 0) {
                // Nếu tiền không đủ
                toast.warning('Không đủ tiền để thanh toán');
                return;
            } else {
                if (!(await handleCheckStatusSeat()) && paymentMethod === 0) {
                    return;
                }
                let loadingToastId;
                setCashGiven(0);

                loadingToastId = toast.loading('Đang thanh toán!');

                const salesInvoice = {
                    staffCode: user?.code,
                    customerCode: customer?.code,
                    scheduleCode: schedule?.scheduleCode,
                    paymentMethod: paymentMethod,
                    type: 0,
                };
                const response = await axios.post('api/sales-invoices', salesInvoice);

                const salesInvoices = response.data;
                if (salesInvoices) {
                    setSalesInvoiceCode(salesInvoices.code);
                    for (const seat of arraySeat) {
                        const salesInvoiceDetail = {
                            salesInvoiceCode: salesInvoices.code,
                            productCode: seat.code,
                            priceDetailCode: seat.priceDetailCode,
                            quantity: 1,
                        };

                        // Gửi yêu cầu POST tới API
                        await axios.post('api/sales-invoices-details', salesInvoiceDetail);
                        console.log(`Đã gửi hóa đơn cho sản phẩm: ${seat.productCode}`);
                    }

                    if (groupedCombos.length > 0) {
                        for (const combo of groupedCombos) {
                            const salesInvoiceDetail = {
                                salesInvoiceCode: salesInvoices.code,
                                productCode: combo.code,
                                priceDetailCode: combo.priceDetailCode,
                                quantity: combo.quantity,
                            };

                            // Gửi yêu cầu POST tới API
                            await axios.post('api/sales-invoices-details', salesInvoiceDetail);
                            console.log(`Đã gửi hóa đơn cho sản phẩm: ${combo.productCode}`);
                        }
                    }
                    if (promotionDetailCode) {
                        const promotionResult = {
                            salesInvoiceCode: salesInvoices.code,
                            promotionDetailCode: promotionDetailCode,
                            freeProductCode: freeProduct?.freeProductCode,
                            freeQuantity: freeProduct?.freeQuantity,
                            discountAmount: discountAmount,
                        };

                        await axios.post('api/promotion-results', promotionResult);
                    }
                    handleUpdateStatusSeat(3);
                    toast.dismiss(loadingToastId);
                    toast.success('Thanh toán thành công');
                    handleClosePay();
                    handleOpenPrint();
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const mutationPay = useMutation(handleAddSalesInvoice, {
        onSuccess: () => {
            queryClient.refetchQueries('fetchSaleInvoice');
            queryClient.refetchQueries('fetchSeatByRoomCode');
            queryClient.refetchQueries('dataCheck');
        },
    });
    const handleZaloPay = async () => {
        try {
            if (!(await handleCheckStatusSeat())) {
                return;
            }
            setLoading(true);

            const response = await axios.post('/api/web/payment', { amount: priceAfter }); // Đảm bảo đường dẫn này đúng với API của bạn
            if (response.data) {
                if (response.data.return_code === 1) {
                    const orderUrl = response.data.order_url;
                    window.location.href = orderUrl; // Chuyển hướng tới order_url
                    setLoading(false);
                } else {
                    setLoading(false);

                    toast.error('Lỗi không thể mở trang thanh toans');
                }
            }
        } catch (error) {
            setLoading(false);

            toast.error('Phương thức thanh toán Zalopay đang bị lỗi:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const apptransid = params.get('apptransid');

        const checkStatus = async () => {
            if (apptransid) {
                await checkOrderStatus(apptransid);
            }
        };

        checkStatus(); // Gọi hàm kiểm tra trạng thái

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkOrderStatus = async (apptransid) => {
        try {
            const response = await axios.post(`/api/web/order-status/${apptransid}`);

            // Kiểm tra dữ liệu trả về
            if (response.data.return_code === 1) {
                // Gọi mutationPay nếu cần
                await mutationPay.mutate(1);

                // dispatch(resetCombo());
                // dispatch(resetSeats());
                // dispatch(resetValue());
                // getIsSchedule(dispatch, false);
            } else {
                handleUpdateStatusSeat(1);
                dispatch(resetPromotionData());
                dispatch(resetCombo());
                dispatch(resetSeats());
                dispatch(resetValue());
                setOpenPaymentMethod(false);
                setOpenPay(false);
                setOpenPrint(false);
                toast.info('Thanh toán không thành công!');
                navigate('/order');
            }
        } catch (error) {
            toast.error('Lỗi: ' + error.message);
        }
    };

    function getFormattedDateTime(isoString) {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    }
    const salesInvoiceTicketPrint = arraySeat?.map((seat) => ({
        cinemaName: schedule.cinemaName,
        cinemaAddress: addressCinema,
        createdAt: FormatSchedule(new Date()),
        staffName: user?.name,
        movieName: schedule.movieName,
        ageRestriction: handleChangDoTuoi(schedule.ageRestriction),
        date: getFormatteNgay(schedule.startTime),
        startTime: getFormattedDateTime(schedule.startTime),
        endTime: getFormattedDateTime(schedule.endTime),
        roomName: schedule.roomName,
        seatNumber: seat.seatNumber,
        seatName: seat.name,
        price: seat.price,
    }));

    const salesInvoiceFoodPrint = {
        cinemaName: schedule.cinemaName,
        cinemaAddress: addressCinema,
        createdAt: FormatSchedule(new Date()),
        staffName: user?.name,
    };
    const freeProductPrint = {
        productName: freeProduct?.productName,
        price: freeProduct?.price,
        quantity: freeProduct?.freeQuantity,
        totalPrice: freeProduct?.price,
    };
    const foodPrint = groupedCombos?.map((combo) => ({
        productName: combo.name,
        price: combo.price,
        quantity: combo.quantity,
        totalPrice: combo.price * combo.quantity,
    }));

    const combinedPrint = [freeProductPrint, ...foodPrint].filter((item) => item.quantity > 0);

    if (isLoadingAddressCinema || loading) return <Loading />;

    if (errorAddressCinema) return <div>Error loading data: {errorAddressCinema.message}</div>;

    return (
        <div className="max-h-screen">
            <div className=" rounded-[10px] px-4 h-[675px] custom-height-xxl2 max-h-screen custom-height-sm3 custom-height-md1 custom-height-lg1 custom-height-xl1">
                <div className="flex mb-1">
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            padding: '2px 8px 2px 4px',
                            backgroundColor: 'transparent',
                            color: 'black',
                        }}
                        onClick={() => {
                            getIsSchedule(dispatch, false);
                            dispatch(resetSeats());
                            dispatch(resetCombo());
                            dispatch(resetValue());
                            handleUpdateStatusSeat(1);
                        }}
                    >
                        <IoIosArrowBack size={20} />
                        Bán vé
                    </Button>
                    {value !== 0 && (
                        <div className="ml-10 flex-1 justify-center items-center ">
                            <h2 className="text-center text-[#334767]">
                                Thời gian giữ ghế : <span className="font-bold">{formatTime(timeLeft)}</span>
                            </h2>
                        </div>
                    )}
                </div>
                <div
                    className="grid grid-cols-4 max-lg:grid-rows-5 custom-height-sm13 custom-height-sm4 
                        max-lg:grid-cols-3 max-lg:gap-3 gap-2 h-[94%] "
                >
                    <div
                        className=" text-white max-lg:row-span-2 max-lg:w-[300px] max-lg:mx-[50%] custom-height-sm5 custom-height-sm8
                      bg-[#334767] text-[13px] rounded-[10px]  grid grid-rows-10"
                    >
                        <div className="  row-span-6 grid grid-rows-5 p-2">
                            <div className="grid grid-cols-5 row-span-3 gap-3 max-lg:gap-0">
                                <div className="col-span-2 ">
                                    <img
                                        src={schedule.image}
                                        alt="phim1"
                                        className="object-contain h-[160px] max-lg:h-[120px]"
                                    />
                                </div>
                                <div className="pt-4 col-span-3 space-y-2 max-lg:space-y-0">
                                    <h1 className="uppercase font-bold text-[13px]">{schedule.movieName}</h1>

                                    <h1 className="bg-[#1565C0] w-8 p-1 text-center text-white text-[12px] rounded-md ">
                                        {handleChangDoTuoi(schedule.ageRestriction)}
                                    </h1>

                                    <h1 className=" rounded-md ">
                                        {schedule.screeningFormat} {schedule.audio === 'Gốc' ? '' : 'lồng tiếng'} phụ đề{' '}
                                        {schedule.subtitle}
                                    </h1>
                                    <h1 className="text-[12px] font-[200px]">
                                        {schedule.movieGenreCode.map((genre) => genre.name).join(', ')}
                                    </h1>
                                    <h1 className="text-[12px] ">{schedule.duration} phút</h1>
                                </div>
                            </div>
                            <div className="row-span-2 grid grid-rows-3 ">
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Rạp:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">
                                        {schedule.cinemaName}
                                    </h1>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Phòng:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">{schedule.roomName}</h1>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Suất chiếu:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">
                                        {FormatSchedule(schedule.startTime)}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2  border-b-2 row-span-2 border-dashed flex-row p-2 ">
                            <div className="flex h-[50%] justify-center">
                                <div className=" items-center flex ">
                                    <LuArmchair className="text-white" size={25} />
                                    <h1 className="ml-1">Ghế:</h1>
                                </div>
                                <div className="flex ml-3 items-center flex-wrap w-[100%] justify-end  ">
                                    <h1 className="w-[95%] text-right  text-ellipsis  overflow-hidden line-clamp-2 ">
                                        {arraySeat.map((item) => item.seatNumber).join(', ')}
                                    </h1>
                                </div>
                            </div>
                            <div className=" flex h-[50%] r">
                                <div className=" items-center flex">
                                    <ImSpoonKnife className="text-white" size={25} />
                                    <h1 className="ml-1">Combo:</h1>
                                </div>
                                <div className="flex ml-3 items-center flex-wrap w-[100%] justify-end  ">
                                    <h1 className="w-[95%] text-right  text-ellipsis  overflow-hidden line-clamp-3 ">
                                        {groupedCombos
                                            ?.map((combo) => 'x' + combo.quantity + ' ' + combo.name)
                                            .join(', ')}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#334767] rounded-es-[10px] rounded-ee-[10px] grid grid-rows-3 row-span-2 p-2">
                            <div className="grid items-center grid-cols-6 gap-2">
                                <div className=" grid  col-span-2 ">
                                    <h1 className="flex">
                                        <LuArmchair className="text-white mr-2" size={25} />
                                        Ghế:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">
                                    {formatCurrency(totalPrice)}
                                </h1>
                            </div>
                            <div className="grid items-center grid-cols-6 gap-2 ">
                                <div className=" grid  col-span-2 ">
                                    <h1 className="flex">
                                        <ImSpoonKnife className="text-white mr-2" size={25} />
                                        Combo:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">
                                    {formatCurrency(totalPriceCombo)}
                                </h1>
                            </div>
                            <div className="grid items-center grid-cols-6 gap-2">
                                <div className=" grid col-span-2 ">
                                    <h1 className="">Tổng tiền:</h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">
                                    {formatCurrency(totalPriceMain)}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-white  flex rounded-[10px] col-span-3 max-lg:row-span-3 custom-height-sm9">
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'gray' }}>
                                <Tabs
                                    value={value}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: 0,
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'red',
                                        },
                                    }}
                                >
                                    <CustomTab
                                        label="1. Chọn ghế"
                                        isActive={value >= 0}
                                        sx={{ flexGrow: 1, textAlign: 'center' }} // Flex to occupy space and center text
                                    />
                                    <CustomTab
                                        label="2. Chọn đồ ăn và nước"
                                        isActive={value >= 1}
                                        sx={{ flexGrow: 1, textAlign: 'center' }}
                                    />
                                    <CustomTab
                                        label="3. Thanh toán"
                                        isActive={value === 2}
                                        sx={{ flexGrow: 1, textAlign: 'center' }}
                                    />
                                </Tabs>
                            </Box>

                            {value === 0 && <SeatComponent />}
                            {value === 1 && (
                                <FoodComponent selectedCombos={selectedCombos} setSelectedCombos={setSelectedCombos} />
                            )}
                            {value === 2 && <PayComponent />}
                            <Box
                                sx={{
                                    display: 'flex',
                                    position: 'absolute',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    bottom: 10,
                                    padding: '0 20px',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                                    onClick={handlePrevious}
                                    disabled={value === 0}
                                >
                                    <IoIosArrowBack size={20} />
                                    Quay lại
                                </Button>

                                {value === 2 ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            padding: '2px 4px 2px 8px',
                                        }}
                                        // onClick={handleOpenPay}
                                        onClick={handleOpenPaymentMethod}
                                    >
                                        Thanh toán
                                        <GrFormNext size={22} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            padding: '2px 4px 2px 8px',
                                        }}
                                        onClick={handleNext}
                                        disabled={value === 2}
                                    >
                                        Tiếp theo
                                        <GrFormNext size={22} />
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>
            <ModalComponent
                open={openPay}
                handleClose={handleClosePay}
                width="30%"
                height="45%"
                smallScreenWidth="45%"
                smallScreenHeight="33%"
                mediumScreenWidth="45%"
                mediumScreenHeight="30%"
                largeScreenHeight="25%"
                largeScreenWidth="45%"
                maxHeightScreenHeight="55%"
                maxHeightScreenWidth="45%"
                heightScreen="45%"
                title="Thanh toán"
            >
                <div className=" h-[80%] grid grid-rows-4 gap-y-10 pb-6  mx-3 ">
                    <div className="">
                        <p className="mb-1">Tổng thanh toán</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base px-2 bg-gray-300"
                            type="number"
                            value={priceAfter}
                            // onChange={}
                            placeholder="Nhập số"
                            disabled={true}
                        />
                    </div>

                    <div className="">
                        <p className="mb-1">Tiền khách đưa</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base"
                            type="text"
                            value={cashGiven}
                            onChange={handleCashGivenChange}
                            placeholder="Nhập số"
                            required
                            inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                            pattern="[0-9]*" // Đảm bảo chỉ nhập số
                        />
                    </div>
                    <div className="">
                        <p className="mb-1">Tiền thừa</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base bg-gray-300"
                            type="number"
                            value={changeAmount}
                            onChange={setChangeAmount}
                            disabled={true}
                        />
                    </div>

                    <div className="justify-end flex space-x-3 border-t py-4 px-4 mt-4 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClosePay} />
                        <ButtonComponent
                            text="Xác nhận"
                            className={` bg-blue-500 ${cashGiven === 0 ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={() => {
                                mutationPay.mutate(0);
                            }}
                        />
                    </div>
                </div>
            </ModalComponent>
            <ModalComponent
                open={openPaymentMethod}
                handleClose={handleClosePaymentMethod}
                height="auto"
                width="auto"
                title="Phương thức thanh toán"
            >
                <div className="max-w-screen-md max-h-[80vh] overflow-y-auto  shadow-lg  ">
                    <div className="grid grid-cols-1 gap-3 text-white font-black text-lg  p-4 border-b-2">
                        <div
                            className="flex flex-row px-4 py-3 items-center border rounded-[10px] bg-gray-300 border-[#8e8d8d] cursor-pointer
                         hover:border-[#ff0000] hover:border-1.5"
                            onClick={handleOpenPay}
                        >
                            <div className="text-base text-white h-full font-bold justify-center px-4">
                                <div className="flex flex-col justify-center items-center bg-white rounded-lg py-1 px-2">
                                    <FaMoneyBills className=" grid col-span-3" size={30} color="green" />
                                </div>
                            </div>

                            <div className="flex flex-row items-center ">
                                <span className=" grid col-span-7 ">Thanh toán bằng tiền mặt</span>
                            </div>
                        </div>
                        <div
                            className="flex flex-row px-4 py-3 items-center border rounded-[10px] bg-gray-300 border-[#8e8d8d] cursor-pointer
                        hover:border-[#ff0000] hover:border-1.5"
                            onClick={handleZaloPay}
                        >
                            <div className="text-base text-white h-full font-bold justify-center px-4 ">
                                <div className="flex flex-col justify-center items-center bg-white rounded-lg  px-1.5">
                                    <span className="text-[#1a57ff] font-bold text-sm">Zalo</span>
                                    <span className="text-green-500 font-bold text-sm">pay</span>
                                </div>
                            </div>

                            <div className="flex flex-row items-center ">
                                <span className="text-white text-lg mr-1">Thanh toán qua</span>
                                <span className="text-[#221AFF] text-lg font-bold">Zalo</span>
                                <span className="text-green-500 text-lg font-bold mr-1 ">Pay</span>
                                <sup className="text-white text-sm font-bold ">QR</sup>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3    p-4">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClosePaymentMethod} />
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
                                        value={salesInvoiceCode}
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
                        {groupedCombos?.length > 0 && (
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
                                        value={salesInvoiceCode}
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
                <div ref={printRef} className="hidden print:block">
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
                                    value={salesInvoiceCode}
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
                    {groupedCombos.length > 0 && (
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
                                    value={salesInvoiceCode}
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

export default Seat;
