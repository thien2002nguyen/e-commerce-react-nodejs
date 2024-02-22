import React, { useCallback, useEffect, useState } from 'react';
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'apis/user';
import moment from 'moment';
import { Button, InputField, InputForm, Pagination, SelectForm } from 'components';
import useDebounce from 'hooks/useDebounce'
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { blockStatus, roles } from 'ultils/contants';

const ManageUser = () => {
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
        const queries = Object.fromEntries([...params])
        if (queriesDebounce) {
            queries.search = queriesDebounce
        }
        fetchUsers(queries)
    }, [queriesDebounce, params, update])
    const handleUpdate = async (data) => {
        console.log(data);
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
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-semibold px-4 border-b'>
                <span className='capitalize'>Manage user</span>
            </h1>
            <div className='w-full p-4'>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className='flex justify-end py-4 w-full'>
                        <InputField
                            nameKey={'search'}
                            value={queries.search}
                            setValue={setQueries}
                            convertStyle={'w-[500px]'}
                            convertPlaceholder={'Search email or name user...'}
                            isHideLabel
                        />
                    </div>
                    {editElement && <Button type='submit'>Update</Button>}
                    <table className='table-auto mb-6 text-left w-full whitespace-nowrap'>
                        <thead className='font-semibold bg-gray-600 text-white text-[13px]'>
                            <tr className='border border-gray-500'>
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
                                <tr key={index} className='border border-gray-500'>
                                    <td className='p-2'>{index + 1}</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.email}
                                                register={register}
                                                errors={errors}
                                                id={'email'}
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                }}
                                                fullWidth
                                            /> : <span>{element.email}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.firstname}
                                                register={register}
                                                errors={errors}
                                                id={'firstname'}
                                                validate={{ required: 'Require fill' }}
                                                fullWidth
                                            /> : <span>{element.firstname}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.lastname}
                                                register={register}
                                                errors={errors}
                                                id={'lastname'}
                                                validate={{ required: 'Require fill' }}
                                                fullWidth
                                            /> : <span>{element.lastname}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <SelectForm
                                                defaultValue={editElement?.role}
                                                register={register}
                                                errors={errors}
                                                id={'role'}
                                                validate={{ required: true }}
                                                options={roles}
                                                fullWidth
                                            /> : <span>{element.role}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <InputForm
                                                defaultValue={editElement?.phone}
                                                register={register}
                                                errors={errors}
                                                id={'phone'}
                                                validate={{
                                                    required: 'Require fill',
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: "Invalid phone number"
                                                    }
                                                }}
                                                fullWidth
                                            /> : <span>{element.phone}</span>
                                    }</td>
                                    <td className='p-2'>{
                                        editElement?._id === element._id ?
                                            <SelectForm
                                                defaultValue={editElement?.isBlocked}
                                                register={register}
                                                errors={errors}
                                                id={'isBlocked'}
                                                validate={{ required: true }}
                                                options={blockStatus}
                                                fullWidth
                                            /> : <span>{element.isBlocked ? 'Blocked' : 'Active'}</span>
                                    }</td>
                                    <td className='p-2'>{moment(element.createdAt).format('DD-MM-YYYY')}</td>
                                    <td className='p-2'>
                                        {editElement?._id === element?._id ? <span
                                            className='text-orange-500 hover:underline cursor-pointer'
                                            onClick={() => setEditElement(null)}
                                        >
                                            Back
                                        </span> :
                                            <span
                                                className='text-orange-500 hover:underline cursor-pointer'
                                                onClick={() => setEditElement(element)}
                                            >
                                                Edit
                                            </span>}
                                        <span
                                            className='px-2 text-orange-500 hover:underline cursor-pointer'
                                            onClick={(e) => handleDeleteUser(element._id)}
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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