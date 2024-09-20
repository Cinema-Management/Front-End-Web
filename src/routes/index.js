import Cenima from '~/pages/CenimaPage/Cenima';
import Customer from '~/pages/CustomerPage/Customer';
import Film from '~/pages/FilmPage/Film';
import Foood from '~/pages/FoodPage/Food';
import Home from '~/pages/HomePage/Home';
import Login from '~/pages/LoginPage/Login';
import Order from '~/pages/OrderPage/Order';
import Price from '~/pages/PricePage/Price';
import Promotion from '~/pages/PromotionPage/Promotion';
import Resgiter from '~/pages/ResgiterPage/Resgiter';
import Schedule from '~/pages/SchedulePage/Schedule';
import Seat from '~/pages/SeatPage/Seat';
import Staff from '~/pages/StaffPage/Staff';

export const routes = [
    {
        path: '/',
        page: Home,
        isShowSidebar: true,
    },
    {
        path: '/cenima',
        page: Cenima,
        isShowSidebar: true,
    },
    {
        path: '/food',
        page: Foood,
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
        path: '/login',
        page: Login,
    },
    {
        path: '/resgiter',
        page: Resgiter,
    },
];
