import React, { useEffect, useMemo, useState } from 'react';
import screen from '~/assets/screen.png';
import seatvip from '~/assets/Seatvip.png';
import seat from '~/assets/Seat.png';
import seatcouple from '~/assets/Seatcouple.png';
import { FaRegEdit } from 'react-icons/fa';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
const Roome = () => {
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

    const [seats, setSeats] = useState(data);
    const [open, setOpen] = useState(false);
    const [selectSeat, setSelectSeat] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    useEffect(() => {
        setSeats(data);
    }, [data]);
    const handleClickSeat = (selectedSeat) => {
        handleOpen();
        setSelectSeat(selectedSeat);
    };

    console.log(selectSeat);
    return (
        <div className="grid h-[670px] rounded-[10px] custom-height-md1 custom-height-xl1 custom-height-lg1 custom-height-sm17 bg-white">
            <h1 className=" text-2xl font-bold  uppercase p-2">Phòng 1</h1>
            <div className=" grid max-lg:row-span-2 ">
                <div className=" grid h-[80px]">
                    <div className=" items-center grid justify-center col-span-2 max-lg:col-span-1">
                        <img src={screen} alt="screen" className="object-contain h-[80px] " />
                    </div>
                </div>
            </div>
            <div className="row-span-4 max-lg:row-span-5 mt-3 custom-height-sm12  ">
                <div className=" justify-center items-center flex ">
                    <div className="grid grid-cols-10 w-[70%] max-lg:w-[85%] px-36 max-lg:px-5 gap-3 custom-height-sm14 mt-2 ">
                        {seats.map((seat, index) => {
                            const isRegularOrVIP =
                                seat.ten_san_pham === 'Ghế Thường' || seat.ten_san_pham === 'Ghế VIP';
                            const isDoubleSeat = seat.ten_san_pham === 'Ghế Đôi';
                            const showEditIcon = isRegularOrVIP
                                ? index % 10 === 9
                                : isDoubleSeat
                                ? index % 5 === 4
                                : false;

                            return (
                                <div
                                    key={seat.id}
                                    className={` flex text-[13px] justify-center items-center 
                                        ${seat.ten_san_pham === 'Ghế Thường' ? 'h-[25px]' : 'h-[38px]'} 
                                        ${
                                            seat.ten_san_pham === 'Ghế Thường'
                                                ? 'custom-height-md3'
                                                : 'custom-height-md4'
                                        } 
                                        ${
                                            seat.ten_san_pham === 'Ghế Thường'
                                                ? 'custom-height-sm18'
                                                : 'custom-height-sm19'
                                        } 
                                        w-full cursor-pointer`}
                                    style={{
                                        gridColumn: seat.ten_san_pham === 'Ghế Đôi' ? 'span 2' : 'span 1',
                                    }}
                                    onClick={() => {
                                        handleClickSeat(seat);
                                    }}
                                >
                                    <div className="relative w-full h-full ">
                                        <img
                                            src={seat.anh_san_pham}
                                            alt={seat.ten_san_pham}
                                            className="object-cover w-full h-full"
                                        />
                                        <div
                                            className={`absolute inset-0 ${
                                                seat.trang_thai === 4 ? 'bg-[#f4bd33]' : 'bg-transparent'
                                            } opacity-99 mix-blend-overlay`}
                                        />
                                        {showEditIcon && (
                                            <button>
                                                <FaRegEdit className="absolute right-[-50px] bottom-1" size={25} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute text-[12px] text-center">{seat.so_ghe}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-4  mt-6 lg:px-32  text-[13px] gap-1 justify-center items-center">
                    <div className="flex justify-center items-center">
                        <img src={seat} alt="seat" className="object-contain h-[28px] " />
                        <h1 className="ml-3">Ghế thường</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src={seatvip} alt="seat" className="object-contain h-[35px] " />
                        <h1 className="ml-3">Ghế vip</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src={seatcouple} alt="seat" className="object-contain h-[35px] " />
                        <h1 className="ml-3">Ghế đôi</h1>
                    </div>
                    <div className="flex  justify-center items-center">
                        <button className="px-4 py-1 bg-[#F1BE3F]">X</button>
                        <h1 className="ml-3">Ghế bảo trì</h1>
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="23%"
                height="63%"
                smallScreenWidth="45%"
                smallScreenHeight="33%"
                mediumScreenWidth="45%"
                mediumScreenHeight="30%"
                largeScreenHeight="25%"
                largeScreenWidth="45%"
                maxHeightScreenHeight="55%"
                maxHeightScreenWidth="45%"
                heightScreen="45%"
                title="Chỉnh sửa ghế phòng 1"
            >
                <div className=" h-[80%] grid grid-rows-10 pb-6 gap-8 ">
                    <h1 className="text-base font-bold p-3">Ghế đang chọn : {selectSeat?.so_ghe}</h1>

                    <div className="flex p-2">
                        <input
                            type="radio"
                            id="regular"
                            name="seat"
                            value="regular"
                            className="h-5 w-5 mt-1 cursor-pointer"
                        />
                        <div className="flex ml-4">
                            <img src={seat} alt="seat" className="object-contain h-[25px] " />
                            <h1 className="ml-3">Ghế thường</h1>
                        </div>
                    </div>
                    <div className="flex p-2">
                        <input
                            type="radio"
                            id="regular"
                            name="seat"
                            value="regular"
                            className="h-5 w-5 mt-1 cursor-pointer"
                        />
                        <div className="flex ml-4">
                            <img src={seatvip} alt="seat" className="object-contain h-[33px] " />
                            <h1 className="ml-3">Ghế víp</h1>
                        </div>
                    </div>
                    <div className="flex p-2">
                        <input
                            type="radio"
                            id="regular"
                            name="seat"
                            value="regular"
                            className="h-5 w-5 mt-1 cursor-pointer"
                        />
                        <div className="flex ml-4">
                            <img src={seatcouple} alt="seat" className="object-contain h-[33px] " />
                            <h1 className="ml-3">Ghế đôi</h1>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h1 className="text-lg font-bold  p-2">Trạng thái</h1>
                        <button className="text-[14px] px-3 rounded-[8px] h-[30px] m-2 bg-[#22E242]">Online</button>
                    </div>
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Căn phải"
                        freeSolo={true}
                        disableClearable={false}
                        disabled={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-2 row-span-2"
                    />
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Căn trái"
                        freeSolo={true}
                        disableClearable={false}
                        disabled={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-2 row-span-2"
                    />
                    <div className="justify-end flex space-x-3 border-t py-4 px-4 mt-4 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                        <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Roome;
