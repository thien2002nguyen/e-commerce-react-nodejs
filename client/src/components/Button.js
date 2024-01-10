import React, { memo } from 'react';

const Button = ({ name, type, handleOnClick, style, iconBefore, iconAfter, fullWidth }) => {
    return (
        <button
            type={type || 'button'}
            className={style ? style : `px-4 py-2 rounded-md text-white my-2 bg-[#cd3131] hover:bg-main
                duration-200 font-semibold ${fullWidth ? 'w-full' : ''}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >
            {iconBefore}
            <span>{name}</span>
            {iconAfter}
        </button>
    );
};

export default memo(Button);