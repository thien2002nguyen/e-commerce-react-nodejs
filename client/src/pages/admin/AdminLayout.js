import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import path from 'ultils/path';
import { useSelector } from 'react-redux';
import { AdminSidebar } from 'components';

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current || current.role !== 'admin') {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />
    }
    return (
        <div className='w-full bg-gray-100 min-h-screen relative text-gray-700'>
            <div className='fixed w-[327px] top-0 bottom-0'>
                <AdminSidebar />
            </div>
            <div className='pl-[327px] min-h-screen'>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;