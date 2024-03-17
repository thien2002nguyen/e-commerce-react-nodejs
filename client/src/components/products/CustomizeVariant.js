import Button from 'components/buttons/Button'
import InputForm from 'components/inputs/InputForm'
import defaultProduct from 'assets/default-product-image.png'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import icons from 'ultils/icons'
import { toast } from 'react-toastify'
import { toBase64 } from 'ultils/helpers'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import Loading from 'components/common/Loading'
import { apiAddVariant } from 'apis'

const { FaUpload, MdOutlineExitToApp, GrDocumentUpdate } = icons

const CustomizeVariant = ({ customizeVariants, render, setCustomizeVariants }) => {
    const dispatch = useDispatch()
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    useEffect(() => {
        reset({
            title: customizeVariants?.title || '',
            price: customizeVariants?.price || '',
            color: customizeVariants?.color || '',
        })
    }, [customizeVariants, reset])
    const watchThumb = watch('thumb') || null
    const watchImages = watch('images') || null
    const handlePreviewThumb = async (file) => {
        if (file) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('Please upload a png or jpg file')
                return
            }
            const base64Thumb = await toBase64(file)
            if (base64Thumb) {
                setPreview(prev => ({ ...prev, thumb: base64Thumb }))
            }
        }
    }
    const handlePreviewImages = async (files) => {
        if (files) {
            const imagesPreview = []
            for (let file of files) {
                if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                    toast.warning('Please upload a png or jpg file')
                    imagesPreview.splice(0, imagesPreview.length);
                    return
                }
                const base64 = await toBase64(file)
                imagesPreview.push({ name: file.name, path: base64 })
            }
            if (imagesPreview.length > 0) {
                setPreview(prev => ({ ...prev, images: imagesPreview }))
            }
        }
    }
    useEffect(() => {
        if (watchThumb) {
            handlePreviewThumb(watchThumb[0])
        }
    }, [watchThumb])
    useEffect(() => {
        if (watchImages) {
            if (watchImages.length > 10) {
                toast.warning('Only a maximum of 10 photos can be uploaded')
            }
            else {
                handlePreviewImages(watchImages)
            }
        }
    }, [watchImages])
    const handleCustomizeVariant = async (data) => {
        if (data?.color?.toLowerCase() === customizeVariants?.color?.toLowerCase()
            || customizeVariants?.variants?.some(element => element.color?.toLowerCase() === data?.color?.toLowerCase())) {
            Swal.fire('Oops!', 'You need to choose another color for the product', 'info');
            return
        }
        else {
            const formData = new FormData()
            for (let key of Object.entries(data)) {
                formData.append(key[0], key[1])
            }
            if (data.thumb) {
                formData.append('thumb', data.thumb[0])
            }
            if (data.images) {
                for (let image of data.images) {
                    formData.append('images', image)
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiAddVariant(customizeVariants?._id, formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setPreview({ thumb: '', images: [] })
                window.scrollTo(0, 0)
            }
            else {
                toast.error(response.mes)
            }
        }
    }
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Customize Variant of Product</span>
                </h1>
                <Button
                    bg='bg-gray-600'
                    hover='hover:bg-gray-500'
                    handleOnClick={() => setCustomizeVariants(null)}
                    customStyle='flex items-center gap-2'
                >
                    <span>Cancel</span>
                    <MdOutlineExitToApp />
                </Button>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleCustomizeVariant)}>
                    <div className='w-full flex gap-4'>
                        <InputForm
                            label='Original name'
                            register={register}
                            errors={errors}
                            id='title'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Name of product'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                    </div>
                    <div className='w-full mt-4 flex gap-4'>
                        <InputForm
                            label='Price variant'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Price of product'
                            type='number'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                        <InputForm
                            label='Color variant'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Color of product'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                    </div>
                    <div className='flex flex-col border-2 p-4 rounded-md w-fit gap-4 mt-4'>
                        <span className='text-gray-700'>Upload thumb</span>
                        <label htmlFor="thumb" className='flex items-center gap-2 bg-red-600 text-white 
                            w-fit px-4 py-2 text-sm rounded-md hover:bg-red-500 duration-200 cursor-pointer'>
                            <span>Upload</span>
                            <FaUpload />
                        </label>
                        <input
                            type="file"
                            id='thumb'
                            {...register('thumb', { required: 'Need fill this field' })}
                            className='mt-4 hidden'
                        />
                        <div className='h-[100px]'>
                            {!preview.thumb && <img
                                src={defaultProduct} alt="imageProduct"
                                className='w-[100px] h-[100px] object-contain border-2 rounded-md'
                            />}
                            {preview.thumb && <img
                                src={preview.thumb} alt="imageProduct"
                                className='w-[100px] h-[100px] object-contain border-2 rounded-md'
                            />}
                        </div>
                    </div>
                    <div className='h-4'>
                        {errors['thumb'] && <small className='text-main text-[10px]'>
                            {errors['thumb']?.message}
                        </small>}
                    </div>
                    <div className='flex flex-col border-2 p-4 rounded-md mt-4 w-fit gap-4'>
                        <span className='text-gray-700'>Upload images of product</span>
                        <label htmlFor="images" className='flex items-center gap-2 bg-red-600 text-white 
                            w-fit px-4 py-2 text-sm rounded-md hover:bg-red-500 duration-200 cursor-pointer'>
                            <span>Upload</span>
                            <FaUpload />
                        </label>
                        <input
                            type="file"
                            id='images'
                            multiple
                            {...register('images', { required: 'Need fill this field' })}
                            className='mt-4 hidden'
                        />
                        <div className='grid grid-cols-10 gap-4'>
                            {preview.images.length === 0 && <img
                                src={defaultProduct} alt="imageProduct"
                                className='w-[100px] h-[100px] object-contain border-2 rounded-md'
                            />}
                            {preview.images.length > 0 && preview.images.map((element, index) => (
                                <img
                                    key={index}
                                    src={element.path ? element.path : element} alt="imageProduct"
                                    className='w-[100px] h-[100px] object-contain border-2 rounded-md'
                                />
                            ))}
                        </div>
                    </div>
                    <div className='h-4'>
                        {errors['images'] && <small className='text-main text-[10px]'>
                            {errors['images']?.message}
                        </small>}
                    </div>
                    <div className='mt-4 w-full flex justify-center'>
                        <Button
                            type='submit'
                            bg='bg-yellow-600'
                            hover='hover:bg-yellow-500'
                            customStyle='flex items-center gap-2'
                        >
                            <span>Add variant</span>
                            <GrDocumentUpdate />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(CustomizeVariant)