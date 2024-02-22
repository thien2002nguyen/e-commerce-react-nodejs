import React, { memo } from 'react';
import slide3 from 'assets/slideshow3-home2_1920x.png'

const Banner = () => {
    return (
        <div className='w-full'>
            <img src={slide3}
                alt=""
                className='h-[400px] w-full object-cover'
            />
        </div>
    );
};

export default memo(Banner);