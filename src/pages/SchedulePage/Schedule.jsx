import React, { useEffect, useMemo, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker, TimePicker } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const Schedule = () => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [roomsFilter, setRoomsFilter] = useState([]);
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const [selectedMovieName, setSelectedMovieName] = useState();
    const [selectedFilterMovieName, setSelectedFilterMovieName] = useState('');
    const [selectedSubtitle, setSelectedSubtitle] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedScreeningFormat, setSelectedScreeningFormat] = useState('');
    const [optionScreeningFormat, setOptionScreeningFormat] = useState([]);
    const [selectedAudio, setSelectedAudio] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const queryClient = useQueryClient();
    const [visibleRooms, setVisibleRooms] = useState({});

    const [showAllSchedules, setShowAllSchedules] = useState(false);
    const [availableSchedules, setAvailableSchedules] = useState([]);

    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const isDisabledAdd = dayjs(selectedDate).isBefore(dayjs(), 'day');
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [isUpdateStatus, setIsUpdateStatus] = useState(false);

    const [isDeleteAll, setIsDeleteAll] = useState(false);
    const formattedDate = useMemo(() => selectedDate.format('YYYY-MM-DD'), [selectedDate]);
    let toastAdd = 0;

    const disabledTime = () => {
        const now = dayjs();
        const isToday = selectedDate.isSame(now, 'day');

        return {
            // Vô hiệu hóa giờ trước 9:00 sáng, và nếu là hôm nay thì vô hiệu hóa giờ trước giờ hiện tại
            disabledHours: () => {
                if (isToday) {
                    const currentHour = now.hour();
                    return Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < 9 || hour < currentHour);
                }
                return Array.from({ length: 9 }, (_, i) => i); // Vô hiệu hóa giờ trước 9:00 nếu không phải hôm nay
            },
            // Vô hiệu hóa phút nếu giờ được chọn là giờ hiện tại
            disabledMinutes: (selectedHour) => {
                if (isToday && selectedHour === now.hour()) {
                    return Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < now.minute());
                }
                return [];
            },
        };
    };

    // Hàm để vô hiệu hóa phút

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setShowAllSchedules(checked); // Update the checkbox state

        // Get available schedules based on the current checkbox state
        const { availableSchedules } = getAvailableSchedules(checked); //
        setAvailableSchedules(availableSchedules || []); // Update the state with available schedules
        if (availableSchedules.length === 0 && checked) {
            if (toastAdd === 1) {
                toast.info('Phải trước ngày phát hành phim tối đa 3 ngày!');
            } else {
                toast.info('Phòng này đã hết suất chiếu !');
            }
        }
    };

    const handleDeleteSchedule = (id) => {
        const updatedSchedules = availableSchedules.filter((schedule) => schedule._id !== id);
        setAvailableSchedules(updatedSchedules);
    };

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

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('api/cinemas/getAllFullAddress');

            const data = response.data;

            const arrayNameCinema = data
                .filter((item) => item.status === 1)
                .map((cinema) => ({
                    name: cinema.name,
                    code: cinema.code,
                }));
                console.log('tt');
            setSelectedFilterCinema(arrayNameCinema[0]?.name);
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

    const fetchMoviesStatus = async () => {
        try {
            const response = await axios.get('api/movies');
            const movies = response.data;

            const filteredMovies = movies.filter((movie) => movie.status === 1);
            const arrayNameMovie = filteredMovies.map((movie) => ({
                name: movie.name,
                code: movie.code,
            }));

            return arrayNameMovie;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    };

    const fetchAudio = async () => {
        const audio = await axios.get('api/audios');
        const data = audio.data;

        const arrayAudio = data.map((audio) => ({
            name: audio.name,
            code: audio.code,
        }));
        return arrayAudio;
    };
    const fetchSubtitle = async () => {
        const subtitle = await axios.get('api/subtitles');
        const data = subtitle.data;

        const arraySubtitle = data.map((subtitle) => ({
            name: subtitle.name,
            code: subtitle.code,
        }));
        return arraySubtitle;
    };

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('optionCinemaSchedules', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: optionMovieName = [],
        isLoading: isLoadingOptionMovieName,
        // isFetching: isFetchingOptionMovieName,
        error: optionCinemaNameError,
    } = useQuery('movies', fetchMoviesStatus, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });
    const { data: optionAudio = [] } = useQuery('fetchAudio', fetchAudio, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });
    const { data: optionSubtitle = [] } = useQuery('fetchSubtitle', fetchSubtitle, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    useEffect(() => {
        if (optionNameCinema.length > 0) {
            const initialValue = optionNameCinema[0].name;
            if (!selectedOptionFilterCinema) {
                setSelectedFilterCinema(initialValue);
            }
        }
    }, [optionNameCinema, selectedOptionFilterCinema]);

    const fetchAllScheduleInRoomByCinemaCode = async (selectedOptionFilterCinema, date) => {
        if (!selectedOptionFilterCinema) return;
        const cinemaCode = optionNameCinema.find((option) => option.name === selectedOptionFilterCinema)?.code;

        try {
            const response = await axios.get(`api/schedules/getAllRoomsWithSchedules/${cinemaCode}?date=${date}`);
            const room = response.data;

            return groupAndSortSchedules(room);
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const {
        data: room = [],
        isLoading: isLoadingRoom,
        error: errorRoom,
        refetch: refetchRoom,
    } = useQuery(
        ['fetchAllScheduleInRoomByCinemaCode', selectedOptionFilterCinema, formattedDate],
        () => fetchAllScheduleInRoomByCinemaCode(selectedOptionFilterCinema, formattedDate),
        {
            staleTime: 1000 * 60 * 7,
            cacheTime: 1000 * 60 * 10,
            refetchInterval: 1000 * 60 * 7,
            enabled: !!selectedOptionFilterCinema && !!formattedDate && optionNameCinema.length > 0,
            onSuccess: (data) => {
                setRoomsFilter(data?.room);
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
            },
        },
    );
    const [movieByCode, setMovieByCode] = useState('');

    useEffect(() => {
        const fetchMovieByCode = async () => {
            const optionFind = optionMovieName.find(
                (map) => map.name.toUpperCase() === selectedMovieName.toUpperCase(),
            );
            const movie = await axios.get(`api/movies/${optionFind?.code}`);
            setMovieByCode(movie.data);
        };

        if (selectedMovieName) {
            fetchMovieByCode();
        }
    }, [selectedMovieName, optionMovieName]);

    useEffect(() => {
        if (room.length > 0) {
            const initialVisibleRooms = {};
            const initialIsDropdownOpen = {};

            room.forEach((item) => {
                initialVisibleRooms[item.code] = true;
                initialIsDropdownOpen[item.code] = true;
            });

            setVisibleRooms(initialVisibleRooms);
            setIsDropdownOpen(initialIsDropdownOpen);
        }
    }, [room]);

    const checkAdd = (newSchedule) => {
        const rooms = room.find((r) => r.code === selectedRoom?.code);

        const screeningFormat = optionScreeningFormat.find((option) => option.name === selectedScreeningFormat);

        const duration = movieByCode?.duration;

        if (!selectedDate) return false;

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày
        const combinedDateTime = dayjs(`${formattedDate} ${newSchedule.startTime}`); // Sử dụng lịch chiếu mới

        const startTime1 = combinedDateTime.toISOString(); // Định dạng giờ
        const startTime = new Date(startTime1);

        const startDate = new Date(movieByCode?.startDate);

        // Kiểm tra xem ngày tạo suất chiếu có nằm trong khoảng 1 đến 3 ngày so với ngày phát hành không
        const selectedDay1 = new Date(`${formattedDate}T00:00:00.000Z`);
        const differenceInTime = startDate.getTime() - selectedDay1.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays > 3) {
            toastAdd = 1;

            return false; // Ngày không hợp lệ
        }

        const endTime = new Date(startTime.getTime() + duration * 60000 + 15 * 60000);
        const schedules = rooms.schedules || [];

        const conflictingSchedules = schedules.filter((schedule) => {
            // Kiểm tra xung đột với lịch chiếu khác
            return new Date(schedule.startTime) < endTime && new Date(schedule.endTime) > startTime;
        });

        if (conflictingSchedules.length > 0) {
            return false;
        }

        const movie = optionMovieName.find((option) => option.name.toUpperCase() === selectedMovieName.toUpperCase());

        for (const room1 of room) {
            const existingSchedules = room1.schedules || [];

            // Kiểm tra xung đột lịch chiếu trong phòng
            const isConflict = existingSchedules.some(
                (schedule) =>
                    schedule.movieCode.code === movie?.code &&
                    schedule.startTime === startTime1 &&
                    schedule.screeningFormatCode.code === screeningFormat?.code,
            );

            if (isConflict) {
                return false;
            }
        }
        return true;
    };

    const getAvailableSchedules = (showAll) => {
        if (!selectedMovieName) {
            toast.warning('Vui lòng chọn phim');
            return [];
        }

        const today = dayjs(); // Ngày hôm nay
        const selectedDay = selectedDate.startOf('day');
        const availableSchedules = [];
        const mongoSchedules = [];
        const movieCode = optionMovieName.find(
            (option) => option.name.toUpperCase() === selectedMovieName.toUpperCase(),
        )?.code;

        const cleaningTime = 15 * 60000;

        const roundToNearestMinutes = (time, interval) => {
            const minutes = Math.ceil(time.minute() / interval) * interval;
            return time.minute(minutes).second(0);
        };

        room.forEach((roomItem) => {
            const schedules = roomItem.schedules || [];
            const duration = movieByCode?.duration;
            const endOfDay = selectedDay.endOf('day');

            if (showAll) {
                let lastEndTime;

                if (selectedDay.isSame(today, 'day')) {
                    lastEndTime = today.isAfter(today.hour(9)) ? today : today.hour(9).minute(0);
                } else {
                    lastEndTime = selectedDay.hour(9).minute(0);
                }

                lastEndTime = roundToNearestMinutes(lastEndTime, 5);

                // Lọc lịch chiếu cho ngày được chọn cùng với phim và phòng được chọn
                const todaysSchedules = schedules.filter(
                    (schedule) =>
                        dayjs(schedule.startTime).isSame(selectedDay, 'day') &&
                        schedule.movieCode.code === movieCode &&
                        schedule.roomCode.code === selectedRoom?.code,
                );

                // Nếu có lịch chiếu hiện có, tìm thời gian kết thúc cuối cùng
                if (todaysSchedules.length > 0) {
                    const lastSchedule = todaysSchedules[todaysSchedules.length - 1];
                    lastEndTime = dayjs(lastSchedule.endTime);
                }

                // Tạo lịch chiếu mới cho đến khi hết ngày
                while (lastEndTime.isBefore(endOfDay)) {
                    const newScheduleStartTime = lastEndTime.clone(); // Clone để duy trì tham chiếu
                    const newScheduleEndTime = lastEndTime.clone().add(duration, 'minute');

                    // Làm tròn thời gian bắt đầu và kết thúc theo bội số 5 phút
                    const roundedStartTime = roundToNearestMinutes(newScheduleStartTime, 5);
                    const roundedEndTime = roundToNearestMinutes(newScheduleEndTime, 5);

                    // Kiểm tra xem có xung đột với lịch chiếu khác không

                    const schedule = {
                        _id: `NEW_SCHEDULE_${roomItem.code}_${availableSchedules.length + 1}`,
                        startTime: roundedStartTime.format('HH:mm'), // Hiển thị giờ
                        endTime: roundedEndTime.add(cleaningTime, 'millisecond').format('HH:mm'), // Hiển thị giờ cộng thời gian dọn dẹp
                        code: `NEW_SCHEDULE_${availableSchedules.length + 1}`,
                        movieCode: { code: movieCode },
                    };
                    const isValid = checkAdd(schedule);

                    // Nếu lịch chiếu không hợp lệ, tăng lên 10 phút
                    if (!isValid) {
                        lastEndTime = roundedStartTime.add(10, 'minute'); // Tăng 10 phút cho lần kiểm tra tiếp theo
                        continue; // Quay lại vòng lặp để kiểm tra lịch mới
                    }

                    if (roomItem.code === selectedRoom?.code) {
                        const newSchedule = {
                            _id: `NEW_SCHEDULE_${roomItem.code}_${availableSchedules.length + 1}`,
                            startTime: roundedStartTime.format('HH:mm'),
                            endTime: roundedEndTime.add(cleaningTime, 'millisecond').format('HH:mm'),
                            code: `NEW_SCHEDULE_${availableSchedules.length + 1}`,
                            movieCode: { code: movieCode },
                        };

                        if (roundedStartTime.isValid() && roundedEndTime.isValid()) {
                            const mongoSchedule = {
                                _id: `MONGO_SCHEDULE_${roomItem.code}_${mongoSchedules.length + 1}`,
                                startTime: roundedStartTime.toISOString(),
                                endTime: roundedEndTime.add(cleaningTime, 'millisecond').toISOString(),
                                code: `MONGO_SCHEDULE_${mongoSchedules.length + 1}`,
                                movieCode: { code: movieCode },
                            };

                            availableSchedules.push(newSchedule);
                            mongoSchedules.push(mongoSchedule);
                        }
                    }

                    lastEndTime = roundedEndTime.add(cleaningTime, 'millisecond');
                }
            }
        });

        return { availableSchedules, mongoSchedules };
    };

    const handleAddSchedules = async () => {
        let loadingToastId;
        if (validateSchedule() === false) return;

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        // Tạo danh sách lịch chiếu từ mongoSchedules
        const schedulesToAdd = availableSchedules.map((schedule) => {
            const combinedDateTime = dayjs(`${formattedDate} ${schedule.startTime}`);
            const startTime = combinedDateTime.toISOString(); // Định dạng giờ

            const movieCode = optionMovieName.find(
                (option) => option.name.toUpperCase() === selectedMovieName.toUpperCase(),
            )?.code;

            const screeningFormat = optionScreeningFormat.find((option) => option.name === selectedScreeningFormat);
            const audio = optionAudio.find((option) => option.name === selectedAudio);
            const subtitle = optionSubtitle.find((option) => option.name === selectedSubtitle);

            return {
                roomCode: selectedRoom?.code,
                movieCode: movieCode,
                screeningFormatCode: screeningFormat?.code,
                date: formattedDate,
                startTime: startTime,
                audioCode: audio?.code,
                subtitleCode: subtitle?.code,
            };
        });
        loadingToastId = toast.loading('Đang tạo suất chiếu!');
        cleanText();

        try {
            // Thêm từng lịch chiếu một
            for (const schedule of schedulesToAdd) {
                const response = await axios.post('api/schedules', schedule);
                if (response.data) {
                    const seatStatus = {
                        scheduleCode: response.data.code,
                    };

                    // Gửi yêu cầu cập nhật trạng thái ghế cho lịch chiếu vừa thêm
                    await axios.post('api/seat-status-in-schedules', seatStatus);
                } else {
                    // Nếu thêm lịch chiếu thất bại
                    toast.dismiss(loadingToastId);

                    toast.error('Thêm thất bại');
                    return; // Kết thúc hàm nếu có lỗi
                }
            }

            // Nếu tất cả lịch chiếu đã được thêm thành công
            toast.dismiss(loadingToastId);
            toast.success('Thêm thành công');
            refetchRoom();
            handleClose();
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const cleanText = () => {
        setSelectedMovieName('');
        setSelectedScreeningFormat('');
        setSelectedAudio('');
        setSelectedSubtitle('');
        setSelectedTime();
    };

    // action
    const handleAddSchedule = async () => {
        if (validateSchedule() === false) return; // Kiểm tra dữ liệu nhập vào có hợp lệ không
        if (checkAddAndUpdate() === false) return;
        if (!selectedRoom) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        // Định dạng thời gian thành ISO string
        const startTime = combinedDateTime.toISOString(); // Định dạng giờ

        const movieCode = optionMovieName.find(
            (option) => option.name.toUpperCase() === selectedMovieName.toUpperCase(),
        )?.code;
        const screeningFormat = optionScreeningFormat.find((option) => option.name === selectedScreeningFormat);

        const audio = optionAudio.find((option) => option.name === selectedAudio);
        const subtitle = optionSubtitle.find((option) => option.name === selectedSubtitle);
        const schedule = {
            roomCode: selectedRoom?.code,
            movieCode: movieCode,
            screeningFormatCode: screeningFormat?.code,
            date: formattedDate,
            startTime: startTime,
            audioCode: audio?.code,
            subtitleCode: subtitle?.code,
        };
        console.log('schedule', schedule);

        try {
            const response = await axios.post('api/schedules', schedule);
            if (response.data) {
                const seatStatus = {
                    scheduleCode: response.data.code,
                };
                cleanText();

                const seatStatusInSchedules = await axios.post('api/seat-status-in-schedules', seatStatus);
                if (seatStatusInSchedules.data) {
                    toast.success('Thêm suất chiếu thành công');
                    refetchRoom();
                    cleanText();
                    handleClose();
                }
            } else {
                toast.error('Thêm suất chiếu thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };
    const handleUpdateSchedule = async () => {
        if (validateSchedule() === false) return; // Kiểm tra dữ liệu nhập vào có hợp lệ không
        if (checkAddAndUpdate() === false) return;
        if (!selectedSchedule.code) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        // Định dạng thời gian thành ISO string
        const startTime = combinedDateTime.toISOString(); // Định dạng giờ

        const movie = optionMovieName.find((option) => option.name.toUpperCase() === selectedMovieName.toUpperCase());
        const screeningFormat = optionScreeningFormat.find((option) => option.name === selectedScreeningFormat);

        const audio = optionAudio.find((option) => option.name === selectedAudio);
        const subtitle = optionSubtitle.find((option) => option.name === selectedSubtitle);

        const schedule = {
            roomCode: selectedRoom?.code,
            movieCode: movie?.code,
            screeningFormatCode: screeningFormat?.code,
            date: formattedDate,
            startTime: startTime,
            audioCode: audio?.code,
            subtitleCode: subtitle?.code,
        };

        try {
            const response = await axios.put(`api/schedules/${selectedSchedule?.code}`, schedule);
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

    const handleUpdateStatus = async (code) => {
        try {
            const response = await axios.put(`api/schedules/status/${code}`);
            if (response.data) {
                toast.success('Cập nhật thành công!');
                refetchRoom();
                handleCloseUpdateStatus();
            } else {
                toast.error('Cập nhật thất bại');
                handleCloseUpdateStatus();
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateMultipleStatuses = async (schedules) => {
        try {
            handleCloseUpdateStatus();
            // Tạo một mảng các promises cho việc gọi API cập nhật nhiều lịch chiếu
            const updatePromises = schedules.map((schedule) => axios.put(`api/schedules/status/${schedule.code}`));

            // Chờ tất cả các promises hoàn thành
            const responses = await Promise.all(updatePromises);

            // Kiểm tra xem tất cả các phản hồi có thành công hay không
            const allSuccessful = responses.every((response) => response.data);

            if (allSuccessful) {
                toast.success('Cập nhật thành công!');
                refetchRoom(); // Làm mới dữ liệu phòng
            } else {
                refetchRoom(); // Làm mới dữ liệu phòng

                toast.error('Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (code) => {
        try {
            handleCloseDelete();
            const response = await axios.delete(`api/schedules/${code}`);
            if (response.data) {
                toast.success('Xóa thành công!');
                refetchRoom();
            } else {
                toast.error('Xóa thất bại');
                refetchRoom();
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleDeleteMultiple = async (schedules) => {
        try {
            handleCloseDelete();
            let loadingToastId;
            loadingToastId = toast.loading('Đang xóa !');
            // Tạo một mảng các promises cho việc gọi API cập nhật nhiều lịch chiếu
            const updatePromises = schedules.map((schedule) => axios.delete(`api/schedules/${schedule.code}`));
            // Chờ tất cả các promises hoàn thành
            const responses = await Promise.all(updatePromises);

            // Kiểm tra xem tất cả các phản hồi có thành công hay không
            const allSuccessful = responses.every((response) => response.data);

            if (allSuccessful) {
                toast.dismiss(loadingToastId);

                toast.success('Xóa thành công!');
                refetchRoom(); // Làm mới dữ liệu phòng
            } else {
                toast.dismiss(loadingToastId);

                toast.error('Xóa thất bại');
                refetchRoom(); // Làm mới dữ liệu phòng
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const mutationUpdateStatusAll = useMutation(handleUpdateMultipleStatuses, {
        onSuccess: () => {
            // Refetch dữ liệu cần thiết
            queryClient.refetchQueries('fetchAllScheduleInRoomByCinemaCodeOrder');
        },
    });

    const mutationUpdateStatus = useMutation(handleUpdateStatus, {
        onSuccess: () => {
            // Refetch dữ liệu cần thiết
            queryClient.refetchQueries('fetchAllScheduleInRoomByCinemaCodeOrder');
        },
    });

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        console.log('time', time);
        // const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        // const combinedDateTime = dayjs(`${formattedDate} ${time.format('HH:mm')}`);

        // // Định dạng thời gian thành ISO string
        // const startTime = combinedDateTime.toISOString(); // Định dạng giờ

        // console.log('time', startTime);

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

    const convertToVietnamTime = (utcDateString) => {
        // Tạo đối tượng Date từ chuỗi UTC
        const utcDate = new Date(utcDateString);

        // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
        // const vnTime = new Date(utcDate.getTime());

        // Lấy giờ và phút
        const hours = utcDate.getHours().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
        const minutes = utcDate.getMinutes().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số

        return `${hours}:${minutes}`; // Trả về định dạng "HH:mm"
    };

    const validateSchedule = () => {
        if (!selectedTime && showAllSchedules === false) {
            toast.warning('Vui lòng chọn giờ chiếu');
            return false;
        }
        if (!selectedMovieName) {
            toast.warning('Vui lòng chọn phim');
            return false;
        }
        if (!selectedScreeningFormat) {
            toast.warning('Vui lòng chọn định dạng chiếu');
            return false;
        }
        if (!selectedAudio) {
            toast.warning('Vui lòng chọn âm thanh');
            return false;
        }
        if (!selectedSubtitle) {
            toast.warning('Vui lòng chọn phụ đề');
            return false;
        }
        if (showAllSchedules && availableSchedules.length === 0) {
            return false;
        }

        return true;
    };

    const checkAddAndUpdate = () => {
        let rooms = [];
        if (isUpdate) {
            rooms = room.find((r) => r.code === selectedSchedule.roomCode);
        } else {
            rooms = room.find((r) => r.code === selectedRoom?.code);
        }
        const duration = movieByCode?.duration;

        if (!selectedDate) return false;

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        const combinedDateTime = dayjs(`${formattedDate} ${selectedTime.format('HH:mm')}`);

        const startTime1 = combinedDateTime.toISOString(); // Định dạng giờ

        const startTime = new Date(startTime1);

        const startDate = new Date(movieByCode?.startDate);

        // Kiểm tra xem ngày tạo suất chiếu có nằm trong khoảng 1 đến 3 ngày so với ngày phát hành không
        const selectedDay1 = new Date(`${formattedDate}T00:00:00.000Z`);
        const differenceInTime = startDate.getTime() - selectedDay1.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays > 3) {
            toast.info('Phải trước ngày phát hành phim tối đa 3 ngày!');
            return false; // Ngày không hợp lệ
        }
        const endDate = new Date(movieByCode?.endDate);

        toast.success('Ngày hợp lệ!' + selectedDate);
        toast.success('Ngày hợp lệ111!' + endDate);
        if (selectedDate > endDate) {
            toast.info('Ngày này đã phim đã ngừng phát hành!');
            return false; // Ngày không hợp lệ
        }

        const endTime = new Date(startTime.getTime() + duration * 60000 + 15 * 60000);

        const schedules = rooms.schedules || []; // Đảm bảo schedules là một mảng
        const conflictingSchedules = schedules.filter((schedule) => {
            // Kiểm tra xung đột với lịch chiếu khác, bỏ qua lịch có mã là selectedSchedule?.code
            return (
                new Date(schedule.startTime) < endTime &&
                new Date(schedule.endTime) > startTime &&
                schedule.code !== selectedSchedule?.code
            ); // Bỏ qua lịch chiếu hiện tại
        });

        if (conflictingSchedules.length > 0) {
            toast.warning('Khung giờ này đang chiếu phim khác');
            return false;
        }
        const movie = optionMovieName.find((option) => option.name.toUpperCase() === selectedMovieName.toUpperCase());
        const screeningFormat = optionScreeningFormat.find(
            (option) => option.name.toUpperCase() === selectedScreeningFormat.toUpperCase(),
        );

        for (const room1 of room) {
            const existingSchedules = room1.schedules || []; // Lịch chiếu hiện có trong phòng

            // Kiểm tra xung đột lịch chiếu trong phòng
            const isConflict = existingSchedules.some(
                (schedule) =>
                    schedule.movieCode.code === movie?.code &&
                    schedule.startTime === startTime1 &&
                    schedule.screeningFormatCode.code === screeningFormat?.code &&
                    schedule.code !== selectedSchedule?.code, // Kiểm tra thời gian bắt đầu
            );

            if (isConflict) {
                toast.warning('Phim này đã có giờ chiếu tại:' + room1.name);

                return false; // Có xung đột
            }
        }
        return true;
    };

    const handleSearch = (searchValue) => {
        setSelectedFilterCinema(searchValue);

        const filteredRooms = room.filter((item) => item.cinemaCode.name.toUpperCase() === searchValue.toUpperCase());
        if (filteredRooms.length > 0) {
            setRoomsFilter(filteredRooms);
        } else {
            setRoomsFilter([]);
        }
    };

    const handleSearchMovie = (searchValue) => {
        setSelectedFilterMovieName(searchValue);
        if (!searchValue) {
            setRoomsFilter(room); // Reset to show all rooms
            return;
        }

        const filteredRooms = room
            .map((room) => {
                const filteredSchedules = room.schedules.filter(
                    (schedule) => schedule.movieCode.name.toUpperCase() === searchValue.toUpperCase(),
                );

                return {
                    ...room,
                    schedules: filteredSchedules,
                };
            })
            .filter((room) => room.schedules.length > 0);

        // Update the filtered list of rooms
        if (filteredRooms.length > 0) {
            setRoomsFilter(filteredRooms);
        } else {
            setRoomsFilter([]);
            toast.info('Không tìm thấy suất chiếu nào cho phim này!');
        }
    };

    const handleOpenUpdateStatus = (item) => {
        setOpenUpdateStatus(true);
        setIsUpdateStatus(item);
    };
    const handleCloseUpdateStatus = () => {
        setOpenUpdateStatus(false);
    };

    const handleOpenDelete = (item) => {
        setOpenDelete(true);
        setIsDeleteAll(item);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setAvailableSchedules([]);
        setShowAllSchedules(false);
        setOpen(false);
        cleanText();
    };

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

    const handleOnChangeOptionMovie = (option) => {
        if (option) {
            setSelectedMovieName(option);
            setShowAllSchedules(false);
            setSelectedAudio('');
            setSelectedSubtitle('');
            setAvailableSchedules([]);
        }
    };

    const handleOnChangeOptionSubtitle = (option) => {
        if (option) {
            setSelectedSubtitle(option);
        }
    };

    const handleOnChangeOptionAudio = (option) => {
        if (option) {
            setSelectedAudio(option);
        }
    };

    const handleOnChangeOptionScreeningFormat = (option) => {
        if (option) {
            setSelectedScreeningFormat(option);
            setShowAllSchedules(false);

            setAvailableSchedules([]);
        }
    };
    if (isLoadingRoom || isLoadingCinemas || isLoadingOptionMovieName) return <Loading />;
    if (errorRoom || CinemaError || optionCinemaNameError)
        return (
            <div>Error loading data: {errorRoom.message || CinemaError.message || optionCinemaNameError.message}</div>
        );

    const renderRoomByCinemaCode = (room) => {
        return room.map((item) => (
            <div key={item.code}>
                <div className="bg-[#E6E6E6] text-[14px] py-2 font-normal uppercase text-slate-500 grid grid-cols-3 items-center gap-3 mb-2 min-w-[1150px]">
                    <div className="grid grid-cols-10 items-center gap-5 ">
                        <div
                            className="justify-center items-center col-span-3 grid"
                            onClick={() => {
                                toggleVisibility(item.code);
                                toggleDropdown(item.code);
                            }}
                        >
                            {isDropdownOpen[item.code] ? (
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
                {visibleRooms[item.code] && (
                    <>
                        <div className="border-b py-[2px] text-[13px] font-bold text-slate-500 grid grid-cols-12 items-center gap-3 mx-2 min-w-[1150px] ">
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
                                        !isDisabledAdd ? ' gradient-button' : 'bg-gray-200'
                                    } `}
                                    onClick={async () => {
                                        if (!isDisabledAdd) {
                                            const check = await axios.get(`api/rooms/getAll/${item.code}`);
                                            if (check.data.status === 2) {
                                                toast.warning('Phòng đã ngừng hoạt động');
                                                return;
                                            }
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
                        <div className="height-sm-1 min-w-[1150px]">
                            {item.schedules &&
                                item.schedules.map((item) => (
                                    <div
                                        className="border-b py-[6px] text-[15px] font-normal text-slate-500 grid grid-cols-12 items-center gap-3"
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
                                        <div className=" grid col-span-6 grid-cols-12 items-center justify-center gap-3">
                                            <h1 className=" grid col-span-9  items-center uppercase  ">
                                                {item.movieCode.name}
                                            </h1>

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
                                                className={`uppercase border px-2 text-white text-[14px] py-[1px] flex  rounded-[40px] ${
                                                    item.status === 0
                                                        ? 'bg-gray-400'
                                                        : item.status === 1 && isDisabledAdd
                                                        ? 'bg-gray-400'
                                                        : item.status === 2 && isDisabledAdd
                                                        ? 'bg-gray-400'
                                                        : item.status === 2 && !isDisabledAdd
                                                        ? 'bg-yellow-400'
                                                        : 'bg-green-500'
                                                }`}
                                                onClick={() => {
                                                    if (!isDisabledAdd || item.status === 0) {
                                                        handleOpenUpdateStatus(false);
                                                        setSelectedSchedule(item);
                                                    }
                                                }}
                                                disabled={isDisabledAdd || item.status !== 0}
                                            >
                                                {item.status === 0
                                                    ? 'Chưa chiếu'
                                                    : item.status === 1 && isDisabledAdd
                                                    ? 'Đã chiếu'
                                                    : item.status === 2 && isDisabledAdd
                                                    ? 'Đã chiếu'
                                                    : item.status === 2 && !isDisabledAdd
                                                    ? 'Suất chiếu sớm'
                                                    : 'Đang chiếu'}
                                            </button>
                                        </div>
                                        <div className={'justify-center space-x-5 items-center col-span-1 flex '}>
                                            <button
                                                className={`grid  ${
                                                    item.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                                onClick={() => {
                                                    handleOpenDelete(false);
                                                    setSelectedSchedule(item);
                                                }}
                                            >
                                                <MdOutlineDeleteOutline color="black" fontSize={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            {item.schedules && item.schedules.length > 1 && (
                                <div
                                    className={`flex  justify-end items-center space-x-5 border-t p-2 pr-2 ${
                                        isDisabledAdd ? 'pointer-events-none opacity-50' : ''
                                    }`}
                                >
                                    <button
                                        className={`gradient-button text-white text-sm px-2  py-1 rounded-[40px]    flex grid-cols-2
                                        ${
                                            item.schedules.some((item) => item.status === 0)
                                                ? ''
                                                : 'pointer-events-none opacity-50'
                                        }`}
                                        onClick={() => {
                                            const schedulesToUpdate = item.schedules.filter(
                                                (item) => item.status === 0,
                                            );
                                            if (schedulesToUpdate.length > 0) {
                                                handleOpenUpdateStatus(true);
                                                setSelectedSchedule(schedulesToUpdate);
                                            } else {
                                                toast.info('Tất cả đang chiếu!');
                                            }
                                        }}
                                    >
                                        <FaRegEdit color="black" size={20} />
                                        Cập nhật tất cả
                                    </button>

                                    <button
                                        className={`bg-gray-400  text-white 
                                         text-sm  px-2 py-1 flex  rounded-[40px] space-x-1  grid-cols-2 ${
                                             item.schedules.some((item) => item.status === 0)
                                                 ? ''
                                                 : 'pointer-events-none opacity-50'
                                         } `}
                                        onClick={() => {
                                            const schedulesToUpdate = item.schedules.filter(
                                                (item) => item.status === 0,
                                            );
                                            if (schedulesToUpdate.length > 0) {
                                                handleOpenDelete(true);
                                                setSelectedSchedule(schedulesToUpdate);
                                            } else {
                                                toast.info('Tất cả đang chiếu không thể xóa!');
                                            }
                                        }}
                                    >
                                        <MdOutlineDeleteOutline color="black" fontSize={20} />
                                        <span className=""> Xóa tất cả</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        ));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
                <div className="bg-white border overflow-x-auto overflow-y-hidden  xl:overflow-hidden shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                    <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Suất chiếu</h1>
                    <div className="grid grid-cols-3 max-lg:gap-3 gap-12 items-center w-full h-16 px-3 min-w-[900px]">
                        <AutoInputComponent
                            options={optionNameCinema.map((option) => option.name)}
                            value={selectedOptionFilterCinema}
                            onChange={(newValue) => handleSearch(newValue)}
                            title="Tên rạp"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Tất cả"
                            heightSelect={200}
                            borderRadius="10px"
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

                        <AutoInputComponent
                            options={optionMovieName.map((option) => option.name.toUpperCase())}
                            value={selectedFilterMovieName}
                            onChange={(newValue) => handleSearchMovie(newValue)}
                            title="Tên phim"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Tất cả"
                            heightSelect={200}
                            borderRadius={'10px'}
                        />
                    </div>
                </div>
                <div className="bg-white border overflow-auto  shadow-md rounded-[10px] box-border custom-hubmax h-[515px] custom-height-xs max-h-screen custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                    <div className="gradient-button text-[13px] text-white py-2 font-semibold grid grid-cols-3 items-center gap-3 min-w-[1150px]">
                        <h1 className="uppercase grid justify-center items-center">Phòng</h1>
                        <h1 className="uppercase grid  justify-center items-center">Loại phòng</h1>
                        <h1 className="uppercase grid justify-center items-center">Số lượng ghế</h1>
                    </div>
                    <div className=" h-[92%] height-sm-1 ">
                        {Array.isArray(roomsFilter) && roomsFilter.length > 0
                            ? renderRoomByCinemaCode(roomsFilter)
                            : renderRoomByCinemaCode(room)}
                    </div>
                </div>
                <ModalComponent
                    open={open}
                    handleClose={handleClose}
                    width="55%"
                    height="auto"
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
                    date={selectedDate?.format('DD/MM/YYYY')}
                >
                    <div className="grid   ">
                        <div className="grid grid-cols-2 gap-16 p-2  ">
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Thời gian chiếu</h1>
                                <TimePicker
                                    label="Chọn giờ"
                                    value={selectedTime || null}
                                    onChange={handleTimeChange}
                                    ampm={false} // Vô hiệu hóa AM/PM
                                    disabledTime={disabledTime}
                                    minuteStep={5}
                                    hourStep={1}
                                    placeholder="Chọn giờ"
                                    format="HH:mm"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    disabled={showAllSchedules}
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>

                            <AutoInputComponent
                                options={optionMovieName.map((option) => option.name.toUpperCase())}
                                value={selectedMovieName}
                                onChange={handleOnChangeOptionMovie}
                                title="Tên phim"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Chọn"
                                heightSelect={200}
                                borderRadius={'5px'}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-16 p-2    ">
                            <div className="grid-rows-2 items-center  space-y-3 ">
                                {/* Container có thanh kéo (scroll) */}
                                <div
                                    className="overflow-x-auto"
                                    style={{ maxHeight: '70px', paddingRight: '10px' }} // Đặt chiều cao cố định và đảm bảo có padding cho thanh kéo
                                >
                                    <div className="grid grid-cols-3 gap-2 p-1">
                                        {availableSchedules.map((schedule) => (
                                            <div
                                                key={schedule._id}
                                                className="relative flex border-2 border-blue-500 rounded-md justify-center items-center  hover:border-red-500 "
                                                onClick={() => handleDeleteSchedule(schedule._id)}
                                            >
                                                <button>
                                                    {schedule.startTime} - {schedule.endTime}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Checkbox cho 'Tất cả suất chiếu' */}
                                <div
                                    className={
                                        selectedMovieName && selectedScreeningFormat
                                            ? ''
                                            : 'pointer-events-none opacity-50'
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        id="online"
                                        name="status"
                                        value="Online"
                                        className="p-20 h-10"
                                        style={{ width: '20px', height: '20px' }}
                                        checked={showAllSchedules}
                                        onChange={handleCheckboxChange} // Thêm hàm để xử lý thay đổi
                                    />
                                    <label htmlFor="online" className="text-[16px] ml-3 ">
                                        Tất cả suất chiếu còn lại trong ngày
                                    </label>
                                </div>
                            </div>

                            <AutoInputComponent
                                value={selectedAudio}
                                onChange={handleOnChangeOptionAudio}
                                title="Âm thanh"
                                placeholder="Chọn"
                                options={
                                    movieByCode?.country === 'Việt Nam'
                                        ? optionAudio
                                              .filter((item) => item.code !== 'AT02')
                                              .map((option) => option.name)
                                        : selectedSubtitle === 'Việt'
                                        ? optionAudio
                                              .filter((item) => item.code === 'AT01')
                                              .map((option) => option.name)
                                        : optionAudio.map((option) => option.name)
                                }
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
                                        options={optionScreeningFormat.map((option) => option.name)}
                                        freeSolo={false}
                                        disableClearable={true}
                                        className="grid  "
                                        borderRadius={'5px'}
                                    />
                                    <AutoInputComponent
                                        value={selectedSubtitle}
                                        onChange={handleOnChangeOptionSubtitle}
                                        title="Phụ đề"
                                        placeholder="Chọn"
                                        options={
                                            movieByCode?.country === 'Việt Nam'
                                                ? optionSubtitle
                                                      .filter((item) => item.code !== 'VS01')
                                                      .map((option) => option.name)
                                                : optionSubtitle.map((option) => option.name)
                                        }
                                        freeSolo={false}
                                        disableClearable={true}
                                        className="grid "
                                        borderRadius={'5px'}
                                    />
                                </div>
                                <div className="justify-end flex space-x-3 border-t pt-4 pr-4 pb-2">
                                    <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                    <ButtonComponent
                                        text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                        className={` bg-blue-500 ${
                                            (showAllSchedules && availableSchedules.length === 0) ||
                                            !selectedMovieName ||
                                            !selectedScreeningFormat ||
                                            !selectedAudio ||
                                            !selectedSubtitle
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        } `}
                                        onClick={() =>
                                            isUpdate
                                                ? handleUpdateSchedule()
                                                : showAllSchedules
                                                ? handleAddSchedules()
                                                : handleAddSchedule()
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalComponent>

                <ModalComponent
                    open={openDelete}
                    handleClose={handleCloseDelete}
                    width="25%"
                    height="20%"
                    smallScreenWidth="40%"
                    smallScreenHeight="25%"
                    mediumScreenWidth="40%"
                    mediumScreenHeight="20%"
                    largeScreenHeight="20%"
                    largeScreenWidth="40%"
                    maxHeightScreenHeight="40%"
                    maxHeightScreenWidth="40%"
                    title="Xóa suât chiếu chưa chiếu"
                >
                    <div className="h-[50%] grid grid-rows-3 ">
                        <h1 className="grid row-span-2 p-3">
                            {isDeleteAll ? ' Bạn có chắc chắn xóa tất cả không?' : ' Bạn có chắc chắn xóa không?'}
                        </h1>
                        <div className="grid items-center ">
                            <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                                <ButtonComponent
                                    text="Xóa"
                                    className="bg-blue-500"
                                    onClick={
                                        isDeleteAll
                                            ? () => handleDeleteMultiple(selectedSchedule)
                                            : () => handleDelete(selectedSchedule?.code)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </ModalComponent>

                <ModalComponent
                    open={openUpdateStatus}
                    handleClose={handleCloseUpdateStatus}
                    width="30%" // Điều chỉnh kích thước cho phù hợp với nội dung
                    height="auto" // Chiều cao tự động tùy thuộc vào nội dung
                    smallScreenWidth="90%" // Với màn hình nhỏ, modal chiếm phần lớn màn hình
                    smallScreenHeight="auto"
                    mediumScreenWidth="60%" // Điều chỉnh modal cho màn hình trung bình
                    mediumScreenHeight="auto"
                    largeScreenWidth="40%" // Modal nhỏ gọn hơn với màn hình lớn
                    largeScreenHeight="auto"
                    maxHeightScreenWidth="40%"
                    title="Cập nhật trạng thái"
                >
                    <div className="grid gap-3  ">
                        <h1 className=" p-4 rounded ">
                            {isUpdateStatus
                                ? 'Bạn có chắc chắn đưa tất cả suất chiếu vào hoạt động không?'
                                : 'Bạn có chắc chắn đưa suất chiếu vào hoạt động không?'}
                        </h1>
                        <div className="flex justify-end space-x-4  p-2 border-t">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseUpdateStatus} />
                            <ButtonComponent
                                text="Cập nhật"
                                className="bg-blue-500"
                                onClick={
                                    isUpdateStatus
                                        ? () => mutationUpdateStatusAll.mutate(selectedSchedule)
                                        : () => mutationUpdateStatus.mutate(selectedSchedule.code)
                                }
                            />
                        </div>
                    </div>
                </ModalComponent>
            </div>
        </LocalizationProvider>
    );
};

export default Schedule;
