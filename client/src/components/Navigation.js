import React from 'react';
import { navigation } from '../ultils/contants'
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className='w-main h-[48px] py-2 border-y mb-6 text-sm flex items-center'>
            {navigation.map((element, index) => (
                <NavLink
                    to={element.path}
                    key={index}
                    className={({ isActive }) => isActive
                        ? 'pr-12 text-main' : 'pr-12 hover:text-main duration-200'}
                >
                    {element.value}
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;