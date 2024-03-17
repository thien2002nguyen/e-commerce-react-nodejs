import axios from '../axios';

export const apiCreateOrder = (data) => axios({
    url: '/order',
    method: 'post',
    data,
})

export const apiGetUserOrders = (params) => axios({
    url: '/order',
    method: 'get',
    params
})

export const apiUpdateStatusOrder = (oid, data) => axios({
    url: '/order/status/' + oid,
    method: 'put',
    data
})

export const apiDeleteOrderByUser = (oid) => axios({
    url: '/order/' + oid,
    method: 'delete',
})

export const apiDeleteOrder = (oid) => axios({
    url: '/order/' + oid,
    method: 'delete',
})

export const apiGetUserOrdersByAdmin = (params) => axios({
    url: '/order/admin',
    method: 'get',
    params
})