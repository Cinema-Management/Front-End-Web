// valueSlice.js
import { createSlice } from '@reduxjs/toolkit';

const valueSlice = createSlice({
    name: 'value',
    initialState: {
        value: 0, // Giá trị mặc định là 0
    },
    reducers: {
        increment: (state) => {
            state.value += 1; // Tăng giá trị lên 1
        },
        decrement: (state) => {
            state.value -= 1; // Giảm giá trị đi 1
        },
        resetValue: (state) => {
            state.value = 0; // Đặt lại giá trị về 0
        },
    },
});

export const { increment, decrement, resetValue } = valueSlice.actions;

export default valueSlice.reducer;
