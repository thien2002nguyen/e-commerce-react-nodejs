import { InfoCart } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'
import { useSelector } from 'react-redux'
import path from 'ultils/path'

const MyCart = ({ navigate }) => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>My Cart</span>
                </h1>
            </div>
            {!current?.cart?.length > 0 && <div className='flex flex-col items-center pt-[92px] pb-20 
                text-gray-700'>
                <span className='text-2xl font-semibold'>Your cart</span>
                <span className='w-12 border-b border-black my-4'></span>
                <span className='text-sm'>Your cart is currently empty</span>
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
            {current?.cart?.length > 0 && <div className='w-full px-4 pt-[92px] pb-4 m-auto'>
                <InfoCart />
            </div>}
        </div>
    )
}

export default withBaseComponent(MyCart)