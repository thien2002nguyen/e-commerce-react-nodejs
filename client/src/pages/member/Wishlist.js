import { Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import path from 'ultils/path'

const Wishlist = () => {
    const { current } = useSelector(state => state.user)
    const navigate = useNavigate()
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Wishlist</span>
                </h1>
            </div>
            {current?.wishlist?.length > 0 && <div className='pt-[92px] w-full px-4 grid grid-cols-4 gap-4'>
                {current?.wishlist?.map((element, index) => (
                    <div key={index} className='bg-white rounded-md flex flex-col drop-shadow-md'>
                        <Product
                            productData={element}
                            normal
                            showDescription
                        />
                    </div>
                ))}
            </div>}
            {!current?.wishlist?.length > 0 && <div className='flex flex-col items-center pt-[92px] pb-20 
                text-gray-700'>
                <span className='text-2xl font-semibold'>Your favorites</span>
                <span className='w-12 border-b border-black my-4'></span>
                <span className='text-sm'>Your favorites are currently empty</span>
                <span className='text-sm mt-4'>
                    <span>Continue browsing </span>
                    <span className='cursor-pointer hover:text-main duration-150'
                        onClick={() => {
                            navigate(`/${path.PRODUCTS}`)
                            window.scrollTo(0, 0)
                        }}
                    >here</span>
                </span>
            </div>}
        </div>
    )
}

export default Wishlist