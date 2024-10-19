import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import { getSeatStart, getSeatSuccess, getSeatFailed } from './seatSlice';
import { getRoomStart, getRoomSuccess, getRoomFailed } from './roomSlice';
import { getCinemaCodeStart, getCinemaCodeSuccess, getCinemaCodeFailed } from './cinemaSlice';
import {
    getScheduleStart,
    getScheduleSuccess,
    getScheduleFailed,
    getIsScheduleFailed,
    getIsScheduleSuccess,
    getIsScheduleStart,
    getMovieScheduleFailed,
    getMovieScheduleSuccess,
    getMovieScheduleStart,
} from './scheduleSlice';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    logOutFailed,
    logOutStart,
    logOutSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
} from './authSlice';

import { customerFailed, customerStart, customerSuccess } from './customerSlice';
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

export const getRoom = async (dispatch, navigate, room) => {
    dispatch(getRoomStart());
    try {
        dispatch(getRoomSuccess(room));
        navigate('/room');
    } catch (err) {
        dispatch(getRoomFailed());
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

export const getSchedule = async (dispatch, schedule) => {
    dispatch(getScheduleStart());
    try {
        dispatch(getScheduleSuccess(schedule));
    } catch (err) {
        dispatch(getScheduleFailed());
    }
};

export const getIsSchedule = async (dispatch, isSchedule) => {
    dispatch(getIsScheduleStart());
    try {
        dispatch(getIsScheduleSuccess(isSchedule));
    } catch (err) {
        dispatch(getIsScheduleFailed());
    }
};

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await axios.post('api/auth/login', user);

        dispatch(loginSuccess(res.data));
        navigate('/');
        return;
    } catch (err) {
        dispatch(loginFailed());
        return err;
    }
};
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('/api/auth/register', user);
        dispatch(registerSuccess(res.data));
        navigate('/');
        return;
    } catch (err) {
        dispatch(registerFailed());
        return err;
    }
};
// export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
//     dispatch(logOutStart());
//     try {
//         await axiosJWT.post('api/auth/logout', id, {
//             headers: { token: `Bearer ${accessToken}` },
//         });
//         dispatch(logOutSuccess());
//         navigate(config.routes.login);
//     } catch (err) {
//         dispatch(logOutFailedd());
//     }
// };

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post('api/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate('/login');
    } catch (err) {
        dispatch(logOutFailed());
    }
};

export const getCustomer = async (dispatch, customer) => {
    dispatch(customerStart());
    try {
        dispatch(customerSuccess(customer));
    } catch (err) {
        dispatch(customerFailed());
    }
};

export const getMovieSchedule = async (dispatch, movieSchedule) => {
    dispatch(getMovieScheduleStart());
    try {
        dispatch(getMovieScheduleSuccess(movieSchedule));
    } catch (err) {
        dispatch(getMovieScheduleFailed());
    }
};
