import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEye } from 'react-icons/fa6';
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
import { FormatSchedule, getFormatteNgay } from '~/utils/dateUtils';
import { set } from 'lodash';

const Staff = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [inputSearch, setInputSearch] = useState('');
    const [staffFilter, setStaffFilter] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchSDT, setSearchSDT] = useState('');
    const optionCV = [
        { value: 3, name: 'Tất cả' },
        { value: 0, name: 'Chưa cấp quyền' },
        { value: 1, name: 'Quản lý' },
        { value: 2, name: 'Nhân viên' },
    ];
    const [selectedRole, setSelectedRole] = useState(optionCV[0]);

    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
    ];
    const optionStatus = [
        { value: 2, name: 'Tất cả' },
        { value: 0, name: 'Hoạt động' },
        { value: 1, name: 'Ngừng hoạt động' },
    ];

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleOpenDetail = () => {
        setOpenDetail(true);
    };
    const height = HeightComponent();

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedStaff(null);
    };
    const handleClose = () => setOpen(false);

    const fetchStaff = async () => {
        const staffResponse = await axios.get('api/users/staff');

        const arrayStaff = staffResponse.data.map((movie) => ({
            code: movie.code,
            name: movie.name,
        }));
        return { staffs: staffResponse.data, optionStaff: arrayStaff };
    };

    const {
        data: { staffs = [], optionStaff = [] } = {},
        isLoading,
        isFetched,
        isError,
        // refetch,
    } = useQuery('fetchStaff', fetchStaff, {
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

    const handleEnterPress = (newValue) => {
        handleSearchSDT(newValue);
    };

    const handleEnterPress1 = (newValue) => {
        handleSearch(newValue);
    };

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setStaffFilter(staffs);
            return;
        }
        const search = staffs.filter((item) => item.name.includes(value));

        if (search.length === 0) {
            toast.info('Không tìm thấy nhân viên nào!');
            setStaffFilter(staffs);
        } else {
            setStaffFilter(search);
            setSelectedRole(optionCV[0]);
            setSearchSDT('');
            setSelectedStatus(optionStatus[0]);
        }
    };

    const sortRole = (option) => {
        if (!option) {
            setStaffFilter(staffs);
            return;
        }
        setSelectedRole(option);
        let sortedRole = [];
        if (option.value === 0) {
            sortedRole = staffs.filter((item) => item.isAdmin === null);
            setStaffFilter(sortedRole);
        } else if (option.value === 1) {
            sortedRole = staffs.filter((item) => item.isAdmin === true);
            setStaffFilter(sortedRole);
        } else if (option.value === 2) {
            sortedRole = staffs.filter((item) => item.isAdmin === false);
            setStaffFilter(sortedRole);
        } else if (option.value === 3) {
            sortedRole = staffs;
        }
        if (sortedRole.length === 0) {
            toast.info('Không có nhân viên nào!');
        }
        setStaffFilter(sortedRole);
        setInputSearch('');
        setSearchSDT('');
        setSelectedStatus(optionStatus[0]);
    };
    const handleSearchSDT = (value) => {
        setSearchSDT(value);
        if (value === '' || value === null) {
            setStaffFilter(staffs);
            return;
        }
        const search = staffs.filter((item) => item.phone === value);

        if (search.length === 0) {
            toast.info('Không tìm thấy nhân viên nào!');
            setStaffFilter(staffs);
        } else {
            setStaffFilter(search);
            setSelectedRole(optionCV[0]);
            setInputSearch('');
            setSelectedStatus(optionStatus[0]);
        }
    };
    const sortedStatus = (option) => {
        if (!option) {
            setStaffFilter(staffs);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 0) {
            sortedStatus = staffs.filter((item) => item.status === 1);
            setStaffFilter(sortedStatus);
        } else if (option.value === 1) {
            sortedStatus = staffs.filter((item) => item.status === 0);
            setStaffFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = staffs;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có nhân viên nào!');
        }
        setStaffFilter(sortedStatus);
        setInputSearch('');
        setSearchSDT('');
        setSelectedRole(optionCV[0]);
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
                <h1 className="grid col-span-2 items-center ">{item.address}</h1>
                <h1 className="grid justify-center items-center">
                    {item.isAdmin === false ? 'Nhân viên' : item.isAdmin === true ? 'Quản lý' : 'Chưa cấp quyền'}
                </h1>
                <div className="  justify-center items-center grid  ">
                    <button
                        className={`border px-[6px] uppercase break-all text-white text-[13px] py-[3px] flex  rounded-[40px] ${
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
                            onClick={() => handleOpen(true)}
                        >
                            <FaRegEdit color="black" size={20} />
                        </button>
                        <button
                            onClick={() => {
                                handleOpenDetail();
                                setSelectedStaff(item);
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
            <div className="bg-white border overflow-x-auto overflow-y-hidden  xl:overflow-hidden shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Nhân viên</h1>

                <div className="grid grid-cols-4  max-lg:gap-3 gap-12 items-center w-full h-16 px-3  min-w-[900px]">
                    <AutoInputComponent
                        options={optionStaff.map((item) => item.name)}
                        value={inputSearch}
                        onChange={(newValue) => handleSearch(newValue)}
                        title="Tên nhân viên"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập"
                        heightSelect={200}
                        borderRadius="10px"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEnterPress1(e.target.value);
                            }
                        }}
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
                        value={selectedRole?.name}
                        onChange={(newValue) => sortRole(newValue)}
                        options={optionCV}
                        title="Vai trò"
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b py-1 text-sm uppercase font-bold text-slate-500 grid grid-cols-8 items-center gap-2 min-w-[1200px] ">
                        <div className="grid grid-cols-3">
                            <h1 className="grid justify-center items-center">STT</h1>
                            <h1 className="grid justify-center col-span-2 items-center">Mã NV</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Họ tên</h1>
                        <h1 className="grid justify-center items-center">Số điện thoại</h1>
                        <h1 className="grid col-span-2 justify-center items-center">Địa chỉ</h1>
                        <h1 className="grid justify-center items-center">Vai trò</h1>
                        <h1 className="grid justify-center items-center">Trạng thái</h1>
                        <div className=" grid justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] gradient-button "
                                onClick={() => handleOpen(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="py-1">
                        <List
                            itemCount={staffFilter.length === 0 ? staffs?.length : staffFilter.length}
                            itemSize={60}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, staffFilter.length === 0 ? staffs : staffFilter)
                            }
                        </List>
                    </div>
                </div>
            </div>

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
                title={isUpdate ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
            >
                <div className={`h-90p grid grid-rows-6 gap-2 `}>
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

                    <div className="grid items-center pt-2">
                        <div className="justify-end flex space-x-3 mt-1  border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

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
                title="Chi tiết nhân viên"
            >
                <div className="h-90p grid grid-rows-6 gap-2 ">
                    <div className="grid row-span-5">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2 grid-cols-2 gap-2">
                                    <h1 className=" font-bold">Mã khách hàng:</h1>
                                    <h1 className=" font-normal">{selectedStaff?.code}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Họ và tên:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedStaff?.name}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Giới tính:</h1>
                                    <h1 className="grid  font-normal">{selectedStaff?.gender}</h1>
                                </div>
                                <div className="grid col-span-3  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Vai trò:</h1>
                                    <h1 className="font-normal grid col-span-2">
                                        {selectedStaff?.isAdmin === null
                                            ? 'Chưa cấp quyền'
                                            : selectedStaff?.isAdmin === false
                                            ? 'Nhân viên'
                                            : 'Quản lý'}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày sinh:</h1>
                                    <h1 className="font-normal">{getFormatteNgay(selectedStaff?.birthDate)}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Số điện thoại:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedStaff?.phone}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Trạng thái:</h1>
                                    <h1 className="grid  font-normal">
                                        {selectedStaff?.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Email:</h1>
                                    <h1 className="font-normal col-span-2">{selectedStaff?.email}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-12 gap-2">
                                <h1 className="font-bold">Địa chỉ:</h1>
                                <h1 className="font-normal ml-2 col-span-11">{selectedStaff?.address}</h1>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày tạo:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedStaff?.createdAt)}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày cập nhật:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedStaff?.updatedAt)}</h1>
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
        </div>
    );
};

export default Staff;
