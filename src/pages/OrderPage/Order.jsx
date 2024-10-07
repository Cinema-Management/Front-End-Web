import React, { lazy, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import phim1 from '~/assets/phim1.png';
import { Button } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';
import { getCinemaCode, getIsSchedule, getSchedule } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'date-fns';

const Seat = lazy(() => import('~/pages/SeatPage/Seat'));
const Order = () => {
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedCinema, setSelectedCinema] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const cinemaCode = useSelector((state) => state.cinema.code?.currentCode);
    const dispatch = useDispatch();
    const [selectedOptionFilterCinema, setSelectedFilterCinema] = useState('');
    const [movieSelected, setMovieSelected] = useState(null);

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            const arrayNameCinema = data.map((cinema) => ({
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

    const fetchAllScheduleInRoomByCinemaCode = async (cinemaCode, selectedDate) => {
        if (!cinemaCode) return; // Nếu cinemaCode rỗng thì không gọi API

        const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''; // Định dạng ngày

        try {
            const response = await axios.get(
                `api/schedules/getAllRoomsWithSchedules/${cinemaCode}?date=${formattedDate}`,
            );
            const room = response.data;

            return groupSchedulesByMovieAndStatus(room);
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
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
            console.error('Error fetching movies:', error);
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };

    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('cinemasFullAddress1', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const {
        data: optionMovieName = [],
        isLoading: isLoadingOptionMovieName,
        isFetching: isFetchingOptionMovieName,
        error: optionCinemaNameError,
    } = useQuery('movie1', fetchMoviesStatus, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const {
        data: room = [],
        isLoading: isLoadingRoom,
        error: errorRoom,
        // refetch: refetchRoom,
    } = useQuery(
        ['fetchAllScheduleInRoomByCinemaCode', cinemaCode, selectedDate],
        () => fetchAllScheduleInRoomByCinemaCode(cinemaCode, selectedDate),
        {
            staleTime: 1000 * 60 * 3,
            cacheTime: 1000 * 60 * 10,
            enabled: !!cinemaCode && !!selectedDate,
        },
    );
    console.log('t', room);

    (isLoadingRoom || isLoadingCinemas || isLoadingOptionMovieName || isFetchingOptionMovieName) && <Loading />;
    (errorRoom || CinemaError || optionCinemaNameError) &&
        toast.error('Lỗi: ' + (errorRoom || CinemaError || optionCinemaNameError));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleSearch = (searchValue) => {
        if (searchValue) {
            setSelectedFilterCinema(searchValue);
            const optionFind = optionNameCinema.find((option) => option.name === searchValue);

            getCinemaCode(dispatch, optionFind?.code);
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

    useEffect(() => {
        if (!selectedOptionFilterCinema) {
            const option = optionNameCinema.find((option) => option.code === cinemaCode);
            setSelectedFilterCinema(option?.name);
        }
    }, [selectedOptionFilterCinema, cinemaCode, optionNameCinema]);

    const groupSchedulesByMovieAndStatus = (rooms) => {
        const groupedData = [];

        rooms?.forEach((room) => {
            room?.schedules.forEach((schedule) => {
                const movieName = schedule.movieCode?.name;
                const movieCode = schedule.movieCode?.code;
                const image = schedule.movieCode?.image || ''; // Đảm bảo có trường image
                const status = schedule?.status;

                // Tìm nhóm hiện tại cho phim và trạng thái này
                let movieStatusGroup = groupedData.find(
                    (group) => group.movieName === movieName && group.status === status,
                );

                // Nếu chưa có nhóm này, tạo mới
                if (!movieStatusGroup) {
                    movieStatusGroup = {
                        movieCode: movieCode,
                        movieName: movieName,
                        duration: schedule.movieCode?.duration,
                        movieGenreCode: schedule.movieCode?.movieGenreCode,
                        ageRestriction: schedule.movieCode?.ageRestriction,
                        image: image,
                        status: status,
                        schedules: [], // Mảng chứa lịch chiếu
                    };
                    groupedData.push(movieStatusGroup);
                }

                // Tìm nhóm theo subtitle, audio và screeningFormat
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
    const selectedIsSchedule = useSelector((state) => state.schedule.isSchedule?.currentIsSchedule);

    function getTimeFromDate(dateString) {
        const utcDate = new Date(dateString);

        const vnTime = new Date(utcDate.getTime());

        // Lấy giờ và phút
        const hours = vnTime.getHours().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
        const minutes = vnTime.getMinutes().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số

        return `${hours}:${minutes}`; // Trả về định dạng "HH:mm"
    }

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
                                options={rap.map((option) => option.name)}
                                value={selectedMovie}
                                onChange={setSelectedMovie}
                                title="Tên phim"
                                freeSolo={false}
                                disableClearable={true}
                                placeholder="Nhập ..."
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
                        </div>
                    </div>
                    <div className="bg-white border  shadow-md rounded-[10px] box-border px-1 py-4 overflow-auto h-[515px] custom-height-xs max-h-screen custom-height-sm16 custom-height-md custom-height-lg custom-height-xl2 custom-height-xxl3">
                        {!selectedCinema ? (
                            <div>
                                <div className="grid mb-3 ">
                                    <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">Đang chiếu</h1>
                                    <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                        {room
                                            .filter((item) => item.status === 1)
                                            .map((item) => (
                                                <div
                                                    key={item.movieCode}
                                                    className="border text-center border-[#95989D] shadow-xl grid p-1 rounded-[10px] py-2"
                                                    onClick={() => {
                                                        setSelectedCinema(true);
                                                        setMovieSelected(item);
                                                    }}
                                                >
                                                    <h1 className="font-bold uppercase pl-3">{item.movieName}</h1>
                                                    <div className="text-center justify-center flex mt-2">
                                                        <img
                                                            src={item.image}
                                                            alt="phim1"
                                                            className="w-36 h-32 object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="grid mt-6 ">
                                    <h1 className="font-bold text-[16px] uppercase pl-3 mb-3">Suất chiếu sớm</h1>
                                    <div className="grid grid-cols-5  text-[13px] gap-10 px-10 max-lg:grid-cols-3 ">
                                        {room
                                            .filter((item) => item.status === 2)
                                            .map((item) => (
                                                <div
                                                    key={item.movieCode}
                                                    className="border text-center border-[#95989D] shadow-xl grid p-1 rounded-[10px] py-2"
                                                    onClick={() => {
                                                        setSelectedCinema(true);
                                                        setMovieSelected(item);
                                                    }}
                                                >
                                                    <h1 className="font-bold uppercase pl-3">{item.movieName}</h1>
                                                    <div className="text-center justify-center flex mt-2">
                                                        <img
                                                            src={item.image}
                                                            alt="phim1"
                                                            className="w-36 h-32 object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4">
                                <div className="flex mb-6 ">
                                    <Button
                                        variant="contained"
                                        sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                                        onClick={() => {
                                            setSelectedCinema(false);
                                        }}
                                    >
                                        <IoIosArrowBack size={20} />
                                        Quay lại
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-7   max-lg:gap-3 ">
                                    <div className="flex max-lg:col-span-3">
                                        <img
                                            src={movieSelected?.image}
                                            alt="phim1"
                                            className="w-40 h-64 max-lg:w-28 max-lg:h-48"
                                        />
                                        <div className=" pl-3 text-black pt-2 space-y-1">
                                            <h1 className="uppercase font-bold text-[15px] ">
                                                {movieSelected.movieName}
                                            </h1>
                                            <h1 className="bg-[#1565C0] py-1 text-white w-[40px] text-[12px] text-center rounded-md px-2">
                                                {handleChangDoTuoi(movieSelected.ageRestriction)}
                                            </h1>
                                            <h1 className="text-[14px] ">
                                                {movieSelected.movieGenreCode.map((genre) => genre.name).join(', ')}
                                            </h1>
                                            <h1 className="text-[14px] ">{movieSelected.duration} phút</h1>
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 max-lg:col-span-4">
                                        {movieSelected.schedules.map((schedule, index) => (
                                            <div key={index}>
                                                <h1 className="font-semibold  text-black text-[13px] uppercase">
                                                    {schedule.screeningFormat}{' '}
                                                    {schedule.audio === 'Gốc' ? '' : 'lồng tiếng'} phụ đề{' '}
                                                    {schedule.subtitle}
                                                </h1>
                                                <div className="grid grid-cols-8 max-lg:grid-cols-4 gap-3 mt-2 mb-4 pl-3 ">
                                                    {schedule.schedules.map((item) => (
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
                                                            {/* <h1>{time.available} trống</h1> */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
