import Cenima from '~/pages/CenimaPage/Cenima';
import Film from '~/pages/FilmPage/Film';
import Home from '~/pages/HomePage/Home';
import Login from '~/pages/LoginPage/Login';
import Product from '~/pages/ProductPage/Product';
import Resgiter from '~/pages/ResgiterPage/Resgiter';

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
        path: '/products',
        page: Product,
        isShowSidebar: true,
    },
    {
        path: 'login',
        page: Login,
    },
    {
        path: 'resgiter',
        page: Resgiter,
    },
    {
        path: 'film',
        page: Film,
        isShowSidebar: true,
    },
];
