import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productSlice from './products/productSlice';
import storage from 'redux-persist/lib/storage';
import userSlice from './user/userSlice'
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import thunk from 'redux-thunk'
const commonConfig = {
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current', 'currentCart', 'refreshAccessToken'],
  key: 'shop/user',
}

const productConfig = {
  ...commonConfig,
  whitelist: ['dealDaily'],
  key: 'shop/deal',
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    products: persistReducer(productConfig, productSlice),
    user: persistReducer(userConfig, userSlice)
  },
  middleware: [thunk]
});

export const persistor = persistStore(store)
