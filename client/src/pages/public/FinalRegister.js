import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';

const FinalRegister = () => {
    const { status } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (status === 'failed') {
            Swal.fire('Opps!', 'Account registration failed', 'error').then(() => {
                navigate(`/${path.LOGIN}`)
            })
        }
        else {
            Swal.fire('Congratulation!', 'Account registration successful', 'success').then(() => {
                navigate(`/${path.LOGIN}`)
            })
        }
    }, [status, navigate])

    return (
        <div className='w-screen h-screen bg-gray-100'></div>
    );
};

export default FinalRegister;