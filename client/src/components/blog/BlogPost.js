import { apiGetBlogs } from 'apis/blog';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react'
import Slider from 'react-slick';
import icons from 'ultils/icons';
import { months } from 'ultils/contants';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import path from 'ultils/path';

const { IoCalendarOutline } = icons

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const BlogPost = () => {
    const [blogs, setBlogs] = useState(null)
    const fetchGetBlogs = async () => {
        const response = await apiGetBlogs({ page: 1, limit: 5, sort: '-createdAt' })
        if (response.success) {
            setBlogs(response.data)
        }
    }
    useEffect(() => {
        fetchGetBlogs()
    }, [])
    return (
        <div>
            <Slider {...settings}>
                {blogs?.map((element) => (
                    <div key={element._id} className='px-2'>
                        <Link to={`/${path.BLOGS}/${element._id}/${element.title}`}>
                            <img src={element.image} alt="imageBlog" className='w-full' />
                        </Link>
                        <div className='text-center'>
                            <Link
                                to={`/${path.BLOGS}/${element._id}/${element.title}`}
                                className='block p-4 font-semibold min-h-20 hover:text-main duration-100'
                            >{element.title}</Link>
                            <div className='px-4'>
                                <p className='flex justify-center items-center gap-2 text-[13px] text-gray-400'>
                                    <IoCalendarOutline />
                                    <span>
                                        {`${months.find(item => item.code === moment(element.createdAt).format('MM'))?.value} ${moment(element.createdAt).format('DD, YYYY')}`}
                                    </span>
                                </p>
                                <div
                                    className='mt-2 text-[13px] text-gray-600 leading-5 line-clamp-3'
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(element.description) }}
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>

    )
}

export default memo(BlogPost)