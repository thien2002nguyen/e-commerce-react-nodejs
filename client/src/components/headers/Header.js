import React, { Fragment, memo, useEffect, useState } from 'react';
import logo from 'assets/logo.png'
import icons from 'ultils/icons'
import { Link } from 'react-router-dom';
import path from 'ultils/path'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'store/user/userSlice';

const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle, RiAdminLine, MdBroadcastOnPersonal, ImExit } = icons
const Header = () => {
    const { current } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [isShowOption, setIsShowOption] = useState(false)
    useEffect(() => {
        const handleClickOutOptions = (e) => {
            const profile = document.getElementById('profile')
            if (!profile?.contains(e.target)) {
                setIsShowOption(false)
            }
        }
        document.addEventListener('click', handleClickOutOptions)
        return () => {
            document.removeEventListener('click', handleClickOutOptions)
        }
    }, [])
    return (
        <div className='w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}><img src={logo} alt="" className='w-[234px] object-contain' /></Link>
            <div className='flex text-[13px]'>
                <div className='flex flex-col px-6 border-r items-center'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className='flex flex-col px-6 items-center'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold'>SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {current && <Fragment>
                    <div className='cursor-pointer flex items-center px-6 border-l justify-center gap-2'>
                        <BsHandbagFill color='red' />
                        <span>0 item(s)</span>
                    </div>
                    <div
                        className='cursor-pointer flex items-center border-l px-6 justify-center gap-2 relative'
                        onClick={(e) => setIsShowOption(prev => !prev)}
                        id='profile'
                    >
                        <FaUserCircle color='red' />
                        <span>Profile</span>
                        {isShowOption && <div
                            className='absolute top-[calc(100%+5px)] left-6 bg-gray-100 w-[180px] border flex flex-col z-10'
                            onClick={e => e.stopPropagation()}
                        >
                            <Link
                                className='p-2 w-full hover:bg-gray-200 border flex items-center gap-2'
                                to={`/${path.MEMBER}/${path.PERSONAL}`}
                            >
                                <MdBroadcastOnPersonal />
                                <span className='capitalize'>Personal</span>
                            </Link>
                            {current?.role?.toLowerCase() === 'admin' && <Link
                                className='p-2 w-full hover:bg-gray-200 border flex items-center gap-2'
                                to={`/${path.ADMIN}/${path.DASHBOARD}`}
                            >
                                <RiAdminLine />
                                <span className='capitalize'>Admin workspace</span>
                            </Link>}
                            <span
                                className='p-2 w-full hover:bg-gray-200 border flex items-center gap-2'
                                onClick={() => dispatch(logout())}
                            >
                                <ImExit />
                                <span className='capitalize'>Logout</span>
                            </span>
                        </div>}
                    </div>
                </Fragment>}
            </div>
        </div>
    );
};

export default memo(Header);