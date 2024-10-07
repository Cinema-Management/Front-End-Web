import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
    name: 'seat',
    initialState: {
        seat: {
            currentSeat: null,
            isFetching: false,
            error: false,
            selectedSeats: [],
            combos: [],
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

        toggleCombo: (state, action) => {
            const combo = action.payload;
            const index = state.seat.combos.findIndex((c) => c.code === combo.code); // Sử dụng code để tìm

            if (index >= 0) {
                state.seat.combos.splice(index, 1); // Nếu đã tồn tại, xóa
            } else {
                state.seat.combos.push(combo); // Nếu chưa tồn tại, thêm mới
            }
        },
        addCombo: (state, action) => {
            const product = action.payload;
            state.seat.selectedCombo.push(product); // Thêm sản phẩm vào mảng
        },

        // Thêm reducer để giảm sản phẩm
        removeCombo: (state) => {
            if (state.seat.selectedCombo.length > 0) {
                state.seat.selectedCombo.pop(); // Loại bỏ sản phẩm cuối cùng trong mảng
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
