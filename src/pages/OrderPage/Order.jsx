import React, { lazy, useState } from 'react';
import InputComponent from '~/components/InputComponent/InputComponent';
import { IoIosArrowBack } from 'react-icons/io';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import phim1 from '~/assets/phim1.png';
import { Button } from '@mui/material';

const Seat = lazy(() => import('~/pages/SeatPage/Seat'));
const Order = () => {
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedCinema, setSelectedCinema] = useState(false);
    const [selectSchedule, setSelectSchedule] = useState(false);

    const movie = [
        {
            id: 1,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Ma Da',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Active',
        },
        {
            id: 2,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Ma Da',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Active',
        },
        {
            id: 3,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Làm giàu với ma',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'InActive',
        },
    ];
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
    const schedules = [
        {
            title: '2D phụ đề anh',
            times: [
                { id: 1, time: '9:30', available: 170 },
                { id: 2, time: '11:00', available: 150 },
                { id: 3, time: '13:30', available: 200 },
                { id: 4, time: '15:00', available: 180 },
            ],
        },
        {
            title: '2D phụ đề nhật',
            times: [
                { id: 5, time: '9:30', available: 170 },
                { id: 6, time: '11:00', available: 150 },
                { id: 7, time: '13:30', available: 200 },
            ],
        },
    ];

    return (
        <div className="max-h-screen">
            {!selectSchedule ? (
                <>
                    <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                        <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Bán vé</h1>
                        <div className="grid grid-cols-3 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                            <AutoInputComponent
                                options={rap.map((option) => option.name)}
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Tên rạp"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                borderRadius="10px"
                            />

                            <AutoInputComponent
                                options={rap.map((option) => option.name)}
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Tên phim"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                borderRadius="10px"
                            />
                            <InputComponent
                                placeholder="Nhập ..."
                                className="rounded-[10px]"
                                title="Ngày chiếu"
                                type="date"
                            />
                        </div>
                    </div>
                    <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 overflow-auto h-[515px] max-h-screen custom-height-sm16 custom-height-md custom-height-lg custom-height-xl2 custom-height-xxl3">
                        {!selectedCinema ? (
                            <div>
                                <div className="grid mb-3 ">
                                    <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">Đang chiếu</h1>
                                    <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                        {movie
                                            .filter((item) => item.status === 'Active')
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border text-center border-[#95989D] shadow-xl grid p-1 rounded-[10px] py-2"
                                                    onClick={() => {
                                                        setSelectedCinema(true);
                                                    }}
                                                >
                                                    <h1 className="font-bold uppercase pl-3">{item.name}</h1>
                                                    <div className="text-center justify-center flex mt-2">
                                                        <img
                                                            src={item.image}
                                                            alt="phim1"
                                                            className="w-36 h-32 object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="grid mt-6 ">
                                    <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">Suất chiếu sớm</h1>
                                    <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                        {movie
                                            .filter((item) => item.status === 'InActive')
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border text-center border-[#95989D] shadow-xl grid p-1 rounded-[10px] py-2"
                                                    onClick={() => {
                                                        setSelectedCinema(true);
                                                    }}
                                                >
                                                    <h1 className="font-bold uppercase pl-3">Đẹp trai thấy sai sai</h1>
                                                    <div className="text-center justify-center flex mt-2">
                                                        <img
                                                            src={phim1}
                                                            alt="phim1"
                                                            className="w-36 h-32 object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 ">
                                <div className="flex mb-6 ">
                                    <Button
                                        variant="contained"
                                        sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                                        onClick={() => {
                                            setSelectedCinema(false);
                                        }}
                                    >
                                        <IoIosArrowBack size={20} />
                                        Quay lại
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-7   max-lg:gap-3 ">
                                    <div className="flex max-lg:col-span-3">
                                        <img src={phim1} alt="phim1" className="w-40 h-64 max-lg:w-28 max-lg:h-48" />
                                        <div className=" pl-3 text-[#95989D] pt-2 space-y-1">
                                            <h1 className="uppercase font-bold text-[14px] ">Đẹp trai thấy sai sai</h1>
                                            <h1 className="bg-[#95989D] text-white w-[40px] text-[12px] text-center rounded-md px-2">
                                                13+
                                            </h1>
                                            <h1 className="text-[12px] ">Hài, Kinh dị</h1>
                                            <h1 className="text-[12px] ">100 phút</h1>
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 max-lg:col-span-4">
                                        {schedules.map((schedule) => (
                                            <div key={schedule.title}>
                                                <h1 className="font-semibold  text-[#95989D] text-[13px] uppercase">
                                                    {schedule.title}
                                                </h1>
                                                <div className="grid grid-cols-8 max-lg:grid-cols-4 gap-3 mt-2 mb-4 pl-3 ">
                                                    {schedule.times.map((time) => (
                                                        <div
                                                            key={time.id}
                                                            className="text-[#95989D] text-[13px] text-center cursor-pointer"
                                                            onClick={() => {
                                                                setSelectSchedule(true);
                                                            }}
                                                        >
                                                            <h1 className="bg-[#95989D] w-full text-white py-1 rounded-md px-2">
                                                                {time.time}
                                                            </h1>
                                                            <h1>{time.available} trống</h1>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <Seat setSelectSchedule={setSelectSchedule} />
            )}
        </div>
    );
};

export default Order;
