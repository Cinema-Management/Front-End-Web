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
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { set } from 'date-fns';

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
            name: promotion.description, // Hiển thị tên
            code: promotion.code, // Giá trị sẽ được gửi về
        }));

        return { promotions: sortPromotions(data), optionPromotion: arrayPromotion };
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

const fetchPromotionDetail = async (code) => {
    try {
        const response = await axios.get('api/promotion-details/getAllByPromotionLineCode/' + code);

        const promotionDetails = response.data;

        // Chuyển đổi dữ liệu thành định dạng cho MultiSelect

        return promotionDetails;
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

const fetchProductNotSeat = async () => {
    try {
        const response = await axios.get('api/products/getAllNotSeatStatusActive');
        const sortedProducts = response.data.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // Chuyển đổi về chữ hoa để so sánh không phân biệt chữ hoa chữ thường
            const nameB = b.name.toUpperCase();

            // Kiểm tra nếu tên sản phẩm bắt đầu bằng 'C' và 'B'
            if (nameA.startsWith('C') && nameB.startsWith('B')) {
                return -1; // A trước B
            } else if (nameA.startsWith('B') && nameB.startsWith('C')) {
                return 1; // B sau C
            } else {
                // So sánh bình thường nếu không phải 'C' và 'B'
                return nameA.localeCompare(nameB);
            }
        });
        const optionProduct = sortedProducts.map((product) => ({
            name: product.name, // Hiển thị tên
            code: product.code, // Giá trị sẽ được gửi về
        }));

        return optionProduct;
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
const Promotion = () => {
    const [openKM, setOpenKM] = useState(false);
    const [openKMDetail, setOpenKMDetail] = useState(false);
    const [openKMLine, setOpenKMLine] = useState(false);
    const [openKMDetailAction, setOpenKMDetailAction] = useState(false);

    const [isUpdateKM, setIsUpdateKM] = useState(false);
    const [isUpdateKMLine, setIsUpdateKMLine] = useState(false);
    const [isUpdateKMDetail, setIsUpdateKMDetail] = useState(false);

    const [type, setType] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState({});
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
    const [salesProduct, setSalesProduct] = useState('');
    const [freeProduct, setFreeProduct] = useState('');
    const [minQuantity, setMinQuantity] = useState(0);
    const [freeQuantity, setFreeQuantity] = useState(0);
    const [minPurchaseAmount, setMinPurchaseAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [maxDiscountAmount, setMaxDiscountAmount] = useState(0);

    const optionKMLines = [
        { name: 'Khuyến mãi sản phẩm', value: 0 },
        { name: 'Khuyến mãi tiền', value: 1 },
        { name: 'Chiết khấu hóa đơn', value: 2 },
    ];

    const {
        data: { promotions = [], optionPromotion = [] } = {},
        isLoading: isLoadingPromotions,
        error: PromotionError,
        refetch: refetchKM,
    } = useQuery('fetchPromotionsWithLines', fetchPromotionsWithLines, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const {
        data: optionProduct = [],
        isLoading: isLoadingProduct,
        error: errorProduct,
    } = useQuery('productPromotion', fetchProductNotSeat, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const {
        data: promotionDetails = [],
        isLoading: isLoadingPromotionDetail,
        error: PromotionDetailError,
        refetch: refetchKMDetail,
    } = useQuery(
        ['fetchPromotionDetail', selectedKMLine?.code],
        () => fetchPromotionDetail(selectedKMLine?.code), // Truyền hàm fetch thay vì gọi trực tiếp
        {
            staleTime: 1000 * 60 * 3,
            cacheTime: 1000 * 60 * 10,
            enabled: !!selectedKMLine?.code, // Chỉ kích hoạt khi có mã KM
        },
    );

    // Xử lý khi đang loading hoặc có lỗi
    (isLoadingPromotions || isLoadingPromotionDetail || isLoadingProduct) && <Loading />;
    (errorProduct || PromotionError) && (toast.error(PromotionError.message) || toast.error(errorProduct.message));

    //header

    const handleOpenKM = (isUpdateKM) => {
        setOpenKM(true);
        setIsUpdateKM(isUpdateKM);
    };

    const handleCloseKM = () => {
        setOpenKM(false);
        cleanTextKM();
    };
    //line

    const handleOpenKMLine = (isUpdateKMLine) => {
        setOpenKMLine(true);
        setIsUpdateKMLine(isUpdateKMLine);
    };
    const handleCloseKMLine = () => {
        setOpenKMLine(false);
        cleanTextKMLine();
    };
    //detail view

    const handleOpenKMDetail = (isUpdateKMDetail) => {
        setType(isUpdateKMDetail);
        setOpenKMDetail(true);
    };

    const handleCloseKMDetail = () => setOpenKMDetail(false);

    /// detail action
    const handleOpenKMDetailAction = (isUpdateKMDetail) => {
        setOpenKMDetailAction(true);
        setIsUpdateKMDetail(isUpdateKMDetail);
    };

    const handleCloseKMDetailAction = () => {
        setOpenKMDetailAction(false);
        cleanTextKMDetail();
    };

    const handleDeleteKMDetail = async (code) => {
        try {
            await axios.delete(`api/promotion-details/${code}`);
            toast.success('Xóa thành công!');
            refetchKMDetail();
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
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

    // clean text

    const cleanTextKM = () => {
        setSelectedEndDateKM(null);
        setSelectedStartDateKM(null);
        setDescriptionKM('');
        setSelectedKM([]);
    };

    const cleanTextKMLine = () => {
        setSelectedEndDateKMLine(null);
        setSelectedStartDateKMLine(null);
        setDescriptionKM('');
        setSelectedKMLine([]);
    };

    const cleanTextKMDetail = () => {
        //0
        setSalesProduct('');
        setMinQuantity(0);
        setFreeProduct('');
        setFreeQuantity(0);
        //1
        setMinPurchaseAmount(0);
        setDiscountAmount(0);
        //2
        setDiscountPercentage(0);
        setMaxDiscountAmount(0);
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

    const validateKMDetail = (type) => {
        if (!salesProduct && type === 0) {
            toast.warning('Vui lòng chọn sản phẩm bán');
            return false;
        }
        if (!minQuantity && type === 0) {
            toast.warning('Số lượng phải > 0');
            return false;
        }
        if (!freeProduct && type === 0) {
            toast.warning('Vui lòng chọn sản phẩm tặng');
            return false;
        }
        if (!freeQuantity && type === 0) {
            toast.warning('Số lượng phải > 0');
            return false;
        }
        // type = 1
        if (!minPurchaseAmount && (type === 1 || type == 2) && minPurchaseAmount < 1000) {
            toast.warning('Số tiền bán > 1000');

            return false;
        }

        if (!discountAmount && type === 1 && discountAmount < 1000) {
            toast.warning('Số tiền tặng > 1000');

            return false;
        }

        //type 2

        if (!discountPercentage && type === 2 && (discountPercentage < 0 || discountPercentage > 100)) {
            toast.warning('% từ 1-100');

            return false;
        }

        if (!maxDiscountAmount && type === 2 && maxDiscountAmount < 1000) {
            toast.warning('Số tiền tối đa > 1000');

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
            toast.warning('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
            return false; // Trả về false nếu có lỗi
        }

        // Kiểm tra chồng chéo ngày với các chương trình khuyến mãi khác
        for (const promotion of promotions) {
            const existingStartDate = new Date(promotion.startDate);
            const existingEndDate = new Date(promotion.endDate);

            // Bỏ qua chương trình khuyến mãi hiện tại khi cập nhật
            if (selectedKM && promotion.code === selectedKM.code) {
                continue;
            }

            // Điều kiện để không có chồng chéo:
            // Khuyến mãi mới phải có ngày bắt đầu sau ngày kết thúc của khuyến mãi hiện có
            // Hoặc ngày kết thúc trước ngày bắt đầu của khuyến mãi hiện có
            if (!(new Date(startDate) > existingEndDate || new Date(endDate) < existingStartDate)) {
                toast.warning('Khoảng thời gian này đã có khuyến mãi khác.');
                return false;
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

        const promotionStartDate = new Date(selectedKM?.startDate);
        const promotionEndDate = new Date(selectedKM?.endDate);

        if (new Date(startDate) < promotionStartDate || new Date(endDate) > promotionEndDate) {
            toast.warning('Phải năm trong chương trình khuyến mãi');
            return false; // Trả về false nếu dòng khuyến mãi không nằm trong thời gian của chương trình khuyến mãi
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
                if (!(new Date(startDate) > existingEndDate || new Date(endDate) < existingStartDate)) {
                    toast.warning('Khoảng thời gian này đã có khuyến mãi khác.');
                    return false;
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
                cleanTextKMLine();
                handleCloseKMLine();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateKMLine = async () => {
        if (!validateKMLine()) return;
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
                cleanTextKMLine();
                handleCloseKMLine();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateStatus = async (lineCode, status) => {
        const newStatus = status === 0 ? 1 : 0;
        const line = {
            code: lineCode,
            status: newStatus,
        };

        try {
            await axios.put(`api/promotion-lines/updateStatus`, line);
            toast.success('Cập nhật trạng thái thành công!');
            refetchKM();
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleAddKMDetail = async () => {
        if (!validateKMDetail(selectedKMLine?.type)) return;
        if (!selectedKMLine) return;

        const salesProductCode = optionProduct.find((item) => item.name === salesProduct)?.code;
        const freeProductCode = optionProduct.find((item) => item.name === freeProduct)?.code;
        let promotionDetail = {
            type: selectedKMLine?.type,
            promotionLineCode: selectedKMLine?.code,
            salesProductCode: salesProductCode,
            minQuantity: minQuantity,
            freeProductCode: freeProductCode,
            freeQuantity: freeQuantity,
            //
            minPurchaseAmount: minPurchaseAmount,
            discountAmount: discountAmount,
            //
            discountPercentage: discountPercentage,
            maxDiscountAmount: maxDiscountAmount,
        };
        if (selectedKMLine?.type === 0) {
            promotionDetail = {
                type: selectedKMLine?.type,
                promotionLineCode: selectedKMLine?.code,
                salesProductCode: salesProductCode,
                minQuantity: minQuantity,
                freeProductCode: freeProductCode,
                freeQuantity: freeQuantity,
            };
        } else if (selectedKMLine?.type === 1) {
            promotionDetail = {
                type: selectedKMLine?.type,
                promotionLineCode: selectedKMLine?.code,
                minPurchaseAmount: minPurchaseAmount,
                discountAmount: discountAmount,
            };
        } else {
            promotionDetail = {
                type: selectedKMLine?.type,
                promotionLineCode: selectedKMLine?.code,

                //
                minPurchaseAmount: minPurchaseAmount,
                //
                discountPercentage: discountPercentage,
                maxDiscountAmount: maxDiscountAmount,
            };
        }

        try {
            const response = await axios.post(`api/promotion-details`, promotionDetail);
            if (response.data) {
                toast.success('Thêm thành công');
                refetchKMDetail();
                cleanTextKMDetail();
                handleCloseKMDetailAction();
            } else {
                toast.error('Thêm thất bại');
            }
        } catch (error) {
            toast.error('Lỗi: ' + (error.response.data.message || error.message));
        }
    };

    const handleUpdateKMDetail = async () => {
        if (!validateKMDetail(selectedKMDetail?.type)) return;
        if (!selectedKMDetail) return;

        const salesProductCode = optionProduct.find((item) => item.name === salesProduct)?.code;
        const freeProductCode = optionProduct.find((item) => item.name === freeProduct)?.code;
        const promotionDetail = {
            salesProductCode: salesProductCode,
            minQuantity: minQuantity,
            freeProductCode: freeProductCode,
            freeQuantity: freeQuantity,
            //
            minPurchaseAmount: minPurchaseAmount,
            discountAmount: discountAmount,
            //
            discountPercentage: discountPercentage,
            maxDiscountAmount: maxDiscountAmount,
            type: selectedKMLine?.type,
        };

        try {
            const response = await axios.put(`api/promotion-details/${selectedKMDetail?.code}`, promotionDetail);
            if (response.data) {
                toast.success('Thêm thành công');
                refetchKMDetail();
                cleanTextKMDetail();
                handleCloseKMDetailAction();
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

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    // type = 0
    const handleOnChangeMinQuantity = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && value >= 0) {
            const quantity = Number(value);
            setMinQuantity(quantity);
        }
    };

    const handleOnChangeFreeQuantity = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && value >= 0) {
            const quantity = Number(value);
            setFreeQuantity(quantity);
        }
    };
    // type =1
    const handleOnChangeMinPurchaseAmount = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && value >= 0) {
            const quantity = Number(value);
            setMinPurchaseAmount(quantity);
        }
    };

    const handleOnChangeDiscountAmount = (e) => {
        const value = e.target.value;
        const quantity = parseFloat(value);

        if (!isNaN(value) && value >= 0) {
            setDiscountAmount(quantity);
        } else {
            setDiscountAmount(0);
        }
    };

    //type == 3

    const handleOnChangeDiscountPercentage = (e) => {
        const value = e.target.value;

        // Chuyển đổi giá trị thành số
        const quantity = parseFloat(value);

        if (!isNaN(value) && value > 0 && quantity <= 100) {
            setDiscountPercentage(quantity);
        } else {
            setDiscountPercentage(0);
        }
    };

    const handleOnChangeMaxDiscountAmount = (e) => {
        const value = e.target.value;

        // Chuyển đổi giá trị thành số
        const quantity = parseFloat(value);

        // Kiểm tra giá trị hợp lệ
        if (!isNaN(quantity) && quantity > 0) {
            setMaxDiscountAmount(quantity);
        } else {
            // Nếu giá trị không hợp lệ, có thể reset giá trị hoặc hiển thị thông báo
            setMaxDiscountAmount(0); // Hoặc giá trị mặc định khác nếu cần
        }
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
                            <div className="grid col-span-2 grid-cols-10  justify-center items-center ">
                                <h1 className="grid col-span-3   justify-center items-center ">STT</h1>
                                <h1 className="grid col-span-7  justify-center items-center">Mã Dòng</h1>
                            </div>

                            <div className="grid col-span-4 grid-cols-10  justify-center items-center">
                                <h1 className="grid col-span-4 justify-center items-center ">Loại</h1>
                                <h1 className="grid col-span-6 justify-center items-center ">Mô tả</h1>
                            </div>
                            <div className="grid col-span-2 grid-cols-10  justify-center items-center ">
                                <h1 className="grid col-span-5 justify-center items-center">Ngày bắt đầu</h1>
                                <h1 className="grid col-span-5 justify-center items-center">Ngày kết thúc</h1>
                            </div>

                            <div className="grid col-span-2 grid-cols-8  justify-center items-center ">
                                <h1 className="grid  justify-center  items-center pl-5 col-span-5 ">Trạng thái</h1>
                                <div className="grid justify-center col-span-3 ">
                                    <button
                                        className="border px-4 py-1 rounded-[40px] bg-orange-400  "
                                        onClick={() => {
                                            handleOpenKMLine(false);
                                            setSelectedKM(promotion);
                                        }}
                                    >
                                        <IoIosAddCircleOutline color="white" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="height-sm-1">
                            {promotion.promotionLines &&
                                promotion.promotionLines.map((item, index) => (
                                    <div
                                        className="border-b py-2 text-[15px] font-normal text-slate-500 grid grid-cols-10 items-center gap-3"
                                        key={item.code}
                                    >
                                        <div className="grid col-span-2 grid-cols-10  justify-center items-center  ">
                                            <h1 className="grid col-span-3   justify-center items-center ">
                                                {index + 1}
                                            </h1>

                                            <h1 className="grid col-span-7   justify-center items-center ">
                                                {item.code}
                                            </h1>
                                        </div>
                                        <div className="grid col-span-4 grid-cols-10  justify-center items-center  ">
                                            <h1 className=" grid col-span-4 items-center ">
                                                {item.type === 0
                                                    ? 'Khuyến mãi sản phẩm'
                                                    : item.type === 1
                                                    ? 'Khuyến mãi tiền'
                                                    : 'Chiết khấu hóa đơn'}
                                            </h1>
                                            <h1 className=" grid col-span-6  items-center">{item.description}</h1>
                                        </div>
                                        <div className="grid col-span-2 grid-cols-10  justify-center items-center ">
                                            <h1 className=" grid col-span-5 items-center justify-center break-all">
                                                {formatDate(item.startDate)}
                                            </h1>
                                            <h1 className=" grid col-span-5 items-center justify-center break-all">
                                                {formatDate(item.endDate)}
                                            </h1>
                                        </div>

                                        <div className=" grid col-span-2 grid-cols-9 justify-center items-center ">
                                            <div
                                                className="justify-center  items-center grid col-span-5 pl-5  "
                                                onClick={() => {
                                                    handleUpdateStatus(item.code, item.status);
                                                }}
                                            >
                                                <button
                                                    className={`border uppercase  px-2 text-white text-[13px] py-[1px] flex  rounded-[40px] ${
                                                        item.status === 1 ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {item.status === 0 ? 'Chưa diễn ra' : 'Đang diễn ra'}
                                                </button>
                                            </div>
                                            <div className=" justify-around items-center col-span-4 flex  ">
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
                                                <button
                                                    className=""
                                                    onClick={() => {
                                                        handleOpenKMDetail(item.type);
                                                        setSelectedKMLine(item);
                                                    }}
                                                >
                                                    <FaRegEye color="black" fontSize={20} />
                                                </button>
                                            </div>
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
                        options={optionPromotion.map((option) => option.name)}
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

            {/* Detail view */}

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
                            type === 1 ? 'grid-cols-5' : type === 0 ? 'grid-cols-9' : 'grid-cols-6'
                        } items-center gap-2`}
                    >
                        {/* Hàng type = 0 */}
                        {type === 0 && (
                            <>
                                <div className="uppercase grid justify-center items-center grid-cols-10 col-span-2 ">
                                    <h1 className="uppercase grid justify-center items-center col-span-3">STT</h1>
                                    <h1 className="uppercase grid justify-center items-center col-span-7">
                                        Mã chi tiét
                                    </h1>
                                </div>
                                <div className="uppercase grid justify-center items-center grid-cols-10 col-span-3 ">
                                    <h1 className="uppercase grid justify-center items-center col-span-6">
                                        Sản phẩm bán
                                    </h1>
                                    <h1 className="uppercase grid justify-center items-center col-span-4 ">
                                        Số lượng bán
                                    </h1>
                                </div>
                                <div className="uppercase grid justify-center items-center grid-cols-10 col-span-3 ">
                                    <h1 className="uppercase grid justify-center items-center col-span-6">
                                        Sản phẩm tặng
                                    </h1>
                                    <h1 className="uppercase grid justify-center items-center col-span-4">
                                        Số lượng tặng
                                    </h1>
                                </div>
                            </>
                        )}
                        {/* Tiền type = 1 */}
                        {type === 1 && (
                            <>
                                <div className="  grid col-span-2  grid-cols-10">
                                    <h1 className="uppercase grid col-span-2 justify-center items-center">STT</h1>
                                    <h1 className="uppercase grid  col-span-8 justify-center items-center">
                                        Mã Chi tiết
                                    </h1>
                                </div>
                                <h1 className="uppercase grid justify-center items-center">Số tiền</h1>
                                <h1 className="uppercase grid justify-center items-center">Số tiền tặng</h1>
                            </>
                        )}
                        {/* Chiếu khấu = 2 */}
                        {type === 2 && (
                            <>
                                <div className=" uppercase col-span-2 grid justify-center items-center grid-cols-10 ">
                                    <h1 className="uppercase grid justify-center col-span-2 items-center">STT</h1>
                                    <h1 className="uppercase grid justify-center col-span-8 items-center">
                                        Mã Chi tiết
                                    </h1>
                                </div>

                                <h1 className="uppercase grid justify-center items-center">Số tiền bán</h1>
                                <h1 className="uppercase grid justify-center items-center">% chiết khấu</h1>
                                <h1 className="uppercase grid justify-center items-center ">Số tiền giới hạn</h1>
                            </>
                        )}
                        <div className="flex justify-center">
                            <button
                                className={`border px-4 py-1 rounded-[40px] bg-orange-400 ${
                                    selectedKMLine?.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                }`}
                                onClick={() => handleOpenKMDetailAction(false)}
                            >
                                <IoIosAddCircleOutline color="white" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto h-95p height-sm-1 row-span-8">
                        {promotionDetails
                            .filter((item) => item.type === type)
                            .map((item, index) => (
                                <div
                                    className={`border-b text-base px-3 font-normal py-2 text-slate-500 grid ${
                                        type === 1 ? 'grid-cols-5' : type === 0 ? 'grid-cols-9' : 'grid-cols-6'
                                    } items-center gap-2`}
                                    key={item.id}
                                >
                                    {/*hàng type =0 */}
                                    {item.type === 0 && (
                                        <>
                                            <div className=" grid justify-center items-center grid-cols-10 col-span-2 ">
                                                <h1 className=" grid justify-center items-center col-span-3">
                                                    {index + 1}
                                                </h1>
                                                <h1 className=" grid justify-center items-center col-span-7">
                                                    {item.code}
                                                </h1>
                                            </div>
                                            <div className=" grid justify-center items-center grid-cols-10 col-span-3 ">
                                                <h1 className=" grid justify-center items-center col-span-6">
                                                    {item.salesProductCode.name}
                                                </h1>
                                                <h1 className=" grid justify-center items-center col-span-4 ">
                                                    {item.minQuantity}
                                                </h1>
                                            </div>
                                            <div className=" grid justify-center items-center grid-cols-10 col-span-3 ">
                                                <h1 className=" grid justify-center items-center col-span-6">
                                                    {item.freeProductCode.name}
                                                </h1>
                                                <h1 className=" grid justify-center items-center col-span-4">
                                                    {item.freeQuantity}
                                                </h1>
                                            </div>

                                            <div
                                                className={`grid justify-around  items-center  grid-cols-2 gap-7  ${
                                                    selectedKMLine?.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                            >
                                                <button
                                                    className="px-5 "
                                                    onClick={() => {
                                                        handleOpenKMDetailAction(true);

                                                        setSelectedKMDetail(item);
                                                        setSalesProduct(item.salesProductCode.name);
                                                        setMinQuantity(item.minQuantity);
                                                        setFreeProduct(item.freeProductCode.name);
                                                        setFreeQuantity(item.freeQuantity);
                                                    }}
                                                >
                                                    <FaRegEdit color="black" size={20} />
                                                </button>

                                                <button onClick={() => handleDeleteKMDetail(item.code)}>
                                                    <MdOutlineDeleteOutline color="black" fontSize={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {/* tiền type=1 */}
                                    {item.type === 1 && (
                                        <>
                                            {' '}
                                            <div className=" grid col-span-2  grid-cols-10">
                                                <h1 className="uppercase grid col-span-2 justify-center items-center">
                                                    {index + 1}
                                                </h1>
                                                <h1 className="uppercase grid col-span-8 justify-center items-center">
                                                    {item.code}
                                                </h1>
                                            </div>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {formatCurrency(item.minPurchaseAmount)}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {formatCurrency(item.discountAmount)}
                                            </h1>
                                            <div
                                                className={`grid justify-around  items-center  grid-cols-2 gap-7  ${
                                                    selectedKMLine?.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                            >
                                                <button
                                                    className="px-5 "
                                                    onClick={() => {
                                                        handleOpenKMDetailAction(true);

                                                        setSelectedKMDetail(item);
                                                        setMinPurchaseAmount(item.minPurchaseAmount);
                                                        setDiscountAmount(item.discountAmount);
                                                    }}
                                                >
                                                    <FaRegEdit color="black" size={20} />
                                                </button>

                                                <button onClick={() => handleDeleteKMDetail(item.code)}>
                                                    <MdOutlineDeleteOutline color="black" fontSize={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* chiết khấu type = 2 */}
                                    {item.type === 2 && (
                                        <>
                                            <div className="uppercase col-span-2 grid justify-center items-center grid-cols-10 ">
                                                <h1 className="uppercase col-span-2 grid justify-center items-center">
                                                    {index + 1}
                                                </h1>
                                                <h1 className="uppercase  col-span-8 grid justify-center items-center">
                                                    {item.code}
                                                </h1>
                                            </div>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {formatCurrency(item.minPurchaseAmount)}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center">
                                                {item.discountPercentage + '%'}
                                            </h1>
                                            <h1 className="uppercase grid justify-center items-center ">
                                                {formatCurrency(item.maxDiscountAmount)}
                                            </h1>
                                            <div
                                                className={`grid justify-around  items-center  grid-cols-2 gap-7  ${
                                                    selectedKMLine?.status !== 0 ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                            >
                                                <button
                                                    className="px-5 "
                                                    onClick={() => {
                                                        handleOpenKMDetailAction(true);

                                                        setSelectedKMDetail(item);
                                                        setMinPurchaseAmount(item.minPurchaseAmount);
                                                        setDiscountPercentage(item.discountPercentage);
                                                        setMaxDiscountAmount(item.maxDiscountAmount);
                                                    }}
                                                >
                                                    <FaRegEdit color="black" size={20} />
                                                </button>

                                                <button onClick={() => handleDeleteKMDetail(item.code)}>
                                                    <MdOutlineDeleteOutline color="black" fontSize={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                    <div className="grid row-span-2 items-center pt-1 border-t">
                        <div className="px-4 justify-end flex space-x-3  mb-3">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseKMDetail} />
                        </div>
                    </div>
                </div>
            </ModalComponent>

            {/* Detail action */}

            <ModalComponent
                open={openKMDetailAction}
                handleClose={handleCloseKMDetailAction}
                width="28%"
                height={type === 1 ? '38%' : type === 0 ? '55%' : '46%'}
                smallScreenWidth="55%"
                smallScreenHeight={type === 1 ? '28%' : type === 0 ? '40%' : '35%'}
                mediumScreenWidth="50%"
                mediumScreenHeight={type === 1 ? '24%' : type === 0 ? '35%' : '30%'}
                largeScreenHeight={type === 1 ? '21%' : type === 0 ? '31%' : '26%'}
                largeScreenWidth="40%"
                maxHeightScreenHeight={type === 1 ? '45%' : type === 0 ? '69%' : '58%'}
                maxHeightScreenWidth="40%"
                heightScreen={type === 1 ? '35%' : type === 0 ? '52%' : '43%'}
                widthScreen="35%"
                title={
                    isUpdateKMDetail && type === 1
                        ? 'Chỉnh sửa khuyến mãi tiền'
                        : !isUpdateKMDetail && type === 1
                        ? 'Thêm khuyến mãi tiền'
                        : isUpdateKMDetail && type === 0
                        ? 'Chỉnh sửa khuyến mãi sản phẩm'
                        : !isUpdateKMDetail && type === 0
                        ? 'Thêm khuyến khuyến mãi sản phẩm'
                        : isUpdateKMDetail && type === 2
                        ? 'Chỉnh sửa chiết khấu hóa đơn'
                        : 'Thêm chiết khấu hóa đơn'
                }
            >
                {/* khuyến mãi tiền */}

                {type === 0 && (
                    <div className=" h-[87%] grid grid-rows-6 gap-[73px]">
                        <AutoInputComponent
                            options={optionProduct.map((option) => option.name)}
                            value={salesProduct}
                            onChange={setSalesProduct}
                            title="Sản phẩm bán"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Chọn"
                            heightSelect={200}
                            className1="p-3"
                        />
                        <div className=" m-[11px]">
                            <p className="mb-1">Số lượng bán</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={minQuantity}
                                onChange={handleOnChangeMinQuantity}
                                placeholder="Nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>
                        <AutoInputComponent
                            options={optionProduct.map((option) => option.name)}
                            value={freeProduct}
                            onChange={setFreeProduct}
                            title="Sản phẩm tặng"
                            freeSolo={true}
                            disableClearable={false}
                            placeholder="Chọn"
                            heightSelect={200}
                            className1="p-3"
                        />

                        <div className=" m-[11px]">
                            <p className="mb-1">Số lượng bán</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base pl-3"
                                type="text"
                                value={freeQuantity}
                                onChange={handleOnChangeFreeQuantity}
                                placeholder="Nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>
                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent
                                    text="Hủy"
                                    className="bg-[#a6a6a7]"
                                    onClick={handleCloseKMDetailAction}
                                />
                                <ButtonComponent
                                    text={isUpdateKMDetail ? 'Cập nhật' : 'Thêm mới'}
                                    className="bg-blue-500"
                                    onClick={() => {
                                        if (isUpdateKMDetail) {
                                            handleUpdateKMDetail();
                                        } else {
                                            handleAddKMDetail(); // Thêm mới
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* khuyến mãi sản phẩm */}

                {type === 1 && (
                    <div className=" h-[87%] grid grid-rows-4 gap-[73px]">
                        <div className=" m-[11px]">
                            <p className="mb-1">Số tiền bán</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={minPurchaseAmount}
                                onChange={handleOnChangeMinPurchaseAmount}
                                placeholder="Nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>

                        <div className=" m-[11px]">
                            <p className="mb-1">Số tiền tặng</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={discountAmount}
                                onChange={handleOnChangeDiscountAmount}
                                placeholder="Nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>

                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent
                                    text="Hủy"
                                    className="bg-[#a6a6a7]"
                                    onClick={handleCloseKMDetailAction}
                                />
                                <ButtonComponent
                                    text={isUpdateKMDetail ? 'Cập nhật' : 'Thêm mới'}
                                    className="bg-blue-500"
                                    onClick={() => {
                                        if (isUpdateKMDetail) {
                                            handleUpdateKMDetail();
                                        } else {
                                            handleAddKMDetail(); // Thêm mới
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Chiết khấu hóa đơn */}
                {type === 2 && (
                    <div className=" h-[87%] grid grid-rows-5 gap-[73px]">
                        <div className=" m-[11px]">
                            <p className="mb-1">Số tiền bán</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={minPurchaseAmount}
                                onChange={handleOnChangeMinPurchaseAmount}
                                placeholder="Nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>
                        <div className=" m-[11px]">
                            <p className="mb-1"> {'%'} Chiết khấu </p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={discountPercentage}
                                onChange={handleOnChangeDiscountPercentage}
                                placeholder="1-100%"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>

                        <div className=" m-[11px]">
                            <p className="mb-1"> Số tiền tối đa</p>
                            <input
                                className="border border-black rounded-sm p-1 w-full text-base  pl-3"
                                type="text"
                                value={maxDiscountAmount}
                                onChange={handleOnChangeMaxDiscountAmount}
                                placeholder="nhập số"
                                required
                                inputMode="numeric" // Đảm bảo chỉ nhập số trên các thiết bị di động
                                pattern="[0-9]*" // Đảm bảo chỉ nhập số
                            />
                        </div>

                        <div className="grid items-center gap-2 border-t mt-4 row-span-2">
                            <div className="justify-end flex space-x-3  p-3 mb-8">
                                <ButtonComponent
                                    text="Hủy"
                                    className="bg-[#a6a6a7]"
                                    onClick={handleCloseKMDetailAction}
                                />
                                <ButtonComponent
                                    text={isUpdateKMDetail ? 'Cập nhật' : 'Thêm mới'}
                                    className="bg-blue-500"
                                    onClick={() => {
                                        if (isUpdateKMDetail) {
                                            handleUpdateKMDetail();
                                        } else {
                                            handleAddKMDetail(); // Thêm mới
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent>
        </div>
    );
};

export default Promotion;
