import { lazy } from 'react';
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
        path: '/sale-invoice',
        page: SaleInvoice,
        isShowSidebar: true,
    },
    {
        path: '/return-invoice',
        page: ReturnInvoice,
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
