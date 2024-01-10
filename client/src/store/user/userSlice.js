import { createSlice } from '@reduxjs/toolkit'
// import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null
    },
    reducers: {
        register: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        }
    },
    // Code logic xử lý async action
    // extraReducers: (builder) => {
    //     builder.addCase(actions.getNewProducts.pending, (state) => {
    //         state.isLoading = true;
    //     });

    //     builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
    //         state.isLoading = false;
    //         state.newProducts = action.payload;
    //     });

    //     builder.addCase(actions.getNewProducts.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.errorMessage = action.payload.message;
    //     });
    // },
})

export const { register } = userSlice.actions

export default userSlice.reducer