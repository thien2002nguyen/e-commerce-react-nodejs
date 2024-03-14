import React, { memo } from 'react';

const SelectOption = ({ icon, active, hover = 'hover:bg-gray-800' }) => {
    return (
        <div
            className={`w-10 h-10 rounded-full border shadow-md flex items-center justify-center 
            cursor-pointer duration-200 ${active ?
                    'bg-gray-800 text-white' :
                    `bg-white ${hover} hover:text-white`}`}
        >
            {icon}
        </div>
    );
};

export default memo(SelectOption);