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
import { getIsSchedule } from '~/redux/apiRequest';
import { resetSeats, resetCombo } from '~/redux/seatSlice';

import { increment, decrement, resetValue } from '~/redux/valueSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQuery } from 'react-query';
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
    const [open, setOpen] = useState(false);

    const [selectedCombos, setSelectedCombos] = useState([]);
    const dispatch = useDispatch();
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCashGiven(0);
        setChangeAmount(0);
    };

    const [openPrint, setOpenPrint] = useState(false);

    const handleOpenPrint = () => setOpenPrint(true);
    const handleClosePrint = () => setOpenPrint(false);

    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);
    const arraySeat = useSelector((state) => state.seat.seat?.selectedSeats);

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
            toast.success('Chuyển sang chọn đồ ăn và nước');
            dispatch(increment());
            return;
        }

        if (value === 1) {
            dispatch(increment());
            toast.success('Chuyển sang thanh toán');
            return;
        }
    };

    const handlePrevious = () => {
        if (value === 2) {
            dispatch(decrement());
            dispatch(resetCombo());
            toast.success('Chuyển sang chọn đồ ăn và nước');
            return;
        }
        if (value === 1) {
            handleUpdateStatusSeat(1);
            dispatch(decrement());
            dispatch(resetSeats());
            dispatch(resetCombo());

            toast.success('Chuyển sang chọn ghế');
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

    const [totalAmount, setTotalAmount] = useState(totalPriceMain);
    useEffect(() => {
        setTotalAmount(totalPriceMain);
    }, [totalPriceMain]);

    const [cashGiven, setCashGiven] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);

    const calculateChangeAmount = (cashGiven, totalAmount) => {
        const change = cashGiven - totalAmount;
        return change >= 0 ? change : 0;
    };

    const handleCashGivenChange = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && value >= 0) {
            const cashGiven = Number(value);
            setCashGiven(cashGiven);

            // Kiểm tra xem khách đưa có đủ tiền không
            if (cashGiven < totalAmount) {
            }

            const changeAmount = calculateChangeAmount(cashGiven, totalAmount);
            setChangeAmount(changeAmount);
        }
    };

    const handleSubmit = async () => {
        if (cashGiven < totalAmount) {
            // Nếu tiền không đủ
            toast.warning('Không đủ tiền để thanh toán');
        } else {
            const arrayCode = arraySeat.map((item) => item.code);
            const seatCheck = {
                scheduleCode: schedule.scheduleCode,
                arrayCode: arrayCode,
            };

            const response = await axios.post('api/seat-status-in-schedules/checkSelectedSeatsStatus', seatCheck);

            if (response.data.available === true) {
                toast.warning('Ghế đã được đặt, vui lòng chọn ghế khác!');

                return;
            }
            // // Nếu đủ tiền thì hiển thị modal xác nhận
            handleOpenPrint();
        }
    };

    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const printRef = useRef(); // Tạo ref để tham chiếu đến phần in

    // const handlePrint = () => {
    //     handleClose(); // Đóng modal

    //     const printContent = printRef.current.innerHTML;
    //     const originalContent = document.body.innerHTML;

    //     document.body.innerHTML = printContent; // Chỉ hiển thị phần in
    //     window.print(); // Thực hiện lệnh in
    //     document.body.innerHTML = originalContent; // Khôi phục nội dung ban đầu
    //     document.location.reload(); // Tải lại trang
    // };

    const {
        data: addressCinema = '',
        // isLoading,
        // isFetching,
        // error,
        // refetch,
    } = useQuery(['addressCinemaByCode', schedule.cinemaCode], () => fetchAddressCinemaCode(schedule.cinemaCode), {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        enabled: !!schedule.cinemaCode,
    });

    /// action
    const handleAddSalesInvoice = async () => {
        try {
            const salesInvoice = {
                staffCode: 'NV02',
                scheduleCode: schedule?.scheduleCode,
                paymentMethod: 0,
                type: 0,
            };
            const response = await axios.post('api/sales-invoices', salesInvoice);
            const salesInvoices = response.data;
            if (salesInvoices) {
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
                handleUpdateStatusSeat(3);
                toast.success('Thanh toán thành công');

                handleClose();
                handleClosePrint();
                dispatch(resetCombo());
                dispatch(resetSeats());
                dispatch(resetValue());
            }
        } catch (error) {
            toast.error(error.message);
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
        staffName: 'Cao Trùng Dương',
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
        staffName: 'Cao Trùng Dương',
    };

    const foodPrint = groupedCombos?.map((combo) => ({
        productName: combo.name,
        price: combo.price,
        quantity: combo.quantity,
        totalPrice: combo.price * combo.quantity,
    }));

    return (
        <div className="max-h-screen">
            <div className=" rounded-[10px] px-4 h-[675px] custom-height-xxl2 max-h-screen custom-height-sm3 custom-height-md1 custom-height-lg1 custom-height-xl1">
                <div className="flex mb-1">
                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                        onClick={() => {
                            getIsSchedule(dispatch, false);
                            dispatch(resetSeats());
                            dispatch(resetCombo());
                            dispatch(resetValue());
                            handleUpdateStatusSeat(1);
                        }}
                    >
                        <IoIosArrowBack size={20} />
                        Quay lại
                    </Button>
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
                                <div className="flex ml-3 items-center flex-wrap w-full">
                                    <h1 className="w-full text-right">
                                        {arraySeat.map((item) => item.seatNumber).join(', ')}
                                    </h1>
                                </div>
                            </div>
                            <div className=" flex h-[50%] r">
                                <div className=" items-center flex">
                                    <ImSpoonKnife className="text-white" size={25} />
                                    <h1 className="ml-1">Combo:</h1>
                                </div>
                                <div className="flex ml-3 items-center flex-wrap w-full">
                                    <h1 className="w-full text-right">
                                        {groupedCombos?.map((combo) => combo.name + ' x' + combo.quantity).join(', ')}
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
                                        onClick={handleOpen}
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
                open={open}
                handleClose={handleClose}
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
                        <p className="mb-1">Tổng tiền</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base px-2 bg-gray-300"
                            type="number"
                            value={totalAmount}
                            onChange={setTotalAmount}
                            placeholder="Nhập số"
                            disabled={true}
                        />
                    </div>

                    <div className="">
                        <p className="mb-1">Tiền đưa</p>
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
                        <p className="mb-1">Tiền trả</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base bg-gray-300"
                            type="number"
                            value={changeAmount}
                            onChange={setChangeAmount}
                            disabled={true}
                        />
                    </div>

                    <div className="justify-end flex space-x-3 border-t py-4 px-4 mt-4 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                        <ButtonComponent text="Xác nhận" className=" bg-blue-500 " onClick={handleSubmit} />
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
                                className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2 "
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
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                <p className="text-center">{ticket.barcode}</p>
                            </div>
                        ))}
                        {/* Danh sách bắp nước */}
                        {groupedCombos?.length > 0 && (
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
                                {foodPrint.map((food, index) => (
                                    <div key={index} className="grid grid-cols-8 gap-4 ">
                                        <span className="col-span-3 font-normal whitespace-normal">
                                            {food.productName}
                                        </span>
                                        <span className="col-span-2 font-normal whitespace-normal">
                                            {food.price.toLocaleString()}
                                        </span>
                                        <span className="col-span-1 font-normal whitespace-normal">
                                            {food.quantity}
                                        </span>
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
                                <div className="flex  my-2 ">
                                    <div className="w-full border-t-2 border-black border-dashed"></div>
                                </div>
                                {/* <p className="text-center">{ticket.barcode}</p> */}
                            </div>
                        )}
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end space-x-3 border-t  mx-2  p-3">
                        <ButtonComponent text="Hủy" className="bg-gray-400" onClick={handleClosePrint} />
                        <ButtonComponent
                            text="In Vé"
                            className="bg-blue-500 text-white"
                            onClick={() => {
                                handleAddSalesInvoice();
                                // handlePrint();
                            }} // Gọi hàm in
                        />
                    </div>
                </div>

                {/* Phần in ẩn */}
                <div ref={printRef} className="hidden print:block">
                    {salesInvoiceTicketPrint?.map((ticket, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-300 rounded-lg ticket-bg mb-4 shadow-md space-y-2 "
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
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            <p className="text-center">{ticket.barcode}</p>
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
                            <div className="flex  my-2 ">
                                <div className="w-full border-t-2 border-black border-dashed"></div>
                            </div>
                            {/* <p className="text-center">{ticket.barcode}</p> */}
                        </div>
                    )}
                </div>
            </ModalComponent>
        </div>
    );
};

export default Seat;
