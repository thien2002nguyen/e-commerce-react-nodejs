import { apiDeleteOrder, apiGetUserOrdersByAdmin, apiUpdateQuantityProduct, apiUpdateStatusOrder } from 'apis';
import { Button, CustomSelect, Pagination } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { statusOrders } from 'ultils/contants';
import { formatMoney } from 'ultils/helpers';
import icons from 'ultils/icons'

const { TbReceipt, RiDeleteBin5Fill, TbReceiptOff } = icons

const ManageOrder = ({ navigate, location }) => {
    const [params] = useSearchParams()
    const [orders, setOrders] = useState([])
    const [counts, setCounts] = useState(0)
    const [update, setUpdate] = useState(false)
    const render = useCallback(() => {
        setUpdate(!update)
        navigate(location.pathname)
    }, [update, navigate, location])
    const handleSearchStatus = ({ value }) => {
        if (value) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ status: value }).toString()
            })
        }
    }
    const fetchOrdersUserByAdmin = async (params) => {
        const response = await apiGetUserOrdersByAdmin({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
            sort: '-createdAt'
        })
        if (response.success) {
            setOrders(response.data)
            setCounts(response.counts)
        }
    }
    const handleReceived = (oid) => {
        Swal.fire({
            title: 'Sure!',
            text: 'Have you received your order yet?',
            icon: 'info',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            confirmButtonText: 'Sure'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiUpdateStatusOrder(oid, { status: 'Shipping' })
                if (response.success) {
                    toast.success(response.mes)
                    render()
                }
                else {
                    toast.error(response.mes)
                }
            }
        })
    }
    const handleCancel = (element) => {
        Swal.fire({
            title: 'Sure!',
            text: 'Do you want to cancel your order?',
            icon: 'info',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            confirmButtonText: 'Sure'
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(element);
                const products = []
                for (let item of element.currentProduct) {
                    let value = {
                        pid: item._id,
                        quantity: item.quantity,
                        sold: item.sold
                    }
                    products.push(value)
                }
                const updateQuantity = await apiUpdateQuantityProduct({ products })
                if (updateQuantity.success) {
                    const response = await apiUpdateStatusOrder(element._id, { status: 'Cancelled' })
                    if (response.success) {
                        toast.success(response.mes)
                        render()
                    }
                    else {
                        toast.error(response.mes)
                    }
                }
            }
        })
    }
    const handleDelete = (oid) => {
        Swal.fire({
            title: 'Sure!',
            text: 'Do you want to delete order information?',
            icon: 'info',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            confirmButtonText: 'Sure'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteOrder(oid)
                if (response.success) {
                    toast.success(response.mes)
                    render()
                }
                else {
                    toast.error(response.mes)
                }
            }
        })
    }
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        fetchOrdersUserByAdmin(queries)
    }, [params, update])
    return (
        <div className='w-full'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Manage Order</span>
                </h1>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <div className='flex justify-end py-4 w-full'>
                    <CustomSelect
                        options={statusOrders}
                        value={params.get('status') ? { label: params.get('status'), value: params.get('status') } : null}
                        onChange={value => handleSearchStatus(value)}
                        styleDiv='w-[500px]'
                    />
                </div>
                <table className='table-auto w-full mt-4'>
                    <thead className='font-semibold bg-blue-700 text-white text-[13px]'>
                        <tr className='border border-blue-600'>
                            <th className='p-2'>#</th>
                            <th className='p-2'>Products</th>
                            <th className='p-2'>Address</th>
                            <th className='p-2'>Status</th>
                            <th className='p-2'>Total</th>
                            <th className='p-2'>Created at</th>
                            <th className='p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((element, index) => (
                            <tr key={index} className='border border-blue-600'>
                                <td className='p-2 text-center'>
                                    {((params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}
                                </td>
                                <td className='px-4 py-2'>
                                    <ul>
                                        {element.products?.map((item, i) => (
                                            <li key={i} className='text-sm'>
                                                <div className='flex gap-4 items-center'>
                                                    <img src={item.thumb} alt="thumb" className='w-8 h-8 object-contain' />
                                                    <span className='flex flex-col'>
                                                        <span className='font-medium'>{item.title}</span>
                                                        <span className='text-[10px]'>{item.color}</span>
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className='p-2 text-center'>{element.address}</td>
                                <td className='p-2 text-center'>{element.status}</td>
                                <td className='p-2 text-center'>{`$${formatMoney(element.total)} USD`}</td>
                                <td className='p-2 text-center'>{moment(element.createdAt)?.format("DD/MM/YYYY")}</td>
                                <td className='p-2'>
                                    <div className='flex gap-2 justify-center'>
                                        {element.status.toLowerCase() === 'processing' && <Button
                                            bg='bg-green-600'
                                            hover='hover:bg-green-500'
                                            handleOnClick={() => handleReceived(element._id)}
                                            title='Received'
                                        >
                                            <TbReceipt size={18} />
                                        </Button>}
                                        {(element.status.toLowerCase() === 'processing' ||
                                            element.status.toLowerCase() === 'shipping') &&
                                            <Button
                                                handleOnClick={() => handleCancel(element)}
                                                title='Cancel'
                                            >
                                                <TbReceiptOff size={18} />
                                            </Button>}
                                        {(element.status.toLowerCase() === 'cancelled' ||
                                            element.status.toLowerCase() === 'successed') &&
                                            <Button
                                                handleOnClick={() => handleDelete(element._id)}
                                                title='Delete'
                                            >
                                                <RiDeleteBin5Fill size={18} />
                                            </Button>
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default withBaseComponent(ManageOrder);