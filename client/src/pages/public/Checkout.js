import React, { useEffect, useState } from 'react'
import payment from 'assets/payment.svg';
import { useSelector } from 'react-redux';
import { formatMoney } from 'ultils/helpers';
import icons from 'ultils/icons';
import withBaseComponent from 'hocs/withBaseComponent';
import path from 'ultils/path';
import { Button, CongratPay, InputForm, Paypal, SelectForm } from 'components';
import { useForm } from 'react-hook-form';
import { apiCart, apiCreateOrder, apiUpdateAddress, apiUpdateQuantityProduct } from 'apis';
import { getCurrent } from 'store/user/asyncActions';
import { toast } from 'react-toastify';
import { paymentOptions, shippingFee } from 'ultils/contants';
import Swal from 'sweetalert2';
import { showModal } from 'store/app/appSlice';

const { HiOutlineShoppingBag } = icons

const Checkout = ({ navigate, dispatch }) => {
    const { current } = useSelector(state => state.user)
    const { register, formState: { errors }, watch, setValue } = useForm()
    const [isShowPaypal, setIsShowPaypal] = useState(false)
    useEffect(() => {
        setValue('address', current?.address)
    }, [current, setValue])
    const handleUpdateAddress = async () => {
        if (watch('address')) {
            const response = await apiUpdateAddress({ address: watch('address') })
            if (response.success) {
                dispatch(getCurrent())
            }
            else {
                toast.error(response.mes)
            }
        }
        else {
            toast.error('No addresses have been entered yet')
        }
        if (watch('payment') && +watch('payment') === 1) {
            setIsShowPaypal(true)
        }
        else {
            Swal.fire({
                title: 'Sure!',
                text: 'Order confirmation?',
                icon: 'info',
                cancelButtonText: 'Cancel',
                showCancelButton: true,
                confirmButtonText: 'Sure'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const removeCart = await apiCart({ cart: [] })
                    const products = []
                    for (let item of current?.cart) {
                        if (item.product?.quantity >= item.quantity) {
                            let value = {
                                pid: item.product?._id,
                                quantity: item.product?.quantity - item.quantity,
                                sold: item.product?.sold + item.quantity
                            }
                            products.push(value)
                        }
                        else {
                            toast.error(`Product ${item.title} is out of stock, sorry`)
                        }
                    }
                    const updateQuantity = await apiUpdateQuantityProduct({ products })
                    if (removeCart.success && updateQuantity.success) {
                        const currentProduct = []
                        for (let item of current?.cart) {
                            currentProduct.push(item.product)
                        }
                        const response = await apiCreateOrder({
                            products: current?.cart,
                            total: current?.cart?.reduce((sum, element) => element.price * element.quantity + sum, 0) + shippingFee,
                            address: current?.address,
                            currentProduct
                        })
                        if (response.success) {
                            dispatch(getCurrent())
                            dispatch(showModal({ isShowModal: true, modalChildren: <CongratPay /> }))
                            Swal.fire({
                                title: 'Congratulate!',
                                text: 'Order Success',
                                icon: 'success',
                                confirmButtonText: 'Continue shopping now'
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    navigate(`/${path.PRODUCTS}`)
                                    dispatch(showModal({ isShowModal: false, modalChildren: null }))
                                }
                            })
                        }
                        else {
                            toast.error(response.mes || removeCart.mes)
                        }
                    }
                }
            })
        }
    }

    return (
        <>
            {!current?.cart?.length > 0 && <div className='w-screen h-screen flex flex-col items-center 
                justify-center text-gray-700'>
                <span className='text-6xl font-semibold'>Your cart</span>
                <span className='w-32 border-b border-black my-8'></span>
                <span className='text-lg'>Your cart is currently empty</span>
                <span className='text-lg mt-4'>
                    <span>Continue browsing </span>
                    <span className='cursor-pointer hover:text-main duration-150'
                        onClick={() => {
                            navigate(`/${path.PRODUCTS}`)
                            window.scrollTo(0, 0)
                        }}
                    >here</span>
                </span>
            </div>}
            {current?.cart?.length > 0 && <div className='w-full relative bg-gray-100'>
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
                            <SelectForm
                                label='Payment Options'
                                options={paymentOptions}
                                register={register}
                                id='payment'
                                validate={{ required: 'Need fill this field' }}
                                styleSelect='px-4 py-2'
                                errors={errors}
                                fullWidth
                                styleDiv='flex-auto h-24 pr-8'
                            />
                            {watch('address') && watch('payment') && <div className='flex justify-end pr-8'>
                                <Button
                                    handleOnClick={handleUpdateAddress}
                                    customStyle='flex items-center gap-2'
                                >
                                    Continue
                                </Button>
                            </div>}
                        </div>}
                        {isShowPaypal && current?.address && <div className='pr-8'>
                            <div className='my-4 flex gap-2'>
                                <span className='font-semibold'>Address:</span>
                                <span>{current?.address || 'No value'}</span>
                            </div>
                            <Paypal
                                payload={{
                                    products: current?.cart,
                                    total: current?.cart?.reduce((sum, element) => element.price * element.quantity + sum, 0) + shippingFee,
                                    address: current?.address,
                                }}
                                amount={current?.cart?.reduce((sum, element) => element.price * element.quantity + sum, 0)}
                            />
                            <div className='flex justify-end'>
                                <Button
                                    handleOnClick={() => setIsShowPaypal(false)}
                                    customStyle='flex items-center gap-2'
                                >
                                    Back
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
                                        {`$${formatMoney(element.price * element.quantity)} USD`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className='text-sm flex flex-col gap-2'>
                            <span className='flex justify-between items-center'>
                                <span>Subtotal</span>
                                <span>
                                    {`$${formatMoney(current?.cart?.reduce((sum, element) =>
                                        sum + Number(element.price) * (element.quantity || 1), 0) || 0)} USD`}
                                </span>
                            </span>
                            <span className='flex justify-between items-center'>
                                <span>Shipping fee</span>
                                <span>{`${shippingFee} USD`}</span>
                            </span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-lg'>Total</span>
                            <span className='text-lg'>
                                {`$${formatMoney(current?.cart?.reduce((sum, element) =>
                                    sum + Number(element.price) * (element.quantity || 1), 0) + shippingFee || 0)} USD`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default withBaseComponent(Checkout)