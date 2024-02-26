import React, { memo, Fragment, useState } from 'react'
import logo from 'assets/logo.png'
import { adminSidebar } from 'ultils/contants'
import { Link, NavLink } from 'react-router-dom'
import icons from 'ultils/icons'
import path from 'ultils/path'
const { AiOutlineCaretDown, AiOutlineCaretRight } = icons

const activedStyle = 'px-8 py-2 flex items-center gap-2 bg-blue-500 text-gray-100'
const notActivedStyle = 'px-8 py-2 flex items-center gap-2 hover:bg-blue-100 duration-100'

const AdminSidebar = () => {
    const [actived, setActived] = useState([])
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
            <Link to={`/${path.HOME}`} className='flex flex-col items-center gap-2 py-4'>
                <img src={logo} alt="logo" className='w-[200px] object-contain' />
                <small className='font-semibold'>Admin Workspace</small>
            </Link>
            <div>
                {adminSidebar.map(element => (
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

export default memo(AdminSidebar)