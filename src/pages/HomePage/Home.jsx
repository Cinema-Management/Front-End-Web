import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const handleClick = () => {
        toast.success('Hello World !');
    };
    return (
        <div className="bg-red-200 max-h-screen">
            <h1>Home Page1</h1>
            <button className="bg-blue-400" onClick={handleClick}>
                Xin chào
            </button>
        </div>
    );
};

export default Home;
