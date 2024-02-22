import React, { memo } from 'react';

const Button = ({ children, handleOnClick, customStyle, fullWidth, type = 'button' }) => {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-md text-white my-2 bg-[red] hover:bg-main
                duration-200 ${fullWidth && 'w-full'} ${customStyle && customStyle}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {children}
        </button>
    );
};

export default memo(Button);