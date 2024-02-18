import { createSlice } from '@reduxjs/toolkit'
import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        errorMessage: ''
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        logout: (state) => {
            state.current = null
            state.isLoggedIn = false
            state.token = null
            state.errorMessage = ''
        },
        clearErrorMessage: (state) => {
            state.errorMessage = ''
        }
    },
    // Code logic xử lý async action
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
            state.isLoggedIn = true
        });

        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null
            state.isLoggedIn = false
            state.token = null
            state.errorMessage = 'Login session has expired'
        });
    },
})

export const { login, logout, clearErrorMessage } = userSlice.actions

export default userSlice.reducer