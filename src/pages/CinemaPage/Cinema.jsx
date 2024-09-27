import React, { useState } from 'react';
import { FaRegEdit, FaRegEye } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ky from 'ky';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from 'axios';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';

const optionsLoc = [
    { value: '0', label: 'Chọn' },
    { value: 'KD', label: 'Kinh dị' },
    { value: 'HH', label: 'Hài hước' },
    { value: 'TC', label: 'Tình cảm' },
];
const optionsSort = [
    { value: '0', label: 'Chọn' },
    { value: 'A', label: 'A - Z' },
    { value: 'B', label: 'Z - A' },
];

const Cinema = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isUpdateRoom, setIsUpdateRoom] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [onpenRoom, setOpenRoom] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const BASE_API_URL = 'https://provinces.open-api.vn/api';
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [nameCinema, setNameCinema] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [selectedCinema, setSelectedCinema] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedOptionRoomType, setSelectedOptionRoomType] = useState([]);
    const [nameRoom, setNameRoom] = useState('');
    const [numRows, setNumRows] = useState('');
    const [numColumns, setNumColumns] = useState('');
    const [selectedRoom, setSelectedRoom] = useState([]);

    const [optionRoomType, setOptionRoomType] = useState([]);

    // toast.success('t',optionNameCinema);

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name, // Hiển thị tên
                code: cinema.code, // Giá trị sẽ được gửi về
            }));

            return { cinemas: data, optionNameCinema: arrayNameCinema };
        } catch (error) {
            // Handle errors based on response or other criteria
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                throw new Error('Error: No response received from server');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    };
    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('api/room-types');
            const data = response.data;

            // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
            const roomTypeOptions = data.map((roomType) => ({
                label: roomType.name, // Hiển thị tên
                value: roomType.code, // Giá trị sẽ được gửi về
            }));

            setOptionRoomType(roomTypeOptions); // Cập nhật state với options
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const navigate = useNavigate();

    const {
        data: { cinemas = [], optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        refetch,
    } = useQuery('cinemasFullAddress', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const clearTextModalCinema = () => {
        setNameCinema('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setAddressDetail('');
    };

    const clearTextModalRoom = () => {
        setNameRoom('');
        setSelectedOptionRoomType([]);
        setNumRows('');
        setNumColumns('');
    };

    // action
    const handleAddRoom = async () => {
        try {
            if (!validateRoom()) return;
            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);
            // Dữ liệu gửi đi
            const roomData = {
                name: nameRoom,
                cinemaCode: selectedCinema?.code,
                roomTypeCode: arrayValueRoomType,
                numRows: numRows,
                numColumns: numColumns,
            };

            // Gửi request POST tới server
            const response = await axios.post('api/rooms', roomData);

            if (response.data) {
                clearTextModalRoom();
                toast.success('Thêm phòng thành công!');
                handleCloseRoom();
                getRoomByCinemaCode(selectedCinema?.code);
            }
        } catch (err) {
            // Nếu có lỗi, hiển thị lỗi
            toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateRoom = async (roomCode) => {
        if (!roomCode) return;
        try {
            if (!validateRoom()) return;
            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);
            alert(arrayValueRoomType);
            // Dữ liệu gửi đi
            const roomData = {
                code: roomCode,
                name: nameRoom,
                cinemaCode: selectedCinema?.code,
                roomTypeCode: arrayValueRoomType,
                numRows: numRows,
                numColumns: numColumns,
            };

            // Gửi request POST tới server
            const response = await axios.put('api/rooms', roomData);

            if (response.data) {
                clearTextModalRoom();
                toast.success('Cập nhật phòng thành công!');
                handleCloseRoom();
                getRoomByCinemaCode(selectedCinema?.code);
            }
        } catch (err) {
            toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const validateCinema = () => {
        if (nameCinema === '') {
            toast.warning('Vui lòng nhập tên rạp!');
            return false;
        } else if (selectedProvince === '') {
            toast.warning('Vui lòng chọn tỉnh/thành phố!');
            return false;
        } else if (selectedDistrict === '') {
            toast.warning('Vui lòng chọn quận/huyện!');
            return false;
        } else if (selectedWard === '') {
            toast.warning('Vui lòng chọn phường/xã!');
            return false;
        } else if (addressDetail === '') {
            toast.warning('Vui lòng nhập địa chỉ chi tiết!');
            return false;
        } else return true;
    };

    const validateRoom = () => {
        const regexPositiveInteger = /^(10|[1-9])$/;

        if (nameRoom === '') {
            toast.warning('Vui lòng nhập tên phòng!');
            return false;
        } else if (selectedOptionRoomType.length === 0) {
            toast.warning('Vui lòng chọn loại phòng!');
            return false;
        } else if (typeof numRows === 'string' && !regexPositiveInteger.test(numRows)) {
            toast.warning('Hàng phải là số nguyên  1 - 10 !');
            return false;
        } else if (typeof numColumns === 'string' && !regexPositiveInteger.test(numColumns)) {
            toast.warning('Cột phải là số nguyên dương > 0!');
            return false;
        } else return true;
    };

    const handleAddCinema = async () => {
        try {
            if (!validateCinema()) return;
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

            const cinema = {
                name: nameCinema,
                hierarchyValueCode: parentCode,
            };

            await axios.post('api/cinemas', cinema);

            toast.success('Thêm rạp thành công!');
            refetch();
            clearTextModalCinema();
            handleCloseCinema();
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateCinema = async (cinemaCode) => {
        try {
            if (!validateCinema()) return;
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
            const cinema = {
                code: cinemaCode,
                name: nameCinema,
                hierarchyValueCode: parentCode,
            };

            const result = await axios.put('api/cinemas', cinema);

            if (result.data) {
                toast.success('Cập nhật rạp thành công!');
                clearTextModalCinema();
                refetch();
                handleCloseCinema();
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateStatusCinema = async (cinemaCode, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        const cinema = {
            code: cinemaCode,
            status: newStatus,
        };
        try {
            await axios.put(`api/cinemas`, cinema);
            toast.success('Cập nhật trạng thái rạp thành công!');
            refetch();
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateStatusRoom = async (roomcode, currentStatus) => {
        if (!roomcode) return;
        const newStatus = currentStatus === 0 ? 1 : 0;
        const room = {
            code: roomcode,
            status: newStatus,
        };
        try {
            await axios.put(`api/rooms`, room);
            toast.success('Cập nhật trạng thái phòng thành công!');
            getRoomByCinemaCode(selectedCinema?.code);
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const getAddress = async (code) => {
        try {
            const response = await axios.get(`api/hierarchy-values/${code}`);
            if (response.data) {
                setSelectedProvince(response.data.province);
                setSelectedProvince(response.data.province);
                setSelectedDistrict(response.data.district);
                setSelectedWard(response.data.ward);
                setAddressDetail(response.data.addressDetail);
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const getRoomByCinemaCode = async (cinemaCode) => {
        if (!cinemaCode) return; // Nếu cinemaCode rỗng thì không gọi API

        try {
            const response = await axios.get(`api/rooms/${cinemaCode}`);
            if (response.data) {
                setRooms(response.data);
                handOpenDetail();
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };
    const {
        data: provinces = [],
        isLoading: isLoadingProvinces,
        error: provincesError,
    } = useQuery(
        'provinces',
        async () => {
            const response = await ky.get(`${BASE_API_URL}/p/`);
            return response.json();
        },
        {
            staleTime: 1000 * 60 * 5, // Dữ liệu còn mới trong 3 phút
            cacheTime: 1000 * 60 * 10, // Giữ trong cache 10 phút
        },
    );

    if (isLoadingCinemas || isLoadingProvinces) {
        return <Loading />;
    }

    // Kiểm tra lỗi khi tải rạp chiếu phim
    if (CinemaError) {
        return <div>Lỗi khi tải rạp: {CinemaError.message}</div>;
    }

    // Kiểm tra lỗi khi tải tỉnh
    if (provincesError) {
        return <div>Lỗi khi tải tỉnh: {provincesError.message}</div>;
    }

    const fetchDistricts = async (provinceCode) => {
        try {
            const data = await ky.get(`${BASE_API_URL}/p/${provinceCode}`, { searchParams: { depth: 2 } }).json();
            setDistricts(data.districts); // Lưu trữ danh sách quận
            setWards([]); // Reset wards when province changes
            setSelectedDistrict(''); // Reset selected district
            setSelectedWard(''); // Reset selected ward when province changes
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Fetch wards based on selected district
    const fetchWards = async (districtCode) => {
        try {
            const data = await ky.get(`${BASE_API_URL}/d/${districtCode}`, { searchParams: { depth: 2 } }).json();
            setWards(data.wards); // Lưu trữ danh sách phường
        } catch (error) {
            console.error('Error fetching wards:', error);
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
        const province = provinces.find((province) => normalizeString(province.name) === normalizedInput);
        return province ? province.code : null;
    };

    const getDistrictsCodeByName = (name) => {
        const normalizedInput = normalizeString(name);
        const district = districts.find((districts) => normalizeString(districts.name) === normalizedInput);
        return district ? district.code : null;
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);

        fetchDistricts(getProvinceCodeByName(value)); // Gọi hàm fetchDistricts khi province thay đổi
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setSelectedWard(''); // Reset selected ward when district changes
        fetchWards(getDistrictsCodeByName(value)); // Gọi hàm fetchWards khi district thay đổi
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };
    const handleOpenRoom = (isUpdateRoom) => {
        fetchRoomTypes();
        setOpenRoom(true);
        setIsUpdateRoom(isUpdateRoom);
        setOpenDetail(false);
    };
    const handleCloseRoom = () => {
        setOpenRoom(false);
        setOpenDetail(true);
    };

    const handleOpenCinema = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleCloseCinema = () => setOpen(false);

    const handOpenDetail = () => setOpenDetail(true);
    const handleCloseDetail = () => {
        setOpenDetail(false);
        refetch();
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Rạp</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={optionNameCinema}
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
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Số phòng"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 h-[515px] max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="border-b py-1 text-sm font-bold text-slate-500 grid grid-cols-12 items-center gap-2">
                    <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                        <h1 className=" grid justify-center col-span-3 items-center  ">Stt</h1>
                        <h1 className="grid justify-center col-span-7 items-center    ">Mã phim</h1>
                    </div>

                    <div className="uppercase grid justify-center grid-cols-10 col-span-7 gap-4 items-center">
                        <h1 className="grid justify-center col-span-3 items-center  ">Tên rạp</h1>
                        <h1 className="grid justify-center col-span-5 items-center   m-4 ">Địa chỉ</h1>
                        <h1 className="grid justify-center col-span-2 items-center   ">Số lượng phòng</h1>
                    </div>
                    <div className="uppercase grid justify-center grid-cols-10 col-span-3 gap-2 items-center">
                        <h1 className="grid justify-center col-span-7 items-center    ">Trạng thái</h1>

                        <div
                            className="flex justify-center col-span-3   "
                            onClick={() => {
                                handleOpenCinema(false);
                                clearTextModalCinema();
                            }}
                        >
                            <button className="border px-4 py-1 rounded-[40px] bg-orange-400">
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-auto h-90p height-sm-1">
                    {cinemas.map((item, index) => (
                        <div
                            className="border-b py-3 text-base font-normal text-slate-500 grid grid-cols-12 items-center gap-2"
                            key={item.code}
                        >
                            <div className="grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                                <h1 className="grid justify-center col-span-3  items-center ">{index + 1}</h1>
                                <h1 className="grid justify-center col-span-7 items-center  ">{item.code}</h1>
                            </div>

                            <div className=" grid justify-center grid-cols-10 col-span-7 gap-4 items-center">
                                <h1 className=" grid col-span-3  items-center  ">{item.name}</h1>
                                <h1 className=" grid col-span-5 items-center m-2 ">{item.fullAddress}</h1>
                                <div
                                    className="flex col-span-2 justify-center items-center cursor-pointer  "
                                    onClick={() => {
                                        getRoomByCinemaCode(item.code);
                                        setSelectedCinema(item);
                                    }}
                                >
                                    <h1 className="">{item.roomsCount}</h1>
                                    <button className=" ml-2">
                                        <FaRegEye color="black" fontSize={20} />
                                    </button>
                                </div>
                            </div>

                            <div className=" grid justify-center grid-cols-10 col-span-3 gap-2 items-center">
                                <div className="   grid justify-center col-span-7 items-center ">
                                    <button
                                        className={`uppercase border px-2 text-white text-[13px] py-[1px] flex  rounded-[40px] ${
                                            item.status === 0 ? 'bg-gray-400' : 'bg-green-500'
                                        }`}
                                        onClick={() => handleUpdateStatusCinema(item.code, item.status)}
                                    >
                                        {item.status === 0 ? 'Không đoạt động' : 'Hoạt động'}
                                    </button>
                                </div>
                                <div className="  grid justify-center col-span-3 items-center ">
                                    <button
                                        className=" px-4 py-1"
                                        onClick={() => {
                                            handleOpenCinema(true);
                                            setSelectedCinema(item);
                                            getAddress(item.hierarchyValueCode);
                                        }}
                                    >
                                        <FaRegEdit color="black" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleCloseCinema}
                width="30%"
                height="70%"
                smallScreenWidth="50%"
                smallScreenHeight="52%"
                mediumScreenWidth="50%"
                mediumScreenHeight="45%"
                largeScreenHeight="38%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="87%"
                maxHeightScreenWidth="45%"
                heightScreen="65%"
                title={isUpdate ? 'Chỉnh sửa rạp' : 'Thêm rạp'}
            >
                <div className=" h-90p grid grid-rows-6 gap-16">
                    <div className="grid p-3 ">
                        <AutoInputComponent
                            value={isUpdate ? selectedCinema?.name : nameCinema}
                            onChange={setNameCinema}
                            title="Tên rạp"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>

                    <div className="grid p-3">
                        <AutoInputComponent
                            options={provinces.map((province) => province.name)} // Lấy danh sách tỉnh
                            value={selectedProvince}
                            onChange={handleProvinceChange} // Thay đổi hàm xử lý cho tỉnh
                            title="Tỉnh/thành phố"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>
                    <div className="grid p-3">
                        <AutoInputComponent
                            options={districts.map((district) => district.name)} // Lấy danh sách quận
                            value={selectedDistrict}
                            onChange={handleDistrictChange} // Thay đổi hàm xử lý cho quận
                            title="Quận/huyện"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            disabled={!selectedProvince} // Vô hiệu hóa nếu chưa chọn tỉnh
                            heightSelect={150}
                        />
                    </div>
                    <div className="grid p-3">
                        <AutoInputComponent
                            options={wards.map((ward) => ward.name)} // Lấy danh sách phường
                            value={selectedWard}
                            onChange={handleWardChange} // Thay đổi hàm xử lý cho phường
                            title="Phường/xã"
                            freeSolo={false}
                            disableClearable={true}
                            disabled={!selectedDistrict} // Vô hiệu hóa nếu chưa chọn quận
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>
                    <div className="w-full grid row-span-3 ">
                        <AutoInputComponent
                            value={addressDetail}
                            onChange={setAddressDetail}
                            title="Địa chỉ chi tiết"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={150}
                            className1="p-3"
                        />
                        <div className="justify-end flex space-x-3 pt-4 border-t pr-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseCinema} />
                            <ButtonComponent
                                text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                className=" bg-blue-500"
                                onClick={isUpdate ? () => handleUpdateCinema(selectedCinema?.code) : handleAddCinema}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="55%"
                height="70%"
                smallScreenWidth="50%"
                smallScreenHeight="52%"
                mediumScreenWidth="50%"
                mediumScreenHeight="45%"
                largeScreenHeight="38%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="87%"
                maxHeightScreenWidth="45%"
                title="DANH SÁCH PHÒNG CHIẾU"
            >
                <div className=" h-90p grid grid-rows-12 ">
                    <div className="border-b text-xs font-bold text-slate-500 grid grid-cols-8 items-center gap-2 mx-2">
                        <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                            <h1 className=" grid justify-center col-span-4 items-center   ">Stt</h1>
                            <h1 className="grid justify-center col-span-6 items-center      ">Mã phòng</h1>
                        </div>

                        <div className="uppercase grid justify-center grid-cols-11 col-span-4 gap-2 items-center">
                            <h1 className=" uppercase grid justify-center items-center col-span-4   ">Tên phòng</h1>
                            <h1 className=" uppercase grid justify-center items-center col-span-5    ">Loại phòng</h1>
                            <h1 className=" uppercase grid justify-center items-center col-span-2    ">Số ghế</h1>
                        </div>

                        <div className="uppercase grid justify-center grid-cols-10  col-span-2 gap-2 items-center">
                            <h1 className=" uppercase grid justify-center items-center col-span-7  ">Trạng thái</h1>
                            <div className="flex justify-center col-span-3     ">
                                <button
                                    className="border px-3 py-1 rounded-[40px] bg-orange-400 "
                                    onClick={() => {
                                        clearTextModalRoom();
                                        handleOpenRoom(false);
                                    }}
                                >
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-auto row-span-11  h-95p height-sm-1 ">
                        {rooms?.map((item, index) => (
                            <div
                                className="border-b text-base font-normal  py-3 text-slate-500 grid grid-cols-8 items-center gap-2 m-2"
                                key={item.code}
                            >
                                <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                                    <h1 className=" grid justify-center col-span-4 items-center   ">{index + 1}</h1>
                                    <h1 className="grid justify-center col-span-6 items-center      ">{item?.code}</h1>
                                </div>

                                <div className=" grid justify-center grid-cols-11 col-span-4 gap-2 items-center">
                                    <h1 className=" grid items-center pl-3 col-span-4">{item?.name}</h1>
                                    <h1 className=" grid justify-center items-center col-span-5">
                                        {item?.roomTypeName}
                                    </h1>
                                    <div
                                        className="flex justify-center items-center  col-span-2 "
                                        onClick={() => handleNavigate('/room')}
                                    >
                                        <h1 className="">138</h1>

                                        <button
                                            className=" ml-2"
                                            onClick={() => {
                                                getRoomByCinemaCode(item.code);
                                            }}
                                        >
                                            <FaRegEye color="black" fontSize={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="uppercase grid justify-center items-center grid-cols-10  col-span-2 gap-2">
                                    <div className="  justify-center items-center grid  col-span-7 ">
                                        <button
                                            className={` border px-2 text-white text-[13px] py-[1px] flex  rounded-[40px] ${
                                                item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                            onClick={() => handleUpdateStatusRoom(item.code, item.status)}
                                        >
                                            {item.status === 0 ? 'Không Hoạt động' : 'Hoạt động'}
                                        </button>
                                    </div>

                                    <div className="justify-center items-center grid  col-span-3">
                                        <button
                                            className=" px-4 py-1"
                                            onClick={() => {
                                                handleOpenRoom(true);
                                                setSelectedRoom(item);
                                                setSelectedOptionRoomType(
                                                    item.roomTypeCode.map((roomType) => ({
                                                        label: roomType.name,
                                                        value: roomType.code,
                                                    })),
                                                );
                                            }}
                                        >
                                            <FaRegEdit color="black" size={25} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid border-t items-center">
                        <div className="px-4 py-3 justify-end flex space-x-3 ">
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleCloseDetail} />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={onpenRoom}
                handleClose={handleCloseRoom}
                width="60%"
                height="28%"
                top="35%"
                left="55%"
                smallScreenWidth="75%"
                smallScreenHeight="20%"
                mediumScreenWidth="75%"
                mediumScreenHeight="18%"
                largeScreenHeight="15%"
                largeScreenWidth="75%"
                maxHeightScreenHeight="35%"
                maxHeightScreenWidth="75%"
                heightScreen="26%"
                title={isUpdateRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng'}
            >
                <div className="grid grid-rows-1 gap-2">
                    <div className="grid grid-cols-4 gap-4 p-3">
                        <AutoInputComponent
                            value={isUpdateRoom ? selectedRoom?.name : nameRoom}
                            onChange={setNameRoom}
                            title="Tên phòng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />

                        <div>
                            <h1>Loại phòng</h1>
                            <MultiSelect
                                className="border border-black rounded-md grid "
                                options={optionRoomType}
                                value={selectedOptionRoomType}
                                onChange={setSelectedOptionRoomType}
                                labelledBy="Select"
                                valueRenderer={(selected, _options) => {
                                    if (selected.length === 0) {
                                        return 'Chọn';
                                    } else if (selected.length === _options.length) {
                                        return selected.map((item) => item.label).join(', ');
                                    } else {
                                        return selected.map((item) => item.label).join(', ');
                                    }
                                }}
                                overrideStrings={{
                                    selectSomeItems: 'Chọn',
                                    selectAll: 'Chọn tất cả',
                                    search: 'Tìm kiếm',
                                }}
                            />
                        </div>

                        <AutoInputComponent
                            value={isUpdateRoom ? selectedRoom?.numRows : numRows}
                            onChange={setNumRows}
                            title="Số hàng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />

                        <AutoInputComponent
                            value={isUpdateRoom ? selectedRoom?.numColumns : numColumns}
                            onChange={setNumColumns}
                            title="Số cột"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />
                    </div>

                    <div className="grid items-center  border-t">
                        <div className="justify-end flex space-x-3 pr-4  pt-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseRoom} />
                            <ButtonComponent
                                text={isUpdateRoom ? 'Cập nhật' : 'Thêm mới'}
                                className=" bg-blue-500 "
                                onClick={isUpdateRoom ? () => handleUpdateRoom(selectedRoom?.code) : handleAddRoom}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Cinema;
