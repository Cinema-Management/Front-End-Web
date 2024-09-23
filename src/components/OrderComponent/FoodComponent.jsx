import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import coca from '~/assets/coca.png';
const FoodComponent = ({ selectedCombos, setSelectedCombos }) => {
    console.log('FoodComponent');
    const products = [
        {
            id: 1,
            name: 'Coca Đủ vị phô ',
            description: '1 bắp 1 nước',
            price: '20,000 đ',
            image: coca,
        },
        {
            id: 2,
            name: 'Pepsi',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },

        {
            id: 3,
            name: 'Fanta',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },
        {
            id: 4,
            name: 'Pepsi',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },

        {
            id: 5,
            name: 'Fanta',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },
        {
            id: 6,
            name: 'Pepsi',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },

        {
            id: 7,
            name: 'Fanta',
            description: 'Nước ngọt',
            price: '20,000 đ',
            image: coca,
        },
    ];
    const [quantities, setQuantities] = useState(Array(products.length).fill(0));

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
                    key={product.id}
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
