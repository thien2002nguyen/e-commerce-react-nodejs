import React, { memo } from 'react';
import { NavLink } from 'react-router-dom'
import { createSlug } from 'ultils/helpers'
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { categories } = useSelector(state => state.app)
    return (
        <div className='flex flex-col border'>
            {categories?.map((element, index) => (
                <NavLink
                    key={index}
                    to={createSlug(element.title)}
                    className={({ isActive }) => isActive ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm' :
                        'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >
                    {element.title}
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Sidebar);