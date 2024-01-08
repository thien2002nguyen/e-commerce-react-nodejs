import React, { useEffect, useState } from 'react';
import { apiGetProducts } from '../apis/products';
import { Product } from './'
import Slider from "react-slick";

const tabs = [
    { id: 0, name: 'best sellers' },
    { id: 1, name: 'new arrivals' },
]

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [activedTab, setActivedTab] = useState(0)
    const [product, setProduct] = useState(null)
    const fetchProduct = async () => {
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })])
        if (response && response[0]?.success) {
            setBestSellers(response[0].products)
        }
        if (response && response[1]?.success) {
            setNewProducts(response[1].products)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    useEffect(() => {
        if (activedTab === 0) {
            setProduct(bestSellers)
        }
        if (activedTab === 1) {
            setProduct(newProducts)
        }
    }, [activedTab, bestSellers, newProducts])
    return (
        <div>
            <div className='flex text-[20px] pb-4 border-b-2 border-main gap-4'>
                {tabs.map((element, index) => (
                    <span
                        key={index}
                        className={`font-semibold uppercase border-r pe-4 
                            cursor-pointer ${activedTab === element.id ? 'text-gray-600' : 'text-gray-400'}`}
                        onClick={() => setActivedTab(element.id)}
                    >
                        {element.name}
                    </span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <Slider {...settings}>
                    {product?.map((element, index) => (
                        <Product key={index} productData={element} isNew={activedTab === 1} />
                    ))}
                </Slider>
            </div>
            <div className='w-full flex gap-4 mt-4'>
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                    alt=""
                    className='flex-1 object-contain'
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                    alt=""
                    className='flex-1 object-contain'
                />
            </div>
        </div>
    );
};

export default BestSeller;