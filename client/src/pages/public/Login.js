import React, { useCallback, useState } from 'react';
import { InputField, Button } from '../../components';
import { apiLogin, apiRegister } from '../../apis';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { register } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux';

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
    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, phone, ...data } = payload
        if (isRegister) {
            const response = await apiRegister(payload)
            if (response.success) {
                Swal.fire('Congratulation', response.mes, 'success').then(() => {
                    setIsRegister(false)
                    resetPayload()
                })
            }
            else {
                Swal.fire('Opps!', response.mes, 'error')
            }
        }
        else {
            const response = await apiLogin(data)
            if (response.success) {
                setIsRegister(false)
                resetPayload()
                dispath(register({ isLoggedIn: true, token: response.accessToken, userData: response.userData }))
                navigate(`/${path.HOME}`)
            }
            else {
                Swal.fire('Opps!', response.mes, 'error')
            }
        }
    }, [payload, isRegister, navigate, dispath])
    const handleGoLogin = () => {
        setIsRegister(false)
        resetPayload()
    }
    const handleCreateAccount = () => {
        setIsRegister(true)
        resetPayload()
    }
    return (
        <div className='w-screen h-screen relative'>
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
                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey={'lastname'}
                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey={'email'}
                    />
                    {isRegister && <InputField
                        value={payload.phone}
                        setValue={setPayload}
                        nameKey={'phone'}
                    />}
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey={'password'}
                        type='password'
                    />
                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubmit}
                        fullWidth
                    />
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-auto'
                        >
                            Forgot your account?
                        </span>}
                        {!isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-auto'
                            onClick={() => handleCreateAccount()}
                        >
                            Create account
                        </span>}
                        {isRegister && <span
                            className='text-blue-500 hover:underline duration-200 cursor-auto w-full text-center'
                            onClick={() => handleGoLogin()}
                        >
                            Go Login
                        </span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;