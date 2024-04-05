import React, { memo, useEffect, useState } from 'react';
import { apiGetProducts } from 'apis/products';
import { CustomSlider } from 'components'
import { getNewProducts } from 'store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import banner1 from 'assets/banner2-home2_2000x_crop_center.png'
import banner2 from 'assets/banner1-home2_2000x_crop_center.png'
import { useNavigate } from 'react-router-dom';

const tabs = [
    { id: 'best', name: 'best sellers' },
    { id: 'new', name: 'new arrivals' },
]

const BestSeller = () => {
    const navigate = useNavigate()
    const [bestSellers, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState('best')
    const [products, setProducts] = useState(null)
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)
    const [hover1, setHover1] = useState(null)
    const [hover2, setHover2] = useState(null)
    const fetchProduct = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        if (response && response.success) {
            setBestSellers(response.products)
            setProducts(response.products)
        }
    }
    useEffect(() => {
        fetchProduct()
        dispatch(getNewProducts())
    }, [dispatch])
    useEffect(() => {
        if (activedTab === 'best') {
            setProducts(bestSellers)
        }
        if (activedTab === 'new') {
            setProducts(newProducts)
        }
    }, [activedTab, bestSellers, newProducts])
    return (
        <div>
            <div className='flex text-[20px] gap-4 border-main border-b-2 pb-4'>
                {tabs.map((element) => (
                    <span
                        key={element.id}
                        className={`font-semibold uppercase border-r pr-4 
                            cursor-pointer ${activedTab === element.id ? 'text-gray-600' : 'text-gray-400'}`}
                        onClick={() => setActivedTab(element.id)}
                    >
                        {element.name}
                    </span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider products={products} activedTab={activedTab} px />
            </div>
            {/* Lười chia thêm component */}
            <div className='w-full flex gap-4 mt-4'>
                <div className='flex-auto cursor-pointer relative'
                    onClick={() => {
                        navigate(`/laptop/65eab8e942ba54b425228aea/ASUS%20ROG%20G752VM`)
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
                        alt="banner1"
                        className='object-contain w-full'
                    />
                </div>
                <div className='flex-auto cursor-pointer relative'
                    onClick={() => {
                        navigate(`/laptop/65eab8e942ba54b425228ae6/LENOVO%20IDEAPAD%20110`)
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
                        alt="banner2"
                        className='object-contain w-full' />
                </div>
            </div>
        </div>
    );
};

export default memo(BestSeller);