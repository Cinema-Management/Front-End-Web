import React from 'react';

const Loading = () => {
    console.log('Loading...');
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <div className="text-lg">Loading...</div>
        </div>
    );
};

export default Loading;
