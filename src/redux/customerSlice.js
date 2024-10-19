import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customer: {
            currentCustomer: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        customerStart: (state) => {
            state.customer.isFetching = true;
        },
        customerSuccess: (state, action) => {
            state.customer.isFetching = false;
            state.customer.currentCustomer = action.payload;
            state.customer.error = false;
        },
        customerFailed: (state) => {
            state.customer.isFetching = false;
            state.customer.error = true;
        },
    },
});

export const { customerStart, customerFailed, customerSuccess } = customerSlice.actions;

export default customerSlice.reducer;
