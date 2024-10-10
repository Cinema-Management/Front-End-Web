import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
    name: 'seat',
    initialState: {
        seat: {
            currentSeat: null,
            isFetching: false,
            error: false,
            selectedSeats: [],
            selectedCombo: [],
        },
    },
    reducers: {
        getSeatStart: (state) => {
            state.seat.isFetching = true;
        },
        getSeatSuccess: (state, action) => {
            state.seat.isFetching = false;
            state.seat.currentSeat = action.payload;
            state.seat.error = false;
        },
        getSeatFailed: (state) => {
            state.seat.isFetching = false;
            state.seat.error = true;
        },

        toggleSeat: (state, action) => {
            const seat = action.payload;
            const index = state.seat.selectedSeats.findIndex((s) => s.code === seat.code);

            if (index >= 0) {
                state.seat.selectedSeats.splice(index, 1);
            } else {
                state.seat.selectedSeats.push(seat);
            }
        },

        resetSeats: (state) => {
            state.seat.selectedSeats = [];
        },

        addCombo: (state, action) => {
            const product = action.payload;
            state.seat.selectedCombo.push(product); // Thêm sản phẩm vào mảng
        },

        // Thêm reducer để giảm sản phẩm
        removeCombo: (state, action) => {
            const combo = action.payload;
            const index = state.seat.selectedCombo.findIndex((c) => c.productCode === combo.productCode); // Sử dụng code để tìm

            if (index >= 0) {
                state.seat.selectedCombo.splice(index, 1); // Nếu đã tồn tại, xóa
            }
        },
        resetCombo: (state) => {
            state.seat.selectedCombo = [];
        },
    },
});

export const {
    getSeatStart,
    getSeatSuccess,
    getSeatFailed,
    toggleSeat,
    resetSeats,
    addCombo,
    removeCombo,
    resetCombo,
} = seatSlice.actions;

export default seatSlice.reducer;
