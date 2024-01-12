import React from 'react';
import { Sidebar, Banner, BestSeller, DealDaily, FeatureProducts, CustomSlider } from '../../components';
import { useSelector } from 'react-redux';
import icons from '../../ultils/icons';

const { IoIosArrowForward } = icons

const Home = () => {
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    // const { isLoggedIn, current } = useSelector(state => state.user)
    // console.log({ isLoggedIn, current });
    return (
        <div className='w-main mx-auto'>
            <div className='w-full flex mt-4'>
                <div className='flex flex-col gap-5 w-1/4 flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-3/4 flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='w-full my-8'>
                <FeatureProducts />
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    NEW ARRIVALS
                </h3>
                <div className='mt-4 mx-[-10px] '>
                    <CustomSlider products={newProducts} activedTab={'new'} />
                </div>
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    HOT COLLECTIONS
                </h3>
                <div className='grid grid-cols-3 gap-4 mt-4'>
                    {categories?.filter(element => element.brand.length > 0)?.map((element, index) => (
                        <div key={index} className='border flex p-4 gap-4'>
                            <img src={element.image} alt="" className='flex-1 object-contain 
                                w-[144px] h-[129px]' />
                            <div className='flex-1'>
                                <h4 className='font-semibold uppercase text-gray-700'>{element.title}</h4>
                                <ul className='text-sm'>
                                    {element.brand?.map((item, index) => (
                                        <li key={index} className='flex gap-2 justify-start items-center
                                            text-gray-500 hover:text-red-600 duration-150 cursor-pointer'>
                                            <IoIosArrowForward />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    BLOG POSTS
                </h3>
            </div>
        </div>
    );
};

export default Home;