import React, { memo, useCallback, useEffect, useState } from 'react';
import { productInfoTabs } from '../ultils/contants';
import { Button, Comment, VoteBar, VoteOption } from './';
import { renderStartFromNumber } from '../ultils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../store/app/appSlice'
import { apiRatings } from '../apis';
import Swal from 'sweetalert2'
import path from '../ultils/path';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductInfomatin = ({ product, rerender }) => {
    const [activedTab, setActivedTab] = useState(1)
    const [isActived, setIsActived] = useState(false)
    const { isLoggedIn } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        setIsActived(true)
    }, [activedTab])
    const handleActivedTab = (index) => {
        setActivedTab(index)
        setIsActived(false)
    }
    const handleSubmitVoteOption = useCallback(async ({ score, comment }) => {
        if (!score || !comment || !product?._id) {
            toast.info('Please vote before pressing submit')
            return
        }
        await apiRatings({ star: score, comment: comment, pid: product?._id, updatedAt: Date.now() })
        toast.success('Voting successful')
        rerender()
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
    }, [product, rerender, dispatch])
    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Oops!',
                text: 'Go login to vote',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go login',
                showCancelButton: true
            }).then((res) => {
                if (res.isConfirmed) {
                    navigate(`/${path.LOGIN}`)
                }
            })
        }
        else {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <VoteOption
                    product={product}
                    handleSubmitVoteOption={handleSubmitVoteOption}
                />
            }))
        }
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
                    {activedTab === 1 &&
                        <ul className='text-sm text-gray-700 leading-6 list-square p-4 ps-8'>
                            {product?.description?.map((element, index) => (
                                <li key={index}>{element}</li>
                            ))}
                        </ul>}
                    {activedTab !== 1 && activedTab !== 5 &&
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
                    {activedTab === 5 &&
                        <div>
                            <div className='flex border p-4 mx-8 my-4'>
                                <div className='flex-4 flex flex-col items-center justify-center'>
                                    <span className='text-3xl font-semibold'>{`${product?.totalRatings}/5`}</span>
                                    <span className='flex items-center gap-1'>
                                        {renderStartFromNumber(product?.totalRatings)?.map((element, index) => (
                                            <span key={index}>{element}</span>
                                        ))}
                                    </span>
                                    <span
                                        className='text-sm'>{`${product?.ratings?.length} reviewers and commentors`}
                                    </span>
                                </div>
                                <div className='flex-6 flex flex-col gap-2 p-4'>
                                    {Array.from(Array(5).keys()).reverse().map((element, index) => (
                                        <VoteBar
                                            key={index}
                                            number={element + 1}
                                            ratingCount={product?.ratings?.length}
                                            ratingTotal={product?.ratings?.filter(item => item.star === element + 1)?.length}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-center items-center p-4 text-sm flex-col gap-2'>
                                <span>Do you review this product?</span>
                                <Button
                                    handleOnClick={handleVoteNow}
                                >
                                    Vote now
                                </Button>
                            </div>
                            <div className='w-full'>
                                {product?.ratings?.map((element, index) => (
                                    <Comment
                                        key={index}
                                        star={element.star}
                                        updatedAt={element.updatedAt}
                                        comment={element.comment}
                                        name={`${element.postedBy?.lastname} ${element.postedBy?.firstname}`}
                                    />
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInfomatin);