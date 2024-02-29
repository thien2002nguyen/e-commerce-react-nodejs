import React, { memo, useEffect, useState } from 'react';
import { apiGetProducts } from 'apis/products';
import { CustomSlider } from 'components'
import { getNewProducts } from 'store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import banner2 from 'assets/banner2-home2_2000x_crop_center.png'
import banner1 from 'assets/banner1-home2_2000x_crop_center.png'

const tabs = [
    { id: 'best', name: 'best sellers' },
    { id: 'new', name: 'new arrivals' },
]

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState('best')
    const [products, setProducts] = useState(null)
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)
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
                {tabs.map((element, index) => (
                    <span
                        key={index}
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
            <div className='w-full flex gap-4 mt-4'>
                <div className='flex-auto'>
                    <img
                        src={banner2}
                        alt="banner2"
                        className='object-contain w-full' />
                </div>
                <div className='flex-auto'>
                    <img
                        src={banner1}
                        alt="banner1"
                        className='object-contain w-full'
                    />
                </div>

            </div>
        </div>
    );
};

export default memo(BestSeller);