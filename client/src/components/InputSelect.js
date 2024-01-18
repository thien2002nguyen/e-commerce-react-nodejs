import React, { memo } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select
            className='text-sm p-3 px-6 text-gray-600 w-full hover:shadow-full-box-1'
            value={value}
            onChange={e => changeValue(e.target.value)}
        >
            <option value="">Featured</option>
            {options?.map((element, index) => (
                <option key={index} value={element.value}>{element.text}</option>
            ))}
        </select>
    );
};

export default memo(InputSelect);