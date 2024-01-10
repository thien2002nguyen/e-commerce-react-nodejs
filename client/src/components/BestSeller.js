import React, { useEffect, useState } from 'react';
import { apiGetProducts } from '../apis/products';
import { CustomSlider } from './'
import { getNewProducts } from '../store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';

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
                        className={`font-semibold uppercase border-r pe-4 
                            cursor-pointer ${activedTab === element.id ? 'text-gray-600' : 'text-gray-400'}`}
                        onClick={() => setActivedTab(element.id)}
                    >
                        {element.name}
                    </span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider products={products} activedTab={activedTab} />
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