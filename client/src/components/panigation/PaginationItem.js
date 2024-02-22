import React, { memo } from 'react';
import { createSearchParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const PaginationItem = ({ children }) => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const location = useLocation()
    const handlePagination = () => {
        const queries = Object.fromEntries([...params])
        if (Number(children)) {
            queries.page = children
        }
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString()
        })
        window.scrollTo(0, 0)
    }
    return (
        <button
            className={`w-10 h-10 flex justify-center hover:rounded-full 
            hover:bg-gray-300 ${Number(children) ? 'items-center' : 'items-end pb-2'} 
                ${+params.get('page') === +children && 'bg-gray-300 rounded-full'} 
                ${!+params.get('page') && +children === 1 && 'bg-gray-300 rounded-full'}`}
            type='button'
            onClick={handlePagination}
            disabled={!Number(children)}
        >
            {children}
        </button>
    );
};

export default memo(PaginationItem);