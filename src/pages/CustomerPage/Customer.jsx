import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { FaRegEye } from 'react-icons/fa6';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';

const Customer = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const handleOpen = (isUpdate, isDetail) => {
        setOpen(true);
        setIsUpdate(isUpdate);
        setIsDetail(isDetail);
    };
    const handleClose = () => setOpen(false);

    const user = [
        {
            id: 1,
            name: 'Cao Trùng Dương',
            loaiKH: 'VIP',
            sdt: '0123456789',
            address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Bùi Ngọc Tùng',
            loaiKH: 'Bạc',
            sdt: '0123456789',
            address: '11a Thạnh Xuân 13, Phường Thạnh Xuân, Quận 12, TP Hồ Chí Minh',
            status: 'InActive',
        },
    ];
    const optionCV = [
        { value: '0', label: 'Lọc chức vụ' },
        { value: 'AD', label: 'Admin' },
        { value: 'NV', label: 'Staff' },
    ];
    const optionsSort = [
        { value: '0', label: 'Xếp theo tên' },
        { value: 'A', label: 'A - Z' },
        { value: 'B', label: 'Z - A' },
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const [selectedMovie, setSelectedMovie] = useState('');
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
    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Khách hàng</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={rap.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên khách hàng"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Số điện thoại"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionCV}
                        title="Loại khách hàng"
                        selectStyles={{ borderRadius: '10px' }}
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
                <div className="border-b py-1 text-sm uppercase font-bold text-slate-500 grid grid-cols-7 items-center">
                    <h1 className="grid justify-center items-center">Họ tên</h1>
                    <h1 className="grid justify-center items-center">Số điện thoại</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                    <h1 className="grid justify-center items-center">Loại khách hàng</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className=" grid justify-center ">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => handleOpen(false, false)}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-auto h-90p height-sm-1">
                    {user.map((item) => (
                        <div
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-7 items-center gap-5"
                            key={item.id}
                        >
                            <h1 className="grid items-center pl-3">{item.name}</h1>
                            <h1 className="grid justify-center items-center break-all ">{item.sdt}</h1>
                            <h1 className="grid col-span-2 items-center ">{item.address}</h1>
                            <h1 className="grid items-center break-all pl-5">{item.loaiKH}</h1>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-2 text-white text-base py-[1  px] flex  rounded-[40px] ${
                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                            <div className="  justify-center items-center grid ">
                                <div className="grid grid-cols-3">
                                    <button className="col-span-2" onClick={() => handleOpen(true, false)}>
                                        <FaRegEdit color="black" size={20} />
                                    </button>
                                    <button onClick={() => handleOpen(false, true)}>
                                        <FaRegEye color="black" fontSize={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="40%"
                height={isDetail ? '68%' : isUpdate ? '68%' : '61%'}
                smallScreenWidth="65%"
                smallScreenHeight={isDetail ? '50%' : isUpdate ? '50%' : '44%'}
                mediumScreenWidth="60%"
                mediumScreenHeight={isDetail ? '44%' : isUpdate ? '44%' : '38%'}
                largeScreenHeight={isDetail ? '38%' : isUpdate ? '38%' : '33%'}
                largeScreenWidth="60%"
                maxHeightScreenHeight={isDetail ? '83%' : isUpdate ? '83%' : '76%'}
                maxHeightScreenWidth="60%"
                heightScreen={isDetail ? '63%' : isUpdate ? '63%' : '55%'}
                title={isDetail ? 'Chi tiết khách hàng' : isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
            >
                <div className={`h-90p grid ${isUpdate ? 'grid-rows-6' : 'grid-rows-5'} gap-2`}>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Họ tên"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                            />
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Email"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                            />
                        </div>
                    </div>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Số điện thoại"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                            />
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Điểm tích lũy"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="3.000"
                                heightSelect={200}
                                color={'#FB5B5E'}
                                className="rounded-[5px] "
                            />
                        </div>
                    </div>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
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
                    </div>

                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
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
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Địa chỉ chi tiết"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                            />
                        </div>
                    </div>

                    {(isUpdate || isDetail) && (
                        <div className="grid p-3">
                            <div className="grid grid-cols-2 gap-5">
                                <InputComponent
                                    placeholder="30-08-2024 03:06:17"
                                    title="Ngày tạo"
                                    className="rounded-[5px] bg-[#707070] "
                                    disabled={true}
                                />
                                <InputComponent
                                    placeholder="30-08-2024 03:06:17"
                                    title="Ngày cập nhật"
                                    className="rounded-[5px] bg-[#707070] "
                                    disabled={true}
                                />
                            </div>
                        </div>
                    )}
                    <div className="grid items-center pt-2">
                        <div className="justify-end flex space-x-3 mt-1  border-t pt-3 pr-4">
                            {isDetail ? (
                                <ButtonComponent text="Đóng" className="bg-blue-500 " onClick={handleClose} />
                            ) : (
                                <>
                                    <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                    <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Customer;
