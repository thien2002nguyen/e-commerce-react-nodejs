import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from '../../apis/products';
import { Breadcrumb, Button, CustomSlider, ProductExtraInfoItem, ProductInfomatin, SelectQuantity } from '../../components';
import Slider from "react-slick";
import { formatMoney, renderStartFromNumber } from '../../ultils/helpers'
import icons from '../../ultils/icons';
import DOMPurify from 'dompurify';

const {
    BsShieldShaded,
    RiTruckFill,
    AiFillGift,
    MdReply,
    FaTty,
} = icons

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [currentImage, setCurrentImage] = useState(null)
    const [relatedProducts, setRelatedProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const fetchProductData = async (pid) => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
            setCurrentImage(response.productData?.thumb)
        }
    }
    const fetchProducts = async (category) => {
        const response = await apiGetProducts({ category })
        if (response.success) {
            setRelatedProduct(response.products)
        }
    }
    useEffect(() => {
        if (pid) {
            fetchProductData(pid)
            fetchProducts(category)
        }
        window.scrollTo(0, 0)
    }, [pid, category])
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            setQuantity(1)
        }
        else if (Number(number) > product?.quantity) {
            setQuantity(product?.quantity)
        }
        else {
            setQuantity(number.trim())
        }
    }, [product])
    const handleChangeQuantity = useCallback((flag) => {
        if (quantity === 1 && flag === 'minus') {
            setQuantity(1)
        }
        else if (quantity === product?.quantity && flag === 'plus') {
            setQuantity(product?.quantity)
        }
        else {
            if (flag === 'minus') {
                setQuantity(prev => Number(prev) - 1)
            }
            else {
                setQuantity(prev => Number(prev) + 1)
            }
        }
    }, [quantity, product])
    useEffect(() => {
        if (pid) {
            fetchProductData(pid)
            setUpdate(false)
        }
    }, [update, pid])
    const rerender = useCallback(() => {
        setUpdate(true)
    }, [])
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] mb-2'>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
            <div className='w-main m-auto mt-5 grid grid-cols-5 gap-4 mb-5'>
                <div className='col-span-2 flex flex-col'>
                    <img src={currentImage} alt="product" className='border w-[458px] h-[458px] object-contain' />
                    <div className='w-[466px] mt-4'>
                        <Slider className='detail-slick' {...settings}>
                            {product?.images?.map((element, index) => (
                                <div key={index} className='w-full pr-2'>
                                    <img
                                        onClick={() => setCurrentImage(element)}
                                        src={element}
                                        alt="sub-product"
                                        className='border w-full h-[143px] object-contain cursor-pointer'
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='col-span-2 flex flex-col gap-5'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(product?.price)} VNĐ`}</h2>
                        <span className='text-sm text-main'>{`In stock: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex justify-start items-center'>
                        {renderStartFromNumber(product?.totalRatings, 18)}
                        <span className='text-sm text-main ms-2 italic'>{`Sold: ${product?.sold} pieces`}</span>
                    </div>
                    {product?.description?.length > 1 && <ul className='text-sm text-gray-500 leading-6 list-square pl-4'>
                        {product?.description?.map((element, index) => (
                            <li key={index}>{element}</li>
                        ))}
                    </ul>}
                    {product?.description?.length === 1 && <div
                        className='text-sm text-gray-500 leading-6 px-2 line-clamp-[12]'
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}
                    >
                    </div>}
                    <div className='flex flex-col gap-8'>
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <Button fullWidth>Add to Cart</Button>
                    </div>
                </div>
                <div className='col-span-1 flex flex-col gap-3'>
                    <ProductExtraInfoItem icon={<BsShieldShaded />} title='Guarantee' sub='Quality Checked' />
                    <ProductExtraInfoItem icon={<RiTruckFill />} title='Free Shipping' sub='Free On All Products' />
                    <ProductExtraInfoItem icon={<AiFillGift />} title='Special Gift Cards' sub='Special Gift Cards' />
                    <ProductExtraInfoItem icon={<MdReply />} title='Free Return' sub='Within 7 Days' />
                    <ProductExtraInfoItem icon={<FaTty />} title='Consultancy' sub='Lifetime 24/7/356' />
                </div>
            </div>
            <div className='w-main m-auto mt-8'>
                <ProductInfomatin product={product} rerender={rerender} />
            </div>
            <div className='w-main mx-auto my-8'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-2 border-b-2 border-main'>
                    OTHER CUSTOMERS ALSO BUY:
                </h3>
                <div className='mt-4 mx-[10px] '>
                    <CustomSlider products={relatedProducts} normal />
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;