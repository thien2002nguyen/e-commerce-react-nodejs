import { Breadcrumb, Button, OrderItem } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'ultils/helpers'
import icons from 'ultils/icons'

const { FaArrowRightLong } = icons

const DetailCart = () => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>My Cart</h3>
                    <Breadcrumb category={'My Cart'} />
                </div>
            </div>
            <div className='w-main m-auto mt-8 border py-2 px-4 grid grid-cols-12 gap-4'>
                <div className='col-span-7 w-full text-[18px] font-semibold'></div>
                <div className='col-span-2 text-center w-full text-[18px] font-semibold'>QUANTITY</div>
                <div className='col-span-3 text-end w-full text-[18px] font-semibold'>TOTAL</div>
            </div>
            <div className='flex flex-col w-main m-auto border-x'>
                {current?.cart?.map((element, index) => (
                    <OrderItem key={index} element={element} />
                ))}
            </div>
            <div className='w-main m-auto border-x border-b p-4 flex flex-col items-end gap-4 mb-8'>
                <div className='w-[300px] flex justify-between'>
                    <span className='text-sm text-gray-600'>Subtotal</span>
                    <span className='text-[18px] font-semibold'>
                        {`${formatMoney(current?.cart?.reduce((sum, elment) =>
                            sum + Number(elment.price * elment.quantity), 0) || 0)} VNĐ`}
                    </span>
                </div>
                <span className='text-sm text-gray-600'>Shipping, taxes, and discounts calculated at checkout</span>
                <div className='w-full flex justify-end'>
                    <div className='flex gap-2'>
                        <Button
                            rounded='rounded-none'
                            bg='bg-slate-800'
                            hover='hover:bg-main'
                            customStyle='flex justify-center items-center gap-2 text-sm rounded-sm'
                        >
                            Update Cart
                        </Button>
                        <Button
                            rounded='rounded-none'
                            bg='bg-main'
                            hover='hover:bg-red-500'
                            customStyle='flex justify-center items-center gap-2'
                        >
                            <span>CHECK OUT</span>
                            <FaArrowRightLong />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailCart