import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [], // Danh sách sản phẩm
        isFetching: false, // Trạng thái fetch
        error: false, // Trạng thái lỗi
        calculatedPrice: 0, // Giá đã tính toán
        freeProduct: '', // Sản phẩm miễn phí
        promotionDetailCode: '', // Mã khuyến mãi
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
        setPromotionDetailCode: (state, action) => {
            state.promotionDetailCode = action.payload; // Lưu mã khuyến mãi
        },
        resetPromotionData: (state) => {
            state.promotionDetailCode = ''; // Reset mã khuyến mãi
            state.freeProduct = ''; // Reset danh sách sản phẩm miễn phí
        },
    },
});

export const { setProducts, setCalculatedPrice, setFreeProduct, setPromotionDetailCode, resetPromotionData } =
    productSlice.actions;

export default productSlice.reducer;
