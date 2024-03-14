import { Breadcrumb } from 'components';
import React from 'react';

const Blogs = () => {
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>Blogs</h3>
                    <Breadcrumb category={'Blogs'} />
                </div>
            </div>
        </div>
    );
};

export default Blogs;