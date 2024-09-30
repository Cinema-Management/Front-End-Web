import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        getRoomStart: (state) => {
            state.isFetching = true;
        },
        getRoomSuccess: (state, action) => {
            state.isFetching = false;
            state.currentRoom = action.payload;
            state.error = false;
        },
        getRoomFailed: (state) => {
            state.room.isFetching = false;
            state.room.error = true;
        },
    },
});

export const { getRoomStart, getRoomSuccess, getRoomFailed } = roomSlice.actions;

export default roomSlice.reducer;
