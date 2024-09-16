import React from 'react';

const Avatar = () => {
    return (
        <div className=" flex flex-col justify-center mt-1 items-end pr-8 h-[50px]">
            <div className="flex-row flex space-x-3 cursor-pointer">
                <img
                    src="https://www.w3schools.com/w3images/avatar6.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-3xl h-10"
                />
                <div>
                    <h1 className="font-bold text-sm">Admin</h1>
                    <h1 className="font-medium text-sm">Cao Trùng Dương</h1>
                </div>
            </div>
        </div>
    );
};

export default Avatar;
