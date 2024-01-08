import React, { useEffect, useState } from 'react';
import { ProductCard } from './'
import { apiGetProducts } from '../apis';

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
    console.log(products);
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
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
                    alt=""
                    className='col-span-2 row-span-2 w-full h-full object-cover'
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
                    alt=""
                    className='row-span-1 w-full h-full object-cover'
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
                    alt=""
                    className='row-span-1 w-full h-full object-cover'
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
                    alt=""
                    className='row-span-2 w-full h-full object-cover'
                />
            </div>
        </div>
    );
};

export default FeatureProducts;