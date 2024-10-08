import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { useQuery } from 'react-query';
import axios from 'axios';
import { addCombo, removeCombo } from '~/redux/seatSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../LoadingComponent/Loading';

const FoodComponent = ({ selectedCombos, setSelectedCombos }) => {
    const [quantities, setQuantities] = useState([]);
    const dispatch = useDispatch();

    const combos = useSelector((state) => state.seat.seat.selectedCombo); // Moved this to the top

    const fetchProductNotSeat = async () => {
        try {
            const response = await axios.get('api/prices/getAllPriceFood');
            const sortedProducts = response.data.sort((a, b) => {
                const nameA = a.productName.toUpperCase(); // Chuyển đổi về chữ hoa để so sánh không phân biệt chữ hoa chữ thường
                const nameB = b.productName.toUpperCase();

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

            setQuantities(Array(sortedProducts.length).fill(0));
            return { products: sortedProducts };
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
        data: { products = [] } = {},
        error,
        isLoading,
    } = useQuery('productNotSeat1', fetchProductNotSeat, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading data: {error.message}</div>;

    const groupProductsByCode = (products) => {
        return products.reduce((acc, product) => {
            const existingProduct = acc.find((item) => item.code === product.code);

            if (existingProduct) {
                existingProduct.quantity += 1;
                existingProduct.totalPrice += product.price || 0;
            } else {
                acc.push({
                    name: product.name,
                    quantity: 1,
                    price: product.price || 0,
                    totalPrice: product.price || 0,
                    code: product.code,
                });
            }

            return acc;
        }, []);
    };

    const groupedCombos = groupProductsByCode(combos);

    const handleIncrease = (index) => {
        setQuantities((prevQuantities) => {
            const newQuantities = [...prevQuantities];
            newQuantities[index] = (newQuantities[index] || 0) + 1;
            return newQuantities;
        });
    };

    const handleDecrease = (index) => {
        setQuantities((prevQuantities) => {
            const newQuantities = [...prevQuantities];
            if (newQuantities[index] > 0) {
                newQuantities[index] -= 1;
            }
            return newQuantities;
        });
    };

    const updateCombo = (product, quantity) => {
        const existingComboIndex = selectedCombos.findIndex((item) => item.product.id === product.id);

        if (existingComboIndex >= 0) {
            if (quantity > 0) {
                const updatedCombos = [...selectedCombos];
                updatedCombos[existingComboIndex].quantity = quantity;
                setSelectedCombos(updatedCombos);
            } else {
                const updatedCombos = selectedCombos.filter((item, index) => index !== existingComboIndex);
                setSelectedCombos(updatedCombos);
            }
        } else {
            if (quantity > 0) {
                setSelectedCombos((prev) => [...prev, { product, quantity }]);
            }
        }
    };

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    return (
        <div className="flex flex-wrap h-[530px] overflow-auto custom-height-lg2 custom-height-md2 p-5 custom-height-sm15 justify-between">
            {products.map((product, index) => {
                const matchedCombo = groupedCombos.find((item) => item.code === product.code);
                const quantity = matchedCombo ? matchedCombo.quantity : 0;

                return (
                    <div
                        key={product.code}
                        className="w-[260px] flex h-auto mini-air justify-center items-center mb-8 rounded-lg shadow-2xl py-3 px-2"
                    >
                        <div className="h-[100px] w-[150px] mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="object-fill rounded-[50%] h-[110px] w-[100%]"
                            />
                        </div>
                        <div className="col-span-2 w-[200px] text-[#95989D] flex-row space-y-1">
                            <h1 className="text-[15px] font-semibold pl-3">{product.productName}</h1>
                            <h1 className="text-sm font-normal pl-3">{product.descriptionProduct}</h1>
                            <h1 className="text-sm font-normal pl-3">Giá: {formatCurrency(product.price)}</h1>
                            <div className="flex w-24 pl-2 justify-between">
                                <button
                                    onClick={() => {
                                        handleDecrease(index);
                                        dispatch(removeCombo(product));
                                    }}
                                >
                                    <IoMdRemoveCircleOutline color="red" size={25} />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-10 mx-1 text-center text-[13px] border-[gray] border text-black font-bold placeholder:text-black"
                                />
                                <button
                                    onClick={() => {
                                        handleIncrease(index);
                                        dispatch(addCombo(product));
                                    }}
                                >
                                    <IoIosAddCircleOutline color="red" size={25} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FoodComponent;
