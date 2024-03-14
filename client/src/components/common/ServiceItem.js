import React, { memo } from 'react'

const ServiceItem = ({ icon, title, text }) => {
    return (
        <div className='w-full flex flex-col items-center gap-4'>
            <i>{icon}</i>
            <div className='flex flex-col items-center text-center gap-2'>
                <span className='text-gray-600'>{title}</span>
                <span className='text-gray-600 text-xs'>{text}</span>
            </div>
        </div>
    )
}

export default memo(ServiceItem)