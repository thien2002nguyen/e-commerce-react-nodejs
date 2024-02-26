import { Button, InputForm, Pagination, UpdateProduct } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiGetProducts } from 'apis';
import icons from 'ultils/icons';
import moment from 'moment';
import { useSearchParams, useNavigate } from 'react-router-dom'
import { formatMoney } from 'ultils/helpers';
import useDebounce from 'hooks/useDebounce';
import path from 'ultils/path';

const { FaEdit, RiDeleteBin5Fill } = icons

const ManageProducts = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const { register, formState: { errors }, watch } = useForm()
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editProduct, setEditProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) {
            setProducts(response.products)
            setCounts(response.counts)
        }
    }
    const queriesDebounce = useDebounce(watch('search'), 800)
    useEffect(() => {
        navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCT}`)
    }, [queriesDebounce, navigate])
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        if (queriesDebounce) {
            queries.search = queriesDebounce
        }
        else {
            delete queries.search
        }
        fetchProducts(queries)
    }, [params, queriesDebounce, update])
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [editProduct])
    return (
        <div className='w-full relative'>
            {editProduct && <div className={`absolute inset-0 z-100 bg-gray-100 
                ${editProduct && 'animate-fade-in'}`}>
                <UpdateProduct
                    editProduct={editProduct}
                    render={render}
                    setEditProduct={setEditProduct}
                />
            </div>}
            {!editProduct && <div className={`w-full ${!editProduct && 'animate-fade-in'}`}>
                <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center justify-between bg-gray-100 z-50'>
                    <h1 className='text-3xl font-semibold'>
                        <span className='capitalize'>Manage products</span>
                    </h1>
                </div>
                <div className='w-full px-4 pt-[92px] pb-4'>
                    <form>
                        <div className='flex justify-end py-4 w-full'>
                            <InputForm
                                id='search'
                                register={register}
                                errors={errors}
                                fullWidth
                                styleDiv='w-[500px]'
                                styleInput='px-4 py-2'
                                placeholder='Search product by title, description,...'
                            />
                        </div>
                        <table className='table-auto text-left w-full whitespace-nowrap'>
                            <thead className='font-semibold bg-blue-600 text-white text-[13px]'>
                                <tr className='border border-blue-500'>
                                    <th className='p-2'>#</th>
                                    <th className='p-2'>Thumb</th>
                                    <th className='p-2'>Title</th>
                                    <th className='p-2'>Brand</th>
                                    <th className='p-2'>Category</th>
                                    <th className='p-2'>Price</th>
                                    <th className='p-2'>Quantity</th>
                                    <th className='p-2'>Sold</th>
                                    <th className='p-2'>Color</th>
                                    <th className='p-2'>Ratings</th>
                                    <th className='p-2'>Created at</th>
                                    <th className='p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((element, index) => (
                                    <tr key={index} className='border border-blue-500'>
                                        <td className='p-2'>{((params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}</td>
                                        <td className='p-2'>
                                            <img src={element.thumb} alt="thumb" className='w-[50px] h-[50px] object-contain' />
                                        </td>
                                        <td className='p-2'>{
                                            element.title.length > 10 ? element.title.slice(0, 10) + '...' : element.title
                                        }</td>
                                        <td className='p-2'>{element.brand}</td>
                                        <td className='p-2'>{element.category}</td>
                                        <td className='p-2'>{formatMoney(element.price)}</td>
                                        <td className='p-2'>{element.quantity}</td>
                                        <td className='p-2'>{element.sold}</td>
                                        <td className='p-2'>{element.color}</td>
                                        <td className='p-2'>{element.totalRatings}</td>
                                        <td className='p-2'>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                                        <td className='p-2 flex gap-2'>
                                            <Button
                                                bg='bg-yellow-600'
                                                hover='hover:bg-yellow-500'
                                                handleOnClick={() => setEditProduct(element)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button>
                                                <RiDeleteBin5Fill />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className='w-full pb-4'>
                    <Pagination
                        totalCount={counts}
                    />
                </div>
            </div>}
        </div>
    );
};

export default ManageProducts;