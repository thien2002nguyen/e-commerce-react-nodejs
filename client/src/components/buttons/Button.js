import React, { memo } from 'react';

const Button = ({ children, handleOnClick, customStyle, fullWidth }) => {
    return (
        <button
            type='button'
            className={customStyle ? customStyle : `px-4 py-2 rounded-md text-white my-2 bg-[red] hover:bg-main
                duration-200 ${fullWidth ? 'w-full' : ''}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {children}
        </button>
    );
};

export default memo(Button);