import React, { memo } from 'react'

const InputForm = ({
    defaultValue,
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    type = 'text',
    placeholder,
    fullWidth,
    styleDiv,
    styleInput
}) => {
    return (
        <div className={`flex flex-col gap-2 ${styleDiv && styleDiv}`}>
            {label && <label
                htmlFor={id}
                className='capitalize text-gray-800'
            >{label}</label>}
            <input
                type={type}
                id={id}
                defaultValue={defaultValue}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                className={`p-1 rounded-sm placeholder:capitalize border 
                    placeholder:text-sm outline-none ${styleInput && styleInput} ${fullWidth && 'w-full'}`}
            />
            {errors[id] && <small className='text-main text-[10px]'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(InputForm)