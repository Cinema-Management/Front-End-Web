import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';

const Schedule = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => setOpen(false);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [visibleRooms, setVisibleRooms] = useState({});

    const toggleVisibility = (roomId) => {
        setVisibleRooms((prevState) => ({
            ...prevState,
            [roomId]: !prevState[roomId],
        }));
    };
    const toggleDropdown = (roomId) => {
        setIsDropdownOpen((prevState) => ({
            ...prevState,
            [roomId]: !prevState[roomId],
        }));
    };
    const optionCV = [
        { value: '0', label: 'Chọn' },
        { value: 'GLX', label: 'Galaxy Quang Trung' },
        { value: 'LT', label: 'Lotte Gò Vấp' },
    ];

    const rooms = [
        {
            id: 1,
            name: 'Phòng 1',
            dimension: '3D',
            seats: 70,
            schedules: [
                {
                    id: 'a',
                    time: '08:00 - 09:35',
                    film: 'Đẹp trai thấy sai sai',
                    status: 'Active',
                },
                {
                    id: 'b',
                    time: '10:00 - 11:30',
                    film: 'Đẹp trai thấy sai sai',
                    status: 'InActive',
                },
            ],
        },
        {
            id: 2,
            name: 'Phòng 2',
            dimension: '2D',
            seats: 50,
            schedules: [
                {
                    id: 'c',
                    time: '09:00 - 10:30',
                    film: 'Ma da',
                    status: 'Active',
                },
            ],
        },
        {
            id: 3,
            name: 'Phòng 3',
            dimension: '3D',
            seats: 60,
            schedules: [
                {
                    id: 'd',
                    time: '11:00 - 12:30',
                    film: 'Hai Muối',
                    status: 'Active',
                },
                {
                    id: 'e',
                    time: '14:00 - 15:30',
                    film: 'Làm giàu với ma',
                    status: 'Active',
                },
            ],
        },
    ];
    const [selectedMovie, setSelectedMovie] = useState('');
    const nuoc = [
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
    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Suất chiếu</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên rạp"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Tên rạp"
                        heightSelect={200}
                        borderRadius={'10px'}
                    />
                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên phim"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Tên phim"
                        heightSelect={200}
                        borderRadius={'10px'}
                    />
                    <InputComponent className="rounded-[10px] " title="Ngày chiếu" type="date" />
                    <div className="relative w-full ">
                        <MdSwapVert className="absolute bottom-[10px] left-2" />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionCV}
                            title="Sắp xếp"
                            className="pl-3"
                            selectStyles={{ borderRadius: '10px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border  h-[515px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="bg-[#eeaf56] text-[13px] text-white py-2 font-semibold grid grid-cols-3 items-center gap-3 rounded-lg">
                    <h1 className="uppercase grid justify-center items-center">Phòng</h1>
                    <h1 className="uppercase grid  justify-center items-center">Loại phòng</h1>
                    <h1 className="uppercase grid justify-center items-center">Số lượng ghế</h1>
                </div>
                <div className="overflow-auto h-[92%] height-sm-1 ">
                    {rooms.map((room) => (
                        <div key={room.id}>
                            <div className="bg-[#E6E6E6] text-[14px] py-2 font-normal uppercase text-slate-500 grid grid-cols-3 items-center gap-3 mb-2 ">
                                <div className="grid grid-cols-10 items-center gap-5">
                                    <div
                                        className="justify-center items-center col-span-3 grid"
                                        onClick={() => {
                                            toggleVisibility(room.id);
                                            toggleDropdown(room.id);
                                        }}
                                    >
                                        {isDropdownOpen[room.id] ? (
                                            <FaChevronUp color="gray" size={20} />
                                        ) : (
                                            <FaChevronDown color="gray" size={20} />
                                        )}
                                    </div>
                                    <h1 className="uppercase grid col-span-7">{room.name}</h1>
                                </div>
                                <h1 className="grid justify-center items-center">{room.dimension}</h1>
                                <h1 className="grid justify-center items-center">{room.seats}</h1>
                            </div>
                            {visibleRooms[room.id] && (
                                <>
                                    <div className="border-b py-[2px] text-sm font-bold text-slate-500 grid grid-cols-9 items-center gap-3">
                                        <h1 className="uppercase grid col-span-2 justify-center items-center">
                                            Thời gian
                                        </h1>
                                        <h1 className="uppercase grid col-span-4 justify-center items-center">Phim</h1>
                                        <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                                        <div className="grid justify-center col-span-2">
                                            <button
                                                className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                                onClick={() => handleOpen(false)}
                                            >
                                                <IoIosAddCircleOutline color="white" size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="height-sm-1">
                                        {room.schedules &&
                                            room.schedules.map((item) => (
                                                <div
                                                    className="border-b py-[6px] text-base font-normal text-slate-500 grid grid-cols-9 items-center gap-3"
                                                    key={item.id}
                                                >
                                                    <h1 className=" grid col-span-2 justify-center items-center ">
                                                        {item.time}
                                                    </h1>
                                                    <h1 className=" grid col-span-4 pl-10 items-center">{item.film}</h1>
                                                    <div className="justify-center items-center grid">
                                                        <button
                                                            className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                                                item.status === 'Active'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-400'
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </button>
                                                    </div>
                                                    <div className="justify-center space-x-5 items-center col-span-2 flex ">
                                                        <button className="" onClick={() => handleOpen(true)}>
                                                            <FaRegEdit color="black" size={20} />
                                                        </button>
                                                        <button className="">
                                                            <FaRegEye color="black" fontSize={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="55%"
                height="44%"
                top="35%"
                left="55%"
                smallScreenWidth="75%"
                smallScreenHeight="32%"
                mediumScreenWidth="75%"
                mediumScreenHeight="28%"
                largeScreenWidth="75%"
                largeScreenHeight="24%"
                maxHeightScreenHeight="54%"
                maxHeightScreenWidth="75%"
                heightScreen="40%"
                title={isUpdate ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu'}
                room="Phòng 1"
                date="20/10/2024"
            >
                <div className="grid ">
                    <div className="grid grid-cols-2 gap-16 p-2">
                        <InputComponent
                            placeholder="Nhập số cột"
                            title="Thời gian"
                            className="rounded-[5px] "
                            type="time"
                        />
                        <AutoInputComponent
                            options={nuoc.map((option) => option.name)}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Tên phim"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Tên phim"
                            heightSelect={200}
                        />
                    </div>
                    <div className="grid items-center p-2 ">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="online"
                                name="status"
                                value="Online"
                                className="p-20 h-10"
                                style={{ width: '20px', height: '20px' }}
                                defaultChecked
                            />
                            <label htmlFor="online" className="text-[16px] ml-3 ">
                                Tất cả suất chiếu còn lại trong ngày
                            </label>
                        </div>
                    </div>
                    <div className="grid ">
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-16 p-2">
                                <SelectComponent
                                    value={selectedValue}
                                    onChange={handleChange}
                                    title="Âm thanh"
                                    options={optionCV}
                                    className="grid "
                                />
                                <SelectComponent
                                    value={selectedValue}
                                    onChange={handleChange}
                                    title="Phụ đề"
                                    options={optionCV}
                                    className="grid "
                                />
                            </div>
                            <div className="justify-end flex space-x-3 border-t pt-4 pr-4">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Schedule;
