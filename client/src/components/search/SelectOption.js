import React, { memo } from 'react';

const SelectOption = ({ icon, active }) => {
    return (
        <div
            className={`w-10 h-10 rounded-full border shadow-md flex items-center justify-center 
            cursor-pointer duration-200 ${active ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-800 hover:text-white'}`}
        >
            {icon}
        </div>
    );
};

export default memo(SelectOption);