import React, { memo, useState } from 'react';
import tagRed from 'assets/tag_red.png'
import tagBlue from 'assets/tag_blue.png'
import { renderStartFromNumber, formatMoney } from 'ultils/helpers';
import { SelectOption } from 'components'
import icons from 'ultils/icons';
import { Link } from 'react-router-dom';
import defaultProduct from 'assets/default-product-image.png'

const {
    AiFillEye,
    MdMenu,
    IoMdHeart,
} = icons

const Product = ({ productData, isNew, normal, px }) => {
    const [isShowOption, setIsShowOption] = useState()
    return (
        <div className={`w-full text-base ${px && 'px-[10px]'}`}>
            <Link
                className='w-full border p-[15px] flex flex-col items-center'
                to={`/${productData?.category?.toLowerCase()}/${productData._id}/${productData.title}`}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className='w-full relative'>
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex 
                        justify-center gap-2 animate-slide-top duration-100'>
                        <SelectOption icon={<AiFillEye />} />
                        <SelectOption icon={<MdMenu />} />
                        <SelectOption icon={<IoMdHeart />} />
                    </div>}
                    <div className='flex justify-center'>
                        <img
                            src={productData?.thumb || defaultProduct}
                            alt=""
                            className='w-[274px] h-[274px] object-cover'
                        />
                    </div>
                    {!normal && <>
                        <img src={isNew ? tagRed : tagBlue} alt="" className={`absolute 
                        top-0 right-0 h-[25px] object-cover ${isNew ? 'w-[75px]' : 'w-[100px]'}`} />
                        <span className='absolute top-0 right-4 text-[14px] text-white'>{isNew ? 'New' : 'Trending'}</span>
                    </>}
                </div>
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
                    <span className='flex h-4'>{renderStartFromNumber(productData?.totalRatings)}</span>
                    <span className='line-clamp-1 capitalize'>{productData?.title?.toLowerCase()}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
            </Link>
        </div>
    );
};

export default memo(Product);