import { configureStore, combineReducers } from '@reduxjs/toolkit';

import seatReducer from './seatSlice';
import roomReducer from './roomSlice';
import cinemaReducer from './cinemaSlice';
import scheduleReducer from './scheduleSlice';
import valueReducer from './valueSlice';
import authReducer from './authSlice';
import productsReducer from './productSlice';
import customersReducer from './customerSlice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};
const rootReducers = combineReducers({
    auth: authReducer,
    seat: seatReducer,
    room: roomReducer,
    cinema: cinemaReducer,
    schedule: scheduleReducer,
    value: valueReducer,
    products: productsReducer,
    customers: customersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export let persistor = persistStore(store);
