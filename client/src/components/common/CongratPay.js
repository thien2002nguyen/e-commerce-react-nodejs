import React, { memo } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Button from 'components/buttons/Button'
import withBaseComponent from 'hocs/withBaseComponent'
import icons from 'ultils/icons'
import path from 'ultils/path'
import paymentSuccess from 'assets/payment-success.svg'
import { showModal } from 'store/app/appSlice'

const { BsHandbagFill } = icons

const CongratPay = ({ navigate, dispatch }) => {
    const { width, height } = useWindowSize()
    return (
        <div className='w-screen h-screen relative' onClick={e => e.stopPropagation()}>
            <div className='absolute w-screen h-screen inset-0 z-20 flex justify-center items-center'>
                <div className='bg-white p-4 rounded-md flex flex-col gap-6'>
                    <div className='flex flex-col items-center gap-6'>
                        <span className='text-2xl text-gray-600 font-medium'>Payment Success</span>
                        <img src={paymentSuccess} alt="paymentSuccess" className='w-48 h-48' />
                    </div>
                    <Button
                        handleOnClick={() => {
                            navigate(`/${path.PRODUCTS}`)
                            dispatch(showModal({ isShowModal: false, modalChildren: null }))
                        }}
                        bg='bg-green-600'
                        hover='hover:bg-green-500'
                        customStyle='flex items-center gap-2'
                    >
                        <span>Continue shopping now</span>
                        <BsHandbagFill />
                    </Button>
                </div>
            </div>
            <div className='absolute inset-0 z-10'>
                <Confetti
                    width={width}
                    height={height}
                />
            </div>
        </div>
    )
}

export default withBaseComponent(memo(CongratPay))