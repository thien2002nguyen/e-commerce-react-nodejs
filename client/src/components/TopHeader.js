import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import path from '../ultils/path'

const TopHeader = () => {
    return (
        <div className='h-[38px] w-full bg-main flex justify-center items-center'>
            <div className='w-main flex justify-between items-center text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                <Link className='hover:text-gray-800 duration-150' to={`/${path.LOGIN}`}>
                    Sign In or Create Account
                </Link>
            </div>
        </div>
    );
};

export default memo(TopHeader);