import React, { useState } from 'react';
import { FaRegEdit, FaRegEye } from 'react-icons/fa';

import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import ky from 'ky';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from 'axios';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import { getAllSeatByRoomCode, getRoomCode } from '~/redux/apiRequest';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const Cinema = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isUpdateRoom, setIsUpdateRoom] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openRoom, setOpenRoom] = useState(false);
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
    const [selectedOptionRoomSize, setSelectedOptionRoomSize] = useState([]);
    const [nameRoom, setNameRoom] = useState('');
    const [numRows, setNumRows] = useState('');
    const [numColumns, setNumColumns] = useState('');
    const [selectedRoom, setSelectedRoom] = useState([]);

    const [optionRoomType, setOptionRoomType] = useState([]);
    const [optionRoomSize, setOptionRoomSize] = useState('');

    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');
    const [selectedOptionFilterStatus, setSelectedOptionFilterStatus] = useState('');
    const [inputValue, setInputValue] = useState('');

    const [cinemasFilter, setCinemasFilter] = useState([]);
    const [selectedSort, setSelectedSort] = useState('');
    const optionStatusCinema = [
        { value: 0, name: 'Không hoạt động' },
        { value: 1, name: 'Hoạt động' },
    ];

    const optionsSort = [
        { value: 1, name: 'Tên' },
        { value: 2, name: 'Số lượng phòng' },
        { value: 3, name: 'Trạng thái' },
    ];
    const optionsSortWithIcons = optionsSort.map((option) => ({
        ...option,
        icon: <MdSwapVert />, // Thêm icon vào mỗi tùy chọn
    }));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSearch = (searchValue, type) => {
        if (type === 'name') {
            setSelectedFilterCinema(searchValue);
            setSelectedOptionFilterStatus('');
            setInputValue('');
            setSelectedSort('');
        } else if (type === 'status') {
            setSelectedOptionFilterStatus(searchValue);
            setSelectedFilterCinema('');
            setInputValue('');
            setSelectedSort('');
        }

        if (!searchValue) {
            setCinemasFilter(cinemas); // Nếu không có bộ lọc, hiển thị toàn bộ danh sách
            return;
        }

        const filteredCinemas = cinemas.filter(
            (cinema) =>
                cinema.code === searchValue.code ||
                cinema.status === searchValue.value ||
                cinema.roomsCount === searchValue,
        );

        if (filteredCinemas.length > 0) {
            setCinemasFilter(filteredCinemas); // Cập nhật danh sách rạp đã lọc
        }
    };
    const handleInputChange = (event) => {
        // Lấy giá trị từ input
        const value = event.target.value;
        setSelectedOptionFilterStatus('');
        setSelectedFilterCinema('');
        setSelectedSort('');

        // Cập nhật giá trị state
        setInputValue(value);

        // Chuyển đổi giá trị đã làm sạch thành số
        const roomCount = parseInt(value, 10);

        // Gọi handleSearch ngay cả khi roomCount là 0
        handleSearch(roomCount, 'roomCount');
    };

    const sortCinemas = (option) => {
        if (!option) {
            setCinemasFilter(cinemas);
            return;
        }
        setSelectedSort(option);
        setSelectedFilterCinema('');
        setSelectedOptionFilterStatus('');
        setInputValue('');

        let sortedCinemas = [];

        if (option.value === 1) {
            // Sắp xếp theo tên
            sortedCinemas = [...cinemas].sort((a, b) => a.name.localeCompare(b.name));
        } else if (option.value === 2) {
            // Sắp xếp theo số lượng phòng
            sortedCinemas = [...cinemas].sort((a, b) => a.roomsCount - b.roomsCount);
        } else if (option.value === 3) {
            // Sắp xếp theo trạng thái giảm dần (1 trước, 0 sau)
            sortedCinemas = [...cinemas].sort((a, b) => {
                return b.status - a.status; // Sắp xếp theo thứ tự giảm
            });
        }
        if (sortedCinemas.length > 0) {
            setCinemasFilter(sortedCinemas);
        }
    };

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            const sortedData = data.sort((a, b) => b.code.localeCompare(a.code));

            // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name, // Hiển thị tên
                code: cinema.code, // Giá trị sẽ được gửi về
            }));

            return { cinemas: sortedData, optionNameCinema: arrayNameCinema };
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

    const {
        data: { cinemas = [], optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        refetch,
    } = useQuery('cinemasFullAddress', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        onSuccess: (data) => {
            setCinemasFilter(data.cinemas); // Cập nhật danh sách rạp ban đầu khi fetch thành công
        },
    });

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

    const fetchRoomSizes = async () => {
        try {
            const response = await axios.get('api/room-sizes');
            const data = response.data;

            // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
            const roomSizeOptions = data.map((roomSize) => ({
                name: roomSize.name, // Hiển thị tên
                value: roomSize.code, // Giá trị sẽ được gửi về
            }));

            setOptionRoomSize(roomSizeOptions); // Cập nhật state với options
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

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
        setSelectedOptionRoomSize([]);
        setNumRows('');
        setNumColumns('');
    };

    // action
    const handleAddRoom = async () => {
        let loadingToastId;
        try {
            if (!validateRoom()) return;
            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);

            const selectedOption = optionRoomSize.find((option) => option.name === selectedOptionRoomSize);

            // Dữ liệu gửi đi
            const roomData = {
                name: nameRoom,
                cinemaCode: selectedCinema?.code,
                roomTypeCode: arrayValueRoomType,
                roomSizeCode: selectedOption?.value,
            };

            // Gửi request POST tới server
            const responseRoom = await axios.post('api/rooms', roomData);

            const seatData = {
                roomCode: responseRoom.data?.code,
                roomSizeCode: selectedOption?.value,
            };
            loadingToastId = toast.loading('Vui lòng chờ, đang thêm phòng!');

            const responseSeat = await axios.post('api/products/generateSeat', seatData);

            if (responseSeat.data) {
                clearTextModalRoom();
                toast.dismiss(loadingToastId);
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
            const option = optionRoomSize.find((option) => option.name === selectedRoom?.roomSizeName);

            setSelectedOptionRoomSize(option);
            if (!validateRoom()) return;
            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);
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
        if (nameRoom === '') {
            toast.warning('Vui lòng nhập tên phòng!');
            return false;
        } else if (selectedOptionRoomType.length === 0) {
            toast.warning('Vui lòng chọn loại phòng!');
            return false;
        } else if (selectedOptionRoomSize.length === 0) {
            toast.warning('Vui lòng chọn kích cỡ!');
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
            setNameCinema(selectedCinema?.name);

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
        fetchRoomSizes();
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

    const renderCinemas = (cinemaList) => {
        return cinemaList.map((item, index) => (
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
                            {item.status === 0 ? 'Ngừng hoạt động' : 'Hoạt động'}
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
        ));
    };

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Rạp</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={optionNameCinema}
                        value={selectedOptionFilterCinema}
                        onChange={(newValue) => handleSearch(newValue, 'name')}
                        title="Tên Rạp"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Tất cả"
                        heightSelect={200}
                        borderRadius="10px"
                    />

                    <AutoInputComponent
                        options={optionStatusCinema}
                        value={selectedOptionFilterStatus}
                        onChange={(newValue) => handleSearch(newValue, 'status')}
                        title="Trạng thái"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Tất cả"
                        heightSelect={200}
                        borderRadius="10px"
                    />

                    <div className="">
                        <p className="mb-1">Số lượng phòng</p>
                        <input
                            className="border border-black rounded-[10px] p-1 w-full text-base"
                            type="number"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Nhập số"
                            required
                        />
                    </div>

                    <div className="relative w-full ">
                        <AutoInputComponent
                            value={selectedSort}
                            onChange={(newValue) => sortCinemas(newValue)}
                            options={optionsSortWithIcons}
                            title="Sắp xếp"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Tất cả"
                            heightSelect={200}
                            borderRadius="10px"
                            renderOption={(props, option) => (
                                <div
                                    {...props}
                                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    {option.icon}
                                    <span className="ml-2 text-base font-medium">{option.name}</span>{' '}
                                </div>
                            )}
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
                    {Array.isArray(cinemasFilter) &&
                    cinemasFilter.length > 0 &&
                    (selectedOptionFilterCinema || selectedOptionFilterStatus || inputValue || selectedSort)
                        ? renderCinemas(cinemasFilter)
                        : renderCinemas(cinemas)}
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
                width="60%"
                height="70%"
                smallScreenWidth="70%"
                smallScreenHeight="52%"
                mediumScreenWidth="70%"
                mediumScreenHeight="45%"
                largeScreenHeight="38%"
                largeScreenWidth="70%"
                maxHeightScreenHeight="87%"
                maxHeightScreenWidth="45%"
                title="DANH SÁCH PHÒNG CHIẾU"
            >
                <div className=" h-90p grid grid-rows-12 ">
                    <div className="border-b text-xs font-bold text-slate-500 grid grid-cols-9 items-center gap-2 mx-2">
                        <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                            <h1 className=" grid justify-center col-span-4 items-center   ">Stt</h1>
                            <h1 className="grid justify-center col-span-6 items-center      ">Mã phòng</h1>
                        </div>

                        <div className="uppercase grid justify-center grid-cols-12 col-span-5 gap-2 items-center">
                            <h1 className=" uppercase grid justify-center items-center col-span-4 ">Tên phòng</h1>
                            <h1 className=" uppercase grid justify-center items-center col-span-2   ">Kích cỡ</h1>
                            <h1 className=" uppercase grid justify-center items-center col-span-4   ">Loại phòng</h1>
                            <h1 className=" uppercase grid justify-center items-center col-span-2   ">Số ghế</h1>
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
                                className="border-b text-base font-normal  py-3 text-slate-500 grid grid-cols-9 items-center gap-2 m-2"
                                key={item.code}
                            >
                                <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                                    <h1 className=" grid justify-center col-span-4 items-center   ">{index + 1}</h1>
                                    <h1 className="grid justify-center col-span-6 items-center      ">{item?.code}</h1>
                                </div>

                                <div className=" grid justify-center grid-cols-12 col-span-5 gap-2 items-center">
                                    <h1 className=" grid items-center pl-3 col-span-4">{item?.name}</h1>
                                    <h1 className=" grid items-center pl-3 col-span-2">{item?.roomSizeName}</h1>

                                    <h1 className=" grid justify-center items-center col-span-4">
                                        {item?.roomTypeName}
                                    </h1>
                                    <div
                                        className="flex justify-center items-center col-span-2 cursor-pointer"
                                        onClick={() => {
                                            getAllSeatByRoomCode(dispatch, item.code);

                                            getRoomCode(dispatch, item.code);
                                            handleNavigate('/room');
                                        }}
                                    >
                                        <h1 className="">{item.totalSeats}</h1>

                                        <button className=" ml-2">
                                            <FaRegEye color="black" fontSize={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="uppercase grid justify-center items-center grid-cols-10  col-span-2 gap-2">
                                    <div className="  justify-center items-center grid  col-span-7 ">
                                        <button
                                            className={` uppercase  border px-2 text-white text-xs py-[1px] flex  rounded-[40px] ${
                                                item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                            onClick={() => handleUpdateStatusRoom(item.code, item.status)}
                                        >
                                            {item.status === 0 ? 'Ngừng hoạt động' : 'Hoạt động'}
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
                open={openRoom}
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
                    <div className="grid grid-cols-3 gap-4 p-3">
                        <AutoInputComponent
                            value={isUpdateRoom ? selectedRoom?.name : nameRoom}
                            onChange={setNameRoom}
                            title="Tên phòng"
                            freeSolo={true}
                            disableClearable={true}
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
                            options={optionRoomSize}
                            value={
                                isUpdateRoom && Array.isArray(optionRoomSize) // Kiểm tra xem optionRoomSize có phải là mảng không
                                    ? optionRoomSize.find((option) => option.name === selectedRoom?.roomSizeName) // Tìm option tương ứng
                                    : selectedOptionRoomSize
                            }
                            onChange={setSelectedOptionRoomSize}
                            title="Kích cỡ"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Chọn ..."
                            heightSelect={200}
                            disabled={isUpdateRoom}
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
