import { apiRemoveCart } from 'apis'
import Button from 'components/buttons/Button'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import { getCurrent } from 'store/user/asyncActions'
import { formatMoney } from 'ultils/helpers'
import icons from 'ultils/icons'
import path from 'ultils/path'

const { IoClose, FaArrowRightLong, ImBin } = icons

const Cart = ({ dispatch, navigate }) => {
    const { current } = useSelector(state => state.user)
    const removeCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) {
            dispatch(getCurrent())
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <div className='overflow-y-auto overflow-x-hidden flex justify-end h-full'>
            <div
                className='w-[375px] h-full bg-[#1c1d1d] text-white overflow-y-auto grid grid-rows-10 px-6'
                onClick={e => e.stopPropagation()}
            >
                <header className='flex justify-between items-center row-span-1 py-6 border-b border-gray-600'>
                    <span className='uppercase font-semibold text-lg'>Your Cart</span>
                    <span
                        className='hover:text-gray-400 duration-150 cursor-pointer'
                        onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
                    >
                        <IoClose size={20} />
                    </span>
                </header>
                <section className='row-span-6 py-4 flex flex-col gap-4 h-full overflow-y-auto'>
                    {!current?.cart?.length > 0 && <span>Your cart is empty</span>}
                    {current?.cart?.length > 0 && current?.cart?.map((element, index) => (
                        <div key={index} className='flex justify-between items-center'>
                            <div className='flex gap-2'>
                                <img src={element.thumb} alt="thumb" className='w-16 h-16 object-cover' />
                                <div className='flex flex-col gap-2'>
                                    <span className='text-sm capitalize'>{element.title.length > 10 ?
                                        element.title.slice(0, 10).toLowerCase() + '...' :
                                        element.title.toLowerCase()}</span>
                                    <div className='flex flex-col text-gray-300 gap-1'>
                                        <span className='text-[10px] capitalize'>{element.color?.toLowerCase()}</span>
                                        <span className='text-xs'>
                                            {`Quantity: ${element.quantity}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-end gap-1'>
                                <div className='text-sm'>
                                    {`$${formatMoney(element.price * (element.quantity || 1))} USD`}
                                </div>
                                <div
                                    className='h-10 duration-200 cursor-pointer rounded-full w-10 
                                hover:bg-gray-300 flex justify-center items-center hover:text-black'
                                    onClick={() => removeCart(element.product?._id, element.color)}
                                >
                                    <ImBin size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
                {current?.cart?.length > 0 && <div className='row-span-3 py-4 flex flex-col border-t
                    border-gray-600 gap-2'>
                    <div className='flex items-center justify-between'>
                        <span className='uppercase font-semibold'>Subtotal</span>
                        <span className='font-semibold'>
                            {`$${formatMoney(current?.cart?.reduce((sum, element) =>
                                sum + Number(element.price) * (element.quantity || 1), 0) || 0)} USD`}
                        </span>
                    </div>
                    <span className='text-sm mt-2 text-gray-400 text-center block'>
                        Shipping, taxes, and discounts calculated at checkout
                    </span>
                    <Button
                        rounded='rounded-none'
                        bg='bg-red-600'
                        hover='hover:bg-red-500'
                        customStyle='flex justify-center items-center gap-2 uppercase'
                        handleOnClick={() => {
                            navigate(`/${path.DETAIL_CART}`)
                            dispatch(showModal({ isShowModal: false, modalChildren: null }))
                        }}
                    >
                        <span>Shopping Cart</span>
                        <FaArrowRightLong />
                    </Button>
                    <Button
                        rounded='rounded-none'
                        bg='bg-red-600'
                        hover='hover:bg-red-500'
                        customStyle='flex justify-center items-center gap-2 uppercase'
                        handleOnClick={() => {
                            navigate(`/${path.CHECKOUT}`)
                            dispatch(showModal({ isShowModal: false, modalChildren: null }))
                        }}
                    >
                        <span>Check out</span>
                        <FaArrowRightLong />
                    </Button>
                </div>}
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Cart))