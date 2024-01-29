import React, { memo, useState } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
    const [activedClick, setActivedClick] = useState(false)
    return (
        <select
            className={`border border-gray-800 text-sm p-3 px-6 text-gray-600 w-full outline-none
                hover:shadow-full-box-1 cursor-pointer ${activedClick && 'shadow-full-box-1'}`}
            value={value}
            onChange={e => changeValue(e.target.value)}
            onFocus={() => setActivedClick(true)}
            onBlur={() => setActivedClick(false)}
        >
            <option value="">Featured</option>
            {options?.map((element, index) => (
                <option key={index} value={element.value}>{element.text}</option>
            ))}
        </select>
    );
};

export default memo(InputSelect);