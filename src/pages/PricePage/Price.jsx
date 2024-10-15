import axios from 'axios';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineDeleteOutline, MdSwapVert } from 'react-icons/md';
import { useQuery } from 'react-query';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import Loading from '~/components/LoadingComponent/Loading';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { set } from 'lodash';

const { Option } = Select;
const { getFormatteNgay } = require('~/utils/dateUtils');

const fetchPrice = async () => {
    try {
        const response = await axios.get('api/prices');

        return { prices: response.data };
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to fetch data');
    }
};

const fetchProducts = async () => {
    try {
        const response = await axios.get('api/products/getAllNotSeat');
        const optionFood = response.data
            .filter((item) => item.status === 1)
            .map((item) => ({
                code: item.code,
                name: item.name,
            }));
        return { products: response.data, optionFood: optionFood };
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to fetch data');
    }
};

const Price = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const [openLoaiKM, setOpenLoaiKM] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [selectedMovie, setSelectedMovie] = useState('');
    const [visibleRooms, setVisibleRooms] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [typePrice, setTypePrice] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productCode, setProductCode] = useState('');
    const [detailDescription, setDetailDescription] = useState('');
    const [detailPrice, setDetailPrice] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedProductTypeCode, setSelectedProductTypeCode] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedRoomTypeCode, setSelectedRoomTypeCode] = useState('');
    const [selectDetail, setSelectDetail] = useState(null);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedTimeSlotCode, setSelectedTimeSlotCode] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteType, setDeleteType] = useState('');
    const [statusPrice, setStatusPrice] = useState('');
    const [statusPriceCode, setStatusPriceCode] = useState('');
    const optionsSort = [
        { value: 3, name: 'Tất cả' },
        { value: 1, name: 'Ghế' },
        { value: 2, name: 'Đồ ăn & nước uống' },
    ];
    const optionsStatus = [
        { value: 0, name: 'Mới tạo' },
        { value: 1, name: 'Hoạt động' },
        { value: 2, name: 'Ngừng hoạt động' },
    ];
    const [selectedSort, setSelectedSort] = useState(optionsSort[0]);
    const fetchPricesAndProducts = async () => {
        try {
            const [productTypeResponse, roomTypeResponse] = await Promise.all([
                axios.get('api/product-types'),
                axios.get('api/room-types'),
            ]);

            const productTypes = productTypeResponse.data;
            const roomTypes = roomTypeResponse.data;

            const optionRoomTypes = roomTypes.map((item) => ({
                code: item.code,
                name: item.name,
            }));

            const optionProductTypes = productTypes.map((item) => ({
                code: item.code,
                name: item.name,
            }));

            return { productTypes, optionProductTypes, roomTypes, optionRoomTypes };
        } catch (error) {
            console.error(error.message);
            throw new Error('Failed to fetch data');
        }
    };

    const { data, isLoading, isFetched, error } = useQuery('pricesAndProducts', fetchPricesAndProducts, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: { prices = [] } = {},
        isLoading: isLoadingPrice,
        isFetched: isFetchedPrice,
        isError: isErrorPrice,
        refetch: refetchPrice,
    } = useQuery('fetchPricePage', fetchPrice, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        // onSuccess: (data) => {
        //     setFoodFilter(data.product);
        // },
    });
    const {
        data: { products = [], optionFood = [] } = {},
        isLoading: isLoadingProduct,
        isFetched: isFetchedProduct,
        isError: isErrorProduct,
    } = useQuery('fetchProducts', fetchProducts, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        // onSuccess: (data) => {
        //     setFoodFilter(data.product);
        // },
    });

    const handleOpen = (isUpdate, type) => {
        setOpen(true);
        setTypePrice(type);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setOpen(false);
        setTypePrice('');
        setSelectedPrice(null);
        setDescription('');
        setEndDate('');
        setStartDate('');
        setSelectedDayOfWeek([]);
        setSelectedTimeSlot('');
        setSelectedTimeSlotCode('');
        setStatusPrice('');
        setStatusPriceCode('');
    };

    const handleOpenLoaiKM = (isUpdate, type) => {
        setOpenLoaiKM(true);
        setIsUpdate(isUpdate);
        setType(type);
        setSelectedPrice(null);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedPrice(null);
        setProductCode('');
        setSelectedProduct('');
    };

    const handleOpenDetail = (type) => {
        setOpenDetail(true);
        setType(type);
    };

    const handleOpenDelete = (item, type) => {
        setSelectedPrice(item);
        setOpenDelete(true);
        setDeleteType(type);
        setSelectDetail(item);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedPrice(null);
        setSelectDetail(null);
        setDeleteType('');
    };

    const handleChangeDay = (value) => {
        setSelectedDayOfWeek(value);
    };

    const handleTimeSlotChang = (value) => {
        const selectedItem = optionTimeSlot?.find((item) => item.label === value);
        if (selectedItem) {
            setSelectedTimeSlot(value);
            setSelectedTimeSlotCode(selectedItem.value);
        } else {
            setSelectedTimeSlot('');
            setSelectedTimeSlotCode('');
        }
    };

    const handleProductChang = (value) => {
        const selectedItem = optionFood.find((item) => item.name === value);
        if (selectedItem) {
            setSelectedProduct(value);
            setProductCode(selectedItem.code);
        } else {
            setSelectedProduct('');
            setProductCode('');
        }
    };

    const handleProductTypeChang = (value) => {
        const selectedItem = data.optionProductTypes.find((item) => item.name === value);
        if (selectedItem) {
            setSelectedProductType(value);
            setSelectedProductTypeCode(selectedItem.code);
        } else {
            setSelectedProductType('');
            setSelectedProductTypeCode('');
        }
    };

    const handleStatusChang = (value) => {
        const selectedItem = optionsStatus.find((item) => item.name === value);
        if (selectedItem) {
            setStatusPrice(value);
            setStatusPriceCode(selectedItem.value);
        } else {
            setStatusPrice('');
            setStatusPriceCode('');
        }
    };

    const handleRoomTypeChang = (value) => {
        const selectedItem = data.optionRoomTypes.find((item) => item.name === value);
        if (selectedItem) {
            setSelectedRoomType(value);
            setSelectedRoomTypeCode(selectedItem.code);
        } else {
            setSelectedRoomType('');
            setSelectedRoomTypeCode('');
        }
    };

    const handleCloseLoaiKM = () => {
        setOpenLoaiKM(false);
        setSelectedPrice(null);
        setProductCode('');
        setSelectedProduct('');
        setDetailPrice('');
        setSelectedProductTypeCode('');
        setDetailDescription('');
        setSelectedProductType('');
        setSelectedRoomTypeCode('');
        setSelectDetail(null);
    };
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

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

    const clearText = () => {
        setStartDate('');
        setEndDate('');
        setDescription('');
        setSelectedDayOfWeek([]);
        setSelectedTimeSlot('');
        setStatusPrice('');
        setStatusPriceCode('');
        setSelectedTimeSlotCode('');
    };

    const changStatus = (value) => {
        if (value === 2) {
            return 'Ngừng hoạt động';
        } else if (value === 1) {
            return 'Hoạt động';
        } else {
            return 'Mới tạo';
        }
    };

    const checkExitsPrice = () => {
        const price = prices.find((item) => {
            const dayExists = selectedDayOfWeek.some((day) => item.dayOfWeek.includes(day));
            const descriptionMatch = item.description === description;
            const timeSlotMatch = item.timeSlot === Number(selectedTimeSlotCode);

            const inputStartDate = new Date(startDate);
            const itemEndDate = new Date(item.endDate);

            const isDateValid = inputStartDate <= itemEndDate;

            return descriptionMatch && dayExists && timeSlotMatch && isDateValid;
        });

        return !price;
    };

    const checkExitsPriceFood = () => {
        const price = prices.find((item) => {
            const descriptionMatch = item.description === description;

            const inputStartDate = new Date(startDate);
            const itemEndDate = new Date(item.endDate);

            const isDateValid = inputStartDate <= itemEndDate;

            return descriptionMatch && isDateValid;
        });

        return !price;
    };

    if (isLoading || isLoadingPrice || isLoadingProduct) return <Loading />;
    if (!isFetched || !isFetchedPrice || !isFetchedProduct) return <div>Fetching...</div>;
    if (error || isErrorPrice || isErrorProduct)
        return <div>Error loading data: {error.message || isErrorPrice.message || isErrorProduct}</div>;

    const checkPriceFoodNull = () => {
        if (description !== '' && startDate !== '' && endDate !== '') {
            return true;
        }
        return false;
    };

    const checkPriceNull = () => {
        if (
            description !== '' &&
            startDate !== '' &&
            endDate !== '' &&
            selectedDayOfWeek.length > 0 &&
            selectedTimeSlotCode !== ''
        ) {
            return true;
        }
        return false;
    };

    const handleAddPriceFood = async () => {
        try {
            if (!checkPriceFoodNull()) {
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if (!checkExitsPriceFood()) {
                toast.error('Bảng giá đã tồn tại');
                return;
            }
            await axios.post('api/prices', {
                description: description,
                startDate: startDate,
                endDate: endDate,
                type: String(typePrice),
            });

            toast.success('Thêm bảng giá thành công');
            clearText();
            setOpen(false);
            refetchPrice();
        } catch (error) {
            toast.error('Thêm bảng giá thất bại');
        }
    };

    const handleAdd = async () => {
        try {
            if (!checkPriceNull()) {
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if (!checkExitsPrice()) {
                toast.error('Bảng giá đã được tạo trong khoảng thời gian này!');
                return;
            }
            await axios.post('api/prices', {
                description: description,
                startDate: startDate,
                endDate: endDate,
                dayOfWeek: selectedDayOfWeek,
                timeSlot: selectedTimeSlotCode,
                type: String(typePrice),
            });

            toast.success('Thêm bảng giá thành công!');
            clearText();
            setOpen(false);
            refetchPrice();
        } catch (error) {
            toast.error('Thêm bảng giá thất bại!');
        }
    };

    const handleUpdate = async () => {
        try {
            if (
                !description &&
                !startDate &&
                !endDate &&
                selectedDayOfWeek.length === 0 &&
                !selectedTimeSlotCode &&
                !statusPrice
            ) {
                toast.error('Vui lòng nhập thông tin cần cập nhật');
                return;
            }

            if (!checkExitsPrice()) {
                toast.error('Bảng giá đã được tạo trong khoảng thời gian này!');
                return;
            }

            if (selectedPrice.type === '1') {
                if (statusPriceCode) {
                    if (selectedPrice.status === 1) {
                        toast.info('Bảng giá đã hoạt động!');
                        return;
                    }
                    const startDateToCheck = selectedPrice.startDate;
                    const isDateConflict = prices.some((price) => {
                        return (
                            price.type === '1' &&
                            price.status === 1 &&
                            price.startDate <= startDateToCheck &&
                            price.endDate >= startDateToCheck
                        );
                    });

                    if (isDateConflict) {
                        toast.error('Ngày bắt đầu trùng với bảng giá đang hoạt động!');
                        return;
                    }
                }

                const startDateToCheck = startDate ? new Date(startDate) : new Date(selectedPrice.startDate);
                const currentDescription = description || selectedPrice.description;
                const descriptionExists = prices.some(
                    (price) =>
                        price.description === currentDescription &&
                        new Date(price.startDate) <= startDateToCheck &&
                        new Date(price.endDate) >= startDateToCheck &&
                        price.code !== selectedPrice.code,
                );

                if (descriptionExists) {
                    toast.error('Bảng giá đã tồn tại!');
                    return;
                }
                await axios.post(`api/prices/${selectedPrice.code}`, {
                    description: description || selectedPrice.description,
                    startDate: startDate || selectedPrice.startDate,
                    endDate: endDate || selectedPrice.endDate,
                    status: statusPriceCode || selectedPrice.status,
                });
            } else {
                if (statusPriceCode) {
                    if (selectedPrice.status === 1) {
                        toast.error('Bảng giá đang hoạt động không thể cập nhật trạng thái!');
                        return;
                    }

                    const startDateToCheck = selectedPrice.startDate;
                    const isDateConflict = prices.some((price) => {
                        return (
                            price.type === '0' &&
                            price.status === 1 &&
                            price.description === selectedPrice.description &&
                            price.dayOfWeek.toString() === selectedPrice.dayOfWeek.toString() &&
                            price.timeSlot === selectedPrice.timeSlot &&
                            price.startDate <= startDateToCheck &&
                            price.endDate >= startDateToCheck
                        );
                    });

                    if (isDateConflict) {
                        toast.error('Ngày bắt đầu trùng với bảng giá đang hoạt động!');
                        return;
                    }
                }
                const currentDescription = description || selectedPrice.description;

                const dayOfWeek = selectedDayOfWeek.length > 0 ? selectedDayOfWeek : selectedPrice.dayOfWeek;
                const timeSlot = selectedTimeSlotCode || selectedPrice.timeSlot;
                const startDateToCheck = startDate ? new Date(startDate) : new Date(selectedPrice.startDate);

                const isDateConflict = prices.some((price) => {
                    return (
                        price.description === currentDescription &&
                        price.dayOfWeek.toString() === dayOfWeek.toString() &&
                        price.timeSlot === timeSlot &&
                        new Date(price.startDate) <= startDateToCheck &&
                        new Date(price.endDate) >= startDateToCheck &&
                        price.code !== selectedPrice.code
                    );
                });

                if (isDateConflict) {
                    toast.error('Bảng giá đã được tạo!');
                    return;
                }

                await axios.post(`api/prices/${selectedPrice.code}`, {
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    dayOfWeek: selectedDayOfWeek.length > 0 ? selectedDayOfWeek : selectedPrice.dayOfWeek,
                    timeSlot: selectedTimeSlotCode || selectedPrice.timeSlot,
                    status: statusPriceCode,
                });
            }

            toast.success('Cập nhật bảng giá thành công');
            setOpen(false);
            clearText();
            refetchPrice();
        } catch (error) {
            toast.error('Cập nhật bảng giá thất bại');
        }
    };

    const handleDeletePrice = async () => {
        try {
            await axios.delete(`api/prices/deletePrice/${selectedPrice.code}`);
            toast.success('Xóa bảng giá thành công');
            setOpenDelete(false);
            refetchPrice();
        } catch (error) {
            toast.error('Xóa bảng giá thất bại');
        }
    };

    const handleDeletePriceDetail = async () => {
        try {
            await axios.delete(`api/prices/deletePriceDetail/${selectDetail.code}`);
            toast.success('Xóa chi tiết bảng giá thành công');
            setOpenDelete(false);
            refetchPrice();
        } catch (error) {
            toast.error('Xóa chi tiết bảng giá thất bại');
        }
    };

    const handleAddDetailProduct = async () => {
        if (selectedProduct === '' || detailDescription === '' || detailPrice === '') {
            toast.warn('Vui lòng nhập đầy đủ thông tin');
            return;
        } else {
            try {
                await axios.post('api/prices/addPriceDetailProduct', {
                    priceCode: selectedPrice.code,
                    productCode: productCode,
                    description: detailDescription,
                    price: detailPrice,
                });

                toast.success('Thêm chi tiết bảng giá đồ ăn thành công!');
                setOpenLoaiKM(false);
                setProductCode('');
                setSelectedProduct('');
                setSelectedPrice(null);
                setDetailPrice('');
                setDetailDescription('');

                refetchPrice();
            } catch (error) {
                toast.error('Sản phẩm đã có bảng giá!');
            }
        }
    };
    const handleAddDetailSeat = async () => {
        try {
            await axios.post('api/prices/addPriceDetailSeat', {
                productTypeCode: selectedProductTypeCode,
                roomTypeCode: selectedRoomTypeCode,
                priceCode: selectedPrice.code,
                description: detailDescription,
                price: detailPrice,
            });

            toast.success('Thêm chi tiết bảng giá ghế thành công!');
            setOpenLoaiKM(false);
            setProductCode('');
            setSelectedProductType('');
            setSelectedRoomType('');
            setSelectedPrice(null);
            setDetailPrice('');
            setDetailDescription('');
            refetchPrice();
        } catch (error) {
            toast.error('Ghế đã có bảng giá!');
        }
    };

    const handleUpdateDetail = async () => {
        try {
            if (!detailDescription && !detailPrice) {
                toast.error('Vui lòng nhập thông tin cần cập nhật');
                return;
            }
            await axios.post(`api/prices/updateDetail/${selectDetail.code}`, {
                description: detailDescription || selectDetail.description,
                price: detailPrice || selectDetail.price,
            });

            toast.success('Cập nhật chi tiết bảng giá thành công');
            setOpenLoaiKM(false);
            setProductCode('');
            setSelectedProduct('');
            setDetailPrice('');
            setDetailDescription('');
            setSelectedProductType('');
            setSelectedRoomType('');
            setSelectDetail(null);
            refetchPrice();
        } catch (error) {
            toast.error('Cập nhật chi tiết bảng giá thất bại');
        }
    };

    const onChangeStart = (date, dateString) => {
        setStartDate(dateString);
    };
    const onChangeEnd = (date, dateString) => {
        setEndDate(dateString);
    };
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    const optionDayOfWeek = [
        { value: 0, label: 'CN' },
        { value: 1, label: '2' },
        { value: 2, label: '3' },
        { value: 3, label: '4' },
        { value: 4, label: '5' },
        { value: 5, label: '6' },
        { value: 6, label: '7' },
    ];

    const optionTimeSlot = [
        { value: 1, label: 'Cả ngày' },
        { value: 2, label: 'Trước 17h' },
        { value: 3, label: 'Sau 17h' },
    ];
    const optionsLoc = [
        { value: '0', label: 'Lọc thể loại' },
        { value: 'KD', label: 'Kinh dị' },
        { value: 'HH', label: 'Hài hước' },
        { value: 'TC', label: 'Tình cảm' },
    ];

    const getTimeSlotLabel = (timeSlot) => {
        const found = optionTimeSlot.find((item) => item.value === timeSlot);
        return found ? found.label : '';
    };

    const sortFood = (newValue) => {
        if (newValue === null) {
            setSelectedSort(optionsSort[0]);
            return;
        }
        setSelectedSort(newValue);
    };

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white overflow-x-auto overflow-y-hidden  xl:overflow-hidden border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Bảng giá</h1>
                <div className="grid grid-cols-4 gap-12 items-center w-full h-16 px-3 min-w-[900px]">
                    <AutoInputComponent
                        value={selectedSort?.name}
                        onChange={(newValue) => sortFood(newValue)}
                        options={optionsSort}
                        title="Loại sản phẩm"
                        freeSolo={true}
                        disableClearable={false}
                        heightSelect={200}
                        borderRadius="10px"
                        onBlur={(event) => {
                            event.preventDefault();
                        }}
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
            <div className="overflow-auto bg-white border shadow-md rounded-[10px] box-border custom-hubmax h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div>
                    {(selectedSort.value === 1 || selectedSort.value === 3) && (
                        <div>
                            <h1 className="font-bold text-[16px] p-2 ">Ghế</h1>

                            <div className="gradient-button text-[13px] text-white font-semibold h-auto py-1 grid grid-cols-9 items-center gap-3 min-w-[1150px]">
                                <h1 className="uppercase grid col-span-1 justify-center items-center ">Mã bảng giá</h1>
                                <h1 className="uppercase grid col-span-2 justify-center items-center">Mô tả</h1>
                                <h1 className="uppercase grid justify-center items-center">Thứ</h1>
                                <h1 className="uppercase grid justify-center items-center">Khung giờ</h1>
                                <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                                <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                                <div className="flex justify-center">
                                    <button
                                        className="border px-4 py-[3px] rounded-[40px] bg-white"
                                        onClick={() => handleOpen(false, 0)}
                                    >
                                        <IoIosAddCircleOutline color="orange" size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="h-[92%] height-sm-1 mb-4 min-w-[1150px]">
                                {[...prices.filter((item) => item.type === '0')].reverse().map((item) => (
                                    <div key={item.code}>
                                        <div className="bg-[#E6E6E6] text-[14px] py-[6px] font-normal h-[45px] text-slate-500 grid grid-cols-9 items-center gap-3 mb-1 ">
                                            <div className="grid col-span-1 grid-cols-4 items-center gap-2">
                                                <div
                                                    className="justify-center col-span-1 pl-4 grid"
                                                    onClick={() => {
                                                        toggleVisibility(item.code);
                                                        toggleDropdown(item.code);
                                                    }}
                                                >
                                                    {isDropdownOpen[item.code] ? (
                                                        <FaChevronUp color="gray" size={20} />
                                                    ) : (
                                                        <FaChevronDown color="gray" size={20} />
                                                    )}
                                                </div>
                                                <h1 className="uppercase grid col-span-3  pl-4 items-center">
                                                    {item.code}
                                                </h1>
                                            </div>
                                            <h1 className="uppercase grid col-span-2">{item.description}</h1>
                                            <h1 className="grid justify-center items-center">
                                                {item.dayOfWeek
                                                    .map((day) => {
                                                        if (day === 0) {
                                                            return 'CN'; // Thay 0 bằng 'CN' cho Chủ nhật
                                                        } else {
                                                            return day === 1
                                                                ? '2'
                                                                : day === 2
                                                                ? '3'
                                                                : day === 3
                                                                ? '4'
                                                                : day === 4
                                                                ? '5'
                                                                : day === 5
                                                                ? '6'
                                                                : day === 6
                                                                ? '7'
                                                                : ''; // Thay các ngày từ 1 đến 6 bằng tên viết tắt tương ứng
                                                        }
                                                    })
                                                    .join(', ')}
                                            </h1>
                                            <h1 className="grid justify-center items-center">
                                                {item.timeSlot === 1
                                                    ? 'Cả ngày'
                                                    : item.timeSlot === 2
                                                    ? 'Trước 17h'
                                                    : 'Sau 17h'}
                                            </h1>
                                            <h1 className="grid justify-center items-center">
                                                {getFormatteNgay(item.startDate)}
                                            </h1>
                                            <h1 className="grid justify-center items-center">
                                                {getFormatteNgay(item.endDate)}
                                            </h1>
                                            <div className="justify-center col-span-2  grid-cols-5 items-center grid">
                                                <div className="grid col-span-3 justify-center">
                                                    <button
                                                        className={`border px-2 uppercase text-white text-[13px] truncate py-1 flex rounded-[40px] ${
                                                            item.status === 0
                                                                ? 'bg-gray-400'
                                                                : item.status === 1
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                    >
                                                        {item.status === 0
                                                            ? 'Mới tạo'
                                                            : item.status === 1
                                                            ? 'Hoạt động'
                                                            : 'Ngừng hoạt động'}
                                                    </button>
                                                </div>

                                                <div className="justify-center grid col-span-2 grid-cols-2 items-center ">
                                                    <button
                                                        className="grid justify-center"
                                                        onClick={() => {
                                                            handleOpen(true, 0);
                                                            setSelectedPrice(item);
                                                        }}
                                                        disabled={item.status === 2 ? true : false}
                                                    >
                                                        <FaRegEdit
                                                            color={`${item.status === 2 ? 'gray' : 'black'}`}
                                                            size={22}
                                                        />
                                                    </button>
                                                    <button
                                                        className=" grid justify-center items-center"
                                                        onClick={() => {
                                                            handleOpenDelete(item, 1);
                                                            setSelectedPrice(item);
                                                        }}
                                                        disabled={item.status === 1 || item.status === 2}
                                                    >
                                                        <MdOutlineDeleteOutline
                                                            color={`${item.status === 0 ? 'black' : 'gray'}`}
                                                            fontSize={23}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {visibleRooms[item.code] && (
                                            <>
                                                <div className="border-b  text-[13px] font-bold h-[45px] uppercase text-slate-500 grid grid-cols-11 items-center gap-2">
                                                    <h1 className="grid col-span-1 justify-center items-center">STT</h1>
                                                    <h1 className="grid col-span-1 justify-center items-center">
                                                        Mã CTBG
                                                    </h1>

                                                    <h1 className="grid col-span-2 justify-center items-center">
                                                        Loại phòng chiếu
                                                    </h1>
                                                    <h1 className="grid justify-center col-span-2 items-center">Tên</h1>
                                                    <h1 className="grid col-span-2 justify-center items-center">
                                                        Mô tả
                                                    </h1>
                                                    <h1 className="grid justify-center items-center">Giá</h1>

                                                    <div className="grid justify-center col-span-2">
                                                        <button
                                                            className="border px-4 py-1 mb-1 rounded-[40px] gradient-button"
                                                            onClick={() => {
                                                                handleOpenLoaiKM(false, 1);
                                                                setSelectedPrice(item);
                                                            }}
                                                        >
                                                            <IoIosAddCircleOutline color="white" size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="height-sm-1">
                                                    {item?.priceDetails?.map((item, index) => (
                                                        <div
                                                            className="border-b text-[15px] py-1 font-normal h-[45px] text-slate-500 grid grid-cols-11 items-center gap-3"
                                                            key={item.code}
                                                        >
                                                            <h1 className=" grid col-span-1 justify-center items-center ">
                                                                {index + 1}
                                                            </h1>
                                                            <h1 className=" grid col-span-1 justify-center items-center ">
                                                                {item.code}
                                                            </h1>
                                                            <h1 className=" grid col-span-2 justify-center items-center ">
                                                                {item.roomTypeCode?.name}
                                                            </h1>
                                                            <h1 className=" grid pl-3 col-span-2 items-center">
                                                                {item.productTypeCode?.name}
                                                            </h1>
                                                            <h1 className=" grid col-span-2 pl-3 items-center">
                                                                {item?.description}
                                                            </h1>
                                                            <h1 className=" grid items-center justify-center">
                                                                {formatCurrency(item?.price)}
                                                            </h1>

                                                            <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                                <button
                                                                    className=""
                                                                    onClick={() => {
                                                                        handleOpenLoaiKM(true, 1);
                                                                        setSelectDetail(item);
                                                                        setSelectedPrice(
                                                                            prices.find(
                                                                                (price) =>
                                                                                    price.code === item.priceCode,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    disabled={item?.priceCode?.status === 1}
                                                                >
                                                                    <FaRegEdit
                                                                        color={`${
                                                                            item?.priceCode?.status === 1
                                                                                ? 'gray'
                                                                                : 'black'
                                                                        }`}
                                                                        size={20}
                                                                    />
                                                                </button>
                                                                <button
                                                                    className=""
                                                                    onClick={() => handleOpenDetail(item.type)}
                                                                >
                                                                    <FaRegEye color="black" fontSize={20} />
                                                                </button>

                                                                <button
                                                                    className=" grid justify-center items-center"
                                                                    onClick={() => {
                                                                        handleOpenDelete(item, 2);
                                                                    }}
                                                                    disabled={item?.priceCode?.status === 1}
                                                                >
                                                                    <MdOutlineDeleteOutline
                                                                        color={`${
                                                                            item?.priceCode?.status === 1
                                                                                ? 'gray'
                                                                                : 'black'
                                                                        }`}
                                                                        fontSize={22}
                                                                    />
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
                    )}
                    {(selectedSort.value === 2 || selectedSort.value === 3) && (
                        <div className="bg-slate-200 h-8 min-w-[1150px]"></div>
                    )}
                    {(selectedSort.value === 2 || selectedSort.value === 3) && (
                        <div>
                            <h1 className="font-bold text-[16px] p-2 ">Đồ ăn và nước uống</h1>
                            <div className="gradient-button text-[13px] text-white font-semibold h-[40px] py-1 grid grid-cols-8 items-center gap-3 min-w-[1150px] ">
                                <h1 className="uppercase grid col-span-1 justify-center items-center">Mã bảng giá</h1>
                                <h1 className="uppercase grid col-span-3 justify-center items-center">Mô tả</h1>
                                <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                                <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                                <div className="flex justify-center">
                                    <button
                                        className="border px-4 py-1 rounded-[40px] bg-white"
                                        onClick={() => handleOpen(false, 1)}
                                    >
                                        <IoIosAddCircleOutline color="orange" size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="h-[70%] height-sm-1 mb-8 min-w-[1150px]">
                                {[...prices.filter((item) => item.type === '1')].reverse().map((item) => (
                                    <div key={item.code}>
                                        <div className="bg-[#E6E6E6] text-[14px] py-[6px] font-normal h-[45px] text-slate-500 grid grid-cols-8 items-center gap-3 mb-1 ">
                                            <div className="grid col-span-1 grid-cols-4 items-center gap-5">
                                                <div
                                                    className="justify-center col-span-1 pl-4 grid"
                                                    onClick={() => {
                                                        toggleVisibility(item.code);
                                                        toggleDropdown(item.code);
                                                    }}
                                                >
                                                    {isDropdownOpen[item.code] ? (
                                                        <FaChevronUp color="gray" size={20} />
                                                    ) : (
                                                        <FaChevronDown color="gray" size={20} />
                                                    )}
                                                </div>
                                                <h1 className="uppercase grid col-span-3 pl-2 items-center">
                                                    {item.code}
                                                </h1>
                                            </div>
                                            <h1 className="uppercase grid col-span-3">{item.description}</h1>

                                            <h1 className="grid justify-center items-center">
                                                {getFormatteNgay(item.startDate)}
                                            </h1>
                                            <h1 className="grid justify-center items-center">
                                                {getFormatteNgay(item.endDate)}
                                            </h1>
                                            <div className="justify-center items-center grid">
                                                <button
                                                    className={`border px-2 uppercase text-white text-[13px] truncate py-1 flex rounded-[40px] ${
                                                        item.status === 0
                                                            ? 'bg-gray-400'
                                                            : item.status === 1
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status === 0
                                                        ? 'Mới tạo'
                                                        : item.status === 1
                                                        ? 'Hoạt động'
                                                        : 'Ngừng hoạt động'}
                                                </button>
                                            </div>
                                            <div className="justify-center grid grid-cols-2 items-center ">
                                                <button
                                                    className=" grid justify-center"
                                                    onClick={() => {
                                                        handleOpen(true, 1);
                                                        setSelectedPrice(item);
                                                    }}
                                                >
                                                    <FaRegEdit color="black" size={22} />
                                                </button>

                                                <button
                                                    className=" grid justify-center items-center"
                                                    onClick={() => {
                                                        handleOpenDelete(item, 1);
                                                        setSelectedPrice(item);
                                                    }}
                                                    disabled={item.status === 1}
                                                >
                                                    <MdOutlineDeleteOutline
                                                        color={`${item.status === 1 ? 'gray' : 'black'}`}
                                                        fontSize={23}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        {visibleRooms[item.code] && (
                                            <>
                                                <div className="border-b text-[13px] font-bold uppercase h-[40px] text-slate-500 grid grid-cols-10 items-center gap-3">
                                                    <h1 className="grid col-span-1 justify-center items-center">STT</h1>
                                                    <h1 className="grid col-span-1 justify-center items-center">
                                                        Mã CTBG
                                                    </h1>
                                                    <h1 className="grid col-span-3 justify-center items-center">Tên</h1>
                                                    <h1 className="grid col-span-2 justify-center items-center">
                                                        Mô tả
                                                    </h1>
                                                    <h1 className="grid justify-center items-center">Giá</h1>

                                                    <div className="grid justify-center col-span-2">
                                                        <button
                                                            className="border px-4 py-1 rounded-[40px] gradient-button"
                                                            onClick={() => {
                                                                handleOpenLoaiKM(false, 2);
                                                                setSelectedPrice(item);
                                                            }}
                                                        >
                                                            <IoIosAddCircleOutline color="white" size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="height-sm-1">
                                                    {item.priceDetails.map((item, index) => (
                                                        <div
                                                            className="border-b py-1 text-[15px] font-normal h-[40px] text-slate-500 grid grid-cols-10 items-center gap-3"
                                                            key={item.code}
                                                        >
                                                            <h1 className=" grid col-span-1 justify-center items-center ">
                                                                {index + 1}
                                                            </h1>
                                                            <h1 className=" grid col-span-1 justify-center items-center ">
                                                                {item.code}
                                                            </h1>
                                                            <h1 className=" grid col-span-3 pl-3 items-center ">
                                                                {item.productCode.name}
                                                            </h1>
                                                            <h1 className=" grid col-span-2  items-center">
                                                                {item.description}
                                                            </h1>
                                                            <h1 className=" grid items-center justify-center">
                                                                {formatCurrency(item.price)}
                                                            </h1>

                                                            <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                                                <button
                                                                    className=""
                                                                    onClick={() => {
                                                                        handleOpenLoaiKM(true, 2);
                                                                        setSelectDetail(item);
                                                                        setSelectedPrice(
                                                                            prices.find(
                                                                                (price) =>
                                                                                    price.code === item.priceCode,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    disabled={item?.priceCode?.status === 1}
                                                                >
                                                                    <FaRegEdit
                                                                        color={`${
                                                                            item?.priceCode?.status === 1
                                                                                ? 'gray'
                                                                                : 'black'
                                                                        }`}
                                                                        size={20}
                                                                    />
                                                                </button>
                                                                <button
                                                                    className=""
                                                                    onClick={() => handleOpenDetail(item.type)}
                                                                >
                                                                    <FaRegEye color="black" fontSize={20} />
                                                                </button>
                                                                <button
                                                                    className=" grid justify-center items-center"
                                                                    onClick={() => {
                                                                        handleOpenDelete(item, 2);
                                                                    }}
                                                                    disabled={item?.priceCode?.status === 1}
                                                                >
                                                                    <MdOutlineDeleteOutline
                                                                        color={`${
                                                                            item?.priceCode?.status === 1
                                                                                ? 'gray'
                                                                                : 'black'
                                                                        }`}
                                                                        fontSize={22}
                                                                    />
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
                    )}
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="40%"
                height={typePrice === 0 ? '49%' : '36%'}
                top="30%"
                left="55%"
                smallScreenWidth="65%"
                smallScreenHeight={typePrice === 0 ? '33%' : '26%'}
                mediumScreenWidth="65%"
                mediumScreenHeight={typePrice === 0 ? '30%' : '23%'}
                largeScreenHeight={typePrice === 0 ? '25%' : '20%'}
                largeScreenWidth="50%"
                maxHeightScreenHeight={typePrice === 0 ? '55%' : '44%'}
                maxHeightScreenWidth="45%"
                heightScreen={typePrice === 0 ? '45%' : '33%'}
                widthScreen="40%"
                title={isUpdate ? 'Chỉnh sửa bảng giá' : 'Thêm bảng giá'}
            >
                <div className={`h-[80%] grid ${typePrice === 0 ? 'grid-rows-4' : 'grid-rows-3'} gap-3`}>
                    <div className="grid">
                        <div className="grid grid-cols-2 gap-8 p-3 ">
                            <AutoInputComponent
                                value={isUpdate ? selectedPrice?.description : description}
                                onChange={setDescription}
                                title="Mô tả"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                disabled={selectedPrice?.status === 1 ? true : false}
                            />
                            {/* value={isUpdate ? selectDetail?.roomTypeCode?.name : selectedRoomType}
                            onChange={handleRoomTypeChang}
                            options={data.optionRoomTypes.map((item) => item.name)}
                            title="Loại phòng chiếu"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={130}
                            className1="p-3"
                            disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false} */}
                            <AutoInputComponent
                                value={isUpdate ? changStatus(selectedPrice?.status) : changStatus(statusPrice)}
                                onChange={handleStatusChang}
                                options={
                                    selectedPrice?.status === 0
                                        ? optionsStatus.filter((item) => item.value !== 2).map((item) => item.name)
                                        : optionsStatus.filter((item) => item.value !== 0).map((item) => item.name)
                                }
                                freeSolo={false}
                                disableClearable={true}
                                title="Trạng thái"
                                placeholder="Mới tạo"
                                heightSelect={150}
                                disabled={!isUpdate || selectedPrice?.status === 1 ? true : false}
                            />
                        </div>
                    </div>
                    <div className="grid items-center gap-2 ">
                        <div className="grid grid-cols-2 gap-8 p-3 ">
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                <DatePicker
                                    value={
                                        startDate
                                            ? dayjs(startDate)
                                            : isUpdate && selectedPrice?.startDate
                                            ? dayjs(selectedPrice.startDate)
                                            : null
                                    }
                                    minDate={dayjs().add(1, 'day')}
                                    onChange={onChangeStart}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    format="YYYY-MM-DD"
                                    disabled={selectedPrice?.status === 1 ? true : false}
                                    className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                <DatePicker
                                    value={
                                        endDate
                                            ? dayjs(endDate)
                                            : isUpdate && selectedPrice?.endDate
                                            ? dayjs(selectedPrice.endDate)
                                            : null
                                    }
                                    onChange={onChangeEnd}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    minDate={startDate ? dayjs(startDate) : dayjs()}
                                    format="YYYY-MM-DD"
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`grid items-center ${typePrice === 0 ? 'row-span-2' : 'row-span-1'}  gap-2 `}>
                        {typePrice === 0 && (
                            <div className="grid grid-cols-2 gap-8 p-3 z-50">
                                <div className="">
                                    <h1 className="text-[16px] truncate mb-1 ">Thứ</h1>

                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Chọn tùy chọn"
                                        value={
                                            isUpdate
                                                ? selectedDayOfWeek.length > 0
                                                    ? selectedDayOfWeek
                                                    : selectedPrice?.dayOfWeek
                                                : selectedDayOfWeek
                                        }
                                        onChange={handleChangeDay}
                                        className="h-[36px] w-full border border-black rounded-[5px]"
                                        dropdownStyle={{ maxHeight: '200px', overflow: 'auto' }}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        maxTagCount={3}
                                        disabled={selectedPrice?.status === 1 ? true : false}
                                    >
                                        {optionDayOfWeek.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <AutoInputComponent
                                    value={isUpdate ? getTimeSlotLabel(selectedPrice?.timeSlot) : selectedTimeSlot}
                                    onChange={handleTimeSlotChang}
                                    options={optionTimeSlot.map((item) => item.label)}
                                    title="Khung giờ"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    height={40}
                                    disabled={selectedPrice?.status === 1 ? true : false}
                                />
                            </div>
                        )}
                        <div className="justify-end flex space-x-3 border-t py-[6px] px-4 mt-3 pt-3 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className=" bg-blue-500 "
                                onClick={() => {
                                    isUpdate ? handleUpdate() : typePrice === 0 ? handleAdd() : handleAddPriceFood();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openLoaiKM}
                handleClose={handleCloseLoaiKM}
                width="30%"
                height={type === 1 ? '55%' : '46%'}
                smallScreenWidth="45%"
                smallScreenHeight={type === 1 ? '40%' : '34%'}
                mediumScreenWidth="45%"
                mediumScreenHeight={type === 1 ? '35%' : '30%'}
                largeScreenHeight={type === 1 ? '30%' : '25%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '65%' : '56%'}
                maxHeightScreenWidth="45%"
                heightScreen={type === 1 ? '50%' : '43%'}
                title={isUpdate ? 'Chỉnh sửa chi tiết bảng giá' : 'Thêm chi tiết bảng giá'}
            >
                <div className={`h-[80%] grid ${type === 1 ? 'grid-rows-5' : 'grid-rows-4'} gap-2`}>
                    {type === 1 && (
                        <AutoInputComponent
                            value={isUpdate ? selectDetail?.roomTypeCode?.name : selectedRoomType}
                            onChange={handleRoomTypeChang}
                            options={data.optionRoomTypes.map((item) => item.name)}
                            title="Loại phòng chiếu"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={130}
                            className1="p-3"
                            disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false}
                        />
                    )}

                    {type === 2 && (
                        <AutoInputComponent
                            value={isUpdate ? selectDetail?.productCode?.name : selectedProduct}
                            onChange={handleProductChang}
                            options={optionFood.map((item) => item.name)}
                            title="Tên"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={130}
                            className1="p-3"
                            disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false}
                        />
                    )}

                    {type === 1 && (
                        <AutoInputComponent
                            value={isUpdate ? selectDetail?.productTypeCode?.name : selectedProductType}
                            onChange={handleProductTypeChang}
                            options={data.optionProductTypes.map((item) => item.name)}
                            title="Loại ghế"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={130}
                            className1="p-3"
                            disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false}
                        />
                    )}
                    <AutoInputComponent
                        value={isUpdate ? selectDetail?.description : detailDescription}
                        onChange={setDetailDescription}
                        title="Mô tả"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                        disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false}
                    />

                    <div className="grid items-center row-span-2  gap-2 ">
                        <AutoInputComponent
                            value={isUpdate ? String(selectDetail?.price) : String(detailPrice)}
                            onChange={setDetailPrice}
                            title="Giá"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                            disabled={isUpdate && selectDetail?.priceCode?.status === 1 ? true : false}
                        />

                        <div className="justify-end flex space-x-3 border-t py-4 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseLoaiKM} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className=" bg-blue-500 "
                                onClick={
                                    isUpdate
                                        ? handleUpdateDetail
                                        : type === 1
                                        ? handleAddDetailSeat
                                        : handleAddDetailProduct
                                }
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="35%"
                height={type === 1 ? '72%' : '66%'}
                smallScreenWidth="45%"
                smallScreenHeight={type === 1 ? '53%' : '48%'}
                mediumScreenWidth="45%"
                mediumScreenHeight={type === 1 ? '46%' : '43%'}
                largeScreenHeight={type === 1 ? '40%' : '37%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '90%' : '83%'}
                maxHeightScreenWidth="45%"
                heightScreen={type === 1 ? '68%' : '62%'}
                title="Chi tiết bảng giá"
            >
                <div className={`h-[80%] grid ${type === 1 ? 'grid-rows-7' : 'grid-rows-6'} gap-10`}>
                    {type === 1 && (
                        <SelectComponent
                            value={selectedValue}
                            onChange={handleChange}
                            options={optionsLoc}
                            className="border border-[gray]"
                            className1="p-3"
                            title="Loại phòng chiếu"
                        />
                    )}

                    <AutoInputComponent
                        value={selectedProduct} // Hiển thị tên
                        onChange={(newValue) => setSelectedProduct(newValue)}
                        options={products.map((item) => item.name)}
                        title="Tên"
                        freeSolo={false}
                        disableClearable={true}
                        placeholder="Nhập ..."
                        className1="p-3"
                        heightSelect={130}
                    />
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Mô tả"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                    />

                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Giá"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                    />
                    <InputComponent
                        placeholder="Ngày tạo"
                        title="Ngày tạo"
                        className="rounded-[5px]"
                        className1="p-3"
                        disabled={true}
                    />
                    <div className="grid items-center row-span-2  gap-2 ">
                        <InputComponent
                            placeholder="Ngày cập nhật"
                            title="Ngày cập nhật"
                            className="rounded-[5px]"
                            className1="p-3"
                            disabled={true}
                        />

                        <div className="justify-end flex space-x-3 border-t py-4 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseLoaiKM} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDelete}
                handleClose={handleCloseDelete}
                width="25%"
                height="32%"
                smallScreenWidth="40%"
                smallScreenHeight="25%"
                mediumScreenWidth="40%"
                mediumScreenHeight="20%"
                largeScreenHeight="20%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="40%"
                maxHeightScreenWidth="40%"
                title={deleteType === 1 ? 'Xóa bảng giá' : 'Xóa chi tiết bảng giá'}
            >
                <div className="h-[80%] grid grid-rows-3 ">
                    <h1 className="grid row-span-2 p-3">
                        Bạn đang thực hiện xóa {deleteType === 1 ? 'bảng giá' : 'chi tiết bảng giá'} này. Bạn có chắc
                        chắn xóa không?
                    </h1>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xác nhận"
                                className="bg-blue-500"
                                onClick={() => {
                                    deleteType === 1
                                        ? handleDeletePrice(selectedPrice?.code)
                                        : handleDeletePriceDetail(selectDetail.code);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Price;
