import React, { memo, useState } from 'react';
import logo from '../assets/logo.png'
import { VoteOptions } from '../ultils/contants';
import icons from '../ultils/icons';
import { Button } from './';

const { AiFillStar } = icons

const VoteOption = ({ product, handleSubmitVoteOption }) => {
    const [chooseScore, setChooseScore] = useState(null)
    const [comment, setComment] = useState('')
    const handleSubmitByEnter = (e) => {
        if (e.code === 'Enter' && chooseScore && comment !== '') {
            handleSubmitVoteOption({ comment, score: chooseScore })
        }
    }
    return (
        <div className='w-full h-screen fixed flex justify-center items-center'>
            <div
                className='bg-white w-[700px] flex justify-center items-center flex-col p-8 gap-4 rounded-lg'
                onClick={e => e.stopPropagation()}
            >
                <img src={logo} alt="logo" className='w-[300px] object-contain' />
                <h2 className='mt-8 text-lg'>{`Voting the product ${product?.title}`}</h2>
                <textarea
                    className='border border-gray-500 w-full p-4 placeholder:text-sm placeholder:text-gray-400
                        rounded-md'
                    placeholder='Type somethings'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => handleSubmitByEnter(e)}
                ></textarea>
                <div className='w-full flex flex-col gap-4'>
                    <p className='font-semibold'>How do you like this product?</p>
                    <div className='flex justify-center gap-4 items-center'>
                        {VoteOptions.map((element, index) => (
                            <div key={index}
                                className='w-24 h-w-24 p-4 bg-gray-200 flex items-center cursor-pointer
                                    justify-center flex-col gap-2 rounded-md hover:bg-gray-300'
                                onClick={() => setChooseScore(element.id)}
                            >
                                <AiFillStar color={chooseScore < element.id ? 'gray' : 'orange'} size={18} />
                                <span className='text-xs text-gray-700'>{element.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <Button
                    handleOnClick={() => handleSubmitVoteOption({ comment, score: chooseScore })}
                    fullWidth
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default memo(VoteOption);