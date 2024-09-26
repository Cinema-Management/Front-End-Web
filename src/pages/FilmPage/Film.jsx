import React, { useRef, useState } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import InputComponent from '~/components/InputComponent/InputComponent';
import SelectComponent from '~/components/SelectComponent/SelectComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import axios from 'axios';
import Select from '~/components/Select';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { FaRegEye } from 'react-icons/fa6';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LazyLoad from 'react-lazy-load';
import { useQuery } from 'react-query';
import Loading from '~/components/LoadingComponent/Loading';

const fetchMoviesAndGenres = async () => {
    const [moviesResponse, genresResponse] = await Promise.all([
        axios.get('api/movies'), // API để lấy dữ liệu phim
        axios.get('api/movie-genres'), // API để lấy dữ liệu thể loại phim
    ]);

    return {
        movies: moviesResponse.data, // Dữ liệu phim
        genres: genresResponse.data, // Dữ liệu thể loại phim
    };
};

const Film = React.memo(() => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const descriptionRef = useRef('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [name, setName] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [duration, setDuration] = useState('');
    const [trailer, setTrailer] = useState('');
    const [ageRestriction, setAgeRestriction] = useState();
    const [director, setDirector] = useState('');
    const [cast, setCast] = useState('');
    const [country, setCountry] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selecteFilm, setSelectedFilm] = useState([]);
    const [detailMovie, setDetailMovie] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    // Sử dụng useQuery cho phim
    const {
        data: { movies, genres } = {},
        // Khởi tạo giá trị mặc định để tránh lỗi nếu dữ liệu chưa có
        error,
        isLoading,
        isFetched,
        refetch,
    } = useQuery('moviesAndGenres', fetchMoviesAndGenres, {
        staleTime: 1000 * 60 * 3, // Dữ liệu còn mới trong 3 phút
        cacheTime: 1000 * 60 * 10, // Giữ trong cache 10 phút
        // refetchInterval: 30000, // Tự động tải lại dữ liệu sau 10 giây
    });

    // Kiểm tra trạng thái tải
    if (isLoading) return <Loading />;
    if (!isFetched) return <div>Fetching...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    const handleOpen = (isUpdate) => {
        setOpen(true);
        setIsUpdate(isUpdate);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedImage(null);
        setDetailMovie(false);
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setAgeRestriction(event.target.value);
        setName(event.target.value);
    };
    // Khởi tạo ref cho mô tả

    const handleInputChange = (event) => {
        descriptionRef.current = event.target.value; // Cập nhật giá trị vào ref
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

    // Hàm xử lý khi người dùng chọn ảnh
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
    };
    const optionsQG = [
        { value: '0', label: 'Chọn' },
        { value: 'VN', label: 'Việt Nam' },
        { value: 'TL', label: 'Thái Lan' },
        { value: 'HQ', label: 'Hàn Quốc' },
        { value: 'A', label: 'Anh' },
        { value: 'TL', label: 'Nhật Bản' },
    ];

    const optionTuoi = [
        { value: '1', label: 'Chọn' },
        { value: '13', label: 'C13' },
        { value: '16', label: 'C16' },
        { value: '18', label: 'C18' },
        { value: '0', label: 'Không giới hạn' },
    ];

    const optionsSort = [
        { value: '0', label: 'Xếp theo tên' },
        { value: 'A', label: 'A - Z' },
        { value: 'B', label: 'Z - A' },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleFormData = () => {
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
        formData.append('status', 0);
        if (Array.isArray(selectedGenre)) {
            selectedGenre.forEach((code) => formData.append('movieGenreCode', code));
        } else {
            return;
        }

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        return formData;
    };

    const handleAddMovie = async () => {
        // Thêm các giá trị vào FormData
        const formData = handleFormData();
        try {
            await axios.post('api/movies', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Thêm phim thành công!');
            clearText();
            handleClose();
            refetch();
        } catch (error) {
            alert('Đã xảy ra lỗi: ' + error.response.data.message);
        }
    };

    const handleUpdateStatusMovie = async (movieCode, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        try {
            await axios.put(
                `api/movies/${movieCode}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            alert('Cập nhật status phim thành công!');
            refetch();
        } catch (error) {
            alert('Đã xảy ra lỗi: ' + error.response.data.message);
        }
    };

    const handleUpdateMovie = async (movieCode) => {
        const formData = handleFormData();
        try {
            const response = await axios.put(`api/movies/${movieCode}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            alert('Cập nhật phim thành công!');
            clearText();
            handleClose();
            refetch();
            setSelectedImage(null);
        } catch (error) {
            alert('Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Phim</h1>
                <div className="overflow-x-auto  xl:overflow-hidden">
                    <div className="grid grid-cols-5 gap-6  items-center w-full h-16 px-3 min-w-[1100px] max-lg:pr-24 custom-hubmax2">
                        <AutoInputComponent
                            options={rap.map((option) => option.name)}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Tên rạp"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Tên rạp"
                            heightSelect={200}
                            borderRadius="10px"
                        />
                        <AutoInputComponent
                            options={genres.map((option) => option.name)}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Thể loại"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Thể loại"
                            heightSelect={200}
                            borderRadius="10px"
                        />
                        <InputComponent className="rounded-[10px] " title="Ngày bắt đầu" type="date" />
                        <InputComponent className="rounded-[10px] " title="Ngày kết thúc" type="date" />
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
            </div>

            <div className="bg-white border shadow-md rounded-[10px] box-border  h-[515px] max-h-screen custom-height-sm custom-height-xs custom-height-md custom-height-lg custom-hubmax custom-height-xl">
                <div className="overflow-auto h-[100%]">
                    <div className="bg-white border-b sticky top-0 z-10 px-1 py-3 uppercase text-[13px] font-bold text-slate-500 grid grid-cols-12 items-center gap-2 min-w-[1100px] max-lg:pr-24 custom-hubmax2">
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
                                    className="border px-4 py-[3px]  rounded-[40px] bg-orange-400"
                                    onClick={() => {
                                        handleOpen(false);
                                    }}
                                >
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="py-1 px-1">
                        {movies.map((item, index) => (
                            <LazyLoad key={item.movieId} height={115} offsetTop={200}>
                                <div className="border-b text-[15px] font-normal py-2 text-slate-500 grid grid-cols-12 items-center gap-2 min-w-[1100px] max-lg:pr-24 custom-hubmax2">
                                    <div className="grid justify-center grid-cols-10 col-span-3 gap-2 items-center ">
                                        <h1 className="grid col-span-2 pl-3 items-center">{index + 1}</h1>
                                        <h1 className="grid col-span-4 pl-3 items-center ">{item.code}</h1>
                                        <h1 className="grid items-center col-span-4 pl-3">
                                            {item.movieGenreCode.map((genre) => genre.name).join(', ')}
                                        </h1>
                                    </div>

                                    <LazyLoadImage src={item.image} alt={item.name} width={65} />

                                    <h1 className="grid items-center pl-3 col-span-2 uppercase">{item.name}</h1>
                                    <h1 className="grid justify-center items-center">{item.duration} phút</h1>
                                    <div className="grid col-span-3 grid-cols-7">
                                        <h1 className="grid justify-center col-span-4 items-center">
                                            {formatDate(item.startDate)}
                                        </h1>
                                        <h1 className="grid justify-center col-span-3 items-center">
                                            {formatDate(item.endDate)}
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-7 justify-center col-span-2 ">
                                        <div className="grid col-span-5  justify-center items-center">
                                            <button
                                                className={`border px-2  uppercase text-white text-[13px] py-[2px] flex rounded-[40px] ${
                                                    item.status === 0 ? 'bg-gray-400' : 'bg-green-500'
                                                }`}
                                                onClick={() => handleUpdateStatusMovie(item.code, item.status)}
                                            >
                                                {item.status === 0 ? 'Hết hiệu lực' : 'Có hiệu lực'}
                                            </button>
                                        </div>

                                        <div className=" col-span-2 justify-center items-center flex">
                                            <button
                                                className="mr-[8px] py-1 max-lg:mr-1"
                                                onClick={() => {
                                                    handleOpen(true);
                                                    setSelectedFilm(item);
                                                }}
                                            >
                                                <FaRegEdit color="black" size={22} />
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
                            </LazyLoad>
                        ))}
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
                                    value={isUpdate ? selecteFilm?.name : name}
                                    onChange={setName}
                                    title="Tên phim"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-4"
                                />
                                <AutoInputComponent
                                    value={String(isUpdate ? selecteFilm?.duration : duration)}
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
                                <Select
                                    options={genres?.map((option) => ({
                                        title: option.name,
                                        code: option.code,
                                    }))}
                                    // placeholder="Nhập ..."
                                    onChange={(selectedOptions) => {
                                        const selectedCodes = selectedOptions?.map((option) => option.code);
                                        setSelectedGenre(selectedCodes);
                                    }}
                                    disableClearable={true}
                                    heightSelect={150}
                                    title={'Thể loại'}
                                    className1="col-span-4 max:lg:bg-red-500"
                                />
                                <AutoInputComponent
                                    options={optionsQG.map((option) => option.label)}
                                    value={isUpdate ? selecteFilm?.country : country}
                                    onChange={setCountry}
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
                                    value={isUpdate ? selecteFilm?.director : director}
                                    onChange={setDirector}
                                    title="Đạo diễn"
                                    freeSolo={true}
                                    disableClearable={false}
                                    placeholder="Nhập ..."
                                    heightSelect={200}
                                    className1="col-span-3"
                                />
                                <InputComponent
                                    title="Ngày phát hành"
                                    className="rounded-[5px]"
                                    className1="col-span-2"
                                    type="date"
                                    value={
                                        startDate ||
                                        (isUpdate ? new Date(selecteFilm?.startDate).toISOString().slice(0, 10) : '')
                                    } // Cập nhật giá trị
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-5 ml-5">
                                <InputComponent
                                    title="Ngày kết thúc"
                                    className="rounded-[5px]"
                                    className1="col-span-3"
                                    type="date"
                                    value={
                                        endDate ||
                                        (isUpdate ? new Date(selecteFilm?.endDate).toISOString().slice(0, 10) : '')
                                    }
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <AutoInputComponent
                                    options={optionTuoi.map((option) => option.label)}
                                    value={
                                        isUpdate
                                            ? selecteFilm?.ageRestriction === 13
                                                ? 'C13'
                                                : selecteFilm?.ageRestriction === 16
                                                ? 'C16'
                                                : selecteFilm?.ageRestriction === 18
                                                ? 'C18'
                                                : selecteFilm?.ageRestriction === 0
                                                ? 'Không giới hạn'
                                                : 'Chọn'
                                            : ageRestriction
                                    }
                                    onChange={setAgeRestriction}
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
                                value={isUpdate ? selecteFilm?.cast : cast}
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
                                    value={isUpdate ? selecteFilm?.trailer : trailer}
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
                                        src={selecteFilm?.image}
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
                                    defaultValue={isUpdate ? selecteFilm?.description : descriptionRef.current} // Thiết lập giá trị mặc định
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {detailMovie && (
                            <div className="grid p-2">
                                <div className="grid grid-cols-2 gap-5">
                                    <InputComponent
                                        placeholder="30-08-2024 03:06:17"
                                        title="Ngày tạo"
                                        className="rounded-[5px] bg-[#707070] "
                                        disabled={true}
                                    />
                                    <InputComponent
                                        placeholder="30-08-2024 03:06:17"
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
                                                isUpdate ? () => handleUpdateMovie(selecteFilm?.code) : handleAddMovie
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
