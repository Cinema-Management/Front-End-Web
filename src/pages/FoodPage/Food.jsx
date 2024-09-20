import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import imgcoca from '~/assets/coca.png';
import imgbap from '~/assets/bap.png';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';

const Foood = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => setOpen(false);
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const rap = [
        {
            id: 1,
            name: 'Coca',
            img: imgcoca,
            slTon: '1000',
            date: '30-08-2024 03:06:17',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Bắp',
            img: imgbap,
            slTon: '1000',
            date: '30-08-2024 03:06:17',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Bắp',
            img: imgbap,
            slTon: '1000',
            date: '30-08-2024 03:06:17',
            status: 'Active',
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
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Đồ ăn & nước</h1>
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
                        borderRadius="10px"
                    />
                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionsLoc}
                        title="Trạng thái"
                        selectStyles={{ borderRadius: '10px' }}
                    />
                    <InputComponent className="rounded-[10px]" title="Ngày tạo" type="date" />
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
                <div className="border-b py-1 uppercase text-sm font-bold text-slate-500 grid grid-cols-8 items-center gap-10">
                    <h1 className="grid justify-center items-center">Tên </h1>
                    <h1 className="grid justify-center items-center ">Hình ảnh</h1>
                    <h1 className="grid justify-center items-center">Số lượng tồn</h1>
                    <h1 className="grid justify-center items-center col-span-2">Ngày tạo</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className="flex justify-center col-span-2">
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
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-8 items-center gap-10"
                            key={item.id}
                        >
                            <h1 className=" grid ml-3 items-center  ">{item.name}</h1>
                            <img src={item.img} alt="phim1" className="w-36 h-24 object-contain  " />
                            <div className="flex justify-center items-center">
                                <h1 className="">{item.slTon}</h1>
                            </div>
                            <h1 className=" grid items-center col-span-2 justify-center">{item.date}</h1>
                            <div className="  justify-center items-center grid">
                                <button
                                    className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                            <div className="  justify-center col-span-2 items-center grid ">
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
                width="30%"
                height="47%"
                smallScreenWidth="50%"
                smallScreenHeight="35%"
                mediumScreenWidth="50%"
                mediumScreenHeight="30%"
                largeScreenHeight="27%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="60%"
                maxHeightScreenWidth="45%"
                heightScreen="45%"
                title={isUpdate ? 'Chỉnh thức ăn và đồ uống' : 'Thêm thức ăn và đồ uống'}
            >
                <div className=" h-90p grid grid-rows-4">
                    <div className="grid p-3">
                        <InputComponent placeholder="Nhập tên" title="Tên" className="rounded-[5px] " />
                    </div>

                    <div className="grid p-3">
                        <div className="grid ">
                            <InputComponent placeholder="Nhập số lượng" title="Số lượng" className="rounded-[5px] " />
                        </div>
                    </div>
                    <div className="grid items-center">
                        <div className="grid p-3 ">
                            <InputComponent placeholder="Nhập tên" title="Tên" className="rounded-[5px] " type="file" />
                        </div>
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Foood;
