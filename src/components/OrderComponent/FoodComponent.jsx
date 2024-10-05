import React, { useState } from 'react';
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { useQuery } from 'react-query';
import coca from '~/assets/coca.png';
import Loading from '../LoadingComponent/Loading';
import axios from 'axios';
const FoodComponent = ({ selectedCombos, setSelectedCombos }) => {
    const fetchProductNotSeat = async () => {
        try {
            // Fetch all products
            const response = await axios.get('api/products/getAllNotSeat');
            const products = response.data;

            const product = products.filter((product) => product.status === 1);

            if (product.length === 0) {
                return { products: [] };
            }

            const productsWithPrice = await Promise.all(
                product.map(async (product) => {
                    try {
                        // Fetch price for the product
                        const priceResponse = await axios.get('/api/prices/getPriceDetailsFood', {
                            params: { productCode: product.code },
                        });

                        const priceDetail = priceResponse.data;

                        const price = Array.isArray(priceDetail) && priceDetail[0] ? priceDetail[0].price : 0;

                        return {
                            ...product,
                            price,
                        };
                    } catch (error) {
                        return {
                            ...product,
                            price: 0,
                        };
                    }
                }),
            );

            return { products: productsWithPrice };
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
        // isFetched,
        // isFetching,
        // refetch,
    } = useQuery('productNotSeat1', fetchProductNotSeat, {
        staleTime: 1000 * 60 * 3,
        cacheTime: 1000 * 60 * 10,
    });

    const [quantities, setQuantities] = useState(Array(products.length).fill(0));

    if (isLoading) return <Loading />;
    // if (!isFetched) return <div>Fetching...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    const handleIncrease = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
        updateCombo(products[index], newQuantities[index]);
    };

    const handleDecrease = (index) => {
        const newQuantities = [...quantities];
        if (newQuantities[index] > 0) {
            newQuantities[index] -= 1;
        }
        setQuantities(newQuantities);
        updateCombo(products[index], newQuantities[index]);
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

    return (
        <div className="flex flex-wrap h-[530px] overflow-auto custom-height-lg2 custom-height-md2 p-5 custom-height-sm15 justify-between">
            {products.map((product, index) => (
                <div
                    key={product.code}
                    className=" w-[260px] flex h-auto mini-air justify-center items-center mb-8 rounded-lg shadow-2xl py-3 px-2"
                >
                    <div className="h-[100px] w-[150px] mb-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-fill rounded-[50%] h-[110px] w-[100%]"
                        />
                    </div>
                    <div className=" col-span-2 w-[200px]  text-[#95989D] flex-row   space-y-1 ">
                        <h1 className="text-[15px] font-semibold pl-3  ">{product.name}</h1>
                        <h1 className="text-sm font-normal pl-3">{product.description}</h1>
                        <h1 className="text-sm font-normal pl-3">Giá: {product.price}</h1>
                        <div className="flex w-24 pl-2 justify-between">
                            <button
                                onClick={() => {
                                    handleDecrease(index);
                                }}
                            >
                                <IoMdRemoveCircleOutline color="red" size={25} />
                            </button>
                            <input
                                type="text"
                                value={quantities[index]}
                                readOnly
                                disabled
                                className="w-10 mx-1 text-center text-[13px] border-[gray] border text-black font-bold placeholder:text-black"
                            />
                            <button
                                onClick={() => {
                                    handleIncrease(index);
                                }}
                                className=""
                            >
                                <IoIosAddCircleOutline color="red" size={25} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FoodComponent;
