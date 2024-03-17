import { apiGetBlogs } from 'apis/blog';
import { Breadcrumb, Pagination } from 'components';
import DOMPurify from 'dompurify';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import icons from 'ultils/icons';
import serviceImg from 'assets/9069783_orig.png'
import { months } from 'ultils/contants';
import path from 'ultils/path';

const { FaArrowRightLong, BsDot } = icons

const Blogs = () => {
    const [blogs, setBlogs] = useState(null)
    const [newBlogs, setnewBlogs] = useState(null)
    const [counts, setCounts] = useState(null)
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const fetchGetNewBlogs = async () => {
        const response = await apiGetBlogs({ limit: 3, sort: '-createdAt' })
        if (response.success) {
            setnewBlogs(response.data)
        }
    }
    useEffect(() => {
        fetchGetNewBlogs()
    }, [])
    const fetchGetBlogs = async (queries) => {
        const response = await apiGetBlogs({ ...queries, limit: +process.env.REACT_APP_BLOG, sort: '-createdAt' })
        if (response.success) {
            setBlogs(response.data)
            setCounts(response.counts)
        }
    }
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        fetchGetBlogs(queries)
        window.scrollTo(0, 0)
    }, [params])
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>Blogs</h3>
                    <Breadcrumb category={'Blogs'} />
                </div>
            </div>
            <div className='grid grid-cols-8 w-main mx-auto mt-4 mb-20'>
                <div className='col-span-6 pr-4'>
                    <div className='flex flex-col gap-16'>
                        {blogs?.map((element, index) => (
                            <div key={index} className='flex gap-4'
                                onClick={() => navigate(`/${path.BLOGS}/${element._id}/${element.title}`)}
                            >
                                <Link to={`/${path.BLOGS}/${element._id}/${element.title}`}>
                                    <img
                                        src={element.image}
                                        alt="imageBlog"
                                        className='max-w-[420px] max-h-[280px] object-contain'
                                    />
                                </Link>
                                <div className='flex flex-col gap-2'>
                                    <Link
                                        to={`/${path.BLOGS}/${element._id}/${element.title}`}
                                        className='text-[18px] uppercase font-semibold hover:text-main duration-100'
                                    >{element.title}</Link>
                                    <div className='flex items-end text-[13px] text-gray-400 gap-1'>
                                        <span>{element.author}</span>
                                        <BsDot size={18} />
                                        <span>
                                            {`${months.find(item => item.code === moment(element.createdAt).format('MM'))?.value} ${moment(element.createdAt).format('DD, YYYY')}`}
                                        </span>
                                    </div>
                                    <div
                                        className='text-[14px] text-gray-800 leading-5 line-clamp-[7]'
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(element.description) }}
                                    >
                                    </div>
                                    <Link
                                        to={`/${path.BLOGS}/${element._id}/${element.title}`}
                                        className='flex items-center gap-2 text-sm text-main 
                                        hover:text-gray-800 duration-100'>
                                        <span>Read More</span>
                                        <FaArrowRightLong />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='w-full mx-auto p-4 flex justify-center'>
                        <Pagination totalCount={counts} limit={+process.env.REACT_APP_BLOG} type='blogs' />
                    </div>
                </div>
                <div className='col-span-2'>
                    <div className='text-[18px] px-4 py-3 bg-main font-semibold text-white'>RECENT ARTICLES</div>
                    <div className='px-4 py-6 flex flex-col gap-6 border'>
                        {newBlogs?.map((element, index) => (
                            <div key={index}>
                                <div className='flex flex-col gap-2'>
                                    <Link
                                        to={`/${path.BLOGS}/${element._id}/${element.title}`}
                                        className='capitalize font-medium text-[14px] hover:text-main duration-100'>
                                        {element.title?.toLowerCase()}
                                    </Link>
                                    <span className='text-[13px] text-gray-400'>
                                        {`${months.find(item => item.code === moment(element.createdAt).format('MM'))?.value} ${moment(element.createdAt).format('DD, YYYY - hh:mma')}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-6'>
                        <img src={serviceImg} alt="services" className='flex-1 w-full' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogs;