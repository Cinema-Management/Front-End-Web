import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';

const Promotion = () => {
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
    const promotions = [
        {
            id: 1,
            name: 'Chương trình khuyến mãi 8-2024',
            start: '1/8/2024',
            end: '1/9/2024',
            status: 'Đang diễn ra',
            promotion: [
                {
                    id: '1',
                    loai: 'Khuyến mãi tiền',
                    mota: 'Giảm trực tiếp vào hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
                {
                    id: '2',
                    loai: 'Khuyến mãi sản phẩm',
                    mota: 'Mua đủ số lượng sẩn phẩm sẽ được tặng  thêm sản phẩm.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
                {
                    id: '3',
                    loai: 'Khuyến mãi hóa đơn',
                    mota: 'Giảm % giá trị hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
            ],
        },
        {
            id: 2,
            name: 'Chương trình khuyến mãi 9-2024',
            start: '1/9/2024',
            end: '1/10/2024',
            status: 'Đang diễn ra',
            promotion: [
                {
                    id: '1',
                    loai: 'Khuyến mãi sản phẩm',
                    mota: 'Mua đủ số lượng sẩn phẩm sẽ được tặng  thêm sản phẩm.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
                {
                    id: '2',
                    loai: 'Khuyến mãi hóa đơn',
                    mota: 'Giảm % giá trị hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
            ],
        },
        {
            id: 3,
            name: 'Chương trình khuyến mãi 10-2024',
            start: '1/10/2024',
            end: '1/11/2024',
            status: 'Đang diễn ra',
            promotion: [
                {
                    id: '1',
                    loai: 'Khuyến mãi hóa đơn',
                    mota: 'Giảm % giá trị hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                },
            ],
        },
    ];
    const optionsLoc = [
        { value: '0', label: 'Lọc thể loại' },
        { value: 'KD', label: 'Kinh dị' },
        { value: 'HH', label: 'Hài hước' },
        { value: 'TC', label: 'Tình cảm' },
    ];
    const optionsSort = [
        { value: '0', label: 'Xếp theo tên' },
        { value: 'A', label: 'A - Z' },
        { value: 'B', label: 'Z - A' },
    ];
    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1  px-10 py-3 h-40">
                <h1 className="font-bold text-[20px] ">Chương trình khuyến mãi</h1>
                <div className="grid grid-cols-3 gap-3 lg:gap-[66px] xl:gap-[111px] items-center w-full h-16">
                    <InputComponent placeholder="Nhập tên" className="rounded-[10px] " />

                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionsLoc}
                        className="border border-[gray]"
                        selectStyles={{ borderRadius: '10px' }}
                    />
                    <div className="relative w-full ">
                        <MdSwapVert className="absolute bottom-3 left-2" />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsSort}
                            className="border border-[gray]  w-full"
                            selectStyles={{ borderRadius: '10px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border  h-[500px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="bg-[#eeaf56] text-base text-white py-1 font-semibold grid grid-cols-7 items-center gap-3 rounded-lg">
                    <h1 className="uppercase grid col-span-3 justify-center items-center">Mô tả</h1>
                    <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                    <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                    <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                    <div className="flex justify-center">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => handleOpen(false)}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                </div>
                <div className="overflow-auto h-[92%] height-sm-1 ">
                    {promotions.map((promotion) => (
                        <div key={promotion.id}>
                            <div className="bg-[#E6E6E6] text-base py-3  font-normal text-slate-500 grid grid-cols-7 items-center gap-3 mb-2 ">
                                <div className="flex col-span-3 relative justify-around items-center">
                                    <button
                                        className="absolute left-3"
                                        onClick={() => {
                                            toggleVisibility(promotion.id);
                                            toggleDropdown(promotion.id);
                                        }}
                                    >
                                        {isDropdownOpen[promotion.id] ? (
                                            <FaChevronUp color="gray" size={20} />
                                        ) : (
                                            <FaChevronDown color="gray" size={20} />
                                        )}
                                    </button>
                                    <h1 className="uppercase">{promotion.name}</h1>
                                </div>
                                <h1 className="grid justify-center items-center">{promotion.start}</h1>
                                <h1 className="grid justify-center items-center">{promotion.end}</h1>
                                <div className="justify-center items-center grid">
                                    <button
                                        className={`border px-3 text-white text-xs py-[4px] flex rounded-[40px] uppercase ${
                                            promotion.status === 'Đang diễn ra' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    >
                                        {promotion.status}
                                    </button>
                                </div>
                                <div className="justify-center grid items-center ">
                                    <button className="" onClick={() => handleOpen(true)}>
                                        <FaRegEdit color="black" size={22} />
                                    </button>
                                </div>
                            </div>
                            {visibleRooms[promotion.id] && (
                                <>
                                    <div className="border-b py-1 text-sm font-bold uppercase text-slate-500 grid grid-cols-10 items-center gap-3">
                                        <h1 className="grid col-span-2 justify-center items-center">Loại KM</h1>
                                        <h1 className="grid col-span-3 justify-center items-center">Mô tả</h1>
                                        <h1 className="grid justify-center items-center">Ngày bắt đầu</h1>
                                        <h1 className="grid justify-center items-center">Ngày kết thúc</h1>
                                        <h1 className="grid justify-center items-center">Trạng thái</h1>
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
                                        {promotion.promotion &&
                                            promotion.promotion.map((item) => (
                                                <div
                                                    className="border-b py-2 text-base font-normal text-slate-500 grid grid-cols-10 items-center gap-3"
                                                    key={item.id}
                                                >
                                                    <h1 className=" grid col-span-2 pl-3 items-center ">{item.loai}</h1>
                                                    <h1 className=" grid col-span-3  items-center">{item.mota}</h1>
                                                    <h1 className=" grid items-center justify-center">{item.start}</h1>
                                                    <h1 className=" grid items-center justify-center">{item.end}</h1>
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
                width="35%"
                height="38%"
                smallScreenWidth="50%"
                smallScreenHeight="35%"
                mediumScreenWidth="50%"
                mediumScreenHeight="30%"
                largeScreenHeight="27%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="60%"
                maxHeightScreenWidth="45%"
                title={isUpdate ? 'Chỉnh sửa chương trình khuyến mãi' : 'Thêm chương trình khuyến mãi'}
            >
                <div className=" h-[80%] grid grid-rows-3 gap-12 ">
                    <div className="grid p-3 ">
                        <InputComponent placeholder="Nhập mô tả" title="Mô tả" className="rounded-[5px] " />
                    </div>

                    <div className="grid items-center row-span-2  gap-2 ">
                        <div className="grid grid-cols-2 gap-8 p-2">
                            <InputComponent title="Ngày bắt đầu" className="rounded-[5px] " type="date" />
                            <InputComponent title="Ngày kết thúc" className="rounded-[5px] " type="date" />
                        </div>
                        <div className="justify-end flex space-x-3 border-t py-2 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Promotion;
