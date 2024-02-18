import React, { memo } from 'react';
import icons from 'ultils/icons'

const { MdEmail } = icons

const Footer = () => {
    return (
        <div className='w-full'>
            <div className='h-[103px] bg-main flex justify-center items-center'>
                <div className='w-main flex justify-between items-center'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>SIGN UP TO NEWSLETTER</span>
                        <small className='text-[13px] text-gray-300'>
                            Subscribe now and receive weekly newsletter
                        </small>
                    </div>
                    <div className='flex-1 flex items-center'>
                        <input
                            type="text"
                            placeholder='Email address'
                            className='py-4 pl-4 rounded-l-full w-full bg-[#f04646] outline-none
                            text-gray-100 placeholder:text-xs placeholder:text-gray-100 placeholder:opacity-50'
                        />
                        <div className='w-14 h-14 bg-[#f04646] rounded-r-full flex justify-center items-center text-gray-100'>
                            <MdEmail size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[407px] bg-[#191919] flex justify-center items-center text-[#f6f6f6]'>
                <div className='w-main flex'>
                    <div className='flex-2 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 
                            border-main pl-[15px]'
                        >
                            ABOUT US
                        </h3>
                        <span className='text-[13px]'>
                            <span>Address: </span>
                            <span className='opacity-70'>474 Ontario St Toronto, ON M4X 1M7 Canada</span>
                        </span>
                        <span className='text-[13px]'>
                            <span>Phone: </span>
                            <span className='opacity-70'>(+1234)56789xxx</span>
                        </span>
                        <span className='text-[13px]'>
                            <span>Mail: </span>
                            <span className='opacity-70'>tadathemes@gmail.com</span>
                        </span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 
                            border-main pl-[15px]'
                        >
                            INFORMATION
                        </h3>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Typography
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Gallery
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Store Location
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Today's Deals
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Contact
                        </span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 
                            border-main pl-[15px]'
                        >
                            WHO WE ARE
                        </h3>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Help
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            FAQs
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Return & Exchange
                        </span>
                        <span className='opacity-70 hover:opacity-100 duration-150 cursor-pointer text-[13px]'>
                            Testimonials
                        </span>
                    </div>
                    <div className='flex-1'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 
                            border-main pl-[15px]'
                        >
                            #DIGITALWORLDSTORE
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Footer);