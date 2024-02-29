import React, { useCallback, useEffect, useState } from 'react';
import background from 'assets/ecommerce-login.png'
import { InputField, Button, Loading } from 'components';
import { apiLogin, apiRegister, apiForgotPassword } from 'apis';
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom';
import path from 'ultils/path';
import { login } from 'store/user/userSlice'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { validate } from 'ultils/helpers';
import icons from 'ultils/icons';
import { showModal } from 'store/app/appSlice';

const { IoIosArrowRoundBack } = icons

const Login = () => {
    const navigate = useNavigate()
    const dispath = useDispatch()
    const [payload, setPayload] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: ''
    })
    const resetPayload = () => {
        setPayload({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            phone: ''
        })
    }
    const [isRegister, setIsRegister] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [invalidFields, setInvalidFields] = useState([])
    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, phone, ...data } = payload
        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
        if (invalids === 0) {
            if (isRegister) {
                dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiRegister(payload)
                dispath(showModal({ isShowModal: false, modalChildren: null }))
                if (response.success) {
                    Swal.fire('Congratulation!', response.mes, 'success').then(() => {
                        setIsRegister(false)
                        resetPayload()
                    })
                }
                else {
                    Swal.fire('Oops!', response.mes, 'error')
                }
            }
            else {
                dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiLogin(data)
                dispath(showModal({ isShowModal: false, modalChildren: null }))
                if (response.success) {
                    setIsRegister(false)
                    resetPayload()
                    dispath(login({ isLoggedIn: true, token: response.accessToken }))
                    navigate(`/${path.HOME}`)
                }
                else {
                    Swal.fire('Oops!', response?.data?.mes, 'error')
                }
            }
        }
    }, [payload, isRegister, navigate, dispath])
    const handleForgotPassword = async () => {
        dispath(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiForgotPassword({ email })
        dispath(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            toast.success(response.mes)
        }
        else {
            toast.info(response.mes)
        }
    }
    useEffect(() => {
        resetPayload()
        setInvalidFields([])
    }, [isRegister])
    return (
        <div className='w-screen h-screen relative'>
            {isForgotPassword && <div className='absolute top-0 left-0 bottom-0 right-0 bg-white
                z-10 flex justify-center py-8 animate-slide-right'
            >
                <div className='flex flex-col gap-4'>
                    <label htmlFor="your-email">Enter your email:</label>
                    <input
                        type="email"
                        id='your-email'
                        className='w-[800px] py-2 border-b outline-none placeholder:text-sm'
                        placeholder='Exp: email@gmail.com'
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.code.toLocaleLowerCase() === 'enter' && handleForgotPassword()}
                    />
                    <div className='w-full flex justify-end items-center'>
                        <Button
                            handleOnClick={handleForgotPassword}
                            bg='bg-blue-600'
                            customStyle='mx-2'
                            hover='hover:bg-blue-500'
                        >
                            <span>Submit</span>
                        </Button>
                        <Button
                            handleOnClick={() => setIsForgotPassword(false)}
                        >Back</Button>
                    </div>
                </div>
            </div>}
            <img src={background}
                alt=""
                className='w-full h-full object-cover'
            />
            <div className='absolute top-0 left-0 right-1/2 bottom-0 flex justify-center
                items-center'
            >
                <div className='p-8 bg-white rounded-md min-w-[500px] flex flex-col gap-4 items-center'>
                    <h1 className='text-[28px] font-semibold text-main uppercase mb-8'>
                        {isRegister ? 'Register' : 'Login'}
                    </h1>
                    {isRegister && <div className='w-full flex items-center gap-4'>
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            handleSubmit={handleSubmit}
                            fullWidth
                            convertStyle='w-full'
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            handleSubmit={handleSubmit}
                            fullWidth
                            convertStyle='w-full'
                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                        fullWidth
                        convertStyle='w-full'
                    />
                    {isRegister && <InputField
                        value={payload.phone}
                        setValue={setPayload}
                        nameKey='phone'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                        fullWidth
                        convertStyle='w-full'

                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                        fullWidth
                        convertStyle='w-full'
                    />
                    <Button
                        handleOnClick={handleSubmit}
                        fullWidth
                        convertStyle='w-full'
                    >
                        <div className='flex justify-center items-center gap-2'>
                            <span>{isRegister ? 'Register' : 'Login'}</span>
                        </div>
                    </Button>
                    <div className='flex items-center justify-between w-full text-sm'>
                        {!isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-pointer'
                            onClick={() => setIsForgotPassword(true)}
                        >
                            Forgot your account?
                        </span>}
                        {!isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-pointer'
                            onClick={() => setIsRegister(true)}
                        >
                            Create account
                        </span>}
                        {isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-pointer w-full text-center'
                            onClick={() => setIsRegister(false)}
                        >
                            Go Login
                        </span>}
                    </div>
                    <Link
                        className='text-blue-500 hover:underline duration-200 flex items-center
                            cursor-pointer'
                        to={`/${path.HOME}`}>
                        <IoIosArrowRoundBack size={20} />
                        <span className='ms-1 text-sm'>Go home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;