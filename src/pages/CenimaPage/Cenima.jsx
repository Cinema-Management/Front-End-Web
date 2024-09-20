import React, { useState } from 'react';
import { FaRegEdit, FaRegEye } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';

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
    {
        id: 1,
        name: 'Rotte',
        address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh   ',
        slRoom: '3',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Galaxy',
        address: '180 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
        slRoom: '2',
        status: 'InActive',
    },
    {
        id: 1,
        name: 'Rotte',
        address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh   ',
        slRoom: '3',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Galaxy',
        address: '180 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
        slRoom: '2',
        status: 'InActive',
    },
    {
        id: 1,
        name: 'Rotte',
        address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh   ',
        slRoom: '3',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Galaxy',
        address: '180 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
        slRoom: '2',
        status: 'InActive',
    },
    {
        id: 1,
        name: 'Rotte',
        address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh   ',
        slRoom: '3',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Galaxy',
        address: '180 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
        slRoom: '2',
        status: 'InActive',
    },
];
const phong = [
    {
        id: 1,
        name: 'Phòng 1',
        loai: '2D',
        slRoom: '60',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Phòng 2',
        loai: '3D',
        slRoom: '70',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Phòng 3',
        loai: '3D',
        slRoom: '70',
        status: 'InActive',
    },
];
const optionsQG = [
    { value: '0', label: 'Chọn' },
    { value: 'VN', label: 'Việt Nam' },
    { value: 'TL', label: 'Thái Lan' },
];
const optionsLoc = [
    { value: '0', label: 'Chọn' },
    { value: 'KD', label: 'Kinh dị' },
    { value: 'HH', label: 'Hài hước' },
    { value: 'TC', label: 'Tình cảm' },
];
const optionsSort = [
    { value: '0', label: 'Chọn' },
    { value: 'A', label: 'A - Z' },
    { value: 'B', label: 'Z - A' },
];
const Cenima = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isUpdateRoom, setIsUpdateRoom] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [onpenRoom, setOpenRoom] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    const handleOpenRoom = (isUpdateRoom) => {
        setOpenRoom(true);
        setIsUpdateRoom(isUpdateRoom);
        setOpenDetail(false);
    };
    const handleCloseRoom = () => {
        setOpenRoom(false);
        setOpenDetail(true);
    };

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => setOpen(false);

    const handOpenDetail = () => setOpenDetail(true);
    const handleCloseDetail = () => setOpenDetail(false);

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Rạp</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={rap.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên rạp"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Tên rạp"
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionsLoc}
                        title="Trạng thái"
                        selectStyles={{ borderRadius: '10px' }}
                    />
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Số phòng"
                        freeSolo={true}
                        disableClearable={true}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="border-b py-1 text-sm font-bold text-slate-500 grid grid-cols-8 items-center gap-2">
                    <h1 className="uppercase grid col-span-2 justify-center items-center">Tên rạp</h1>
                    <h1 className="uppercase grid col-span-3 justify-center items-center ">Địa chỉ</h1>
                    <h1 className="uppercase grid justify-center items-center">Số lượng phòng</h1>
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

                <div className="overflow-auto h-90p height-sm-1">
                    {rap.map((item) => (
                        <div
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-8 items-center gap-2"
                            key={item.id}
                        >
                            <h1 className=" grid col-span-2 ml-3 items-center  ">{item.name}</h1>
                            <h1 className=" grid col-span-3 items-center ">{item.address}</h1>
                            <div className="flex justify-center items-center">
                                <h1 className="">{item.slRoom}</h1>
                                <button className=" ml-2" onClick={handOpenDetail}>
                                    <FaRegEye color="black" fontSize={20} />
                                </button>
                            </div>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                            <div className="  justify-center items-center grid">
                                <button className=" px-4 py-1" onClick={() => handleOpen(true)}>
                                    <FaRegEdit color="black" size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="30%"
                height="70%"
                smallScreenWidth="50%"
                smallScreenHeight="52%"
                mediumScreenWidth="50%"
                mediumScreenHeight="45%"
                largeScreenHeight="38%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="87%"
                maxHeightScreenWidth="45%"
                heightScreen="65%"
                title={isUpdate ? 'Chỉnh sửa rạp' : 'Thêm rạp'}
            >
                <div className=" h-90p grid grid-rows-6 gap-16">
                    <div className="grid p-3 ">
                        <InputComponent placeholder="Nhập tên rạp" title="Tên rạp" className="rounded-[5px] " />
                    </div>

                    <div className="grid p-3">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            options={rap.map((option) => option.name)}
                            title="Tỉnh/thành phố"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>
                    <div className="grid p-3">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            options={rap.map((option) => option.name)}
                            title="Quận/huyện"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>
                    <div className="grid p-3">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            options={rap.map((option) => option.name)}
                            title="Phường/xã"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>
                    <div className="w-full grid row-span-3 ">
                        <InputComponent
                            placeholder="Nhập ..."
                            title="Địa chỉ chi tiết"
                            className="rounded-[5px] w-full grid row-span-4"
                            className1="p-3"
                        />
                        <div className="justify-end flex space-x-3 pt-4 border-t pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500" />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="40%"
                height="70%"
                smallScreenWidth="50%"
                smallScreenHeight="52%"
                mediumScreenWidth="50%"
                mediumScreenHeight="45%"
                largeScreenHeight="38%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="87%"
                maxHeightScreenWidth="45%"
                title="Chi tiết phòng"
            >
                <div className=" h-90p grid grid-rows-12 ">
                    <div className="border-b text-xs font-bold text-slate-500 grid grid-cols-5 items-center gap-2">
                        <h1 className=" uppercase grid justify-center items-center">Tên phòng</h1>
                        <h1 className=" uppercase grid justify-center items-center ">Loại phòng</h1>
                        <h1 className=" uppercase grid justify-center items-center">Số ghế</h1>
                        <h1 className=" uppercase grid justify-center items-center">Trạng thái</h1>
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                onClick={() => handleOpenRoom(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto row-span-11  h-95p height-sm-1 ">
                        {phong.map((item) => (
                            <div
                                className="border-b text-base font-normal  py-3 text-slate-500 grid grid-cols-5 items-center gap-2"
                                key={item.id}
                            >
                                <h1 className=" grid items-center pl-3">{item.name}</h1>
                                <h1 className=" grid justify-center items-center">{item.loai}</h1>
                                <div className="grid justify-center items-center">
                                    <h1 className="">{item.slRoom}</h1>
                                </div>
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
                                    <button className=" px-4 py-1" onClick={() => handleOpenRoom(true)}>
                                        <FaRegEdit color="black" size={25} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid border-t items-center">
                        <div className="px-4 py-3 justify-end flex space-x-3 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={onpenRoom}
                handleClose={handleCloseRoom}
                width="60%"
                height="28%"
                top="35%"
                left="55%"
                smallScreenWidth="75%"
                smallScreenHeight="20%"
                mediumScreenWidth="75%"
                mediumScreenHeight="18%"
                largeScreenHeight="15%"
                largeScreenWidth="75%"
                maxHeightScreenHeight="35%"
                maxHeightScreenWidth="75%"
                heightScreen="26%"
                title={isUpdateRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng'}
            >
                <div className="grid grid-rows-1 gap-2">
                    <div className="grid grid-cols-4 gap-4 p-3">
                        <InputComponent placeholder="Nhập tên phòng" title="Tên phòng" className="rounded-[5px] " />
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            title="Loại phòng"
                            options={optionsQG}
                            className="grid "
                        />
                        <InputComponent placeholder="Nhập số cột" title="Số cột" className="rounded-[5px] " />
                        <InputComponent placeholder="Nhập số hàng" title="Số hàng" className="rounded-[5px] " />
                    </div>

                    <div className="grid items-center  border-t">
                        <div className="justify-end flex space-x-3 pr-4  pt-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseRoom} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Cenima;
