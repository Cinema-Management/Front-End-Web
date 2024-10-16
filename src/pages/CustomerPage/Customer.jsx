import React, { useState } from 'react';
import { FaRegEye } from 'react-icons/fa6';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
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

const Customer = () => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [searchSDT, setSearchSDT] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [customerFilter, setCustomerFilter] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleOpen = () => {
        setOpen(true);
    };
    const height = HeightComponent();
    const handleClose = () => {
        setOpen(false);
        setSelectedCustomer(null);
    };

    const optionCV = [
        { value: '0', label: 'Lọc chức vụ' },
        { value: 'AD', label: 'Admin' },
        { value: 'NV', label: 'Staff' },
    ];
    const optionStatus = [
        { value: 2, name: 'Tất cả' },
        { value: 0, name: 'Hoạt động' },
        { value: 1, name: 'Ngừng hoạt động' },
    ];

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const fetchCustomer = async () => {
        const customerResponse = await axios.get('api/users');

        const arrayCustomer = customerResponse.data.map((item) => ({
            code: item.code,
            name: item.name,
        }));
        return { customers: customerResponse.data, optionCustomer: arrayCustomer };
    };

    const {
        data: { customers = [], optionCustomer = [] } = {},
        isLoading,
        isFetched,
        isError,
        // refetch,
    } = useQuery('fetchCustomer', fetchCustomer, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        // onSuccess: (data) => {
        //     setFoodFilter(data.product);
        // },
    });

    if (isLoading) return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (isError) return <div>Error loading data: {isError.message}</div>;

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
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
    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data].reverse();
        const item = reversedData[index];

        return (
            <div
                className="border-b py-3 text-[15px] font-normal text-slate-500 grid grid-cols-8 items-center gap-2  min-w-[900px] "
                key={item.code}
                style={style}
            >
                <div className="grid  grid-cols-3">
                    <h1 className="grid pl-2 items-center">{index + 1}</h1>
                    <h1 className="grid pl-2 col-span-2 items-center">{item.code}</h1>
                </div>
                <h1 className="grid items-center pl-3 ">{item.name}</h1>
                <h1 className="grid justify-center items-center break-all ">{item.phone}</h1>
                <h1 className="grid col-span-2 items-center ">{item.address}</h1>
                <h1 className="grid justify-center items-center">Bạc</h1>
                <div className="  justify-center items-center grid">
                    <button
                        className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                            item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        {item.status === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
                    </button>
                </div>
                <div className=" justify-center items-center grid  ">
                    <div className="grid">
                        <button
                            onClick={() => {
                                handleOpen();
                                setSelectedCustomer(item);
                            }}
                        >
                            <FaRegEye color="black" fontSize={20} />
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
                    <SelectComponent
                        value={selectedValue}
                        onChange={handleChange}
                        options={optionCV}
                        title="Vai trò"
                        selectStyles={{ borderRadius: '10px' }}
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-hubmax custom-height-xl">
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
                        <div className=" grid justify-center"></div>
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
                open={open}
                handleClose={handleClose}
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
                                    <h1 className="grid  font-normal">{selectedCustomer?.gender}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Địa chỉ:</h1>
                                    <h1 className="font-normal ml-2 col-span-2">{selectedCustomer?.address}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày sinh:</h1>
                                    <h1 className="font-normal">{getFormatteNgay(selectedCustomer?.birthDate)}</h1>
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
                                    <h1 className="grid col-span-2 font-normal">{selectedCustomer?.points} điểm</h1>
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
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleClose} />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Customer;
