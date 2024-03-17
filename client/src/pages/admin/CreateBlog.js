import { Button, InputForm, Loading, MarkdownEditor, SelectForm } from 'components'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaUpload } from 'react-icons/fa'
import { IoCreateOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { toBase64, validate } from 'ultils/helpers'
import defaultProduct from 'assets/default-product-image.png'
import { apiCreateBlog, apiGetBlogCategories } from 'apis/blog'
import withBaseComponent from 'hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'

const CreateBlog = ({ dispatch }) => {
    const [blogCate, setBlogCate] = useState([])
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [payload, setPayload] = useState({
        description: ''
    })
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [])
    const fetchBlogCategories = async () => {
        const response = await apiGetBlogCategories()
        if (response.success) {
            setBlogCate(response.data)
        }
    }
    useEffect(() => {
        fetchBlogCategories()
    }, [])
    const watchImage = watch('image') || null
    const [preview, setPreview] = useState({
        image: null,
    })
    const handlePreviewImage = async (file) => {
        if (file) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('Please upload a png or jpg file')
                return
            }
            const base64Thumb = await toBase64(file)
            if (base64Thumb) {
                setPreview({ image: base64Thumb })
            }
        }
    }
    useEffect(() => {
        if (watchImage) {
            handlePreviewImage(watchImage[0])
        }
    }, [watchImage])
    const handleCreateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) {
                data.category = blogCate?.find(element => element._id === data.category)?.title
            }
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            for (let key of Object.entries(finalPayload)) {
                formData.append(key[0], key[1])
            }
            if (finalPayload.image) {
                formData.append('image', finalPayload.image[0])
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiCreateBlog(formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                reset()
                setPayload({
                    description: ''
                })
                setPreview({
                    images: null
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
                    <span className='capitalize'>Create New Blog</span>
                </h1>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleCreateBlog)}>
                    <InputForm
                        label='Title'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Need fill this field'
                        }}
                        fullWidth
                        placeholder='Enter title'
                        styleInput='px-4 py-2'
                        styleDiv='h-24'
                    />
                    <SelectForm
                        label='Category'
                        options={blogCate?.map(element => ({ code: element._id, value: element.title }))}
                        register={register}
                        id='category'
                        validate={{ required: 'Need fill this field' }}
                        styleSelect='px-4 py-2'
                        errors={errors}
                        fullWidth
                        styleDiv='flex-auto h-24'
                    />
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
                        <span className='text-gray-700'>Upload image</span>
                        <label htmlFor="image" className='flex items-center gap-2 bg-red-600 text-white 
                            w-fit px-4 py-2 text-sm rounded-md hover:bg-red-500 duration-200 cursor-pointer'>
                            <span>Upload</span>
                            <FaUpload />
                        </label>
                        <input
                            type="file"
                            id='image'
                            {...register('image', { required: 'Need fill this field' })}
                            className='mt-4 hidden'
                        />
                        <div className='h-[100px]'>
                            {!preview.image && <img
                                src={defaultProduct} alt="imageProduct"
                                className='w-[150px] h-[100px] object-cover border-2 rounded-md'
                            />}
                            {preview.image && <img
                                src={preview.image} alt="imageProduct"
                                className='w-[150px] h-[100px] object-cover border-2 rounded-md'
                            />}
                        </div>
                    </div>
                    <div className='h-4'>
                        {errors['image'] && <small className='text-main text-[10px]'>
                            {errors['image']?.message}
                        </small>}
                    </div>
                    <div className='mt-4 w-full flex justify-center'>
                        <Button
                            type='submit'
                            bg='bg-blue-600'
                            hover='hover:bg-blue-500'
                            customStyle='flex items-center gap-2'
                        >
                            <span>Create new blog</span>
                            <IoCreateOutline />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withBaseComponent(CreateBlog)