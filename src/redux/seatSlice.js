import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
    name: 'seat',
    initialState: {
        seat: {
            currentSeat: null,
            isFetching: false,
            error: false,
            selectedSeats: [],
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
    },
});

export const { getSeatStart, getSeatSuccess, getSeatFailed, toggleSeat, resetSeats } = seatSlice.actions;

export default seatSlice.reducer;
