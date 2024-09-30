import { configureStore } from '@reduxjs/toolkit';

import roomReducer from './roomSlice';
import authReducer from './authSlice';

export default configureStore({
    reducer: {
        room: roomReducer,
    },
});
