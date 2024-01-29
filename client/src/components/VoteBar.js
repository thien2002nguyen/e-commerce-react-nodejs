import React, { useEffect, useRef } from 'react';
import icons from '../ultils/icons';

const { AiFillStar } = icons

const VoteBar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()
    useEffect(() => {
        const percent = Math.round(ratingTotal * 100 / ratingCount) || 0
        percentRef.current.style.cssText = `right: ${100 - percent}%`
    }, [ratingCount, ratingTotal])
    return (
        <div className='flex items-center gap-4 text-sm text-gray-600'>
            <div className='flex w-8 items-center gap-1 justify-between'>
                <span>{number}</span>
                <AiFillStar color='orange' />
            </div>
            <div className='flex-1'>
                <div className='w-full h-[6px] bg-gray-200 rounded-md relative'>
                    <div ref={percentRef} className='absolute inset-0 bg-main rounded-md'></div>
                </div>
            </div>
            <div className='flex text-xs justify-end'>
                {`${ratingTotal || 0} reviewers`}
            </div>
        </div>
    );
};

export default VoteBar;