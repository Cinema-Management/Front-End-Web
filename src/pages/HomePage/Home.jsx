import { Button, DatePicker } from 'antd';
import axios from 'axios';
import ky from 'ky';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaShieldAlt } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import { getFormatteNgay } from '~/utils/dateUtils';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import Loading from '~/components/LoadingComponent/Loading';
import { updateUser } from '~/redux/authSlice';
import { update } from 'lodash';

const Home = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [wardData, setWardData] = useState([]);
    const [addressDetail, setAddressDetail] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const optionGender = [
        { value: 0, name: 'Nam' },
        { value: 1, name: 'Nữ' },
    ];

    const handleOpen = () => {
        setOpen(true);
    };
    const clearText = () => {
        setName('');
        setEmail('');
        setBirthDate(null);
        setGender('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setAddressDetail('');
    };
    const handleClose = () => {
        setOpen(false);
        clearText();
    };

    const getAddress = async (code) => {
        try {
            const response = await axios.get(`api/hierarchy-values/${code}`);
            if (response.data) {
                setSelectedProvince(response.data.province);
                setSelectedDistrict(response.data.district);
                setSelectedWard(response.data.ward);
                setAddressDetail(response.data.addressDetail);
                console.log(response.data);
                return response.data.fullAddress;
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

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

    const disabledDate = (current) => {
        // Tính toán ngày 14 năm trước từ hôm nay
        const fourteenYearsAgo = dayjs().subtract(16, 'year');
        return current && current > fourteenYearsAgo; // Disable tất cả các ngày sau ngày 14 năm trước
    };

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            const arrayNameCinema = data
                .filter((item) => item.status === 1)
                .map((cinema) => ({
                    name: cinema.name,
                    code: cinema.code,
                }));
            return { optionNameCinema: arrayNameCinema };
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
    const fetchStaff = async () => {
        const staffResponse = await axios.get('api/users/staff');

        const arrayStaff = staffResponse.data.map((movie) => ({
            code: movie.code,
            name: movie.name,
        }));
        return { staffs: staffResponse.data, optionStaff: arrayStaff };
    };

    const {
        data: { staffs = [] } = {},
        isLoading,
        isFetched,
        isError,
        refetch,
    } = useQuery('fetchStaff', fetchStaff, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: fullAddressStaff = '',
        isLoading: isLoadingFullAddressStaff,
        error: errorFullAddressStaff,
    } = useQuery(
        ['fullAddressStaff', user?.address], // Query key phụ thuộc vào 'date'
        () => getAddress(user?.address),
        {
            staleTime: 1000 * 60 * 3, // Cache dữ liệu trong 3 phút
            cacheTime: 1000 * 60 * 10, // Cache dữ liệu trong 10 phút
            enabled: !!user?.address, // Chỉ fetch khi 'date' không phải null hoặc undefined
        },
    );

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('cinemasFullAddress1', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

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
    const validate = () => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        const checkEmail = staffs.find((user) => user.email.trim() === email.trim());

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
        if (checkEmail?.email !== user?.email && checkEmail) {
            toast.warning('Email đã tồn tại!');
            return false;
        }

        if (!birthDate) {
            toast.warning('Vui lòng chọn ngày sinh!');
            return false;
        }

        if (!gender) {
            toast.warning('Vui lòng chọn giới tính!');
            return false;
        }

        if (selectedProvince === '') {
            toast.warning('Vui lòng chọn tỉnh/thành phố!');
            return false;
        }

        if (selectedDistrict === '') {
            toast.warning('Vui lòng chọn quận/huyện!');
            return false;
        }

        if (selectedWard === '') {
            toast.warning('Vui lòng chọn phường/xã!');
            return false;
        }

        if (addressDetail === '') {
            toast.warning('Vui lòng nhập địa chỉ chi tiết!');
            return false;
        }

        return true;
    };
    const handleRequest = async () => {
        try {
            if (!user?.gender || !user?.address || !user?.birthDate) {
                toast.warning('Vui lòng cập nhật đầy đủ thông tin trước khi yêu cầu cấp quyền!');
                return;
            }
            if (user?.permissionRequest.status === 1) {
                toast.warning('Yêu cầu đã được gửi vui lòng chờ kết quả!');
                return;
            }
            await axios.put('api/users/updatePermissionRequest/' + user?.code, {
                status: 1,
            });

            dispatch(updateUser({ ...user, permissionRequest: { status: 1, date: new Date() } }));

            toast.success('Đã gửi yêu cầu!');
            refetch();
        } catch (error) {}
    };

    const mutation = useMutation(handleRequest, {
        onSuccess: () => {
            // Refetch dữ liệu cần thiết
            queryClient.refetchQueries('getAllStaffPermissionRequest');
        },
    });

    const handleUpdate = async () => {
        try {
            let loadingId;

            if (!validate()) return;
            loadingId = toast.loading('Đang cập nhật !');

            const hierarchyValues = [
                { name: selectedProvince, level: 0 },
                { name: selectedDistrict, parentCode: '', level: 1 },
                { name: selectedWard, parentCode: '', level: 2 },
                { name: addressDetail, parentCode: '', level: 3 },
            ];
            let parentCode = '';

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
            const staff = {
                name: name,
                birthDate: birthDate,
                gender: gender,
                email: email,
                address: parentCode,
                type: 1,
            };

            const responseCinema = await axios.put('api/users/' + user?.code, staff);
            if (responseCinema.data) {
                toast.dismiss(loadingId);
                dispatch(updateUser(staff));

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

    if (isLoading || isLoadingProvinces || isLoadingDistricts || isLoadingCinemas || isLoadingFullAddressStaff)
        return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (isError || provincesError || districtsError || CinemaError || errorFullAddressStaff)
        return (
            <div>
                Error loading data:{' '}
                {isError.message ||
                    provincesError.message ||
                    districtsError.message ||
                    CinemaError.message ||
                    errorFullAddressStaff.message}
            </div>
        );

    return (
        <div className="bg-white  min-h-[60%] rounded-[10px] p-3 mt-2">
            <div className="text-[16px]">
                <h1 className="text-[20px] font-bold">Thông tin cá nhân</h1>
                <div className="mt-3 flex custom-ipad">
                    <div className="">
                        <img src={user?.avatar} alt="avatar" className="object-contain w-[250px] h-[250px] " />
                    </div>
                    <div className="ml-5 w-[75%] custom-ipad1    grid grid-cols-2   ">
                        <div className="grid   grid-rows-5 ">
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Mã nhân viên: </h1>
                                </div>

                                <div className=" grid col-span-6">
                                    <h1 className="font-medium">{user?.code}</h1>
                                </div>
                            </div>

                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Họ tên: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">{user?.name}</h1>
                                </div>
                            </div>
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Năm sinh: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    {getFormatteNgay(user?.birthDate) || 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Giới tính: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">{user?.gender || 'Chưa cật nhật'} </h1>
                                </div>
                            </div>

                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Địa chỉ: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">{fullAddressStaff || 'Chưa cật nhật'}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="grid  grid-rows-5 ml-10">
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Số điện thoại: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">{user?.phone}</h1>
                                </div>
                            </div>
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Email: </h1>
                                </div>

                                <div className=" grid col-span-6">
                                    <h1 className="font-medium break-all">{user?.email}</h1>
                                </div>
                            </div>

                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Vai trò: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">
                                        {user?.isAdmin === false
                                            ? 'Nhân viên'
                                            : user?.isAdmin === true
                                            ? 'Quản lý'
                                            : 'Chưa cấp quyền'}
                                    </h1>
                                </div>
                            </div>
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Rạp: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">
                                        {user?.isAdmin
                                            ? 'Tất cả rạp'
                                            : optionNameCinema.find((item) => item.code === user?.cinemaCode)?.name ||
                                              'Chưa cật nhật'}
                                    </h1>
                                </div>
                            </div>
                            <div className=" grid grid-cols-10">
                                <div className="grid col-span-4">
                                    <h1 className="font-bold">Trạng thái: </h1>
                                </div>

                                <div className="grid col-span-6">
                                    <h1 className="font-medium">
                                        {user?.status === 0 ? 'Ngưng hoạt động' : 'Đang hoạt động'}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-3/4 py-3  ">
                            <Button
                                type="primary"
                                style={{ width: '100%', color: 'black', fontWeight: 500, fontSize: '16px' }}
                                onClick={() => {
                                    handleOpen();

                                    setName(user?.name);
                                    setEmail(user?.email);
                                    setGender(user?.gender);
                                    setBirthDate(dayjs(user?.birthDate).format('YYYY-MM-DD'));

                                    getAddress(user.address);
                                }}
                            >
                                <FaRegEdit color="black" size={22} /> Cập nhật thông tin
                            </Button>
                        </div>
                        {user?.isAdmin === null && (
                            <div className="w-3/4 py-3 ml-12 ">
                                <div>
                                    <Button
                                        type="primary"
                                        danger
                                        style={{ width: '100%', color: 'white', fontWeight: 500, fontSize: '15px' }}
                                        onClick={() => mutation.mutate()}
                                    >
                                        <FaShieldAlt color="white" size={22} />
                                        {user?.permissionRequest?.status === 3
                                            ? 'Gửi lại yêu cầu cấp quyền'
                                            : 'Gửi yêu cầu cấp quyền'}
                                    </Button>
                                </div>
                                <div className="mt-2 ml-3">
                                    <span>
                                        Yêu cầu:{' '}
                                        {user?.permissionRequest?.status === 1
                                            ? 'Đã được gửi'
                                            : user?.permissionRequest?.status === 3
                                            ? 'Bị từ chối'
                                            : 'Chưa được gửi'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="40%"
                height="60%"
                smallScreenWidth="65%"
                smallScreenHeight="50%"
                mediumScreenWidth="60%"
                mediumScreenHeight="43%"
                largeScreenHeight="37%"
                largeScreenWidth="60%"
                maxHeightScreenHeight="80%"
                maxHeightScreenWidth="60%"
                heightScreen="62%"
                title="Cập nhật thông tin "
            >
                <div className={`h-90p grid  gap-2 grid-rows-5`}>
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
                            />
                            <AutoInputComponent
                                value={email}
                                onChange={setEmail}
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
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày sinh</h1>
                                <DatePicker
                                    onChange={setBirthDate}
                                    value={birthDate ? dayjs(birthDate) : null}
                                    allowClear={false} // Không cho phép xóa
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    disabledDate={disabledDate}
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
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
                            />
                        </div>
                    </div>
                    <div className="grid p-3">
                        <div className="grid grid-cols-2 gap-5">
                            <AutoInputComponent
                                options={provinces.map((province) => province.province_name)}
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                title="Tỉnh/thành phố"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                heightSelect={150}
                            />
                            <AutoInputComponent
                                options={districts.map((district) => district.district_name)}
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                title="Quận/huyện"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
                                disabled={!selectedProvince}
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
                                disabled={!selectedDistrict} // Vô hiệu hóa nếu chưa chọn quận
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
                            />
                        </div>
                    </div>

                    <div className="grid items-center pt-2">
                        <div className="justify-end flex space-x-3 mt-1  border-t pt-3 pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500" onClick={handleUpdate} />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Home;
