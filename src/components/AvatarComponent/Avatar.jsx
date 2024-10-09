import React from 'react';
import { Tooltip, Button } from 'antd';
import { IoIosLogOut } from 'react-icons/io';
import { MdLockReset } from 'react-icons/md';
const Avatar = () => {
    const handleLogout = () => {
        console.log('Logging out...');
    };

    const handleChangePassword = () => {
        console.log('Changing password...');
    };

    return (
        <div className="flex flex-col justify-center mt-1 items-end h-[50px] pr-4 custom-nest-hub-max1 max-lg:pr-24">
            <Tooltip
                title={
                    <div className="bg-white w-[180px] p-2 ">
                        <Button
                            type="primary"
                            onClick={handleChangePassword}
                            style={{
                                width: '100%',
                                marginBottom: '8px',
                                color: 'black',
                                fontWeight: 500,
                                fontSize: '15px',
                            }}
                        >
                            <MdLockReset color="black" size={25} />
                            Đổi mật khẩu
                        </Button>

                        <Button
                            type="primary"
                            onClick={handleLogout}
                            danger
                            style={{ width: '100%', color: 'black', fontWeight: 500, fontSize: '15px' }}
                        >
                            <IoIosLogOut color="black" size={25} /> Đăng xuất
                        </Button>
                    </div>
                }
                placement="bottom"
                overlayInnerStyle={{ padding: '0' }}
            >
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
            </Tooltip>
        </div>
    );
};

export default Avatar;
