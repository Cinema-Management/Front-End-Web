import { lazy } from 'react';
import withAdminCheck from '~/utils/withAdminCheck'; // Đường dẫn import middleware

const Home = lazy(() => import('~/pages/HomePage/Home'));
const Cinema = lazy(() => import('~/pages/CinemaPage/Cinema'));
const Food = lazy(() => import('~/pages/FoodPage/Food'));
const Film = lazy(() => import('~/pages/FilmPage/Film'));
const Staff = lazy(() => import('~/pages/StaffPage/Staff'));
const Customer = lazy(() => import('~/pages/CustomerPage/Customer'));
const Schedule = lazy(() => import('~/pages/SchedulePage/Schedule'));
const Promotion = lazy(() => import('~/pages/PromotionPage/Promotion'));
const Price = lazy(() => import('~/pages/PricePage/Price'));
const Seat = lazy(() => import('~/pages/SeatPage/Seat'));
const Order = lazy(() => import('~/pages/OrderPage/Order'));
const Room = lazy(() => import('~/pages/RoomPage/Room'));
const SaleInvoice = lazy(() => import('~/pages/SaleInvoicePage/SaleInvoice'));
const ReturnInvoice = lazy(() => import('~/pages/ReturnInvoicePage/ReturnInvoice'));
const Login = lazy(() => import('~/pages/LoginPage/Login'));
const Register = lazy(() => import('~/pages/RegisterPage/Register'));
const ForgotPassword = lazy(() => import('~/pages/ForgotPasswordPage/ForgotPassword'));

export const routes = [
    {
        path: '/',
        page: Home,
        isShowSidebar: true,
    },
    {
        path: '/cinema',
        page: withAdminCheck(Cinema), // Áp dụng middleware kiểm tra quyền admin
        isShowSidebar: true,
    },
    {
        path: '/food',
        page: withAdminCheck(Food),
        isShowSidebar: true,
    },
    {
        path: '/film',
        page: withAdminCheck(Film),
        isShowSidebar: true,
    },
    {
        path: '/staff',
        page: withAdminCheck(Staff),
        isShowSidebar: true,
    },
    {
        path: '/customer',
        page: withAdminCheck(Customer),
        isShowSidebar: true,
    },
    {
        path: '/schedule',
        page: withAdminCheck(Schedule),
        isShowSidebar: true,
    },
    {
        path: '/promotion',
        page: withAdminCheck(Promotion),
        isShowSidebar: true,
    },
    {
        path: '/price',
        page: withAdminCheck(Price),
        isShowSidebar: true,
    },
    {
        path: '/seat',
        page: withAdminCheck(Seat),
        isShowSidebar: true,
    },
    {
        path: '/order',
        page: withAdminCheck(Order),
        isShowSidebar: true,
    },
    {
        path: '/room',
        page: withAdminCheck(Room),
        isShowSidebar: true,
    },
    {
        path: '/sale-invoice',
        page: withAdminCheck(SaleInvoice),
        isShowSidebar: true,
    },
    {
        path: '/return-invoice',
        page: withAdminCheck(ReturnInvoice),
        isShowSidebar: true,
    },
    {
        path: '/login',
        page: Login,
        isShowSidebar: false,
    },
    {
        path: '/register',
        page: Register,
        isShowSidebar: false,
    },
    {
        path: '/forgot-password',
        page: ForgotPassword,
        isShowSidebar: false,
    },
];
