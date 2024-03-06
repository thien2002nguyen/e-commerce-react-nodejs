import React, { memo, useState } from 'react';
import tagRed from 'assets/tag_red.png'
import tagBlue from 'assets/tag_blue.png'
import { renderStartFromNumber, formatMoney } from 'ultils/helpers';
import { QuickView, SelectOption } from 'components'
import icons from 'ultils/icons';
import defaultProduct from 'assets/default-product-image.png'
import DOMPurify from 'dompurify';
import withBaseComponent from 'hocs/withBaseComponent';
import { showModal } from 'store/app/appSlice';
import { apiUpdateCart } from 'apis';
import { toast } from 'react-toastify';
import { getCurrent } from 'store/user/asyncActions';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import path from 'ultils/path';
import { createSearchParams } from 'react-router-dom';

const {
    AiFillEye,
    BsCartPlus,
    IoMdHeart,
    BsFillCartCheckFill
} = icons

const Product = ({ productData, isNew, normal, px, showDescription, navigate, dispatch, location }) => {
    const [isShowOption, setIsShowOption] = useState()
    const [isShow, setIsShow] = useState(false)
    const { current } = useSelector(state => state.user)
    const handleClickOptions = async (e, flag) => {
        e.stopPropagation()
        if (flag === 'CART') {
            if (!current) {
                return Swal.fire({
                    title: 'Oops!',
                    text: 'Please login first',
                    icon: 'info',
                    cancelButtonText: 'Not now',
                    showCancelButton: true,
                    confirmButtonText: 'Go login'

                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate({
                            pathname: `/${path.LOGIN}`,
                            search: createSearchParams({ redirect: location.pathname }).toString()
                        })
                    }
                })
            }
            const response = await apiUpdateCart({
                pid: productData?._id,
                color: productData?.color,
                price: productData?.price,
                thumb: productData?.thumb,
                title: productData?.title
            })
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            }
            else {
                toast.error(response.mes)
            }
        }
        if (flag === 'QUICKVIEW') {
            dispatch(showModal({ isShowModal: true, modalChildren: <QuickView productData={productData} /> }))
        }
        if (flag === 'WISHLIST') {
            console.log('WISHLIST');
        }
    }
    return (
        <div className={`w-full text-base ${px && 'px-[10px]'}`}>
            <div
                className='w-full border p-[15px] flex flex-col items-center'
                onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData._id}/${productData.title}`)}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShow(true)
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                    setIsShow(false)
                }}
            >
                <div className='w-full relative'>
                    {showDescription && isShow && <div className='absolute top-[-11px] left-[-11px] right-[-11px] bottom-0 flex
                        flex-col gap-2 z-10 bg-white animate-fade-in'>
                        <div className='flex justify-between w-full border-b px-4 pt-1 pb-2'>
                            <span className='min-h-12'>{productData?.title}</span>
                            <span className='min-h-12'>{`${formatMoney(productData?.price) || 0} VNĐ`}</span>
                        </div>
                        {productData?.description?.length > 1 && <ul className='text-xs text-gray-500 leading-2 list-square pl-8 pr-4 py-2'>
                            {productData?.description?.map((element, index) => (
                                <li key={index}>{element}</li>
                            ))}
                        </ul>}
                        {productData?.description?.length === 1 && <div
                            className='text-xs text-gray-500 leading-2 p-2 line-clamp-[12]'
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData?.description[0]) }}
                        >
                        </div>}
                    </div>}
                    {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex 
                        justify-center gap-2 animate-slide-top duration-100 z-20'>
                        <span title='Quick view' onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                            <SelectOption icon={<IoMdHeart />} />
                        </span>
                        {current?.cart?.some(element => element.product?._id === productData?._id.toString()) ?
                            <span title='Added to cart' onClick={(e) => handleClickOptions(e)}>
                                <SelectOption icon={<BsFillCartCheckFill />} active />
                            </span> :
                            <span title='Add to cart' onClick={(e) => handleClickOptions(e, 'CART')}>
                                <SelectOption icon={<BsCartPlus />} />
                            </span>
                        }
                        <span title='Add wishlist' onClick={(e) => handleClickOptions(e, 'QUICKVIEW')}>
                            <SelectOption icon={<AiFillEye />} />
                        </span>
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
            </div>
        </div>
    );
};

export default withBaseComponent(memo(Product))