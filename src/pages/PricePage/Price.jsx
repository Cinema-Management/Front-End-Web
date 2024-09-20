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

const Price = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const [openLoaiKM, setOpenLoaiKM] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => setOpen(false);

    const handleOpenLoaiKM = (isUpdate, type) => {
        setOpenLoaiKM(true);
        setIsUpdate(isUpdate);
        setType(type);
    };

    const handleCloseDetail = () => setOpenDetail(false);

    const handleOpenDetail = (type) => {
        setOpenDetail(true);
        setType(type);
    };

    const handleCloseLoaiKM = () => setOpenLoaiKM(false);

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
            name: 'Bảng giá 8-2024',
            start: '1/8/2024',
            end: '1/9/2024',
            status: 'Đang diễn ra',
            promotion: [
                {
                    id: '1',
                    name: 'CoCa',
                    mota: 'Nước ngọt',
                    price: 30000,
                    status: 'Active',
                    type: 1,
                },
                {
                    id: '2',
                    name: 'Bắp rang bơ',
                    mota: 'Bắp',
                    price: 45000,
                    status: 'Active',
                    type: 1,
                },
                {
                    id: '3',
                    loaiPC: '2D',
                    name: 'Ghế thường',
                    mota: 'Giá mặc định',
                    price: 80000,
                    status: 'Active',
                    type: 2,
                },
                {
                    id: '3',
                    loaiPC: '2D',
                    name: 'Ghế vip',
                    mota: 'Giá mặc định',
                    price: 100000,
                    status: 'Active',
                    type: 2,
                },
            ],
        },
        {
            id: 2,
            name: 'Bảng giá 9-2024',
            start: '1/9/2024',
            end: '1/10/2024',
            status: 'Hết hạn',
            promotion: [
                {
                    id: '1',
                    name: 'CoCa',
                    mota: 'Nước ngọt',
                    price: 30000,
                    status: 'Active',
                    type: 1,
                },
                {
                    id: '2',
                    name: 'Bắp rang bơ',
                    mota: 'Bắp',
                    price: 45000,
                    status: 'Active',
                    type: 1,
                },
                {
                    id: '3',
                    loaiPC: '2D',
                    name: 'Ghế thường',
                    mota: 'Giá mặc định',
                    price: 80000,
                    status: 'Active',
                    type: 2,
                },
                {
                    id: '3',
                    loaiPC: '2D',
                    name: 'Ghế vip',
                    mota: 'Giá mặc định',
                    price: 100000,
                    status: 'Active',
                    type: 2,
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
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Bảng giá</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Loại sản phẩm"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <InputComponent className="rounded-[10px] " title="Ngày bắt đầu" type="date" />
                    <InputComponent className="rounded-[10px] " title="Ngày kết thúc" type="date" />
                    <div className="relative w-full ">
                        <MdSwapVert className="absolute bottom-[10px] left-2" />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsSort}
                            title="Sắp xếp"
                            className="pl-3"
                            selectStyles={{ borderRadius: '10px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-auto bg-white border shadow-md rounded-[10px] box-border  h-[515px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div>
                    <h1 className="font-bold text-[16px] pl-3 pt-1 ">Vé</h1>

                    <div className="bg-[#eeaf56] text-[13px] text-white font-semibold h-auto py-1 grid grid-cols-7 items-center gap-3 ">
                        <h1 className="uppercase grid col-span-3 justify-center items-center">Mô tả</h1>
                        <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                        <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                        <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-[3px] rounded-[40px] bg-orange-400"
                                onClick={() => handleOpen(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="h-[92%] height-sm-1">
                        {promotions.map((promotion) => (
                            <div key={promotion.id}>
                                <div className="bg-[#E6E6E6] text-[14px] py-[6px] font-normal text-slate-500 grid grid-cols-7 items-center gap-3 mb-1 ">
                                    <div className="grid col-span-3 grid-cols-10 items-center gap-5">
                                        <div
                                            className="justify-center col-span-2 grid"
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
                                        </div>
                                        <h1 className="uppercase grid col-span-8">{promotion.name}</h1>
                                    </div>
                                    <h1 className="grid justify-center items-center">{promotion.start}</h1>
                                    <h1 className="grid justify-center items-center">{promotion.end}</h1>
                                    <div className="justify-center items-center grid">
                                        <button
                                            className={`border px-2 text-white text-[14px] truncate py-[1px] flex  rounded-[40px] ${
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
                                        <div className="border-b  text-[13px] font-bold uppercase text-slate-500 grid grid-cols-9 items-center gap-2">
                                            <h1 className="grid col-span-1 justify-center items-center">
                                                Loại phòng chiếu
                                            </h1>
                                            <h1 className="grid justify-center col-span-2 items-center">Tên</h1>
                                            <h1 className="grid col-span-2 justify-center items-center">Mô tả</h1>
                                            <h1 className="grid justify-center items-center">Giá</h1>
                                            <h1 className="grid justify-center items-center pl-5">Trạng thái</h1>
                                            <div className="grid justify-center col-span-2">
                                                <button
                                                    className="border px-4 py-[2px] mb-1 rounded-[40px] bg-orange-400"
                                                    onClick={() => handleOpenLoaiKM(false, 1)}
                                                >
                                                    <IoIosAddCircleOutline color="white" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="height-sm-1">
                                            {promotion.promotion
                                                .filter((item) => item.type === 2)
                                                .map((item) => (
                                                    <div
                                                        className="border-b text-[15px] py-1 font-normal text-slate-500 grid grid-cols-9 items-center gap-3"
                                                        key={item.id}
                                                    >
                                                        <h1 className=" grid col-span-1 justify-center items-center ">
                                                            {item.loaiPC}
                                                        </h1>
                                                        <h1 className=" grid pl-3 col-span-2 items-center">
                                                            {item.name}
                                                        </h1>
                                                        <h1 className=" grid col-span-2 pl-3 items-center">
                                                            {item.mota}
                                                        </h1>
                                                        <h1 className=" grid items-center justify-center">
                                                            {item.price}
                                                        </h1>
                                                        <div className="justify-center items-center grid pl-5">
                                                            <button
                                                                className={`border px-2 text-white text-[14px] truncate py-[1px] flex  rounded-[40px] ${
                                                                    item.status === 'Active'
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            >
                                                                {item.status}
                                                            </button>
                                                        </div>
                                                        <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                            <button
                                                                className=""
                                                                onClick={() => handleOpenLoaiKM(true, 1)}
                                                            >
                                                                <FaRegEdit color="black" size={20} />
                                                            </button>
                                                            <button
                                                                className=""
                                                                onClick={() => handleOpenDetail(item.type)}
                                                            >
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
                <div className="bg-slate-200 h-6"></div>
                <div>
                    <h1 className="font-bold text-[16px] pl-3 py-1">Đồ ăn và nước uống</h1>
                    <div className="bg-[#eeaf56] text-[13px] text-white font-semibold h-auto py-1 grid grid-cols-7 items-center gap-3 ">
                        <h1 className="uppercase grid col-span-3 justify-center items-center">Mô tả</h1>
                        <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                        <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                        <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-[3px] rounded-[40px] bg-orange-400"
                                onClick={() => handleOpen(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="h-[70%] height-sm-1 ">
                        {promotions.map((promotion) => (
                            <div key={promotion.id}>
                                <div className="bg-[#E6E6E6] text-[14px] py-[6px] font-normal text-slate-500 grid grid-cols-7 items-center gap-3 mb-1 ">
                                    <div className="grid col-span-3 grid-cols-10 items-center gap-5">
                                        <div
                                            className="justify-center col-span-2 grid"
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
                                        </div>
                                        <h1 className="uppercase grid col-span-8">{promotion.name}</h1>
                                    </div>
                                    <h1 className="grid justify-center items-center">{promotion.start}</h1>
                                    <h1 className="grid justify-center items-center">{promotion.end}</h1>
                                    <div className="justify-center items-center grid">
                                        <button
                                            className={`border px-2 text-white text-[14px] truncate py-[1px] flex  rounded-[40px] ${
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
                                        <div className="border-b text-[13px] font-bold uppercase text-slate-500 grid grid-cols-8 items-center gap-3">
                                            <h1 className="grid col-span-2 justify-center items-center">Tên</h1>
                                            <h1 className="grid col-span-2 justify-center items-center">Mô tả</h1>
                                            <h1 className="grid justify-center items-center">Giá</h1>
                                            <h1 className="grid justify-center items-center pl-5">Trạng thái</h1>
                                            <div className="grid justify-center col-span-2">
                                                <button
                                                    className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                                    onClick={() => handleOpenLoaiKM(false, 2)}
                                                >
                                                    <IoIosAddCircleOutline color="white" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="height-sm-1">
                                            {promotion.promotion
                                                .filter((item) => item.type === 1)
                                                .map((item) => (
                                                    <div
                                                        className="border-b py-1 text-[15px] font-normal text-slate-500 grid grid-cols-8 items-center gap-3"
                                                        key={item.id}
                                                    >
                                                        <h1 className=" grid col-span-2 pl-3 items-center ">
                                                            {item.name}
                                                        </h1>
                                                        <h1 className=" grid col-span-2  items-center">{item.mota}</h1>
                                                        <h1 className=" grid items-center">{item.price}</h1>
                                                        <div className="justify-center items-center grid pl-5">
                                                            <button
                                                                className={`border px-2 text-white text-[14px] truncate py-[1px] flex  rounded-[40px] ${
                                                                    item.status === 'Active'
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            >
                                                                {item.status}
                                                            </button>
                                                        </div>
                                                        <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                            <button
                                                                className=""
                                                                onClick={() => handleOpenLoaiKM(true, 2)}
                                                            >
                                                                <FaRegEdit color="black" size={20} />
                                                            </button>
                                                            <button
                                                                className=""
                                                                onClick={() => handleOpenDetail(item.type)}
                                                            >
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
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="35%"
                height="35%"
                smallScreenWidth="60%"
                smallScreenHeight="28%"
                mediumScreenWidth="60%"
                mediumScreenHeight="24%"
                largeScreenHeight="21%"
                largeScreenWidth="50%"
                maxHeightScreenHeight="48%"
                maxHeightScreenWidth="45%"
                heightScreen="36%"
                title={isUpdate ? 'Chỉnh sửa bảng giá' : 'Thêm bảng giá'}
            >
                <div className=" h-[80%] grid grid-rows-3 gap-3 ">
                    <div className="grid p-3 ">
                        <InputComponent placeholder="Nhập mô tả" title="Mô tả" className="rounded-[5px] " />
                    </div>

                    <div className="grid items-center row-span-2  gap-2 ">
                        <div className="grid grid-cols-2 gap-8 p-3">
                            <InputComponent title="Ngày bắt đầu" className="rounded-[5px] " type="date" />
                            <InputComponent title="Ngày kết thúc" className="rounded-[5px] " type="date" />
                        </div>
                        <div className="justify-end flex space-x-3 border-t py-[6px] px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openLoaiKM}
                handleClose={handleCloseLoaiKM}
                width="35%"
                height={type === 1 ? '55%' : '46%'}
                smallScreenWidth="45%"
                smallScreenHeight={type === 1 ? '40%' : '34%'}
                mediumScreenWidth="45%"
                mediumScreenHeight={type === 1 ? '35%' : '30%'}
                largeScreenHeight={type === 1 ? '30%' : '25%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '65%' : '56%'}
                maxHeightScreenWidth="45%"
                heightScreen={type === 1 ? '50%' : '43%'}
                title={isUpdate ? 'Thêm chi tiết bảng giá' : 'Chỉnh sửa chi tiết bảng giá'}
            >
                <div className={`h-[80%] grid ${type === 1 ? 'grid-rows-5' : 'grid-rows-4'} gap-2`}>
                    {type === 1 && (
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            className1="p-3"
                            title="Loại phòng chiếu"
                        />
                    )}

                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên"
                        className1="p-3"
                        freeSolo={false}
                        disableClearable={true}
                        placeholder="Nhập ..."
                        heightSelect={200}
                    />
                    <InputComponent placeholder="Nhập mô tả" title="Mô tả" className="rounded-[5px]" className1="p-3" />
                    <div className="grid items-center row-span-2  gap-2 ">
                        <InputComponent placeholder="Nhập giá" title="Giá" className="rounded-[5px]" className1="p-3" />

                        <div className="justify-end flex space-x-3 border-t py-4 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseLoaiKM} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="35%"
                height={type === 1 ? '72%' : '66%'}
                smallScreenWidth="45%"
                smallScreenHeight={type === 1 ? '53%' : '48%'}
                mediumScreenWidth="45%"
                mediumScreenHeight={type === 1 ? '46%' : '43%'}
                largeScreenHeight={type === 1 ? '40%' : '37%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '90%' : '83%'}
                maxHeightScreenWidth="45%"
                heightScreen={type === 1 ? '68%' : '62%'}
                title="Chi tiết bảng giá"
            >
                <div className={`h-[80%] grid ${type === 1 ? 'grid-rows-7' : 'grid-rows-6'} gap-10`}>
                    {type === 1 && (
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            className1="p-3"
                            title="Loại phòng chiếu"
                        />
                    )}

                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên"
                        className1="p-3"
                        freeSolo={false}
                        disableClearable={true}
                        placeholder="Nhập ..."
                        heightSelect={200}
                    />
                    <InputComponent placeholder="Nhập mô tả" title="Mô tả" className="rounded-[5px]" className1="p-3" />

                    <InputComponent placeholder="Nhập giá" title="Giá" className="rounded-[5px]" className1="p-3" />
                    <InputComponent
                        placeholder="Ngày tạo"
                        title="Ngày tạo"
                        className="rounded-[5px]"
                        className1="p-3"
                        disabled={true}
                    />
                    <div className="grid items-center row-span-2  gap-2 ">
                        <InputComponent
                            placeholder="Ngày cập nhật"
                            title="Ngày cập nhật"
                            className="rounded-[5px]"
                            className1="p-3"
                            disabled={true}
                        />

                        <div className="justify-end flex space-x-3 border-t py-4 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseLoaiKM} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Price;
