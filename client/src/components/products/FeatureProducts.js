import React, { memo, useEffect, useState } from 'react';
import { ProductCard } from 'components'
import { apiGetProducts } from 'apis';
import banner1 from 'assets/banner1-bottom-home2_b96bc752-67.png'
import banner2 from 'assets/banner2-bottom-home2_400x.png'
import banner3 from 'assets/banner3-bottom-home2_400x.png'
import banner4 from 'assets/banner4-bottom-home2_92e12df0-50.png'
import withBaseComponent from 'hocs/withBaseComponent';

const FeatureProducts = ({ navigate }) => {
    const [products, setProducts] = useState(null)
    const [hover1, setHover1] = useState(null)
    const [hover2, setHover2] = useState(null)
    const [hover3, setHover3] = useState(null)
    const [hover4, setHover4] = useState(null)
    const fetchProducts = async () => {
        const response = await apiGetProducts({ limit: 9, sort: '-totalRatings' })
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
                        productData={element}
                    />
                ))}
            </div>
            {/* Lười chia thêm component */}
            <div className='mt-8 grid grid-cols-4 grid-rows-2 grid-flow-col gap-[30px]'>
                <div
                    className='col-span-2 row-span-2 cursor-pointer relative'
                    onClick={() => {
                        navigate(`/laptop`)
                        window.scrollTo(0, 0)
                    }}
                    onMouseEnter={() => setHover1('mouseBanner1')}
                    onMouseLeave={() => setHover1('leaveBanner1')}
                >
                    <div className={`bg-black absolute inset-0 ${hover1 ? 'opacity-20' : 'opacity-0'}
                        ${hover1 === 'mouseBanner1' && 'animate-scale-up-tl'}
                        ${hover1 === 'leaveBanner1' && 'animate-un-scale-up-tl'}
                    `}></div>
                    <div className={`bg-black absolute inset-0 ${hover1 ? 'opacity-20' : 'opacity-0'}
                        ${hover1 === 'mouseBanner1' && 'animate-scale-up-br'}
                        ${hover1 === 'leaveBanner1' && 'animate-un-scale-up-br'}
                    `}></div>
                    <img
                        src={banner1}
                        alt="laptop"
                        className='w-full h-full object-cover'
                    />
                </div>
                <div
                    className='row-span-1 cursor-pointer relative'
                    onClick={() => {
                        navigate(`/accessories/65eab8e942ba54b425228b0b/APPLE%20WATCH%20EDITION%20SERIES%202`)
                        window.scrollTo(0, 0)
                    }}
                    onMouseEnter={() => setHover2('mouseBanner2')}
                    onMouseLeave={() => setHover2('leaveBanner2')}
                >
                    <div className={`bg-black absolute inset-0 ${hover2 ? 'opacity-20' : 'opacity-0'}
                        ${hover2 === 'mouseBanner2' && 'animate-scale-up-tl'}
                        ${hover2 === 'leaveBanner2' && 'animate-un-scale-up-tl'}
                    `}></div>
                    <div className={`bg-black absolute inset-0 ${hover2 ? 'opacity-20' : 'opacity-0'}
                        ${hover2 === 'mouseBanner2' && 'animate-scale-up-br'}
                        ${hover2 === 'leaveBanner2' && 'animate-un-scale-up-br'}
                    `}></div>
                    <img
                        src={banner2}
                        alt="samsung"
                        className='w-full h-full object-cover'
                    />
                </div>
                <div
                    className='row-span-1 cursor-pointer relative'
                    onClick={() => {
                        navigate(`/products`)
                        window.scrollTo(0, 0)
                    }}
                    onMouseEnter={() => setHover3('mouseBanner3')}
                    onMouseLeave={() => setHover3('leaveBanner3')}
                >
                    <div className={`bg-black absolute inset-0 ${hover3 ? 'opacity-20' : 'opacity-0'}
                        ${hover3 === 'mouseBanner3' && 'animate-scale-up-tl'}
                        ${hover3 === 'leaveBanner3' && 'animate-un-scale-up-tl'}
                    `}></div>
                    <div className={`bg-black absolute inset-0 ${hover3 ? 'opacity-20' : 'opacity-0'}
                        ${hover3 === 'mouseBanner3' && 'animate-scale-up-br'}
                        ${hover3 === 'leaveBanner3' && 'animate-un-scale-up-br'}
                    `}></div>
                    <img
                        src={banner3}
                        alt="sale"
                        className='w-full h-full object-cover'
                    />
                </div>
                <div
                    className='row-span-2 cursor-pointer relative'
                    onClick={() => {
                        navigate(`/smartphone/65eab8e942ba54b425228ad6/SONY%20XPERIA%20XA`)
                        window.scrollTo(0, 0)
                    }}
                    onMouseEnter={() => setHover4('mouseBanner4')}
                    onMouseLeave={() => setHover4('leaveBanner4')}
                >
                    <div className={`bg-black absolute inset-0 ${hover4 ? 'opacity-20' : 'opacity-0'}
                        ${hover4 === 'mouseBanner4' && 'animate-scale-up-tl'}
                        ${hover4 === 'leaveBanner4' && 'animate-un-scale-up-tl'}
                    `}></div>
                    <div className={`bg-black absolute inset-0 ${hover4 ? 'opacity-20' : 'opacity-0'}
                        ${hover4 === 'mouseBanner4' && 'animate-scale-up-br'}
                        ${hover4 === 'leaveBanner4' && 'animate-un-scale-up-br'}
                    `}></div>
                    <img
                        src={banner4}
                        alt="phone"
                        className='w-full h-full object-cover'
                    />
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(FeatureProducts))