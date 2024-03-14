import React, { memo, useCallback, useEffect, useState } from 'react';
import icons from 'ultils/icons'
import { apiGetProducts } from 'apis/products'
import { renderStartFromNumber, formatMoney, secondsToHsm } from 'ultils/helpers';
import { CountDown } from 'components'
import moment from 'moment'
import withBaseComponent from 'hocs/withBaseComponent';
import { useSelector } from 'react-redux';
import { getDealDaily } from 'store/products/productSlice';

const { AiFillStar, MdMenu } = icons
let idInterval

const DealDaily = ({ navigate, dispatch }) => {
    const { dealDaily } = useSelector(state => state.products)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const fetchDealDaily = useCallback(async () => {
        const response = await apiGetProducts({ limit: 1, page: Math.round(Math.random() * 7), sort: '-totalRatings' })
        if (response.success) {
            const today = Date.now()
            const newTime = new Date(today)
            const resetHours = newTime.setHours(0, 0, 0, 0)
            dispatch(getDealDaily({ data: response.products[0], time: resetHours + 24 * 3600 * 1000 }))
        }
    }, [dispatch])
    useEffect(() => {
        if (dealDaily?.time) {
            const time = dealDaily.time - Date.now()
            const number = secondsToHsm(time)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
    }, [dealDaily])
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        const fetchData = async () => {
            await fetchDealDaily()
        }
        if (moment(dealDaily?.time).isBefore(moment())) {
            fetchData()
        }
    }, [expireTime, fetchDealDaily, dealDaily])
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
                    src={dealDaily?.data?.thumb ||
                        'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                    alt=""
                    className='w-full object-contain'
                />
                <span className='line-clamp-1 capitalize'>
                    {dealDaily?.data?.title?.toLowerCase() || 'product coming soon'}
                </span>
                <span className='flex h-4'>{renderStartFromNumber(dealDaily?.data?.totalRatings, 20)}</span>
                <span className='h-4'>{dealDaily?.data?.price && `$${formatMoney(dealDaily?.data?.price)} USD`}</span>
            </div>
            <div className='px-4 mt-8'>
                <div className='flex justify-center gap-2 items-center mb-4'>
                    <CountDown unit='Hours' number={hour} />
                    <CountDown unit='Minutes' number={minute} />
                    <CountDown unit='Seconds' number={second} />
                </div>
                <button
                    type='button'
                    className='flex gap-2 justify-center items-center w-full bg-main
                        hover:bg-gray-800 text-white font-medium py-2 duration-200'
                    onClick={() => navigate(`/${dealDaily?.data?.category?.toLowerCase()}/${dealDaily?.data._id}/${dealDaily?.data.title}`)}
                >
                    <MdMenu />
                    <span>Options</span>
                </button>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(DealDaily));