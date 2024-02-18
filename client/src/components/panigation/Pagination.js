import React, { memo } from 'react';
import usePagination from 'hooks/usePagination';
import PaginationItem from './PaginationItem';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams()
    const pagination = usePagination(totalCount, +params.get('page' || 1))
    const range = () => {
        const currentPage = +params.get('page')
        const pageSize = +process.env.REACT_APP_PRODUCT_LIMIT || 10
        const start = ((currentPage - 1) * pageSize) + 1
        const end = Math.min(currentPage * pageSize, totalCount)
        return `${start} - ${end}`
    }
    return (
        <div className='flex w-main justify-center items-center flex-col gap-2'>
            {totalCount > 0 && <span>
                {!params.get('page') &&
                    <span className='text-sm font-semibold'>
                        {`Show products 1 - ${Math.min(+process.env.REACT_APP_PRODUCT_LIMIT || 10, totalCount)} of ${totalCount}`}
                    </span>}
                {params.get('page') &&
                    <span className='text-sm font-semibold'>
                        {`Show products ${range()} of ${totalCount}`}
                    </span>}
            </span>}
            <div className='flex items-center gap-2' >
                {pagination?.map((element, index) => (
                    <PaginationItem key={index}>
                        {element}
                    </PaginationItem>
                ))}
            </div>
        </div>
    );
};

export default memo(Pagination);