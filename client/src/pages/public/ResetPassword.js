import React, { useState } from 'react';
import { Button, Loading } from 'components';
import { useNavigate, useParams } from 'react-router-dom';
import { apiResetPassword } from 'apis';
import { toast } from 'react-toastify';
import path from 'ultils/path';
import { useDispatch } from 'react-redux';
import { showModal } from 'store/app/appSlice';

const ResetPassword = () => {
    const dispatch = useDispatch()
    const [password, setPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()
    const handleResetPassword = async () => {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiResetPassword({ password, token })
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            toast.success(response.mes)
            navigate(`/${path.LOGIN}`)
        }
        else {
            toast.info(response.mes)
        }
    }
    return (
        <div>
            <div className='absolute inset-0 bg-white
                z-10 flex justify-center py-8'
            >
                <div className='flex flex-col gap-4'>
                    <label htmlFor="new-password" className=''>Enter your new password:</label>
                    <input
                        type="password"
                        id='new-password'
                        className='w-[800px] py-2 border-b outline-none placeholder:text-sm'
                        placeholder='Type here'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div className='w-full flex justify-end items-center'>
                        <Button
                            handleOnClick={handleResetPassword}
                            bg='bg-blue-600'
                            hover='hover:bg-blue-500'
                        >
                            <span>Submit</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;