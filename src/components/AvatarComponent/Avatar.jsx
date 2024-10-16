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
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';
const Avatar = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const [visible, setVisible] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [form] = Form.useForm();
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

    return (
        <div className="flex flex-col justify-center mt-1 items-end h-[50px] pr-4 custom-nest-hub-max1 max-lg:pr-24">
            <Popover
                content={popoverContent}
                trigger="click"
                placement="bottom"
                overlayInnerStyle={{ padding: '0' }}
                destroyTooltipOnHide={true}
                open={visible}
                onOpenChange={(open) => setVisible(open)}
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
                        <h1 className="font-bold text-sm">{user?.isAdmin === false ? 'Nhân viên' : 'Quản lý'}</h1>
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

                    {/* <div className="grid items-center ">
                        <div className="justify-end flex space-x-3 border-t pt-3 pr-4 ">
                            <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleCloseDelete} />
                            <ButtonComponent
                                text="Xóa"
                                className="bg-blue-500"
                                // onClick={() => handleDeleteMovie(selectedFilm?.code)}
                            />
                        </div>
                    </div> */}
                </div>
            </ModalComponent>
        </div>
    );
});

export default Avatar;
