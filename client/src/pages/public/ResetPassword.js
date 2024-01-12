import React, { useState } from 'react';
import { Button } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { apiResetPassword } from '../../apis';
import { toast } from 'react-toastify';
import path from '../../ultils/path';

import icons from '../../ultils/icons';

const { BiLoader } = icons

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()
    const [isLoad, setIsLoad] = useState(false)
    const handleResetPassword = async () => {
        setIsLoad(true)
        const response = await apiResetPassword({ password, token })
        if (response.success) {
            setIsLoad(false)
            toast.success(response.mes)
            navigate(`/${path.LOGIN}`)
        }
        else {
            setIsLoad(false)
            toast.info(response.mes)
        }
    }
    return (
        <div>
            <div className='absolute top-0 left-0 bottom-0 right-0 bg-white
                z-10 flex justify-center py-8'
            >
                <div className='flex flex-col gap-4'>
                    <label htmlFor="new-password">Enter your new password:</label>
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
                            customStyle='px-4 py-2 rounded-md text-white my-2 bg-blue-500 hover:bg-blue-600 
                                duration-200 mx-2'
                        >
                            <span>Submit</span>
                            {isLoad && <div className='animate-spin'>
                                <BiLoader />
                            </div>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;