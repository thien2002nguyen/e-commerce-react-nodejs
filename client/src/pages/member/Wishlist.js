import { Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'

const Wishlist = () => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Wishlist</span>
                </h1>
            </div>
            <div className='pt-[92px] w-full px-4 grid grid-cols-4 gap-4'>
                {current?.wishlist?.map((element, index) => (
                    <div key={index} className='bg-white rounded-md flex flex-col drop-shadow-md'>
                        <Product
                            productData={element}
                            normal
                            showDescription
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist