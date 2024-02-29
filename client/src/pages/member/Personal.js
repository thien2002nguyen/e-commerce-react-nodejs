import { Button, InputForm, Loading } from 'components';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from 'assets/default_avatar.png'
import icons from 'ultils/icons'
import { toast } from 'react-toastify';
import { toBase64 } from 'ultils/helpers';
import moment from 'moment';
import { apiUpdateCurrent } from 'apis';
import { showModal } from 'store/app/appSlice';
import { getCurrent } from 'store/user/asyncActions';

const { FaUpload, GrDocumentUpdate } = icons

const Personal = () => {
    const dispath = useDispatch()
    const { current } = useSelector(state => state.user)
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [preview, setPreview] = useState({
        avatar: null,
    })
    useEffect(() => {
        reset({
            firstname: current?.firstname || '',
            lastname: current?.lastname || '',
            email: current?.email || '',
            phone: current?.phone || '',
        })
        setPreview({
            avatar: current?.avatar || null
        })
    }, [current, reset])
    const watchAvatar = watch('avatar') || null
    const handlePreviewAvatar = async (file) => {
        if (file) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('Please upload a png or jpg file')
                return
            }
            const base64Thumb = await toBase64(file)
            if (base64Thumb) {
                setPreview(prev => ({ avatar: base64Thumb }))
            }
        }
    }
    useEffect(() => {
        if (watchAvatar) {
            handlePreviewAvatar(watchAvatar[0])
        }
    }, [watchAvatar])
    const handleUpdateInfo = async (data) => {
        const formData = new FormData()
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0])
        }
        delete data.avatar
        for (let key of Object.entries(data)) {
            formData.append(key[0], key[1])
        }
        dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiUpdateCurrent(formData)
        dispath(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            toast.success(response.mes)
            dispath(getCurrent())
        }
        else {
            toast.error(response.mes)
        }
    }
    return (
        <div className='w-full relative'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                justify-between bg-gray-100 z-10'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Personal</span>
                </h1>
            </div>
            <div className='w-2/3 px-4 pt-[92px] pb-4 m-auto'>
                <form onSubmit={handleSubmit(handleUpdateInfo)}>
                    <div className='w-full flex gap-4'>
                        <InputForm
                            label='First name'
                            register={register}
                            errors={errors}
                            id='firstname'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Enter first name'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                        <InputForm
                            label='Last name'
                            register={register}
                            errors={errors}
                            id='lastname'
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder='Enter last name'
                            styleInput='px-4 py-2'
                            styleDiv='flex-auto h-24'
                        />
                    </div>
                    <InputForm
                        label='Email adrress'
                        register={register}
                        errors={errors}
                        id='email'
                        validate={{
                            required: 'Need fill this field',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        }}
                        fullWidth
                        placeholder='Enter email'
                        styleInput='px-4 py-2'
                        styleDiv='flex-auto h-24 mt-2'
                    />
                    <InputForm
                        label='Phone number'
                        register={register}
                        errors={errors}
                        id='phone'
                        validate={{
                            required: 'Need fill this field',
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Invalid phone number"
                            }
                        }}
                        fullWidth
                        placeholder='Enter phone number'
                        styleInput='px-4 py-2'
                        styleDiv='flex-auto h-24 mt-2'
                    />
                    <div className='flex gap-2 mt-2'>
                        <span className='capitalize'>Created at:</span>
                        <span>{moment(current?.createdAt).format('DD/MM/YYYY') || 'Unknown'}</span>
                    </div>
                    <div className='flex justify-between mt-8'>
                        <div className='flex gap-2'>
                            <span className='capitalize'>Profile avatar:</span>
                            <div className='h-32'>
                                {!preview?.avatar && <img
                                    src={defaultAvatar} alt="avatar"
                                    className='w-32 h-32 object-cover rounded-full'
                                />}
                                {preview?.avatar && <img
                                    src={preview.avatar} alt="avatar"
                                    className='w-32 h-32 object-cover rounded-full'
                                />}
                            </div>
                        </div>
                        <label htmlFor="avatar" className='flex items-center gap-2 bg-red-600 text-white 
                            w-fit px-4 py-2 h-fit text-sm rounded-md hover:bg-red-500 duration-200 cursor-pointer'>
                            <span className='capitalize'>Change avatar</span>
                            <FaUpload />
                        </label>
                        <input
                            type="file"
                            id='avatar'
                            {...register('avatar')}
                            className='hidden'
                        />
                    </div>
                    <div className='mt-8 w-full flex justify-center'>
                        <Button
                            type='submit'
                            bg='bg-green-600'
                            hover='hover:bg-green-500'
                            customStyle='flex items-center gap-2'
                        >
                            <span className='capitalize'>Update infomation</span>
                            <GrDocumentUpdate />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Personal;