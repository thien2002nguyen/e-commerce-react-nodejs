import React, { memo } from 'react';

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    return (
        <div className='flex items-center'>
            <span className='text-sm font-semibold me-4'>Quantity</span>
            <button className='p-2 bg-gray-100' onClick={() => handleChangeQuantity('minus')}>-</button>
            <input
                className='py-2 px-2 border-x border-gray-600 outline-none w-16 text-center bg-gray-100'
                type="text"
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
            />
            <button className='p-2 bg-gray-100' onClick={() => handleChangeQuantity('plus')}>+</button>
        </div>
    );
};

export default memo(SelectQuantity);