import React from 'react';
import icon from 'assets/icon.gif'
import logo from 'assets/logo.png'

const Dashboard = () => {
    return (
        <div className='w-full min-h-screen flex justify-center items-center'>
            <div className='flex flex-col items-center gap-2'>
                <span className='text-2xl'>Dashboard</span>
                <img src={logo} alt="logo" />
            </div>
            <div className='filter saturate-200'>
                <img src={icon} alt="icon" />
            </div>
        </div>
    );
};

export default Dashboard;