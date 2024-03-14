import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import Select from 'react-select'

const CustomSelect = ({
    label,
    placeholder,
    onChange,
    options = [],
    value,
    styleDiv = 'w-full',
    navigate,
    location
}) => {
    const handleOnchange = (selectValue) => {
        if (selectValue) {
            onChange(selectValue)
        }
        else {
            navigate(location.pathname)
        }
    }
    return (
        <div className={styleDiv}>
            {label && <span className='font-medium'>{label}</span>}
            <Select
                placeholder={placeholder}
                options={options}
                isSearchable
                isClearable
                value={value}
                onChange={selectValue => handleOnchange(selectValue)}
                formatOptionLabel={options =>
                    <div className='flex text-black items-center gap-2'>
                        <span>{options.label}</span>
                    </div>
                }
            />
        </div>
    )
}

export default withBaseComponent(memo(CustomSelect))