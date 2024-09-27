import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from '~/setup/axios';
const { getFormattedDate } = require('~/utils/dateUtils');
const fetchProductNotSeat = async () => {
    const [productNotSeat] = await Promise.all([axios.get('api/products/getAllNotSeat')]);
    console.log('...check res', productNotSeat);
    return {
        product: productNotSeat,
    };
};

const Foood = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [type, setType] = useState('Mặc định');
    const [selectedFood, setSelectedFood] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setOpen(false);
        setImage(null);
        setIsUpdate(false);
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    console.log('...check isUpdate', isUpdate);
    const {
        data: { product } = {},
        error,
        isLoading,
        isFetched,
        refetch,
    } = useQuery('productNotSeat', fetchProductNotSeat, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });
    // Kiểm tra trạng thái tải
    if (isLoading) return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

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

    const options = [
        { value: '1', label: 'Mặc định' },
        { value: '2', label: 'Combo' },
    ];
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
    const validate = () => {
        if (isUpdate) return true;
        if (!name) {
            toast.error('Tên không được để trống!');
            return false;
        }
        if (!description) {
            toast.error('Mô tả không được để trống!');
            return false;
        }
        if (!image) {
            toast.error('Hình ảnh không được để trống!');
            return false;
        }
        return true;
    };

    const formDataFood = () => {
        let check = validate();
        if (!isUpdate && !check) return;
        const form = new FormData();
        form.append('name', name);
        form.append('description', description);
        form.append('type', type === 'Mặc định' ? 1 : 2);
        form.append('image', image);
        return form;
    };

    const handleAddFood = async () => {
        const form = formDataFood();
        if (!form) return;
        try {
            // Gửi yêu cầu POST
            await axios.post('api/products', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Thêm thành công!');
            refetch();
            setName('');
            setDescription('');
            handleClose();
        } catch (error) {
            toast.error('Thêm thất bại!');
        }
    };

    const handleUpdateFood = async () => {
        const form = formDataFood();
        try {
            await axios.post(`api/products/${selectedFood?.code}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Cập nhật thành công!');
            refetch();
            setName('');
            setDescription('');
            handleClose();
        } catch (error) {
            toast.error('Cập nhật thất bại!');
        }
    };

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Đồ ăn & nước</h1>
                <div className="overflow-x-auto  xl:overflow-hidden">
                    <div className="grid grid-cols-4  gap-12 items-center w-full h-16 px-3 min-w-[1100px] max-lg:pr-24 custom-hubmax2">
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
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto h-[100%]">
                    <div className="bg-white border-b py-1 sticky top-0 z-10 justify-center items-center uppercase text-[13px] font-bold text-slate-500 grid grid-cols-8 gap-6 min-w-[1100px] max-lg:pr-24 custom-hubmax2">
                        <div className="grid col-span-2 grid-cols-9 gap-3 justify-center items-center">
                            <h1 className="grid justify-center col-span-2 items-center">STT </h1>
                            <h1 className="grid justify-center col-span-2 items-center">Mã SP </h1>
                            <h1 className="grid justify-center items-center col-span-5">Tên </h1>
                        </div>

                        <h1 className="grid ">Hình ảnh</h1>
                        <h1 className="grid ">Mô tả</h1>
                        <h1 className="grid ">Ngày tạo</h1>
                        <h1 className="grid">Ngày sửa</h1>
                        <h1 className="grid">Trạng thái</h1>
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-[3px] rounded-[40px] bg-orange-400"
                                onClick={() => handleOpen(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="py-1">
                        {product.map((item, index) => (
                            <div
                                className="border-b py-3 justify-center text-[15px] font-normal text-slate-500 grid grid-cols-8 items-center gap-6 min-w-[1100px] max-lg:pr-24 custom-hubmax2"
                                key={item.productId}
                            >
                                <div className="grid col-span-2 gap-3 grid-cols-9 justify-center items-center">
                                    <h1 className="grid pl-3 col-span-2">{index + 1}</h1>
                                    <h1 className="grid pl-3 col-span-2">{item.code}</h1>
                                    <h1 className=" grid ml-3 col-span-5 ">{item.name}</h1>
                                </div>
                                <div className="justify-center items-center grid ">
                                    <LazyLoadImage src={item.image} alt={item.name} width={65} />
                                </div>

                                <h1 className="grid ">{item.description}</h1>
                                <h1 className="grid break-all">{getFormattedDate(item.createdAt)}</h1>
                                <h1 className="grid break-all">{getFormattedDate(item.updatedAt)}</h1>
                                <div className="grid justify-center">
                                    <button
                                        className={`border px-2 w-[auto] uppercase text-white text-[13px] py-[2px] flex rounded-[40px] ${
                                            item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    >
                                        {item.status}
                                    </button>
                                </div>
                                <div className="  justify-center col-span-1 items-center grid ">
                                    <div className="grid grid-cols-3">
                                        <button
                                            className="col-span-2"
                                            onClick={() => {
                                                handleOpen(true, false);
                                                setSelectedFood(item);
                                            }}
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
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="35%"
                height="55%"
                smallScreenWidth="50%"
                smallScreenHeight="35%"
                mediumScreenWidth="50%"
                mediumScreenHeight="30%"
                largeScreenHeight="27%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="60%"
                maxHeightScreenWidth="45%"
                heightScreen="45%"
                title={isUpdate ? 'Chỉnh thức ăn và đồ uống' : 'Thêm thức ăn và nước'}
            >
                <div className=" h-90p grid grid-rows-5">
                    <div className="grid p-3 grid-cols-3 gap-x-6">
                        <AutoInputComponent
                            value={isUpdate ? selectedFood?.name : name}
                            onChange={setName}
                            title="Tên"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="col-span-2"
                        />
                        <AutoInputComponent
                            value={
                                isUpdate ? (selectedFood?.type === 1 ? 'Mặc định' : 'Combo') : type || options[0].label
                            }
                            onChange={setType}
                            options={options.map((option) => option.label)}
                            title="Loại"
                            freeSolo={true}
                            disableClearable={false}
                            defaultValue={options[0].label}
                            heightSelect={200}
                        />
                    </div>

                    <div className="grid p-3 gap-x-6">
                        <AutoInputComponent
                            value={isUpdate ? selectedFood?.description : description}
                            onChange={setDescription}
                            title="Mô tả"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="col-span-2"
                        />
                    </div>
                    <div className="grid items-center grid-cols-7 row-span-2">
                        <div className="grid p-3 col-span-5">
                            <InputComponent
                                title="Hình "
                                className="rounded-[5px] "
                                type="file"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="justify-end col-span-2 flex  pr-4">
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="phim1"
                                    className="w-28 custom-height-sm24 h-[135px] object-contain"
                                />
                            ) : (
                                isUpdate && (
                                    <img
                                        src={selectedFood?.image}
                                        alt="phim1"
                                        className="w-28 custom-height-sm24 h-[135px] object-contain"
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <div className="grid items-center">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className="bg-blue-500"
                                onClick={isUpdate ? handleUpdateFood : handleAddFood}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Foood;
