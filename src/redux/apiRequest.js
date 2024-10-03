import axios from 'axios';

import { getSeatStart, getSeatSuccess, getSeatFailed } from './seatSlice';
import { getRoomByCodeStart, getRoomByCodeSuccess, getRoomByCodeFailed } from './roomSlice';
import { getCinemaCodeStart, getCinemaCodeSuccess, getCinemaCodeFailed } from './cinemaSlice';

//npm install axios

export const getAllSeatByRoomCode = async (dispatch, roomCode) => {
    dispatch(getSeatStart());
    try {
        const res = await axios.get(`api/products/getAllSeatsByRoomCode/${roomCode}`);
        dispatch(getSeatSuccess(res.data));
    } catch (err) {
        dispatch(getSeatFailed());
    }
};

export const getRoomCode = async (dispatch, roomCode) => {
    dispatch(getRoomByCodeStart());
    try {
        // const res = await axios.get(`api/rooms/getAll/${roomCode}`);
        dispatch(getRoomByCodeSuccess(roomCode));
    } catch (err) {
        dispatch(getRoomByCodeFailed());
    }
};

export const getCinemaCode = async (dispatch, cinemaCode) => {
    dispatch(getCinemaCodeStart());
    try {
        dispatch(getCinemaCodeSuccess(cinemaCode));
    } catch (err) {
        dispatch(getCinemaCodeFailed());
    }
};
