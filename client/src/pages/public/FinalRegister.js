import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const FinalRegister = () => {
    const { status } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (status === 'failed') {
            Swal.fire('Oops!', 'Account registration failed', 'error').then(() => {
                window.close()
            })
        }
        else {
            Swal.fire('Congratulation!', 'Account registration successful', 'success').then(() => {
                window.close()
            })
        }
    }, [status, navigate])

    return (
        <div className='w-screen h-screen bg-gray-100'></div>
    );
};

export default FinalRegister;