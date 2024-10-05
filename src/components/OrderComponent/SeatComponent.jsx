import React, { memo } from 'react';
import screen from '~/assets/screen.png';
import seatvip from '~/assets/Seatvip.png';
import seat from '~/assets/Seat.png';
import seatcouple from '~/assets/Seatcouple.png';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat } from '~/redux/seatSlice';
const SeatComponent = memo(({ setSetGhe }) => {
    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);
    const fetchSeatByRoomCode = async () => {
        try {
            const response = await axios.get(`api/products/getAllSeatsByRoomCode/${schedule.roomCode}`);
            const data = response.data;
            return data;
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
        data: seat1 = [],
        isLoading,
        // isFetching,
        error,
        // refetch,
    } = useQuery(['fetchSeatByRoomCode', schedule.roomCode], () => fetchSeatByRoomCode(schedule.roomCode), {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        enabled: !!schedule.roomCode,
    });
    isLoading && <Loading />;
    error && toast.error('Lỗi: ' + error);

    // const handleSeatClick = (seatId) => {
    //     console.log(seatId);
    // };
    // const handleSeatClick = (seatId) => {
    //     setSelectedSeats((prevSelected) => {
    //         // Tìm ghế được click
    //         const clickedSeat = seat1.find((seat) => seat.seatNumber === seatId);
    //         console.log(clickedSeat);
    //         if (clickedSeat) {
    //             const isSelected = prevSelected.some((seat) => seat.id === seatId);

    //             if (isSelected && clickedSeat.trang_thai === 1) {
    //                 // Nếu ghế đã được chọn và có trạng thái 1, bỏ chọn ghế (trả lại trạng thái 0)
    //                 const updatedSeats = seats.map((seat) => (seat.id === seatId ? { ...seat, trang_thai: 0 } : seat));
    //                 setSeats(updatedSeats);

    //                 // Trả về mảng mới sau khi loại bỏ ghế khỏi selectedSeats
    //                 return prevSelected.filter((seat) => seat.id !== seatId);
    //             } else if (clickedSeat.trang_thai === 0) {
    //                 // Nếu ghế có trạng thái 0, chọn ghế (đổi thành trạng thái 1)
    //                 const updatedSeats = seats.map((seat) => (seat.id === seatId ? { ...seat, trang_thai: 1 } : seat));
    //                 setSeats(updatedSeats);

    //                 // Log object ghế đã chọn

    //                 // Thêm object ghế vào mảng selectedSeats
    //                 return [...prevSelected, clickedSeat];
    //             }
    //         }

    //         // Trả về mảng trước đó nếu không có thay đổi
    //         return prevSelected;
    //     });
    // };

    const dispatch = useDispatch();
    function convertTimeToNumber(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number); // Tách giờ và phút
        return hours * 100 + minutes; // Ghép lại thành số
    }

    const handleSeatClick = async (seat) => {
        const dayOfWeek = getDayAndTime(schedule.startTime).day;
        const hours = getDayAndTime(schedule.startTime).time;
        const timeNumber = convertTimeToNumber(hours);

        // Determine the time slot for the pricing
        let time;
        if (dayOfWeek === 3) {
            time = 1;
        } else {
            if (timeNumber < 1700) {
                time = 2;
            } else if (timeNumber >= 1700 && timeNumber < 2359) {
                time = 3;
            } else {
                time = 1;
            }
        }

        const timeSlot = time;
        const productTypeCode = seat.productTypeCode;
        const roomTypeCode = schedule.screenCode;

        try {
            // Fetch the price from API
            const response = await axios.get('/api/prices/getPrice', {
                params: {
                    dayOfWeek,
                    timeSlot,
                    productTypeCode,
                    roomTypeCode,
                },
            });

            // Kiểm tra và lấy giá từ phản hồi
            const priceData = response.data.find(
                (priceInfo) =>
                    priceInfo.productTypeCode === productTypeCode &&
                    priceInfo.priceCode.dayOfWeek.includes(dayOfWeek) &&
                    priceInfo.priceCode.timeSlot === timeSlot,
            );

            if (priceData && priceData.price !== undefined) {
                const seatWithPrice = { ...seat, price: priceData.price };

                dispatch(toggleSeat(seatWithPrice));
            } else {
                const seatWithDefaultPrice = { ...seat, price: 0 };
                dispatch(toggleSeat(seatWithDefaultPrice));
            }
        } catch (err) {
            console.error('Failed to fetch price', err);
        }
    };

    function getDayAndTime(startTime) {
        const date = new Date(startTime);

        const dayOfWeek = date.getUTCDay();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayName = dayNames[dayOfWeek];
        let thu;
        if (dayName === 'Chủ nhật') {
            thu = 8;
        } else if (dayName === 'Thứ hai') {
            thu = 2;
        } else if (dayName === 'Thứ ba') {
            thu = 3;
        } else if (dayName === 'Thứ tư') {
            thu = 4;
        } else if (dayName === 'Thứ năm') {
            thu = 5;
        } else if (dayName === 'Thứ sáu') {
            thu = 6;
        } else if (dayName === 'Thứ bảy') {
            thu = 7;
        }

        // Trả về kết quả
        return {
            day: thu,
            time: `${hours}:${minutes}`,
        };
    }

    // console.log('priceDetails', priceDetails);

    const totalSeat = seat1.length; // Kích thước phòng có thể là nhỏ, vừa, lớn

    const gridColumns = totalSeat === 48 ? 'grid-cols-8' : totalSeat === 75 ? 'grid-cols-10' : 'grid-cols-12'; // Số cột tuỳ vào kích thước phòng

    return (
        <div className="grid grid-rows-5 max-lg:grid-rows-7 h-[550px] custom-height-md2 custom-height-sm15 ">
            <div className=" grid max-lg:row-span-2  ">
                <div className=" grid grid-cols-4 max-lg:grid-cols-3  h-[100px]">
                    <div className="grid grid-rows-3  text-[13px] gap-1 pt-3 pl-3">
                        <div className="flex ">
                            <img src={seat} alt="seat" className="object-contain h-[20px] " />
                            <h1 className="ml-3">Ghế thường</h1>
                        </div>
                        <div className="flex">
                            <img src={seatvip} alt="seat" className="object-contain h-[25px] " />
                            <h1 className="ml-3">Ghế vip</h1>
                        </div>
                        <div className="flex">
                            <img src={seatcouple} alt="seat" className="object-contain h-[25px] " />
                            <h1 className="ml-3">Ghế đôi</h1>
                        </div>
                    </div>

                    <div className=" items-center grid justify-center col-span-2 max-lg:col-span-1">
                        <img src={screen} alt="screen" className="object-contain h-[80px] " />
                    </div>
                    <div className=" grid-rows-4 custom-height-sm10 text-[13px] justify-end grid gap-1 pt-2 items-center  pr-3">
                        <div className="flex">
                            <div className="bg-[#a4eafa] custom-height-sm11 px-6"></div>
                            <h1 className="ml-3">Ghế đang chọn</h1>
                        </div>
                        <div className="flex">
                            <div className="bg-[#8282fd] custom-height-sm11 px-6"></div>
                            <h1 className="ml-3">Ghế đang giữ</h1>
                        </div>
                        <div className="flex">
                            <div className="bg-[#fe888a] px-6"></div>
                            <h1 className="ml-3">Ghế đã đặt</h1>
                        </div>
                        <div className="flex">
                            <div className="bg-[#fcdc8b] px-6"></div>
                            <h1 className="ml-3">Ghế bảo trì</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row-span-4 max-lg:row-span-5 mt-3 custom-height-sm12  ">
                {/* <div className="grid grid-cols-10 px-40 max-lg:px-5 max-air:gap-[6px] gap-3 custom-height-sm14 mt-2">
                    {seats.map((seat) => (
                        <div
                            key={seat.id}
                            className={`relative flex text-[13px] justify-center items-center 
                             ${seat.ten_san_pham === 'Ghế Thường' ? 'h-[22px]' : 'h-[35px]'} 
                            ${seat.ten_san_pham === 'Ghế Thường' ? ' custom-height-md3 ' : ' custom-height-md4'} 
                          ${seat.ten_san_pham === 'Ghế Thường' ? 'custom-height-sm6 ' : ' custom-height-sm7'} 
                            w-full cursor-pointer`}
                            onClick={() => handleSeatClick(seat.id)}
                            style={{
                                gridColumn: seat.ten_san_pham === 'Ghế Đôi' ? 'span 2' : 'span 1', // Ghế VIP chiếm 2 cột
                            }}
                        >
                            <div className="relative w-full h-full">
                                <img
                                    src={seat.anh_san_pham}
                                    alt={seat.ten_san_pham}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    className={`absolute inset-0 ${
                                        seat.trang_thai === 1
                                            ? 'bg-[#3ad3f6]'
                                            : seat.trang_thai === 4
                                            ? 'bg-[#f4bd33]'
                                            : seat.trang_thai === 3
                                            ? 'bg-[#ec3a3a]'
                                            : seat.trang_thai === 2
                                            ? 'bg-[#3c3cf4]'
                                            : 'bg-transparent'
                                    } opacity-99 mix-blend-overlay`}
                                />
                            </div>
                            <div className="absolute text-[12px] text-center">{seat.so_ghe}</div>
                        </div>
                    ))}
                </div> */}

                <div className=" justify-center items-center flex ">
                    <div
                        className={`grid ${gridColumns} px-40 max-lg:px-5 max-air:gap-[6px] gap-[7px] custom-height-sm14  `}
                    >
                        {seat1.map((seat) => {
                            return (
                                <div
                                    key={seat.code}
                                    className={` flex text-[13px] justify-center items-center 
                                        ${seat.name === 'Ghế thường' ? 'h-[25px]' : 'h-[38px]'} 
                                        ${seat.name === 'Ghế thường' ? 'custom-height-md3' : 'custom-height-md4'} 
                                        ${seat.name === 'Ghế thường' ? 'custom-height-sm18' : 'custom-height-sm19'} 
                                        w-full cursor-pointer`}
                                    style={{
                                        gridColumn: seat.name === 'Ghế đôi' ? 'span 2' : 'span 1',
                                    }}
                                    onClick={() => {
                                        handleSeatClick(seat);
                                    }}
                                >
                                    <div className="relative w-full h-full ">
                                        <img src={seat.image} alt={seat.name} className="object-cover w-full h-full" />
                                        <div
                                            className={`absolute inset-0 ${
                                                seat.status === 4 ? 'bg-[#f4bd33]' : 'bg-transparent'
                                            } opacity-99 mix-blend-overlay`}
                                        />
                                    </div>
                                    <div className="absolute text-[12px] text-center">{seat.seatNumber}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SeatComponent;
