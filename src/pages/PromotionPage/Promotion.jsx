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
    const [type, setType] = useState('');
    const [openLoaiKM, setOpenLoaiKM] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [openDetail, setOpenDetail] = useState(false);
    const [openKM, setOpenKM] = useState(false);
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => setOpen(false);

    const handleOpenLoaiKM = (isUpdate) => {
        setOpenLoaiKM(true);
        setIsUpdate(isUpdate);
    };
    const handleCloseKM = () => {
        setOpenKM(false);
        setOpenDetail(true);
    };
    const handleOpenKM = (isUpdate) => {
        setOpenKM(true);
        setIsUpdate(isUpdate);
        setOpenDetail(false);
    };
    const handleCloseLoaiKM = () => setOpenLoaiKM(false);

    const handOpenDetail = (type) => {
        setType(type);
        setOpenDetail(true);
    };
    const handleCloseDetail = () => setOpenDetail(false);

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
                    type: 1,
                },
                {
                    id: '2',
                    loai: 'Khuyến mãi sản phẩm',
                    mota: 'Mua đủ số lượng sẩn phẩm sẽ được tặng  thêm sản phẩm.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                    type: 2,
                },
                {
                    id: '3',
                    loai: 'Khuyến mãi hóa đơn',
                    mota: 'Giảm % giá trị hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                    type: 3,
                },
            ],
        },
        {
            id: 2,
            name: 'Chương trình khuyến mãi 9-2024',
            start: '1/9/2024',
            end: '1/10/2024',
            status: 'Hết hạn',
            promotion: [
                {
                    id: '1',
                    loai: 'Khuyến mãi sản phẩm',
                    mota: 'Mua đủ số lượng sẩn phẩm sẽ được tặng  thêm sản phẩm.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'Active',
                    type: 2,
                },
                {
                    id: '2',
                    loai: 'Khuyến mãi hóa đơn',
                    mota: 'Giảm % giá trị hóa đơn.',
                    start: '1/8/2024',
                    end: '21/8/2024',
                    status: 'InActive',
                    type: 3,
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
                    type: 3,
                },
            ],
        },
    ];

    const data = [
        {
            id: 1,
            type: 1,
            soTienBan: 5000000,
            soTienTang: 100000,
            status: 'Active',
        },
        {
            id: 2,
            type: 2,
            sanPhamBan: 'Coca',
            soLuongBan: 5,
            sanPhamTang: 'Coca',
            soLuongTang: 1,
            status: 'Active',
        },
        {
            id: 3,
            type: 3,
            soTienBan: 5000000,
            chietKhau: '10%',
            soTienGioiHan: 200000,
            status: 'Active',
        },
        {
            id: 4,
            type: 1,
            soTienBan: 1000000,
            soTienTang: 50000,
            status: 'InActive',
        },
        {
            id: 5,
            type: 2,
            sanPhamBan: 'Pespi',
            soLuongBan: 3,
            sanPhamTang: 'Coca',
            soLuongTang: 1,
            status: 'InActive',
        },
        {
            id: 6,
            type: 3,
            soTienBan: 2000000,
            chietKhau: '5%',
            soTienGioiHan: 20000,
            status: 'InActive',
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
                                        className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
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
                                        <h1 className="grid justify-center items-center pl-5">Trạng thái</h1>
                                        <div className="grid justify-center col-span-2">
                                            <button
                                                className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                                onClick={() => handleOpenLoaiKM(false)}
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
                                                    <h1 className=" grid items-center justify-center break-all">
                                                        {item.start}
                                                    </h1>
                                                    <h1 className=" grid items-center justify-center break-all">
                                                        {item.end}
                                                    </h1>
                                                    <div className="justify-center items-center grid pl-5">
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
                                                    <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                        <button className="" onClick={() => handleOpenLoaiKM(true)}>
                                                            <FaRegEdit color="black" size={22} />
                                                        </button>
                                                        <button className="" onClick={() => handOpenDetail(item.type)}>
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
                height="39%"
                smallScreenWidth="60%"
                smallScreenHeight="28%"
                mediumScreenWidth="60%"
                mediumScreenHeight="24%"
                largeScreenHeight="21%"
                largeScreenWidth="50%"
                maxHeightScreenHeight="48%"
                maxHeightScreenWidth="45%"
                heightScreen="36%"
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
                        <div className="justify-end flex space-x-3 border-t py-3 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openLoaiKM}
                handleClose={handleCloseLoaiKM}
                width="45%"
                height="38%"
                smallScreenWidth="65%"
                smallScreenHeight="28%"
                mediumScreenWidth="65%"
                mediumScreenHeight="25%"
                largeScreenHeight="22%"
                largeScreenWidth="55%"
                maxHeightScreenHeight="48%"
                maxHeightScreenWidth="55%"
                heightScreen="35%"
                title={isUpdate ? 'Chỉnh sửa loại khuyến mãi' : 'Thêm loại khuyến mãi'}
            >
                <div className=" h-[80%] grid grid-rows-3 gap-6 ">
                    <div className="grid grid-cols-2 gap-8 p-2 items-center ">
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            title="Loại khuyến mãi"
                        />
                        <InputComponent placeholder="Nhập mô tả" title="Mô tả" className="rounded-[5px] " />
                    </div>

                    <div className="grid items-center row-span-2  gap-2 ">
                        <div className="grid grid-cols-2 gap-8 p-2">
                            <InputComponent title="Ngày bắt đầu" className="rounded-[5px] " type="date" />
                            <InputComponent title="Ngày kết thúc" className="rounded-[5px] " type="date" />
                        </div>
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
                width="55%"
                height="50%"
                smallScreenWidth="80%"
                smallScreenHeight="38%"
                mediumScreenWidth="60%"
                mediumScreenHeight="35%"
                largeScreenHeight="35%"
                largeScreenWidth="60%"
                maxHeightScreenHeight="70%"
                maxHeightScreenWidth="50%"
                title="Chi tiết khuyến mãi"
            >
                <div className=" h-90p grid grid-rows-12 ">
                    <div
                        className={`border-b text-xs row-span-2 px-2 font-bold text-slate-500 grid ${
                            type === 1 ? 'grid-cols-4' : type === 2 ? 'grid-cols-6' : 'grid-cols-5'
                        } items-center gap-2`}
                    >
                        {type === 1 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Số tiền bán</h1>
                                <h1 className="uppercase grid justify-center items-center">Số tiền tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        {type === 2 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Sản phẩm bán</h1>
                                <h1 className="uppercase grid justify-center items-center ">Số lượng bán</h1>
                                <h1 className="uppercase grid justify-center items-center">Sản phẩm tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Số lượng tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        {type === 3 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Số tiền bán</h1>
                                <h1 className="uppercase grid justify-center items-center">% chiết khấu</h1>
                                <h1 className="uppercase grid justify-center items-center ">Số tiền giới hạn</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                onClick={() => handleOpenKM(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto h-95p height-sm-1 row-span-8">
                        {data
                            .filter((item) => item.type === type)
                            .map((item) => (
                                <div
                                    className={`border-b text-base px-3 font-normal py-2 text-slate-500 grid ${
                                        type === 1 ? 'grid-cols-4' : type === 2 ? 'grid-cols-6' : 'grid-cols-5'
                                    } items-center gap-2`}
                                    key={item.id}
                                >
                                    {item.type === 1 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienTang}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={25} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {item.type === 2 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.sanPhamBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center ">
                                                {item.soLuongBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.sanPhamTang}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soLuongTang}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-3 text-white text-base  flex  rounded-[40px] uppercase ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={25} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {item.type === 3 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.chietKhau}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center ">
                                                {item.soTienGioiHan}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-3 text-white text-base  flex  rounded-[40px] uppercase ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={25} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                    <div className="grid row-span-2 items-center pt-1 border-t">
                        <div className="px-4 justify-end flex space-x-3  mb-3">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openKM}
                handleClose={handleCloseKM}
                width="28%"
                height={type === 1 ? '38%' : type === 2 ? '55%' : '46%'}
                smallScreenWidth="55%"
                smallScreenHeight={type === 1 ? '28%' : type === 2 ? '40%' : '35%'}
                mediumScreenWidth="50%"
                mediumScreenHeight={type === 1 ? '24%' : type === 2 ? '35%' : '30%'}
                largeScreenHeight={type === 1 ? '21%' : type === 2 ? '31%' : '26%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '45%' : type === 2 ? '69%' : '58%'}
                maxHeightScreenWidth="40%"
                heightScreen={type === 1 ? '35%' : type === 2 ? '52%' : '43%'}
                widthScreen="35%"
                title={
                    isUpdate && type === 1
                        ? 'Chỉnh sửa khuyến mãi tiền'
                        : !isUpdate && type === 1
                        ? 'Thêm khuyến mãi tiền'
                        : isUpdate && type === 2
                        ? 'Chỉnh sửa khuyến mãi sản phẩm'
                        : !isUpdate && type === 2
                        ? 'Thêm khuyến khuyến mãi sản phẩm'
                        : isUpdate && type === 3
                        ? 'Chỉnh sửa khuyến mãi hóa đơn'
                        : 'Thêm khuyến mãi hóa đơn'
                }
            >
                {type === 2 && (
                    <div className=" h-[87%] grid grid-rows-6 gap-[73px]">
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            title="Sản phẩm bán"
                            className1="p-3"
                        />
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số lượng bán"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            className1="p-3"
                            title="Sản phẩm tặng"
                        />
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số lượng tặng"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}
                {type === 1 && (
                    <div className=" h-[87%] grid grid-rows-4 gap-[73px]">
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số tiền bán"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số tiền tặng"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}

                {type === 3 && (
                    <div className=" h-[87%] grid grid-rows-5 gap-[73px]">
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số tiền bán"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <InputComponent
                            placeholder="Nhập ..."
                            title="% chiết khấu"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Số tiền giới hạn"
                            className="rounded-[5px]"
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent>
        </div>
    );
};

export default Promotion;
