import React, { useRef, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import InputComponent from '~/components/InputComponent/InputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import axios from 'axios';
import { DatePicker, Select } from 'antd';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { FaRegEye } from 'react-icons/fa6';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { FixedSizeList as List } from 'react-window';
import HeightComponent from '~/components/HeightComponent/HeightComponent';
const { Option } = Select;

const { getFormattedDate, getFormatteNgay, FormatDate } = require('~/utils/dateUtils');

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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [detailMovie, setDetailMovie] = useState(false);
    const maxTagCount = window.innerWidth < 1025 ? 1 : 2;
    const [movieFilter, setMovieFilter] = useState([]);
    const [inputSearch, setInputSearch] = useState('');
    const [selectedSort, setSelectedSort] = useState(null);
    const [rangePickerValue, setRangePickerValue] = useState(['', '']);
    const height = HeightComponent();
    const { RangePicker } = DatePicker;

    const optionStatus = [
        { value: 3, name: 'Tất cả' },
        { value: 1, name: 'Đã phát hành' },
        { value: 2, name: 'Chưa phát hành' },
    ];

    const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
    const {
        data: { movies = [], optionMovie = [] } = {},
        error,
        isLoading,
        isFetched,
        refetch,
    } = useQuery('movies', fetchMovies, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
        onSuccess: (data) => {
            setMovieFilter(data.movies);
        },
    });

    const {
        data: { optionGenre = [] } = {},
        errorGenre,
        isLoadingGenre,
        isFetchedGenre,
    } = useQuery('genres', fetchGenres, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });
    // Kiểm tra trạng thái tải
    if (isLoading || isLoadingGenre) return <Loading />;
    if (!isFetched || isFetchedGenre) return <div>Fetching...</div>;
    if (error || errorGenre) return <div>Error loading data: {error.message}</div>;

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setOpen(false);

        setDetailMovie(false);
        setSelectedFilm(null);
        clearText();
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
        if (option.value === 1) {
            sortedStatus = movies.filter((item) => item.status === 1);
            setMovieFilter(sortedStatus);
        } else if (option.value === 2) {
            sortedStatus = movies.filter((item) => item.status === 0);
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
            console.log(itemDate);
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
        setStartDate('');
        setEndDate('');
        descriptionRef.current = '';
        setSelectedGenre(null);
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
    ];
    const onChangeStart = (date, dateString) => {
        setStartDate(dateString);
    };

    const onChangeEnd = (date, dateString) => {
        setEndDate(dateString);
    };
    const optionTuoi = [
        { value: '1', label: 'Chọn' },
        { value: '13', label: 'C13' },
        { value: '16', label: 'C16' },
        { value: '18', label: 'C18' },
        { value: '0', label: 'Không giới hạn' },
    ];

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

        return formData;
    };

    const validate = () => {
        if (isUpdate) return true;
        if (!name) {
            toast.error('Vui lòng nhập tên.');
            return false;
        }
        if (!duration) {
            toast.error('Vui lòng nhập thời lượng.');
            return false;
        }
        if (!selectedGenre) {
            toast.error('Vui lòng chọn thể loại.');
            return false;
        }
        if (!country) {
            toast.error('Vui lòng chọn quốc gia.');
            return false;
        }
        if (!director) {
            toast.error('Vui lòng nhập đạo diễn.');
            return false;
        }

        if (!startDate) {
            toast.error('Vui lòng chọn ngày phát hành.');
            return false;
        }
        if (!endDate) {
            toast.error('Vui lòng chọn ngày kết thúc.');
            return false;
        }
        if (!ageRestriction) {
            toast.error('Vui lòng chọn độ tuổi.');
            return false;
        }
        if (!cast) {
            toast.error('Vui lòng nhập dàn diễn viên.');
            return false;
        }

        if (!trailer) {
            toast.error('Vui lòng nhập trailer.');
            return false;
        }
        if (!selectedImage) {
            toast.error('Vui lòng chọn hình ảnh.');
            return false;
        }
        if (!descriptionRef.current) {
            toast.error('Vui lòng thêm hình ảnh.');
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

    const handleUpdateStatusMovie = async (item) => {
        const movieCode = item.code;
        if (item.status === 1) {
            toast.info('Phim đã được phát hành!');
            return;
        }
        try {
            await axios.put(
                `api/movies/${movieCode}`,
                {
                    status: 1,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            toast.success('Cập nhật status phim thành công!');
            refetch();
        } catch (error) {
            toast.error('Câp nhật status phim thất bại!');
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
            !startDate &&
            !endDate
        ) {
            toast.error('Vui lòng nhập thông tin cần cập nhật!');
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

    const rowRenderer = ({ index, style }, data) => {
        const reversedData = [...data].reverse();
        const item = reversedData[index];

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
                    <LazyLoadImage src={item.image} alt={item.name} width={65} />
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
                                item.status === 0 ? 'bg-gray-400' : 'bg-green-500'
                            }`}
                            onClick={() => handleUpdateStatusMovie(item)}
                        >
                            {item.status === 0 ? 'Chưa phát hành' : 'Đã phát hành'}
                        </button>
                    </div>

                    <div className=" col-span-2 ml-6 justify-center items-center flex">
                        <button
                            className="mr-[8px] py-1 max-lg:mr-1 cursor-pointer"
                            onClick={() => {
                                handleOpen(true);
                                setSelectedFilm(item);
                                setCountry(item.country);
                                setAgeRestriction(getAgeRestrictionLabel(item?.ageRestriction));
                            }}
                            disabled={item.status === 1 ? true : false}
                        >
                            <FaRegEdit color={` ${item.status !== 0 ? 'bg-gray-100' : 'black'}  `} size={22} />
                        </button>
                        <button
                            className=" py-1"
                            onClick={() => {
                                handleOpen(true);
                                setSelectedFilm(item);
                                setDetailMovie(true);
                            }}
                        >
                            <FaRegEye color="black" size={22} />
                        </button>
                    </div>
                </div>
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
                                format={'YYYY-MM-DD'}
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
                            itemSize={120}
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
                title={detailMovie ? 'Chi tiết phim' : isUpdate ? 'Chỉnh sửa phim' : 'Thêm phim'}
            >
                <div className={`h-[90%] ${detailMovie ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
                    <div
                        className={` h-[100%] ${detailMovie ? 'min-h-[700px]' : ''} overflow-y-auto grid ${
                            detailMovie ? 'grid-rows-10' : 'grid-rows-9'
                        } custom-height-sm22 gap-6 `}
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
                                        dropdownStyle={{ maxHeight: '170px' }}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        maxTagCount={maxTagCount}
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
                                />

                                <div className="col-span-2">
                                    <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                    <DatePicker
                                        value={
                                            startDate
                                                ? dayjs(startDate)
                                                : isUpdate && selectedFilm?.startDate
                                                ? dayjs(selectedFilm.startDate)
                                                : null
                                        }
                                        minDate={dayjs()}
                                        onChange={onChangeStart}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Chọn ngày"
                                        format="YYYY-MM-DD"
                                        className="border py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-5 ml-5">
                                <div className="col-span-3">
                                    <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                    <DatePicker
                                        value={
                                            endDate
                                                ? dayjs(endDate)
                                                : isUpdate && selectedFilm?.endDate
                                                ? dayjs(selectedFilm.endDate)
                                                : null
                                        }
                                        minDate={startDate ? dayjs(startDate) : dayjs()}
                                        onChange={onChangeEnd}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Chọn ngày"
                                        format="YYYY-MM-DD"
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
                                />
                            </div>
                        </div>

                        <div className="w-full p-2">
                            <AutoInputComponent
                                value={isUpdate ? selectedFilm?.cast : cast}
                                onChange={setCast}
                                title="Diễn viên"
                                freeSolo={true}
                                disableClearable={false}
                                placeholder="Nhập ..."
                                heightSelect={200}
                            />
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

                        {detailMovie && (
                            <div className="grid p-2">
                                <div className="grid grid-cols-2 gap-5">
                                    <InputComponent
                                        value={getFormattedDate(selectedFilm?.createdAt)}
                                        title="Ngày tạo"
                                        className="rounded-[5px] bg-[#707070] "
                                        disabled={true}
                                    />
                                    <InputComponent
                                        value={getFormattedDate(selectedFilm?.updatedAt)}
                                        title="Ngày cập nhật"
                                        className="rounded-[5px] bg-[#707070] "
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className={`grid row-span-1 items-center border-t ${
                                detailMovie ? 'mt-[6px]' : 'mt-[0px] '
                            } py-2`}
                        >
                            <div className="justify-end flex space-x-3 px-4">
                                {!detailMovie ? (
                                    <>
                                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                                        <ButtonComponent
                                            text={isUpdate ? 'Cập nhật' : 'Thêm mới'}
                                            className="bg-blue-500"
                                            onClick={
                                                isUpdate ? () => handleUpdateMovie(selectedFilm?.code) : handleAddMovie
                                            }
                                        />
                                    </>
                                ) : (
                                    <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleClose} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
});

export default Film;
