import { Button, CustomizeVariant, InputForm, Pagination, UpdateProduct } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiDeleteProduct, apiGetProducts } from 'apis';
import icons from 'ultils/icons';
import moment from 'moment';
import { useSearchParams, useNavigate } from 'react-router-dom'
import { formatMoney } from 'ultils/helpers';
import useDebounce from 'hooks/useDebounce';
import path from 'ultils/path';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const { FaEdit, RiDeleteBin5Fill, BiCustomize } = icons

const ManageProducts = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const { register, formState: { errors }, watch } = useForm()
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editProduct, setEditProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [customizeVariants, setCustomizeVariants] = useState(null)
    const render = useCallback(() => {
        setUpdate(!update)
        navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCT}`)
    }, [update, navigate])
    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT, sort: '-createdAt' })
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
    const handleDeleteUser = (pid) => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Are you ready remove this product',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(pid)
                if (response.success) {
                    render()
                    toast.success(response.mes)
                }
                else {
                    toast.error(response.mes)
                }
            }
        })
    }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [editProduct])
    return (
        <div className='w-full relative'>
            {editProduct && <div className='absolute z-20 bg-gray-100'>
                <UpdateProduct
                    editProduct={editProduct}
                    render={render}
                    setEditProduct={setEditProduct}
                />
            </div>}
            {customizeVariants && <div className='absolute z-20 bg-gray-100'>
                <CustomizeVariant
                    customizeVariants={customizeVariants}
                    render={render}
                    setCustomizeVariants={setCustomizeVariants}
                />
            </div>}
            {!editProduct && !customizeVariants && <div className='w-full'>
                <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                    justify-between bg-gray-100 z-10'>
                    <h1 className='text-3xl font-semibold'>
                        <span className='capitalize'>Manage products</span>
                    </h1>
                </div>
                <div className='w-full px-4 pt-[92px] pb-4'>
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
                        <thead className='font-semibold bg-blue-700 text-white text-[13px]'>
                            <tr className='border border-blue-600'>
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
                                <th className='p-2'>Variants</th>
                                <th className='p-2'>Created at</th>
                                <th className='p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((element, index) => (
                                <tr key={index} className='border border-blue-600'>
                                    <td className='p-2'>
                                        {((params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}
                                    </td>
                                    <td className='p-2'>
                                        <img src={element.thumb} alt="thumb" className='w-[50px] h-[50px] object-contain' />
                                    </td>
                                    <td className='p-2'>{
                                        element.title.length > 7 ? element.title.slice(0, 7) + '...' : element.title
                                    }</td>
                                    <td className='p-2'>
                                        {element.brand.length > 7 ? element.brand.slice(0, 7) + '...' : element.brand}
                                    </td>
                                    <td className='p-2'>
                                        {element.category.length > 7 ? element.category.slice(0, 7) + '...' : element.category}
                                    </td>
                                    <td className='p-2'>{`$${formatMoney(element.price)} USD`}</td>
                                    <td className='p-2'>{element.quantity}</td>
                                    <td className='p-2'>{element.sold}</td>
                                    <td className='p-2 uppercase'>
                                        {element.color.length > 6 ? element.color.slice(0, 6) + '...' : element.color}
                                    </td>
                                    <td className='p-2'>{element.totalRatings}</td>
                                    <td className='p-2'>{element.variants.length || 0}</td>
                                    <td className='p-2'>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='p-2'>
                                        <div className='flex gap-2'>
                                            <Button
                                                bg='bg-green-600'
                                                hover='hover:bg-green-500'
                                                handleOnClick={() => setEditProduct(element)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                handleOnClick={() => handleDeleteUser(element._id)}
                                            >
                                                <RiDeleteBin5Fill />
                                            </Button>
                                            <Button
                                                bg='bg-yellow-600'
                                                hover='hover:bg-yellow-500'
                                                handleOnClick={() => setCustomizeVariants(element)}
                                            >
                                                <BiCustomize />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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