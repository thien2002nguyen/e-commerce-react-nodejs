import React, { memo } from 'react'

const SelectForm = ({ label, options = [], register, errors, id, validate, style, fullWidth }) => {
    return (
        <div className='flex flex-col gap-2 h-[78px]'>
            {label && <label
                htmlFor={id}
                className='text-[10px] absolute top-0 left-3 block bg-white px-1 capitalize animate-slide-top-sm
                    text-gray-600'
            >{label}</label>}
            <select id={id} {...register(id, validate)}
                className={`p-2 rounded-sm placeholder:capitalize mt-2 border-2 
                    placeholder:text-sm outline-none ${fullWidth && 'w-full'}`}>
                {options?.map((element, index) => (
                    <option key={index} value={element.code}>{element.value}</option>
                ))}
            </select>
            {errors[id] && <small className='text-main text-[10px]'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(SelectForm)