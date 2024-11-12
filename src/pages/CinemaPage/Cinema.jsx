import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegEye } from 'react-icons/fa';

import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineDeleteOutline, MdSwapVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import ky from 'ky';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import axios from 'axios';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';
import { getRoom } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const Cinema = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [isUpdateRoom, setIsUpdateRoom] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openRoom, setOpenRoom] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [nameCinema, setNameCinema] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [selectedCinema, setSelectedCinema] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedOptionRoomType, setSelectedOptionRoomType] = useState([]);
    const [selectedOptionRoomSize, setSelectedOptionRoomSize] = useState('');
    const [nameRoom, setNameRoom] = useState('');
    const [selectedRoom, setSelectedRoom] = useState([]);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');
    const [selectedOptionFilterStatus, setSelectedOptionFilterStatus] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [cinemasFilter, setCinemasFilter] = useState([]);
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedStatusCinema, setSelectedStatusCinema] = useState('');
    const [selectedStatusRoom, setSelectedStatusRoom] = useState('');
    const queryClient = useQueryClient();
    const [addCinema, setAddCinema] = useState(0);
    const [addRoom, setAddRoom] = useState(0);

    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleteCinema, setIsDeleteCinema] = useState(false);
    const [wardData, setWardData] = useState([]);

    const optionStatusCinema = [
        { value: 0, name: 'Ngưng hoạt động' },
        { value: 1, name: 'Hoạt động' },
    ];

    const optionStatusRoom = [
        { value: 0, name: 'Ngưng hoạt động' },
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
            sortedCinemas = [...cinemas].sort((a, b) => a.name.localeCompare(b.name));
        } else if (option.value === 2) {
            sortedCinemas = [...cinemas].sort((a, b) => a.roomsCount - b.roomsCount);
        } else if (option.value === 3) {
            sortedCinemas = [...cinemas].sort((a, b) => {
                return b.status - a.status;
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

            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name,
                code: cinema.code,
            }));

            return { cinemas: sortedData, optionNameCinema: arrayNameCinema };
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

    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('api/room-types');
            const data = response.data;
            const optionRomTypes = data.map((roomType) => ({
                label: roomType.name,
                value: roomType.code,
            }));

            return optionRomTypes;
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

    const fetchRoomSizes = async () => {
        try {
            const response = await axios.get('api/room-sizes');
            const data = response.data;

            const optionRomSize = data.map((roomSize) => ({
                name: roomSize.name,
                value: roomSize.code,
            }));

            return optionRomSize;
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

    const clearTextModalCinema = () => {
        setNameCinema('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setAddressDetail('');
        setSelectedStatusCinema('');
    };

    const clearTextModalRoom = () => {
        setNameRoom('');
        setSelectedOptionRoomType([]);
        setSelectedOptionRoomSize('');
        setSelectedStatusRoom('');
    };

    const handleAddRoom = async () => {
        let loadingToastId;
        try {
            if (!validateRoom()) return;
            loadingToastId = toast.loading('Đang tạo phòng!');
            setAddRoom(1);
            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);

            const roomSizeCode = optionRoomSizes.find((option) => option.name === selectedOptionRoomSize)?.value;

            const roomData = {
                name: nameRoom,
                cinemaCode: selectedCinema?.code,
                roomTypeCode: arrayValueRoomType,
                roomSizeCode: roomSizeCode,
            };

            const responseRoom = await axios.post('api/rooms', roomData);

            const seatData = {
                roomCode: responseRoom.data?.code,
                roomSizeCode: roomSizeCode,
            };

            const responseSeat = await axios.post('api/products/generateSeat', seatData);

            if (responseSeat.data) {
                clearTextModalRoom();
                toast.dismiss(loadingToastId);
                toast.success('Thêm phòng thành công!');
                handleCloseRoom();
                getRoomByCinemaCode(selectedCinema?.code);
            }
        } catch (err) {
            toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateRoom = async () => {
        let loadingToastId;

        try {
            const roomSizeCode = optionRoomSizes.find((option) => option.name === selectedOptionRoomSize)?.value;
            const status = optionStatusRoom.find((option) => option.name === selectedStatusRoom).value;

            const check = await axios.get(`api/schedules/checkRoomHasSchedules/${selectedRoom?.code}`);
            if (check.data.hasSchedules === true && status === 0) {
                toast.warning('Phòng đang có lịch chiếu không thể ngưng hoạt động!');
                return;
            }

            if (!validateRoom()) return;
            setAddRoom(1);
            loadingToastId = toast.loading('Đang cập nhật!');

            const arrayValueRoomType = selectedOptionRoomType.map((item) => item.value);
            // Dữ liệu gửi đi
            const roomData = {
                code: selectedRoom?.code,
                name: nameRoom,
                cinemaCode: selectedCinema?.code,
                roomTypeCode: arrayValueRoomType,
                roomSizeCode: roomSizeCode,
                status: status,
            };

            // Gửi request POST tới server
            const response = await axios.put('api/rooms', roomData);

            if (response.data) {
                if (response.data.roomSizeCode !== selectedRoom?.roomSizeCode.code) {
                    await axios.delete(`api/products/deleteSeatByRoomCode/${selectedRoom?.code}`);

                    const seatData = {
                        roomCode: selectedRoom?.code,
                        roomSizeCode: roomSizeCode,
                    };

                    await axios.post('api/products/generateSeat', seatData);
                }

                clearTextModalRoom();
                toast.dismiss(loadingToastId);
                toast.success('Cập nhật phòng thành công!');
                handleCloseRoom();
                getRoomByCinemaCode(selectedCinema?.code);
            } else {
                toast.dismiss(loadingToastId);

                toast.warning('Thêm thất bại!');
            }
        } catch (err) {
            toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const validateCinema = () => {
        if (!nameCinema) {
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
        }
        return true;
    };

    const validateRoom = () => {
        if (!nameRoom) {
            toast.warning('Vui lòng nhập tên phòng!');
            return false;
        } else if (selectedOptionRoomType.length === 0) {
            toast.warning('Vui lòng chọn loại phòng!');
            return false;
        } else if (!selectedOptionRoomSize) {
            toast.warning('Vui lòng chọn kích cỡ!');
            return false;
        } else return true;
    };

    const handleAddCinema = async () => {
        try {
            let loadingId;
            if (!validateCinema()) return;
            loadingId = toast.loading('Đang tạo rạp');
            const hierarchyValues = [
                { name: selectedProvince, level: 0 },
                { name: selectedDistrict, parentCode: '', level: 1 },
                { name: selectedWard, parentCode: '', level: 2 },
                { name: addressDetail, parentCode: '', level: 3 },
            ];
            setAddCinema(1);

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

            const responseCinema = await axios.post('api/cinemas', cinema);
            if (responseCinema.data) {
                toast.dismiss(loadingId);
                toast.success('Thêm rạp thành công!');
                refetch();
                handleCloseCinema();
            } else {
                toast.dismiss(loadingId);

                toast.warning('Thêm thất bại!');
                setAddCinema(0);
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateCinema = async () => {
        try {
            let loadingId;

            const status = optionStatusCinema.find((option) => option.name === selectedStatusCinema).value;
            if (rooms.some((room) => room.status === 1) && status === 0) {
                toast.warning('Các phòng đang hoạt động không thể ngùng hoạt động !');
                return;
            }

            if (!validateCinema()) return;
            const hierarchyValues = [
                { name: selectedProvince, level: 0 },
                { name: selectedDistrict, parentCode: '', level: 1 },
                { name: selectedWard, parentCode: '', level: 2 },
                { name: addressDetail, parentCode: '', level: 3 },
            ];

            let parentCode = '';
            setAddCinema(1);
            loadingId = toast.loading('Đang cập nhật');

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
                code: selectedCinema?.code,
                name: nameCinema,
                hierarchyValueCode: parentCode,
                status: status,
            };

            const result = await axios.put('api/cinemas', cinema);

            if (result.data) {
                toast.dismiss(loadingId);
                toast.success('Cập nhật rạp thành công!');

                clearTextModalCinema();
                refetch();
                handleCloseCinema();
            } else {
                toast.dismiss(loadingId);
                toast.warning('Cập nhật thất bại!');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteCinema = async (code) => {
        try {
            handleCloseDelete();
            await axios.delete(`api/cinemas/${code}`);
            toast.success('Xóa thành công!');

            refetch();
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
    };

    const handleDeleteRoom = async (code) => {
        try {
            handleCloseDelete();

            await axios.delete(`api/rooms/${code}`);
            await axios.delete(`api/products/deleteSeatByRoomCode/${code}`);
            toast.success('Xóa thành công!');
            getRoomByCinemaCode(selectedCinema?.code);
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
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

    const getRoomByCinemaCode1 = async (cinemaCode) => {
        if (!cinemaCode) return; // Nếu cinemaCode rỗng thì không gọi API

        try {
            const response = await axios.get(`api/rooms/${cinemaCode}`);
            if (response.data) {
                setRooms(response.data);
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const mutationUpdateCinema = useMutation(handleUpdateCinema, {
        onSuccess: () => {
            // Sau khi mutation thành công, refetch lại dữ liệu
            queryClient.refetchQueries('optionCinemaSchedules');
        },
    });

    const mutationAddCinema = useMutation(handleAddCinema, {
        onSuccess: () => {
            // Sau khi mutation thành công, refetch lại dữ liệu
            queryClient.refetchQueries('optionCinemaSchedules');
        },
    });

    const mutationUpdateRoom = useMutation(handleUpdateRoom, {
        onSuccess: () => {
            // Sau khi mutation thành công, refetch lại dữ liệu
            queryClient.refetchQueries('fetchAllScheduleInRoomByCinemaCodeOrder');
        },
    });

    const mutationAddRoom = useMutation(handleAddRoom, {
        onSuccess: () => {
            // Sau khi mutation thành công, refetch lại dữ liệu
            queryClient.refetchQueries('fetchAllScheduleInRoomByCinemaCodeOrder');
        },
    });

    const {
        data: { cinemas = [], optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
        isRefetching: isRefetchingCinemas,
        refetch,
    } = useQuery(['cinemasFullAddress', user], fetchCinemasFullAddress, {
        enabled: !!user,
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 3,
        onSuccess: (data) => {
            setCinemasFilter(data.cinemas);
        },
    });

    const {
        data: optionRoomTypes = [],
        isLoading: isLoadingRoomType,
        error: errorRoomType,
    } = useQuery('fetchRoomTypes', fetchRoomTypes, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 3,
    });

    const {
        data: optionRoomSizes = [],
        isLoading: isLoadingRoomSize,
        error: errorRoomSize,
    } = useQuery('fetchRoomSizes', fetchRoomSizes, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 3,
    });
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

    // Hàm fetch wards theo district code

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

    // const {
    //     data: wards = [],
    //     isLoading: isLoadingWards,
    //     error: wardsError,
    // } = useQuery(
    //     ['wards', selectedDistrict],
    //     () => fetchWards(getDistrictsCodeByName(selectedDistrict)), // Sử dụng hàm fetchWards
    //     {
    //         enabled: !!selectedDistrict,
    //         staleTime: 1000 * 60 * 10,
    //         cacheTime: 1000 * 60 * 10,
    //         refetchInterval: 1000 * 60 * 10,
    //     },
    // );
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

    if (
        isLoadingCinemas ||
        isLoadingProvinces ||
        isLoadingRoomSize ||
        isLoadingRoomType ||
        isLoadingDistricts ||
        isRefetchingCinemas
    ) {
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
    if (districtsError) {
        return <div>Lỗi khi tải quận/huyện: {districtsError.message}</div>;
    }

    if (errorRoomType) {
        return <div>Lỗi khi tải loại phòng: {errorRoomType.message}</div>;
    }
    if (errorRoomSize) {
        return <div>Lỗi khi tải kích cỡ phòng: {errorRoomSize.message}</div>;
    }

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

    // const fetchWards = async () => {
    //     if(selectedDistrict){
    //         const districtCode = getDistrictsCodeByName(selectedDistrict);
    //         const response = await ky.get(`api/locations/wards/${districtCode}`).json();
    //         setWardData(response);
    //     }
    //     return;

    // };

    const handleWardChange = (value) => {
        setSelectedWard(value);

        if (value !== addressDetail) {
            setAddressDetail('');
        }
    };

    const handleOpenRoom = (isUpdateRoom) => {
        setOpenRoom(true);
        setIsUpdateRoom(isUpdateRoom);
        setOpenDetail(false);
    };
    const handleCloseRoom = () => {
        setAddRoom(0);

        setOpenRoom(false);
        clearTextModalRoom();

        setOpenDetail(true);
    };

    const handleOpenCinema = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleCloseCinema = () => {
        clearTextModalCinema();
        setAddCinema(0);
        setOpen(false);
    };

    const handOpenDetail = () => setOpenDetail(true);
    const handleCloseDetail = () => {
        setOpenDetail(false);
        refetch();
    };

    const handleOpenDelete = (value) => {
        setOpenDelete(true);
        setIsDeleteCinema(value);
    };

    const handleCloseDelete = () => {
        if (isDeleteCinema) {
            setSelectedCinema('');
        }
        setSelectedRoom('');
        setOpenDelete(false);
        setIsDeleteCinema(false);
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
                            className={`uppercase border px-2 text-white text-[13px] py-[1px] flex cursor-default  rounded-[40px] ${
                                item.status === 0 ? 'bg-gray-400' : item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                        >
                            {item.status === 0 ? 'Ngưng hoạt động' : 'Hoạt động'}
                        </button>
                    </div>
                    <div className={` grid justify-center col-span-3 grid-cols-2 items-center `}>
                        <button
                            className=" grid "
                            onClick={() => {
                                handleOpenCinema(true);
                                getRoomByCinemaCode1(item.code);
                                setSelectedCinema(item);
                                getAddress(item.code);
                                setNameCinema(item.name);
                                setSelectedStatusCinema(item.status === 1 ? 'Hoạt động' : 'Ngưng hoạt động');
                            }}
                        >
                            <FaRegEdit color="black" size={20} />
                        </button>

                        <button
                            className={`grid  ${
                                item.status !== 0 || item.roomsCount > 0 ? 'pointer-events-none opacity-50' : ''
                            }`}
                            onClick={() => {
                                handleOpenDelete(true);
                                setSelectedCinema(item);
                            }}
                        >
                            <MdOutlineDeleteOutline color="black" fontSize={20} />
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white border overflow-x-auto overflow-y-hidden  xl:overflow-hidden shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Rạp</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3 min-w-[900px]">
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
                            className="border pl-3 border-black rounded-[10px] p-1 w-full text-base"
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
            <div className="bg-white border  shadow-md rounded-[10px] box-border  py-2 h-[515px] max-h-screen custom-height-sm custom-height-md custom-hubmax custom-height-lg custom-height-xl">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="border-b text-sm font-bold text-slate-500 grid grid-cols-12 items-center gap-2 min-w-[1200px] ">
                        <div className="uppercase grid justify-center grid-cols-10 col-span-2 gap-2 items-center">
                            <h1 className=" grid justify-center col-span-3 items-center">Stt</h1>
                            <h1 className="grid justify-center col-span-7 items-center  ">Mã Rạp</h1>
                        </div>

                        <div className="uppercase grid justify-center grid-cols-10 col-span-7 gap-4 items-center">
                            <h1 className="grid justify-center col-span-3 items-center">Tên rạp</h1>
                            <h1 className="grid justify-center col-span-5 items-center m-4 ">Địa chỉ</h1>
                            <h1 className="grid justify-center col-span-2 items-center ">Số lượng phòng</h1>
                        </div>
                        <div className="uppercase grid justify-center grid-cols-10 col-span-3 gap-2 items-center">
                            <h1 className="grid justify-center col-span-7 items-center">Trạng thái</h1>

                            <div
                                className="flex justify-center col-span-3   "
                                onClick={() => {
                                    handleOpenCinema(false);
                                    setSelectedStatusCinema('Ngưng hoạt động');
                                }}
                            >
                                <button className="border px-4 py-1 rounded-[40px] gradient-button">
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-auto h-90p height-sm-1 min-w-[1200px]">
                        {Array.isArray(cinemasFilter) &&
                        cinemasFilter.length > 0 &&
                        (selectedOptionFilterCinema || selectedOptionFilterStatus || inputValue || selectedSort)
                            ? renderCinemas(cinemasFilter)
                            : renderCinemas(cinemas)}
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleCloseCinema}
                width="30%"
                height="75%"
                smallScreenWidth="50%"
                smallScreenHeight="54%"
                mediumScreenWidth="50%"
                mediumScreenHeight="47%"
                largeScreenHeight="40%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="92%"
                maxHeightScreenWidth="45%"
                heightScreen="70%"
                title={isUpdate ? 'Chỉnh sửa rạp' : 'Thêm rạp'}
            >
                <div className=" grid grid-rows-8 gap-3 mx-3 ">
                    <div className="grid ">
                        <AutoInputComponent
                            value={nameCinema}
                            onChange={setNameCinema}
                            title="Tên rạp"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>

                    <div className="grid ">
                        <AutoInputComponent
                            options={provinces.map((province) => province.province_name)} // Lấy danh sách tỉnh
                            value={selectedProvince}
                            onChange={handleProvinceChange} // Thay đổi hàm xử lý cho tỉnh
                            title="Tỉnh/thành phố"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>

                    <div className="grid ">
                        <AutoInputComponent
                            options={districts.map((district) => district.district_name)} // Lấy danh sách quận
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
                    <div className="grid ">
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
                    </div>

                    <div className="grid  ">
                        <AutoInputComponent
                            value={addressDetail}
                            onChange={setAddressDetail}
                            title="Địa chỉ chi tiết"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={150}
                        />
                    </div>

                    <div className="grid  ">
                        <AutoInputComponent
                            value={selectedStatusCinema}
                            onChange={setSelectedStatusCinema}
                            options={optionStatusCinema.map((item) => item.name)}
                            freeSolo={false}
                            disableClearable={true}
                            title="Trạng thái"
                            placeholder="Chọn"
                            heightSelect={150}
                            disabled={!isUpdate}
                        />
                    </div>

                    <div className="flex justify-end  space-x-2 border-t pt-2">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseCinema} />
                        <ButtonComponent
                            text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                            className={` bg-blue-500 ${addCinema === 1 ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={isUpdate ? () => mutationUpdateCinema.mutate() : () => mutationAddCinema.mutate()}
                        />
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="65%"
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
                                        setSelectedStatusRoom('Ngưng hoạt động');
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
                                            const newItem = {
                                                ...item,
                                                nameCinema: selectedCinema?.name,
                                            };

                                            getRoom(dispatch, navigate, newItem);
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
                                            className={` uppercase  border px-2 text-white text-xs py-[1px] flex cursor-default  rounded-[40px] ${
                                                item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                        >
                                            {item.status === 0 ? 'Ngưng hoạt động' : 'Hoạt động'}
                                        </button>
                                    </div>

                                    <div className="grid justify-around items-center   col-span-3 grid-cols-2 ">
                                        <button
                                            className="grid "
                                            onClick={() => {
                                                handleOpenRoom(true);
                                                setSelectedRoom(item);
                                                setNameRoom(item.name);
                                                setSelectedOptionRoomSize(item.roomSizeCode.name);

                                                setSelectedStatusRoom(
                                                    item?.status === 0 ? 'Ngưng hoạt động' : 'Hoạt động',
                                                );

                                                setSelectedOptionRoomType(
                                                    item.roomTypeCode.map((roomType) => ({
                                                        label: roomType.name,
                                                        value: roomType.code,
                                                    })),
                                                );
                                            }}
                                        >
                                            <FaRegEdit color="black" size={20} />
                                        </button>

                                        <button
                                            className={`grid  ${
                                                item.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                            }`}
                                            onClick={() => {
                                                handleOpenDelete(false);
                                                setSelectedRoom(item);
                                            }}
                                        >
                                            <MdOutlineDeleteOutline color="black" fontSize={20} />
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
                    <div className="grid grid-cols-4 gap-4 p-3">
                        <AutoInputComponent
                            value={nameRoom}
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
                                options={optionRoomTypes}
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
                            options={optionRoomSizes.map((option) => option.name)}
                            value={selectedOptionRoomSize}
                            onChange={setSelectedOptionRoomSize}
                            title="Kích cỡ"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Chọn ..."
                            heightSelect={200}
                            disabled={isUpdateRoom && selectedRoom?.status !== 0}
                        />

                        <AutoInputComponent
                            value={selectedStatusRoom}
                            onChange={setSelectedStatusRoom}
                            options={optionStatusRoom.map((item) => item.name)}
                            freeSolo={false}
                            disableClearable={true}
                            title="Trạng thái"
                            placeholder="Chọn"
                            heightSelect={150}
                            disabled={!isUpdateRoom}
                        />
                    </div>

                    <div className="grid items-center  border-t">
                        <div className="justify-end flex space-x-3 pr-4  pt-4">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseRoom} />
                            <ButtonComponent
                                text={isUpdateRoom ? 'Cập nhật' : 'Thêm mới'}
                                className={`bg-blue-500 ${addRoom === 1 ? 'pointer-events-none opacity-50' : ''}`}
                                onClick={
                                    isUpdateRoom ? () => mutationUpdateRoom.mutate() : () => mutationAddRoom.mutate()
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
                height="auto"
                smallScreenWidth="40%"
                smallScreenHeight="auto"
                mediumScreenWidth="40%"
                mediumScreenHeight="auto"
                largeScreenHeight="auto"
                largeScreenWidth="40%"
                maxHeightScreenHeight="auto"
                maxHeightScreenWidth="auto"
                title={isDeleteCinema ? 'Xóa Rạp' : 'Xóa Phòng'}
            >
                <div className=" grid grid-rows-2 ">
                    <h1 className="grid row-span-1 p-3 ">Bạn có chắc chắn muốn xóa không?</h1>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t p-3 pr-4  ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xóa"
                                className="bg-blue-500"
                                onClick={() =>
                                    isDeleteCinema
                                        ? handleDeleteCinema(selectedCinema?.code)
                                        : handleDeleteRoom(selectedRoom?.code)
                                }
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Cinema;
