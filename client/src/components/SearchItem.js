import React, { memo, useEffect, useState } from 'react';
import icons from '../ultils/icons';
import { colors } from '../ultils/contants';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { apiGetProducts } from '../apis'
import { formatMoney } from '../ultils/helpers'
import useDebounce from '../hooks/useDebounce'

const { IoIosArrowDown } = icons

const SearchItem = ({ name, activedClick, changeActiveFitler, type = 'checkbox' }) => {
    const [selected, setSelected] = useState([])
    const [bestPrice, setBestPrice] = useState(null)
    const [price, setPrice] = useState({
        from: '',
        to: ''
    })
    const [isPriceFromGreater, setIsPriceFromGreater] = useState(false)
    const { category } = useParams()
    const navigate = useNavigate()
    const handleSelected = (e) => {
        console.log(e?.target.value);
        const alreadyElement = selected.find(element => element === e.target.value)
        if (alreadyElement) {
            setSelected(prev => prev.filter(element => element !== e.target.value))
        }
        else {
            setSelected(prev => [...prev, e.target.value])
        }
    }
    useEffect(() => {
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({
                color: selected.length > 1 ? selected.join(',') : selected
            }).toString()
        })
    }, [selected, category, navigate])
    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 })
        if (response.success) {
            setBestPrice(response.products[0])
        }
    }
    useEffect(() => {
        if (type === 'input') {
            fetchBestPriceProduct()
        }
    }, [type])
    const deboucePriceFrom = useDebounce(price.from, 500)
    const deboucePriceTo = useDebounce(price.to, 500)
    useEffect(() => {
        if (deboucePriceFrom && deboucePriceTo) {
            if (Number(deboucePriceFrom) > Number(deboucePriceTo)) {
                setIsPriceFromGreater(true)
            }
            else {
                setIsPriceFromGreater(false)
            }
        }
    }, [deboucePriceFrom, deboucePriceTo])
    useEffect(() => {
        const data = {}
        if (Number(deboucePriceFrom) > 0) {
            data.from = deboucePriceFrom
        }
        if (Number(deboucePriceTo) > 0) {
            data.to = deboucePriceTo
        }
        if (deboucePriceFrom || deboucePriceTo) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams(data).toString()
            })
        }
        else {
            navigate(`/${category}`)
        }
    }, [deboucePriceFrom, deboucePriceTo, category, navigate])
    return (
        <div
            className={`px-6 py-3 text-sm border border-gray-800 text-gray-600 
                flex justify-between items-center gap-6 relative cursor-pointer
                ${activedClick === name && 'shadow-full-box-1'} hover:shadow-full-box-1`}
            onClick={() => changeActiveFitler(name)}
        >
            <span className='capitalize'>{name}</span>
            <IoIosArrowDown size={14} />
            {activedClick === name && <div
                className='absolute top-[calc(100%+2px)] left-0 w-fit border bg-white min-w-[300px] z-10'
                onClick={e => e.stopPropagation()}
            >
                {type === 'checkbox' &&
                    <div>
                        <div className='flex items-center justify-between px-5 py-6 gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span
                                className='underline text-gray-800 hover:text-gray-600 duration-150'
                                onClick={() => {
                                    setSelected([])
                                    changeActiveFitler(null)
                                }}
                            >
                                Reset
                            </span>
                        </div>
                        <div className='flex flex-col gap-3 p-5'>
                            {colors.map((element, index) => (
                                <div key={index} className='flex items-center gap-4'>
                                    <input
                                        type='checkbox'
                                        name={element}
                                        id={element}
                                        onChange={handleSelected}
                                        value={element}
                                        checked={selected?.some(item => item === element) || false}
                                    />
                                    <label htmlFor={element} className='capitalize text-gray-700'>
                                        {element}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {type === "input" && <div>
                    <div className='flex items-center justify-between px-5 py-6 gap-8 border-b'>
                        <span className='whitespace-nowrap flex flex-col'>
                            <span>The highest price is {formatMoney(bestPrice?.price)} VND</span>
                            <span>Default input value is USD</span>
                        </span>
                        <span
                            className='underline text-gray-800 hover:text-gray-600 duration-150'
                            onClick={() => {
                                setPrice({ from: '', to: '' })
                                changeActiveFitler(null)
                            }}
                        >
                            Reset
                        </span>
                    </div>
                    <div className='flex flex-col gap-2 p-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <label htmlFor="from">From</label>
                                <input
                                    id='from'
                                    type='number'
                                    className='border p-2'
                                    value={price.from}
                                    onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                                />
                            </div>
                            <div className='flex items-center gap-2'>
                                <label htmlFor="to">To</label>
                                <input
                                    id='to'
                                    type='number'
                                    className='border p-2'
                                    value={price.to}
                                    onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                                />
                            </div>
                        </div>
                        {isPriceFromGreater && <span
                            className='text-xs text-main text-end'>
                            From price can not greater than to price
                        </span>}
                    </div>
                </div>}
            </div>}
        </div>
    );
};

export default memo(SearchItem);