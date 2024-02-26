import React, { memo } from 'react';

const Button = ({
    children,
    handleOnClick,
    customStyle,
    fullWidth,
    type = 'button',
    bg = 'bg-red-600',
    hover = 'hover:bg-red-500' }) => {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-md text-white ${bg} ${hover}
                duration-200 ${fullWidth && 'w-full'} ${customStyle && customStyle}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {children}
        </button>
    );
};

export default memo(Button);