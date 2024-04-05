import { createSlice } from '@reduxjs/toolkit'
import * as actions from './asyncActions'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        errorMessage: '',
        currentCart: [],
        refreshAccessToken: null
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
            state.refreshAccessToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.current = null
            state.isLoggedIn = false
            state.token = null
            state.refreshAccessToken = null
            state.errorMessage = ''
        },
        clearErrorMessage: (state) => {
            state.errorMessage = ''
        },
        updateCart: (state, action) => {
            const { pid, color, quantity } = action.payload
            const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
            state.currentCart = updatingCart?.map(element => {
                if (element.product?._id === pid && element.color === color) {
                    return { ...element, quantity }
                }
                else {
                    return element
                }
            })
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
            state.currentCart = action.payload.cart;
            state.isLoggedIn = true;
        });

        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null
            state.isLoggedIn = false
            state.token = null
            state.refreshAccessToken = null
            state.errorMessage = 'Login session has expired'
        });
    },
})

export const { login, logout, clearErrorMessage, updateCart } = userSlice.actions

export default userSlice.reducer