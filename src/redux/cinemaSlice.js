import { createSlice } from '@reduxjs/toolkit';

const cinemaSlice = createSlice({
    name: 'cinema',
    initialState: {
        code: {
            currentCode: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getCinemaCodeStart: (state) => {
            state.code.isFetching = true;
        },
        getCinemaCodeSuccess: (state, action) => {
            state.code.isFetching = false;
            state.code.currentCode = action.payload;
            state.code.error = false;
        },
        getCinemaCodeFailed: (state) => {
            state.code.isFetching = false;
            state.code.error = true;
        },
    },
});

export const { getCinemaCodeStart, getCinemaCodeSuccess, getCinemaCodeFailed } = cinemaSlice.actions;

export default cinemaSlice.reducer;
