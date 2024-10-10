import React, { useState } from 'react';
import AutoInputComponent from '../AutoInputComponent/AutoInputComponent';
import dayjs from 'dayjs';
import axios from 'axios';
import Loading from '../LoadingComponent/Loading';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ButtonComponent from '../ButtonComponent/Buttoncomponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import vouCher from '~/assets/voucher.png';
const PayComponent = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [open, setOpen] = useState(false);
    const handleButtonClick = (button) => {
        setSelectedButton(button);
        handleOpen();
    };
    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);

    const fetchKMDetail = async () => {
        try {
            const date = dayjs(schedule.date).format('YYYY-MM-DD');
            toast.success('date!'+date);
            const response = await axios.get(
                `api/promotion-lines/getPromotionDetailsByDateAndStatus?date=${date}`,
            );
            const data = response.data;
            return data;
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

    const {
        data: promotionDetails = [] ,
        isLoading: isLoadingCinemas,
    } = useQuery('fetchKMDetail', fetchKMDetail, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });
    (isLoadingCinemas   && (   <div ><Loading /></div>));
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const [selectedPromotion, setSelectedPromotion] = useState(null); // State để quản lý promotion đã chọn

    const handleRadioChange = (promotionId) => {
        setSelectedPromotion(promotionId); // Cập nhật promotion đã chọn
    };

    return (
        <div className="h-[550px] overflow-auto custom-height-lg2 custom-height-md2 p-5 mini1 custom-height-sm15 justify-between">
            <div className="mb-3">
                <button className="bg-gray-200 border border-[gray] shadow-2xl  p-1 rounded-md text-[14px] text-[gray]">
                    Quét mã vạch
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-3 mini1">
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Mã khách hàng"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius={'10px'}
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Số điện thoại"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius="10px"
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Tên khách hàng"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Tích điểm"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
            </div>
            <div className="bg-[#95989D] mt-6 py-8 mini">
                <div className=" p-3 gap-3 flex-col text-white font-black flex items-center text-[16px] ">
                    <button
                        className={`border border-black rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'cash' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('cash')}
                    >
                        Thanh toán bằng tiền mặt
                    </button>
                    <button
                        className={`border border-black rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'momo' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('momo')}
                    >
                        Thanh toán qua <span className="text-[#F61988]">MOMO</span>
                        <sup>QR</sup>
                    </button>
                    <button
                        className={`border border-black   rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'vnpay' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('vnpay')}
                    >
                        Thanh toán qua <span className="text-[#EB0E0E]">VN</span>
                        <span className="text-[#007AFF]">Pay</span>
                        <sup className="text-[#EB0E0E]">QR</sup>
                    </button>
                    <button
                        className={`border border-black   rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'zalopay' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('zalopay')}
                    >
                        Thanh toán qua <span className="text-[#007AFF]">Zalo</span>
                        <span className="text-[#22E242]">Pay</span>
                        <sup className="text-[#007AFF]">QR</sup>
                    </button>
                </div>
            </div>

            <ModalComponent
            open={open}
            handleClose={handleClose}
            width="35%"
            height="69%"
            smallScreenWidth="60%"
            smallScreenHeight="28%"
            mediumScreenWidth="60%"
            mediumScreenHeight="24%"
            largeScreenHeight="21%"
            largeScreenWidth="50%"
            maxHeightScreenHeight="48%"
            maxHeightScreenWidth="45%"
            heightScreen="50%"
            title={'Chọn khuyến mãi'}>
    
    {/* Thẻ div bao ngoài với màu nền tổng */}
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
        <div className="overflow-y-auto flex-1">
            {promotionDetails.map((promotion) => (
                <div 
                    key={promotion._id} 
                    className="flex items-start mb-4 border p-4 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRadioChange(promotion._id)} // Thay đổi lựa chọn khi nhấp vào khung
                >
                    {/* Cột bên trái cho ảnh */}
                    <div className="w-1/4 mr-4 bg-red-500">
                        <img 
                            src={vouCher}
                            alt={promotion.salesProductCode} 
                            className="w-full h-auto rounded" 
                        />
                    </div>
                    
                    {/* Cột giữa cho nội dung */}
                    <div className="flex-1">
                        <div>
                           {promotion.code}
                        </div>

                        {promotion.type === 0 && (
                            <div>
                             Mua {promotion.minQuantity} {promotion.salesProductCode}  <br/> Tặng {promotion.freeQuantity}   {promotion.freeProductCode} 
                            </div>
                        )}
                        {promotion.type === 1 && (
                            <div>
                                <strong>Số tiền tối thiểu: </strong>{promotion.minPurchaseAmount}đ - Giảm giá: {promotion.discountAmount}đ
                            </div>
                        )}
                        {promotion.type === 2 && (
                            <div>
                                <strong>Số tiền tối thiểu: </strong>{promotion.minPurchaseAmount}đ - Giảm %: {promotion.discountPercentage}% - Giới hạn: {promotion.maxDiscountAmount}đ
                            </div>
                        )}
                    </div>
                    
                    {/* Cột bên phải cho nút radio */}
                    <div className="ml-4 flex items-center">
                        <input
                            type="radio"
                            id={promotion._id}
                            name="promotion"
                            checked={selectedPromotion === promotion._id}
                            onChange={() => handleRadioChange(promotion._id)} // Cũng cho phép lựa chọn qua radio
                            className="mr-2 w-6 h-6" // Thay đổi kích thước radio
                        />
                    </div>
                </div>
            ))}
        </div>
        
        {/* Nút Hủy và Xác Nhận */}
        <div className="flex justify-end mt-4">
            <ButtonComponent text="Hủy" className="bg-gray-400" onClick={handleClose} />
            <ButtonComponent text="Xác nhận" className="bg-blue-500 ml-2" onClick={() => {/* Thực hiện xác nhận với selectedPromotion */}} />
        </div>
    </div>
</ModalComponent>





        </div>
    );
};

export default PayComponent;
