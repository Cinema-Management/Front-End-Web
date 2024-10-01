import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="login-container bg-red-300 w-[500px] h-[422px]">
            <Form
                name="login_form"
                className="login-form bg-[#95989D]"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <h2>ĐĂNG NHẬP</h2>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại hoặc email!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Số điện thoại hoặc email" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Lưu mật khẩu</Checkbox>
                    </Form.Item>

                    <button className="login-form-forgot">Quên mật khẩu?</button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Đăng nhập
                    </Button>
                    <div className="register-link">
                        Không có tài khoản? <button>Đăng ký</button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
