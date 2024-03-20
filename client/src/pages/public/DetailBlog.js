import { apiDislikeBlog, apiGetOneBlogs, apiLikeBlog } from 'apis/blog'
import { Breadcrumb } from 'components'
import DOMPurify from 'dompurify'
import withBaseComponent from 'hocs/withBaseComponent'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { months } from 'ultils/contants'
import icons from 'ultils/icons'
import path from 'ultils/path'

const { BsDot, AiOutlineLike, AiOutlineDislike, FaArrowLeftLong } = icons

const DetailBlog = ({ navigate, location }) => {
    const { current, isLoggedIn } = useSelector(state => state.user)
    const { bid, title } = useParams()
    const [dataBlog, setDataBlog] = useState(null)
    const [update, setUpdate] = useState(false)
    const render = useCallback(() => {
        setUpdate(!update)
        navigate(location.pathname)
    }, [update, navigate, location])
    const fetchBlog = async (bid) => {
        const response = await apiGetOneBlogs(bid)
        if (response.success) {
            setDataBlog(response.data)
        }
    }
    useEffect(() => {
        fetchBlog(bid)
    }, [bid, update])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [bid])
    const handleLikeBlog = async () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Oops!',
                text: 'Please log in to like',
                cancelButtonText: 'Not now',
                confirmButtonText: 'Go login',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        }
        else {
            if (dataBlog?.dislikes?.some(element => element._id === current?._id)) {
                await apiDislikeBlog(bid)
                const response = await apiLikeBlog(bid)
                if (response.success) {
                    render()
                }
            }
            else {
                const response = await apiLikeBlog(bid)
                if (response.success) {
                    render()
                }
            }
        }
    }
    const handleDisLikeBlog = async () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Oops!',
                text: 'Please log in to like',
                cancelButtonText: 'Not now',
                confirmButtonText: 'Go login',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        }
        else {
            if (dataBlog?.likes?.some(element => element._id === current?._id)) {
                await apiLikeBlog(bid)
                const response = await apiDislikeBlog(bid)
                if (response.success) {
                    render()
                }
            }
            else {
                const response = await apiDislikeBlog(bid)
                if (response.success) {
                    render()
                }
            }
        }
    }
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>{title}</h3>
                    <Breadcrumb category={'Blogs'} title={title} />
                </div>
            </div>
            <div className='w-main mx-auto pt-4 pb-12'>
                <div className='flex items-end gap-1 uppercase text-sm py-4 text-gray-600'>
                    <span>{dataBlog?.author}</span>
                    <BsDot size={18} />
                    <span>
                        {`${months.find(item => item.code === moment(dataBlog?.createdAt).format('MM'))?.value} ${moment(dataBlog?.createdAt).format('DD, YYYY')}`}
                    </span>
                    <BsDot size={18} />
                    <span>{`${dataBlog?.likes?.length} likes`}</span>
                    <BsDot size={18} />
                    <span>{`${dataBlog?.numberViews} views`}</span>
                </div>
                <div className='w-full'>
                    <img src={dataBlog?.image} alt="imageBlog" className='object-cover' />
                </div>
                <div
                    className='text-[14px] text-gray-800 leading-6 mt-8'
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dataBlog?.description) }}
                >
                </div>
                <div className='flex justify-end items-center gap-4 mt-4'>
                    <button
                        className={`flex items-center gap-1 px-2 py-1 border
                        ${dataBlog?.likes?.some(element => element._id === current?._id) ?
                                'text-blue-600 border-blue-600' :
                                'text-gray-500'}
                        `}
                        onClick={handleLikeBlog}
                    >
                        <span>Like</span>
                        <AiOutlineLike />
                    </button>
                    <button className={`flex items-center gap-1 px-2 py-1 border
                    ${dataBlog?.dislikes?.some(element => element._id === current?._id) ?
                            'text-blue-600 border-blue-600' :
                            'text-gray-500'}
                        `}
                        onClick={handleDisLikeBlog}
                    >
                        <span>Dislike</span>
                        <AiOutlineDislike />
                    </button>
                </div>
                <div
                    className='flex justify-end items-center mt-4 gap-2 text-sm text-gray-600 hover:text-main 
                        cursor-pointer duration-100'
                    onClick={() => navigate(`/${path.BLOGS}`)}
                >
                    <FaArrowLeftLong />
                    <span>BACK TO BLOGS</span>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(DetailBlog)