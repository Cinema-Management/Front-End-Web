import React, { useState } from 'react';
import screen from '~/assets/screen.png';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Room = () => {
    const [open, setOpen] = useState(false);
    const [selectSeat, setSelectSeat] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    const urlImageSeat = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/Seat.png';
    const urlImageSeatVip = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_vip.png';
    const urlImageSeatCouple = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_couple.png';

    const handleClickSeat = (selectedSeat) => {
        handleOpen();
        setSelectSeat(selectedSeat);
    };

    const getRoomCode = useSelector((state) => state.room.roomByCode?.currentRoomByCode);
    const roomCode = getRoomCode;

    const fetchSeatByRoomCode = async (roomCode) => {
        try {
            const response = await axios.get(`api/products/getAllSeatsByRoomCode/${roomCode}`);
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

    // const seat1 = useSelector((state) => state.seat.seat.currentSeat);

    const {
        data: seat1 = [],
        isLoading,
        error,
        // refetch,
    } = useQuery(['fetchSeatByRoomCode', roomCode], () => fetchSeatByRoomCode(roomCode), {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        enabled: !!roomCode, // Chỉ fetch khi roomCode có giá trị
    });

    if (isLoading) return <Loading />;

    if (error) {
        return <div>Lỗi khi tải danh sách ghế: {error.message}</div>;
    }
    const totalSeat = seat1.length; // Kích thước phòng có thể là nhỏ, vừa, lớn

    const gridColumns = totalSeat === 48 ? 'grid-cols-8' : totalSeat === 75 ? 'grid-cols-10' : 'grid-cols-12'; // Số cột tuỳ vào kích thước phòng

    return (
        <div className="grid h-[670px] rounded-[10px] custom-height-md1 custom-height-xl1 custom-height-lg1 custom-height-sm17 custom-height-xs1 bg-white">
            <h1 className=" text-2xl font-bold  uppercase m-2 ">Phòng 1</h1>
            <div className=" grid max-lg:row-span-2 ">
                <div className=" grid h-[80px]">
                    <div className=" items-center grid justify-center col-span-2 max-lg:col-span-1">
                        <img src={screen} alt="screen" className="object-contain h-[80px]  " />
                    </div>
                </div>
            </div>
            <div className="row-span-4 max-lg:row-span-5 mt-2 custom-height-sm12  ">
                <div className=" justify-center items-center flex ">
                    <div
                        className={`grid ${gridColumns} w-[70%] max-lg:w-[85%] px-36 max-lg:px-5 gap-3 custom-height-sm14 `}
                    >
                        {seat1.map((seat, index) => {
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
                                        handleClickSeat(seat);
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
                <div className="grid grid-cols-4 mx-2  lg:px-32  text-[13px] gap-1 justify-center items-center ">
                    <div className="flex justify-center items-center">
                        <img src={urlImageSeat} alt="seat" className="object-contain h-[28px] " />
                        <h1 className="ml-3">Ghế thường</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src={urlImageSeatVip} alt="seat" className="object-contain h-[35px] " />
                        <h1 className="ml-3">Ghế vip</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src={urlImageSeatCouple} alt="seat" className="object-contain h-[35px] " />
                        <h1 className="ml-3">Ghế đôi</h1>
                    </div>
                    <div className="flex  justify-center items-center">
                        <button className="px-6 py-3 bg-[#F1BE3F]"></button>
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
                            <img src={urlImageSeat} alt="seat" className="object-contain h-[25px] " />
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
                            <img src={urlImageSeatVip} alt="seat" className="object-contain h-[33px] " />
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
                            <img src={urlImageSeatCouple} alt="seat" className="object-contain h-[33px] " />
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

export default Room;
