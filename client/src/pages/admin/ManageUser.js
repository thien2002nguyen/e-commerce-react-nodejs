import React, { useCallback, useEffect, useState } from 'react';
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis/user';
import moment from 'moment';
import { Button, InputField, InputForm, Pagination, SelectForm } from 'components';
import useDebounce from 'hooks/useDebounce'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { blockStatus, roles } from 'ultils/contants';
import icons from 'ultils/icons'
import path from 'ultils/path';

const { FaEdit, RiDeleteBin5Fill, MdOutlineTransitEnterexit, GrDocumentUpdate } = icons

const ManageUser = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        phone: '',
        isBlocked: '',
    })
    const [dataUsers, setDataUsers] = useState(null)
    const [queries, setQueries] = useState({
        search: ''
    })
    const [params] = useSearchParams()
    const [editElement, setEditElement] = useState(null)
    const [update, setUpdate] = useState(false)
    const fetchUsers = async (params) => {
        const response = await apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT })
        if (response.success) {
            setDataUsers(response)
        }
    }
    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])
    const queriesDebounce = useDebounce(queries.search, 800)
    useEffect(() => {
        navigate(`/${path.ADMIN}/${path.MANAGE_USER}`)
    }, [queriesDebounce, navigate])
    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        if (queriesDebounce.length > 0) {
            searchParams.search = queriesDebounce
        }
        else {
            delete searchParams.search
        }
        fetchUsers(searchParams)
    }, [queriesDebounce, params, update])
    const handleUpdate = async (data) => {
        const response = await apiUpdateUser(data, editElement?._id)
        if (response.success) {
            setEditElement(null)
            render()
            toast.success(response.mes)
        }
        else {
            toast.error(response.mes)
        }
    }
    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Are you ready remove this user',
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid)
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
    useEffect(() => {
        if (editElement) {
            reset({
                email: editElement.email,
                firstname: editElement.firstname,
                lastname: editElement.lastname,
                role: editElement.role,
                phone: editElement.phone,
                isBlocked: editElement.isBlocked,
            })
        }
    }, [editElement, reset])
    return (
        <div className='w-full'>
            <div className='h-[75px] fixed top-0 left-[327px] right-0 px-4 border-b flex items-center justify-between bg-gray-100 z-50'>
                <h1 className='text-3xl font-semibold'>
                    <span className='capitalize'>Manage Users</span>
                </h1>
            </div>
            <div className='w-full px-4 pt-[92px] pb-4'>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className='flex justify-end py-4 w-full'>
                        <InputField
                            nameKey='search'
                            value={queries.search}
                            setValue={setQueries}
                            convertStyle='w-[500px]'
                            convertPlaceholder='Search email or name user...'
                            isHideLabel
                        />
                    </div>
                    <table className='table-auto mb-6 text-left w-full whitespace-nowrap'>
                        <thead className='font-semibold bg-blue-700 text-white text-[13px]'>
                            <tr className='border border-blue-600'>
                                <th className='p-2'>#</th>
                                <th className='p-2'>Email address</th>
                                <th className='p-2'>Firstname</th>
                                <th className='p-2'>Lastname</th>
                                <th className='p-2'>Role</th>
                                <th className='p-2'>Phone</th>
                                <th className='p-2'>Status</th>
                                <th className='p-2'>Created at</th>
                                <th className='p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUsers?.users?.map((element, index) => (
                                <tr key={index} className='border border-blue-600'>
                                    <td className='p-2'>{((params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.email}
                                                register={register}
                                                errors={errors}
                                                id='email'
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                }}
                                                fullWidth
                                                styleDiv='h-16'
                                                placeholder='Enter email'
                                                styleInput='text-sm placeholder:text-xs'
                                            /> : <span>{element.email}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.firstname}
                                                register={register}
                                                errors={errors}
                                                id='firstname'
                                                validate={{ required: 'Require fill' }}
                                                fullWidth
                                                styleDiv='h-16'
                                                placeholder='Enter first name'
                                                styleInput='text-sm placeholder:text-xs'
                                            /> : <span>{element.firstname}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.lastname}
                                                register={register}
                                                errors={errors}
                                                id='lastname'
                                                validate={{ required: 'Require fill' }}
                                                fullWidth
                                                styleDiv='h-16'
                                                placeholder='Enter last name'
                                                styleInput='text-sm placeholder:text-xs'
                                            /> : <span>{element.lastname}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <SelectForm
                                                defaultValue={editElement?.role}
                                                register={register}
                                                errors={errors}
                                                id='role'
                                                validate={{ required: 'Require fill' }}
                                                options={roles}
                                                fullWidth
                                                styleDiv='h-16'
                                                styleSelect='text-sm'
                                            /> : <span className='capitalize'>{element.role}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.phone}
                                                register={register}
                                                errors={errors}
                                                id='phone'
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Invalid phone number"
                                                    }
                                                }}
                                                fullWidth
                                                styleDiv='h-16'
                                                placeholder='Enter phone'
                                                styleInput='text-sm placeholder:text-xs'
                                            /> : <span>{element.phone}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <SelectForm
                                                defaultValue={editElement?.isBlocked}
                                                register={register}
                                                errors={errors}
                                                id='isBlocked'
                                                validate={{ required: 'Require fill' }}
                                                options={blockStatus}
                                                fullWidth
                                                styleDiv='h-16'
                                                styleSelect='text-sm'
                                            /> : <span>{element.isBlocked ? 'Blocked' : 'Active'}</span>
                                    }</td>
                                    <td className='p-2'>{moment(element.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='p-2 flex gap-2'>
                                        {editElement?._id === element?._id ? <Button
                                            handleOnClick={() => setEditElement(null)}
                                            bg='bg-gray-600'
                                            hover='hover:bg-gray-500'
                                        >
                                            <MdOutlineTransitEnterexit />
                                        </Button> :
                                            <Button
                                                handleOnClick={() => setEditElement(element)}
                                                bg='bg-yellow-600'
                                                hover='hover:bg-yellow-500'
                                            >
                                                <FaEdit />
                                            </Button>}
                                        <Button
                                            handleOnClick={() => handleDeleteUser(element._id)}
                                        >
                                            <RiDeleteBin5Fill />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editElement && <Button
                        type='submit'
                        customStyle='flex items-center gap-2'
                        bg='bg-green-600'
                        hover='hover:bg-green-500'
                    >
                        <span className='text-sm'>Update</span>
                        <GrDocumentUpdate />
                    </Button>}
                </form>
            </div>
            <div className='w-full'>
                <Pagination
                    totalCount={dataUsers?.counts}
                    type='users'
                />
            </div>
        </div>
    );
};

export default ManageUser;