import React, { useState } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import phim1 from '~/assets/phim1.png';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
// import ModalComponent from '~/components/ModalComponent/ModalComponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';

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
            status: 'Online',
        },
        {
            id: 2,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Ma Da',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Online',
        },
        {
            id: 3,
            genre: 'Kinh dị',
            image: phim1,
            name: 'Làm giàu với ma',
            duration: '120 phút',
            releaseDate: '1-8-2024',
            endDate: '1-10-2024',
            status: 'Online',
        },
    ];
    const options = [
        { value: '0', label: 'Chọn' },
        { value: 'Kinh dị', label: 'Kinh dị' },
        { value: 'Hành động', label: 'Hành động' },
        { value: 'Tình cảm, Hài hước', label: 'Tình cảm, Hài hước' },
    ];
    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
        { value: 'HQ', label: 'Hàn Quốc' },
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

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1  px-10 py-3 h-40">
                <h1 className="font-bold text-[20px] ">Phim</h1>
                <div className="grid grid-cols-3 gap-3 lg:gap-[66px] xl:gap-[111px] items-center w-full h-16">
                    <InputComponent placeholder="Nhập tên rạp" className="rounded-[10px] " />

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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[500px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
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
                                <button className="border px-3 text-white text-base py-[2px] flex  rounded-[40px] uppercase bg-[#22E242] ">
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
                                    <FaRegEdit color="black" size={25} />
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
                height="85%"
                smallScreenWidth="90%" // Kích thước cho màn hình nhỏ
                smallScreenHeight="65%"
                mediumScreenWidth="80%" // Kích thước cho màn hình trung bình
                mediumScreenHeight="60%"
                largeScreenHeight="45%" // Kích thước cho màn hình lớn
                maxHeightScreenHeight="95%" // Kích thước khi màn hình có chiều cao nhỏ
                title={isUpdate ? 'Chỉnh sửa phim' : 'Thêm phim'}
            >
                <div className=" h-90p bg-red-400 grid grid-rows-8 gap-14 p-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex space-x-5 ">
                            <InputComponent
                                placeholder="Nhập tên phim"
                                title="Tên phim"
                                className="rounded-[5px] "
                                className1="w-3/5"
                            />
                            <InputComponent
                                placeholder="Thời lượng"
                                title="Thời lượng"
                                className="rounded-[5px] "
                                className1="w-2/5 "
                            />
                        </div>
                        <div className="flex space-x-5 ml-5">
                            <SelectComponent value="0" title="Thể loại" options={options} className1="w-2/3 " />
                            <SelectComponent value="0" title="Quốc gia" options={optionsQG} className1="w-1/3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 ">
                        <div className="flex space-x-5 ">
                            <InputComponent
                                placeholder="Nhập tên đạo diễn"
                                title="Tên phim"
                                className="rounded-[5px] "
                                className1="w-3/5"
                            />
                            <InputComponent
                                title="Ngày phát hành"
                                className="rounded-[5px] "
                                className1="w-2/5 "
                                type="date"
                            />
                        </div>
                        <div className="flex space-x-5 ml-5">
                            <InputComponent
                                title="Ngày kết thúc"
                                className="rounded-[5px] "
                                className1="w-1/2 "
                                type="date"
                            />
                            <SelectComponent value="0" title="Giới hạn tuổi" options={optionsQG} className1="w-1/2" />
                        </div>
                    </div>
                    <div className="w-full  ">
                        <InputComponent
                            placeholder="Nhập tên đạo diễn"
                            title="Đạo diễn"
                            className="rounded-[5px] w-full"
                        />
                    </div>
                    <div className="w-full  ">
                        <InputComponent
                            placeholder="Nhập tên diễn viên"
                            title="Diễn viên"
                            className="rounded-[5px] w-full"
                        />
                    </div>

                    <div>
                        <div className="flex space-x-5 ">
                            <InputComponent
                                placeholder="Nhập tên đạo diễn"
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

                    <div className="grid  row-span-2">
                        <div>
                            <h1 className="text-[16px] truncate mb-1 ">Mô tả</h1>
                            <textarea
                                className="border py-[6px] px-4 border-[gray] rounded-[5px] w-full h-90p resize-none overflow-auto"
                                placeholder="Nhập mô tả"
                            />
                        </div>
                    </div>
                    <div className="grid row-span-1  items-center">
                        <div className=" justify-end flex space-x-3 ">
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
