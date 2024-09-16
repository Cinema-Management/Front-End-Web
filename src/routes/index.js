import Cenima from '~/pages/CenimaPage/Cenima';
import Customer from '~/pages/CustomerPage/Customer';
import Film from '~/pages/FilmPage/Film';
import Foood from '~/pages/FoodPage/Food';
import Home from '~/pages/HomePage/Home';
import Login from '~/pages/LoginPage/Login';
import Resgiter from '~/pages/ResgiterPage/Resgiter';
import Schedule from '~/pages/SchedulePage/Schedule';
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
        path: '/login',
        page: Login,
    },
    {
        path: '/resgiter',
        page: Resgiter,
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
];
