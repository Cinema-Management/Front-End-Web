import axios from 'axios';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronDown, FaChevronUp, FaRegCopy } from 'react-icons/fa6';
import { IoIosAddCircleOutline, IoIosInformationCircleOutline } from 'react-icons/io';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import Loading from '~/components/LoadingComponent/Loading';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { DatePicker, Select, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { set } from 'lodash';
import { type } from '@testing-library/user-event/dist/type';

const { Option } = Select;
const { getFormatteNgay, FormatDate, getTimeSlot } = require('~/utils/dateUtils');

const fetchPrice = async () => {
    try {
        const response = await axios.get('api/prices');
        const optionPrice = response.data
        .filter((item) => item.status === 0)
        .map((item) => ({
            
            code: item.code,
            description: item.description,
            dayOfWeek: item.dayOfWeek,
            timeSlot: item.timeSlot,
            type: item.type,
        }));


        return { prices: response.data, optionPrice: optionPrice };
    } catch (error) {
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
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
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
    const [priceFilter, setPriceFilter] = useState([]);
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);
    const { RangePicker } = DatePicker;
    const [showAllPrice, setShowAllPrice] = useState(false);
    const [disableOtherDays, setDisableOtherDays] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [openCopy, setOpenCopy] = useState(false);
    const [selectedPriceCopy, setSelectedPriceCopy] = useState([]);
    const queryClient = useQueryClient();
    const optionsSort = [
        { value: 3, name: 'Tất cả' },
        { value: 1, name: 'Ghế' },
        { value: 2, name: 'Đồ ăn & nước uống' },
    ];
    const optionsStatus = [
        { value: 3, name: 'Tất cả' },
        { value: 0, name: 'Chưa hoạt động' },
        { value: 1, name: 'Hoạt động' },
        { value: 2, name: 'Ngừng hoạt động' },
    ];
    const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0]);
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
        data: { prices = [], optionPrice = [] } = {},
        isLoading: isLoadingPrice,
        isFetched: isFetchedPrice,
        isRefetching: isRefetchingPrice,
        isError: isErrorPrice,
        refetch: refetchPrice,
    } = useQuery('fetchPricePage', fetchPrice, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        onSuccess: (prices) => {
            setPriceFilter(prices);
        },
    });
    const {
        data: { optionFood = [] } = {},
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
        setShowAllPrice(false);
    };

    const handleOpenLoaiKM = (isUpdate, type) => {
        setOpenLoaiKM(true);
        setIsUpdate(isUpdate);
        setType(type);
        setSelectedPrice(null);
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

    const handleOpenCopy = (item,type) => {
        setType(type);
        setOpenCopy(true);
        setSelectedPrice(item);
    };
    const handleCloseCopy = () => {
        setOpenCopy(false);
        setType('');
        setEndDate('');
        setStartDate('');
        setSelectedPrice(null);
    };
    
    console.log('optionPrice', optionPrice);

    const handleChangeDay = (value) => {
        if (value.includes(2)) {
            // Nếu chọn ngày 2, xóa tất cả các lựa chọn khác
            setSelectedDayOfWeek([2]);
            setDisableOtherDays(true);
        } else {
            // Nếu không chọn ngày 2, cho phép lựa chọn tự do
            setSelectedDayOfWeek(value);
            setDisableOtherDays(false);
        }
        setSelectedTimeSlot('');
        setSelectedTimeSlotCode('');
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
        setSelectedRoomType('');
        setSelectedProductTypeCode('');
        setSelectDetail(null);
        setType('');
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

    function disableEndDatePrice(prices, selectedStartDate) {
        const currentDate = dayjs(); 

        return (current) => {
            if (!current || !dayjs(current).isValid()) {
                return true;
            }

            const currentDayjs = dayjs(current);
            const startDayjs = dayjs(selectedStartDate); 

            if (currentDayjs.isBefore(currentDate, 'day')) {
                return true; 
            }

            if (currentDayjs.isBefore(startDayjs, 'day')) {
                return true;
            }

            let nextPriceStartDate = null;

            for (let i = 0; i < prices?.length; i++) {
                const priceStartDate = dayjs(prices[i].startDate);

                if (priceStartDate.isAfter(startDayjs)) {
                    nextPriceStartDate = priceStartDate;
                    break; 
                }
            }


            if (nextPriceStartDate) {
                if (currentDayjs.isAfter(nextPriceStartDate.subtract(1, 'day'))) {
                    return true;
                }
            }

            return false; 
        };
    }
    const handleTooltipClick = () => {
        setVisible(!visible);
    };
    const changStatus = (value) => {
        if (value === 2) {
            return 'Ngừng hoạt động';
        } else if (value === 1) {
            return 'Hoạt động';
        } else {
            return 'Chưa hoạt động';
        }
    };
    const handleChangePrice = (value) => {
        const selectedOptions = optionPrice.filter(option => value.includes(option.code));
        setSelectedPriceCopy(selectedOptions);
    };
    const checkExitsPrice = () => {
        const price = prices.find((item) => {
            const dayExists = selectedDayOfWeek.some((day) => item.dayOfWeek.includes(day));

            let timeSlotMatch = false;
            timeSlotMatch = item.timeSlot === Number(selectedTimeSlotCode);

            const inputStartDate = new Date(startDate);
            const itemEndDate = new Date(item.endDate);
            const isDateValid = inputStartDate <= itemEndDate;
            const isDifferentPriceCode = item.code !== selectedPrice?.code;
            return dayExists && timeSlotMatch && isDateValid && isDifferentPriceCode;
        });

        return !price;
    };

    const checkExitsPriceAll = (priceAll) => {
        const price = prices.find((item) => {
            if (item.type !== '0') {
                return false;
            }

            const dayExists = priceAll.dayOfWeek.some((day) => item.dayOfWeek.includes(day));
            const timeSlotMatch = item.timeSlot === priceAll.timeSlot;

            const inputStartDate = new Date(priceAll.startDate);

            const itemEndDate = new Date(item.endDate);

            const isDateValid = inputStartDate <= itemEndDate;

            return dayExists && timeSlotMatch && isDateValid;
        });

        return !price;
    };

    const checkExitsPriceFood = () => {
        const price = prices.find((item) => {
            if (item.type !== '1') {
                return false;
            }
            const inputStartDate = new Date(startDate);
            const itemEndDate = new Date(item.endDate);

            const isDateValid = inputStartDate <= itemEndDate;

            return isDateValid;
        });

        return !price;
    };

    const checkPriceFoodNull = () => {
        if (description !== '' && startDate !== '' && endDate !== null) {
            return true;
        }
        return false;
    };

    const checkPriceNull = () => {
        if (showAllPrice) {
            if (startDate !== '' && endDate !== null) {
                return true;
            }
        } else {
            if (
                description !== '' &&
                startDate !== '' &&
                endDate !== null &&
                selectedDayOfWeek.length > 0 &&
                selectedTimeSlotCode !== ''
            ) {
                return true;
            }
        }
        return false;
    };

    const handleAddPriceFood = async () => {
        try {
            if (!checkPriceFoodNull()) {
                toast.warn('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if (!checkExitsPriceFood()) {
                toast.warn('Bảng giá đã tồn tại');
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
        let loadingToastId;

        try {
            if (showAllPrice) {
                if (!checkPriceNull()) {
                    toast.warn('Vui lòng nhập đầy đủ thông tin');
                    return;
                }
                const arrayPrice = [
                    {
                        description: 'Bảng giá thứ 3',
                        dayOfWeek: [2],
                        timeSlot: 1,
                    },
                    {
                        description: 'Bảng giá trong tuần (T2-6)',
                        dayOfWeek: [1, 3, 4, 5],
                        timeSlot: 2,
                    },
                    {
                        description: 'Bảng giá trong tuần (T2-6)',
                        dayOfWeek: [1, 3, 4, 5],
                        timeSlot: 3,
                    },
                    {
                        description: 'Bảng giá cuối tuần (T7,CN)',
                        dayOfWeek: [6, 0],
                        timeSlot: 3,
                    },
                    {
                        description: 'Bảng giá cuối tuần (T7,CN)',
                        dayOfWeek: [6, 0],
                        timeSlot: 2,
                    },
                ];

                for (const price of arrayPrice) {
                    price.startDate = startDate;
                    price.endDate = endDate;
                    price.type = String(typePrice);

                    const exists = checkExitsPriceAll(price);
                    if (!exists) {
                        toast.warn(
                            `${price.description} ${
                                price.timeSlot === 1 ? 'cả ngày' : price.timeSlot === 2 ? 'trước 17h' : 'sau 17h'
                            } đã tồn tại trong khoảng thời gian này!`,
                        );
                        return;
                    }
                }
                loadingToastId = toast.loading('Đang tạo bảng giá!');
                setLoading(true);
                for (const price of arrayPrice) {
                    await axios.post('api/prices', {
                        description: price.description,
                        startDate: price.startDate,
                        endDate: price.endDate,
                        dayOfWeek: price.dayOfWeek,
                        timeSlot: price.timeSlot,
                        type: price.type,
                    });
                }
                toast.dismiss(loadingToastId);
                toast.success('Thêm bảng giá thành công!');
                setLoading(false);
                clearText();
                setOpen(false);
                refetchPrice();
                setShowAllPrice(false);
            } else {
                if (!checkPriceNull()) {
                    toast.warn('Vui lòng nhập đầy đủ thông tin');
                    return;
                }

                if (!checkExitsPrice()) {
                    toast.warn('Bảng giá đã được tạo trong khoảng thời gian này!');
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
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            setLoading(false);
            toast.error('Thêm bảng giá thất bại!');
        }
    };



    const handleUpdate = async () => {
        try {
            if (!dayjs(selectedPrice?.startDate).isSame(startDate, 'day') && endDate === '') {
                toast.warn('Vui lòng chọn ngày kết thúc');
                return;
            }
            if (
                !description &&
                dayjs(selectedPrice?.startDate).isSame(startDate, 'day') &&
                dayjs(selectedPrice?.endDate).isSame(endDate, 'day') &&
                selectedDayOfWeek.length === 0 &&
                !selectedTimeSlotCode &&
                !statusPrice
            ) {
                toast.warn('Vui lòng nhập thông tin cần cập nhật');
                return;
            }

            if (!checkExitsPrice()) {
                toast.warn('Bảng giá đã được tạo trong khoảng thời gian này!');
                return;
            }

            if (selectedPrice.type === '1') {
                if (statusPriceCode) {
                    if (selectedPrice.status === 1) {
                        toast.warn('Bảng giá đã hoạt động!');
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
                        toast.warn('Ngày bắt đầu trùng với bảng giá đang hoạt động!');
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
                    toast.warn('Bảng giá đã tồn tại!');
                    return;
                }
                await axios.post(`api/prices/${selectedPrice.code}`, {
                    description: description || selectedPrice.description,
                    startDate: dayjs(selectedPrice?.startDate).isSame(startDate, 'day') ? undefined : startDate,
                    endDate: dayjs(selectedPrice?.endDate).isSame(endDate, 'day') ? undefined : endDate,
                    status: statusPriceCode || selectedPrice.status,
                });
            } else {
                if (statusPriceCode) {
                    if (selectedPrice.status === 1) {
                        toast.warn('Bảng giá đang hoạt động không thể cập nhật trạng thái!');
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
                        toast.warn('Ngày bắt đầu trùng với bảng giá đang hoạt động!');
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
                    toast.warn('Bảng giá đã được tạo!');
                    return;
                }

                await axios.post(`api/prices/${selectedPrice.code}`, {
                    description: description,
                    startDate: dayjs(selectedPrice?.startDate).isSame(startDate, 'day') ? undefined : startDate,
                    endDate: dayjs(selectedPrice?.endDate).isSame(endDate, 'day') ? undefined : endDate,
                    dayOfWeek: selectedDayOfWeek.length > 0 ? selectedDayOfWeek : selectedPrice.dayOfWeek,
                    timeSlot: selectedTimeSlotCode || selectedPrice.timeSlot,
                    status: statusPriceCode,
                });
            }

            toast.success('Cập nhật bảng giá thành công');
            setOpen(false);
            clearText();
            setSelectedPrice(null);
            refetchPrice();
        } catch (error) {
            toast.error('Cập nhật bảng giá thất bại');
        }
    };

    const handleCopyPrice = async () => {
        let loadingToastId;
        const api = type === 0 ? 'api/prices/copyPrice' : 'api/prices/copyPriceFood';
        const arrayPriceCopy = selectedPriceCopy.map(item => 
            item.code,
        );
        
        if(arrayPriceCopy.length === 0){
            toast.warn('Vui lòng chọn bảng giá cần chuyển qua');
            return;
        }
        try {
            loadingToastId = toast.loading('Đang sao chép bảng giá!');
            setLoading(true);
             await axios.post(api, {
                sourcePriceCode: selectedPrice.code,
                selectedPriceCodes: arrayPriceCopy,
            });
            toast.dismiss(loadingToastId);
            toast.success('Sao chép bảng giá thành công');
            setSelectedPriceCopy([]);
            setLoading(false);
            setSelectedPrice(null);
            setOpenCopy(false);
            refetchPrice();
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error('Sao chép bảng giá thất bại');
        }
    };

    const mutation = useMutation(handleUpdate, {
        onSuccess: () => {
            queryClient.refetchQueries('fetchSeatByRoomCode');
            queryClient.refetchQueries('productNotSeat1');
        },
    });
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
            const checkExitsPriceDetail = () => {
                return selectedPrice.priceDetails.some((detail) => {
                    return detail.productCode.code === productCode;
                });
            };

            if (checkExitsPriceDetail()) {
                toast.warn('Sản phẩm đã có bảng giá!');
                return;
            }
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
                toast.warn('Sản phẩm đã có bảng giá!');
            }
        }
    };

    const handleAddDetailSeat = async () => {
        if (selectedProductType === '' || selectedRoomType === '' || detailDescription === '' || detailPrice === '') {
            toast.warn('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const checkExitsPriceDetail = () => {
            return selectedPrice.priceDetails.some((detail) => {
                return (
                    detail.productTypeCode.code === selectedProductTypeCode &&
                    detail.roomTypeCode.code === selectedRoomTypeCode
                );
            });
        };

        if (checkExitsPriceDetail()) {
            toast.warn('Ghế đã có bảng giá!');
            return;
        }
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
            toast.warn('Ghế đã có bảng giá!');
        }
    };
    const handleUpdateDetail = async () => {
        try {
            if (type === 1) {
                if (!detailDescription && !detailPrice && !selectedProductTypeCode && !selectedRoomTypeCode) {
                    toast.warn('Vui lòng nhập đầy đủ thông tin');
                    return;
                }

                const price = prices.find((item) => item.code === selectDetail.priceCode.code);
                const productTypeCode = !selectedProductTypeCode
                    ? selectDetail.productTypeCode.code
                    : selectedProductTypeCode;
                const roomTypeCode = !selectedRoomTypeCode ? selectDetail.roomTypeCode.code : selectedRoomTypeCode;

                const checkExitsPriceDetail = () => {
                    return price.priceDetails.some((detail) => {
                        return (
                            detail.productTypeCode.code === productTypeCode &&
                            detail.roomTypeCode.code === roomTypeCode &&
                            detail.code !== selectDetail.code
                        );
                    });
                };

                if (checkExitsPriceDetail()) {
                    toast.warn('Ghế đã có bảng giá!');
                    return;
                }

                await axios.post(`api/prices/updateDetail/${selectDetail.code}`, {
                    description: detailDescription,
                    productTypeCode: selectedProductTypeCode,
                    roomTypeCode: selectedRoomTypeCode,
                    price: detailPrice,
                    type: selectDetail.type,
                });
            } else {
                if (!selectedProduct && !detailDescription && !detailPrice) {
                    toast.warn('Vui lòng nhập thông tin cần cập nhật');
                    return;
                }

                const price = prices.find((item) => item.code === selectDetail.priceCode.code);
                const codeProduct = !selectedProduct ? selectDetail.productCode.code : productCode;
                const checkExitsPriceDetail = () => {
                    return price.priceDetails.some((detail) => {
                        return detail.productCode.code === codeProduct;
                    });
                };

                if (checkExitsPriceDetail()) {
                    toast.warn('Sản phẩm đã có bảng giá!');
                    return;
                }

                await axios.post(`api/prices/updateDetail/${selectDetail.code}`, {
                    description: detailDescription,
                    price: detailPrice,
                    productCode: productCode,
                    type: selectDetail.type,
                });
            }

            toast.success('Cập nhật chi tiết bảng giá thành công');
            setOpenLoaiKM(false);
            setProductCode('');
            setSelectedProduct('');
            setDetailPrice('');
            setDetailDescription('');
            setSelectedProductType('');
            setSelectedRoomType('');
            setSelectedProductTypeCode('');
            setSelectedRoomTypeCode('');
            setSelectDetail(null);
            refetchPrice();
        } catch (error) {
            toast.error('Cập nhật chi tiết bảng giá thất bại');
        }
    };

    const onChangeStart = (dateString) => {
        setStartDate(dateString);
        setEndDate(null);
    };

    const onChangeEnd = (dateString) => {
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
  
    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setShowAllPrice(checked);
    };

    const getTimeSlotLabel = (timeSlot) => {
        const found = optionTimeSlot.find((item) => item.value === timeSlot);
        return found ? found.label : '';
    };

    const sortFood = (option) => {
        if (!option) {
            setPriceFilter(prices);
            setSelectedSort(optionsSort[0]);
            return;
        }
        setSelectedSort(option);
        let sortedStatus = [];
        if (option.value === 1) {
            sortedStatus = prices.filter((item) => item.type === '0');
            setPriceFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = prices.filter((item) => item.type === '1');
            setPriceFilter(sortedStatus);
        } else if (option.value === 3) {
            sortedStatus = prices;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có bảng giá nào!');
        }
        setPriceFilter(sortedStatus);
        setSelectedStatus(optionsStatus[0]);
        setRangePickerValue(['', '']);
    };
    const sortedStatus = (option) => {
        if (!option) {
            setPriceFilter(prices);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 0) {
            sortedStatus = prices.filter((item) => item.status === 0);
            setPriceFilter(sortedStatus);
        } else if (option.value === 1) {
            sortedStatus = prices.filter((item) => item.status === 1);
            setPriceFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = prices.filter((item) => item.status === 2);
            setPriceFilter(sortedStatus);
        } else if (option.value === 3) {
            sortedStatus = prices;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có bảng giá nào!');
        }
        setPriceFilter(sortedStatus);
        setRangePickerValue(['', '']);
        setSelectedSort(optionsSort[0]);
    };

    const onChangeRanger = (dates) => {
        if (!Array.isArray(dates) || dates.length !== 2) {
            setPriceFilter(prices);
            return;
        }
        setRangePickerValue(dates);
        const startDateFormatted = FormatDate(dates[0]);
        const endDateFormatted = FormatDate(dates[1]);

        const filterDate = prices.filter((item) => {
            const itemDate = FormatDate(new Date(item.startDate));

            return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
        });
        if (filterDate.length === 0) {
            toast.info('Không tìm thấy bảng giá nào trong khoảng thời gian này!');
            setPriceFilter([]);

            return;
        }

        setSelectedSort(optionsSort[0]);
        setSelectedStatus(optionsStatus[0]);
        setPriceFilter(filterDate);
    };

    if (isLoading || isLoadingPrice || isLoadingProduct ||isRefetchingPrice) return <Loading />;
    if (!isFetched || !isFetchedPrice || !isFetchedProduct) return <div>Fetching...</div>;
    if (error || isErrorPrice || isErrorProduct)
        return <div>Error loading data: {error.message || isErrorPrice.message || isErrorProduct.message}</div>;

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white overflow-x-auto overflow-y-hidden  xl:overflow-hidden border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Bảng giá</h1>
                <div className="grid grid-cols-7 gap-12 items-center w-full h-16 px-3 min-w-[900px]">
                    <AutoInputComponent
                        value={selectedSort?.name}
                        onChange={(newValue) => sortFood(newValue)}
                        options={optionsSort}
                        title="Loại sản phẩm"
                        freeSolo={true}
                        disableClearable={true}
                        heightSelect={200}
                        borderRadius="10px"
                        className1="grid col-span-2"
                        onBlur={(event) => {
                            event.preventDefault();
                        }}
                    />
                    <div className="grid col-span-3">
                        <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                        <RangePicker
                            value={rangePickerValue}
                            onChange={onChangeRanger}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            placement="bottomRight"
                            format={'DD-MM-YYYY'}
                            className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                        />
                    </div>

                    <AutoInputComponent
                        value={selectedStatus.name}
                        onChange={(newValue) => sortedStatus(newValue)}
                        options={optionsStatus}
                        title="Trạng thái"
                        freeSolo={true}
                        disableClearable={true}
                        heightSelect={200}
                        borderRadius="10px"
                        className1="grid col-span-2"
                        onBlur={(event) => {
                            event.preventDefault();
                        }}
                    />
                </div>
            </div>
            <div className="overflow-auto bg-white border shadow-md rounded-[10px] box-border custom-hubmax h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div>
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
                            {(priceFilter.length > 0
                                ? [...priceFilter.filter((item) => item.type === '0')].reverse()
                                : [...prices.filter((item) => item.type === '0')].reverse()
                            ).map((item) => (
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
                                                            : ''; 
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
                                                        ? 'Chưa hoạt động'
                                                        : item.status === 1
                                                        ? 'Hoạt động'
                                                        : 'Ngừng hoạt động'}
                                                </button>
                                            </div>

                                            <div className="justify-center grid col-span-2 grid-cols-3 items-center ">
                                                <button
                                                   
                                                    onClick={() => {
                                                        handleOpen(true, 0);
                                                        setSelectedPrice(item);
                                                        setStartDate(dayjs(item.startDate));
                                                        setEndDate(dayjs(item.endDate));
                                                    }}
                                                    disabled={item.status === 2 ? true : false}
                                                >
                                                    <FaRegEdit
                                                        color={`${item.status === 2 ? 'gray' : 'black'}`}
                                                        size={22}
                                                    />
                                                </button>
                                                <button
                                                   
                                                    onClick={() => {
                                                        handleOpenCopy(item, 0);
                                                       
                                                    }}
                                                    disabled={item.status === 0 ? true : false}
                                                
                                                >
                                                    <FaRegCopy  
                                                        color={`${item.status === 0 ? 'gray' : 'black'}`}
                                                        fontSize={22}
                                                    />
                                                </button>
                                                <button
                                                 
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
                                                <h1 className="grid col-span-1 justify-center items-center">Mã CTBG</h1>

                                                <h1 className="grid col-span-2 justify-center items-center">
                                                    Loại phòng chiếu
                                                </h1>
                                                <h1 className="grid justify-center col-span-2 items-center">Tên</h1>
                                                <h1 className="grid col-span-2 justify-center items-center">Mô tả</h1>
                                                <h1 className="grid justify-center items-center">Giá</h1>

                                                <div className="grid justify-center col-span-2">
                                                    <button
                                                        className={`border px-4 py-1 mb-1 rounded-[40px] gradient-button ${
                                                            item.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                        } `}
                                                        onClick={() => {
                                                            handleOpenLoaiKM(false, 1);
                                                            setSelectedPrice(item);
                                                        }}
                                                        disabled={item.status !== 0 ? true : false}
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
                                                                            (price) => price.code === item.priceCode,
                                                                        ),
                                                                    );
                                                                }}
                                                                disabled={item?.priceCode?.status !== 0}
                                                            >
                                                                <FaRegEdit
                                                                    color={`${
                                                                        item?.priceCode?.status !== 0 ? 'gray' : 'black'
                                                                    }`}
                                                                    size={20}
                                                                />
                                                            </button>

                                                            <button
                                                                className=" grid justify-center items-center"
                                                                onClick={() => {
                                                                    handleOpenDelete(item, 2);
                                                                }}
                                                                disabled={item?.priceCode?.status !== 0}
                                                            >
                                                                <MdOutlineDeleteOutline
                                                                    color={`${
                                                                        item?.priceCode?.status !== 0 ? 'gray' : 'black'
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

                    <div className="bg-slate-200 h-8 min-w-[1150px]"></div>

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
                        <div className="h-[70%] height-sm-1 mb-4 min-w-[1150px]">
                            {(priceFilter.length > 0
                                ? [...priceFilter.filter((item) => item.type === '1')].reverse()
                                : [...prices.filter((item) => item.type === '1')].reverse()
                            ).map((item) => (
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
                                            <h1 className="uppercase grid col-span-3 pl-2 items-center">{item.code}</h1>
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
                                                    ? 'Chưa hoạt động'
                                                    : item.status === 1
                                                    ? 'Hoạt động'
                                                    : 'Ngừng hoạt động'}
                                            </button>
                                        </div>
                                        <div className="justify-center grid grid-cols-3 items-center ">
                                            <button
                                                className=" grid "
                                                onClick={() => {
                                                    handleOpen(true, 1);
                                                    setSelectedPrice(item);
                                                    setStartDate(dayjs(item.startDate));
                                                    setEndDate(dayjs(item.endDate));
                                                }}
                                                disabled={item.status === 2 ? true : false}
                                            >
                                                <FaRegEdit
                                                    color={`${item.status === 2 ? 'gray' : 'black'}`}
                                                    size={22}
                                                />
                                            </button>
                                            <button
                                                   onClick={() => {
                                                       handleOpenCopy(item, 1);
                                                   }}
                                                   disabled={item.status === 0 ? true : false}
                                               >
                                                   <FaRegCopy  
                                                      color={`${item.status === 0 ? 'gray' : 'black'}`}
                                                       fontSize={22}
                                                   />
                                               </button>
                                            <button
                                                className=" grid "
                                                onClick={() => {
                                                    handleOpenDelete(item, 1);
                                                    setSelectedPrice(item);
                                                }}
                                                disabled={item.status !== 0}
                                            >
                                                <MdOutlineDeleteOutline
                                                    color={`${item.status !== 0 ? 'gray' : 'black'}`}
                                                    fontSize={23}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    {visibleRooms[item.code] && (
                                        <>
                                            <div className="border-b text-[13px] font-bold uppercase h-[40px] text-slate-500 grid grid-cols-10 items-center gap-3">
                                                <h1 className="grid col-span-1 justify-center items-center">STT</h1>
                                                <h1 className="grid col-span-1 justify-center items-center">Mã CTBG</h1>
                                                <h1 className="grid col-span-3 justify-center items-center">Tên</h1>
                                                <h1 className="grid col-span-2 justify-center items-center">Mô tả</h1>
                                                <h1 className="grid justify-center items-center">Giá</h1>

                                                <div className="grid justify-center col-span-2">
                                                    <button
                                                        className={`border px-4 py-1 rounded-[40px] gradient-button ${
                                                            item.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                        } `}
                                                        onClick={() => {
                                                            handleOpenLoaiKM(false, 2);
                                                            setSelectedPrice(item);
                                                        }}
                                                        disabled={item.status !== 0 ? true : false}
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
                                                                            (price) => price.code === item.priceCode,
                                                                        ),
                                                                    );
                                                                }}
                                                                disabled={item?.priceCode?.status !== 0}
                                                            >
                                                                <FaRegEdit
                                                                    color={`${
                                                                        item?.priceCode?.status !== 0 ? 'gray' : 'black'
                                                                    }`}
                                                                    size={20}
                                                                />
                                                            </button>
                                                            <button
                                                                className=" grid justify-center items-center"
                                                                onClick={() => {
                                                                    handleOpenDelete(item, 2);
                                                                }}
                                                                disabled={item?.priceCode?.status !== 0}
                                                            >
                                                                <MdOutlineDeleteOutline
                                                                    color={`${
                                                                        item?.priceCode?.status !== 0 ? 'gray' : 'black'
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
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="40%"
                height={typePrice === 0 ? '50%' : '38%'}
                top="35%"
                left="55%"
                smallScreenWidth="68%"
                smallScreenHeight={typePrice === 0 ? '36%' : '27%'}
                mediumScreenWidth="68%"
                mediumScreenHeight={typePrice === 0 ? '32%' : '24%'}
                largeScreenHeight={typePrice === 0 ? '28%' : '21%'}
                largeScreenWidth="50%"
                maxHeightScreenHeight={typePrice === 0 ? '63%' : '48%'}
                maxHeightScreenWidth="45%"
                heightScreen={typePrice === 0 ? '46%' : '35%'}
                widthScreen="45%"
                title={isUpdate ? 'Chỉnh sửa bảng giá' : 'Thêm bảng giá'}
            >
                <div className={`h-[80%] grid ${typePrice === 0 ? 'grid-rows-4' : 'grid-rows-3'} gap-2`}>
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
                                disabled={showAllPrice || selectedPrice?.status === 1 ? true : false}
                            />
                            <AutoInputComponent
                                value={isUpdate ? changStatus(selectedPrice?.status) : changStatus(statusPrice)}
                                onChange={handleStatusChang}
                                options={
                                    selectedPrice?.status === 0
                                        ? optionsStatus
                                              .filter((item) => item.value !== 2 && item.value !== 3)
                                              .map((item) => item.name)
                                        : optionsStatus
                                              .filter((item) => item.value !== 0 && item.value !== 3)
                                              .map((item) => item.name)
                                }
                                freeSolo={false}
                                disableClearable={true}
                                title="Trạng thái"
                                placeholder="Chưa hoạt động"
                                heightSelect={150}
                                disabled={!isUpdate || showAllPrice || selectedPrice?.status === 1 ? true : false}
                            />
                        </div>
                    </div>

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
                                    disabled={showAllPrice || selectedPrice?.status === 1 ? true : false}
                                >
                                    {optionDayOfWeek.map((option) => (
                                        <Option
                                            key={option.value}
                                            value={option.value}
                                            disabled={disableOtherDays && option.value !== 2}
                                        >
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <AutoInputComponent
                                value={isUpdate ? getTimeSlotLabel(selectedPrice?.timeSlot) : selectedTimeSlot}
                                onChange={handleTimeSlotChang}
                                options={
                                    selectedDayOfWeek.includes(2)
                                        ? optionTimeSlot.filter((item) => item.value === 1).map((item) => item.label)
                                        : optionTimeSlot.filter((item) => item.value !== 1).map((item) => item.label)
                                }
                                title="Khung giờ"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                height={40}
                                disabled={
                                    showAllPrice || selectedDayOfWeek.length <= 0 || selectedPrice?.status === 1
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    )}
                    <div className="grid items-center gap-2">
                        <div className="grid grid-cols-2 gap-8 p-3 ">
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                <DatePicker
                                    value={startDate}
                                    minDate={dayjs().add(1, 'day')}
                                    onChange={onChangeStart}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    format="DD-MM-YYYY"
                                    disabled={selectedPrice?.status === 1 ? true : false}
                                    className="border  py-[6px]  px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                <DatePicker
                                    value={endDate}
                                    disabledDate={disableEndDatePrice(selectedPrice, startDate)}
                                    onChange={onChangeEnd}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    minDate={startDate ? dayjs(startDate) : dayjs()}
                                    format="DD-MM-YYYY"
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black]"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`grid items-center ${typePrice === 0 ? 'row-span-2' : 'row-span-1'} 
                        ${typePrice === 1 ? 'pt-6' : isUpdate && typePrice === 0 ? 'pt-10' : null} gap-2`}
                    >
                        {typePrice === 0 && !isUpdate && (
                            <div className="flex px-3 py-2">
                                <input
                                    type="checkbox"
                                    id="online"
                                    name="status"
                                    value="Online"
                                    className="p-20 h-10"
                                    style={{ width: '20px', height: '20px' }}
                                    checked={showAllPrice}
                                    onChange={handleCheckboxChange}
                                />

                                <label htmlFor="online" className="text-[16px] ml-3 ">
                                    Tạo tất cả bảng giá tự động
                                </label>

                                <Tooltip
                                    title={
                                        <div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Mô tả</h1>
                                                <h1 className="grid">Thứ</h1>
                                                <h1 className="grid">Khung giờ</h1>
                                            </div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Bảng giá thứ 3</h1>
                                                <h1 className="grid">3</h1>
                                                <h1 className="grid">Cả ngày</h1>
                                            </div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Bảng giá trong tuần (T2-6)</h1>
                                                <h1 className="grid">2, 4, 5, 6</h1>
                                                <h1 className="grid">Trước 17h</h1>
                                            </div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Bảng giá trong tuần (T2-6)</h1>
                                                <h1 className="grid">2, 4, 5, 6</h1>
                                                <h1 className="grid">Sau 17h</h1>
                                            </div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Bảng giá cuối tuần (T7,CN)</h1>
                                                <h1 className="grid">7, CN</h1>
                                                <h1 className="grid">Trước 17h</h1>
                                            </div>
                                            <div className="grid grid-cols-4 ">
                                                <h1 className="grid col-span-2">Bảng giá cuối tuần (T7,CN)</h1>
                                                <h1 className="grid">7, CN</h1>
                                                <h1 className="grid">Sau 17h</h1>
                                            </div>
                                        </div>
                                    }
                                    overlayInnerStyle={{ width: '350px', fontSize: '12px' }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    open={visible}
                                    onClick={() => setVisible(!visible)}
                                    onMouseLeave={() => setVisible(false)}
                                    placement="topRight"
                                >
                                    <div
                                        className="flex items-center ml-1 mt-[2px] cursor-pointer"
                                        onClick={handleTooltipClick}
                                    >
                                        <IoIosInformationCircleOutline size={20} />
                                    </div>
                                </Tooltip>
                            </div>
                        )}
                        <div className="justify-end flex space-x-3 border-t py-[6px] px-4  pt-3 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className={` bg-blue-500 ${loading ? 'pointer-events-none opacity-50' : ''} `}
                                onClick={() => {
                                    isUpdate ? mutation.mutate() : typePrice === 0 ? handleAdd() : handleAddPriceFood();
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
                            placeholder="Nhập giá > 0"
                            heightSelect={200}
                            className1="p-3"
                            type="number"
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
            <ModalComponent
                open={openCopy}
                handleClose={handleCloseCopy}
                width="35%"
                height='55%'
                top="35%"
                left="55%"
                smallScreenWidth="68%"
                smallScreenHeight='37%'
                mediumScreenWidth="68%"
                mediumScreenHeight='35%'
                largeScreenHeight= '28%'
                largeScreenWidth="50%"
                maxHeightScreenHeight= '60%'
                maxHeightScreenWidth="45%"
                heightScreen='50%'
                widthScreen="40%"
                title={`Sao chép bảng giá ${selectedPrice?.code}`}
            >
                <div className="h-[80%] grid grid-rows-9 gap-2">
                  
                <div className="grid grid-rows-7 row-span-8 p-3 h-full">
                <div className="grid row-span-2">
                    <h1 className="text-[16px] truncate mb-1">Chọn bảng giá muốn chuyển qua:</h1>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn bảng giá"
                        value={selectedPriceCopy.map(item => item.code)}
                        onChange={handleChangePrice}
                        className="h-[36px] w-full border border-black rounded-[5px]"
                        listHeight={130}
                        getPopupContainer={(trigger) => trigger.parentNode}
                    >
                 
                        {optionPrice.filter((item) => item.type === String(type)).map((option) => (
                            <Option key={option.code} value={option.code}>
                                {option.name}
                            </Option>
                        ))}
                    
                    </Select>
                </div>
                    

                <div className="grid row-span-5  grid-rows-5 mt-1 rounded">
                    <h1 className="text-[16px] truncate ">Mô tả của các bảng giá muốn chuyển qua:</h1>
                    <div className="grid row-span-4  overflow-auto flex-row border p-2 border-gray-500 rounded">
                       <div className='flex flex-col gap-1'>
                            {selectedPriceCopy?.map((item) => (
                                <h1 className="" key={item.code}>{item.description} - {getTimeSlot(item.timeSlot)}</h1>
                            ))}
                       </div>
                    </div>
                </div>
                </div>

                  
                       
                        <div className="justify-end flex space-x-3 border-t py-[6px] px-4  pt-3 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseCopy} />
                            <ButtonComponent
                                text="Xác nhận"
                                onClick={handleCopyPrice}
                                className={` bg-blue-500 ${loading ? 'pointer-events-none opacity-50' : ''} `}
                                
                            />
                        </div>

                </div>
            </ModalComponent>
            
        </div>
    );
};

export default Price;
