import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/LoadingComponent/Loading';
// import {createAxios} from'~/createInstance';
import { loginSuccess } from '~/redux/authSlice';

const Home = () => {



    return (
        <div className="bg-red-200 max-h-screen">
            <h1 className="text-base text-center">Home Page</h1>
            <Loading />
        </div>
    );
};

export default Home;
