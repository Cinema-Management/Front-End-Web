import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { FaRegEye } from 'react-icons/fa6';

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
            email: 'caotrungduong11@gmail.com',
            sdt: '0123456789',
            address: '120 Quang Trung, Phường 5,  Quận Gò Vấp, TP  Hồ Chí Minh ',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Bùi Ngọc Tùng',
            email: 'buingoctung1009@gmail.com',
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
    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1  px-10 py-3 h-40">
                <h1 className="font-bold text-[20px] ">Quản lý khách hàng</h1>
                <div className="grid grid-cols-3 gap-3 lg:gap-[66px] xl:gap-[111px] items-center w-full h-16">
                    <InputComponent placeholder="Nhập tên nhân viên" className="rounded-[10px] " />

                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionCV}
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[500px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="border-b py-1 text-sm uppercase font-bold text-slate-500 grid grid-cols-10 items-center">
                    <h1 className="grid col-span-2 justify-center items-center">Họ tên</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Email</h1>
                    <h1 className="grid justify-center items-center">Số điện thoại</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className=" grid justify-center col-span-2">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => handleOpen(false, false)}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                    <div className="flex justify-center"></div>
                </div>

                <div className="overflow-auto h-90p height-sm-1">
                    {user.map((item) => (
                        <div
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-10 items-center gap-5"
                            key={item.id}
                        >
                            <h1 className="grid col-span-2 items-center pl-3">{item.name}</h1>
                            <h1 className="grid col-span-2 items-center break-all">{item.email}</h1>
                            <h1 className="grid justify-center items-center break-all ">{item.sdt}</h1>
                            <h1 className="grid col-span-2 items-center ">{item.address}</h1>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-3 text-white text-base font-normal py-[2px] flex  rounded-[40px] uppercase ${
                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                            <div className="  justify-center col-span-2 items-center grid ">
                                <div className="grid grid-cols-3">
                                    <button className="col-span-2" onClick={() => handleOpen(true, false)}>
                                        <FaRegEdit color="black" size={22} />
                                    </button>
                                    <button onClick={() => handleOpen(false, true)}>
                                        <FaRegEye color="black" fontSize={22} />
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
                title={isDetail ? 'Chi tiết khách hàng' : isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
            >
                <div className={`h-90p grid ${isUpdate ? 'grid-rows-6' : 'grid-rows-5'} gap-12 p-3`}>
                    <div className="grid ">
                        <div className="grid grid-cols-2 gap-5">
                            <InputComponent placeholder="Nhập họ tên" title="Họ tên" className="rounded-[5px] " />
                            <InputComponent placeholder="Nhập email" title="Email" className="rounded-[5px] " />
                        </div>
                    </div>
                    <div className="grid ">
                        <div className="grid grid-cols-2 gap-5">
                            <InputComponent
                                placeholder="Nhập số điện thoại"
                                title="Số điện thoại"
                                className="rounded-[5px] "
                            />

                            <InputComponent
                                placeholder="3.000"
                                title="Điểm tích lũy"
                                className="rounded-[5px] text-[#FB5B5E] placeholder-[#FB5B5E] "
                            />
                        </div>
                    </div>
                    <div className="grid ">
                        <div className="grid grid-cols-2 gap-5">
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Tỉnh/Thành phố"
                                options={optionsQG}
                            />
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Quận/huyện"
                                options={optionsQG}
                            />
                        </div>
                    </div>

                    <div className="grid ">
                        <div className="grid grid-cols-2 gap-5">
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Phường/xã"
                                options={optionsQG}
                            />
                            <InputComponent
                                placeholder="Nhập ..."
                                title="Địa chỉ chi tiết"
                                className="rounded-[5px] "
                            />
                        </div>
                    </div>

                    {(isUpdate || isDetail) && (
                        <div className="grid ">
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
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 mt-1">
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
