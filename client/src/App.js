import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import {
  Login,
  Home,
  Public,
  DetailProduct,
  Blogs,
  Services,
  FAQ,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart,
  Checkout,
  DetailBlog,
} from './pages/public'
import {
  AdminLayout,
  ManageOrder,
  ManageUser,
  ManageProducts,
  CreateProduct,
  Dashboard,
} from './pages/admin';
import {
  History,
  MemberLayout,
  MyCart,
  Personal,
  Wishlist,
} from './pages/member';
import path from './ultils/path'
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from './components';
import icon from 'assets/icon.gif'
import logo from 'assets/logo.png'
import ManageBlog from 'pages/admin/ManageBlog';
import CreateBlog from 'pages/admin/CreateBlog';

function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  return (
    <>
      <div className="min-h-screen font-main relative laptop:block hidden">
        {/* The project was written by Nguyen Canh Thien */}
        {isShowModal && <Modal>{modalChildren}</Modal>}
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.PRODUCTS_CATEGORY} element={<Products />} />
            <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
            <Route path={path.BLOGS} element={<Blogs />} />
            <Route path={path.OUR_SERVICES} element={<Services />} />
            <Route path={path.FAQ} element={<FAQ />} />
            <Route path={path.ALL} element={<Home />} />
            <Route path={path.DETAIL_CART} element={<DetailCart />} />
            <Route path={path.DETAIL_BLOGS} element={<DetailBlog />} />
          </Route>
          <Route path={path.ADMIN} element={<AdminLayout />}>
            <Route path={path.DASHBOARD} element={<Dashboard />} />
            <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
            <Route path={path.MANAGE_USER} element={<ManageUser />} />
            <Route path={path.MANAGE_PRODUCT} element={<ManageProducts />} />
            <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
            <Route path={path.MANAGE_BLOG} element={<ManageBlog />} />
            <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
          </Route>
          <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.MY_CART} element={<MyCart />} />
            <Route path={path.HISTORY} element={<History />} />
            <Route path={path.WISHLIST} element={<Wishlist />} />
          </Route>
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.CHECKOUT} element={<Checkout />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
      </div>
      <div className='laptop:hidden flex justify-center items-center w-screen h-screen gap-4'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-4xl font-semibold text-main'>Oops!</span>
          <span className='text-xl text-gray-600'>
            Currently, the website only provides frame interfaces of 1440px or higher
          </span>
          <img src={logo} alt="logo" />
        </div>
        <div className='filter saturate-200'>
          <img src={icon} alt="icon" />
        </div>
      </div>
    </>
  );
}

export default App;
