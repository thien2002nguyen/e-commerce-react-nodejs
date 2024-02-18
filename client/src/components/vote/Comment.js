import React, { memo } from 'react';
import avatar from 'assets/default_avatar.png'
import moment from 'moment'
import { renderStartFromNumber } from 'ultils/helpers';

const Comment = ({ image = avatar, name = 'Anonymous', updatedAt, comment, star }) => {
    return (
        <div className='flex gap-4 py-4 px-8'>
            <div className='flex-none'>
                <img src={image} alt="avatar" className='w-[25px] h-[25px] object-contain rounded-full' />
            </div>
            <div className='flex flex-col flex-auto'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold'>{name}</h3>
                    <span className='text-xs capitalize'>{moment(updatedAt)?.fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 pl-4 text-sm mt-4 border p-2 border-gray-300 bg-gray-100'>
                    <span className='flex items-center gap-2'>
                        <span className='font-semibold'>Vote:</span>
                        <span className='flex items-center gap-1'>
                            {renderStartFromNumber(star)?.map((element, index) => (
                                <span key={index}>{element}</span>
                            ))}
                        </span>
                    </span>
                    <span className='flex gap-2'>
                        <span className='font-semibold'>Comment:</span>
                        <span>{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Comment);