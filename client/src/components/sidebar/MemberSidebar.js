import React, { memo, Fragment, useState, useEffect } from 'react'
import defaultAvatar from 'assets/default_avatar.png'
import { memberSidebar } from 'ultils/contants'
import { NavLink } from 'react-router-dom'
import icons from 'ultils/icons'
import { useSelector } from 'react-redux'
const { AiOutlineCaretDown, AiOutlineCaretRight } = icons

const activedStyle = 'px-8 py-2 flex items-center gap-2 bg-blue-500 text-gray-100'
const notActivedStyle = 'px-8 py-2 flex items-center gap-2 hover:bg-blue-100 duration-100'

const MemberSidebar = () => {
    const [actived, setActived] = useState([])
    const { current } = useSelector(state => state.user)
    const handleShowTabs = (tabID) => {
        if (actived.some(element => element === tabID)) {
            setActived(prev => prev.filter(item => item !== tabID))
        }
        else {
            setActived(prev => [...prev, tabID])
        }
    }
    return (
        <div className='bg-white h-full py-4'>
            <div className='flex flex-col justify-center items-center gap-2 py-4'>
                <img src={current?.avatar || defaultAvatar} alt="avater" className='w-16 h-16 object-cover rounded-full' />
                <small className='font-semibold'>{`${current?.lastname} ${current?.firstname}`}</small>
            </div>
            <div>
                {memberSidebar.map(element => (
                    <Fragment key={element.id}>
                        {element.type.toLocaleLowerCase() === 'single' &&
                            <NavLink
                                to={element.path}
                                className={({ isActive }) => isActive ? activedStyle : notActivedStyle}
                            >
                                <span>{element.icon}</span>
                                <span>{element.text}</span>
                            </NavLink>
                        }
                        {element.type.toLocaleLowerCase() === 'parent' &&
                            <div
                                className='flex flex-col'
                                onClick={() => handleShowTabs(+element.id)}
                            >
                                <div className='flex items-center justify-between px-8 py-2 hover:bg-blue-100
                                    cursor-pointer duration-100'>
                                    <div className='flex items-center gap-2'>
                                        <span>{element.icon}</span>
                                        <span>{element.text}</span>
                                    </div>
                                    {actived.some(id => id === element.id) ?
                                        <AiOutlineCaretRight /> :
                                        <AiOutlineCaretDown />}
                                </div>
                                {actived.some(id => id === element.id) && <div className='flex flex-col'>
                                    {element.submenu.map((item, index) => (
                                        <NavLink
                                            to={item.path}
                                            key={index}
                                            onClick={e => e.stopPropagation()}
                                            className={({ isActive }) =>
                                                `${isActive ? activedStyle : notActivedStyle} pl-16 text-sm`}
                                        >
                                            {item.text}
                                        </NavLink>
                                    ))}
                                </div>}
                            </div>
                        }
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(MemberSidebar)