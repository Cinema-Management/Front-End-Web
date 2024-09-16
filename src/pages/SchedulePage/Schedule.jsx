import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
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
            name: 'Room 1',
            dimension: '3D',
            seats: 70,
            schedules: [
                {
                    id: 'a',
                    time: '08:00 - 09:35',
                    film: 'Đẹp trai thấy sai sai',
                    status: 'Online',
                },
                {
                    id: 'b',
                    time: '10:00 - 11:30',
                    film: 'Đẹp trai thấy sai sai',
                    status: 'Offline',
                },
            ],
        },
        {
            id: 2,
            name: 'Room 2',
            dimension: '2D',
            seats: 50,
            schedules: [
                {
                    id: 'c',
                    time: '09:00 - 10:30',
                    film: 'Ma da',
                    status: 'Online',
                },
            ],
        },
        {
            id: 3,
            name: 'Room 3',
            dimension: '3D',
            seats: 60,
            schedules: [
                {
                    id: 'd',
                    time: '11:00 - 12:30',
                    film: 'Hai Muối',
                    status: 'Online',
                },
                {
                    id: 'e',
                    time: '14:00 - 15:30',
                    film: 'Làm giàu với ma',
                    status: 'Offline',
                },
            ],
        },
    ];

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1  px-10 py-3 h-40">
                <h1 className="font-bold text-[20px] ">Suất Chiếu</h1>
                <div className=" grid grid-cols-7  gap-3  max-lg:gap-[26px] max-xl900:gap-[6px] xl:gap-[90px] items-center w-full h-16 ">
                    <div className="rounded-2xl border-[#eebebe] col-span-3   h-12 w-full flex ">
                        <h2 className=" bg-gray-400 text-[#454545] pc:w-[25%] md:w-[45%] w-2/6 flex rounded-s-2xl  items-center z-20 h-full pl-2">
                            Ngày chiếu
                        </h2>
                        <InputComponent
                            placeholder="Nhập tên nhân viên"
                            className=" h-full focus:outline-none  rounded-none mt-[-4px] rounded-se-2xl rounded-ee-2xl"
                            type="date"
                            className1=" w-4/6  pc:w-[75%] md:w-[55%] rounded-se-2xl rounded-ee-2xl"
                        />
                    </div>
                    <div className="grid  col-span-4 grid-cols-5 max-lg:grid-cols-4 gap-5">
                        <div className="col-span-3 rounded-2xl   border-[gray] h-12 flex ">
                            <h2 className=" bg-gray-400 text-[#454545] pc:w-[15%] max-lg:w-[23%] w-[28%] flex rounded-s-2xl  items-center z-20 h-full pl-2">
                                Rạp
                            </h2>
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                options={optionCV}
                                className="h-full select-rap  rounded-none mt-[-5px] "
                                className1=" w-[72%]  pc:w-[85%] max-lg:w-[83%] rounded-se-2xl rounded-ee-2xl "
                                selectStyles={{ borderRadius: '0px 20px 20px 0px' }}
                            />
                        </div>
                        <div className="grid items-center">
                            <button className="bg-[#007AFF] text-white rounded-[10px] h-[80%]">Tìm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border  h-[500px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="bg-[#eeaf56] text-base text-white py-1 font-semibold grid grid-cols-3 items-center gap-3 rounded-lg">
                    <h1 className="uppercase grid justify-center items-center">Phòng</h1>
                    <h1 className="uppercase grid  justify-center items-center">Loại phòng</h1>
                    <h1 className="uppercase grid justify-center items-center">Số lượng ghế</h1>
                </div>
                <div className="overflow-auto h-[92%] height-sm-1 ">
                    {rooms.map((room) => (
                        <div key={room.id}>
                            <div className="bg-[#E6E6E6] text-base py-1 font-normal uppercase text-slate-500 grid grid-cols-3 items-center gap-3 mb-2 ">
                                <div className="flex relative justify-around items-center">
                                    <button
                                        className="absolute left-3"
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
                                    </button>
                                    <h1 className="">{room.name}</h1>
                                </div>
                                <h1 className="grid justify-center items-center">{room.dimension}</h1>
                                <h1 className="grid justify-center items-center">{room.seats}</h1>
                            </div>
                            {visibleRooms[room.id] && (
                                <>
                                    <div className="border-b  text-sm font-bold text-slate-500 grid grid-cols-9 items-center gap-3">
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
                                                    className="border-b py-2 text-base font-normal text-slate-500 grid grid-cols-9 items-center gap-3"
                                                    key={item.id}
                                                >
                                                    <h1 className=" grid col-span-2 justify-center items-center ">
                                                        {item.time}
                                                    </h1>
                                                    <h1 className=" grid col-span-4 justify-center items-center">
                                                        {item.film}
                                                    </h1>
                                                    <div className="justify-center items-center grid">
                                                        <button
                                                            className={`border px-3 text-white text-xs py-[2px] flex rounded-[40px] uppercase ${
                                                                item.status === 'Online'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-400'
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </button>
                                                    </div>
                                                    <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                        <button className="" onClick={() => handleOpen(true)}>
                                                            <FaRegEdit color="black" size={22} />
                                                        </button>
                                                        <button className="">
                                                            <FaRegEye color="black" fontSize={22} />
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
                height="45%"
                top="35%"
                left="55%"
                smallScreenWidth="75%"
                smallScreenHeight="33%"
                mediumScreenWidth="75%"
                mediumScreenHeight="28%"
                largeScreenWidth="75%"
                largeScreenHeight="25%"
                maxHeightScreenHeight="57%"
                maxHeightScreenWidth="75%"
                title={isUpdate ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu'}
                room="Phòng 1"
                date="20/10/2024"
            >
                <div className="grid grid-rows-2 p-3 ">
                    <div className="grid grid-cols-2 gap-16 ">
                        <InputComponent
                            placeholder="Nhập số cột"
                            title="Thời gian"
                            className="rounded-[5px] "
                            type="time"
                        />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            title="Tên phim"
                            options={optionCV}
                            className="grid "
                        />
                    </div>
                    <div className="grid items-center">
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
                    <div className="grid">
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-16">
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
                            <div className="justify-end flex space-x-3 ">
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
