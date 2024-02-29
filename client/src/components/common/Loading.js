import React, { memo } from 'react'
import { HashLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center'>
            <HashLoader color='#ee3131' />
        </div>
    )
}

export default memo(Loading)