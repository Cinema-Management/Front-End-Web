import React, { useMemo, useState } from 'react';
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
import { FaCheck } from 'react-icons/fa'; // Import icon dấu tích
import { Button } from 'antd';

const isPromotionApplicable = (promotion, groupedCombos, totalPriceBefore) => {
    if (promotion.type === 0) {
        // So sánh sản phẩm và số lượng trong groupedCombos
        return groupedCombos.some(
            (combo) => promotion.salesProductCode === combo.code && promotion.minQuantity <= combo.quantity,
        );
    }

    if (promotion.type === 1 || promotion.type === 2) {
        // So sánh trực tiếp với tổng giá trị mua hàng
        return promotion.minPurchaseAmount <= totalPriceBefore;
    }

    // Trả về false nếu không khớp loại khuyến mãi nào
    return false;
};

const groupProductsByCode = (products) => {
    return products?.reduce((acc, product) => {
        const existingProduct = acc.find((item) => item.code === product.productCode);

        if (existingProduct) {
            existingProduct.quantity += 1; // Tăng số lượng nếu đã tồn tại
            existingProduct.totalPrice += product.price || 0; // Cộng thêm giá vào tổng giá
        } else {
            acc.push({
                name: product.productName, // Lưu tên sản phẩm
                quantity: 1, // Khởi tạo số lượng
                price: product.price || 0, // Lưu giá của sản phẩm
                priceDetailCode: product.code || null, // Lưu giá của sản phẩm
                totalPrice: product.price || 0, // Khởi tạo tổng giá
                code: product.productCode, // Lưu mã sản phẩm
            });
        }

        return acc;
    }, []);
};

const PayComponent = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [open, setOpen] = useState(false);

    const combos = useSelector((state) => state.seat.seat.selectedCombo); // Lấy danh sách số lượng sản phẩm

    const groupedCombos = groupProductsByCode(combos); // Nhóm sản phẩm

    const arraySeat = useSelector((state) => state.seat.seat?.selectedSeats);

    const calculateTotalPrice = (seats) => {
        return seats?.reduce((total, seat) => {
            return total + (seat.price || 0); // Thêm giá của ghế vào tổng, nếu không có giá thì cộng 0
        }, 0);
    };

    const totalPrice = useMemo(() => calculateTotalPrice(arraySeat), [arraySeat]);

    const calculateTotalPriceForCombos = (groupedCombos) => {
        return groupedCombos?.reduce((total, combo) => total + combo.totalPrice, 0);
    };

    const totalPriceCombo = useMemo(() => calculateTotalPriceForCombos(groupedCombos), [groupedCombos]);

    const totalPriceBefore = useMemo(() => totalPriceCombo + totalPrice, [totalPriceCombo, totalPrice]);

    const handleButtonClick = (button) => {
        setSelectedButton(button);
        // handleOpen();
    };
    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const [selectedPromotion, setSelectedPromotion] = useState(null); // State để quản lý promotion đã chọn
    const [selectedPromotionDetail, setSelectedPromotionDetail] = useState(null); // State để quản lý promotion đã chọn

    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);

    const fetchKMDetail = async (date) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const response = await axios.get(
                `api/promotion-details/getPromotionDetailsByDateAndStatus?date=${formattedDate}`,
            );
            return response.data || [];
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
        data: promotionDetails = [],
        isLoading: isLoadingPromotionDetail,
        error: errorPromotionDetail,
    } = useQuery(
        ['fetchKMDetail', schedule?.date], // Query key phụ thuộc vào 'date'
        () => fetchKMDetail(schedule?.date),
        {
            staleTime: 1000 * 60 * 3, // Cache dữ liệu trong 3 phút
            cacheTime: 1000 * 60 * 10, // Cache dữ liệu trong 10 phút
            enabled: !!schedule?.date, // Chỉ fetch khi 'date' không phải null hoặc undefined
        },
    );
    if (isLoadingPromotionDetail)
        return (
            <div>
                <Loading />
            </div>
        );

    if (errorPromotionDetail)
        return (
            <div>
                <p>{errorPromotionDetail.message}</p>
            </div>
        );

    const calculateTotalWithPromotion = (totalPriceMain, selectedPromotion, groupedCombos) => {
        let discountAmount = 0;

        // Check if a promotion is selected
        if (selectedPromotion) {
            const promotion = promotionDetails.find((promo) => promo.code === selectedPromotion);

            if (promotion) {
                if (promotion.type === 0) {
                    // Type 0: Free product promotion
                    const applicableCombo = groupedCombos.find((combo) => promotion.salesProductCode === combo.code);
                    if (applicableCombo && applicableCombo.quantity >= promotion.minQuantity) {
                        discountAmount = promotion.freeQuantity * applicableCombo.price; // Assuming unitPrice is the price of the product
                    }
                } else if (promotion.type === 1) {
                    // Type 1: Fixed discount
                    if (totalPriceMain >= promotion.minPurchaseAmount) {
                        discountAmount = promotion.discountAmount;
                    }
                } else if (promotion.type === 2) {
                    // Type 2: Percentage discount
                    if (totalPriceMain >= promotion.minPurchaseAmount) {
                        discountAmount = (totalPriceMain * promotion.discountPercentage) / 100;
                        discountAmount = Math.min(discountAmount, promotion.maxDiscountAmount); // Ensure discount does not exceed max discount
                    }
                }
            }
        }

        // Calculate the new total price after applying the discount
        const newTotalPrice = totalPriceMain - discountAmount;

        return newTotalPrice < 0 ? 0 : newTotalPrice; // Ensure total price does not go below zero
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleRadioChange = (code) => {
        setSelectedPromotion(code); // Cập nhật promotion đã chọn
        toast.success('Chọn khuyến mãi thành công' + code);
    };

    return (
        <div className="h-[550px] overflow-auto custom-height-lg2 custom-height-md2 p-5 mini1 custom-height-sm15 justify-between">
            <div className="mb-3">
                {/* <button className="bg-gray-200 border border-[gray] shadow-2xl  p-1 rounded-md text-[14px] text-[gray]">
                    Quét mã vạch
                </button> */}
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
            <div className="bg-[#95989D] mt-6  mini">
                <div className=" p-3 gap-3 flex-col text-white font-black flex items-center text-[16px] ">
                    <button
                        className={`border border-black rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'cash' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('cash')}
                    >
                        Thanh toán bằng tiền mặt
                    </button>
                    {/* <button
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
                    </button> */}
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
            <div className="  text-[gray] grid  grid-cols-2 mt-5">
                <div className="grid font-medium text-lg  ">
                    <span>Tổng tiền:</span>
                    <span>Giảm giá:</span>
                    <span>Tổng thanh toán:</span>
                </div>

                <div className="grid   text-lg justify-end ">
                    <span className=" justify-end flex">{formatCurrency(totalPriceBefore)}</span>

                    <span className=" justify-end flex">
                        {formatCurrency(
                            calculateTotalWithPromotion(totalPriceBefore, selectedPromotionDetail, groupedCombos) -
                                totalPriceBefore,
                        )}
                    </span>
                    <span className=" justify-end flex font-semibold ">
                        {formatCurrency(
                            calculateTotalWithPromotion(totalPriceBefore, selectedPromotionDetail, groupedCombos),
                        )}
                    </span>
                </div>
            </div>

            <div className="">
                <Button
                    // variant="contained"
                    sx={{
                        textTransform: 'none',
                        padding: '2px 8px 2px 4px',
                    }}
                    className="gradient-button text-black text-[16px] mt-5"
                    onClick={promotionDetails.length > 0 ? handleOpen : () => toast.warning('Không có khuyến mãi')}
                >
                    Chương trình khuyến mãi
                </Button>
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
                title={'Chọn khuyến mãi'}
            >
                <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        {promotionDetails?.map((promotion) => {
                            // Check if the promotion meets the criteria for selection
                            const isApplicable = isPromotionApplicable(promotion, groupedCombos, totalPriceBefore);
                            return (
                                <div
                                    key={promotion.code}
                                    className={`flex items-center mb-4 border-y m-5 border-r justify-center rounded cursor-pointer ${
                                        selectedPromotion === promotion.code ? 'bg-white' : ''
                                    } ${isApplicable ? '' : 'bg-gray-50 cursor-not-allowed'}`} // Bright background if applicable, gray if not
                                    onClick={() => isApplicable && handleRadioChange(promotion.code)} // Allow selection only if applicable
                                >
                                    <div className="w-1/4 mt-[2px] mr-4">
                                        <img
                                            src={vouCher}
                                            alt={promotion.salesProductCode}
                                            className="w-full h-auto rounded"
                                        />
                                    </div>

                                    <div className="flex-1 py-4">
                                        <div>{promotion.code}</div>

                                        {promotion.type === 0 && (
                                            <div className="grid grid-cols-10 space-x-4">
                                                <div className="grid-rows-2 col-span-4 grid items-end">
                                                    <span className="grid font-semibold">
                                                        {' '}
                                                        Tặng {promotion.freeQuantity}{' '}
                                                    </span>
                                                    <span className="grid"> Khi mua {promotion.minQuantity} </span>
                                                </div>
                                                <div className="grid-rows-2 grid col-span-6">
                                                    <span className="grid font-semibold">
                                                        {' '}
                                                        {promotion.nameProductSales}{' '}
                                                    </span>
                                                    <span className="grid"> {promotion.nameProductSales} </span>
                                                </div>
                                            </div>
                                        )}
                                        {promotion.type === 1 && (
                                            <div className="grid grid-cols-1 ">
                                                <div className="font-semibold">
                                                    Giảm {formatCurrency(promotion.discountAmount)}
                                                </div>
                                                <div className="font-normal text-sm">
                                                    {' '}
                                                    Đơn tối thiểu {formatCurrency(promotion.minPurchaseAmount)}
                                                </div>
                                            </div>
                                        )}
                                        {promotion.type === 2 && (
                                            <div className="grid grid-cols-1 ">
                                                <div className="font-semibold">
                                                    Giảm {promotion.discountPercentage}% Giảm tối đa
                                                </div>
                                                <div className="font-semibold ">
                                                    {' '}
                                                    {formatCurrency(promotion.maxDiscountAmount)}
                                                </div>
                                                <div className="font-normal text-sm">
                                                    {' '}
                                                    Đơn tối thiểu {formatCurrency(promotion.minPurchaseAmount)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="items-center m-5">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                id={promotion.code}
                                                name="promotion"
                                                checked={selectedPromotion === promotion.code}
                                                // onChange={() => isApplicable && handleRadioChange(promotion._id)} // Allow selection only if applicable
                                                className={`sr-only peer ${isApplicable ? '' : 'cursor-not-allowed'}`} // Disable radio if not applicable
                                                disabled={!isApplicable} // Disable the radio input if not applicable
                                            />
                                            <div
                                                className={`w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center transition ${
                                                    isApplicable
                                                        ? 'bg-white peer-checked:border-orange-500 peer-checked:bg-orange-500'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                {selectedPromotion === promotion.code && (
                                                    <FaCheck size={10} color="white" />
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end mt-4">
                        <ButtonComponent
                            text="Hủy"
                            className="bg-gray-400"
                            onClick={() => {
                                setSelectedPromotionDetail(null);
                                handleClose();
                            }}
                        />
                        <ButtonComponent
                            text="Xác nhận"
                            className="bg-blue-500 ml-2"
                            onClick={() => {
                                setSelectedPromotionDetail(selectedPromotion);
                                handleClose();
                            }}
                        />
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default PayComponent;
