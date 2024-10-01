import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
    name: 'seat',
    initialState: {
        seat: {
            currentSeat: null,
            isFetching: false,
            error: false,
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
    },
});

export const { getSeatStart, getSeatSuccess, getSeatFailed } = seatSlice.actions;

export default seatSlice.reducer;
