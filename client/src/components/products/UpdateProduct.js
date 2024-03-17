import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, InputForm, Loading, MarkdownEditor, SelectForm } from 'components';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import { toBase64, validate } from 'ultils/helpers';
import icons from 'ultils/icons';
import defaultProduct from 'assets/default-product-image.png'
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from 'store/app/appSlice';
import { apiUpdateProduct } from 'apis';

const { FaUpload, MdOutlineExitToApp, GrDocumentUpdate } = icons

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.app)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [payload, setPayload] = useState({
        description: ''
    })
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    useEffect(() => {
        reset({
            title: editProduct.title || '',
            price: editProduct.price || '',
            quantity: editProduct.quantity || '',
            color: editProduct.color || '',
            category: editProduct.category || '',
            brand: editProduct.brand.toLowerCase() || '',
        })
        setPayload({
            description: editProduct.description?.length > 1 ?
                `<ul>${editProduct.description?.map(element =>
                    (`<li>${element}</li>`))}</ul>`.replaceAll('</li>,', '</li>')
                : editProduct.description[0]
        })
        setPreview({
            thumb: editProduct.thumb || '',
            images: editProduct.images || []
        })
    }, [editProduct, reset])
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [])
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
    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(element => element.title === data.category)?.title
            }
            const formData = new FormData()
            const finalPayload = { ...data, ...payload }
            for (let key of Object.entries(finalPayload)) {
                formData.append(key[0], key[1])
            }
            if (finalPayload.thumb) {
                formData.append('thumb', finalPayload.thumb[0])
            }
            if (finalPayload.images) {
                for (let image of finalPayload.images) {
                    formData.append('images', image)
                }
            }
            delete finalPayload.thumb
            delete finalPayload.images
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiUpdateProduct(editProduct?._id, formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditProduct(null)
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
                    <span className='capitalize'>Update product</span>
                </h1>
                <Button
                    bg='bg-gray-600'
                    hover='hover:bg-gray-500'
                    handleOnClick={() => setEditProduct(null)}
                    customStyle='flex items-center gap-2'
                >
                    <span>Cancel</span>
                    <MdOutlineExitToApp />
                </Button>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label='Name product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this field'
                        }}
                        fullWidth
                        placeholder='Name of product'
                        styleInput='px-4 py-2'
                        styleDiv='h-24'
                    />
                    <div className='w-full mt-4 flex gap-4'>
                        <InputForm
                            label='Price'
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
                            label='Quantity'
                            register={register}
                            errors={errors}
                            id='quantity'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Quantity of product'
                            type='number'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                        <InputForm
                            label='Color'
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
                    <div className='w-full mt-4 flex gap-4'>
                        <SelectForm
                            label='Category'
                            options={categories?.map(element => ({ code: element.title, value: element.title }))}
                            register={register}
                            id='category'
                            validate={{ required: 'Need fill this field' }}
                            styleSelect='px-4 py-2'
                            errors={errors}
                            fullWidth
                            styleDiv='flex-auto h-24'
                        />
                        <SelectForm
                            label='Brand (Optional)'
                            options={categories?.find(element => element.title === watch('category'))?.brand?.map(item => ({ code: item.toLowerCase(), value: item }))}
                            register={register}
                            id='brand'
                            styleSelect='px-4 py-2'
                            errors={errors}
                            fullWidth
                            styleDiv='flex-auto h-24'
                        />
                    </div>
                    <div className='py-4'>
                        <MarkdownEditor
                            name='description'
                            changeValue={changeValue}
                            label='Description'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            value={payload.description}
                        />
                    </div>
                    <div className='flex flex-col border-2 p-4 rounded-md w-fit gap-4'>
                        <span className='text-gray-700'>Upload thumb</span>
                        <label htmlFor="thumb" className='flex items-center gap-2 bg-red-600 text-white 
                            w-fit px-4 py-2 text-sm rounded-md hover:bg-red-500 duration-200 cursor-pointer'>
                            <span>Upload</span>
                            <FaUpload />
                        </label>
                        <input
                            type="file"
                            id='thumb'
                            {...register('thumb')}
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
                    <div className='flex flex-col border-2 p-4 rounded-md mt-8 gap-4 w-fit'>
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
                            {...register('images')}
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
                    <div className='mt-8 w-full flex justify-center'>
                        <Button
                            type='submit'
                            bg='bg-green-600'
                            hover='hover:bg-green-500'
                            customStyle='flex items-center gap-2'
                        >
                            <span>Update product</span>
                            <GrDocumentUpdate />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(UpdateProduct)