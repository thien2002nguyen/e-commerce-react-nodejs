import React, { memo } from 'react';
import slide3 from 'assets/slideshow3-home2_1920x.png'
import slide4 from 'assets/slide4.jpg'
import slide5 from 'assets/E-Commerce-Slide-5.jpg'
import Slider from 'react-slick';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false
};

const Banner = () => {
    return (
        <div className='w-full pb-2'>
            <Slider {...settings}>
                <img src={slide3}
                    alt="slide"
                    className='h-[400px] w-full object-cover'
                />
                <img src={slide4}
                    alt="slide"
                    className='h-[400px] w-full object-cover'
                />
                <img src={slide5}
                    alt="slide"
                    className='h-[400px] w-full object-cover'
                />
            </Slider>
        </div>
    );
};

export default memo(Banner);