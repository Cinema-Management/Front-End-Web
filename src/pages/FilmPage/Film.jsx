import React, { useRef, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import InputComponent from '~/components/InputComponent/InputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import axios from 'axios';
import { DatePicker, Modal, Select } from 'antd';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { FaRegEye } from 'react-icons/fa6';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { FixedSizeList as List } from 'react-window';
import HeightComponent from '~/components/HeightComponent/HeightComponent';
import { useSelector } from 'react-redux';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { set } from 'lodash';
const { Option } = Select;

const { getFormatteNgay, FormatDate, FormatSchedule, getVideoIdFromUri } = require('~/utils/dateUtils');

const fetchMovies = async () => {
    const moviesResponse = await axios.get('api/movies');
    const arrayMovies = moviesResponse.data.map((movie) => ({
        code: movie.code,
        name: movie.name,
    }));
    return { movies: moviesResponse.data, optionMovie: arrayMovies };
};

// Hàm để lấy dữ liệu thể loại phim
const fetchGenres = async () => {
    const genresResponse = await axios.get('api/movie-genres');

    const arrayName = genresResponse.data.map((genre) => ({
        code: genre.code,
        name: genre.name,
    }));

    return { optionGenre: arrayName };
};

const Film = React.memo(() => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef('');
    const [name, setName] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [duration, setDuration] = useState('');
    const [trailer, setTrailer] = useState('');
    const [ageRestriction, setAgeRestriction] = useState();
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const maxTagCount = window.innerWidth < 1025 ? 1 : 2;
    const [movieFilter, setMovieFilter] = useState([]);
    const [inputSearch, setInputSearch] = useState('');
    const [selectedSort, setSelectedSort] = useState(null);
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);
    const [statusFilm, setStatusFilm] = useState('');
    const [statusFilmCode, setStatusFilmCode] = useState('');
    const height = HeightComponent();
    const queryClient = useQueryClient();
    const { RangePicker } = DatePicker;
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [ytbTrainler, setYtbTrainler] = useState('');
    const optionStatus = [
        { value: 3, name: 'Tất cả' },
        { value: 0, name: 'Chưa phát hành' },
        { value: 1, name: 'Phát hành' },
        { value: 2, name: 'Ngừng phát hành' },
    ];

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const {
        data: { movies = [], optionMovie = [] } = {},
        error,
        isLoading,
        isFetched,
        isRefetching,
        refetch,
    } = useQuery(['movies', user], fetchMovies, {
        enabled: !!user,
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
        onSuccess: (data) => {
            setMovieFilter(data.movies);
        },
    });

    const {
        data: { optionGenre = [] } = {},
        errorGenre,
        isLoadingGenre,
        isFetchedGenre,
    } = useQuery(['genres', user], fetchGenres, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedFilm(null);
    };

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFilm(null);
        setStartDate(null);
        setEndDate(null);
        clearText();
    };
    const handleOpenDetail = () => {
        setOpenDetail(true);
       
    };
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedFilm(null);
        setYtbTrainler('');
    };
    const handleShowVideo = () => {
        setShowVideo(true);
    };

    const handleChangeDay = (value) => {
        setSelectedGenre(value);
    };

    const handleInputChange = (event) => {
        descriptionRef.current = event.target.value; // Cập nhật giá trị vào ref
    };

    const handleSearch = (value) => {
        setInputSearch(value);
        if (value === '' || value === null) {
            setMovieFilter(movies);
            return;
        }
        const search = movies.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        setMovieFilter(search);
        setSelectedSort(null);
        setSelectedStatus(optionStatus[0]);
        setRangePickerValue(['', '']);
    };

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${ytbTrainler}?autoplay=1&fullscreen=1`;
    const sortMovie = (selectedGenre) => {
        if (!selectedGenre) {
            setMovieFilter(movies);
            return;
        }

        const filtered = movies.filter((movie) => movie.movieGenreCode.some((genre) => genre.name === selectedGenre));

        if (filtered.length === 0) {
            toast.info('Không tìm thấy phim nào!');
        } else {
            setMovieFilter(filtered);
        }

        setSelectedSort(selectedGenre);
        setInputSearch('');
        setRangePickerValue(['', '']);
        setSelectedStatus(optionStatus[0]);
    };

    const sortedStatus = (option) => {
        if (!option) {
            setMovieFilter(movies);
            return;
        }
        setSelectedStatus(option);
        let sortedStatus = [];
        if (option.value === 0) {
            sortedStatus = movies.filter((item) => item.status === 0);
            setMovieFilter(sortedStatus);
        } else if (option.value === 1) {
            sortedStatus = movies.filter((item) => item.status === 1);
            setMovieFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = movies.filter((item) => item.status === 2);
            setMovieFilter(sortedStatus);
        } else if (option.value === 3) {
            sortedStatus = movies;
        }
        if (sortedStatus.length === 0) {
            toast.info('Không có phim nào!');
        }
        setMovieFilter(sortedStatus);
        setInputSearch('');
        setRangePickerValue(['', '']);
        setSelectedSort(null);
    };

    const onChangeRanger = (dates) => {
        if (!Array.isArray(dates) || dates.length !== 2) {
            setMovieFilter(movies);
            return;
        }
        setRangePickerValue(dates);
        const startDateFormatted = FormatDate(dates[0]);
        const endDateFormatted = FormatDate(dates[1]);

        const filterDate = movies.filter((item) => {
            const itemDate = FormatDate(new Date(item.startDate));

            return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
        });
        if (filterDate.length === 0) {
            toast.info('Không tìm thấy phim nào!');
            setMovieFilter([]);
            setSelectedSort(null);
            setInputSearch('');
            setSelectedStatus(optionStatus[0]);
            return;
        }

        setSelectedSort(null);
        setInputSearch('');
        setMovieFilter(filterDate);
        setSelectedStatus(optionStatus[0]);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };
    const clearText = () => {
        setName('');
        setDuration('');
        setTrailer('');
        setAgeRestriction('0');
        setDirector('');
        setCast('');
        setCountry('');
        setStartDate(null);
        setEndDate(null);
        descriptionRef.current = '';
        setSelectedGenre(null);
        setStatusFilm('');
        setStatusFilmCode('');
        setSelectedImage(null);
    };

    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
        { value: 'HQ', label: 'Hàn Quốc' },
        { value: 'A', label: 'Anh' },
        { value: 'TL', label: 'Nhật Bản' },
        { value: 'AD', label: 'Ấn Độ' },
        { value: 'USA', label: 'Mỹ' },
        { value: 'IN', label: 'Indonesia' },
    ];
    const onChangeStart = (dateString) => {
        if (!dateString) {
            setStartDate(null);
            return;
        }

        setStartDate(dateString);
        setEndDate(null);
    };

    const onChangeEnd = (dateString) => {
        if (!dateString) {
            setEndDate(null);
            return;
        }

        setEndDate(dateString);
    };

    const optionTuoi = [
        { value: '1', label: 'Chọn' },
        { value: '13', label: 'C13' },
        { value: '16', label: 'C16' },
        { value: '18', label: 'C18' },
        { value: '0', label: 'Không giới hạn' },
    ];

    const optionsStatus = [
        { value: 0, name: 'Chưa phát hành' },
        { value: 1, name: 'Phát hành' },
        { value: 2, name: 'Ngừng phát hành' },
    ];
    const changStatus = (value) => {
        if (value === 2) {
            return 'Ngừng phát hành';
        } else if (value === 1) {
            return 'Phát hành';
        } else {
            return 'Chưa phát hành';
        }
    };
    const handleStatusChang = (value) => {
        const selectedItem = optionsStatus.find((item) => item.name === value);
        if (selectedItem) {
            setStatusFilm(value);
            setStatusFilmCode(selectedItem.value);
        } else {
            setStatusFilm('');
            setStatusFilmCode('');
        }
    };
    const handleFormData = () => {
        let check = validate();
        if (!check) return;
        const formData = new FormData();
        const age = ageRestriction === 'C13' ? 13 : ageRestriction === 'C16' ? 16 : ageRestriction === 'C18' ? 18 : 0;
        formData.append('name', name);
        formData.append('duration', duration);
        formData.append('description', descriptionRef.current);
        formData.append('trailer', trailer);
        formData.append('ageRestriction', age);
        formData.append('director', director);
        formData.append('cast', cast);
        formData.append('country', country);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        if (Array.isArray(selectedGenre)) {
            selectedGenre.forEach((code) => formData.append('movieGenreCode', code));
        }
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        formData.append('status', statusFilmCode);

        return formData;
    };

    const validate = () => {
        if (isUpdate) return true;
        if (!name) {
            toast.warn('Vui lòng nhập tên.');
            return false;
        }
        if (!duration) {
            toast.warn('Vui lòng nhập thời lượng.');
            return false;
        }
        if (!selectedGenre) {
            toast.warn('Vui lòng chọn thể loại.');
            return false;
        }
        if (!country) {
            toast.warn('Vui lòng chọn quốc gia.');
            return false;
        }
        if (!director) {
            toast.warn('Vui lòng nhập đạo diễn.');
            return false;
        }

        if (!startDate) {
            toast.warn('Vui lòng chọn ngày phát hành.');
            return false;
        }
        if (!endDate) {
            toast.warn('Vui lòng chọn ngày kết thúc.');
            return false;
        }
        if (!ageRestriction) {
            toast.warn('Vui lòng chọn độ tuổi.');
            return false;
        }
        if (!cast) {
            toast.warn('Vui lòng nhập dàn diễn viên.');
            return false;
        }

        if (!trailer) {
            toast.warn('Vui lòng nhập trailer.');
            return false;
        }
        if (!selectedImage) {
            toast.warn('Vui lòng chọn hình ảnh.');
            return false;
        }
        if (!descriptionRef.current) {
            toast.warn('Vui lòng thêm hình ảnh.');
            return false;
        }

        return true;
    };

    const handleAddMovie = async () => {
        // Thêm các giá trị vào FormData
        const formData = handleFormData();
        if (!formData) return;
        try {
            await axios.post('api/movies', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Thêm phim thành công!');
            clearText();
            handleClose();
            refetch();
        } catch (error) {
            toast.error('Thêm phim thất bại!');
        }
    };

    const handleUpdateMovie = async (movieCode) => {
        const age = ageRestriction === 'C13' ? 13 : ageRestriction === 'C16' ? 16 : ageRestriction === 'C18' ? 18 : 0;
        if (
            !descriptionRef.current &&
            !selectedImage &&
            !name &&
            !duration &&
            !selectedGenre &&
            !trailer &&
            age === selectedFilm.ageRestriction &&
            !director &&
            !cast &&
            country === selectedFilm.country &&
            !statusFilm &&
            dayjs(selectedFilm?.startDate).isSame(startDate, 'day') &&
            dayjs(selectedFilm?.endDate).isSame(endDate, 'day')
        ) {
            toast.warn('Vui lòng nhập thông tin cần cập nhật!');
            return;
        }
        if (endDate === null) {
            toast.warn('Vui lòng chọn ngày kết thúc!');
            return;
        }
        const formData = handleFormData();
        try {
            await axios.put(`api/movies/${movieCode}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Cập nhật phim thành công!');
            clearText();
            handleClose();
            refetch();
        } catch (error) {
            toast.error('Cập nhật phim thất bại!');
        }
    };

    const mutation = useMutation(handleUpdateMovie, {
        onSuccess: () => {
            queryClient.refetchQueries('movies');
            queryClient.refetchQueries('moviesOrder');
        },
    });

    const getAgeRestrictionLabel = (ageRestriction) => {
        switch (ageRestriction) {
            case 13:
                return 'C13';
            case 16:
                return 'C16';
            case 18:
                return 'C18';
            case 0:
                return 'Không giới hạn';
            default:
                return ''; // Giá trị mặc định nếu không khớp
        }
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            await axios.delete(`api/movies/${movieId}`);
            toast.success('Xóa thành công!');
            refetch();
            handleCloseDelete();
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
    };

    if (isLoading || isLoadingGenre || isRefetching ) return <Loading />;
    if (!isFetched || isFetchedGenre) return <Loading />;
    if (error || errorGenre) return <div>Error loading data: {error.message}</div>;

    const rowRenderer = ({ index, style }, data) => {
        const sortedData = [...data].sort((a, b) => {
            const startEndA = new Date(a.startDate);
            const startEndB = new Date(b.startDate);
            return startEndB - startEndA;
        });
        const item = sortedData[index];

        return (
            <div
                className="border-b text-[15px] font-normal py-2 text-slate-500 grid grid-cols-12 items-center gap-2 pr-6"
                key={item.code}
                style={style}
            >
                <div className="grid justify-center grid-cols-10 col-span-3 gap-2 items-center ">
                    <h1 className="grid col-span-2 pl-3 items-center">{index + 1}</h1>
                    <h1 className="grid col-span-4 pl-3 items-center ">{item.code}</h1>
                    <h1 className="grid items-center col-span-4 pl-3">
                        {item.movieGenreCode.map((genre) => genre.name).join(', ')}
                    </h1>
                </div>

                <div className=" justify-center grid">
                    <LazyLoadImage
                        src={item.image}
                        alt={item.name}
                        width={75}
                        onClick={() => {
                            setCurrentImage(item.image);
                            setIsOpenImage(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <h1 className="grid items-center pl-3 col-span-2 uppercase">{item.name}</h1>
                <h1 className="grid justify-center items-center">{item.duration} phút</h1>
                <div className="grid col-span-3 grid-cols-7">
                    <h1 className="grid justify-center col-span-4 items-center">{getFormatteNgay(item.startDate)}</h1>
                    <h1 className="grid justify-center col-span-3 items-center">{getFormatteNgay(item.endDate)}</h1>
                </div>
                <div className="grid grid-cols-7 justify-center col-span-2 ">
                    <div className="grid col-span-5  justify-center items-center">
                        <button
                            className={`border px-2  uppercase text-white text-[13px] py-[2px] flex rounded-[40px] ${
                                item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                        >
                            {item.status === 0
                                ? 'Chưa phát hành'
                                : item.status === 1
                                ? 'Phát hành'
                                : 'Ngừng phát hành'}
                        </button>
                    </div>

                    <div className=" col-span-2 ml-6 justify-center items-center ">
                        <button
                            className="mr-[8px] py-1 max-lg:mr-1 cursor-pointer"
                            onClick={() => {
                                handleOpen(true);
                                setSelectedFilm(item);
                                setCountry(item.country);
                                setAgeRestriction(getAgeRestrictionLabel(item?.ageRestriction));
                                setStartDate(dayjs(item.startDate));
                                setEndDate(dayjs(item.endDate));
                            }}
                        >
                            <FaRegEdit color='black' size={22} />
                        </button>
                        <button
                            className=" py-3"
                            onClick={() => {
                                handleOpenDetail(true);
                                setSelectedFilm(item);
                                setYtbTrainler(getVideoIdFromUri(item?.trailer));
                            }}
                        >
                            <FaRegEye color="black" size={22} />
                        </button>

                        <button
                            onClick={() => {
                                handleOpenDelete();
                                setSelectedFilm(item);
                            }}
                            disabled={item.status === 0 ? false : true}
                        >
                            <MdOutlineDeleteOutline color={`${item.status === 0 ? 'black' : 'gray'}`} fontSize={22} />
                        </button>
                    </div>
                </div>
                <Modal
                    title="Hình ảnh"
                    className="custom-modal"
                    open={isOpenImage}
                    onCancel={() => setIsOpenImage(false)}
                    footer={[]}
                    width={600}
                    mask={false}
                >
                    <div className="modal-image-container">
                        <img src={currentImage} alt="Large" className="w-[55%]  object-contain" />
                    </div>
                </Modal>
            </div>
        );
    };

    return (
        <div className="max-h-screen custom-mini1 custom-air2 custom-air-pro custom-nest-hub custom-nest-hub-max">
            <div className="bg-white  overflow-x-auto  xl:overflow-hidden overflow-y-hidden border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Phim</h1>

                <div className="grid grid-cols-4 gap-6  items-center w-full h-16 px-3 min-w-[900px]">
                    <AutoInputComponent
                        options={optionMovie.map((item) => item.name.toUpperCase())}
                        value={inputSearch}
                        onChange={(newValue) => handleSearch(newValue)}
                        title="Tên phim"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập"
                        heightSelect={200}
                        borderRadius="10px"
                      
                    />
                    <AutoInputComponent
                        options={optionGenre?.map((option) => option.name)}
                        value={selectedSort}
                        onChange={(newValue) => sortMovie(newValue)}
                        title="Thể loại"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Thể loại"
                        heightSelect={200}
                        borderRadius="10px"
                        onBlur={(event) => {
                            event.preventDefault();
                        }}
                    />
                    <div className="grid col-span-2 gap-6 grid-cols-5">
                        <div className="col-span-3">
                            <h1 className="text-[16px] truncate mb-1">Ngày phát hành</h1>
                            <RangePicker
                                value={rangePickerValue}
                                onChange={onChangeRanger}
                                placeholder={['Từ ngày', 'Đến ngày']}
                                placement="bottomRight"
                                format={'DD-MM-YYYY'}
                                className="border py-[6px] px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[10px] hover:border-[black] "
                            />
                        </div>

                        <div className="col-span-2">
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
                </div>
            </div>

            <div className="bg-white border shadow-md rounded-[10px] box-border py-3 h-[515px] max-h-screen custom-height-sm custom-height-xs custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto overflow-y-hidden h-[100%]">
                    <div className="bg-white border-b py-1 justify-center items-center uppercase text-[13px] font-bold text-slate-500 grid grid-cols-12 gap-2 min-w-[1200px] pr-6">
                        <div className="grid justify-center grid-cols-10 col-span-3 gap-2 items-center">
                            <h1 className="grid justify-center col-span-2 items-center">STT</h1>
                            <h1 className="grid justify-center col-span-4 items-center ">Mã phim</h1>
                            <h1 className="grid justify-center items-center col-span-4">Thể loại phim</h1>
                        </div>
                        <h1 className="grid justify-center items-center">Hình ảnh</h1>
                        <h1 className="grid justify-center items-center col-span-2">Tên phim</h1>
                        <h1 className="grid justify-center items-center">Thời lượng</h1>
                        <div className="grid col-span-3 grid-cols-7">
                            <h1 className="grid justify-center items-center col-span-4">Ngày phát hành</h1>
                            <h1 className="grid justify-center items-center col-span-3">Ngày kết thúc</h1>
                        </div>
                        <div className="grid grid-cols-7 justify-center col-span-2 ">
                            <h1 className="grid col-span-5 justify-center items-center">Trạng thái</h1>
                            <div className="col-span-2 justify-center grid">
                                <button
                                    className="border px-4 py-[3px]  rounded-[40px] gradient-button"
                                    onClick={() => {
                                        handleOpen(false);
                                    }}
                                >
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="py-1 min-w-[1100px]">
                        <List
                            itemCount={movieFilter.length === 0 ? movies?.length : movieFilter.length}
                            itemSize={135}
                            height={height}
                            width={1200}
                            style={{ minWidth: '1200px' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style }, movieFilter.length === 0 ? movies : movieFilter)
                            }
                        </List>
                    </div>
                </div>
            </div>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="70%" // Kích thước mặc định
                height="88%"
                smallScreenWidth="90%" // Kích thước cho màn hình nhỏ
                smallScreenHeight="64%"
                mediumScreenWidth="80%" // Kích thước cho màn hình trung bình
                mediumScreenHeight="57%"
                largeScreenHeight="50%" // Kích thước cho màn hình lớn
                maxHeightScreenHeight="93%" // Kích thước khi màn hình có chiều cao nhỏ
                title={isUpdate ? 'Chỉnh sửa phim' : 'Thêm phim'}
            >
                <div className="h-[90%] ">
                    <div
                        className=" h-[100%] overflow-y-auto grid grid-rows-9
                         custom-height-sm22 gap-6"
                    >
                        <div className="grid grid-cols-7 p-2 ">
                            <div className="grid grid-cols-6 col-span-3 gap-5">
                                <AutoInputComponent
                                    value={isUpdate ? selectedFilm?.name : name}
                                    onChange={setName}
                                    title="Tên phim"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-4"
                                    disabled={isUpdate ? true : false}
                                />
                                <AutoInputComponent
                                    value={String(isUpdate ? selectedFilm?.duration : duration)}
                                    onChange={setDuration}
                                    title="Thời lượng"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-2"
                                    disabled={isUpdate ? true : false}
                                />
                            </div>
                            <div className="grid grid-cols-6 col-span-4 ml-5 gap-5">
                                <div className="col-span-4">
                                    <h1 className="text-[16px] truncate mb-1 ">Thể loại</h1>

                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Chọn thể loại"
                                        value={
                                            isUpdate
                                                ? selectedGenre?.length > 0
                                                    ? selectedGenre
                                                    : selectedFilm?.movieGenreCode.map((genre) => genre.code) || []
                                                : selectedGenre
                                        }
                                        onChange={handleChangeDay}
                                        className="h-[36px] w-full border border-black rounded-[5px]"
                                        listHeight={170}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        maxTagCount={maxTagCount}
                                        disabled={isUpdate ? true : false}
                                    >
                                        {optionGenre.map((option) => (
                                            <Option key={option.code} value={option.code}>
                                                {option.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <AutoInputComponent
                                    options={optionsQG.map((option) => option.label)}
                                    value={country}
                                    onChange={(newValue) => setCountry(newValue)}
                                    title="Quốc gia"
                                    freeSolo={false}
                                    disableClearable={true}
                                    placeholder="Nhập quốc gia"
                                    heightSelect={150}
                                    className1="col-span-2"
                                    disabled={isUpdate ? true : false}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-2">
                            <div className="grid grid-cols-5 gap-5 ">
                                <AutoInputComponent
                                    value={isUpdate ? selectedFilm?.director : director}
                                    onChange={setDirector}
                                    title="Đạo diễn"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-3"
                                    disabled={isUpdate ? true : false}
                                />

                                <div className="col-span-2">
                                    <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                    <DatePicker
                                        value={startDate}
                                        minDate={dayjs()}
                                        onChange={onChangeStart}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Chọn ngày"
                                        format="DD-MM-YYYY"
                                        disabled={isUpdate ? true : false}
                                        className="border py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-5 ml-5">
                                <div className="col-span-3">
                                    <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                    <DatePicker
                                        value={endDate}
                                        minDate={startDate ? dayjs(startDate) : dayjs()}
                                        onChange={onChangeEnd}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Chọn ngày"
                                        format="DD-MM-YYYY"
                                        disabled={isUpdate ? true : false}
                                        className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                    />
                                </div>
                                <AutoInputComponent
                                    options={optionTuoi.map((option) => option.label)}
                                    value={ageRestriction}
                                    onChange={(newValue) => setAgeRestriction(newValue)}
                                    title="Giới hạn tuổi"
                                    freeSolo={false}
                                    disableClearable={true}
                                    placeholder="Nhập ..."
                                    heightSelect={150}
                                    className1="col-span-2"
                                    disabled={isUpdate ? true : false}
                                />
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="grid grid-cols-4 space-x-5 ">
                                <AutoInputComponent
                                    value={isUpdate ? selectedFilm?.cast : cast}
                                    onChange={setCast}
                                    title="Diễn viên"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-3"
                                    disabled={isUpdate ? true : false}
                                />

                                <AutoInputComponent
                                    value={isUpdate ? changStatus(selectedFilm?.status) : changStatus(statusFilm)}
                                    onChange={handleStatusChang}
                                    options={
                                        selectedFilm?.status === 0
                                            ? optionsStatus.filter((item) => item.value !== 2).map((item) => item.name)
                                            : optionsStatus.filter((item) => item.value !== 0).map((item) => item.name)
                                    }
                                    freeSolo={false}
                                    disableClearable={true}
                                    title="Trạng thái"
                                    placeholder="Chưa phát hành"
                                    
                                    heightSelect={150}
                                    disabled={!isUpdate || selectedFilm?.status === 1 ? true : false}
                                />
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="grid grid-cols-5 space-x-5 ">
                                <InputComponent
                                    title="Hình ảnh"
                                    className="rounded-[5px]"
                                    className1="col-span-2"
                                    type="file"
                                    onChange={handleImageChange}
                                />

                                <AutoInputComponent
                                    value={isUpdate ? selectedFilm?.trailer : trailer}
                                    onChange={setTrailer}
                                    title="Trailer"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    heightSelect={200}
                                    className1="col-span-3"
                                />
                            </div>
                        </div>

                        <div className="px-3 row-span-2 custom-height-sm23  mt-[6px] h-32">
                            {selectedImage ? (
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="phim1"
                                    className="w-28 custom-height-sm24 h-[135px] object-contain"
                                />
                            ) : (
                                isUpdate && (
                                    <img
                                        src={selectedFilm?.image}
                                        alt="phim1"
                                        className="w-28 custom-height-sm24 h-[135px] object-contain"
                                    />
                                )
                            )}
                        </div>
                        <div className="grid row-span-2 p-2 ">
                            <div className="">
                                <h1 className="text-[16px] truncate mb-1">Mô tả</h1>
                                <textarea
                                    className="border py-[6px] px-4 border-[gray] rounded-[5px] w-full h-90p resize-none overflow-auto"
                                    placeholder="Nhập mô tả"
                                    defaultValue={isUpdate ? selectedFilm?.description : descriptionRef.current} // Thiết lập giá trị mặc định
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid row-span-1 items-center border-t py-2">
                            <div className="justify-end flex space-x-3 px-4">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                <ButtonComponent
                                    text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                    className="bg-blue-500"
                                    onClick={isUpdate ? () => mutation.mutate(selectedFilm?.code) : handleAddMovie}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDetail}
                handleClose={handleCloseDetail}
                width="60%"
                height="80%"
                smallScreenWidth="80%"
                smallScreenHeight="60%"
                mediumScreenWidth="80%"
                mediumScreenHeight="50%"
                largeScreenHeight="45%"
                largeScreenWidth="70%"
                maxHeightScreenHeight="92%"
                maxHeightScreenWidth="70%"
                heightScreen="75%"
                title="Chi tiết phim"
            >
                <div className="h-90p grid grid-rows-12 gap-2 ">
                    <div className="grid row-span-11">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid  grid-cols-2 gap-2">
                                    <h1 className=" font-bold">Mã phim:</h1>
                                    <h1 className=" font-normal">{selectedFilm?.code}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Tên phim:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedFilm?.name}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Thời lượng:</h1>
                                    <h1 className="font-normal">{selectedFilm?.duration} phút</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Thể loại:</h1>
                                    <h1 className="grid col-span-2 font-normal">
                                        {selectedFilm?.movieGenreCode.map((genre) => genre.name).join(', ')}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Quốc gia:</h1>
                                    <h1 className="font-normal">{selectedFilm?.country}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Giới hạn độ tuổi:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedFilm?.ageRestriction}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày phát hành:</h1>
                                    <h1 className="font-normal">{getFormatteNgay(selectedFilm?.startDate)}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày kết thúc:</h1>
                                    <h1 className="grid col-span-2 font-normal">
                                        {getFormatteNgay(selectedFilm?.endDate)}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Đạo diễn:</h1>
                                    <h1 className="grid  font-normal">{selectedFilm?.director}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Diễn viên:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedFilm?.cast}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày tạo:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedFilm?.createdAt)}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày cập nhật:</h1>
                                    <h1 className="grid col-span-2 font-normal">
                                        {FormatSchedule(selectedFilm?.updatedAt)}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <h1 className="font-bold">Hình ảnh:</h1>
                                    <img
                                        src={selectedFilm?.image}
                                        alt="phim1"
                                        className="w-28 h-[135px] object-contain"
                                    />
                                </div>
                                <div className="grid gap-2 grid-cols-2 ">
                                    <h1 className="font-bold">Trailer:</h1>
                                    <div>
                                        <ButtonComponent text="Xem ngay" onClick={handleShowVideo} />
                                    </div>
                                </div>
                                <div className="grid gap-2 grid-cols-2 ">
                                    <h1 className="font-bold">Trạng thái:</h1>
                                    <h1 className="font-normal">{changStatus(selectedFilm?.status)}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid gap-2 grid-cols-12">
                                <h1 className="font-bold w-[80px]">Mô tả:</h1>
                                <h1 className="font-normal ml-2 col-span-11">{selectedFilm?.description}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="justify-end flex space-x-3 mt-1  border-t pr-4">
                        <div className="space-x-3 mt-[6px]">
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleCloseDetail} />
                        </div>
                    </div>

                    {showVideo && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center">
                            <iframe
                                width="640"
                                height="360"
                                src={youtubeEmbedUrl}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube Video"
                            ></iframe>
                            <button
                                className="absolute top-4 right-4 bg-[#a6a6a7] text-white p-2 rounded"
                                onClick={() => setShowVideo(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            </ModalComponent>

            <ModalComponent
                open={openDelete}
                handleClose={handleCloseDelete}
                width="25%"
                height="32%"
                smallScreenWidth="40%"
                smallScreenHeight="25%"
                mediumScreenWidth="40%"
                mediumScreenHeight="20%"
                largeScreenHeight="20%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="40%"
                maxHeightScreenWidth="40%"
                title="Xóa phim"
            >
                <div className="h-[80%] grid grid-rows-3 ">
                    <h1 className="grid row-span-2 p-3">
                        Bạn đang thực hiện xóa phim này. Bạn có chắc chắn xóa không?
                    </h1>
                    <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xóa"
                                className="bg-blue-500"
                                onClick={() => handleDeleteMovie(selectedFilm?.code)}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
});

export default Film;
