import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from 'store/app/appSlice';

const Modal = ({ children }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const body = document.querySelector('body');
        body.style.overflow = children ? 'hidden' : 'auto';
        return () => {
            body.style.overflow = 'auto';
        };
    }, [children]);
    return (
        <div
            onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
            className='fixed z-50 inset-0 bg-opacity-75 bg-black'
        >
            {children}
        </div>
    );
};

export default memo(Modal);
