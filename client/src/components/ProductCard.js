import React from 'react';
import { renderStartFromNumber, formatMoney } from '../ultils/helpers';

const ProductCard = ({ price, totalRatings, title, image }) => {
    return (
        <div className='w-full border flex'>
            <img src={image} alt="products" className='w-[120px] object-contain p-4' />
            <div className='flex flex-col gap-1 mt-[15px] items-start w-full text-xs'>
                <span className='line-clamp-1 capitalize'>{title?.toLowerCase()}</span>
                <span className='flex h-4'>{renderStartFromNumber(totalRatings)}</span>
                <span>{`${formatMoney(price)} VNĐ`}</span>
            </div>
        </div>
    );
};

export default ProductCard;