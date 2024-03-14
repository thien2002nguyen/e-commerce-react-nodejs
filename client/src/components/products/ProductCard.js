import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react';
import { renderStartFromNumber, formatMoney } from 'ultils/helpers';

const ProductCard = ({ productData, navigate }) => {
    return (
        <div
            className='w-full border flex cursor-pointer'
            onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData._id}/${productData.title}`)}
        >
            <img src={productData.thumb} alt="products" className='w-[120px] object-contain p-4' />
            <div className='flex flex-col gap-1 p-4 items-start w-full text-xs'>
                <span className='line-clamp-1 capitalize hover:text-main duration-150'>
                    {productData.title?.toLowerCase()}
                </span>
                <span className='flex h-4'>{renderStartFromNumber(productData.totalRatings)}</span>
                <span>{`$${formatMoney(productData.price)} USD`}</span>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(ProductCard))