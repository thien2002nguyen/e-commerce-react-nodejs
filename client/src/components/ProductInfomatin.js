import React, { memo, useEffect, useState } from 'react';
import { productInfoTabs } from '../ultils/contants';

const ProductInfomatin = ({ description }) => {
    const [activedTab, setActivedTab] = useState(1)
    const [isActived, setIsActived] = useState(false)
    useEffect(() => {
        setIsActived(true)
    }, [activedTab])
    const handleActivedTab = (index) => {
        setActivedTab(index)
        setIsActived(false)
    }
    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs.map(element => (
                    <span
                        className={`p-2 cursor-pointer px-4 text-gray-600 
                            ${activedTab === element.id ? 'bg-white border border-b-0' : 'bg-gray-100'}`}
                        key={element.id}
                        onClick={() => handleActivedTab(element.id)}
                    >
                        {element.name}
                    </span>
                ))}
            </div>
            <div className='w-full border min-h-28'>
                <div className={isActived ? 'animate-fade-in' : ''}>
                    {activedTab === 1
                        ?
                        <ul className='text-sm text-gray-700 leading-6 list-square p-4 ps-8'>
                            {description?.map((element, index) => (
                                <li key={index}>{element}</li>
                            ))}
                        </ul>
                        :
                        productInfoTabs.some(element => element.id === activedTab) &&
                        <div className='p-4 text-gray-700'>
                            <h3 className='text-[20px] font-semibold mb-2'>
                                {productInfoTabs.find(element => element.id === activedTab)?.title}
                            </h3>
                            <p className='text-sm'>
                                {productInfoTabs.find(element => element.id === activedTab)?.content}
                            </p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInfomatin);