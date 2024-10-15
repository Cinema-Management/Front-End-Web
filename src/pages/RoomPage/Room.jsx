import React, { useState } from 'react';
import screen from '~/assets/screen.png';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Room = () => {
    const [open, setOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const urlImageSeat = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/Seat.png';
    const urlImageSeatVip = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_vip.png';
    const urlImageSeatCouple = 'https://td-cinemas.s3.ap-southeast-1.amazonaws.com/seat_couple.png';

    const optionStatusSeat = [
        { value: 0, name: 'Bảo trì' },

        { value: 1, name: 'Hoạt động' },
    ];

    const room = useSelector((state) => state.room.room?.currentRoom);

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

    const handleUpdateStatus = async () => {
        try {
            if (selectedStatus) {
                const status = optionStatusSeat.find((item) => item.name === selectedStatus).value;

                const res = await axios.post(`api/products/updateStatus/${selectedSeat?.code}`, {
                    status: status,
                });
                if (res.data) {
                    toast.success('Cập nhật trạng thái ghế thành công');
                    refetch();
                    handleClose();
                }
            }
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

    const queryClient = useQueryClient();

    const mutation = useMutation(handleUpdateStatus, {
        onSuccess: () => {
            // Refetch dữ liệu cần thiết
            queryClient.refetchQueries('fetchSeatByRoomCode');
        },
    });

    const {
        data: seat1 = [],
        isLoading,
        error,
        refetch,
    } = useQuery(['fetchSeatByRoomCode1', room?.code], () => fetchSeatByRoomCode(room?.code), {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        enabled: !!room?.code,
        refetchInterval: 1000 * 60 * 3,
    });

    if (isLoading) return <Loading />;

    if (error) {
        return <div>Lỗi khi tải danh sách ghế: {error.message}</div>;
    }
    const totalSeat = seat1.length; // Kích thước phòng có thể là nhỏ, vừa, lớn

    const gridColumns = totalSeat === 48 ? 'grid-cols-8' : totalSeat === 75 ? 'grid-cols-10' : 'grid-cols-12'; // Số cột tuỳ vào kích thước phòng

    return (
        <div className="grid h-[670px] rounded-[10px] custom-height-md1 custom-height-xl1 custom-height-lg1 custom-height-sm17 custom-height-xs1 bg-white">
            <h1 className=" text-2xl font-bold   m-2 ">
                {room?.nameCinema} | {room?.name}
            </h1>
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
                                        w-full cursor-pointer
                                        
                                        
                                        ${seat.seatStatus === 1 ? 'pointer-events-none ' : ''}
                                        `}
                                    style={{
                                        gridColumn: seat.name === 'Ghế đôi' ? 'span 2' : 'span 1',
                                    }}
                                    onClick={() => {
                                        handleOpen();
                                        setSelectedSeat(seat);
                                        setSelectedStatus(
                                            optionStatusSeat.find((item) => item.value === seat.status).name,
                                        );
                                    }}
                                >
                                    <div className="relative w-full h-full ">
                                        <img src={seat.image} alt={seat.name} className="object-cover w-full h-full" />
                                        <div
                                            className={`absolute inset-0 ${
                                                seat.seatStatus === 1
                                                    ? 'bg-[#ec3a3a]' // đã có suất chiếu
                                                    : seat.status === 0
                                                    ? 'bg-[#fcc02b]'
                                                    : 'bg-transparent'
                                            } opacity-99 mix-blend-overlay`}
                                        />
                                    </div>
                                    <div className="absolute text-[12px] text-center">{seat.seatNumber}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-5 mx-2  lg:px-32  text-[13px] gap-1 justify-center items-center  ">
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
                        <button className="px-6 py-3 bg-[#fcebc2]"></button>
                        <h1 className="ml-3">Ghế bảo trì</h1>
                    </div>

                    <div className="flex  justify-center items-center">
                        <button className="px-6 py-3 bg-[#f9c4c4]"></button>
                        <h1 className="ml-3">Ghế đã được đặt</h1>
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="23%"
                height="25%"
                smallScreenWidth="45%"
                smallScreenHeight="33%"
                mediumScreenWidth="45%"
                mediumScreenHeight="30%"
                largeScreenHeight="25%"
                largeScreenWidth="45%"
                maxHeightScreenHeight="35%"
                maxHeightScreenWidth="25%"
                heightScreen="25%"
                title={'Cập nhật ghế: ' + selectedSeat.seatNumber}
            >
                <div className=" h-[80%] grid grid-rows-10 pb-6 gap-8 ">
                    <AutoInputComponent
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={optionStatusSeat.map((item) => item.name)}
                        title="Trạng thái"
                        freeSolo={false}
                        disableClearable={true}
                        placeholder="Chọn"
                        heightSelect={200}
                        className1="p-2 row-span-2"
                    />
                    <div className="justify-end flex space-x-3 border-t py-4 px-4 mt-4 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                        <ButtonComponent
                            text="Xác nhận"
                            className=" bg-blue-500 "
                            onClick={() => {
                                mutation.mutate();
                            }}
                        />
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Room;
