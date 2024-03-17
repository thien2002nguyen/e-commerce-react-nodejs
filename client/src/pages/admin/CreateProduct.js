import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputForm, Loading, MarkdownEditor, SelectForm } from 'components';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { validate, toBase64 } from 'ultils/helpers';
import defaultProduct from 'assets/default-product-image.png'
import { toast } from 'react-toastify';
import icons from 'ultils/icons';
import { apiCreateProduct } from 'apis';
import { showModal } from 'store/app/appSlice';

const { FaUpload, IoCreateOutline } = icons

const CreateProduct = () => {
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
    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(element => element._id === data.category)?.title
            }
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
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
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiCreateProduct(formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                reset()
                setPayload({
                    description: ''
                })
                setPreview({
                    thumb: null,
                    images: []
                })
                window.scrollTo(0, 0)
            }
            else {
                toast.error(response.mes)
            }
        }
    }
    return (
        <div className='w-full'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Create New Product</span>
                </h1>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm
                        label='Name product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this field'
                        }}
                        fullWidth
                        placeholder='Name of new product'
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
                            placeholder='Price of new product'
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
                            placeholder='Quantity of new product'
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
                            placeholder='Color of new product'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                    </div>
                    <div className='w-full mt-4 flex gap-4'>
                        <SelectForm
                            label='Category'
                            options={categories?.map(element => ({ code: element._id, value: element.title }))}
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
                            options={categories?.find(element => element._id === watch('category'))?.brand?.map(item => ({ code: item, value: item }))}
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
                                    src={element.path} alt="imageProduct"
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
                            bg='bg-blue-600'
                            hover='hover:bg-blue-500'
                            customStyle='flex items-center gap-2'
                        >
                            <span>Create new product</span>
                            <IoCreateOutline />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;