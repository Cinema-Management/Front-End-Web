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
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { FixedSizeList as List } from 'react-window';
import HeightComponent from '~/components/HeightComponent/HeightComponent';

const Customer = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [staffFilter, setStaffFilter] = useState([]);
    const handleOpen = (isUpdate, isDetail) => {
        setOpen(true);
        setIsUpdate(isUpdate);
        setIsDetail(isDetail);
    };
    const height = HeightComponent();
    const handleClose = () => setOpen(false);

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
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
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

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setStaffFilter(customers);

            return;
        }
        const search = customers.filter((item) => item.name.includes(value));

        if (search.length === 0) {
            toast.info('Không tìm thấy hóa đơn nào nào!');
        } else {
            setStaffFilter(search);
        }
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
                <h1 className="grid justify-center items-center">
                    {item.isAdmin === false ? 'Nhân viên' : item.isAdmin === true ? 'Quản lý' : 'Chưa cấp quyền'}
                </h1>
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
                        <h1 className="grid justify-center items-center">Vai trò</h1>
                        <h1 className="grid justify-center items-center">Trạng thái</h1>
                        <div className=" grid justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] gradient-button "
                                onClick={() => handleOpen(false, false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="py-1 min-w-[1200px]">
                        <List
                            itemCount={staffFilter.length === 0 ? customers?.length : staffFilter.length}
                            itemSize={60}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, staffFilter.length === 0 ? customers : staffFilter)
                            }
                        </List>
                    </div>
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
                title={isDetail ? 'Chi tiết khách hàng' : isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
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

export default Customer;
