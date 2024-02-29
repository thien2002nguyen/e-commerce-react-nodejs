import React, { memo } from 'react'

const SelectForm = ({
    label,
    options = [],
    register,
    errors,
    id,
    validate,
    styleSelect,
    fullWidth,
    styleDiv,
    gap = 'gap-2'
}) => {
    return (
        <div className={`flex flex-col ${gap && gap} ${styleDiv && styleDiv}`}>
            {label && <label
                htmlFor={id}
                className='capitalize text-gray-700'
            >{label}</label>}
            <select id={id} {...register(id, validate)}
                className={`p-1 rounded-sm border-2 outline-none 
                ${fullWidth && 'w-full'} ${styleSelect && styleSelect}`}>
                <option value=''>---CHOOSE---</option>
                {options?.map((element, index) => (
                    <option key={index} value={element.code}>{element.value}</option>
                ))}
            </select>
            {errors[id] && <small className='text-main text-[10px]'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(SelectForm)