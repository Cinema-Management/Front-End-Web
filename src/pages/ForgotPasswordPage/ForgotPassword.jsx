import { Checkbox, Form, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Logo from '~/assets/Logo.png';
import quenmk from '~/assets/quenmk.png';
import { LockOutlined, CheckCircleOutlined, MessageFilled, MailFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef([]);
    const [timer, setTimer] = useState(60);
    const [form] = Form.useForm();
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };
    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Tự động chuyển đến ô tiếp theo hoặc trước đó
        if (text.length === 1 && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].focus();
        } else if (text.length === 0 && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    // Thay đổi logic để bắt đầu đếm ngược khi component mount
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval); // Dừng interval khi timer đạt 0
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="min-h-screen grid grid-cols-2">
            <div className="bg-custom-bg bg-cover bg-no-repeat bg-left"></div>
            <div className="h-screen flex items-center justify-center">
                <div className="grid login-container p-4 custom-air-mini rounded-lg max-w-[480px] w-full">
                    <img src={Logo} alt="background" className="h-[120px] object-cover mx-auto mb-8" />

                    {step1 && (
                        <div className="bg-[#d0d0d0] h-[500px] w-[400px] p-4 rounded-[10px]">
                            <div className="flex items-center justify-center relative">
                                <button
                                    className="absolute left-0 py-1 px-4  rounded-lg"
                                    onClick={() => handleNavigate('/login')}
                                >
                                    <IoIosArrowBack size={30} />
                                </button>
                                <h1 className="text-[20px] uppercase font-bold">Tạo mật khẩu mới</h1>
                            </div>

                            <h1 className="text-[16px] font-normal text-center my-6 ">
                                Chọn thông tin liên hệ mà chúng tôi sẽ sử dụng để đặt lại mật khẩu của bạn.
                            </h1>
                            <img src={quenmk} alt="quenmk" className="h-[140px] object-cover mx-auto my-5" />

                            <div>
                                <button className="w-full h-14 bg-[#a4a2a2] rounded-[10px] flex items-center py-1 px-3">
                                    <MessageFilled
                                        style={{
                                            fontSize: '20px',
                                            color: 'blue',
                                        }}
                                    />

                                    <div className="ml-2 flex flex-col h-full w-full text-black">
                                        <h1 className="text-[14px] text-left">Gửi qua SMS</h1>
                                        <input
                                            type="tel"
                                            placeholder="Nhập SĐT..."
                                            className="text-[15px] text-left w-full p-1 placeholder:text-black bg-transparent focus:outline-none "
                                        />
                                    </div>
                                </button>
                                <button className="w-full h-14 bg-[#a4a2a2] rounded-[10px] flex items-center py-1 px-3 mt-2">
                                    <MailFilled
                                        style={{
                                            fontSize: '20px',
                                            color: 'blue',
                                        }}
                                    />

                                    <div className="ml-2 flex flex-col h-full w-full text-black">
                                        <h1 className="text-[14px] text-left">Gửi qua Email</h1>
                                        <input
                                            type="email"
                                            placeholder="Nhập Email..."
                                            className="text-[15px] text-left w-full p-1 placeholder:text-black bg-transparent focus:outline-none "
                                        />
                                    </div>
                                </button>
                            </div>

                            <button
                                type="button"
                                className="login-form-button rounded-[10px] w-full gradient-button h-[38px] text-[18px] font-bold text-black mt-7"
                                onClick={() => {
                                    setStep1(false);
                                    setStep2(true);
                                }}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    )}

                    {step2 && (
                        <div className="bg-[#d0d0d0] h-[380px] w-[400px] p-4 rounded-[10px]">
                            <div className="flex items-center justify-center relative">
                                <button
                                    className="absolute left-0 py-1 px-4  rounded-lg"
                                    onClick={() => {
                                        setStep1(true);
                                        setStep2(false);
                                    }}
                                >
                                    <IoIosArrowBack size={30} />
                                </button>
                                <h1 className="text-[20px] uppercase font-bold">Xác nhận OTP</h1>
                            </div>

                            <h1 className="text-[16px] font-normal text-center my-10 ">
                                Mã OTP đã gửi đến số +84368 *** 452
                            </h1>

                            <div className="flex justify-center gap-2 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        onChange={(e) => handleChange(e.target.value, index)} // Sử dụng e.target.value
                                        className={`w-12 h-12 text-center text-xl rounded-lg border-2 focus:outline-none ${
                                            digit ? 'border-red-400' : 'border-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            <p className="text-center mt-7">
                                Gửi mã lại sau <span className="text-orange-500">{timer}s</span>
                            </p>

                            <button
                                type="submit"
                                className="login-form-button rounded-[10px] mt-20 w-full gradient-button h-[38px] text-[18px] font-bold text-black"
                                onClick={() => {
                                    setStep2(false);
                                    setStep3(true);
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    )}

                    {step3 && (
                        <div className="bg-[#d0d0d0] h-[500px] w-[400px] p-4 rounded-[10px]">
                            <div className="flex items-center justify-center relative">
                                <button
                                    className="absolute left-0 py-1 px-4  rounded-lg"
                                    onClick={() => {
                                        setStep2(true);
                                        setStep3(false);
                                    }}
                                >
                                    <IoIosArrowBack size={30} />
                                </button>
                                <h1 className="text-[20px] uppercase font-bold">Tạo mật khẩu mới</h1>
                            </div>

                            <img src={quenmk} alt="quenmk" className="h-[100px] object-cover mx-auto my-6" />

                            <div className=" mb-2 text-[13px] text-green-700 font-normal h-16">
                                <p>
                                    <CheckCircleOutlined className="mr-1 " />
                                    Chứa 1 chữ cái hoa, thường
                                </p>
                                <p>
                                    <CheckCircleOutlined className="mr-1 " />
                                    Chứa ít nhất 1 chữ số
                                </p>
                                <p>
                                    <CheckCircleOutlined className="mr-1 " />
                                    Ít nhất 8 ký tự
                                </p>
                            </div>
                            <Form
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                scrollToFirstError
                                className="login-form bg-[#d0d0d0] px-5 rounded-[10px] custom-air-mini"
                            >
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="mr-2" />}
                                        placeholder="Mật khẩu"
                                        autoComplete="password"
                                        className="h-10 text-[16px] font-semibold"
                                    />
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
                                >
                                    <Input.Password
                                        placeholder="Nhập lại mật khẩu"
                                        prefix={<LockOutlined className="mr-2" />}
                                        autoComplete="new-password"
                                        className="h-10 text-[16px] font-semibold"
                                    />
                                </Form.Item>
                                <Form.Item className="flex justify-between">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox className="text-[14px]">Lưu mật khẩu</Checkbox>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item>
                                    <button
                                        type="submit"
                                        className="login-form-button rounded-[10px] w-full gradient-button h-[38px] text-[18px] font-bold text-black"
                                        onClick={() => {
                                            handleNavigate('/login');
                                        }}
                                    >
                                        Xác nhận
                                    </button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
