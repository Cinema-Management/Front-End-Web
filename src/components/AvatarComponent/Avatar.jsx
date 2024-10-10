import React, { useEffect } from 'react';
import { Popover, Button } from 'antd';
import { IoIosLogOut } from 'react-icons/io';
import { MdLockReset } from 'react-icons/md';
import { logOut } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/createInstance';
import { loginSuccess } from '~/redux/authSlice';

const Avatar = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        if (!user || !user.accessToken) navigate('/login');
    }, [user, navigate]);

    const handleLogout = () => {
        logOut(dispatch, navigate, user?.accessToken, axiosJWT);
    };

    const handleChangePassword = () => {
        console.log('Changing password...');
    };

    const popoverContent = (
        <div className="bg-white w-[180px] p-2">
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
    );

    return (
        <div className="flex flex-col justify-center mt-1 items-end h-[50px] pr-4 custom-nest-hub-max1 max-lg:pr-24">
            <Popover
                content={popoverContent}
                trigger="click"
                placement="bottom"
                overlayInnerStyle={{ padding: '0' }}
                destroyTooltipOnHide={true}
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
                        <h1 className="font-bold text-sm">{user?.isAdmin === false ? 'Nhân viên' : 'Quản lý'}</h1>
                        <h1 className="font-medium text-sm">{user?.name}</h1>
                    </div>
                </div>
            </Popover>
        </div>
    );
});

export default Avatar;
