import React, { memo, useEffect, useState } from 'react';
import { ProductCard } from 'components'
import { apiGetProducts } from 'apis';
import banner1 from 'assets/banner1-bottom-home2_b96bc752-67.png'
import banner2 from 'assets/banner2-bottom-home2_400x.png'
import banner3 from 'assets/banner3-bottom-home2_400x.png'
import banner4 from 'assets/banner4-bottom-home2_92e12df0-50.png'

const FeatureProducts = () => {
    const [products, setProducts] = useState(null)
    const fetchProducts = async () => {
        const response = await apiGetProducts({ limit: 9, totalRatings: 5 })
        if (response.success) {
            setProducts(response.products)
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>
                FEATURE PRODUCTS
            </h3>
            <div className='grid grid-cols-3 my-[15px] gap-[10px]'>
                {products?.map((element, index) => (
                    <ProductCard
                        key={index}
                        image={element.thumb}
                        title={element.title}
                        totalRatings={element.totalRatings}
                        price={element.price}
                    />
                ))}
            </div>
            <div className='grid grid-cols-4 grid-rows-2 grid-flow-col gap-[30px]'>
                <img
                    src={banner1}
                    alt=""
                    className='col-span-2 row-span-2 w-full h-full object-cover'
                />
                <img
                    src={banner2}
                    alt=""
                    className='row-span-1 w-full h-full object-cover'
                />
                <img
                    src={banner3}
                    alt=""
                    className='row-span-1 w-full h-full object-cover'
                />
                <img
                    src={banner4}
                    alt=""
                    className='row-span-2 w-full h-full object-cover'
                />
            </div>
        </div>
    );
};

export default memo(FeatureProducts);