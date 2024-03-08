import { Breadcrumb, InfoCart } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'
import { useSelector } from 'react-redux'
import path from 'ultils/path'

const DetailCart = ({ navigate }) => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>Your Cart</h3>
                    <Breadcrumb category={'Your Cart'} />
                </div>
            </div>
            {!current?.cart?.length > 0 && <div className='flex flex-col items-center pt-4 pb-20 text-gray-700'>
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
            {current?.cart?.length > 0 && <div className='w-main m-auto'>
                <InfoCart />
            </div>}
        </div>
    )
}

export default withBaseComponent(DetailCart)