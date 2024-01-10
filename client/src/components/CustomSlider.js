import React, { memo } from 'react';
import Slider from "react-slick";
import { Product } from './'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};
const CustomSlider = ({ products, activedTab }) => {
    return (
        <>
            {products && <Slider {...settings}>
                {products?.map((element, index) => (
                    <Product key={index} productData={element} isNew={activedTab === 'new'} />
                ))}
            </Slider>}
        </>
    );
};

export default memo(CustomSlider);