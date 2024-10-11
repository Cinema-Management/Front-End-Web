import { Button } from 'antd';
import React from 'react';
import { FaRegEdit, FaShieldAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getFormatteNgay } from '~/utils/dateUtils';
const Home = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    return (
        <div className="bg-white  min-h-[97%] rounded-[10px] p-3 ">
            <div className="text-[16px]">
                <h1 className="text-[20px] font-bold">Thông tin cá nhân</h1>
                <div className="mt-3 flex custom-ipad">
                    <div className="">
                        <img src={user?.avatar} alt="avatar" className="object-contain w-[300px] " />
                    </div>
                    <div className="ml-5 w-[60%] custom-ipad1 flex flex-wrap">
                        <div className="w-1/3 p-2">
                            <div className=" ">
                                <h1 className="font-bold">Mã nhân viên: </h1>
                                <h1 className="font-medium">{user?.code}</h1>
                            </div>
                        </div>
                        <div className="w-2/3 p-2">
                            <div className=" ">
                                <h1 className="font-bold">Họ và tên:</h1>
                                <h1 className="font-medium">{user?.name}</h1>
                            </div>
                        </div>
                        <div className="w-1/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Năm sinh: </h1>
                                <h1 className="font-medium">{getFormatteNgay(user?.birthDate)}</h1>
                            </div>
                        </div>
                        <div className="w-2/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Giới tính: </h1>
                                <h1 className="font-medium">{user?.gender}</h1>
                            </div>
                        </div>
                        <div className="w-1/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Số điện thoại: </h1>
                                <h1 className="font-medium">{user?.phone}</h1>
                            </div>
                        </div>
                        <div className="w-2/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Email: </h1>
                                <h1 className="font-medium">{user?.email}</h1>
                            </div>
                        </div>
                        <div className="w-full p-2">
                            <div className="">
                                <h1 className="font-bold">Địa chỉ: </h1>
                                <h1 className="font-medium">{user?.address}</h1>
                            </div>
                        </div>
                        <div className="w-1/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Vai trò: </h1>
                                <h1 className="font-medium">
                                    {user?.isAdmin === false
                                        ? 'Nhân viên'
                                        : user?.isAdmin === true
                                        ? 'Quản lý'
                                        : 'Chưa cấp quyền'}
                                </h1>
                            </div>
                        </div>
                        <div className="w-2/3 p-2">
                            <div className="">
                                <h1 className="font-bold">Trạng thái: </h1>
                                <h1 className="font-medium">
                                    {user?.status === 0 ? 'Ngưng hoạt động' : 'Đang hoạt động'}
                                </h1>
                            </div>
                        </div>
                        <div className="w-1/2 p-2">
                            <Button
                                type="primary"
                                style={{ width: '100%', color: 'black', fontWeight: 500, fontSize: '16px' }}
                            >
                                <FaRegEdit color="black" size={22} /> Cập nhật thông tin
                            </Button>
                        </div>
                        {user?.isAdmin === null && (
                            <div className="w-1/2 p-2">
                                <Button
                                    type="primary"
                                    danger
                                    style={{ width: '100%', color: 'white', fontWeight: 500, fontSize: '15px' }}
                                >
                                    <FaShieldAlt color="white" size={22} /> Yêu cầu cấp quyền
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
