import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import InputComponent from '~/components/InputComponent/InputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FixedSizeList as List } from 'react-window';
import Loading from '~/components/LoadingComponent/Loading';
import axios from '~/setup/axios';
import HeightComponent from '~/components/HeightComponent/HeightComponent';
import { DatePicker, Modal } from 'antd';
import dayjs from 'dayjs';
const { getFormatteNgay, FormatSchedule } = require('~/utils/dateUtils');

const Food = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState('Mặc định');
    const [selectedFood, setSelectedFood] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [foodFilter, setFoodFilter] = useState([]);
    const [inputSearch, setInputSearch] = useState('');
    const [selectDate, setSelectDate] = useState('');
    const [statusFood, setStatusFood] = useState('');
    const [statusFoodCode, setStatusFoodCode] = useState('');
    const queryClient = useQueryClient();
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [inputSets, setInputSets] = useState([
        { code: '', name: '', quantity: 0 },
        { code: '', name: '', quantity: 0 },
    ]);
    const optionsSort = [
        { value: 3, name: 'Tất cả' },
        { value: 1, name: 'Bắp & nước' },
        { value: 2, name: 'Combo' },
    ];
    const optionStatus = [
        { value: 3, name: 'Tất cả' },
        { value: 0, name: 'Chưa bán' },
        { value: 1, name: 'Đang bán' },
        { value: 2, name: 'Ngừng bán' },
    ];

    const options = [
        { value: '1', label: 'Mặc định' },
        { value: '2', label: 'Combo' },
    ];

    const optionsStatus = [
        { value: 0, name: 'Chưa bán' },
        { value: 1, name: 'Đang bán' },
        { value: 2, name: 'Ngừng bán' },
    ];
    const changStatus = (value) => {
        if (value === 2) {
            return 'Ngừng bán';
        } else if (value === 1) {
            return 'Đang bán';
        } else {
            return 'Chưa bán';
        }
    };
    const handleStatusChang = (value) => {
        const selectedItem = optionsStatus.find((item) => item.name === value);
        if (selectedItem) {
            setStatusFood(value);
            setStatusFoodCode(selectedItem.value);
        } else {
            setStatusFood('');
            setStatusFoodCode('');
        }
    };

    const [selectedSort, setSelectedSort] = useState(optionsSort[0]);
    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const height = HeightComponent();
    const fetchProductNotSeat = async () => {
        try {
            const response = await axios.get('api/products/getAllNotSeat');
            const data = response;
            const arrayName = data.map((item) => ({
                code: item.code,
                name: item.name,
            }));

            return { product: data, optionFood: arrayName };
        } catch (error) {
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                throw new Error('Error: No response received from server');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    };
    const {
        data: { product = [], optionFood = [] } = {},
        error,
        isLoading,
        isFetched,
        // isFetching,
        refetch,
    } = useQuery('productNotSeat', fetchProductNotSeat, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        onSuccess: (data) => {
            setFoodFilter(data.product);
        },
    });

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
        setSelectedFood(null);
        setName('');
        setDescription('');
        setStatusFood('');
        setStatusFoodCode('');
        setType('Mặc định');
        setInputSets([
            { code: '', name: '', quantity: 0 },
            { code: '', name: '', quantity: 0 },
        ]);
    };

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setFoodFilter(product);
            return;
        }
        const search = product.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        setFoodFilter(search);
        setSelectedSort(optionsSort[0]);
        setSelectedStatus(optionStatus[0]);
    };

    const sortFood = (option) => {
        if (!option) {
            setFoodFilter(product);
            return;
        }
        setSelectedSort(option);

        let sortedFood = [];
        if (option.value === 1) {
            sortedFood = product.filter((item) => item.type === 1);
            setFoodFilter(sortedFood);
        } else if (option.value === 2) {
            sortedFood = product.filter((item) => item.type === 2);
            setFoodFilter(sortedFood);
        } else if (option.value === 3) {
            sortedFood = product;
        }
        if (sortedFood.length === 0) {
            toast.info('Không có sản phẩm nào!');
        }

        setFoodFilter(sortedFood);
        setInputSearch('');
        setSelectedStatus(optionStatus[0]);
    };
    const onChange1 = (date, dateString) => {
        setSelectDate(dateString);
        if (dateString === '') {
            setFoodFilter(product);
            return;
        } else {
            const filterDate = product.filter((item) => getFormatteNgay(item.createdAt) === dateString);
            if (filterDate.length === 0) {
                toast.info('Không có sản phẩm nào!');
                return;
            }
            setSelectedSort(optionsSort[0]);
            setSelectedStatus(optionStatus[0]);
            setInputSearch('');
            setFoodFilter(filterDate);
        }
    };

    const sortedStatus = (option) => {
        if (!option) {
            setFoodFilter(product);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 0) {
            sortedStatus = product.filter((item) => item.status === 0);
            setFoodFilter(sortedStatus);
        } else if (option.value === 1) {
            sortedStatus = product.filter((item) => item.status === 1);
            setFoodFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = product.filter((item) => item.status === 2);
            setFoodFilter(sortedStatus);
        } else if (option.value === 3) {
            sortedStatus = product;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có sản phẩm nào!');
        }
        setFoodFilter(sortedStatus);
        setInputSearch('');
        setSelectedSort(optionsSort[0]);
    };

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedFood(null);
    };

    const updateInputSet = (index, field, value) => {
        const newInputSets = [...inputSets];
        newInputSets[index][field] = value;
        setInputSets(newInputSets);
    };

    const removeInputSet = (index) => {
        const updatedInputSets = inputSets.filter((_, i) => i !== index);
        setInputSets(updatedInputSets);
    };

    const handleCodeChange = (index, newValue) => {
        const selectedProduct = product.find((item) => item.name === newValue);
        const code = selectedProduct ? selectedProduct.code : '';

        updateInputSet(index, 'code', code);
        updateInputSet(index, 'name', newValue);
    };
    const handleComboSelect = (combo) => {
        if (combo && combo.comboItems) {
            const updatedInputSets = combo.comboItemNames.map((item) => ({
                code: item?.code,
                name: item?.name,
                quantity: item?.quantity,
            }));
            setInputSets(updatedInputSets);
        }
    };

    const addInputSet = () => {
        setInputSets([...inputSets, { code: '', name: '', quantity: 0 }]);
    };

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
        form.append('status', statusFoodCode);
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
            toast.error(error.response.data.message);
        }
    };

    const handleUpdateFood = async () => {
        const typeSelected = selectedFood?.type === 1 ? 'Mặc định' : 'Combo';
        if (name !== '' || description !== '' || image !== null || type !== typeSelected || statusFoodCode !== '') {
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
                setStatusFood('');
                setStatusFoodCode('');
                handleClose();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.warn('Vui lòng nhập thông tin cần chỉnh sửa!');
            return;
        }
    };

    const mutation = useMutation(handleUpdateFood, {
        onSuccess: () => {
            queryClient.refetchQueries('productNotSeat1');
            queryClient.refetchQueries('fetchProducts');
        },
    });

    const handleUpdateCombo = async () => {
        const isQuantityMismatch = inputSets.some((inputItem, index) => {
            const comboItem = selectedFood?.comboItemNames[index];

            if (comboItem) {
                return comboItem.quantity !== Number(inputItem.quantity);
            }
            return true;
        });

        const comBo = inputSets.map(({ code, quantity }) => ({
            code,
            quantity: Number(quantity),
        }));
        const comBoCodes = comBo.map((item) => item.code);

        const uniqueCodes = new Set(comBoCodes);
        const hasDuplicates = uniqueCodes.size !== comBoCodes.length;

        if (hasDuplicates) {
            toast.warn('Sản phẩm đã được chọn!');
            return;
        }
        const isNameMismatch = inputSets.some((inputItem, index) => {
            const comboItem = selectedFood?.comboItemNames[index];

            if (comboItem) {
                return comboItem.name !== inputItem.name;
            }
            return true;
        });

        const typeSelected = selectedFood?.type === 1 ? 'Mặc định' : 'Combo';
        if (
            name !== '' ||
            description !== '' ||
            image !== null ||
            type !== typeSelected ||
            isQuantityMismatch ||
            isNameMismatch ||
            inputSets.length !== selectedFood?.comboItems.length ||
            statusFoodCode !== ''
        ) {
            const comBo = inputSets.map(({ code, quantity }) => ({
                code,
                quantity: Number(quantity),
            }));

            const hasInvalidQuantity = comBo.some((item) => isNaN(item.quantity) || item.quantity < 1);
            if (hasInvalidQuantity) {
                toast.warn('Số lượng không hợp lệ!');
                return;
            }
            const form = new FormData();
            form.append('name', name);
            form.append('description', description);
            form.append('type', 2);
            form.append('image', image);
            form.append('comboItems', JSON.stringify(comBo));
            form.append('status', statusFoodCode);
            try {
                await axios.post(`api/products/updateCombo/${selectedFood?.code}`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success('Cập nhật Combo thành công!');
                refetch();
                setName('');
                setDescription('');
                handleClose();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.warn('Vui lòng nhập thông tin cần chỉnh sửa!');
            return;
        }
    };

    const mutation1 = useMutation(handleUpdateCombo, {
        onSuccess: () => {
            queryClient.refetchQueries('productNotSeat1');
            queryClient.refetchQueries('fetchProducts');
        },
    });
    const handleAddCombo = async () => {
        if (name && description && image && type === 'Combo') {
            const comBo = inputSets.map(({ code, quantity }) => ({
                code,
                quantity: Number(quantity),
            }));

            const hasInvalidQuantity = comBo.some((item) => isNaN(item.quantity) || item.quantity < 1);
            if (hasInvalidQuantity) {
                toast.warn('Số lượng không hợp lệ!');
                return;
            }
            const comBoCodes = comBo.map((item) => item.code);

            const uniqueCodes = new Set(comBoCodes);
            const hasDuplicates = uniqueCodes.size !== comBoCodes.length;

            if (hasDuplicates) {
                toast.warn('Sản phẩm đã được chọn!');
                return;
            }

            const form = new FormData();
            form.append('name', name);
            form.append('description', description);
            form.append('type', 2);
            form.append('image', image);
            form.append('comboItems', JSON.stringify(comBo));
            try {
                await axios.post('api/products/addCombo', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success('Thêm Combo thành công!');
                refetch();
                setName('');
                setDescription('');
                handleClose();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.warn('Vui lòng nhập thông tin!');
            return;
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`api/products/${productId}`);
            toast.success('Xóa thành công!');
            refetch();
            handleCloseDelete();
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
    };

    if (isLoading) return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data].reverse();
        const item = reversedData[index];

        return (
            <div
                className="border-b py-3 justify-center text-[15px] font-normal text-slate-500 grid grid-cols-8 items-center gap-6 "
                key={item.code}
                style={style}
            >
                <div className="grid col-span-2 gap-2 grid-cols-9  justify-center items-center">
                    <h1 className="grid pl-3 col-span-2">{index + 1}</h1>
                    <h1 className="grid col-span-2">{item.code}</h1>
                    <h1 className="grid pl-3 col-span-5">{item.name}</h1>
                </div>
                <div className="justify-center items-center grid">
                    <LazyLoadImage
                        src={item.image}
                        alt={item.name}
                        width={65}
                        onClick={() => {
                            setCurrentImage(item.image);
                            setIsOpenImage(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <h1 className="grid">{item.description}</h1>
                <h1 className="grid break-all">{FormatSchedule(item.createdAt)}</h1>
                <h1 className="grid break-all">{FormatSchedule(item.updatedAt)}</h1>
                <div className="grid justify-center">
                    <button
                        className={`border px-2 w-[auto] uppercase text-white text-[13px] py-1 flex rounded-[40px] ${
                            item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        {item.status === 1 ? 'Đang bán' : item.status === 2 ? 'Ngừng bán' : 'Chưa bán'}
                    </button>
                </div>
                <div className="justify-center col-span-1 items-center grid">
                    <div className="grid grid-cols-3">
                        <button
                            className="col-span-2"
                            onClick={() => {
                                handleOpen(true, false);
                                setSelectedFood(item);
                                setType(item?.type === 1 ? 'Mặc định' : 'Combo');
                                handleComboSelect(item);
                            }}
                            disabled={item.status === 0 ? false : true}
                        >
                            <FaRegEdit color={` ${item.status !== 0 ? 'bg-gray-100' : 'black'}  `} size={20} />
                        </button>
                        <button
                            onClick={() => {
                                handleOpenDelete();
                                setSelectedFood(item);
                            }}
                            disabled={item.status === 0 ? false : true}
                        >
                            <MdOutlineDeleteOutline color={`${item.status === 0 ? 'black' : 'gray'}`} fontSize={20} />
                        </button>
                    </div>
                </div>

                <Modal
                    title="Hình ảnh"
                    className="custom-modal"
                    open={isOpenImage}
                    onCancel={() => setIsOpenImage(false)}
                    footer={[]}
                    width={600}
                    mask={false}
                >
                    <div className="modal-image-container">
                        <img src={currentImage} alt="Large" className="w-[55%]  object-contain" />
                    </div>
                </Modal>
            </div>
        );
    };

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto  xl:overflow-hidden overflow-y-hidden shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Đồ ăn & nước</h1>

                <div className="grid grid-cols-4 gap-8 items-center w-full h-16 px-3 min-w-[900px] ">
                    <AutoInputComponent
                        options={optionFood.map((item) => item.name)}
                        value={inputSearch}
                        onChange={(newValue) => handleSearch(newValue)}
                        title="Tên"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập"
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <div className="relative w-full ">
                        <AutoInputComponent
                            value={selectedStatus.name}
                            onChange={(newValue) => sortedStatus(newValue)}
                            options={optionStatus}
                            title="Trạng thái"
                            freeSolo={true}
                            disableClearable={true}
                            heightSelect={200}
                            borderRadius="10px"
                            onBlur={(event) => {
                                event.preventDefault();
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-[16px] truncate mb-1">Ngày tạo</h1>
                        <DatePicker
                            onChange={onChange1}
                            value={selectDate ? dayjs(selectDate, 'DD/MM/YYYY') : null}
                            placement="bottomRight"
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                        />
                    </div>
                    <div className="relative w-full ">
                        <AutoInputComponent
                            value={selectedSort.name}
                            onChange={(newValue) => sortFood(newValue)}
                            options={optionsSort}
                            title="Loại sản phẩm"
                            freeSolo={true}
                            disableClearable={true}
                            heightSelect={200}
                            borderRadius="10px"
                            onBlur={(event) => {
                                event.preventDefault();
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border py-4 h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="bg-white border-b py-1 justify-center items-center uppercase text-[13px] font-bold  text-slate-500 grid grid-cols-8 gap-6 min-w-[1200px] pr-4">
                        <div className="grid col-span-2 grid-cols-9 gap-2 justify-center items-center">
                            <h1 className="grid justify-center col-span-2 items-center ">STT </h1>
                            <h1 className="grid justify-center col-span-2 items-center ">Mã SP </h1>
                            <h1 className="grid justify-center items-center col-span-5">Tên </h1>
                        </div>

                        <h1 className="grid  justify-center">Hình ảnh</h1>
                        <h1 className="grid justify-center">Mô tả</h1>
                        <h1 className="grid  justify-center">Ngày tạo</h1>
                        <h1 className="grid justify-center ">Ngày sửa</h1>
                        <h1 className="grid justify-center">Trạng thái</h1>
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-[3px] rounded-[40px] gradient-button"
                                onClick={() => handleOpen(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="py-1 ">
                        <List
                            itemCount={foodFilter.length === 0 ? product.length : foodFilter.length}
                            itemSize={130}
                            height={height}
                            width={1200}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, foodFilter.length === 0 ? product : foodFilter)
                            }
                        </List>
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="35%"
                height={(selectedFood?.type === 2) | (type === 'Combo') ? '79%' : '55%'}
                smallScreenWidth="59%"
                smallScreenHeight={(selectedFood?.type === 2) | (type === 'Combo') ? '58%' : '40%'}
                mediumScreenWidth="55%"
                mediumScreenHeight={(selectedFood?.type === 2) | (type === 'Combo') ? '50%' : '35%'}
                largeScreenHeight={(selectedFood?.type === 2) | (type === 'Combo') ? '44%' : '32%'}
                largeScreenWidth="48%"
                maxHeightScreenHeight={(selectedFood?.type === 2) | (type === 'Combo') ? '95%' : '68%'}
                maxHeightScreenWidth="50%"
                heightScreen={(selectedFood?.type === 2) | (type === 'Combo') ? '75%' : '52%'}
                title={isUpdate ? 'Chỉnh thức ăn và đồ uống' : 'Thêm thức ăn và nước'}
            >
                <div
                    className={`h-90p  grid ${
                        selectedFood?.type === 2 || type === 'Combo' ? 'grid-rows-8' : 'grid-rows-5'
                    }`}
                >
                    <div className="grid  grid-cols-3 gap-x-6 px-3 py-1">
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
                                isUpdate
                                    ? selectedFood?.type === 1
                                        ? 'Mặc định'
                                        : selectedFood?.type === 2
                                        ? 'Combo'
                                        : options[0].label
                                    : selectedFood?.type === 1
                                    ? 'Mặc định'
                                    : selectedFood?.type === 2
                                    ? 'Combo'
                                    : options[0].label
                            }
                            onChange={setType}
                            options={options.map((option) => option.label)}
                            title="Loại"
                            freeSolo={true}
                            disableClearable={true}
                            defaultValue={options[0].label}
                            heightSelect={200}
                        />
                    </div>

                    <div className="grid gap-x-6 grid-cols-3 px-3 py-1">
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
                        <AutoInputComponent
                            value={isUpdate ? changStatus(selectedFood?.status) : changStatus(statusFood)}
                            onChange={handleStatusChang}
                            options={
                                selectedFood?.status === 0
                                    ? optionsStatus.filter((item) => item.value !== 2).map((item) => item.name)
                                    : optionsStatus.filter((item) => item.value !== 0).map((item) => item.name)
                            }
                            freeSolo={false}
                            disableClearable={true}
                            title="Trạng thái"
                            placeholder="Chưa bán"
                            heightSelect={150}
                            disabled={!isUpdate || selectedFood?.status === 1 ? true : false}
                        />
                    </div>
                    <div className="grid items-center justify-center grid-cols-7 px-3 gap-3 py-1 row-span-2">
                        <div className="grid  col-span-5 h-full">
                            <InputComponent
                                title="Hình "
                                className="rounded-[5px] "
                                type="file"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="justify-end col-span-2 h-full flex">
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="phim1"
                                    className={`w-36 ${
                                        selectedFood?.type === 2 || type === 'Combo' ? 'h-[122px]' : 'h-[145px]'
                                    } object-cover`}
                                />
                            ) : (
                                isUpdate && (
                                    <img
                                        src={selectedFood?.image}
                                        alt="phim1"
                                        className={`w-36 ${
                                            selectedFood?.type === 2 || type === 'Combo' ? 'h-[122px]' : 'h-[145px]'
                                        } object-cover`}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    {(type === 'Combo' || selectedFood?.type === 2) && (
                        <div className="row-span-3">
                            <div className="grid grid-cols-12 px-3 mb-1 ">
                                <h1 className="col-span-8 text-[14px] uppercase">Sản phẩm trong combo</h1>
                                <div className="col-span-4 grid justify-end ">
                                    <button
                                        onClick={addInputSet}
                                        className="  px-3 py-[1px]  gradient-button rounded-[10px]"
                                    >
                                        <IoIosAddCircleOutline color="white" size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className=" h-[85%] overflow-auto border-[red] border mx-3 rounded-[10px]">
                                <div className="px-3 py-2   ">
                                    {inputSets.map((inputSet, index) => (
                                        <div className="grid grid-cols-12 gap-4 mb-2 " key={index}>
                                            <div className="col-span-7">
                                                <AutoInputComponent
                                                    value={inputSet.name} // Hiển thị tên
                                                    onChange={(newValue) => handleCodeChange(index, newValue)} // Xử lý chọn sản phẩm
                                                    options={product
                                                        .filter((item) => item.type === 1)
                                                        .map((item) => item.name)} // Chọn tên làm tùy chọn
                                                    title="Tên"
                                                    freeSolo={false}
                                                    disableClearable={true}
                                                    placeholder="Nhập ..."
                                                    heightSelect={130}
                                                />
                                            </div>

                                            <div className="col-span-4">
                                                <AutoInputComponent
                                                    value={String(inputSet?.quantity)}
                                                    onChange={(newValue) => updateInputSet(index, 'quantity', newValue)}
                                                    title="Số lượng"
                                                    freeSolo={true}
                                                    disableClearable={false}
                                                    placeholder="Nhập ..."
                                                    heightSelect={130}
                                                />
                                            </div>

                                            <div className="col-span-1 flex justify-center items-center mt-6">
                                                <button onClick={() => removeInputSet(index)} className="p-2 rounded">
                                                    <MdOutlineDeleteOutline size={25} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className="bg-blue-500"
                                onClick={
                                    isUpdate && selectedFood?.type === 1
                                        ? mutation.mutate
                                        : !isUpdate && type === 'Mặc định'
                                        ? handleAddFood
                                        : isUpdate && selectedFood?.type === 2
                                        ? mutation1.mutate
                                        : handleAddCombo
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
                title="Xóa thức ăn và nước"
            >
                <div className="h-[80%] grid grid-rows-3 ">
                    <h1 className="grid row-span-2 p-3">
                        Bạn đang thực hiện xóa đồ ăn này. Bạn có chắc chắn xóa không?
                    </h1>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text="Xóa"
                                className="bg-blue-500"
                                onClick={() => handleDeleteProduct(selectedFood?.code)}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Food;
