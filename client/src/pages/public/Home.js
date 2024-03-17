import React from 'react';
import { Sidebar, Banner, BestSeller, DealDaily, FeatureProducts, CustomSlider, BlogPost } from 'components';
import { useSelector } from 'react-redux';
import icons from 'ultils/icons';
import defaultProduct from 'assets/default-product-image.png'
import { createSearchParams, useNavigate } from 'react-router-dom';

const { IoIosArrowForward } = icons

const Home = () => {
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    const navigate = useNavigate()
    return (
        <div className='w-full mx-auto'>
            <div className='w-main mx-auto flex mt-4'>
                <div className='flex flex-col gap-5 w-1/4 flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-3/4 flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='w-main mx-auto my-8'>
                <FeatureProducts />
            </div>
            <div className='my-8 w-main mx-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    NEW ARRIVALS
                </h3>
                <div className='mt-4 mx-[-10px] '>
                    <CustomSlider products={newProducts} activedTab='new' px showDescription={true} />
                </div>
            </div>
            <div className='my-8 w-main mx-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    HOT COLLECTIONS
                </h3>
                <div className='grid grid-cols-3 gap-4 mt-4'>
                    {categories?.filter(element => element.brand.length > 0)?.map((element, index) => (
                        <div key={index} className='border flex p-4 gap-4'>
                            <img src={element.image || defaultProduct} alt="" className='flex-1 object-contain 
                                w-[144px] h-[129px]' />
                            <div className='flex-1'>
                                <h4 className='font-semibold uppercase text-gray-700'>{element.title}</h4>
                                <ul className='text-sm'>
                                    {element.brand?.map((item, index) => (
                                        <li
                                            key={index}
                                            className='flex gap-2 justify-start items-center
                                            text-gray-500 hover:text-red-600 duration-150 cursor-pointer'
                                            onClick={() => {
                                                navigate({
                                                    pathname: `/${element.title}`,
                                                    search: createSearchParams({ brand: item }).toString()
                                                })
                                                window.scrollTo(0, 0);
                                            }}
                                        >
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
                <h3 className='text-[20px] w-main mx-auto font-semibold py-[15px] pb-4 border-b-2 border-main'>
                    BLOG POSTS
                </h3>
                <div className='w-[1196px] mt-4 mx-auto'>
                    <BlogPost />
                </div>
            </div>
        </div>
    );
};

export default Home;