import SelectQuantity from 'components/common/SelectQuantity'
import React, { memo, useCallback, useState } from 'react'
import { formatMoney } from 'ultils/helpers'

const OrderItem = ({ element }) => {
    const [quantity, setQuantity] = useState(element?.quantity || 1)
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            setQuantity(1)
        }
        else if (Number(number) > element?.product?.quantity) {
            setQuantity(element?.product?.quantity)
        }
        else {
            setQuantity(number.trim())
        }
    }, [element])
    const handleChangeQuantity = useCallback((flag) => {
        if (quantity === 1 && flag === 'minus') {
            setQuantity(1)
        }
        else if (quantity === element?.product?.quantity && flag === 'plus') {
            setQuantity(element?.product?.quantity)
        }
        else {
            if (flag === 'minus') {
                setQuantity(prev => Number(prev) - 1)
            }
            else {
                setQuantity(prev => Number(prev) + 1)
            }
        }
    }, [quantity, element])
    return (
        <div className='border-b grid grid-cols-12 gap-4'>
            <div className='col-span-7 w-full p-4 flex items-center gap-4'>
                <img src={element?.thumb} alt="thumb" className='w-[215px] h-[215px] object-cover' />
                <div className='flex flex-col gap-1'>
                    <span className='font-normal text-md'>{element?.title}</span>
                    <span className='font-normal text-sm'>{element?.color}</span>
                    <span className='text-sm text-main'>{`In stock: ${element?.product?.quantity}`}</span>
                </div>
            </div>
            <div className='col-span-2 text-center p-4 w-full flex justify-center items-center'>
                <SelectQuantity
                    quantity={quantity}
                    handleQuantity={handleQuantity}
                    handleChangeQuantity={handleChangeQuantity}
                    hiddenLabel
                />
            </div>
            <div className='col-span-3 text-end p-4 w-full flex justify-end items-center'>
                <span className='text-[18px] font-semibold'>
                    {`${formatMoney(element?.price * quantity || 0)} VNĐ`}
                </span>
            </div>
        </div>
    )
}

export default memo(OrderItem)