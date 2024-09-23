import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';

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
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Nhân viên</h1>
                <div className="grid grid-cols-4  max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={rap.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tên nhân viên"
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
                        title="Vai trò"
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
                <div className="border-b py-1 text-sm uppercase font-bold text-slate-500 grid grid-cols-7 items-center ">
                    <h1 className="grid justify-center items-center">Họ tên</h1>
                    <h1 className="grid justify-center items-center">Số điện thoại</h1>
                    <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                    <h1 className="grid justify-center items-center">Vai trò</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className=" grid justify-center">
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
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-7 items-center gap-5 "
                            key={item.id}
                        >
                            <h1 className="grid items-center pl-3 ">{item.name}</h1>
                            <h1 className="grid justify-center items-center break-all ">{item.sdt}</h1>
                            <h1 className="grid col-span-2 items-center ">{item.address}</h1>
                            <h1 className="grid justify-center items-center ">{item.role}</h1>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                            <div className=" justify-center items-center grid  ">
                                <div className="grid grid-cols-3 max-mh850:grid-cols-2">
                                    <button
                                        className="col-span-2 max-mh850:col-span-1 max-mh850:mr-2"
                                        onClick={() => handleOpen(true, false)}
                                    >
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
                height={isDetail ? '78%' : isUpdate ? '78%' : '68%'}
                smallScreenWidth="65%"
                smallScreenHeight={isDetail ? '55%' : isUpdate ? '55%' : '50%'}
                mediumScreenWidth="60%"
                mediumScreenHeight={isDetail ? '50%' : isUpdate ? '50%' : '43%'}
                largeScreenHeight={isDetail ? '42%' : isUpdate ? '42%' : '37%'}
                largeScreenWidth="60%"
                maxHeightScreenHeight={isDetail ? '90%' : isUpdate ? '90%' : '80%'}
                maxHeightScreenWidth="60%"
                heightScreen={isDetail ? '70%' : isUpdate ? '70%' : '62%'}
                title={isDetail ? 'Chi tiết nhân viên' : isUpdate ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
            >
                <div className={`h-90p grid ${isUpdate ? 'grid-rows-7' : 'grid-rows-6'} gap-2 `}>
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

                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                title="Vai trò"
                                options={optionsQG}
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
                                options={rap.map((option) => option.name)}
                                title="Rạp"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                heightSelect={150}
                            />
                        </div>
                    </div>
                    <div className="grid p-3">
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
                    {(isUpdate || isDetail) && (
                        <div className="grid p-3 ">
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

export default Staff;
