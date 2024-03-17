import React, { memo } from 'react';
import { NavLink } from 'react-router-dom'
import { createSlug } from 'ultils/helpers'
import { useSelector } from 'react-redux';
import icons from 'ultils/icons';

const {
    IoIosTabletPortrait,
    SlScreenSmartphone,
    CiHeadphones,
    AiOutlineLaptop,
    CiSpeaker,
    PiPrinterLight,
    PiTelevisionLight
} = icons

const Sidebar = () => {
    const { categories } = useSelector(state => state.app)
    return (
        <div className='flex flex-col border'>
            {categories?.map((element, index) => (
                <NavLink
                    key={index}
                    to={createSlug(element.title)}
                    className={({ isActive }) => isActive ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm' :
                        'px-5 pt-[15px] pb-[14px] text-sm hover:text-main flex gap-2'}
                >
                    {element.title?.toLowerCase() === 'tablet' && <IoIosTabletPortrait size={18} />}
                    {element.title?.toLowerCase() === 'smartphone' && <SlScreenSmartphone size={18} />}
                    {element.title?.toLowerCase() === 'accessories' && <CiHeadphones size={18} />}
                    {element.title?.toLowerCase() === 'laptop' && <AiOutlineLaptop size={18} />}
                    {element.title?.toLowerCase() === 'speaker' && <CiHeadphones size={18} />}
                    {element.title?.toLowerCase() === 'camera' && <CiSpeaker size={18} />}
                    {element.title?.toLowerCase() === 'printer' && <PiPrinterLight size={18} />}
                    {element.title?.toLowerCase() === 'television' && <PiTelevisionLight size={18} />}
                    <span>{element.title}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default memo(Sidebar);