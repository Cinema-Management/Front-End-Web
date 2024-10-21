import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Checkbox } from 'antd';
import Logo from '~/assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '~/redux/apiRequest';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from 'react-icons/io';
import { auth } from '~/configs/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth';
import axios from 'axios';

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef([]);
    const [timer, setTimer] = useState(60);
    const [newUser, setNewUser] = useState('');
    // const [isSendOtp, setIsSendOtp] = useState(true);

    function onCaptchaVerify() {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    onRegister();
                },
                'expired-callback': () => {},
            });
        }
    }

    const normalizePhoneNumber = (phoneNumber) => {
        // Loại bỏ các ký tự không phải là số và các dấu '+' không cần thiết, nhưng giữ lại dấu '+' nếu có ở đầu
        let normalized = phoneNumber.replace(/[^\d+]/g, '');

        // Nếu số không bắt đầu bằng '+84', '84', '0' hoặc '840', trả về chuỗi rỗng
        if (
            !normalized.startsWith('+84') &&
            !normalized.startsWith('84') &&
            !normalized.startsWith('0') &&
            !normalized.startsWith('840')
        ) {
            return '';
        }

        // Nếu số bắt đầu bằng '0', thay thế bằng '+84'
        if (normalized.startsWith('0')) {
            normalized = '+84' + normalized.slice(1);
        } else if (normalized.startsWith('840')) {
            // Nếu số bắt đầu bằng '840', thay thế bằng '+84'
            normalized = '+84' + normalized.slice(3);
        } else if (normalized.startsWith('84')) {
            // Nếu số bắt đầu bằng '84', thêm dấu '+' trước '84'
            normalized = '+84' + normalized.slice(2);
        } else if (normalized.startsWith('+84')) {
            // Nếu số bắt đầu bằng '+84', giữ nguyên
            return normalized;
        }

        return normalized;
    };

    const onRegister = async () => {
        try {
            const phoneNumber = form.getFieldValue('phone'); // Lấy số điện thoại từ form
            toast.success('Số điện thoại: ' + phoneNumber);
            if (phoneNumber) {
                const formatPh = normalizePhoneNumber(phoneNumber); // Gọi hàm normalizePhoneNumber để chuẩn hóa số điện thoại
                toast.success('Số điện thoại: ' + formatPh);

                if (formatPh) {
                    onCaptchaVerify();

                    const appVerifier = window.recaptchaVerifier;

                    signInWithPhoneNumber(auth, formatPh, appVerifier)
                        .then((result) => {
                            // setConfirmationResult(result);
                            alert('code sent');
                            // setshow(true);
                        })
                        .catch((err) => {
                            alert(err);
                            window.location.reload();
                        });
                } else {
                    toast.error('Số điện thoại không hợp lệ!');
                }
            } else {
                toast.error('Vui lòng nhập số điện thoại!');
            }
        } catch (error) {
            toast.error('Gửi mã OTP thất bại:' + error);
        }
    };

    // function onOTPVerify() {
    //     if (otp != null ) {
    //         window.confirmationResult
    //             .confirm(otp)
    //             .then(async (res) => {
    //                 // Đánh dấu rằng mã OTP đã được xác minh thành công
    //                 toast.success('Xác nhận OTP thành công!');
    //             })
    //             .catch((err) => {});
    //     } else {
    //         toast.error('Mã OTP không đúng!');
    //     }
    // }

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
    const dispatch = useDispatch();

    const onFinisRegister = async (object) => {
        try {
            const response = await axios.get('api/users/staff');

            if (response.data) {
                const arrayUser = response.data;
                const checkPhone = arrayUser.find((user) => user.phone === object.phone);

                const checkEmail = arrayUser.find((user) => user.email === object.email);
                if (checkPhone) {
                    toast.error('SĐT đã tồn tại!');
                    return;
                }
                if (checkEmail) {
                    toast.error('Email đã tồn tại!');
                    return;
                }
                const user = {
                    ...object,
                    type: 1,
                };

                setNewUser(user);
                setStep1(false);
                setStep2(true);
            }
        } catch (e) {}
    };

    const handleRegister = async () => {
        try {
            const error = await registerUser(newUser, dispatch, navigate);

            if (error) {
                toast.error('Thất bại!');
                return;
            } else {
                toast.success('Đăng nhập thành công!');
            }
        } catch (e) {}
    };

    // Validator for email
    const validateEmail = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập Email!'));
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? Promise.resolve() : Promise.reject(new Error('Email không hợp lệ!'));
    };

    // Validator for phone number
    const validatePhone = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập SĐT!'));
        }
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(value) ? Promise.resolve() : Promise.reject(new Error('SĐT không hợp lệ!'));
    };

    // Validator for password
    const validatePassword = (rule, value) => {
        if (!value) {
            return Promise.reject(new Error('Nhập mật khẩu!'));
        }
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passRegex.test(value)
            ? Promise.resolve()
            : Promise.reject(new Error('ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!'));
    };

    return (
        <div className="min-h-screen grid grid-cols-2">
            <div className="bg-custom-bg bg-cover bg-no-repeat bg-left"></div>

            <div className="h-screen flex items-center justify-center">
                <div className="grid login-container p-4 custom-air-mini rounded-lg max-w-[480px] w-full">
                    <img src={Logo} alt="background" className="h-[120px] object-cover mx-auto mb-8" />
                    <div id="recaptcha-container" className="flex justify-center mt-3"></div>

                    {/* <button
                                type="submit"
                                className="login-form-button rounded-[10px] mt-20 w-full gradient-button h-[38px] text-[18px] font-bold text-black"
                                onClick={() => {
                                     onRegister();
                                }}
                            >
                                Test
                            </button> */}

                    {step1 && (
                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinisRegister}
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
                                name="email"
                                label="Email"
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                                rules={[{ validator: validateEmail, required: true }]}
                            >
                                <Input placeholder="Email" autoComplete="email" className="h-9 font-semibold" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                                rules={[{ validator: validatePhone, required: true, message: 'Nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Số điện thoại" autoComplete="phone" className="h-9 font-semibold" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                                rules={[{ validator: validatePassword, required: true }]}
                            >
                                <Input.Password
                                    placeholder="Mật khẩu"
                                    autoComplete="new-password"
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
                                            return !value || getFieldValue('password') === value
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Mật khẩu chưa khớp!'));
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
                                className="ml-9"
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
                                    handleRegister();
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
