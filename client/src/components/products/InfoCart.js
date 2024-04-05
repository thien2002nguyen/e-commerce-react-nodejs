import { apiCart } from 'apis'
import { Button, OrderItem } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { formatMoney } from 'ultils/helpers'
import icons from 'ultils/icons'
import path from 'ultils/path'

const { FaArrowRightLong } = icons

const InfoCart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user)
    const handleUpdateCart = async () => {
        const response = await apiCart({ cart: currentCart })
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <div className='w-full m-auto'>
            <div className='mt-8 border py-2 px-4 grid grid-cols-12 gap-4'>
                <div className='col-span-7 w-full text-[18px] font-semibold'></div>
                <div className='col-span-2 text-center w-full text-[18px] font-semibold'>QUANTITY</div>
                <div className='col-span-3 text-end w-full text-[18px] font-semibold'>TOTAL</div>
            </div>
            <div className='flex flex-col border-x'>
                {currentCart?.map((element) => (
                    <OrderItem
                        key={element._id}
                        element={element}
                    />
                ))}
            </div>
            <div className='border-x border-b p-4 flex flex-col items-end gap-4 mb-8'>
                <div className='w-[300px] flex justify-between'>
                    <span className='text-sm text-gray-600'>Subtotal</span>
                    <span className='text-[18px] font-semibold'>
                        {`$${formatMoney(currentCart?.reduce((sum, elment) =>
                            sum + Number(elment.price * elment.quantity), 0) || 0)} USD`}
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
                            handleOnClick={handleUpdateCart}
                        >
                            Update Cart
                        </Button>
                        <Button
                            rounded='rounded-none'
                            bg='bg-main'
                            hover='hover:bg-red-500'
                            customStyle='flex justify-center items-center gap-2'
                            handleOnClick={() => {
                                navigate(`/${path.CHECKOUT}`)
                                window.scrollTo(0, 0)
                            }}
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

export default withBaseComponent(memo(InfoCart))