import React, { memo, useEffect, useState } from 'react';
import icons from '../ultils/icons'
import { apiGetProducts } from '../apis/products'
import { renderStartFromNumber, formatMoney, secondsToHsm } from '../ultils/helpers';
import { CountDown } from './'
import moment from 'moment'

const { AiFillStar, MdMenu } = icons
let idInterval

const DealDaily = () => {
    const [dealDaily, setDealDaily] = useState()
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ limit: 1, page: Math.round(Math.random() * 7), totalRatings: 5 })
        if (response.success) {
            setDealDaily(response.products[0])
            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`
            const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000
            const number = secondsToHsm(seconds)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
        else {
            setHour(0)
            setMinute(59)
            setSecond(59)
        }
    }
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily()
    }, [expireTime])
    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) {
                setSecond(prev => prev - 1)
            }
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                }
                else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    }
                    else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [hour, minute, second, expireTime])
    return (
        <div className='border w-full flex-auto'>
            <div className='flex items-center justify-center p-4 w-full'>
                <span className='flex-1 flex justify-center'><AiFillStar size={20} color='#dd1111' /></span>
                <span className='flex-8 font-semibold text-[20px] flex justify-center
                    text-gray-600'
                >
                    DEAL DAILY
                </span>
                <span className='flex-1'></span>
            </div>
            <div className='w-full flex flex-col items-center pt-8 px-4 gap-2'>
                <img
                    src={dealDaily?.thumb ||
                        'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                    alt=""
                    className='w-full object-contain'
                />
                <span className='line-clamp-1 capitalize'>{dealDaily?.title?.toLowerCase()}</span>
                <span className='flex h-4'>{renderStartFromNumber(dealDaily?.totalRatings, 20)}</span>
                <span>{`${formatMoney(dealDaily?.price)} VNĐ`}</span>
            </div>
            <div className='px-4 mt-8'>
                <div className='flex justify-center gap-2 items-center mb-4'>
                    <CountDown unit={'Hours'} number={hour} />
                    <CountDown unit={'Minutes'} number={minute} />
                    <CountDown unit={'Seconds'} number={second} />
                </div>
                <button
                    type='button'
                    className='flex gap-2 justify-center items-center w-full bg-main
                        hover:bg-gray-800 text-white font-medium py-2 duration-200'
                >
                    <MdMenu />
                    <span>Options</span>
                </button>
            </div>
        </div>
    );
};

export default memo(DealDaily);