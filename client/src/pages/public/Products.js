import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { Breadcrumb, InputSelect, Product, SearchItem } from '../../components';
import { apiGetProducts } from '../../apis';
import { sorts } from '../../ultils/contants';

const Products = () => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [products, setProducts] = useState(null)
    const [activedClick, setActivedClick] = useState(null)
    const [sort, setSort] = useState('')
    const [params] = useSearchParams()
    const fetchProductsByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) {
            setProducts(response.products)
        }
    }
    useEffect(() => {
        let param = []
        for (let item of params.entries()) {
            param.push(item)
        }
        const queries = {}
        let priceQuery = {}
        for (let item of params) {
            queries[item[0]] = item[1]
        }
        if (queries.from && queries.to) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } },
                ]
            }
            delete queries.price
        }
        if (queries.from) {
            queries.price = { gte: queries.from }
        }
        if (queries.to) {
            queries.price = { lte: queries.to }
        }
        delete queries.from
        delete queries.to
        const query = { ...priceQuery, ...queries }
        fetchProductsByCategory(query)
    }, [params])
    const changeActiveFitler = useCallback((name) => {
        if (activedClick === name) {
            setActivedClick(null)
        } else {
            setActivedClick(name)
        }
    }, [activedClick])
    const changeValue = useCallback((value) => {
        setSort(value)
    }, [])
    useEffect(() => {
        if (sort !== '') {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ sort }).toString()
            })
        }
        else {
            navigate(`/${category}`)
        }
    }, [sort, navigate, category])
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase text-[18px] mb-2'>{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div className='w-main border p-3 flex justify-between mt-8 mx-auto'>
                <div className='flex flex-col gap-2'>
                    <span className='font-semibold text-sm text-gray-800'>
                        Filter by
                    </span>
                    <div className='flex items-center gap-4'>
                        <SearchItem
                            name={'price'}
                            activedClick={activedClick}
                            changeActiveFitler={changeActiveFitler}
                            type='input'

                        />
                        <SearchItem
                            name={'color'}
                            activedClick={activedClick}
                            changeActiveFitler={changeActiveFitler}
                        />
                    </div>
                </div>
                <div className='flex flex-col w-1/6'>
                    <span className='font-semibold text-sm text-gray-800'>Sort by</span>
                    <div className='w-full mt-2 '>
                        <InputSelect value={sort} options={sorts} changeValue={changeValue} />
                    </div>
                </div>
            </div>
            <div className='my-8 w-main mx-auto grid grid-cols-4 gap-4'>
                {products?.map((element, index) => (
                    <Product key={index} productData={element} normal />
                ))}
            </div>
        </div>
    );
};

export default Products;