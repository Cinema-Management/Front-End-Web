import React, { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdSwapVert } from 'react-icons/md';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';
import { getCinemaCode } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { DatePicker } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

const fetchCinemasFullAddress = async () => {
    try {
        const response = await axios.get('/api/cinemas/getAllFullAddress');

        const data = response.data;

        // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
        const arrayNameCinema = data.map((cinema) => ({
            name: cinema.name, // Hiển thị tên
            code: cinema.code, // Giá trị sẽ được gửi về
        }));

        return { optionNameCinema: arrayNameCinema };
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

const fetchMovies = async () => {
    const movie = await axios.get('api/movies');
    const data = movie.data;

    const arrayNameMovie = data.map((movie) => ({
        name: movie.name, // Hiển thị tên
        code: movie.code, // Giá trị sẽ được gửi về
    }));
    return arrayNameMovie;
};

const fetchAudio = async () => {
    const audio = await axios.get('api/audios');
    const data = audio.data;

    const arrayAudio = data.map((audio) => ({
        name: audio.name, // Hiển thị tên
        code: audio.code, // Giá trị sẽ được gửi về
    }));
    return arrayAudio;
};
const fetchSubtitle = async () => {
    const subtitle = await axios.get('api/subtitles');
    const data = subtitle.data;

    const arraySubtitle = data.map((subtitle) => ({
        name: subtitle.name, // Hiển thị tên
        code: subtitle.code, // Giá trị sẽ được gửi về
    }));
    return arraySubtitle;
};

const Schedule = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [roomsFilter, setRoomsFilter] = useState([]);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const [selectedMovieName, setSelectedMovieName] = useState([]);
    const [selectedFilterMovieName, setSelectedFilterMovieName] = useState([]);
    const [selectedSubtitle, setSelectedSubtitle] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedScreeningFormat, setSelectedScreeningFormat] = useState([]);
    const [optionScreeningFormat, setOptionScreeningFormat] = useState([]);
    const [selectedAudio, setSelectedAudio] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const isDisabledAdd = dayjs(selectedDate).isBefore(dayjs(), 'day');

    const groupAndSortSchedules = (rooms) => {
        return rooms.map((room) => {
            // Sắp xếp các schedule chỉ theo startTime
            const sortedSchedules = room.schedules.sort((a, b) => {
                return new Date(a.startTime) - new Date(b.startTime);
            });

            // Trả về room với danh sách schedule đã được sắp xếp
            return {
                ...room,
                schedules: sortedSchedules,
            };
        });
    };

    const fetchAllScheduleInRoomByCinemaCode = async (cinemaCode, selectedDate) => {
        if (!cinemaCode) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        try {
            const response = await axios.get(
                `api/schedules/getAllRoomsWithSchedules/${cinemaCode}?date=${formattedDate}`,
            );
            const room = response.data;

            return groupAndSortSchedules(room);
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const cleanText = () => {
        setSelectedMovieName([]);
        setSelectedScreeningFormat([]);
        setSelectedAudio([]);
        setSelectedSubtitle([]);
        setSelectedTime();
    };
    // action
    const handleAddSchedule = async () => {
        if (validateSchedule() === false) return; // Kiểm tra dữ liệu nhập vào có hợp lệ không
        if (checkAdd() === false) return;
        if (!selectedRoom) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        // Định dạng thời gian thành ISO string
        const startTime = combinedDateTime.toISOString(); // Định dạng giờ

        const schedule = {
            roomCode: selectedRoom?.code,
            movieCode: selectedMovieName.code,
            screeningFormatCode: selectedScreeningFormat.code,
            date: formattedDate,
            startTime: startTime,
            audioCode: selectedAudio.code,
            subtitleCode: selectedSubtitle.code,
        };

        try {
            const response = await axios.post('api/schedules', schedule);
            if (response.data) {
                toast.success('Thêm suất chiếu thành công');
                refetchRoom();
                cleanText();
                handleClose();
            } else {
                toast.error('Thêm suất chiếu thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };
    const handleUpdateSchedule = async () => {
        if (validateSchedule() === false) return; // Kiểm tra dữ liệu nhập vào có hợp lệ không
        if (checkAdd() === false) return;
        if (!selectedSchedule.code) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        // Định dạng thời gian thành ISO string
        const startTime = combinedDateTime.toISOString(); // Định dạng giờ

        const schedule = {
            code: selectedSchedule?.code,
            // roomCode: selectedRoom?.code,
            movieCode: selectedMovieName.code,
            screeningFormatCode: selectedScreeningFormat.code,
            date: formattedDate,
            startTime: startTime,
            audioCode: selectedAudio.code,
            subtitleCode: selectedSubtitle.code,
        };

        try {
            const response = await axios.put(`api/schedules/${schedule.code}`, schedule);
            if (response.data) {
                toast.success('Cập nhật thành công');
                refetchRoom();
                cleanText();
                handleClose();
            } else {
                toast.error('Cập nhật thất bại thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleDateChange = (date) => {
        toast.success('Chọn ngày thành công: ' + date.format('DD/MM/YYYY'));
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        const now = dayjs(); // Lấy thời gian hiện tại
        const isToday = selectedDate.isSame(now, 'day'); // Kiểm tra nếu là ngày hôm nay

        if (!time) return;

        // Kiểm tra nếu thời gian không hợp lệ (giờ < 9 hoặc giờ trước thời gian hiện tại nếu là hôm nay)
        if (isToday && (time.isBefore(now, 'minute') || time.hour() < 9)) {
            setSelectedTime(null); // Nếu không hợp lệ, đặt thời gian về null
        } else if (!isToday && time.hour() < 9) {
            setSelectedTime(null); // Nếu ngày không phải hôm nay và giờ < 9, đặt lại thời gian về null
        } else {
            setSelectedTime(time); // Nếu hợp lệ, lưu lại thời gian được chọn
        }
    };
    const isTimeDisabled = (current) => {
        const now = dayjs(); // Lấy thời gian hiện tại
        const isToday = selectedDate.isSame(now, 'day'); // Kiểm tra xem có phải ngày hôm nay không

        if (!current) return false; // Tránh lỗi nếu current là null

        if (isToday) {
            // Nếu ngày được chọn là ngày hôm nay, không cho chọn giờ nhỏ hơn giờ hiện tại
            return current.isBefore(now, 'minute') || current.hour() < 9;
        } else {
            // Nếu ngày được chọn là ngày sau hôm nay, chỉ vô hiệu hóa giờ nhỏ hơn 9
            return current.hour() < 9;
        }
    };

    const convertToVietnamTime = (utcDateString) => {
        // Tạo đối tượng Date từ chuỗi UTC
        const utcDate = new Date(utcDateString);

        // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
        const vnTime = new Date(utcDate.getTime());

        // Lấy giờ và phút
        const hours = vnTime.getHours().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
        const minutes = vnTime.getMinutes().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số

        return `${hours}:${minutes}`; // Trả về định dạng "HH:mm"
    };
    const dispatch = useDispatch();

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('cinemasFullAddress1', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const { data: optionMovieName = [] } = useQuery('fetchMovies', fetchMovies, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });
    const { data: optionAudio = [] } = useQuery('fetchAudio', fetchAudio, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });
    const { data: optionSubtitle = [] } = useQuery('fetchSubtitle', fetchSubtitle, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const cinemaCode = useSelector((state) => state.cinema.code?.currentCode);

    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');

    useEffect(() => {
        if (!selectedOptionFilterCinema) {
            const option = optionNameCinema.find((option) => option.code === cinemaCode);
            setSelectedFilterCinema(option?.name);
        }

        if (selectedOptionFilterCinema && selectedOptionFilterCinema.code) {
            getCinemaCode(dispatch, selectedOptionFilterCinema?.code); // Cập nhật cinemaCode qua dispatch
        }
    }, [selectedOptionFilterCinema, cinemaCode, dispatch, optionNameCinema]); // Theo

    const {
        data: room = [],
        isLoading: isLoadingRoom,
        error: errorRoom,
        refetch: refetchRoom,
    } = useQuery(
        ['fetchAllScheduleInRoomByCinemaCode', cinemaCode, selectedDate], // Thêm selectedDate vào phụ thuộc
        () => fetchAllScheduleInRoomByCinemaCode(cinemaCode, selectedDate), // Gọi API với cinemaCode và selectedDate
        {
            staleTime: 1000 * 60 * 3,
            cacheTime: 1000 * 60 * 10,
            enabled: !!cinemaCode && !!selectedDate, // Chỉ fetch khi cinemaCode và selectedDate có giá trị
            onSuccess: (data) => {
                setRoomsFilter(data.room); // Cập nhật danh sách rạp khi fetch thành công
            },
        },
    );

    const validateSchedule = () => {
        if (!selectedTime) {
            toast.warning('Vui lòng chọn giờ chiếu');
            return false;
        }
        if (selectedMovieName.length === 0) {
            toast.warning('Vui lòng chọn phim');
            return false;
        }
        if (selectedScreeningFormat.length === 0) {
            toast.warning('Vui lòng chọn định dạng chiếu');
            return false;
        }
        if (selectedAudio.length === 0) {
            toast.warning('Vui lòng chọn âm thanh');
            return false;
        }
        if (selectedSubtitle.length === 0) {
            toast.warning('Vui lòng chọn phụ đề');
            return false;
        }

        return true;
    };
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const fetchMovieByCode = async () => {
            const movie = await axios.get(`api/movies/${selectedMovieName.code}`);
            setDuration(movie.data.duration);
        };

        if (selectedMovieName) {
            fetchMovieByCode();
        }
    }, [selectedMovieName]); // Only re-run when selectedMovieName changes

    (isLoadingRoom || isLoadingCinemas) && <Loading />;
    (errorRoom || CinemaError) && toast.error('Lỗi: ' + (errorRoom || CinemaError));

    // useEffect(() => {
    //     if (selectedMovieName) {
    //         refetchMovieByCode();
    //     }
    // }, [selectedMovieName]);

    const checkAdd = () => {
        toast.success('Thời lượng phim: ' + duration);
        // const duration = movie?.duration || 0;

        const rooms = room.find((r) => (r.code === isUpdate ? selectedSchedule.roomCode : selectedRoom?.code));
        if (!selectedDate) return false;

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        const startTime1 = combinedDateTime.toISOString(); // Định dạng giờ

        const startTime = new Date(startTime1);

        const endTime = new Date(startTime.getTime() + duration * 60000 + 15 * 60000);

        const schedules = rooms.schedules || []; // Đảm bảo schedules là một mảng
        const conflictingSchedules = schedules.filter((schedule) => {
            return new Date(schedule.startTime) < endTime && new Date(schedule.endTime) > startTime;
        });

        if (conflictingSchedules.length > 0) {
            toast.warning('Lịch trình xung đột với lịch trình hiện có trong phòng này');
            return false;
        }

        for (const room1 of room) {
            const existingSchedules = room1.schedules || []; // Lịch chiếu hiện có trong phòng

            // Kiểm tra xung đột lịch chiếu trong phòng
            const isConflict = existingSchedules.some(
                (schedule) => schedule.movieCode.code === selectedMovieName.code && schedule.startTime === startTime1, // Kiểm tra thời gian bắt đầu
            );

            if (isConflict) {
                toast.warning('Phim này đã có giờ chiếu tại phòng khác');

                return false; // Có xung đột
            }
        }
        return true;
    };

    const handleSearch = (searchValue, type) => {
        if (type === 'name') {
            setSelectedFilterCinema(searchValue);
        } else if (type === 'status') {
        }
    };

    const handleSearchMovie = (searchValue) => {
        // If there's no search value, reset to the full list of rooms
        setSelectedFilterMovieName(searchValue);
        if (!searchValue) {
            setRoomsFilter(room); // Reset to show all rooms
            return;
        }

        // Filter rooms based on the movie name in the schedules
        const filteredRooms = room
            .map((room) => {
                // Lọc lịch chiếu trong từng phòng theo mã phim được chọn
                const filteredSchedules = room.schedules.filter(
                    (schedule) => schedule.movieCode.code === searchValue.code,
                );

                // Trả về phòng với lịch chiếu đã lọc
                return {
                    ...room,
                    schedules: filteredSchedules,
                };
            })
            .filter((room) => room.schedules.length > 0);
        toast.success('Tìm kiếm phim thành công: ' + filteredRooms.length);

        // Update the filtered list of rooms
        if (filteredRooms.length > 0) {
            setRoomsFilter(filteredRooms);
        }
    };

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setOpen(false);
        cleanText();
    };
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [visibleRooms, setVisibleRooms] = useState({});

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
    const optionCV = [
        { value: '0', label: 'Chọn' },
        { value: 'GLX', label: 'Galaxy Quang Trung' },
        { value: 'LT', label: 'Lotte Gò Vấp' },
    ];

    const handleOnChangeOptionMovie = (option) => {
        if (option.code) {
            setSelectedMovieName(option);
        }
    };

    const handleOnChangeOptionSubtitle = (option) => {
        if (option.code) {
            setSelectedSubtitle(option);
        }
    };

    const handleOnChangeOptionAudio = (option) => {
        if (option.code) {
            setSelectedAudio(option);
        }
    };

    const handleOnChangeOptionScreeningFormat = (option) => {
        if (option.code) {
            setSelectedScreeningFormat(option);
        }
    };

    const renderRoomByCinemaCode = (room) => {
        return room.map((item, index) => (
            <div key={item.code}>
                <div className="bg-[#E6E6E6] text-[14px] py-2 font-normal uppercase text-slate-500 grid grid-cols-3 items-center gap-3 mb-2 ">
                    <div className="grid grid-cols-10 items-center gap-5">
                        <div
                            className="justify-center items-center col-span-3 grid"
                            onClick={() => {
                                toggleVisibility(item.id);
                                toggleDropdown(item.id);
                            }}
                        >
                            {isDropdownOpen[item.id] ? (
                                <FaChevronUp color="gray" size={20} />
                            ) : (
                                <FaChevronDown color="gray" size={20} />
                            )}
                        </div>
                        <h1 className="uppercase grid col-span-7">{item.name}</h1>
                    </div>
                    <h1 className="grid justify-center items-center">{item.roomTypeName}</h1>
                    <h1 className="grid justify-center items-center">{item.totalSeats}</h1>
                </div>
                {visibleRooms[item.id] && (
                    <>
                        <div className="border-b py-[2px] text-sm font-bold text-slate-500 grid grid-cols-12 items-center gap-3 mx-2">
                            <div className="uppercase grid col-span-3 grid-cols-10 justify-center items-center  gap-3">
                                <h1 className="uppercase grid col-span-4 justify-center items-center ">
                                    Mã suất chiếu
                                </h1>
                                <h1 className="uppercase grid col-span-6 justify-center items-center ">Thời gian</h1>
                            </div>
                            <div className="uppercase grid col-span-6  grid-cols-12 justify-center items-center ">
                                {' '}
                                <h1 className="uppercase grid col-span-9 justify-center items-center ">Phim</h1>
                                <h1 className="uppercase grid col-span-3 justify-center items-center ">
                                    Định dạng chiếu
                                </h1>
                            </div>
                            <h1 className="uppercase grid justify-center col-span-2 items-center ">Trạng thái</h1>
                            <div className="grid justify-center col-span-1 ">
                                <button
                                    className={`border px-4 py-1 rounded-[40px] ${
                                        !isDisabledAdd ? ' bg-orange-400' : 'bg-gray-200'
                                    } `}
                                    onClick={() => {
                                        if (!isDisabledAdd) {
                                            handleOpen(false);
                                            setSelectedRoom(item);
                                            setOptionScreeningFormat(item.roomTypeCode);
                                        }
                                    }}
                                    disabled={isDisabledAdd} // Disable nếu selectedDate nhỏ hơn ngày hiện tại
                                >
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                        {/* list schedules in room */}
                        <div className="height-sm-1">
                            {item.schedules &&
                                item.schedules.map((item) => (
                                    <div
                                        className="border-b py-[6px] text-base font-normal text-slate-500 grid grid-cols-12 items-center gap-3"
                                        key={item.code}
                                    >
                                        <div className=" grid col-span-3 grid-cols-10  justify-center items-center ">
                                            <h1 className=" grid col-span-4 justify-center items-center ">
                                                {item.code}
                                            </h1>

                                            <h1 className=" grid col-span-6 justify-center items-center ">
                                                {convertToVietnamTime(item.startTime)} -{' '}
                                                {convertToVietnamTime(item.endTime)}
                                            </h1>
                                        </div>
                                        <div className=" grid col-span-6 grid-cols-12 items-center justify-center   gap-3">
                                            <h1 className=" grid col-span-9  items-center  ">{item.movieCode.name}</h1>

                                            <h1 className=" uppercase grid col-span-3  items-center justify-center ">
                                                {item.screeningFormatCode.name}{' '}
                                                {item.subtitleCode.name
                                                    ? 'Phụ đề ' + item.subtitleCode.name.split(' ')[0]
                                                    : ''}
                                                {item.audioCode.name === 'Gốc' ? '' : ' ' + item.audioCode.name}
                                            </h1>
                                        </div>
                                        <div className="justify-center  col-span-2  items-center grid ">
                                            <button
                                                className={`uppercase border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                                    item.status === 0 ? 'bg-gray-400' : 'bg-green-500'
                                                }`}
                                            >
                                                {item.status === 0 ? 'Sắp chiếu' : 'Đang chiếu'}
                                            </button>
                                        </div>
                                        <div className="justify-center space-x-5 items-center col-span-1 flex ">
                                            <button
                                                className=""
                                                onClick={() => {
                                                    if (!isDisabledAdd) {
                                                        handleOpen(true);
                                                        setSelectedSchedule(item);
                                                        setSelectedTime(dayjs(item.startTime));
                                                        setSelectedMovieName(item.movieCode);
                                                        setSelectedAudio(item.audioCode);
                                                        setSelectedSubtitle(item.subtitleCode);
                                                        setSelectedScreeningFormat(item.screeningFormatCode);
                                                    }
                                                }}
                                                disabled={isDisabledAdd}
                                            >
                                                <FaRegEdit
                                                    color={` ${!isDisabledAdd ? 'black' : 'bg-gray-200'}  `}
                                                    size={20}
                                                />
                                            </button>
                                            <button className="">
                                                <FaRegEye color="black" fontSize={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}
            </div>
        ));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="max-h-screen">
                <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                    <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Suất chiếu</h1>
                    <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                        <AutoInputComponent
                            options={optionNameCinema}
                            value={selectedOptionFilterCinema}
                            onChange={(newValue) => handleSearch(newValue, 'name')}
                            title="Tên rạp"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Tất cả"
                            heightSelect={200}
                            borderRadius="10px"
                        />

                        <AutoInputComponent
                            options={optionMovieName}
                            value={selectedFilterMovieName}
                            onChange={(newValue) => handleSearchMovie(newValue)}
                            title="Tên phim"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Tất cả"
                            heightSelect={200}
                            borderRadius={'10px'}
                        />
                        <div>
                            <h1 className="text-[16px] truncate mb-1">Ngày chiếu</h1>
                            <DatePicker
                                onChange={handleDateChange}
                                value={selectedDate}
                                allowClear={false} // Không cho phép xóa
                                placeholder="Chọn ngày"
                                format="DD/MM/YYYY"
                                className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                            />
                        </div>
                        <div className="relative w-full ">
                            <MdSwapVert className="absolute bottom-[10px] left-2" />
                            <SelectComponent
                                value={selectedValue}
                                onChange={handleChange}
                                options={optionCV}
                                title="Sắp xếp"
                                className="pl-3"
                                selectStyles={{ borderRadius: '10px' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white border  shadow-md rounded-[10px] box-border  h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                    <div className="bg-[#eeaf56] text-[13px] text-white py-2 font-semibold grid grid-cols-3 items-center gap-3 ">
                        <h1 className="uppercase grid justify-center items-center">Phòng</h1>
                        <h1 className="uppercase grid  justify-center items-center">Loại phòng</h1>
                        <h1 className="uppercase grid justify-center items-center">Số lượng ghế</h1>
                    </div>
                    <div className="overflow-auto h-[92%] height-sm-1 ">
                        {Array.isArray(roomsFilter) && roomsFilter.length > 0
                            ? renderRoomByCinemaCode(roomsFilter)
                            : renderRoomByCinemaCode(room)}
                    </div>
                </div>
                <ModalComponent
                    open={open}
                    handleClose={handleClose}
                    width="55%"
                    height="48%"
                    top="35%"
                    left="55%"
                    smallScreenWidth="75%"
                    smallScreenHeight="35%"
                    mediumScreenWidth="75%"
                    mediumScreenHeight="30%"
                    largeScreenWidth="75%"
                    largeScreenHeight="27%"
                    maxHeightScreenHeight="59%"
                    maxHeightScreenWidth="75%"
                    heightScreen="44%"
                    title={isUpdate ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu'}
                    room={selectedRoom?.name}
                    date={selectedDate.format('DD/MM/YYYY')}
                >
                    <div className="grid   ">
                        <div className="grid grid-cols-2 gap-16 p-2  ">
                            <TimePicker
                                label="Chọn giờ"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                minTime={selectedDate.hour(9).minute(0).second(0)}
                                ampm={false} // Vô hiệu hóa AM/PM
                                shouldDisableTime={isTimeDisabled}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{
                                            width: '100px', // Set width
                                            '& .MuiInputBase-root': {
                                                height: '40px', // Set height of the outer container
                                            },
                                            '& input': {
                                                height: '40px', // Set the height of the input inside
                                                padding: 0, // Remove extra padding if needed
                                            },
                                        }}
                                    />
                                )}
                            />
                            <AutoInputComponent
                                options={optionMovieName}
                                value={selectedMovieName}
                                onChange={handleOnChangeOptionMovie}
                                title="Tên phim"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Chọn"
                                heightSelect={200}
                                borderRadius={'10px'}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-16 p-2  ">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="online"
                                    name="status"
                                    value="Online"
                                    className="p-20 h-10"
                                    style={{ width: '20px', height: '20px' }}
                                    defaultChecked
                                />
                                <label htmlFor="online" className="text-[16px] ml-3 ">
                                    Tất cả suất chiếu còn lại trong ngày
                                </label>
                            </div>
                            <AutoInputComponent
                                value={selectedAudio}
                                onChange={handleOnChangeOptionAudio}
                                title="Âm thanh"
                                placeholder="Chọn"
                                options={optionAudio}
                                freeSolo={false}
                                disableClearable={true}
                                className="grid  "
                            />
                        </div>

                        <div className="grid ">
                            <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-16 p-2">
                                    <AutoInputComponent
                                        value={selectedScreeningFormat}
                                        onChange={handleOnChangeOptionScreeningFormat}
                                        title="Dạng chiếu"
                                        placeholder="Chọn"
                                        options={optionScreeningFormat}
                                        freeSolo={false}
                                        disableClearable={true}
                                        className="grid  "
                                        borderRadius={'10px'}
                                    />
                                    <AutoInputComponent
                                        value={selectedSubtitle}
                                        onChange={handleOnChangeOptionSubtitle}
                                        title="Phụ đề"
                                        placeholder="Chọn"
                                        options={optionSubtitle}
                                        freeSolo={false}
                                        disableClearable={true}
                                        className="grid "
                                        borderRadius={'10px'}
                                    />
                                </div>
                                <div className="justify-end flex space-x-3 border-t pt-4 pr-4">
                                    <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                    <ButtonComponent
                                        text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                        className=" bg-blue-500 "
                                        onClick={() => (isUpdate ? handleUpdateSchedule() : handleAddSchedule())}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalComponent>
            </div>
        </LocalizationProvider>
    );
};

export default Schedule;
