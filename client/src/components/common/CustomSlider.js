import React, { memo } from 'react';
import Slider from "react-slick";
import { Product } from 'components'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};
const CustomSlider = ({ products, activedTab, normal, px, showDescription = false }) => {
    return (
        <>
            {products && <Slider {...settings}>
                {products?.map((element) => (
                    <Product key={element._id} productData={element} isNew={activedTab === 'new'} normal={normal} px={px} showDescription={showDescription} />
                ))}
            </Slider>}
        </>
    );
};

export default memo(CustomSlider);