import { lazy } from 'react';
const Cinema = lazy(() => import('~/pages/CinemaPage/Cinema'));
const Customer = lazy(() => import('~/pages/CustomerPage/Customer'));
const Film = lazy(() => import('~/pages/FilmPage/Film'));
const Food = lazy(() => import('~/pages/FoodPage/Food'));
const Home = lazy(() => import('~/pages/HomePage/Home'));
const Login = lazy(() => import('~/pages/LoginPage/Login'));
const Order = lazy(() => import('~/pages/OrderPage/Order'));
const Price = lazy(() => import('~/pages/PricePage/Price'));
const Promotion = lazy(() => import('~/pages/PromotionPage/Promotion'));
const Room = lazy(() => import('~/pages/RoomPage/Room'));
const Schedule = lazy(() => import('~/pages/SchedulePage/Schedule'));
const Seat = lazy(() => import('~/pages/SeatPage/Seat'));
const Staff = lazy(() => import('~/pages/StaffPage/Staff'));
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
        page: Cinema,
        isShowSidebar: true,
    },
    {
        path: '/food',
        page: Food,
        isShowSidebar: true,
    },
    {
        path: '/film',
        page: Film,
        isShowSidebar: true,
    },
    {
        path: '/staff',
        page: Staff,
        isShowSidebar: true,
    },
    {
        path: '/customer',
        page: Customer,
        isShowSidebar: true,
    },
    {
        path: '/schedule',
        page: Schedule,
        isShowSidebar: true,
    },
    {
        path: '/promotion',
        page: Promotion,
        isShowSidebar: true,
    },
    {
        path: '/price',
        page: Price,
        isShowSidebar: true,
    },
    {
        path: '/seat',
        page: Seat,
        isShowSidebar: true,
    },
    {
        path: '/order',
        page: Order,
        isShowSidebar: true,
    },
    {
        path: '/room',
        page: Room,
        isShowSidebar: true,
    },
    {
        path: '/login',
        page: Login,
    },
    {
        path: '/register',
        page: Register,
    },
    {
        path: '/forgot-password',
        page: ForgotPassword,
    },
];
