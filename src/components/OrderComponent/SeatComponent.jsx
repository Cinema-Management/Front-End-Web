import React, { memo, useEffect, useMemo, useState } from 'react';
import screen from '~/assets/screen.png';
import seatvip from '~/assets/Seatvip.png';
import seat from '~/assets/Seat.png';
import seatcouple from '~/assets/Seatcouple.png';

const SeatComponent = memo(({ setSetGhe }) => {
    const data = useMemo(
        () => [
            // Ghế thường
            {
                id: '1',
                ma_san_pham: 'SP1',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 1,
                so_ghe: 'A1',
                kieu: 0,
                trang_thai: 0,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '2',
                ma_san_pham: 'SP2',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 2,
                so_ghe: 'A2',
                kieu: 0,
                trang_thai: 3,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '3',
                ma_san_pham: 'SP3',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 3,
                so_ghe: 'A3',
                kieu: 0,
                trang_thai: 0,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '4',
                ma_san_pham: 'SP4',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 4,
                so_ghe: 'A4',
                kieu: 0,
                trang_thai: 3,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '5',
                ma_san_pham: 'SP5',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 5,
                so_ghe: 'A5',
                kieu: 0,
                trang_thai: 0,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '6',
                ma_san_pham: 'SP6',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 6,
                so_ghe: 'A6',
                kieu: 0,
                trang_thai: 0,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '7',
                ma_san_pham: 'SP7',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 7,
                so_ghe: 'A7',
                kieu: 0,
                trang_thai: 3,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '8',
                ma_san_pham: 'SP8',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 8,
                so_ghe: 'A8',
                kieu: 0,
                trang_thai: 0,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '9',
                ma_san_pham: 'SP9',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 9,
                so_ghe: 'A9',
                kieu: 0,
                trang_thai: 3,
                gia: 70000, // Giá ghế thường
            },
            {
                id: '10',
                ma_san_pham: 'SP10',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Thường',
                anh_san_pham: seat,
                vi_tri_hang: 'A',
                vi_tri_cot: 10,
                so_ghe: 'A10',
                kieu: 0,
                trang_thai: 4,
                gia: 70000, // Giá ghế thường
            },

            // Ghế VIP
            {
                id: '11',
                ma_san_pham: 'SP11',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 1,
                so_ghe: 'B1',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '12',
                ma_san_pham: 'SP12',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 2,
                so_ghe: 'B2',
                kieu: 1,
                trang_thai: 3,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '13',
                ma_san_pham: 'SP13',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 3,
                so_ghe: 'B3',
                kieu: 1,
                trang_thai: 4,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '14',
                ma_san_pham: 'SP14',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 4,
                so_ghe: 'B4',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '15',
                ma_san_pham: 'SP15',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 5,
                so_ghe: 'B5',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '16',
                ma_san_pham: 'SP16',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 6,
                so_ghe: 'B6',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '17',
                ma_san_pham: 'SP17',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 7,
                so_ghe: 'B7',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '18',
                ma_san_pham: 'SP18',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 8,
                so_ghe: 'B8',
                kieu: 1,
                trang_thai: 2,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '19',
                ma_san_pham: 'SP19',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 9,
                so_ghe: 'B9',
                kieu: 1,
                trang_thai: 2,
                gia: 100000, // Giá ghế VIP
            },
            {
                id: '20',
                ma_san_pham: 'SP20',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế VIP',
                anh_san_pham: seatvip,
                vi_tri_hang: 'B',
                vi_tri_cot: 10,
                so_ghe: 'B10',
                kieu: 1,
                trang_thai: 0,
                gia: 100000, // Giá ghế VIP
            },

            // Ghế đôi
            {
                id: '21',
                ma_san_pham: 'SP21',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 1,
                so_ghe: 'C1',
                kieu: 2,
                trang_thai: 0,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '22',
                ma_san_pham: 'SP22',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 2,
                so_ghe: 'C2',
                kieu: 2,
                trang_thai: 3,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '23',
                ma_san_pham: 'SP23',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 3,
                so_ghe: 'C3',
                kieu: 2,
                trang_thai: 0,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '24',
                ma_san_pham: 'SP24',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 4,
                so_ghe: 'C4',
                kieu: 2,
                trang_thai: 3,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '25',
                ma_san_pham: 'SP25',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 5,
                so_ghe: 'C5',
                kieu: 2,
                trang_thai: 3,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '26',
                ma_san_pham: 'SP26',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 6,
                so_ghe: 'C6',
                kieu: 2,
                trang_thai: 0,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '27',
                ma_san_pham: 'SP27',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 7,
                so_ghe: 'C7',
                kieu: 2,
                trang_thai: 0,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '28',
                ma_san_pham: 'SP28',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 8,
                so_ghe: 'C8',
                kieu: 2,
                trang_thai: 3,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '29',
                ma_san_pham: 'SP29',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 9,
                so_ghe: 'C9',
                kieu: 2,
                trang_thai: 3,
                gia: 150000, // Giá ghế đôi
            },
            {
                id: '30',
                ma_san_pham: 'SP30',
                ma_phong: 'PH1',
                ten_san_pham: 'Ghế Đôi',
                anh_san_pham: seatcouple,
                vi_tri_hang: 'C',
                vi_tri_cot: 10,
                so_ghe: 'C10',
                kieu: 2,
                trang_thai: 0,
                gia: 150000, // Giá ghế đôi
            },
        ],
        [],
    );

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seats, setSeats] = useState(data);
    console.log('Rendering SeatComponent', selectedSeats);

    useEffect(() => {
        setSetGhe(selectedSeats);
    }, [selectedSeats, setSetGhe]);

    useEffect(() => {
        setSeats(data);
    }, [data]);

    const handleSeatClick = (seatId) => {
        setSelectedSeats((prevSelected) => {
            // Tìm ghế được click
            const clickedSeat = seats.find((seat) => seat.id === seatId);

            if (clickedSeat) {
                const isSelected = prevSelected.some((seat) => seat.id === seatId);

                if (isSelected && clickedSeat.trang_thai === 1) {
                    // Nếu ghế đã được chọn và có trạng thái 1, bỏ chọn ghế (trả lại trạng thái 0)
                    const updatedSeats = seats.map((seat) => (seat.id === seatId ? { ...seat, trang_thai: 0 } : seat));
                    setSeats(updatedSeats);

                    // Trả về mảng mới sau khi loại bỏ ghế khỏi selectedSeats
                    return prevSelected.filter((seat) => seat.id !== seatId);
                } else if (clickedSeat.trang_thai === 0) {
                    // Nếu ghế có trạng thái 0, chọn ghế (đổi thành trạng thái 1)
                    const updatedSeats = seats.map((seat) => (seat.id === seatId ? { ...seat, trang_thai: 1 } : seat));
                    setSeats(updatedSeats);

                    // Log object ghế đã chọn

                    // Thêm object ghế vào mảng selectedSeats
                    return [...prevSelected, clickedSeat];
                }
            }

            // Trả về mảng trước đó nếu không có thay đổi
            return prevSelected;
        });
    };
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
                <div className="grid grid-cols-10 px-40 max-lg:px-5 max-air:gap-[6px] gap-3 custom-height-sm14 mt-2">
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
                </div>
            </div>
        </div>
    );
});

export default SeatComponent;
