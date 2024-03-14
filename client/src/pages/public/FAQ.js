import { Breadcrumb } from 'components';
import { FQAItem } from "components";
import React, { useState } from 'react';
import { FAQQuestions } from 'ultils/contants';

const FAQ = () => {
    const [showAnswer, setShowAnswer] = useState([])
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>FAQ</h3>
                    <Breadcrumb category={'FAQ'} />
                </div>
            </div>
            <div className='w-main mx-auto pt-4 pb-12 flex flex-col gap-6'>
                {FAQQuestions.map((element, index) => (
                    <FQAItem
                        key={index}
                        index={index}
                        question={element.question}
                        answer={element.answer}
                        isShowAnswer={showAnswer.some((value => value === element.id))}
                        setShowAnswer={() => setShowAnswer([...showAnswer, element.id])}
                        removeShowAnswer={() => setShowAnswer([...showAnswer.filter((value => value !== element.id))])}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;