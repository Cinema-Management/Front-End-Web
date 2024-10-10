import React from 'react';
import Loading from '~/components/LoadingComponent/Loading';

const Home = () => {
    return (
        <div className="max-h-screen">
            <h1 className="text-base text-center">Home Page</h1>
            <Loading />
        </div>
    );
};

export default Home;
