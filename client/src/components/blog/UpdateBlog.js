import { Button, InputForm, Loading, MarkdownEditor, SelectForm } from 'components'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import icons from 'ultils/icons'
import defaultProduct from 'assets/default-product-image.png'
import { toast } from 'react-toastify'
import { toBase64, validate } from 'ultils/helpers'
import { apiUpdateBlog } from 'apis/blog'
import withBaseComponent from 'hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'

const { MdOutlineExitToApp, FaUpload, GrDocumentUpdate } = icons

const UpdateBlog = ({ editBlog, render, setEditBlog, blogCate, dispatch }) => {
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [payload, setPayload] = useState({
        description: ''
    })
    const [preview, setPreview] = useState({
        image: null,
    })
    const [invalidFields, setInvalidFields] = useState([])
    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [])
    useEffect(() => {
        reset({
            title: editBlog.title || '',
            category: editBlog.category || '',
        })
        setPayload({
            description: editBlog.description || ''
        })
        setPreview({
            image: editBlog.image || '',
        })
    }, [editBlog, reset])
    const watchImage = watch('image') || null
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
    const handleUpdateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields)
        if (invalids === 0) {
            if (data.category) {
                data.category = blogCate?.find(element => element.title === data.category)?.title
            }
            const formData = new FormData()
            const finalPayload = { ...data, ...payload }
            for (let key of Object.entries(finalPayload)) {
                formData.append(key[0], key[1])
            }
            if (finalPayload.image) {
                formData.append('image', finalPayload.image[0])
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiUpdateBlog(formData, editBlog?._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditBlog(null)
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
                    <span className='capitalize'>Update blog</span>
                </h1>
                <Button
                    bg='bg-gray-600'
                    hover='hover:bg-gray-500'
                    handleOnClick={() => setEditBlog(null)}
                    customStyle='flex items-center gap-2'
                >
                    <span>Cancel</span>
                    <MdOutlineExitToApp />
                </Button>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleUpdateBlog)}>
                    <InputForm
                        label='Title'
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
                    <SelectForm
                        label='Category'
                        options={blogCate?.map(element => ({ code: element.title, value: element.title }))}
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
                            value={payload.description}
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
                            {...register('image')}
                            className='mt-4 hidden'
                        />
                        <div className='h-[100px]'>
                            {!preview.image && <img
                                src={defaultProduct} alt="imageBlog"
                                className='w-[150px] h-[100px] object-contain border-2 rounded-md'
                            />}
                            {preview.image && <img
                                src={preview.image} alt="imageBlog"
                                className='w-[150px] h-[100px] object-contain border-2 rounded-md'
                            />}
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

export default withBaseComponent(memo(UpdateBlog))