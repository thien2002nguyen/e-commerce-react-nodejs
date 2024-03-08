import React, { useEffect, useState } from 'react'
import payment from 'assets/payment.svg';
import { useSelector } from 'react-redux';
import { formatMoney } from 'ultils/helpers';
import icons from 'ultils/icons';
import withBaseComponent from 'hocs/withBaseComponent';
import path from 'ultils/path';
import { Button, InputForm, Paypal } from 'components';
import { useForm } from 'react-hook-form';
import { apiUpdateAddress } from 'apis';
import { getCurrent } from 'store/user/asyncActions';
import { toast } from 'react-toastify';

const { HiOutlineShoppingBag, FaArrowLeftLong, FaArrowRightLong } = icons

const Checkout = ({ navigate, dispatch }) => {
    const { current } = useSelector(state => state.user)
    const { register, formState: { errors }, watch, setValue } = useForm()
    const [isShowPaypal, setIsShowPaypal] = useState(false)
    useEffect(() => {
        setValue('address', current?.address)
    }, [current, setValue])
    const handleUpdateAddress = async () => {
        if (watch('address')) {
            setIsShowPaypal(true)
            const response = await apiUpdateAddress({ address: watch('address') })
            if (response.success) {
                dispatch(getCurrent())
            }
            else {
                toast.error(response.mes)
            }
        }
        else {
            setIsShowPaypal(false)
            toast.error('No addresses have been entered yet')
        }
    }
    return (
        <div className='w-full relative bg-gray-100'>
            <div className='px-52 border-b w-full fixed bg-white z-20'>
                <div className='mx-auto py-6 flex justify-between items-center'>
                    <h2 className='text-2xl'>Digital World</h2>
                    <div className='cursor-pointer relative' onClick={() => navigate(`/${path.DETAIL_CART}`)}>
                        <HiOutlineShoppingBag size={24} color='red' />
                        <div className='text-xs w-6 h-6 bg-main text-white flex justify-center
                            items-center rounded-full absolute -bottom-3 -left-3 z-10'>
                            {current?.cart?.length || 0}
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-9 h-screen pt-[80px]'>
                <div className='w-full overflow-y-auto flex flex-col col-span-5 pl-52 py-4 gap-4 border-r bg-white'>
                    <div className='flex justify-center items-center px-8'>
                        <img src={payment} alt="payment" className='w-48 h-48 object-contain' />
                    </div>
                    {!isShowPaypal && <div className='flex flex-col'>
                        <InputForm
                            label='Your address'
                            register={register}
                            errors={errors}
                            id='address'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            fullWidth
                            placeholder='Please enter your address'
                            styleInput='px-4 py-2'
                            styleDiv='h-24 pr-8'
                        />
                        <div className='flex justify-end pr-8'>
                            <Button
                                handleOnClick={handleUpdateAddress}
                                customStyle='flex items-center gap-2'
                            >
                                Continue
                                <FaArrowRightLong />
                            </Button>
                        </div>
                    </div>}
                    {isShowPaypal && current?.address && <div className='pr-8'>
                        <div className='my-4 flex gap-2'>
                            <span className='font-semibold'>Address:</span>
                            <span>{current?.address || 'No value'}</span>
                        </div>
                        <Paypal
                            payload={{
                                products: current?.cart,
                                total: current?.cart?.reduce((sum, element) => element.price * element.quantity + sum, 0),
                                address: current?.address,
                            }}
                            amount={current?.cart?.reduce((sum, element) => element.price * element.quantity + sum, 0)}
                        />
                        <div className='flex justify-end'>
                            <Button
                                handleOnClick={() => setIsShowPaypal(false)}
                                customStyle='flex items-center gap-2'
                            >
                                <FaArrowLeftLong />
                                <span>Back</span>
                            </Button>
                        </div>
                    </div>}
                </div>
                <div className='w-full overflow-y-auto col-span-4 pr-52 py-8 pl-8 flex flex-col gap-8'>
                    <div className='w-full flex flex-col gap-6'>
                        {!current?.cart?.length > 0 && <span>Your cart is empty</span>}
                        {current?.cart?.length > 0 && current?.cart?.map((element, index) => (
                            <div key={index} className='flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-20 h-20 bg-white relative'>
                                        <img src={element.thumb} alt="imageProduct" className='w-full h-full' />
                                        <div className='w-6 h-6 bg-black text-white bg-opacity-50 flex 
                                            justify-center items-center rounded-full absolute -top-3 -right-3
                                            text-xs z-10'>
                                            {element.quantity}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm capitalize'>{element.title.length > 10 ?
                                            element.title.slice(0, 10).toLowerCase() + '...' :
                                            element.title.toLowerCase()}</span>
                                        <span className='text-xs capitalize'>{element.color.toLowerCase()}</span>
                                    </div>
                                </div>
                                <span className='text-sm'>
                                    {`${formatMoney(element.price * element.quantity)} $`}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-lg'>Total</span>
                        <span className='text-lg'>
                            {`${formatMoney(current?.cart?.reduce((sum, element) =>
                                sum + Number(element.price) * (element.quantity || 1), 0) || 0)} $`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(Checkout)