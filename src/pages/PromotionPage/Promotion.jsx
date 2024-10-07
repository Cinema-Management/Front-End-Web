import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp, FaRegEye } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import InputComponent from '~/components/InputComponent/InputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import axios from 'axios';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
// import TextField from '@mui/material/TextField';
import { DatePicker } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';

const sortPromotions = (promotions) => {
    // Sắp xếp danh sách khuyến mãi theo startDate tăng dần
    const sortedPromotions = promotions.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Sắp xếp promotionLines cho từng khuyến mãi
    sortedPromotions.forEach((promotion) => {
        promotion.promotionLines.sort((a, b) => {
            // Sắp xếp theo type trước (0 trước 2, 1 trước 2)
            if (a.type !== b.type) {
                return a.type - b.type;
            }
            // Nếu type giống nhau, sắp xếp theo startDate tăng dần
            return new Date(a.startDate) - new Date(b.startDate);
        });
    });

    return sortedPromotions;
};

const fetchPromotionsWithLines = async () => {
    try {
        const response = await axios.get('api/promotions/getPromotionsWithLines');

        const data = response.data;

        // Chuyển đổi dữ liệu thành định dạng cho MultiSelect
        const arrayPromotion = data.map((promotion) => ({
            name: promotion.name, // Hiển thị tên
            code: promotion.code, // Giá trị sẽ được gửi về
        }));

        return { promotions: sortPromotions(data), optionNameCinema: arrayPromotion };
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

const Promotion = () => {
    const [openKM, setOpenKM] = useState(false);
    const [openKMDetail, setOpenKMDetail] = useState(false);
    const [openKMLine, setOpenKMLine] = useState(false);
    const [isUpdateKM, setIsUpdateKM] = useState(false);
    const [isUpdateKMLine, setIsUpdateKMLine] = useState(false);
    const [isUpdateKMDetail, setIsUpdateKMDetail] = useState(false);

    const [type, setType] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedStartDateKM, setSelectedStartDateKM] = useState(null);
    const [selectedEndDateKM, setSelectedEndDateKM] = useState(null);
    const [descriptionKM, setDescriptionKM] = useState('');

    const [selectedStartDateKMLine, setSelectedStartDateKMLine] = useState(null);
    const [selectedEndDateKMLine, setSelectedEndDateKMLine] = useState(null);
    const [descriptionKMLine, setDescriptionKMLine] = useState('');

    const [selectedKM, setSelectedKM] = useState([]);
    const [selectedKMLine, setSelectedKMLine] = useState([]);
    const [selectedKMDetail, setSelectedKMDetail] = useState([]);

    const [selectedOptionKMLine, setSelectedOptionKMLine] = useState('');

    const optionKMLines = [
        { name: 'Khuyến mãi hàng', value: 0 },
        { name: 'Khuyến mãi tiền', value: 1 },
        { name: 'Chiết khấu hóa đơn', value: 2 },
    ];

    const {
        data: { promotions = [], optionNameCinema = [] } = {},
        isLoading: isLoadingPromotions,
        error: PromotionError,
        refetch: refetchKM,
    } = useQuery('fetchPromotionsWithLines', fetchPromotionsWithLines, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    isLoadingPromotions && <Loading />;
    PromotionError && toast.error(PromotionError.message);

    const handleOpenKM = (isUpdateKM) => {
        setOpenKM(true);
        setIsUpdateKM(isUpdateKM);
    };

    const handleCloseKM = () => {
        setOpenKM(false);
        cleanTextKM();
    };

    const handleOpenKMLine = (isUpdateKMLine) => {
        setOpenKMLine(true);
        setIsUpdateKMLine(isUpdateKMLine);
    };
    const handleCloseKMLine = () => {
        setOpenKMLine(false);
    };

    const handOpenKMDetail = (isUpdateKMDetail) => {
        setType(type);
        setOpenKMDetail(true);
    };
    const handleCloseKMDetail = () => setOpenKMDetail(false);

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

    // clean text

    const cleanTextKM = () => {
        setSelectedEndDateKM(null);
        setSelectedStartDateKM(null);
        setDescriptionKM('');
        // setSelectedKM([]);
    };

    //check action KM

    const validateKM = () => {
        if (!descriptionKM) {
            toast.warning('Vui lòng nhập mô tả');
            return false;
        }
        if (!selectedStartDateKM) {
            toast.warning('Vui lòng chọn ngày bắt đầu');
            return false;
        }
        if (!selectedEndDateKM) {
            toast.warning('Vui lòng chọn ngày kết thúc');
            return false;
        }

        return true;
    };

    const validateKMLine = () => {
        if (!selectedOptionKMLine) {
            toast.warning('Vui lòng chọn loại khuyến mãi');
            return false;
        }
        if (!descriptionKMLine) {
            toast.warning('Vui lòng nhập mô tả');
            return false;
        }
        if (!selectedStartDateKMLine) {
            toast.warning('Vui lòng chọn ngày bắt đầu');
            return false;
        }
        if (!selectedEndDateKMLine) {
            toast.warning('Vui lòng chọn ngày kết thúc');
            return false;
        }

        return true;
    };

    const checkPromotionAddAndUpdate = (promotions, startDate, endDate) => {
        const currentDate = new Date();

        // Kiểm tra ngày bắt đầu có lớn hơn ngày hiện tại hay không
        if (new Date(startDate) <= currentDate) {
            toast.warning('Ngày bắt đầu phải lớn hơn ngày hiện tại');
            return false; // Trả về false nếu có lỗi
        }

        // Kiểm tra ngày kết thúc có lớn hơn hoặc bằng ngày bắt đầu không
        if (new Date(endDate) < new Date(startDate)) {
            toast.warning('Ngày ket thuc phải lớn hơn hoặc bằng ngày bắt đầu');
            return false; // Trả về false nếu có lỗi
        }

        // Kiểm tra chồng chéo ngày với các chương trình khuyến mãi khác
        for (const promotion of promotions) {
            const existingStartDate = new Date(promotion.startDate);
            const existingEndDate = new Date(promotion.endDate);

            if (promotion.code === selectedKM?.code) {
                continue; // Bỏ qua vòng lặp cho chương trình khuyến mãi hiện tại
            }

            if (
                (new Date(startDate) < existingEndDate && new Date(endDate) > existingStartDate) || // Xung đột thời gian
                (existingStartDate < new Date(endDate) && existingEndDate > new Date(startDate))
            ) {
                toast.warning('Khoảng thời gian này đã có khuyến mãi cùng loại');
                return false; // Trả về false nếu có lỗi
            }
        }

        return true; // Trả về true nếu không có lỗi
    };

    const checkPromotionLineAddAndUpdate = (promotionLines, startDate, endDate, type) => {
        const currentDate = new Date();

        // Kiểm tra ngày bắt đầu có lớn hơn ngày hiện tại hay không
        if (new Date(startDate) <= currentDate) {
            toast.warning('Ngày bắt đầu phải lớn hơn ngày hiện tại');
            return false; // Trả về false nếu có lỗi
        }

        // Kiểm tra ngày kết thúc có lớn hơn hoặc bằng ngày bắt đầu không
        if (new Date(endDate) < new Date(startDate)) {
            toast.warning('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
            return false; // Trả về false nếu có lỗi
        }

        // Kiểm tra chồng chéo ngày với các chương trình khuyến mãi khác
        for (const promotionLine of promotionLines) {
            const existingStartDate = new Date(promotionLine.startDate);
            const existingEndDate = new Date(promotionLine.endDate);

            // Nếu là cập nhật, bỏ qua chương trình khuyến mãi hiện tại
            if (selectedKMLine && promotionLine.code === selectedKMLine?.code) {
                continue;
            }

            // Kiểm tra cùng loại khuyến mãi
            if (promotionLine.type === type) {
                // Kiểm tra xem thời gian mới có nằm trong khoảng thời gian hiện tại không
                if (
                    (new Date(startDate) < existingEndDate && new Date(endDate) > existingStartDate) || // Xung đột thời gian
                    (existingStartDate < new Date(endDate) && existingEndDate > new Date(startDate))
                ) {
                    toast.warning('Khoảng thời gian này đã có khuyến mãi cùng loại');
                    return false; // Trả về false nếu có lỗi
                }
            }
        }

        return true; // Trả về true nếu không có lỗi
    };

    //action KM
    const handleAddKM = async () => {
        if (!validateKM()) return;
        if (!checkPromotionAddAndUpdate(promotions, selectedStartDateKM, selectedEndDateKM)) return;
        const promotion = {
            description: descriptionKM,
            startDate: selectedStartDateKM,
            endDate: selectedEndDateKM,
        };

        try {
            const response = await axios.post('api/promotions', promotion);
            if (response.data) {
                toast.success('Thêm suất Khuyến mãi thành công');
                refetchKM();
                cleanTextKM();
                handleCloseKM();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateKM = async () => {
        if (!validateKM()) return;
        if (!checkPromotionAddAndUpdate(promotions, selectedStartDateKM, selectedEndDateKM)) return;
        if (!selectedKM) return;
        const promotion = {
            description: descriptionKM,
            startDate: selectedStartDateKM,
            endDate: selectedEndDateKM,
        };

        try {
            const response = await axios.put(`api/promotions/${selectedKM?.code}`, promotion);
            if (response.data) {
                toast.success('Cập nhật thành công');
                refetchKM();
                cleanTextKM();
                handleCloseKM();
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    //action KMLine

    const handleAddKMLine = async () => {
        if (!validateKMLine()) return;

        const type = optionKMLines.find((item) => item.name === selectedOptionKMLine).value;
        if (
            !checkPromotionLineAddAndUpdate(
                selectedKM?.promotionLines,
                selectedStartDateKMLine,
                selectedEndDateKMLine,
                type,
            )
        )
            return;

        const promotion = {
            promotionCode: selectedKM?.code,
            description: descriptionKMLine,
            startDate: selectedStartDateKMLine,
            endDate: selectedEndDateKMLine,
            type: type,
        };

        try {
            const response = await axios.post('api/promotion-lines', promotion);
            if (response.data) {
                toast.success('Thêm thành công');
                refetchKM();
                cleanTextKM();
                handleCloseKMLine();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateKMLine = async () => {
        if (!validateKM()) return;
        if (!checkPromotionAddAndUpdate(promotions, selectedStartDateKM, selectedEndDateKM)) return;
        if (!selectedKM) return;
        const promotion = {
            description: descriptionKM,
            startDate: selectedStartDateKM,
            endDate: selectedEndDateKM,
        };

        try {
            const response = await axios.put(`api/promotions/${selectedKM?.code}`, promotion);
            if (response.data) {
                toast.success('Thêm suất Khuyến mãi thành công');
                refetchKM();
                cleanTextKM();
                handleCloseKMLine();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleOptionKMLine = (value) => {
        if (!value) {
            setSelectedOptionKMLine('');
            return;
        }
        setSelectedOptionKMLine(value);
    };

    const onChangeSelectedStartDateKM = (value) => {
        if (!value) {
            setSelectedStartDateKM(null);
            return;
        }
        setSelectedStartDateKM(value);
        setSelectedEndDateKM(null);
    };

    const onChangeSelectedStartDateKMLine = (value) => {
        if (!value) {
            setSelectedStartDateKMLine(null);
            return;
        }
        setSelectedStartDateKMLine(value);
        setSelectedEndDateKMLine(null);
    };

    const data = [
        {
            id: 1,
            type: 1,
            soTienBan: 5000000,
            soTienTang: 100000,
            status: 'Active',
        },
        {
            id: 2,
            type: 2,
            sanPhamBan: 'Coca',
            soLuongBan: 5,
            sanPhamTang: 'Coca',
            soLuongTang: 1,
            status: 'Active',
        },
        {
            id: 3,
            type: 3,
            soTienBan: 5000000,
            chietKhau: '10%',
            soTienGioiHan: 200000,
            status: 'Active',
        },
        {
            id: 4,
            type: 1,
            soTienBan: 1000000,
            soTienTang: 50000,
            status: 'InActive',
        },
        {
            id: 5,
            type: 2,
            sanPhamBan: 'Pespi',
            soLuongBan: 3,
            sanPhamTang: 'Coca',
            soLuongTang: 1,
            status: 'InActive',
        },
        {
            id: 6,
            type: 3,
            soTienBan: 2000000,
            chietKhau: '5%',
            soTienGioiHan: 20000,
            status: 'InActive',
        },
    ];

    const [selectedMovie, setSelectedMovie] = useState('');
    const nuoc = [
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };
    const renderPromotion = (promotions) => {
        return promotions.map((promotion) => (
            <div key={promotion.code}>
                <div className="bg-[#E6E6E6] text-[14px] py-[6px]  font-normal text-slate-500 grid grid-cols-7 items-center gap-3 mb-2 ">
                    <div className="grid col-span-3 grid-cols-10 items-center gap-5">
                        <div
                            className="justify-center col-span-2 grid"
                            onClick={() => {
                                toggleVisibility(promotion.code);
                                toggleDropdown(promotion.code);
                            }}
                        >
                            {isDropdownOpen[promotion.code] ? (
                                <FaChevronUp color="gray" size={20} />
                            ) : (
                                <FaChevronDown color="gray" size={20} />
                            )}
                        </div>
                        <h1 className="uppercase grid col-span-8">{promotion.description}</h1>
                    </div>
                    <h1 className="grid justify-center items-center">{formatDate(promotion.startDate)}</h1>
                    <h1 className="grid justify-center items-center">{formatDate(promotion.endDate)}</h1>
                    <div className="justify-center items-center grid">
                        <button
                            className={`border px-2 text-white text-base h-auto py-[1px] flex  rounded-[40px] ${
                                promotion.status === 0 ? 'bg-gray-400' : 'bg-green-500'
                            }`}
                        >
                            {promotion.status}
                        </button>
                    </div>
                    <div className="justify-center grid items-center ">
                        <button className="" onClick={() => handleOpenKM(true)}>
                            <FaRegEdit
                                color="black"
                                size={20}
                                onClick={() => {
                                    setSelectedStartDateKM(dayjs(promotion.startDate));
                                    setSelectedEndDateKM(dayjs(promotion.endDate));
                                    setDescriptionKM(promotion.description);
                                    setSelectedKM(promotion);
                                }}
                            />
                        </button>
                    </div>
                </div>
                {visibleRooms[promotion.code] && (
                    <>
                        <div className="border-b text-[13px] font-bold uppercase text-slate-500 grid grid-cols-10 items-center gap-3">
                            <h1 className="grid col-span-2 justify-center items-center">Loại</h1>
                            <h1 className="grid col-span-3 justify-center items-center">Mô tả</h1>
                            <h1 className="grid justify-center items-center">Ngày bắt đầu</h1>
                            <h1 className="grid justify-center items-center">Ngày kết thúc</h1>
                            <h1 className="grid justify-center items-center pl-5">Trạng thái</h1>
                            <div className="grid justify-center col-span-2">
                                <button
                                    className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                    onClick={() => {
                                        handleOpenKMLine(false);
                                        setSelectedKM(promotion);
                                    }}
                                >
                                    <IoIosAddCircleOutline color="white" size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="height-sm-1">
                            {promotion.promotionLines &&
                                promotion.promotionLines.map((item) => (
                                    <div
                                        className="border-b py-2 text-[15px] font-normal text-slate-500 grid grid-cols-10 items-center gap-3"
                                        key={item.id}
                                    >
                                        <h1 className=" grid col-span-2 pl-3 items-center ">
                                            {item.type === 0
                                                ? 'Khuyến mãi hàng'
                                                : item.type === 1
                                                ? 'Khuyến mãi tiền'
                                                : 'Chiết khấu hóa đơn'}
                                        </h1>
                                        <h1 className=" grid col-span-3  items-center">{item.description}</h1>
                                        <h1 className=" grid items-center justify-center break-all">
                                            {formatDate(item.startDate)}
                                        </h1>
                                        <h1 className=" grid items-center justify-center break-all">
                                            {formatDate(item.endDate)}
                                        </h1>
                                        <div className="justify-center items-center grid pl-5">
                                            <button
                                                className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                                    item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}
                                            >
                                                {item.status}
                                            </button>
                                        </div>
                                        <div className="justify-center space-x-5 items-center col-span-2 flex  ">
                                            <button
                                                className=""
                                                onClick={() => {
                                                    handleOpenKMLine(true);
                                                    setSelectedKMLine(item);
                                                    setDescriptionKMLine(item.description);
                                                    setSelectedStartDateKMLine(dayjs(item.startDate));
                                                    setSelectedEndDateKMLine(dayjs(item.endDate));
                                                }}
                                            >
                                                <FaRegEdit color="black" size={20} />
                                            </button>
                                            <button className="" onClick={() => handOpenKMDetail(item.type)}>
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
        <div className="max-h-screen">
            <div className="bg-white border shadow-md rounded-[10px] my-1 py-3 h-[135px] mb-5">
                <h1 className="font-bold text-[20px] uppercase pl-3 mb-3">Khuyến mãi</h1>
                <div className="grid grid-cols-4 max-lg:gap-3 gap-12 items-center w-full h-16 px-3">
                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Chương trình khuyến mãi"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <AutoInputComponent
                        options={nuoc.map((option) => option.name)}
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Loại khuyến mãi"
                        freeSolo={false}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        borderRadius="10px"
                    />
                    <InputComponent className="rounded-[10px] " title="Ngày bắt đầu" type="date" />
                    <InputComponent className="rounded-[10px] " title="Ngày kết thúc" type="date" />
                </div>
            </div>
            <div className="bg-white border  shadow-md rounded-[10px] box-border  h-[515px] max-h-screen custom-height-xs custom-height-sm custom-height-md custom-height-lg custom-height-xl">
                <div className="bg-[#eeaf56] text-[13px] text-white h-auto py-1 font-semibold grid grid-cols-7 items-center gap-3 rounded-lg">
                    <h1 className="uppercase grid col-span-3 justify-center items-center">Mô tả</h1>
                    <h1 className="uppercase grid  justify-center items-center">Ngày bắt đầu</h1>
                    <h1 className="uppercase grid justify-center items-center">Ngày kết thúc</h1>
                    <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                    <div className="flex justify-center">
                        <button
                            className="border px-4 py-1 rounded-[40px] bg-orange-400"
                            onClick={() => handleOpenKM(false)}
                        >
                            <IoIosAddCircleOutline color="white" size={20} />
                        </button>
                    </div>
                </div>
                <div className="overflow-auto h-[92%] height-sm-1 ">{renderPromotion(promotions)}</div>
            </div>

            <ModalComponent
                open={openKM}
                handleClose={handleCloseKM}
                width="35%"
                height="39%"
                smallScreenWidth="60%"
                smallScreenHeight="28%"
                mediumScreenWidth="60%"
                mediumScreenHeight="24%"
                largeScreenHeight="21%"
                largeScreenWidth="50%"
                maxHeightScreenHeight="48%"
                maxHeightScreenWidth="45%"
                heightScreen="36%"
                title={isUpdateKM ? 'Chỉnh sửa chương trình khuyến mãi' : 'Thêm chương trình khuyến mãi'}
            >
                <div className=" h-[80%] grid grid-rows-3 gap-12 ">
                    <div className="grid p-3 ">
                        <AutoInputComponent
                            value={descriptionKM}
                            onChange={setDescriptionKM}
                            title="Mô tả"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />
                    </div>

                    <div className="grid items-center row-span-2  gap-2 ">
                        <div className="grid grid-cols-2 gap-8 p-2">
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                <DatePicker
                                    value={selectedStartDateKM ? dayjs(selectedStartDateKM) : null}
                                    minDate={dayjs().add(3, 'day')}
                                    onChange={onChangeSelectedStartDateKM}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    format="DD-MM-YYYY"
                                    className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>

                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                <DatePicker
                                    value={selectedEndDateKM ? dayjs(selectedEndDateKM) : null}
                                    minDate={dayjs(selectedStartDateKM)}
                                    onChange={setSelectedEndDateKM}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    disabled={!selectedStartDateKM}
                                    placeholder="Chọn ngày"
                                    format="DD-MM-YYYY"
                                    className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>
                        </div>
                        <div className="justify-end flex space-x-3 border-t py-3 px-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                            <ButtonComponent
                                text={isUpdateKM ? 'Cập nhật' : 'Thêm mới'}
                                className=" bg-blue-500 "
                                onClick={() => (isUpdateKM ? handleUpdateKM() : handleAddKM())}
                            />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openKMLine}
                handleClose={handleCloseKMLine}
                width="45%"
                height="39%"
                smallScreenWidth="65%"
                smallScreenHeight="28%"
                mediumScreenWidth="65%"
                mediumScreenHeight="25%"
                largeScreenHeight="22%"
                largeScreenWidth="55%"
                maxHeightScreenHeight="48%"
                maxHeightScreenWidth="55%"
                heightScreen="35%"
                title={isUpdateKMLine ? 'Chỉnh sửa loại khuyến mãi' : 'Thêm loại khuyến mãi'}
            >
                <div className=" h-[90%] grid grid-rows-3 space-y-2  mx-2 ">
                    <div className="grid grid-cols-2 gap-12   items-center  ">
                        <AutoInputComponent
                            options={optionKMLines.map((option) => option.name)}
                            value={selectedOptionKMLine}
                            onChange={handleOptionKMLine}
                            title="Loại khuyến mãi"
                            freeSolo={false}
                            disableClearable={true}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />
                        <AutoInputComponent
                            value={descriptionKMLine}
                            onChange={setDescriptionKMLine}
                            title="Mô tả"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                        />
                    </div>

                    <div className="grid items-center    ">
                        <div className="grid grid-cols-2 gap-8 ">
                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày bắt đầu</h1>
                                <DatePicker
                                    value={selectedStartDateKMLine}
                                    minDate={
                                        isUpdateKMLine ? dayjs(selectedStartDateKMLine) : dayjs(selectedKM?.startDate)
                                    }
                                    maxDate={isUpdateKMLine ? dayjs(selectedEndDateKM) : dayjs(selectedKM?.endDate)}
                                    onChange={onChangeSelectedStartDateKMLine}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    format="DD-MM-YYYY"
                                    className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>

                            <div>
                                <h1 className="text-[16px] truncate mb-1">Ngày kết thúc</h1>
                                <DatePicker
                                    value={selectedEndDateKMLine ? dayjs(selectedEndDateKMLine) : null}
                                    minDate={dayjs(selectedStartDateKMLine)}
                                    maxDate={dayjs(selectedKM?.endDate)}
                                    onChange={setSelectedEndDateKMLine}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder="Chọn ngày"
                                    disabled={!selectedStartDateKMLine}
                                    format="DD-MM-YYYY"
                                    className="border  py-[6px] z-50 px-4 truncate border-[black] h-[35px] w-full  placeholder:text-red-600 focus:border-none rounded-[5px] hover:border-[black] "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="justify-end flex space-x-3 border-t pt-1 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKMLine} />
                        <ButtonComponent
                            text={isUpdateKMLine ? 'Cập nhật' : 'Thêm mới'}
                            className=" bg-blue-500 "
                            onClick={() => (isUpdateKMLine ? handleUpdateKMLine() : handleAddKMLine())}
                        />
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openKMDetail}
                handleClose={handleCloseKMDetail}
                width="55%"
                height="50%"
                smallScreenWidth="80%"
                smallScreenHeight="38%"
                mediumScreenWidth="60%"
                mediumScreenHeight="35%"
                largeScreenHeight="35%"
                largeScreenWidth="60%"
                maxHeightScreenHeight="70%"
                maxHeightScreenWidth="50%"
                title="Chi tiết khuyến mãi"
            >
                <div className=" h-90p grid grid-rows-12 ">
                    <div
                        className={`border-b text-xs row-span-2 px-2 font-bold text-slate-500 grid ${
                            type === 1 ? 'grid-cols-4' : type === 2 ? 'grid-cols-6' : 'grid-cols-5'
                        } items-center gap-2`}
                    >
                        {type === 1 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Số tiền bán</h1>
                                <h1 className="uppercase grid justify-center items-center">Số tiền tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        {type === 2 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Sản phẩm bán</h1>
                                <h1 className="uppercase grid justify-center items-center ">Số lượng bán</h1>
                                <h1 className="uppercase grid justify-center items-center">Sản phẩm tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Số lượng tặng</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        {type === 3 && (
                            <>
                                <h1 className="uppercase grid justify-center items-center">Số tiền bán</h1>
                                <h1 className="uppercase grid justify-center items-center">% chiết khấu</h1>
                                <h1 className="uppercase grid justify-center items-center ">Số tiền giới hạn</h1>
                                <h1 className="uppercase grid justify-center items-center">Trạng thái</h1>
                            </>
                        )}
                        <div className="flex justify-center">
                            <button
                                className="border px-4 py-1 rounded-[40px] bg-orange-400"
                                onClick={() => handleOpenKM(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto h-95p height-sm-1 row-span-8">
                        {data
                            .filter((item) => item.type === type)
                            .map((item) => (
                                <div
                                    className={`border-b text-base px-3 font-normal py-2 text-slate-500 grid ${
                                        type === 1 ? 'grid-cols-4' : type === 2 ? 'grid-cols-6' : 'grid-cols-5'
                                    } items-center gap-2`}
                                    key={item.id}
                                >
                                    {item.type === 1 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienTang}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-2 text-white text-base py-[1px] flex  rounded-[40px] ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {item.type === 2 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.sanPhamBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center ">
                                                {item.soLuongBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.sanPhamTang}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soLuongTang}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-3 text-white text-base  flex  rounded-[40px] uppercase ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {item.type === 3 && (
                                        <>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.soTienBan}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.chietKhau}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center ">
                                                {item.soTienGioiHan}
                                            </h1>
                                            <div className="  justify-center items-center grid">
                                                <button
                                                    className={`border px-3 text-white text-base  flex  rounded-[40px] uppercase ${
                                                        item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status}
                                                </button>
                                            </div>
                                            <div className="justify-center items-center grid">
                                                <button className=" px-4 py-1" onClick={() => handleOpenKM(true)}>
                                                    <FaRegEdit color="black" size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                    <div className="grid row-span-2 items-center pt-1 border-t">
                        <div className="px-4 justify-end flex space-x-3  mb-3">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                            <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            {/* <ModalComponent
                open={openKM}
                handleClose={handleCloseKM}
                width="28%"
                height={type === 1 ? '38%' : type === 2 ? '55%' : '46%'}
                smallScreenWidth="55%"
                smallScreenHeight={type === 1 ? '28%' : type === 2 ? '40%' : '35%'}
                mediumScreenWidth="50%"
                mediumScreenHeight={type === 1 ? '24%' : type === 2 ? '35%' : '30%'}
                largeScreenHeight={type === 1 ? '21%' : type === 2 ? '31%' : '26%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '45%' : type === 2 ? '69%' : '58%'}
                maxHeightScreenWidth="40%"
                heightScreen={type === 1 ? '35%' : type === 2 ? '52%' : '43%'}
                widthScreen="35%"
                title={
                    isUpdateKM && type === 1
                        ? 'Chỉnh sửa khuyến mãi tiền'
                        : !isUpdateKM && type === 1
                        ? 'Thêm khuyến mãi tiền'
                        : isUpdateKM && type === 2
                        ? 'Chỉnh sửa khuyến mãi sản phẩm'
                        : !isUpdateKM && type === 2
                        ? 'Thêm khuyến khuyến mãi sản phẩm'
                        : isUpdateKM && type === 3
                        ? 'Chỉnh sửa khuyến mãi hóa đơn'
                        : 'Thêm khuyến mãi hóa đơn'
                }
            >
                {type === 2 && (
                    <div className=" h-[87%] grid grid-rows-6 gap-[73px]">
                        <AutoInputComponent
                            options={nuoc.map((option) => option.name)}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Sản phẩm bán"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Sản phẩm bán"
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số tiền bán"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            options={nuoc.map((option) => option.name)}
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Sản phẩm tặng"
                            freeSolo={false}
                            disableClearable={false}
                            placeholder="Sản phẩm tặng"
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số lượng tặng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}
                {type === 1 && (
                    <div className=" h-[87%] grid grid-rows-4 gap-[73px]">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số tiền bán"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số tiền tặng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}

                {type === 3 && (
                    <div className=" h-[87%] grid grid-rows-5 gap-[73px]">
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số tiền bán"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="% chiết khấu"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <AutoInputComponent
                            value={selectedMovie}
                            onChange={setSelectedMovie}
                            title="Số tiền giới hạn"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Nhập ..."
                            heightSelect={200}
                            className1="p-3"
                        />
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKM} />
                                <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent> */}
        </div>
    );
};

export default Promotion;
