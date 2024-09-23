import React, { useState } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import phim1 from '~/assets/phim1.png';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';

const Film = () => {
    const movie = [
        {
            id: 1,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Ma Da',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Active',
        },
        {
            id: 2,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Ma Da',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Active',
        },
        {
            id: 3,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Làm giàu với ma',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'InActive',
        },
    ];

    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
        { value: 'HQ', label: 'Hàn Quốc' },
    ];

    const optionsSort = [
        { value: '0', label: 'Xếp theo tên' },
        { value: 'A', label: 'A - Z' },
        { value: 'B', label: 'Z - A' },
    ];
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
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Phim</h1>
                <div className="grid grid-cols-5 gap-10 max-lg:gap-2 items-center w-full h-16 px-3">
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
                    <AutoInputComponent
                        options={rap.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Thể loại"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Thể loại"
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="border-b py-1 uppercase text-sm font-bold  text-slate-500 grid grid-cols-8 items-center gap-2">
                    <h1 className="grid justify-center items-center">Thể loại phim</h1>
                    <h1 className="grid justify-center items-center ">Hình ảnh</h1>
                    <h1 className="grid justify-center items-center">Tên phim</h1>
                    <h1 className="grid justify-center items-center">Thời lượng</h1>
                    <h1 className="grid justify-center items-center">Ngày phát hành</h1>
                    <h1 className="grid justify-center items-center">Ngày kết thúc</h1>
                    <h1 className="grid justify-center items-center">Trạng thái</h1>
                    <div className="flex justify-center">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => {
                                handleOpen(false);
                            }}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-auto h-90p height-sm-1">
                    {movie.map((item) => (
                        <div
                            className="border-b text-base font-normal py-3 text-slate-500 grid grid-cols-8 items-center gap-2"
                            key={item.id}
                        >
                            <h1 className="grid items-center  pl-3">{item.genre}</h1>
                            <img src={item.image} alt="phim1" className="w-36 h-24 object-contain " />
                            <h1 className="grid items-center ">{item.name}</h1>
                            <h1 className="grid justify-center items-center  ">{item.duration}</h1>
                            <h1 className="grid justify-center items-center  ">{item.releaseDate}</h1>
                            <h1 className="grid justify-center items-center  ">{item.endDate}</h1>
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
                                <button
                                    className=" px-4 py-1  "
                                    onClick={() => {
                                        handleOpen(true);
                                    }}
                                >
                                    <FaRegEdit color="black" size={22} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="70%" // Kích thước mặc định
                height="75%"
                smallScreenWidth="90%" // Kích thước cho màn hình nhỏ
                smallScreenHeight="55%"
                mediumScreenWidth="80%" // Kích thước cho màn hình trung bình
                mediumScreenHeight="48%"
                largeScreenHeight="40%" // Kích thước cho màn hình lớn
                maxHeightScreenHeight="90%" // Kích thước khi màn hình có chiều cao nhỏ
                title={isUpdate ? 'Chỉnh sửa phim' : 'Thêm phim'}
            >
                <div className=" h-90p  grid grid-rows-7 gap-8 ">
                    <div className="grid grid-cols-2 gap-3 p-3">
                        <div className="grid grid-cols-5 gap-5">
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Tên phim"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                className1="col-span-3"
                            />
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Thời lượng"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                className1="col-span-2"
                            />
                        </div>
                        <div className="grid grid-cols-5 ml-5 gap-5">
                            <AutoInputComponent
                                options={rap.map((option) => option.name)}
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Thể loại"
                                freeSolo={false}
                                disableClearable={false}
                                placeholder="Thể loại"
                                heightSelect={150}
                                className1="col-span-3"
                            />
                            <AutoInputComponent
                                options={rap.map((option) => option.name)}
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Quốc gia"
                                freeSolo={false}
                                disableClearable={false}
                                placeholder="Quốc gia"
                                heightSelect={150}
                                className1="col-span-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 ">
                        <div className="grid grid-cols-5 gap-5">
                            <AutoInputComponent
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Đạo diễn"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                className1="col-span-3"
                            />
                            <InputComponent
                                title="Ngày phát hành"
                                className="rounded-[5px] "
                                className1="col-span-2"
                                type="date"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-5 ml-5">
                            <InputComponent
                                title="Ngày kết thúc"
                                className="rounded-[5px] "
                                className1="col-span-3"
                                type="date"
                            />
                            <SelectComponent
                                value="0"
                                title="Giới hạn tuổi"
                                options={optionsQG}
                                className1="col-span-2"
                            />
                        </div>
                    </div>
                    <div className="w-full p-3 ">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Diễn viên"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />
                    </div>

                    <div className="p-3">
                        <div className="flex space-x-5 ">
                            <InputComponent
                                title="Hình ảnh"
                                className="rounded-[5px] "
                                className1="w-3/5"
                                type="file"
                            />
                            <InputComponent
                                title="Trailer"
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="rounded-[5px] "
                                className1="w-2/5 "
                            />
                        </div>
                    </div>

                    <div className="grid row-span-2 p-3 ">
                        <div>
                            <h1 className="text-[16px] truncate mb-1 ">Mô tả</h1>
                            <textarea
                                className="border py-[6px] px-4 border-[gray] rounded-[5px] w-full h-90p resize-none overflow-auto"
                                placeholder="Nhập mô tả"
                            />
                        </div>
                    </div>
                    <div className="grid row-span-1  items-center border-t  py-3">
                        <div className=" justify-end flex space-x-3 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Film;
