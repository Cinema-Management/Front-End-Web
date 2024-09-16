import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';

const Staff = () => {
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
            role: 'Admin',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Bùi Ngọc Tùng',
            email: 'buingoctung1009@gmail.com',
            sdt: '0123456789',
            address: '11a Thạnh Xuân 13, Phường Thạnh Xuân, Quận 12, TP Hồ Chí Minh',
            role: 'Staff',
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
                <h1 className="font-bold text-[20px] ">Quản lý nhân viên</h1>
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
                <div className="border-b py-3 uppercase text-xs font-bold text-slate-500 grid grid-cols-11 items-center gap-3">
                    <h1 className="grid col-span-2 justify-center items-center">Họ tên</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Email</h1>
                    <h1 className="grid justify-center items-center">Số điện thoại</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                    <h1 className="grid justify-center items-center">Vai trò</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className=" grid justify-center col-span-2">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => handleOpen(false, false)}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                    {/* <div className="flex justify-center"></div> */}
                </div>

                <div className="overflow-auto h-90p height-sm-1">
                    {user.map((item) => (
                        <div
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-11 items-center gap-3"
                            key={item.id}
                        >
                            <h1 className="grid col-span-2 items-center pl-3">{item.name}</h1>
                            <h1 className="grid col-span-2 items-center break-all">{item.email}</h1>
                            <h1 className="grid justify-center items-center break-all ">{item.sdt}</h1>
                            <h1 className="grid col-span-2 items-center break-all ">{item.address}</h1>
                            <h1 className="grid justify-center items-center ">{item.role}</h1>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-3 text-white text-base py-[2px] flex  rounded-[40px] uppercase ${
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
                height={isDetail ? '75%' : isUpdate ? '75%' : '68%'}
                smallScreenWidth="65%"
                smallScreenHeight={isDetail ? '55%' : isUpdate ? '55%' : '48%'}
                mediumScreenWidth="60%"
                mediumScreenHeight={isDetail ? '50%' : isUpdate ? '50%' : '43%'}
                largeScreenHeight={isDetail ? '42%' : isUpdate ? '42%' : '55%'}
                largeScreenWidth="60%"
                maxHeightScreenHeight={isDetail ? '90%' : isUpdate ? '90%' : '83%'}
                maxHeightScreenWidth="60%"
                title={isDetail ? 'Chi tiết nhân viên' : isUpdate ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
            >
                <div className={`h-90p grid ${isUpdate ? 'grid-rows-7' : 'grid-rows-6'} gap-12 p-3`}>
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

                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Vai trò"
                                options={optionsQG}
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
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Rạp"
                                options={optionsQG}
                            />
                        </div>
                    </div>
                    <div className="grid ">
                        <InputComponent placeholder="Nhập ..." title="Địa chỉ chi tiết" className="rounded-[5px] " />
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

export default Staff;
