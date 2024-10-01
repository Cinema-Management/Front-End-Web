import { configureStore, combineReducers } from '@reduxjs/toolkit';

import seatReducer from './seatSlice';
import roomReducer from './roomSlice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};
const rootReducers = combineReducers({
    seat: seatReducer,
    room: roomReducer,
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
