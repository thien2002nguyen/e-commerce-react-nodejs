import React, { useState } from 'react';

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {
    const [isFocus, setIsFocus] = useState()
    return (
        <div className='w-full relative'>
            {(isFocus || value.trim() !== '') && <label
                htmlFor={nameKey}
                className='text-[10px] absolute top-0 left-3 block bg-white px-1 capitalize animate-slide-top-sm
                    text-gray-600'
            >
                {nameKey}
            </label>}
            <input
                type={type || "text"}
                className='px-4 py-2 rounded-sm placeholder:capitalize w-full my-2 border 
                    placeholder:text-sm outline-none'
                placeholder={nameKey}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
            />
        </div>
    );
};

export default InputField;