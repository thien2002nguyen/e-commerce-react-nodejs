import { InfoCart } from 'components'
import React from 'react'

const MyCart = () => {
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>My Cart</span>
                </h1>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4 m-auto'>
                <InfoCart />
            </div>
        </div>
    )
}

export default MyCart