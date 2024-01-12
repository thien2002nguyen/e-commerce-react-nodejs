import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct } from '../../apis/products';
import { Breadcrumb, Button, SelectQuantity } from '../../components';
import Slider from "react-slick";
import { formatMoney, renderStartFromNumber } from '../../ultils/helpers'

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const fetchProductData = async (pid) => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
        }
    }
    useEffect(() => {
        if (pid) {
            fetchProductData(pid)
        }
    }, [pid])
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            setQuantity(1)
        }
        else {
            setQuantity(number)
        }
    }, [])
    const handleChangeQuantity = useCallback((flag) => {
        if (quantity === 1 && flag === 'minus') {
            return
        }
        else {
            if (flag === 'minus') {
                setQuantity(prev => +prev - 1)
            }
            else {
                setQuantity(prev => +prev + 1)
            }
        }
    }, [quantity])
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
            <div className='w-main m-auto mt-5 grid grid-cols-5 gap-4 mb-5'>
                <div className='col-span-2 flex flex-col'>
                    <img src={product?.thumb} alt="product" className='border w-[458px] h-[458px] object-contain' />
                    <div className='w-[466px] h-[143px] mt-4'>
                        <Slider className='detail-slick' {...settings}>
                            {product?.images?.map((element, index) => (
                                <div key={index} className='w-full pe-2'>
                                    <img
                                        src={element}
                                        alt="sub-product"
                                        className='border w-full h-[143px] object-contain'
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='col-span-2 flex flex-col gap-5'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(product?.price)} VNĐ`}</h2>
                        <span className='text-sm text-main'>{`Kho: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex justify-start items-center'>
                        {renderStartFromNumber(product?.totalRatings, 18)}
                        <span className='text-sm text-main ms-2 italic'>{`Đã bán: ${product?.sold}`}</span>
                    </div>
                    <ul className='text-sm text-gray-500 leading-6 list-square ps-4'>
                        {product?.description?.map((element, index) => (
                            <li key={index}>{element}</li>
                        ))}
                    </ul>
                    <div className='flex flex-col gap-8'>
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <Button fullWidth>Add to Cart</Button>
                    </div>
                </div>
                <div className='col-span-1 border'>information</div>
            </div>
        </div>
    );
};

export default DetailProduct;