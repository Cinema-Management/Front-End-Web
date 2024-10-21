import React, { memo, useEffect, useState } from 'react';
import screen from '~/assets/screen.png';

import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat } from '~/redux/seatSlice';
const SeatComponent = memo(({ setSetGhe }) => {
    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);
    const fetchSeatByRoomCode = async (code) => {
        try {
            const response = await axios.get(
                `api/seat-status-in-schedules/getAllSeatsStatusInSchedule?scheduleCode=${code}`,
            );
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
        isFetching,
        error,
        // refetch,
    } = useQuery(['fetchSeatByRoomCode', schedule.scheduleCode], () => fetchSeatByRoomCode(schedule.scheduleCode), {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 3,
        enabled: !!schedule.scheduleCode,
    });
    const dispatch = useDispatch();
    const selectedSeatsFromStore = useSelector((state) => state.seat.seat.selectedSeats);
    const arraySeat = selectedSeatsFromStore.map((seat) => seat.code);
    const [selectedSeat, setSelectedSeat] = useState(arraySeat || []);

    useEffect(() => {
        const savedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
        if (savedSeats) {
            setSelectedSeat(savedSeats);
            dispatch(toggleSeat(savedSeats)); // Khôi phục trạng thái ghế trong Redux (nếu cần)
        }
    }, [dispatch]);
    if (isLoading || isFetching) return <Loading />;
    if (error) return <h1>{error.message}</h1>;

    const handleSelectSeat = (seat) => {
        setSelectedSeat((prev) => {
            let updatedSeats;

            // Check if the seat is already selected, remove it if yes, otherwise add it
            if (prev.includes(seat.code)) {
                updatedSeats = prev.filter((code) => code !== seat.code);
            } else {
                updatedSeats = [...prev, seat.code];
            }

            // Dispatch selected seats into Redux for state management
            // dispatch(toggleSeat(updatedSeats));
            return updatedSeats;
        });
    };
    const getSeatClass = (seat) => {
        if (selectedSeat && selectedSeat.includes(seat.code)) {
            return 'bg-[#3ad3f6]'; // Màu khi ghế được chọn
        }

        switch (seat.status) {
            case 2:
                return 'bg-[#3c3cf4]'; // Ghế đã giữ
            case 3:
                return 'bg-[#ec3a3a]'; // Ghế đã đặt
            default:
                // Kiểm tra thêm cho seat.statusSeat
                if (seat.statusSeat === 0) {
                    return 'bg-[#fcc02b]'; // Ghế bảo trì
                }
                return 'bg-transparent'; // Trạng thái mặc định
        }
    };

    // function convertTimeToNumber(timeString) {
    //     const [hours, minutes] = timeString.split(':').map(Number); // Tách giờ và phút
    //     return hours * 100 + minutes; // Ghép lại thành số
    // }

    const handleSeatClick = async (seat) => {
        // Find the seat with additional data (like price) from the fetched seat1 array
        const seatFilter = seat1.find((t) => t.code === seat.code);

        // If seat exists, create a new object with the price
        if (seatFilter) {
            const seatWithPrice = { ...seatFilter, price: seatFilter.price };

            // Dispatch the selected seat into Redux
            dispatch(toggleSeat(seatWithPrice));
        } else {
            toast.error('Seat not found!');
        }
    };

    // console.log('priceDetails', priceDetails);

    const totalSeat = seat1.length; // Kích thước phòng có thể là nhỏ, vừa, lớn

    const gridColumns = totalSeat === 48 ? 'grid-cols-8' : totalSeat === 75 ? 'grid-cols-10' : 'grid-cols-12'; // Số cột tuỳ vào kích thước phòng
    if (seat1.length === 0) return <div className="p-5 ">Bảng giá ghế không có trong ngày này! </div>;
    return (
        <div className="grid grid-rows-5 max-lg:grid-rows-7 h-[550px] custom-height-md2 custom-height-sm15 ">
            <div className=" grid max-lg:row-span-2  ">
                <div className=" grid grid-cols-4 max-lg:grid-cols-3  h-[100px]">
                    <div className="grid grid-rows-3  text-[13px] gap-1 pt-3 pl-3">
                        <div className="flex ">
                            <img
                                src="https://td-cinemas.s3.ap-southeast-1.amazonaws.com/Seat.png"
                                alt="seat"
                                className="object-contain h-[20px] "
                            />
                            <h1 className="ml-3">Ghế thường</h1>
                        </div>
                        <div className="flex">
                            <img
                                src="https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_vip.png"
                                alt="seat"
                                className="object-contain h-[25px] "
                            />
                            <h1 className="ml-3">Ghế vip</h1>
                        </div>
                        <div className="flex">
                            <img
                                src="https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_couple.png"
                                alt="seat"
                                className="object-contain h-[25px] "
                            />
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
                            <div className="bg-[#f9c4c4] px-6"></div>
                            <h1 className="ml-3">Ghế đã đặt</h1>
                        </div>
                        <div className="flex">
                            <div className="bg-[#fcebc2] px-6"></div>
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
                                        w-full ${
                                            seat.status === 1 && seat.statusSeat !== 0
                                                ? 'cursor-pointer'
                                                : 'cursor-default'
                                        }`}
                                    style={{
                                        gridColumn: seat.name === 'Ghế đôi' ? 'span 2' : 'span 1',
                                    }}
                                    onClick={() => {
                                        if (seat.status === 1 && seat.statusSeat !== 0) {
                                            handleSeatClick(seat);
                                            handleSelectSeat(seat);
                                        }
                                    }}
                                >
                                    <div className="relative w-full h-full ">
                                        <img src={seat.image} alt={seat.name} className="object-cover w-full h-full" />
                                        <div
                                            className={`absolute inset-0 ${getSeatClass(
                                                seat,
                                            )} opacity-99 mix-blend-overlay`}
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
