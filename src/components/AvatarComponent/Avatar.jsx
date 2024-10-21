import React, { useEffect, useState } from 'react';
import { Popover, Button, Form, Input } from 'antd';
import { IoIosLogOut, IoIosInformationCircleOutline } from 'react-icons/io';
import { MdLockReset } from 'react-icons/md';
import { logOut } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/createInstance';
import { logOutSuccess } from '~/redux/authSlice';
import ModalComponent from '../ModalComponent/ModalComponent';
import ButtonComponent from '../ButtonComponent/Buttoncomponent';
import { LockOutlined } from '@ant-design/icons';
import { GoBell } from 'react-icons/go';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FormatSchedule, getFormatteNgay } from '~/utils/dateUtils';
const Avatar = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const [visible, setVisible] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [isChecked, setIsChecked] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCloseDelete = () => {
        setOpenDelete(false);
        form.resetFields();
    };
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleBellClick = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(true);
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsChecked(false);
    };

    const handleConfirm = () => {
        if (isChecked) {
            // Thực hiện hành động xác nhận ở đây
            console.log('Đã xác nhận');
        }
        handleCloseModal();
    };

    useEffect(() => {
        if (!user || !user.accessToken) navigate('/login');
    }, [user, navigate]);

    const handleLogout = () => {
        logOut(dispatch, user?.code, navigate, user?.accessToken, axiosJWT);
    };

    const validatePassword = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập mật khẩu!'));
        }
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passRegex.test(value)
            ? Promise.resolve()
            : Promise.reject(new Error('Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!'));
    };

    const onFinish = async (values) => {
        try {
            await axios.post('api/users/forgotPassword', {
                code: user?.code,
                password: values.passwordOld,
                passwordNew: values.password,
            });

            handleCloseDelete();
            handleLogout();
            toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!');
        } catch (error) {
            console.log(error);
            toast.error('Mật khẩu cũ không đúng!');
        }
    };

    const popoverContent = (
        <div className="bg-white w-[200px] p-2">
            <Button
                type="primary"
                onClick={() => {
                    handleOpenDelete();
                    setVisible(false);
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8px',
                    color: 'black',
                    fontWeight: 500,
                    fontSize: '14px',
                }}
            >
                <MdLockReset color="black" size={25} />
                Đổi mật khẩu
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    handleNavigate('/');
                    setVisible(false);
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8px',
                    color: 'black',
                    fontWeight: 500,
                    fontSize: '14px',
                    backgroundColor: 'gray',
                }}
            >
                <IoIosInformationCircleOutline color="black" size={25} /> Thông tin cá nhân
            </Button>
            <Button
                type="primary"
                onClick={handleLogout}
                danger
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8px',
                    color: 'black',
                    fontWeight: 500,
                    fontSize: '14px',
                }}
            >
                <IoIosLogOut color="black" size={25} /> Đăng xuất
            </Button>
        </div>
    );

    const notificationCount = 11;

    return (
        <div className="flex  justify-end mt-1 items-end h-[50px]  custom-nest-hub-max1 max-lg:pr-[90px]">
            <div
                className="flex justify-center items-center relative h-[40px] w-[40px] mr-3 bg-gray-300 rounded-[50%]"
                onClick={handleBellClick}
            >
                <GoBell className="text-center m-auto" size={22} />
                {notificationCount > 0 && (
                    <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-[12px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center">
                        {notificationCount}
                    </span>
                )}
            </div>
            <Popover
                content={popoverContent}
                trigger="click"
                placement="bottom"
                overlayInnerStyle={{ padding: '0' }}
                destroyTooltipOnHide={true}
                open={visible}
                onOpenChange={(open) => setVisible(open)}
                className=""
            >
                <div className="flex-row flex space-x-3 cursor-pointer">
                    <img
                        src={user?.avatar || 'https://www.w3schools.com/w3images/avatar6.png'}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="rounded-3xl h-10 "
                    />
                    <div>
                        <h1 className="font-bold text-sm">
                            {user?.isAdmin === false
                                ? 'Nhân viên'
                                : user?.isAdmin === true
                                ? 'Quản lý'
                                : 'Chưa cấp quyền'}
                        </h1>
                        <h1 className="font-medium text-sm">{user?.name}</h1>
                    </div>
                </div>
            </Popover>

            <ModalComponent
                open={openDelete}
                handleClose={handleCloseDelete}
                width="30%"
                height="55%"
                smallScreenWidth="40%"
                smallScreenHeight="25%"
                mediumScreenWidth="40%"
                mediumScreenHeight="20%"
                largeScreenHeight="20%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="40%"
                maxHeightScreenWidth="40%"
                title="Đổi mật khẩu"
            >
                <div className="h-[80%] grid grid-rows-3 ">
                    <div className="grid row-span-2">
                        <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
                            <Form.Item
                                name="passwordOld"
                                rules={[{ required: true, message: 'Nhập mật khẩu cũ!' }]}
                                hasFeedback
                                className="mb-6 px-3 py-1"
                            >
                                <div>
                                    <h1 className="text-[15px] font-bold mb-1">Mật khẩu cũ:</h1>
                                    <Input.Password
                                        prefix={<LockOutlined className="mr-2" />}
                                        placeholder="Mật khẩu cũ"
                                        autoComplete="passwordOld"
                                        className="h-10 text-[16px] font-semibold"
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ validator: validatePassword, required: true }]}
                                hasFeedback
                                className="mb-6 px-3 py-1"
                            >
                                <div>
                                    <h1 className="text-[15px] font-bold mb-1">Mật khẩu mới:</h1>
                                    <Input.Password
                                        prefix={<LockOutlined className="mr-2" />}
                                        placeholder="Mật khẩu mới"
                                        autoComplete="password"
                                        className="h-10 text-[16px] font-semibold"
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Nhập xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu chưa khớp!'));
                                        },
                                    }),
                                ]}
                                className="mb-7 px-3 py-1"
                            >
                                <div>
                                    <h1 className="text-[15px] font-bold mb-1">Nhập lại mật khẩu mới:</h1>
                                    <Input.Password
                                        placeholder="Nhập lại mật khẩu"
                                        prefix={<LockOutlined className="mr-2" />}
                                        autoComplete="new-password"
                                        className="h-10 text-[16px] font-semibold"
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                                    <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                                    <ButtonComponent text="Xác nhận" className="bg-blue-500" type="submit" />
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={openModal}
                handleClose={handleCloseModal}
                width="40%"
                height="60%"
                smallScreenWidth="40%"
                smallScreenHeight="25%"
                mediumScreenWidth="40%"
                mediumScreenHeight="20%"
                largeScreenHeight="20%"
                largeScreenWidth="40%"
                maxHeightScreenHeight="40%"
                maxHeightScreenWidth="40%"
                title="Thông báo"
            >
                <div className="h-full">
                    <div className="h-[75%] overflow-auto ">
                        <div className="flex justify-between h-auto mb-[6px] px-3 bg-gray-200 ">
                            <div className="flex items-center w-full h-auto py-2 cursor-pointer" onClick={handleOpen}>
                                <img
                                    src={user?.avatar || 'https://www.w3schools.com/w3images/avatar6.png'}
                                    alt={user.name}
                                    className="rounded-full mr-3 w-12 h-12"
                                />
                                <div>
                                    <h1 className="text-base font-bold">NV01</h1>
                                    <h1 className="text-base font-bold">
                                        {user.name} <span className="font-medium">đã yêu cầu cấp quyền </span>
                                    </h1>
                                </div>
                            </div>
                            <div className="flex justify-center   h-auto items-center space-x-3">
                                <Button text="Từ chối" className="bg-[#a6a6a7] text-black " onClick={handleCloseModal}>
                                    Từ chối
                                </Button>
                                <Button type="primary" className="bg-blue-500" onClick={handleConfirm}>
                                    Đồng ý
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end border-t pt-2 space-x-3 mt-4 pr-2">
                        <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleCloseModal} />
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="55%"
                height="55%"
                smallScreenWidth="80%"
                smallScreenHeight="60%"
                mediumScreenWidth="80%"
                mediumScreenHeight="50%"
                largeScreenHeight="45%"
                largeScreenWidth="70%"
                maxHeightScreenHeight="92%"
                maxHeightScreenWidth="70%"
                heightScreen="75%"
                title="Chi tiết nhân viên"
            >
                <div className="h-90p grid grid-rows-6 gap-2 ">
                    <div className="grid row-span-5">
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className=" font-bold">Mã nhân viên:</h1>
                                    <h1 className=" font-normal grid col-span-2">{user?.code}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Họ và tên:</h1>
                                    <h1 className="grid col-span-2 font-normal">{user?.name}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="grid col-span-2  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Giới tính:</h1>
                                    <h1 className=" font-normal grid col-span-2">{user?.gender}</h1>
                                </div>
                                <div className="grid col-span-2  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Vai trò:</h1>
                                    <h1 className="font-normal grid col-span-2">
                                        {user?.isAdmin === null
                                            ? 'Chưa cấp quyền'
                                            : user?.isAdmin === false
                                            ? 'Nhân viên'
                                            : 'Quản lý'}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="grid col-span-2  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày sinh:</h1>
                                    <h1 className=" font-normal grid col-span-2">{getFormatteNgay(user?.birthDate)}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Số điện thoại:</h1>
                                    <h1 className="grid col-span-2 font-normal">{user?.phone}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="grid col-span-2  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Trạng thái:</h1>
                                    <h1 className=" font-normal grid col-span-2">
                                        {user?.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Email:</h1>
                                    <h1 className="font-normal col-span-2">{user?.email}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] grid-cols-4 items-center px-3">
                            <div className="grid col-span-2  grid-cols-3 gap-2">
                                <h1 className="font-bold">Rạp:</h1>
                                <h1 className="font-normal col-span-2">{user?.email}</h1>
                            </div>
                            <div className="grid grid-cols-5 col-span-2 gap-2">
                                <h1 className="font-bold">Địa chỉ:</h1>
                                <h1 className="font-normal ml-1 col-span-4">{user?.address}</h1>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="grid col-span-2  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày tạo:</h1>
                                    <h1 className="font-normal grid col-span-2">{FormatSchedule(user?.createdAt)}</h1>
                                </div>
                                <div className="grid col-span-2 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày cập nhật:</h1>
                                    <h1 className="font-normal">{FormatSchedule(user?.updatedAt)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="justify-end flex space-x-3 mt-1  border-t pr-4">
                        <div className="space-x-3 mt-[6px]">
                            <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleClose} />
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
});

export default Avatar;
