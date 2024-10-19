import React, { lazy, useEffect, useMemo, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import { Button } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';
import { getIsSchedule, getSchedule, getMovieSchedule } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { get, set } from 'lodash';

const Seat = lazy(() => import('~/pages/SeatPage/Seat'));

const Order = () => {
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedCinema, setSelectedCinema] = useState(false);
    const dispatch = useDispatch();
    const [roomsFilter, setRoomsFilter] = useState([]);
    const selectedIsSchedule = useSelector((state) => state.schedule.isSchedule?.currentIsSchedule);
    const selectedMovieSchedule = useSelector((state) => state.schedule.movieSchedule?.currentMovieSchedule);
    const [checkSchedule, setCheckSchedule] = useState(false);
    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const formattedDate = useMemo(() => selectedDate.format('YYYY-MM-DD'), [selectedDate]);
    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name,
                code: cinema.code,
            }));
            setSelectedFilterCinema(arrayNameCinema[0].name);

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

            // Lọc các phim có status = 1
            const filteredMovies = movies.filter((movie) => movie.status === 1);

            // Tạo mảng chứa tên và mã phim
            const arrayNameMovie = filteredMovies.map((movie) => ({
                name: movie.name, // Hiển thị tên
                code: movie.code, // Giá trị sẽ được gửi về
            }));

            // Nếu có ít nhất một phim có status = 1, thông báo tên phim đầu tiên

            return arrayNameMovie;
        } catch (error) {
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };

    const {
        data: optionMovieName = [],
        isLoading: isLoadingOptionMovieName,
        // isFetching: isFetchingOptionMovieName,
        error: optionCinemaNameError,
    } = useQuery('moviesOrder', fetchMoviesStatus, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });
    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('cinemasFullAddress1', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const groupSchedulesByMovieAndStatus = (rooms) => {
        const groupedData = [];

        rooms?.forEach((room) => {
            room?.schedules.forEach((schedule) => {
                const movieName = schedule.movieCode?.name;
                const movieCode = schedule.movieCode?.code;
                const image = schedule.movieCode?.image || '';
                const status = schedule?.status;
                const cinemaName = room.cinemaCode?.name;

                let movieStatusGroup = groupedData.find(
                    (group) => group.movieName === movieName && group.status === status,
                );

                if (!movieStatusGroup) {
                    movieStatusGroup = {
                        movieCode: movieCode,
                        movieName: movieName,
                        cinemaName: cinemaName,
                        duration: schedule.movieCode?.duration,
                        movieGenreCode: schedule.movieCode?.movieGenreCode,
                        ageRestriction: schedule.movieCode?.ageRestriction,
                        image: image,
                        status: status,
                        schedules: [], // Mảng chứa lịch chiếu
                    };
                    groupedData.push(movieStatusGroup);
                }

                let scheduleGroup = movieStatusGroup?.schedules.find(
                    (group) =>
                        group.subtitle === schedule.subtitleCode?.name &&
                        group.audio === schedule.audioCode?.name &&
                        group.screeningFormat === schedule.screeningFormatCode?.name,
                );

                // Nếu chưa có nhóm này, tạo mới
                if (!scheduleGroup) {
                    scheduleGroup = {
                        subtitle: schedule.subtitleCode?.name,
                        audio: schedule?.audioCode?.name,
                        screeningFormat: schedule?.screeningFormatCode?.name,
                        schedules: [],
                    };
                    movieStatusGroup.schedules.push(scheduleGroup);
                }

                scheduleGroup.schedules.push({
                    scheduleId: schedule?.scheduleId,
                    scheduleCode: schedule?.code,
                    roomCode: room.code,
                    date: schedule.date,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    status: schedule.status,
                    movieCode: movieCode,
                    movieName: movieName,
                    cinemaName: room.cinemaCode?.name,
                    cinemaCode: room.cinemaCode?.code,
                    roomName: room.name,
                    duration: schedule.movieCode?.duration,
                    movieGenreCode: schedule.movieCode?.movieGenreCode,
                    ageRestriction: schedule.movieCode?.ageRestriction,
                    image: image,
                    screeningFormat: schedule.screeningFormatCode?.name,
                    screenCode: schedule.screeningFormatCode?.code,
                    fullAddress: room.fullAddress,
                });
            });
        });

        groupedData.forEach((movieStatusGroup) => {
            movieStatusGroup.schedules.forEach((scheduleGroup) => {
                scheduleGroup.schedules.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            });
        });

        return groupedData;
    };

    const fetchAllScheduleInRoomByCinemaCode = async (selectedOptionFilterCinema) => {
        if (!selectedOptionFilterCinema) {
            return;
        }

        const cinemaCode = optionNameCinema.find((option) => option.name === selectedOptionFilterCinema)?.code;
        try {
            const response = await axios.get(
                `api/schedules/getAllRoomsWithSchedules/${cinemaCode}?date=${formattedDate}`,
            );

            const roomsData = response.data;

            if (!Array.isArray(roomsData)) {
                throw new Error('Expected response.data to be an array');
            }
            // Process the rooms data
            return groupSchedulesByMovieAndStatus(roomsData);
        } catch (error) {
            toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const {
        data: room = [],
        isLoading: isLoadingRoom,
        error: errorRoom,
        // refetch: refetchRoom,
    } = useQuery(
        ['fetchAllScheduleInRoomByCinemaCodeOrder', selectedOptionFilterCinema, formattedDate],
        () => fetchAllScheduleInRoomByCinemaCode(selectedOptionFilterCinema),
        {
            staleTime: 1000 * 60 * 7,
            cacheTime: 1000 * 60 * 10,
            refetchInterval: 1000 * 60 * 7,
            enabled: !!selectedOptionFilterCinema && !!formattedDate && optionNameCinema.length > 0,
            onSuccess: (room) => {
                setRoomsFilter(room);
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
            },
        },
    );

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleSearch = (searchValue) => {
        setSelectedFilterCinema(searchValue);
        const filteredRooms = room.filter((item) => item.cinemaName === searchValue);

        if (filteredRooms.length > 0) {
            setRoomsFilter(filteredRooms);
        } else {
            setRoomsFilter([]);
        }
    };

    const handleSearchMovie = (searchValue) => {
        setSelectedMovie(searchValue);
        if (!searchValue) {
            setRoomsFilter(room);
            return;
        }
        const filteredRooms = room.filter((item) => item.movieName.toLowerCase() === searchValue.toLowerCase());

        if (filteredRooms.length > 0) {
            setRoomsFilter(filteredRooms);
        } else {
            setRoomsFilter([]);
            toast.info('Không tìm thấy suất chiếu nào cho phim này!');
        }
    };

    const handleChangDoTuoi = (age) => {
        if (age === 13) {
            return 'C13';
        } else if (age === 16) {
            return 'C16';
        } else if (age === 18) {
            return 'C18';
        } else {
            return 'P';
        }
    };

    function getTimeFromDate(dateString) {
        const utcDate = new Date(dateString);

        const vnTime = new Date(utcDate.getTime());

        const hours = vnTime.getHours().toString().padStart(2, '0');
        const minutes = vnTime.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    useEffect(() => {
        if (selectedIsSchedule === false && selectedCinema === false) {
            setSelectedCinema(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIsSchedule]);

    useEffect(() => {
        if (optionNameCinema.length > 0) {
            const initialValue = optionNameCinema[0].name;
            if (!selectedOptionFilterCinema) {
                setSelectedFilterCinema(initialValue);
            }
        }
    }, [optionNameCinema, selectedOptionFilterCinema]);
    useEffect(() => {
        if (room.length > 0) {
            setRoomsFilter(room);
        }
        if (selectedMovieSchedule) {
            const filteredMovie = room.find((roomItem) => roomItem.movieCode === selectedMovieSchedule?.movieCode);
            if (!filteredMovie) {
                setCheckSchedule(true);
            } else {
                setCheckSchedule(false);
                getMovieSchedule(dispatch, filteredMovie);
            }
        }
    }, [room, selectedMovieSchedule, dispatch]);

    if (isLoadingRoom || isLoadingCinemas || isLoadingOptionMovieName) return <Loading />;
    if (errorRoom || CinemaError || optionCinemaNameError)
        return (
            <div>
                Error loading data: {errorRoom?.message || CinemaError?.message || optionCinemaNameError?.message}
            </div>
        );

    const renderRoom = (rooms, type) => {
        return rooms
            .filter((item) => item.status === type)
            .map((item) => (
                <div
                    key={item.movieCode}
                    className="border text-center border-[#95989D] shadow-xl grid p-1 rounded-[10px] py-2"
                    onClick={() => {
                        setSelectedCinema(true);
                        getMovieSchedule(dispatch, item);
                    }}
                >
                    <h1 className="font-bold uppercase pl-3">{item.movieName}</h1>
                    <div className="text-center justify-center flex mt-2">
                        <img src={item.image} alt={item.movieName} className="w-36 h-32 object-contain" />
                    </div>
                </div>
            ));
    };
    console.log('selectedMovieSchedule', selectedMovieSchedule);
    console.log('startdate', selectedMovieSchedule?.schedules[0].schedules[0]?.startTime);
    return (
        <div className="max-h-screen">
            {!selectedIsSchedule ? (
                <>
                    <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                        <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Bán vé</h1>
                        <div className="grid grid-cols-3 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
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

                            <AutoInputComponent
                                options={optionMovieName.map((option) => option.name.toUpperCase())}
                                value={selectedMovie}
                                onChange={(newValue) => handleSearchMovie(newValue)}
                                title="Tên phim"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                                borderRadius="10px"
                            />
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày chiếu</h1>
                                <DatePicker
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    allowClear={false}
                                    minDate={dayjs()}
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 overflow-auto h-[515px] custom-height-xs max-h-screen custom-height-sm16 custom-height-md custom-height-lg custom-height-xl2 custom-height-xxl3">
                        {!selectedMovieSchedule ? (
                            <div>
                                {room.length > 0 ? (
                                    <div>
                                        <div className="grid mb-3 ">
                                            <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">Đang chiếu</h1>
                                            <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                                {Array.isArray(roomsFilter) && roomsFilter.length > 0
                                                    ? renderRoom(roomsFilter, 1)
                                                    : renderRoom(room, 1)}
                                            </div>
                                        </div>
                                        <div className="grid mt-6 ">
                                            <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">
                                                Suất chiếu sớm
                                            </h1>
                                            <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                                {Array.isArray(roomsFilter) && roomsFilter.length > 0
                                                    ? renderRoom(roomsFilter, 2)
                                                    : renderRoom(room, 2)}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <h1 className="text-[16px] ">
                                            Xin lỗi, không có suất chiếu vào ngày này, hãy chọn một ngày khác.
                                        </h1>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="px-4">
                                <div className="flex mb-6 ">
                                    <Button
                                        variant="contained"
                                        sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                                        onClick={() => {
                                            setSelectedCinema(false);
                                            getMovieSchedule(dispatch, null);
                                        }}
                                    >
                                        <IoIosArrowBack size={20} />
                                        Quay lại
                                    </Button>
                                </div>
                                {checkSchedule && selectedMovieSchedule === null ? (
                                    <div className="text-center">
                                        <h1 className="text-[16px] ">
                                            Xin lỗi, không có suất chiếu vào ngày này, hãy chọn một ngày khác.
                                        </h1>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-7   max-lg:gap-3 ">
                                        <div className="flex max-lg:col-span-3">
                                            <img
                                                src={selectedMovieSchedule?.image}
                                                alt="phim1"
                                                className="w-40 h-64 max-lg:w-28 max-lg:h-48"
                                            />
                                            <div className=" pl-3 text-black pt-2 space-y-1">
                                                <h1 className="uppercase font-bold text-[15px] ">
                                                    {selectedMovieSchedule?.movieName}
                                                </h1>
                                                <h1 className="bg-[#1565C0] py-1 text-white w-[40px] text-[12px] text-center rounded-md px-2">
                                                    {handleChangDoTuoi(selectedMovieSchedule?.ageRestriction)}
                                                </h1>
                                                <h1 className="text-[14px] ">
                                                    {selectedMovieSchedule?.movieGenreCode
                                                        .map((genre) => genre.name)
                                                        .join(', ')}
                                                </h1>
                                                <h1 className="text-[14px] ">{selectedMovieSchedule?.duration} phút</h1>
                                            </div>
                                        </div>
                                        <div className="col-span-2 gap-3 max-lg:col-span-4">
                                            {selectedMovieSchedule?.schedules.map((schedule, index) => (
                                                <div key={index}>
                                                    <h1 className="font-semibold  text-black text-[13px] uppercase">
                                                        {schedule.screeningFormat}{' '}
                                                        {schedule.audio === 'Gốc' ? '' : 'lồng tiếng'} phụ đề{' '}
                                                        {schedule.subtitle}
                                                    </h1>
                                                    <div className="grid grid-cols-8 max-lg:grid-cols-4 gap-3 mt-2 mb-4 pl-3 ">
                                                        {schedule.schedules.filter((item) =>
                                                            dayjs(item.startTime).isAfter(dayjs()),
                                                        ).length > 0 ? (
                                                            schedule.schedules
                                                                .filter((item) =>
                                                                    dayjs(item.startTime).isAfter(dayjs()),
                                                                )
                                                                .map((item) => (
                                                                    <div
                                                                        key={item.scheduleCode}
                                                                        className="text-[#95989D] text-[13px] text-center cursor-pointer"
                                                                        onClick={() => {
                                                                            getIsSchedule(dispatch, true);
                                                                            getSchedule(dispatch, item);
                                                                        }}
                                                                    >
                                                                        <h1 className="bg-[#1565C0] w-full text-white py-1 rounded-md px-2">
                                                                            {getTimeFromDate(item.startTime)}
                                                                        </h1>
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <div className="text-center text-[#95989D] text-[15px] w-[400px]">
                                                                Đã hết suất chiếu hôm nay. Vui lòng chọn ngày khác
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <Seat />
            )}
        </div>
    );
};

export default Order;
