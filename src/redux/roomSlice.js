import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        roomByCode: {
            currentRoomByCode: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getRoomByCodeStart: (state) => {
            state.roomByCode.isFetching = true;
        },
        getRoomByCodeSuccess: (state, action) => {
            state.roomByCode.isFetching = false;
            state.roomByCode.currentRoomByCode = action.payload;
            state.roomByCode.error = false;
        },
        getRoomByCodeFailed: (state) => {
            state.roomByCode.isFetching = false;
            state.roomByCode.error = true;
        },
    },
});

export const { getRoomByCodeStart, getRoomByCodeSuccess, getRoomByCodeFailed } = roomSlice.actions;

export default roomSlice.reducer;
