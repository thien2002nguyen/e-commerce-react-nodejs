import React, { memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import path from 'ultils/path'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrent } from 'store/user/asyncActions';
import icons from 'ultils/icons';
import { logout, clearErrorMessage } from 'store/user/userSlice';
import Swal from 'sweetalert2';

const { MdOutlineLogout } = icons

const TopHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn, current, errorMessage } = useSelector(state => state.user)
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurrent())
            }
        }, 300)
        return () => {
            clearTimeout(setTimeoutId)
        }
    }, [isLoggedIn, dispatch])
    useEffect(() => {
        if (errorMessage) {
            Swal.fire('Oops!', errorMessage, 'info').then(() => {
                dispatch(clearErrorMessage())
                navigate(`/${path.LOGIN}`)
            })
        }
    }, [errorMessage, navigate, dispatch])
    return (
        <div className='h-[38px] w-full bg-main flex justify-center items-center'>
            <div className='w-main flex justify-between items-center text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                {isLoggedIn && current
                    ? <div className='flex gap-4 text-sm items-center'>
                        <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                        <span
                            className='hover:rounded-sm p-1 hover:bg-gray-100 cursor-pointer 
                            hover:text-main'
                            onClick={() => dispatch(logout())}
                        >
                            <MdOutlineLogout size={18} />
                        </span>
                    </div>
                    : <Link className='hover:text-gray-800 duration-150' to={`/${path.LOGIN}`}>
                        Sign In or Create Account
                    </Link>}
            </div>
        </div>
    );
};

export default memo(TopHeader);