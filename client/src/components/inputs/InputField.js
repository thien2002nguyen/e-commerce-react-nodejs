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
    convertPlaceholder,
    heightError
}) => {
    const [isFocus, setIsFocus] = useState(false)
    const handleForcus = () => {
        setIsFocus(true)
        invalidFields && setInvalidFields([])
    }
    return (
        <div className={`relative ${fullWidth && 'w-full'}`}>
            {!isHideLabel && (isFocus || value.trim() !== '') && <label
                htmlFor={nameKey}
                className='text-[12px] absolute top-[-6px] left-3 block bg-white px-1 capitalize animate-slide-top-sm
                    text-gray-400'
            >
                {nameKey?.toLowerCase()}
            </label>}
            <input
                type={type || "text"}
                className={`px-4 py-2 rounded-sm placeholder:capitalize border placeholder:text-gray-400
                    placeholder:text-sm outline-none ${convertStyle && convertStyle}`}
                placeholder={isFocus ? '' : convertPlaceholder || nameKey?.toLowerCase()}
                id={nameKey}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => handleForcus()}
                onBlur={() => setIsFocus(false)}
                onKeyDown={e => e.code.toLocaleLowerCase() === 'enter' && handleSubmit()}
            />
            <div className={`${heightError ? 'h-4' : 'h-0'}`}>
                {invalidFields?.some(element => element.name === nameKey) && <small
                    className='text-main text-[10px]'>
                    {invalidFields?.find(element => element.name === nameKey)?.mes}
                </small>}
            </div>
        </div>
    );
};

export default memo(InputField);