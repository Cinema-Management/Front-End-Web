import React, { useEffect, useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightComponent from '~/components/HeightComponent/HeightComponent';
import { FormatSchedule, getFormatteNgay } from '~/utils/dateUtils';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import dayjs from 'dayjs';
import { FaRegEdit } from 'react-icons/fa';
import ky from 'ky';
import { DatePicker } from 'antd';
const optionStatusForm = [
    { value: 0, name: 'Chưa hoạt động' },
    { value: 1, name: 'Hoạt động' },
    { value: 2, name: 'Ngừng hoạt động' },
];
const optionGender = [
    { value: 0, name: 'Nam' },
    { value: 1, name: 'Nữ' },
];
const optionStatus = [
    { value: 2, name: 'Tất cả' },
    { value: 0, name: 'Hoạt động' },
    { value: 1, name: 'Ngừng hoạt động' },
];
const optionCustomerType = [
    { value: 3, name: 'Tất cả' },
    { value: 0, name: 'Bạc' },
    { value: 1, name: 'Vàng' },
    { value: 2, name: 'Kim cương' },
];
const Customer = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerFilter, setCustomerFilter] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [inputSearch, setInputSearch] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [wardData, setWardData] = useState([]);
    const [addressDetail, setAddressDetail] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedFilterCustomerType, setSelectedFilterCustomerType] = useState(optionCustomerType[0]);

    const disabledDate = (current) => {
        // Tính toán ngày 14 năm trước từ hôm nay
        const fourteenYearsAgo = dayjs().subtract(13, 'year');
        return current && current > fourteenYearsAgo; // Disable tất cả các ngày sau ngày 14 năm trước
    };

    const height = HeightComponent();

    const clearText = () => {
        setName('');
        setEmail('');
        setPhone('');
        setBirthDate(null);
        setGender('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setAddressDetail('');
        setStatus('');
    };
    const handleOpenDetail = () => {
        setOpenDetail(true);
    };
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedCustomer(null);
        clearText();
    };
    const handleOpen = (value) => {
        setOpen(true);
        setIsUpdate(value);
    };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedCustomer(null);
        setIsUpdate(value);

        clearText();
    };
    const handleOpenDelete = (value) => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedCustomer(null);
    };

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const fetchCustomer = async () => {
        const customerResponse = await axios.get('api/users');

        const arrayCustomer = customerResponse.data.map((item) => ({
            code: item.code,
            name: item.name,
        }));
        return { customers: customerResponse.data, optionCustomer: arrayCustomer };
    };
    const getAddress = async (code) => {
        try {
            const response = await axios.get(`api/hierarchy-values/${code}`);
            if (response.data) {
                setSelectedProvince(response.data.province);
                setSelectedDistrict(response.data.district);
                setSelectedWard(response.data.ward);
                setAddressDetail(response.data.addressDetail);
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const districtCode = getDistrictsCodeByName(selectedDistrict); // Đảm bảo hàm này tồn tại
                    const response = await ky.get(`api/locations/wards/${districtCode}`).json();
                    setWardData(response);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            }
        };

        fetchWards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDistrict]);

    const removeVietnameseTones = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };
    const normalizeString = (str) => {
        if (!str) return '';
        return removeVietnameseTones(str).toLowerCase().trim();
    };
    const getProvinceCodeByName = (name) => {
        const normalizedInput = normalizeString(name);
        const province = provinces.find((province) => normalizeString(province.province_name) === normalizedInput);
        return province ? province._id : null;
    };

    const getDistrictsCodeByName = (name) => {
        const normalizedInput = normalizeString(name);
        const district = districts.find((districts) => normalizeString(districts.district_name) === normalizedInput);
        return district ? district._id : null;
    };

    const fetchProvinces = async () => {
        const response = await ky.get('api/locations/provinces');
        return response.json();
    };

    // Hàm fetch districts theo province code
    const fetchDistricts = async (provinceCode) => {
        const response = await ky.get(`api/locations/districts/${provinceCode}`);
        return response.json();
    };

    const {
        data: provinces = [],
        isLoading: isLoadingProvinces,
        error: provincesError,
    } = useQuery('provinces', fetchProvinces, {
        staleTime: 1000 * 60 * 10,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 10,
    });

    const {
        data: districts = [],
        isLoading: isLoadingDistricts,
        error: districtsError,
    } = useQuery(
        ['districts', selectedProvince],
        () => fetchDistricts(getProvinceCodeByName(selectedProvince)), // Sử dụng hàm fetchDistricts
        {
            enabled: !!selectedProvince,
            staleTime: 1000 * 60 * 10,
            cacheTime: 1000 * 60 * 10,
            refetchInterval: 1000 * 60 * 10,
        },
    );

    const {
        data: { customers = [], optionCustomer = [] } = {},
        isLoading,
        isFetched,
        isRefetching,
        isError,
        refetch,
    } = useQuery('fetchCustomer', fetchCustomer, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        // onSuccess: (data) => {
        //     setFoodFilter(data.product);
        // },
    });

    if (isLoading || isLoadingProvinces || isLoadingDistricts || isRefetching) return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (isError || provincesError || districtsError)
        return <div>Error loading data: {isError.message || provincesError.message || districtsError.message}</div>;

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);

        if (value !== selectedProvince) {
            setSelectedDistrict('');
            setSelectedWard('');
            setAddressDetail('');
        }
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);

        if (value !== selectedDistrict) {
            setSelectedWard('');
            setAddressDetail('');
        }
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);

        if (value !== addressDetail) {
            setAddressDetail('');
        }
    };

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setCustomerFilter(customers);

            return;
        }
        const search = customers.filter((item) => item.name.includes(value));

        if (search.length === 0) {
            toast.info('Không tìm thấy khách hàng nào!');
            setCustomerFilter(customers);
        } else {
            setCustomerFilter(search);
            setSelectedStatus(optionStatus[0]);
            setSearchSDT('');
        }
    };

    const handleEnterPress = (newValue) => {
        handleSearchSDT(newValue);
    };
    const handleSearchSDT = (value) => {
        setSearchSDT(value);
        if (value === '' || value === null) {
            setCustomerFilter(customers);
            return;
        }
        const search = customers.filter((item) => item.phone === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy khách hàng nào!');
            setCustomerFilter(customers);
        } else {
            setCustomerFilter(search);
            setInputSearch('');
            setSelectedStatus(optionStatus[0]);
        }
    };

    const sortedStatus = (option) => {
        if (!option) {
            setCustomerFilter(customers);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 0) {
            sortedStatus = customers.filter((item) => item.status === 1);
            setCustomerFilter(sortedStatus);
        } else if (option.value === 1) {
            sortedStatus = customers.filter((item) => item.status === 0);
            setCustomerFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = customers;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có khách hàng nào!');
        }
        setCustomerFilter(sortedStatus);
        setInputSearch('');
        setSearchSDT('');
    };

    const sortCustomerTye = (option) => {
        if (!option) {
            setCustomerFilter(customers);
            return;
        }

        setCustomerFilter(customers);
        setInputSearch('');
        setSearchSDT('');
        setSelectedFilterCustomerType(optionCustomerType[0]);
    };

    // action

    const validate = () => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        const checkPhone = customers.find((user) => user.phone.trim() === phone.trim());

        const checkEmail = customers.find((user) => user.email.trim() === email.trim());

        if (!name) {
            toast.warning('Vui lòng nhập họ tên!');
            return false;
        }

        if (!email) {
            toast.warning('Vui lòng nhập email!');
            return false;
        }

        if (!emailRegex.test(email)) {
            toast.warning('Email không hợp lệ!');
            return false;
        }
        if ((checkEmail && !isUpdate) || (isUpdate && checkEmail?.email !== selectedCustomer?.email && checkEmail)) {
            toast.warning('Email đã tồn tại!');
            return false;
        }

        if (!phone) {
            toast.warning('Vui lòng nhập số điện thoại!');
            return false;
        }

        if (!phoneRegex.test(phone)) {
            toast.warning('Số điện thoại không hợp lệ!');
            return false;
        }
        if ((checkPhone && !isUpdate) || (isUpdate && checkPhone?.phone !== selectedCustomer?.phone && checkPhone)) {
            toast.warning('SĐT đã tồn tại!');
            return false;
        }

        if (selectedDistrict === '' && selectedProvince) {
            toast.warning('Vui lòng chọn quận/huyện!');
            return false;
        }

        if (selectedWard === '' && selectedDistrict) {
            toast.warning('Vui lòng chọn phường/xã!');
            return false;
        }

        if (addressDetail === '' && selectedWard) {
            toast.warning('Vui lòng nhập địa chỉ chi tiết!');
            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        try {
            let loadingId;

            if (!validate()) return;
            loadingId = toast.loading('Đang thêm khách hàng!');
            let parentCode = '';
            if (addressDetail) {
                const hierarchyValues = [
                    { name: selectedProvince, level: 0 },
                    { name: selectedDistrict, parentCode: '', level: 1 },
                    { name: selectedWard, parentCode: '', level: 2 },
                    { name: addressDetail, parentCode: '', level: 3 },
                ];

                for (let i = 0; i < hierarchyValues.length; i++) {
                    const { name, level } = hierarchyValues[i];
                    const hierarchyValue = {
                        name,
                        parentCode: i > 0 ? parentCode : undefined,
                        level,
                        hierarchyStructureCode: 'PHANCAP01',
                    };

                    const response = await axios.post('api/hierarchy-values', hierarchyValue);

                    if (response.data) {
                        parentCode = response.data.code;
                    } else {
                        throw new Error('Không thể thêm giá trị cấp bậc.');
                    }
                }
            }
            const customer = {
                name: name,
                birthDate: birthDate,
                gender: gender,
                phone: phone,
                email: email,
                address: parentCode,
            };

            const responseCinema = await axios.post('api/users/addCustomer', customer);
            if (responseCinema.data) {
                toast.dismiss(loadingId);

                toast.success('Thêm  thành công!');
                refetch();
                handleClose();
            } else {
                toast.dismiss(loadingId);

                toast.warning('Thêm thất bại!');
                handleClose();
            }
        } catch (error) {
            toast.error('Lỗi:' + error.message);
        }
    };

    const handleUpdate = async () => {
        try {
            let loadingId;

            if (!validate()) return;
            loadingId = toast.loading('Đang cập nhật !');
            let parentCode = '';
            const fullAddress = `${addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
            if (fullAddress !== selectedCustomer?.fullAddress) {
                const hierarchyValues = [
                    { name: selectedProvince, level: 0 },
                    { name: selectedDistrict, parentCode: '', level: 1 },
                    { name: selectedWard, parentCode: '', level: 2 },
                    { name: addressDetail, parentCode: '', level: 3 },
                ];

                for (let i = 0; i < hierarchyValues.length; i++) {
                    const { name, level } = hierarchyValues[i];
                    const hierarchyValue = {
                        name,
                        parentCode: i > 0 ? parentCode : undefined,
                        level,
                        hierarchyStructureCode: 'PHANCAP01',
                    };

                    const response = await axios.post('api/hierarchy-values', hierarchyValue);

                    if (response.data) {
                        parentCode = response.data.code;
                    } else {
                        throw new Error('Không thể thêm giá trị cấp bậc.');
                    }
                }
            }
            const customer = {
                name: name,
                birthDate: birthDate,
                gender: gender,
                phone: phone,
                email: email,
                address: parentCode,
                status: optionStatusForm.find((item) => item.name === status)?.value,
                type: 0,
            };

            const responseCinema = await axios.put('api/users/' + selectedCustomer?.code, customer);
            if (responseCinema.data) {
                toast.dismiss(loadingId);

                toast.success('Cập nhật  thành công!');
                refetch();
                handleClose();
            } else {
                toast.dismiss(loadingId);

                toast.warning('Cập nhật thất bại!');
                handleClose();
            }
        } catch (error) {
            toast.error('Lỗi:' + error.message);
        }
    };
    const handleDelete = async (code) => {
        try {
            if (!code) {
                return;
            }
            handleCloseDelete();
            await axios.patch(`api/users/${code}`);
            toast.success('Xóa thành công!');

            refetch();
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
    };

    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data].reverse();
        const item = reversedData[index];

        return (
            <div
                className="border-b py-3 text-[15px] font-normal text-slate-500 grid grid-cols-8 items-center gap-2 "
                key={item.code}
                style={style}
            >
                <div className="grid  grid-cols-3">
                    <h1 className="grid pl-2 items-center">{index + 1}</h1>
                    <h1 className="grid pl-2 col-span-2 items-center">{item.code}</h1>
                </div>
                <h1 className="grid items-center pl-3 ">{item.name}</h1>
                <h1 className="grid justify-center items-center break-all ">{item.phone}</h1>
                <h1 className="grid col-span-2 items-center ">{item.fullAddress || 'Chưa cập nhật'}</h1>
                <h1 className="grid justify-center items-center">Bạc</h1>
                <div className="  justify-center items-center grid  ">
                    <button
                        className={`border px-[6px] uppercase break-all text-white text-[13px] py-[3px] flex  rounded-[40px] ${
                            item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        {item.status === 0 ? 'Chưa hoạt động' : item.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </button>
                </div>
                <div className="  items-center grid ">
                    <div className="grid grid-cols-3 max-mh850:grid-cols-3 ml-3 ">
                        <button
                            className=" max-mh850:col-span-1 max-mh850:mr-2 "
                            onClick={() => {
                                setSelectedCustomer(item);
                                handleOpen(true);
                                setName(item?.name);
                                setPhone(item?.phone);
                                setEmail(item?.email);
                                setGender(item?.gender);
                                setBirthDate(item?.birthDate ? dayjs(item?.birthDate).format('YYYY-MM-DD') : null);

                                setStatus(optionStatusForm.find((option) => option.value === item.status)?.name);

                                getAddress(item?.address);
                            }}
                        >
                            <FaRegEdit color="black" size={20} />
                        </button>
                        <button
                            onClick={() => {
                                handleOpenDetail();
                                setSelectedCustomer(item);
                            }}
                        >
                            <FaRegEye color="black" fontSize={20} />
                        </button>

                        <button
                            className={`grid  ${item.status !== 0 ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={() => {
                                handleOpenDelete();
                                setSelectedCustomer(item);
                            }}
                        >
                            <MdOutlineDeleteOutline color="black" fontSize={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white overflow-x-auto overflow-y-hidden  xl:overflow-hidden border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Khách hàng</h1>

                <div className="grid grid-cols-4 3 gap-12 items-center w-full h-16 px-3 min-w-[900px] ">
                    <AutoInputComponent
                        options={optionCustomer.map((item) => item.name)}
                        value={inputSearch}
                        onChange={(newValue) => handleSearch(newValue)}
                        title="Họ và tên"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập"
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <AutoInputComponent
                        value={searchSDT}
                        onChange={(newValue) => handleSearchSDT(newValue)}
                        title="Số điện thoại"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEnterPress(e.target.value);
                            }
                        }}
                    />
                    <AutoInputComponent
                        value={selectedFilterCustomerType?.name}
                        onChange={(newValue) => sortCustomerTye(newValue)}
                        options={optionCustomerType.map((item) => item.name)}
                        title="Loại khách hàng"
                        freeSolo={true}
                        disableClearable={true}
                        heightSelect={200}
                        borderRadius="10px"
                        onBlur={(event) => {
                            event.preventDefault();
                        }}
                    />
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
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border py-4 h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b py-1 text-sm uppercase font-bold text-slate-500 grid grid-cols-8 items-center gap-2 min-w-[1200px]">
                        <div className="grid grid-cols-3">
                            <h1 className="grid justify-center items-center">STT</h1>
                            <h1 className="grid justify-center col-span-2 items-center">Mã KH</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Họ tên</h1>
                        <h1 className="grid justify-center items-center">Số điện thoại</h1>
                        <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                        <h1 className="grid justify-center items-center">Loại khách hàng</h1>
                        <h1 className="grid justify-center items-center">Trạng thái</h1>
                        <div className=" grid justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] gradient-button "
                                onClick={() => {
                                    handleOpen(false);

                                    setStatus('Chưa hoạt động');
                                }}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="py-1 min-w-[1200px]">
                        <List
                            itemCount={customerFilter.length === 0 ? customers?.length : customerFilter.length}
                            itemSize={60}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, customerFilter.length === 0 ? customers : customerFilter)
                            }
                        </List>
                    </div>
                </div>
            </div>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="60%"
                height="58%"
                smallScreenWidth="80%"
                smallScreenHeight="60%"
                mediumScreenWidth="80%"
                mediumScreenHeight="50%"
                largeScreenHeight="45%"
                largeScreenWidth="70%"
                maxHeightScreenHeight="92%"
                maxHeightScreenWidth="70%"
                heightScreen="75%"
                title="Chi tiết khách hàng"
            >
                <div className="h-90p grid grid-rows-6 gap-2 ">
                    <div className="grid row-span-5">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2 grid-cols-2 gap-2">
                                    <h1 className=" font-bold">Mã khách hàng:</h1>
                                    <h1 className=" font-normal">{selectedCustomer?.code}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Họ và tên:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedCustomer?.name}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Giới tính:</h1>
                                    <h1 className="grid  font-normal">{selectedCustomer?.gender || 'Chưa cập nhật'}</h1>
                                </div>

                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Địa chỉ:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedCustomer?.fullAddress}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày sinh:</h1>
                                    <h1 className="font-normal">
                                        {getFormatteNgay(selectedCustomer?.birthDate) || 'Chưa cập nhật'}
                                    </h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Số điện thoại:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedCustomer?.phone}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Trạng thái:</h1>
                                    <h1 className="grid  font-normal">
                                        {selectedCustomer?.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Email:</h1>
                                    <h1 className="font-normal col-span-2">{selectedCustomer?.email}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Loại khách hàng:</h1>
                                    <h1 className="font-normal">Bạc</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Điểm tích lũy:</h1>
                                    <h1 className="grid col-span-2 font-normal text-red-500">
                                        {selectedCustomer?.points} điểm
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày tạo:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedCustomer?.createdAt)}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày cập nhật:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedCustomer?.updatedAt)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="justify-end flex space-x-3 mt-1  border-t pr-4">
                        <div className="space-x-3 mt-[6px]">
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleCloseDetail} />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="40%"
                height="68%"
                smallScreenWidth="65%"
                smallScreenHeight="50%"
                mediumScreenWidth="60%"
                mediumScreenHeight="43%"
                largeScreenHeight="37%"
                largeScreenWidth="60%"
                maxHeightScreenHeight="80%"
                maxHeightScreenWidth="60%"
                heightScreen="62%"
                title={isUpdate ? 'Cập nhật khách hàng' : 'Thêm  khách hàng'}
            >
                <div className={`h-90p grid grid-rows-6 gap-2 `}>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                value={name}
                                onChange={setName}
                                title="Họ tên"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                disabled={selectedCustomer?.status === 2}
                            />
                            <AutoInputComponent
                                value={email}
                                onChange={setEmail}
                                title="Email"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                disabled={selectedCustomer?.status === 2}
                            />
                        </div>
                    </div>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                value={phone}
                                onChange={setPhone}
                                title="Số điện thoại"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                disabled={selectedCustomer?.status === 2}
                            />

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <h1 className="text-[16px] truncate mb-1">Ngày sinh</h1>
                                    <DatePicker
                                        onChange={setBirthDate}
                                        value={birthDate ? dayjs(birthDate) : null}
                                        allowClear={false} // Không cho phép xóa
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Chọn ngày"
                                        format="DD/MM/YYYY"
                                        disabled={selectedCustomer?.status === 2}
                                        disabledDate={disabledDate}
                                        className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none  hover:border-[black] "
                                    />
                                </div>

                                <AutoInputComponent
                                    options={optionGender.map((item) => item.name)}
                                    value={gender}
                                    onChange={setGender}
                                    title="Giới tính"
                                    freeSolo={false}
                                    disableClearable={true}
                                    placeholder="Chọn"
                                    heightSelect={200}
                                    disabled={selectedCustomer?.status === 2}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                options={provinces.map((province) => province.province_name)} // Lấy danh sách tỉnh
                                value={selectedProvince}
                                onChange={handleProvinceChange} // Thay đổi hàm xử lý cho tỉnh
                                title="Tỉnh/thành phố"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                heightSelect={150}
                                disabled={selectedCustomer?.status === 2}
                            />
                            <AutoInputComponent
                                options={districts.map((district) => district.district_name)} // Lấy danh sách quận
                                value={selectedDistrict}
                                onChange={handleDistrictChange} // Thay đổi hàm xử lý cho quận
                                title="Quận/huyện"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                disabled={!selectedProvince || selectedCustomer?.status === 2} // Vô hiệu hóa nếu chưa chọn tỉnh
                                heightSelect={150}
                            />
                        </div>
                    </div>

                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                options={wardData.map((ward) => ward.ward_name)} // Lấy danh sách phường
                                value={selectedWard}
                                onChange={handleWardChange} // Thay đổi hàm xử lý cho phường
                                title="Phường/xã"
                                freeSolo={false}
                                disableClearable={true}
                                disabled={!selectedDistrict || selectedCustomer?.status === 2} // Vô hiệu hóa nếu chưa chọn quận
                                placeholder="Nhập ..."
                                heightSelect={150}
                            />

                            <AutoInputComponent
                                value={addressDetail}
                                onChange={setAddressDetail}
                                title="Địa chỉ chi tiết"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                disabled={selectedCustomer?.status === 2}
                            />
                        </div>
                    </div>
                    <div className="grid p-3 grid-cols-2 gap-5">
                        <AutoInputComponent
                            value={status}
                            onChange={setStatus}
                            options={
                                selectedCustomer?.status === 0
                                    ? optionStatusForm.filter((item) => item.value !== 2).map((item) => item.name)
                                    : optionStatusForm.filter((item) => item.value !== 0).map((item) => item.name)
                            }
                            freeSolo={false}
                            disableClearable={true}
                            title="Trạng thái"
                            placeholder="Chọn"
                            heightSelect={150}
                            disabled={!isUpdate}
                        />
                        <div className={`${isUpdate ? 'hidden' : ''}`}>
                            {' '}
                            <AutoInputComponent
                                value="1111"
                                title="Mật khẩu mặc định"
                                heightSelect={100}
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="grid items-center pt-2">
                        <div className="justify-end flex space-x-3 mt-1  border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent
                                text="Xác nhận"
                                className=" bg-blue-500 "
                                onClick={isUpdate ? handleUpdate : handleAdd}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
            <ModalComponent
                open={openDelete}
                handleClose={handleCloseDelete}
                width="25%"
                height="auto"
                smallScreenWidth="40%"
                smallScreenHeight="auto"
                mediumScreenWidth="40%"
                mediumScreenHeight="auto"
                largeScreenHeight="auto"
                largeScreenWidth="40%"
                maxHeightScreenHeight="auto"
                maxHeightScreenWidth="auto"
                title={'Xóa khách hàng'}
            >
                <div className=" grid grid-rows-2 ">
                    <h1 className="grid row-span-1 p-3 ">Bạn có chắc chắn muốn xóa không?</h1>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t p-3 pr-4  ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xóa"
                                className="bg-blue-500"
                                onClick={() => handleDelete(selectedCustomer?.code)}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Customer;
