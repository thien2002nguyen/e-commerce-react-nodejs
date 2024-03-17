import { apiUpdateCart } from 'apis'
import Button from 'components/buttons/Button'
import SelectQuantity from 'components/common/SelectQuantity'
import DOMPurify from 'dompurify'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import { getCurrent } from 'store/user/asyncActions'
import Swal from 'sweetalert2'
import { formatMoney } from 'ultils/helpers'
import icons from 'ultils/icons'
import path from 'ultils/path'

const { IoClose } = icons

const QuickView = ({ productData, dispatch, location, navigate }) => {
    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(1)
    const [currentThumb, setCurrentThumb] = useState(null)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [variant, setVariant] = useState(null)
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            setQuantity(1)
        }
        else if (Number(number) > productData?.quantity) {
            setQuantity(productData?.quantity)
        }
        else {
            setQuantity(number.trim())
        }
    }, [productData])
    const handleChangeQuantity = useCallback((flag) => {
        if (quantity === 1 && flag === 'minus') {
            setQuantity(1)
        }
        else if (quantity === productData?.quantity && flag === 'plus') {
            setQuantity(productData?.quantity)
        }
        else {
            if (flag === 'minus') {
                setQuantity(prev => Number(prev) - 1)
            }
            else {
                setQuantity(prev => Number(prev) + 1)
            }
        }
    }, [quantity, productData])
    useEffect(() => {
        setCurrentProduct(productData)
        setCurrentThumb(productData?.thumb)
    }, [productData])
    useEffect(() => {
        if (variant) {
            setCurrentThumb(variant?.thumb)
            setCurrentProduct(variant)
        }
        else {
            setCurrentThumb(productData?.thumb)
            setCurrentProduct(productData)
        }
    }, [variant, productData])
    const handleAddToCart = async () => {
        if (!current) {
            return Swal.fire({
                title: 'Oops!',
                text: 'Please login first',
                icon: 'info',
                cancelButtonText: 'Not now',
                showCancelButton: true,
                confirmButtonText: 'Go login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        }
        const response = await apiUpdateCart({
            pid: productData?._id,
            color: currentProduct?.color,
            quantity,
            price: currentProduct?.price,
            thumb: currentThumb,
            title: currentProduct?.title
        })
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <div className='w-screen h-screen flex'>
            <div className='m-auto bg-white p-6 flex gap-6 relative' onClick={e => e.stopPropagation()}>
                <span
                    className='absolute -right-16 -top-8 text-black cursor-pointer hover:text-gray-600 duration-150'
                    onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
                >
                    <IoClose size={32} />
                </span>
                <div className='flex flex-col gap-2'>
                    <img src={currentThumb || productData?.thumb} alt="thumb" className='w-[300px] h-[300px] object-contain' />
                    <div className='grid grid-cols-3 gap-2'>
                        {currentProduct?.images?.map((elment, index) => (
                            <img
                                src={elment}
                                alt="imageProduct"
                                key={index}
                                className='w-[100px] h-[100px] object-contain'
                                onClick={() => setCurrentThumb(elment)}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='uppercase font-semibold text-xl'>{currentProduct?.title}</span>
                    {productData?.description?.length > 1 && <ul className='text-sm text-gray-700 line-clamp-[8] leading-6 list-disc pl-4'>
                        {productData?.description?.map((element, index) => (
                            <li key={index}>{element}</li>
                        ))}
                    </ul>}
                    {productData?.description?.length === 1 && <div
                        className='text-sm text-gray-700 leading-6 w-[375px] line-clamp-[8]'
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData?.description[0]) }}
                    >
                    </div>}
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold'>{`$${formatMoney(productData?.price)} USD`}</h2>
                        <span className='text-sm text-main'>{`In stock: ${productData?.quantity}`}</span>
                    </div>
                    <div className='my-4 flex gap-4'>
                        <span className='text-sm font-semibold me-4'>Variant</span>
                        <div className='grid grid-cols-2 gap-4 items-center'>
                            <div className={`flex items-center gap-2 rounded-md p-2 border cursor-pointer 
                                ${!variant && 'border-gray-800'}`}
                                onClick={() => setVariant(null)}
                            >
                                <img src={productData?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-contain' />
                                <span className='flex flex-col'>
                                    <span className='text-sm'>{productData?.color}</span>
                                    <span className='text-xs'>{`$${formatMoney(productData?.price)} USD`}</span>
                                </span>
                            </div>
                            {productData?.variants?.map((element, index) => (
                                <div
                                    onClick={() => setVariant(element)}
                                    key={index}
                                    className={`flex items-center gap-2 rounded-md border cursor-pointer
                                        ${variant?._id === element._id && 'border-gray-800'}`}
                                >
                                    <img src={element?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-contain' />
                                    <span className='flex flex-col'>
                                        <span className='text-sm'>{element?.color}</span>
                                        <span className='text-xs'>{`$${formatMoney(element?.price)} USD`}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {productData?.quantity > 0 && <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />}
                    <div className='mt-4'>
                        {productData?.quantity > 0 ? <Button handleOnClick={handleAddToCart}>Add to Cart</Button> :
                            <Button bg='bg-gray-500' hover='hover:bg-none'>Sold out</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(QuickView))