import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Logo from '~/assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '~/redux/apiRequest';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const onFinishLogin = async (object) => {
        try {
            const newUser = {
                phone: object.phone,
                password: object.password,
                type: 1,
            };

            const error = await loginUser(newUser, dispatch, navigate);

            if (error) {
                toast.error('Tài khoản hoặc mật khẩu không chính xác!');
                return;
            } else {
                toast.success('Đăng nhập thành công!');
            }
        } catch (e) {}
    };
    const validatePhone = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập SĐT!'));
        }
        const phoneRegex = /^[0-9]{10,15}$/;

        if (phoneRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('SĐT không hợp lệ!'));
    };

    return (
        <div className="min-h-screen grid grid-cols-2">
            <div className="bg-custom-bg bg-cover bg-no-repeat bg-left"></div>
            <div className="h-screen flex items-center justify-center">
                <div className="grid login-container p-4 rounded-lg max-w-md w-full">
                    <img src={Logo} alt="background" className="h-[120px] object-cover mx-auto mb-8" />
                    <Form
                        name="login_form"
                        className="login-form bg-[#d0d0d0] px-8 py-4 text-[20px] rounded-[10px]"
                        initialValues={{ remember: true }}
                        onFinish={onFinishLogin}
                    >
                        <h2 className="text-[22px] font-bold text-center pt-2 pb-4">ĐĂNG NHẬP</h2>
                        <Form.Item
                            name="phone"
                            rules={[{ validator: validatePhone, required: true, message: 'Nhập số điện thoại ' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="mr-2" />}
                                placeholder="Số điện thoại hoặc email"
                                className="h-11 text-[16px] font-semibold"
                            />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                            <Input.Password
                                prefix={<LockOutlined className="mr-2" />}
                                placeholder="Mật khẩu"
                                className="h-11 text-[16px] font-semibold"
                                autoComplete="password"
                            />
                        </Form.Item>

                        <Form.Item className="flex justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="text-[14px]">Lưu mật khẩu</Checkbox>
                            </Form.Item>

                            <button
                                className="login-form-forgot text-[14px] text-right ml-32"
                                onClick={() => {
                                    handleNavigate('/forgot-password');
                                }}
                                type="button"
                            >
                                <h1 className="text-right text-transparent bg-clip-text bg-gradient-to-r font-medium from-[#ED999A] to-[#F1C46F]">
                                    Quên mật khẩu?
                                </h1>
                            </button>
                        </Form.Item>

                        <Form.Item>
                            <button
                                type="submit"
                                className="login-form-button rounded-[10px] w-full gradient-button h-[38px] text-[18px] font-bold text-black"
                                // onClick={handleLogin}
                            >
                                Đăng nhập
                            </button>
                            <div className="text-[14px] text-center mt-4">
                                Không có tài khoản?{' '}
                                <button
                                    type="button"
                                    className="text-transparent bg-clip-text bg-gradient-to-r font-bold from-[#ED999A] to-[#F1C46F]"
                                    onClick={() => {
                                        handleNavigate('/register');
                                    }}
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
