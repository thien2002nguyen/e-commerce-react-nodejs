import { Breadcrumb, ServiceItem } from 'components';
import React from 'react';
import serviceImg from 'assets/9069783_orig.png'
import { servicesItems } from 'ultils/contants';
const Services = () => {
    return (
        <div className='w-full m-auto'>
            <div className='h-[81px] bg-gray-100 w-full flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold text-[18px] uppercase mb-2'>Services</h3>
                    <Breadcrumb category={'Services'} />
                </div>
            </div>
            <div className='w-main mx-auto py-6'>
                <div className='flex gap-6'>
                    <img src={serviceImg} alt="services" className='flex-1 w-full' />
                    <div className='flex-1 flex flex-col gap-2 text-gray-600'>
                        <span className='text-sm'>Cras magna tellus, congue vitae congue vel, facilisis id risus. Proin semper in lectus id faucibus. Aenean vitae quam eget mi aliquam viverra quis quis velit.</span>
                        <span className='text-sm'>Curabitur mauris diam, posuere vitae nunc eget, blandit pellentesque mi. Pellentesque placerat nulla at ultricies malesuada. Aenean mi lacus, malesuada at leo vel, blandit iaculis nisl.</span>
                        <span className='text-sm'>Praesent vestibulum nisl sed diam euismod, a auctor neque porta. Vestibulum varius ligula non orci tincidunt rutrum. Suspendisse placerat enim eu est egestas, aliquam venenatis elit accumsan. Donec metus quam, posuere sit amet odio et, ultricies consequat nibh.</span>
                    </div>
                </div>
                <div className='flex flex-col items-center py-12'>
                    <h2 className='text-2xl font-semibold text-gray-600'>We Offer Best Services</h2>
                    <div className='grid grid-cols-3 gap-8 mt-12'>
                        {servicesItems.map((element, index) => (
                            <ServiceItem key={index} icon={element.icon} title={element.title} text={element.text} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;