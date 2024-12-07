import React, { useEffect, useMemo, useState } from 'react';
import AutoInputComponent from '../AutoInputComponent/AutoInputComponent';
import axios from 'axios';
import Loading from '../LoadingComponent/Loading';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ButtonComponent from '../ButtonComponent/Buttoncomponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import vouCher from '~/assets/voucher.png';
import { FaCheck } from 'react-icons/fa'; // Import icon dấu tích
import { Button } from 'antd';
import { setCalculatedPrice, setFreeProduct, setPromotionDetailCode } from '~/redux/productSlice';
import { getCustomer } from '~/redux/apiRequest';

const isPromotionApplicable = (promotion, groupedCombos, totalPriceBefore) => {
    if (promotion.type === 0) {
        // So sánh sản phẩm và số lượng trong groupedCombos
        return groupedCombos?.some(
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

const calculateDiscount = (promotion, totalPriceMain) => {
    let discountAmount = 0;

    switch (promotion.type) {
        case 1: // Type 1: Giảm giá cố định
            if (totalPriceMain >= promotion.minPurchaseAmount) {
                discountAmount = promotion.discountAmount;
            }
            break;

        case 2: // Type 2: Giảm giá phần trăm
            if (totalPriceMain >= promotion.minPurchaseAmount) {
                discountAmount = (totalPriceMain * promotion.discountPercentage) / 100;
                if (promotion.maxDiscountAmount) {
                    discountAmount = Math.min(discountAmount, promotion.maxDiscountAmount);
                }
            }
            break;

        default:
            discountAmount = 0;
    }

    return discountAmount;
};

const PayComponent = () => {
    const [selectedMovie, setSelectedMovie] = useState('');
    const [open, setOpen] = useState(false);

    const combos = useSelector((state) => state.seat.seat.selectedCombo); // Lấy danh sách số lượng sản phẩm
    const dispatch = useDispatch();
    const [searchPhone, setSearchPhone] = useState('');
    const [nameCustomer, setNameCustomer] = useState('');
    const [points, setPoints] = useState(0);
    const [sortedData, setSortedData] = useState([]);

    const calculateTotalWithPromotion = (
        totalPriceMain,
        selectedPromotion,
        groupedCombos,
        promotionDetails,
        availableProducts,
    ) => {
        let discountAmount = 0;
        let freeProductAdd = ''; // Lưu sản phẩm để xuất hóa đơn
        let freeProductTitle = '';

        // Tìm khuyến mãi dựa trên mã đã chọn
        const promotion = promotionDetails.find((promo) => promo.code === selectedPromotion);

        if (promotion) {
            switch (promotion.type) {
                case 0: // Type 0: Khuyến mãi tặng sản phẩm miễn phí
                    // Tìm sản phẩm mà người dùng đã mua đủ số lượng
                    const applicableCombo = groupedCombos.find((combo) => promotion.salesProductCode === combo.code);

                    if (applicableCombo && applicableCombo.quantity >= promotion.minQuantity) {
                        // Tìm sản phẩm tặng
                        const freeProduct = availableProducts.find(
                            (product) => product.productCode === promotion.freeProductCode,
                        );
                        freeProductTitle = 'Tặng ' + promotion.freeQuantity + ' ' + freeProduct.productName;

                        if (freeProduct) {
                            // Lưu giá gốc của sản phẩm tặng
                            const freeProductOriginalPrice = freeProduct.price;

                            // Ghi chú lại sản phẩm tặng với giá 0 đồng, và lưu giá gốc
                            freeProductAdd = {
                                originalPrice: freeProductOriginalPrice, // Giá trị gốc của sản phẩm tặng
                                freeProductCode: promotion.freeProductCode, // Mã sản phẩm tặng
                                productName: freeProduct.productName, // Tên sản phẩm tặng
                                freeQuantity: promotion.freeQuantity, // Số lượng sản phẩm tặng
                                price: 0, // Gán giá trị sản phẩm tặng bằng 0
                                isGift: true, // Đánh dấu sản phẩm là quà tặng
                            };
                        }
                    }
                    break;

                case 1: // Type 1: Giảm giá cố định
                    if (totalPriceMain >= promotion.minPurchaseAmount) {
                        discountAmount = promotion.discountAmount; // Giảm giá cố định
                    }
                    break;

                case 2: // Type 2: Giảm giá theo phần trăm
                    if (totalPriceMain >= promotion.minPurchaseAmount) {
                        discountAmount = (totalPriceMain * promotion.discountPercentage) / 100; // Tính giảm giá theo phần trăm

                        // Đảm bảo giảm giá không vượt quá giới hạn giảm giá tối đa
                        if (promotion.maxDiscountAmount) {
                            discountAmount = Math.min(discountAmount, promotion.maxDiscountAmount);
                        }
                    }
                    break;

                default:
                    discountAmount = 0; // Không có khuyến mãi
            }
        }

        // Tính tổng giá sau khi áp dụng giảm giá (không tính sản phẩm tặng)
        const newTotalPrice = Math.max(totalPriceMain - discountAmount, 0);

        dispatch(setCalculatedPrice(newTotalPrice));
        dispatch(setPromotionDetailCode(promotion?.code));

        return { newTotalPrice, freeProductAdd, freeProductTitle }; // Trả về tổng tiền và sản phẩm đã thêm giá trị gốc
    };

    const groupedCombos = groupProductsByCode(combos); // Nhóm sản phẩm

    const arraySeat = useSelector((state) => state.seat.seat?.selectedSeats);
    const products = useSelector((state) => state.products?.products); // Lấy danh sách sản phẩm từ store

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

    function formatCurrency(amount) {
        return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const [selectedPromotion, setSelectedPromotion] = useState(null); // State để quản lý promotion đã chọn
    const [selectedPromotionDetail, setSelectedPromotionDetail] = useState(null); // State để quản lý promotion đã chọn

    const schedule = useSelector((state) => state.schedule.schedule?.currentSchedule);

    const fetchKMDetail = async (code) => {
        try {
            const response = await axios.get(`api/promotion-details/getPromotionDetailsByDateAndStatus?date=${code}`);
            const data = response.data || [];

            // Sắp xếp dữ liệu theo type tăng dần
            data.sort((a, b) => a.type - b.type);

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

    useEffect(() => {
        if (promotionDetails && promotionDetails.length > 0) {
            // Hàm tính giá trị khuyến mãi
            const calculatePromotionValue = (promotion) => {
                if (promotion.type === 0) {
                    // Loại tặng sản phẩm miễn phí
                    const freeProduct = products.find((product) => product.productCode === promotion.freeProductCode);
                    return freeProduct ? freeProduct.price * promotion.freeQuantity : 0;
                } else if (promotion.type === 1 || promotion.type === 2) {
                    // Loại giảm giá
                    return calculateDiscount(promotion, totalPriceBefore);
                }
                return 0;
            };

            // Tìm khuyến mãi có lợi nhất
            const bestPromotion = promotionDetails.reduce((best, current) => {
                // Kiểm tra nếu khuyến mãi áp dụng được
                const isApplicable = isPromotionApplicable(current, groupedCombos, totalPriceBefore);

                if (!isApplicable) return best;

                // Tính giá trị khuyến mãi
                const currentValue = calculatePromotionValue(current);
                const bestValue = best ? calculatePromotionValue(best) : 0;

                return currentValue > bestValue ? current : best;
            }, null);

            if (bestPromotion) {
                setSelectedPromotion(bestPromotion.code);
                setSelectedPromotionDetail(bestPromotion.code);

                if (bestPromotion.type === 0) {
                    // Nếu là khuyến mãi tặng sản phẩm miễn phí, tính sản phẩm tặng kèm
                    const { freeProductAdd } = calculateTotalWithPromotion(
                        totalPriceBefore,
                        bestPromotion.code,
                        groupedCombos,
                        promotionDetails,
                        products,
                    );
                    dispatch(setFreeProduct(freeProductAdd));
                } else {
                    // Nếu không phải khuyến mãi tặng sản phẩm, không set sản phẩm tặng
                    dispatch(setFreeProduct([]));
                }
            } else {
                // Nếu không có khuyến mãi nào áp dụng
                setSelectedPromotion(null);
                setSelectedPromotionDetail(null);
                dispatch(setFreeProduct([]));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promotionDetails, totalPriceBefore]);

    const handleEnterPress = (newValue) => {
        handleSearchPhone(newValue);
    };
    const handleSearchPhone = async (value) => {
        try {
            setSearchPhone(value);
            if (value === '' || value === null) {
                return;
            }
            const customerResponse = await axios.get('api/users');
            const customers = customerResponse.data;
            const search = customers.find((item) => item.phone === value);

            if (!search) {
                toast.info('Không tìm thấy!');
                setNameCustomer('');
                setPoints('');
                getCustomer(dispatch, null);
            } else {
                console.log(search.points);
                setNameCustomer(search?.name);
                setPoints(`${search?.points}`);
                getCustomer(dispatch, search);
            }
        } catch (error) {
            toast.error('Lỗi' || error.message);
        }
    };

    useEffect(() => {
        if (!open) {
            const applicableFlags = promotionDetails.map((item) => ({
                ...item,
                isApplicable: isPromotionApplicable(item, groupedCombos, totalPriceBefore),
            }));

            const newSortedData = applicableFlags.sort((a, b) => {
                if (a.code === selectedPromotion) return -1; // Mục được chọn sẽ lên đầu
                if (b.code === selectedPromotion) return 1;
                if (b.isApplicable && !a.isApplicable) return 1; // b có thể áp dụng -> lên trên a
                if (!b.isApplicable && a.isApplicable) return -1; // a có thể áp dụng -> lên trên b
                return 0; // Giữ nguyên thứ tự nếu cả hai đều không áp dụng hoặc đều áp dụng
            });

            if (!open && JSON.stringify(newSortedData) !== JSON.stringify(sortedData)) {
                setSortedData(newSortedData);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedPromotion, promotionDetails]);

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

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleRadioChange = (code) => {
        if (selectedPromotion === code) {
            setSelectedPromotion(null);
        } else {
            setSelectedPromotion(code);
        }
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
                    title="Mã thành viên"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius={'10px'}
                    disabled={true}
                />
                <AutoInputComponent
                    value={searchPhone}
                    onChange={(newValue) => handleSearchPhone(newValue)}
                    title="Số điện thoại"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius="10px"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleEnterPress(e.target.value);
                        }
                    }}
                />
                <AutoInputComponent
                    value={nameCustomer}
                    // onChange={setNameCustomer}
                    title="Tên khách hàng"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
                <AutoInputComponent
                    value={points}
                    onChange={setPoints}
                    title="Điểm tích lũy"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
            </div>
            {/* <div className="bg-[#95989D] mt-6  mini ">
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
            </div> */}

            <div className=" flex  justify-between items-center py-3">
                <Button
                    // variant="contained"
                    sx={{
                        textTransform: 'none',
                        padding: '2px 8px 2px 4px',
                    }}
                    className="gradient-button text-white"
                    onClick={promotionDetails.length > 0 ? handleOpen : () => toast.warning('Không có khuyến mãi')}
                >
                    Khuyến mãi
                </Button>

                <span className="text-gray-500 flex">
                    {calculateTotalWithPromotion(
                        totalPriceBefore,
                        selectedPromotionDetail,
                        groupedCombos,
                        promotionDetails,
                        products,
                    ).newTotalPrice === totalPriceBefore
                        ? calculateTotalWithPromotion(
                              totalPriceBefore,
                              selectedPromotionDetail,
                              groupedCombos,
                              promotionDetails,
                              products,
                          ).freeProductTitle
                        : formatCurrency(
                              calculateTotalWithPromotion(
                                  totalPriceBefore,
                                  selectedPromotionDetail,
                                  groupedCombos,
                                  promotionDetails,
                                  products,
                              ).newTotalPrice - totalPriceBefore,
                          )}
                </span>
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
                            calculateTotalWithPromotion(
                                totalPriceBefore,
                                selectedPromotionDetail,
                                groupedCombos,
                                promotionDetails,
                                products,
                            ).newTotalPrice - totalPriceBefore,
                        )}
                    </span>
                    <span className=" justify-end flex font-semibold ">
                        {formatCurrency(
                            calculateTotalWithPromotion(
                                totalPriceBefore,
                                selectedPromotionDetail,
                                groupedCombos,
                                promotionDetails,
                                products,
                            ).newTotalPrice,
                        )}
                    </span>
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
                title={'Chọn khuyến mãi'}
            >
                <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        {sortedData?.map((promotion) => {
                            // Check if the promotion meets the criteria for selection
                            return (
                                <div
                                    key={promotion.code}
                                    className={`flex items-center mb-4 border-y m-5 border-r justify-center rounded  ${
                                        selectedPromotion === promotion.code ? 'bg-white' : ''
                                    } ${promotion?.isApplicable ? 'cursor-pointer' : 'cursor-not-allowed  opacity-50'}`}
                                    onClick={() => promotion?.isApplicable && handleRadioChange(promotion.code)}
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
                                                <div className="grid-rows-2 col-span-4 grid items-start">
                                                    <span className="grid font-semibold">
                                                        {' '}
                                                        Tặng {promotion.freeQuantity}{' '}
                                                    </span>
                                                    <span className="grid"> Khi mua {promotion.minQuantity} </span>
                                                </div>
                                                <div className="grid-rows-2 grid col-span-6">
                                                    <span className="grid font-semibold">
                                                        {' '}
                                                        {promotion.nameProductFree}{' '}
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
                                        <label className="relative inline-flex items-center ">
                                            {/* <input
                                                type="radio"
                                                id={promotion.code}
                                                name="promotion"
                                                checked={selectedPromotion === promotion.code}
                                                onChange={() => promotion?.isApplicable} // Allow selection only if applicable
                                                className={`sr-only peer ${promotion?.isApplicable ? '' : 'cursor-not-allowed'}`} // Disable radio if not applicable
                                                disabled={!promotion?.isApplicable} // Disable the radio input if not applicable
                                            /> */}
                                            <div
                                                className={`w-6 h-6   rounded-full flex items-center justify-center transition 
                                                ${
                                                    selectedPromotion === promotion.code
                                                        ? 'bg-orange-500'
                                                        : 'bg-gray-200 border-gray-300 border-2'
                                                }
                                                `}
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
                                dispatch(setFreeProduct([]));
                            }}
                        />
                        <ButtonComponent
                            text="Xác nhận"
                            className="bg-blue-500 ml-2"
                            onClick={() => {
                                setSelectedPromotionDetail(selectedPromotion);

                                const { freeProductAdd } = calculateTotalWithPromotion(
                                    totalPriceBefore,
                                    selectedPromotion, // Sử dụng giá trị mới
                                    groupedCombos,
                                    promotionDetails,
                                    products,
                                );

                                // Gửi freeProductAdd đến Redux
                                dispatch(setFreeProduct(freeProductAdd));
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
