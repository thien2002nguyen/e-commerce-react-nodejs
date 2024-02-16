import React, { useCallback, useEffect, useState } from 'react';
import { InputField, Button } from 'components';
import { apiLogin, apiRegister, apiForgotPassword } from 'apis';
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom';
import path from 'ultils/path';
import { login } from 'store/user/userSlice'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { validate } from 'ultils/helpers';
import icons from 'ultils/icons';

const { IoIosArrowRoundBack, BiLoader } = icons

const Login = () => {
    const navigate = useNavigate()
    const dispath = useDispatch()
    const [isLoad, setIsLoad] = useState(false)
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
                setIsLoad(true)
                const response = await apiRegister(payload)
                if (response.success) {
                    setIsLoad(false)
                    Swal.fire('Congratulation!', response.mes, 'success').then(() => {
                        setIsRegister(false)
                        resetPayload()
                    })
                }
                else {
                    setIsLoad(false)
                    Swal.fire('Oops!', response.mes, 'error')
                }
            }
            else {
                setIsLoad(true)
                const response = await apiLogin(data)
                if (response.success) {
                    setIsLoad(false)
                    setIsRegister(false)
                    resetPayload()
                    dispath(login({ isLoggedIn: true, token: response.accessToken }))
                    navigate(`/${path.HOME}`)
                }
                else {
                    setIsLoad(false)
                    Swal.fire('Oops!', response?.data?.mes, 'error')
                }
            }
        }
    }, [payload, isRegister, navigate, dispath])
    const handleForgotPassword = async () => {
        setIsLoad(true)
        const response = await apiForgotPassword({ email })
        if (response.success) {
            setIsLoad(false)
            toast.success(response.mes)
        }
        else {
            setIsLoad(false)
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
                            customStyle='px-4 py-2 rounded-md text-white my-2 bg-blue-500 hover:bg-blue-600 
                                duration-200 mx-2 flex justify-center items-center gap-2'
                        >
                            <span>Submit</span>
                            {isLoad && <div className='animate-spin'>
                                <BiLoader />
                            </div>}
                        </Button>
                        <Button
                            handleOnClick={() => setIsForgotPassword(false)}
                        >Back</Button>
                    </div>
                </div>
            </div>}
            <img src="https://www.hulkapps.com/cdn/shop/articles/1.Abadond_Banner_1621x.jpg?v=1644387196"
                alt=""
                className='w-full h-full object-cover'
            />
            <div className='absolute top-0 left-0 right-1/2 bottom-0 flex justify-center
                items-center'
            >
                <div className='p-8 bg-white rounded-md min-w-[500px] flex flex-col items-center'>
                    <h1 className='text-[28px] font-semibold text-main uppercase mb-8'>
                        {isRegister ? 'Register' : 'Login'}
                    </h1>
                    {isRegister && <div className='w-full flex items-center gap-2'>
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey={'firstname'}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            handleSubmit={handleSubmit}
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey={'lastname'}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            handleSubmit={handleSubmit}
                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey={'email'}
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                    />
                    {isRegister && <InputField
                        value={payload.phone}
                        setValue={setPayload}
                        nameKey={'phone'}
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey={'password'}
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        handleSubmit={handleSubmit}
                    />
                    <Button
                        handleOnClick={handleSubmit}
                        fullWidth
                    >
                        <div className='flex justify-center items-center gap-2'>
                            <span>{isRegister ? 'Register' : 'Login'}</span>
                            {isLoad && <div className='animate-spin'>
                                <BiLoader />
                            </div>}
                        </div>
                    </Button>
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
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