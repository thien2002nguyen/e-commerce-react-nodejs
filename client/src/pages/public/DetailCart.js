import { Breadcrumb, InfoCart } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'

const DetailCart = () => {
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] mb-2'>My Cart</h3>
                    <Breadcrumb category={'My Cart'} />
                </div>
            </div>
            <div className='w-main m-auto'>
                <InfoCart />
            </div>
        </div>
    )
}

export default withBaseComponent(DetailCart)