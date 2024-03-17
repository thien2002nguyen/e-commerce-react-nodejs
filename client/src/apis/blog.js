import axios from '../axios';

export const apiGetBlogCategories = () => axios({
    url: '/blogcategory',
    method: 'get'
})

export const apiCreateBlog = (data) => axios({
    url: '/blog',
    method: 'post',
    data
})

export const apiGetBlogs = (params) => axios({
    url: '/blog',
    method: 'get',
    params
})

export const apiGetOneBlogs = (bid) => axios({
    url: '/blog/one/' + bid,
    method: 'get',
})

export const apiLikeBlog = (bid) => axios({
    url: '/blog/like/' + bid,
    method: 'put',
})

export const apiDislikeBlog = (bid) => axios({
    url: '/blog/dislike/' + bid,
    method: 'put',
})

export const apiUpdateBlog = (data, bid) => axios({
    url: '/blog/' + bid,
    method: 'put',
    data
})

export const apiDeleteBlog = (bid) => axios({
    url: '/blog/' + bid,
    method: 'delete',
})