import { createSlice } from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        schedule: {
            currentSchedule: null,
            isFetching: false,
            error: false,
        },
        isSchedule: {
            currentIsSchedule: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getScheduleStart: (state) => {
            state.schedule.isFetching = true;
        },
        getScheduleSuccess: (state, action) => {
            state.schedule.isFetching = false;
            state.schedule.currentSchedule = action.payload;
            state.schedule.error = false;
        },
        getScheduleFailed: (state) => {
            state.schedule.isFetching = false;
            state.schedule.error = true;
        },

        getIsScheduleStart: (state) => {
            state.isSchedule.isFetching = true;
        },
        getIsScheduleSuccess: (state, action) => {
            state.isSchedule.isFetching = false;
            state.isSchedule.currentIsSchedule = action.payload;
            state.isSchedule.error = false;
        },
        getIsScheduleFailed: (state) => {
            state.isSchedule.isFetching = false;
            state.isSchedule.error = true;
        },
    },
});

export const {
    getScheduleStart,
    getScheduleSuccess,
    getScheduleFailed,
    getIsScheduleStart,
    getIsScheduleSuccess,
    getIsScheduleFailed,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;