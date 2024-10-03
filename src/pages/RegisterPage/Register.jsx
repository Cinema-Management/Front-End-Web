import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import Logo from '~/assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const validateContact = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập Email hoặc SĐT!'));
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;

        if (emailRegex.test(value) || phoneRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Email hoặc SĐT không hợp lệ!'));
    };
    return (
        <div className="min-h-screen grid grid-cols-2">
            <div className="bg-custom-bg bg-cover bg-no-repeat bg-left"></div>
            <div className="h-screen flex items-center justify-center">
                <div className="grid login-container p-4 custom-air-mini rounded-lg max-w-[480px] w-full">
                    <img src={Logo} alt="background" className="h-[120px] object-cover mx-auto mb-8" />
                    <Form
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                        className="login-form bg-[#d0d0d0] px-5 rounded-[10px] custom-air-mini"
                    >
                        <h2 className="text-[22px] font-bold text-center pb-3 pt-2">ĐĂNG KÝ</h2>

                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            tooltip="Tên hiển thị của bạn trên hệ thống"
                            rules={[{ required: true, message: 'Nhập họ và tên!', whitespace: true }]}
                        >
                            <Input placeholder="Họ và tên" autoComplete="name" className="h-9 font-semibold" />
                        </Form.Item>

                        <Form.Item
                            name="contact"
                            label="Email hoặc SĐT"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            rules={[{ validator: validateContact }]}
                        >
                            <Input placeholder="Email hoặc SĐT" autoComplete="email" className="h-9 font-semibold" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
                            hasFeedback
                        >
                            <Input.Password
                                placeholder="Mật khẩu"
                                autoComplete="password"
                                className="h-9 font-semibold"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Nhập lại mật khẩu"
                            dependencies={['password']}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
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
                        >
                            <Input.Password
                                placeholder="Nhập lại mật khẩu"
                                autoComplete="new-password"
                                className="h-9 font-semibold"
                            />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            className=" ml-9"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Đồng ý điều khoản để tiếp tục!')),
                                },
                            ]}
                        >
                            <Checkbox>
                                Tôi đồng ý với{' '}
                                <button
                                    className="text-transparent bg-clip-text bg-gradient-to-r font-bold from-[#ED999A] to-[#F1C46F]"
                                    type="button"
                                >
                                    điều khoản sử dụng
                                </button>{' '}
                                của TD Việt Nam
                            </Checkbox>
                        </Form.Item>

                        <Form.Item className="pt-3">
                            <button
                                type="submit"
                                className="login-form-button rounded-[10px] w-full gradient-button h-[38px] text-[18px] font-bold text-black"
                            >
                                Đăng ký
                            </button>
                            <div className="text-[14px] text-center mt-4">
                                Bạn đã có tài khoản?{' '}
                                <button
                                    type="button"
                                    className="text-transparent bg-clip-text bg-gradient-to-r font-bold from-[#ED999A] to-[#F1C46F]"
                                    onClick={() => {
                                        handleNavigate('/login');
                                    }}
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
