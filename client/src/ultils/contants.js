import path from './path'
import icons from './icons';

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQ}`
    }
]

export const productInfoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION'
    },
    {
        id: 2,
        name: 'WARRANTY',
        title: 'WARRANTY INFORMATION',
        content: 'LIMITED WARRANTIES Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:  Frames Used In Upholstered and Leather Products Limited Lifetime Warranty A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers.Ashley Furniture Industries, Inc.warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.'
    },
    {
        id: 3,
        name: 'DELIVERY',
        title: 'PURCHASING & DELIVERY',
        content: 'Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.  Picking up at the store Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises.Our team is happy to open all packages and will assist in the inspection process.We will then reseal packages for safe transport.We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs.Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit.It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition. Delivery  Customers are able to pick the next available delivery day that best fits their schedule.However, to route stops as efficiently as possible, Shopify Shop will provide the time frame.Customers will not be able to choose a time.You will be notified in advance of your scheduled time frame.Please make sure that a responsible adult(18 years or older) will be home at that time. In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc.to prevent damages.Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team.Shopify Shop will deliver, assemble, and set- up your new furniture purchase and remove all packing materials from your home.Our delivery crews are not permitted to move your existing furniture or other household items.Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home.Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs.An elevator must be available for deliveries to the 4th floor and above.'
    },
    {
        id: 4,
        name: 'PAYMENT',
        title: 'PURCHASING & DELIVERY',
        content: 'Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.  Picking up at the store Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises.Our team is happy to open all packages and will assist in the inspection process.We will then reseal packages for safe transport.We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs.Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit.It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition. Delivery  Customers are able to pick the next available delivery day that best fits their schedule.However, to route stops as efficiently as possible, Shopify Shop will provide the time frame.Customers will not be able to choose a time.You will be notified in advance of your scheduled time frame.Please make sure that a responsible adult(18 years or older) will be home at that time. In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc.to prevent damages.Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team.Shopify Shop will deliver, assemble, and set- up your new furniture purchase and remove all packing materials from your home.Our delivery crews are not permitted to move your existing furniture or other household items.Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home.Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs.An elevator must be available for deliveries to the 4th floor and above.'
    },
    {
        id: 5,
        name: 'CUSTOMER REVIEW'
    }
]

export const colors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple'];

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best selling'
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to low'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new'
    },
]

export const VoteOptions = [
    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]

const { AiOutlineDashboard, MdGroups, LiaLayerGroupSolid, RiBillLine, ImExit, AiOutlineLike } = icons

export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard size={20} />
    },
    {
        id: 2,
        type: 'single',
        text: 'Manage users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups size={20} />
    },
    {
        id: 3,
        type: 'parent',
        text: 'Manage products',
        icon: <LiaLayerGroupSolid size={20} />,
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            },
            {
                text: 'Manage products',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`
            }
        ]
    },
    {
        id: 4,
        type: 'single',
        text: 'Manage orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20} />
    },
    {
        id: 5,
        type: 'parent',
        text: 'Manage blogs',
        icon: <AiOutlineLike size={20} />,
        submenu: [
            {
                text: 'Create blog',
                path: `/${path.ADMIN}/${path.CREATE_BLOG}`
            },
            {
                text: 'Manage blogs',
                path: `/${path.ADMIN}/${path.MANAGE_BLOG}`
            }
        ]
    },
    {
        id: 6,
        type: 'single',
        text: 'Exit',
        path: `/${path.HOME}`,
        icon: <ImExit size={20} />
    },
]

export const roles = [
    { code: 'user', value: 'User' },
    { code: 'admin', value: 'Admin' }
]

export const blockStatus = [
    { code: false, value: 'Active' },
    { code: true, value: 'Blocked' }
]

const { MdBroadcastOnPersonal, FaShoppingCart, TbFileLike, MdHistory } = icons

export const memberSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <MdBroadcastOnPersonal size={20} />
    },
    {
        id: 2,
        type: 'single',
        text: 'My cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <FaShoppingCart size={20} />
    },
    {
        id: 3,
        type: 'single',
        text: 'Wish list',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <TbFileLike size={20} />,
    },
    {
        id: 4,
        type: 'single',
        text: 'Buy histories',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <MdHistory size={20} />
    },
    {
        id: 5,
        type: 'single',
        text: 'Exit',
        path: `/${path.HOME}`,
        icon: <ImExit size={20} />
    },
]

const { IoSettingsOutline, IoImageOutline, BsInfoCircleFill } = icons

export const servicesItems = [
    {
        id: 1,
        title: 'Customizable Page',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <IoSettingsOutline size={72} />
    },
    {
        id: 2,
        title: 'Revolution Slider',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <IoImageOutline size={72} />
    },
    {
        id: 3,
        title: 'Drag & Drop Page',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <BsInfoCircleFill size={72} />
    },
    {
        id: 4,
        title: 'Revolution Slider',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <IoImageOutline size={72} />
    },
    {
        id: 5,
        title: 'Drag & Drop Page',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <BsInfoCircleFill size={72} />
    },
    {
        id: 6,
        title: 'Customizable Page',
        text: 'Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora',
        icon: <IoSettingsOutline size={72} />
    }
]

export const FAQQuestions = [
    {
        id: 1,
        question: 'What payment you accept?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 2,
        question: 'In what country can you deliver?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 3,
        question: 'What payments you accept?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 4,
        question: 'How to track my parcel?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 5,
        question: 'How to track my parcel?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 6,
        question: 'Why amadea is the best e-commerce theme?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
]

export const statusOrders = [
    {
        label: 'Cancelled',
        value: 'Cancelled'
    },
    {
        label: 'Processing',
        value: 'Processing'
    },
    {
        label: 'Shipping',
        value: 'Shipping'
    },
    {
        label: 'Successed',
        value: 'Successed'
    }
]

export const paymentOptions = [
    { code: 0, value: 'Thanh toán khi nhận hàng' },
    { code: 1, value: 'Thanh toán online' }
]

export const months = [
    { code: '01', value: 'January' },
    { code: '02', value: 'February' },
    { code: '03', value: 'March' },
    { code: '04', value: 'April' },
    { code: '05', value: 'May' },
    { code: '06', value: 'June' },
    { code: '07', value: 'July' },
    { code: '08', value: 'August' },
    { code: '09', value: 'September' },
    { code: '10', value: 'October' },
    { code: '11', value: 'November' },
    { code: '12', value: 'December' }
]