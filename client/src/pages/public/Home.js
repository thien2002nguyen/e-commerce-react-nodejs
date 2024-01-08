import React from 'react';
import { Sidebar, Banner, BestSeller, DealDaily, FeatureProducts } from '../../components';

const Home = () => {
    return (
        <>
            <div className='w-main flex'>
                <div className='flex flex-col gap-5 w-1/4 flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-3/4 flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='my-8'>
                <FeatureProducts />
            </div>
            <div className='w-full h-96'></div>
        </>
    );
};

export default Home;