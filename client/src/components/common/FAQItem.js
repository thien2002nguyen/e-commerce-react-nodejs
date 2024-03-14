import React, { memo } from 'react'
import icons from 'ultils/icons'

const { RiSubtractFill, FaPlus } = icons

const FAQItem = ({ index, question, answer, isShowAnswer, setShowAnswer, removeShowAnswer }) => {
    return (
        <div className='flex flex-col'>
            <div className={`px-4 py-3 flex justify-between border text-gray-800 ${isShowAnswer && 'bg-main text-white'}`}>
                <span>{`${index + 1}. ${question}`}</span>
                {isShowAnswer ?
                    <span onClick={removeShowAnswer}><RiSubtractFill /></span> :
                    <span onClick={setShowAnswer}><FaPlus /></span>
                }
            </div>
            {isShowAnswer && <span className='px-6 py-4 border text-sm text-gray-600'>{answer}</span>}
        </div>
    )
}

export default memo(FAQItem)