import { apiGetUserOrders } from 'apis'
import { Button, CustomSelect, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { statusOrders } from 'ultils/contants'
import { formatMoney } from 'ultils/helpers'
import icons from 'ultils/icons'

const { RiDeleteBin5Fill } = icons

const History = ({ navigate, location }) => {
    const [params] = useSearchParams()
    const [orders, setOrders] = useState([])
    const [counts, setCounts] = useState(0)
    const fetchApiOrderUser = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
            sort: '-createdAt'
        })
        if (response.success) {
            setOrders(response.data)
            setCounts(response.counts)
        }
    }
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        fetchApiOrderUser(queries)
    }, [params])
    const handleSearchStatus = ({ value }) => {
        if (value) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ status: value }).toString()
            })
        }
    }
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>History</span>
                </h1>
            </div>
            <div className='pt-[92px] w-full px-4'>
                <div className='flex justify-end py-4 w-full'>
                    <CustomSelect
                        options={statusOrders}
                        value={params.get('status') ? { label: params.get('status'), value: params.get('status') } : null}
                        onChange={value => handleSearchStatus(value)}
                        styleDiv='w-[400px]'
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
                                        <Button
                                            bg='bg-green-600'
                                            hover='hover:bg-green-500'
                                        >
                                            Received
                                        </Button>
                                        <Button>
                                            Cancel
                                        </Button>
                                        <Button>
                                            <RiDeleteBin5Fill />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination totalCount={counts} />
            </div>
        </div>
    )
}

export default withBaseComponent(History)