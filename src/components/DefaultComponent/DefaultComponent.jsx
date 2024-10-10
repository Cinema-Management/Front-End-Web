import React from 'react';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import Avatar from '../AvatarComponent/Avatar';

const DefaultComponent = ({ children }) => {
    return (
        <div className="m-auto w-full min-h-screen flex overflow-x-hidden">
            <HeaderComponent className="w-1/5" />
            <div className="bg-slate-200 w-5/6 max-h-screen flex flex-col px-4 ">
                <div className="flex-none ">
                    <Avatar />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

export default DefaultComponent;
