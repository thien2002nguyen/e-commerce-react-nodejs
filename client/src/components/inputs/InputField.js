import React, { memo, useState } from 'react';

const InputField = ({
    value,
    setValue,
    nameKey,
    type,
    invalidFields,
    setInvalidFields,
    handleSubmit,
    convertStyle,
    fullWidth,
    isHideLabel,
    convertPlaceholder
}) => {
    const [isFocus, setIsFocus] = useState(false)
    const handleForcus = () => {
        setIsFocus(true)
        invalidFields && setInvalidFields([])
    }
    return (
        <div className={`relative mb-2 ${fullWidth && 'w-full'}`}>
            {!isHideLabel && (isFocus || value.trim() !== '') && <label
                htmlFor={nameKey}
                className='text-[10px] absolute top-0 left-3 block bg-white px-1 capitalize animate-slide-top-sm
                    text-gray-600'
            >
                {nameKey?.toLowerCase()}
            </label>}
            <input
                type={type || "text"}
                className={`px-4 py-2 rounded-sm placeholder:capitalize mt-2 w-full border 
                    placeholder:text-sm outline-none ${convertStyle}`}
                placeholder={convertPlaceholder || nameKey?.toLowerCase()}
                id={nameKey}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => handleForcus()}
                onBlur={() => setIsFocus(false)}
                onKeyDown={e => e.code.toLocaleLowerCase() === 'enter' && handleSubmit()}
            />
            {invalidFields?.some(element => element.name === nameKey) && <small
                className='text-main text-[10px]'>
                {invalidFields?.find(element => element.name === nameKey)?.mes}
            </small>}
        </div>
    );
};

export default memo(InputField);