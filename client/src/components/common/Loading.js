import React, { memo } from 'react'
import { HashLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <HashLoader color='#ee3131' />
        </div>
    )
}

export default memo(Loading)