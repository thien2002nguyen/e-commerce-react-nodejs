import { apiDeleteBlog, apiGetBlogCategories, apiGetBlogs } from 'apis/blog'
import { Button } from 'components'
import InputForm from 'components/inputs/InputForm'
import Pagination from 'components/panigation/Pagination'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import path from 'ultils/path'
import icons from 'ultils/icons'
import useDebounce from 'hooks/useDebounce'
import { UpdateBlog } from 'components'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const { FaEdit, RiDeleteBin5Fill } = icons

const ManageBlog = () => {
    const [params] = useSearchParams()
    const { register, formState: { errors }, watch } = useForm()
    const [blogs, setBlogs] = useState(null)
    const [blogCate, setBlogCate] = useState(null)
    const [counts, setCounts] = useState(0)
    const [update, setUpdate] = useState(false)
    const [editBlog, setEditBlog] = useState(null)
    const fetchBlogCategories = async () => {
        const response = await apiGetBlogCategories()
        if (response.success) {
            setBlogCate(response.data)
        }
    }
    useEffect(() => {
        fetchBlogCategories()
    }, [])
    const navigate = useNavigate()
    const render = useCallback(() => {
        setUpdate(!update)
        navigate(`/${path.ADMIN}/${path.MANAGE_BLOG}`)
    }, [update, navigate])
    const fetchGetBlogs = async (params) => {
        const response = await apiGetBlogs({ ...params, limit: process.env.REACT_APP_LIMIT, sort: '-createdAt' })
        if (response.success) {
            setBlogs(response.data)
            setCounts(response.counts)
        }
    }
    const queriesDebounce = useDebounce(watch('search'), 800)
    useEffect(() => {
        navigate(`/${path.ADMIN}/${path.MANAGE_BLOG}`)
    }, [queriesDebounce, navigate])
    useEffect(() => {
        const queries = Object.fromEntries([...params])
        if (queriesDebounce) {
            queries.search = queriesDebounce
        }
        else {
            delete queries.search
        }
        fetchGetBlogs(queries)
    }, [params, queriesDebounce, update])
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [editBlog])
    const handleDeleteBlog = (bid) => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Are you ready remove this blog',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteBlog(bid)
                if (response.success) {
                    render()
                    toast.success(response.mes)
                }
                else {
                    toast.error(response.mes)
                }
            }
        })
    }
    return (
        <div className='w-full'>
            {editBlog && <div className='bg-gray-100'>
                <UpdateBlog
                    editBlog={editBlog}
                    render={render}
                    setEditBlog={setEditBlog}
                    blogCate={blogCate}
                />
            </div>}
            {!editBlog && <div className='w-full'>
                <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center 
                    justify-between bg-gray-100 z-10'>
                    <h1 className='text-3xl font-semibold'>
                        <span className='capitalize'>Manage blogs</span>
                    </h1>
                </div>
                <div className='w-full px-4 pt-[92px] pb-4'>
                    <div className='flex justify-end py-4 w-full'>
                        <InputForm
                            id='search'
                            register={register}
                            errors={errors}
                            fullWidth
                            styleDiv='w-[500px]'
                            styleInput='px-4 py-2'
                            placeholder='Search blogs by title, category,...'
                        />
                    </div>
                    <table className='table-auto text-left w-full whitespace-nowrap'>
                        <thead className='font-semibold bg-blue-700 text-white text-[13px]'>
                            <tr className='border border-blue-600'>
                                <th className='p-2'>#</th>
                                <th className='p-2'>Title</th>
                                <th className='p-2'>Category</th>
                                <th className='p-2 text-center'>Number Views</th>
                                <th className='p-2 text-center'>Number Likes</th>
                                <th className='p-2 text-center'>Number Dislikes</th>
                                <th className='p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs?.map((element, index) => (
                                <tr key={index} className='border border-blue-600'>
                                    <td className='p-2'>
                                        {((params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}
                                    </td>
                                    <td className='p-2'>{
                                        element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title
                                    }</td>
                                    <td className='p-2'>
                                        {element.category?.length > 30 ? element.category?.slice(0, 20) + '...' : element.category}
                                    </td>
                                    <td className='p-2 text-center'>
                                        {element.numberViews}
                                    </td>
                                    <td className='p-2 text-center'>{element.likes?.length}</td>
                                    <td className='p-2 text-center'>{element.dislikes?.length}</td>
                                    <td className='p-2'>
                                        <div className='flex gap-2'>
                                            <Button
                                                bg='bg-green-600'
                                                hover='hover:bg-green-500'
                                                handleOnClick={() => setEditBlog(element)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                handleOnClick={() => handleDeleteBlog(element._id)}
                                            >
                                                <RiDeleteBin5Fill />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='w-full pb-4'>
                    <Pagination
                        totalCount={counts}
                    />
                </div>
            </div>}
        </div>
    )
}

export default ManageBlog