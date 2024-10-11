// src/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { set } from 'date-fns';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [], // Danh sách sản phẩm
        isFetching: false, // Trạng thái fetch
        error: false, // Trạng thái lỗi
        calculatedPrice: 0, // Giá đã tính toán
        freeProduct: [], // Sản phẩm miễn phí
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload; // Lưu danh sách sản phẩm
        },
        setCalculatedPrice: (state, action) => {
            state.calculatedPrice = action.payload; // Lưu giá đã tính toán
        },
        setFreeProduct: (state, action) => {
            state.freeProduct = action.payload; // Lưu danh sách sản phẩm miễn phí
        },
    },
});

export const { setProducts, setCalculatedPrice, setFreeProduct } = productSlice.actions;

export default productSlice.reducer;
