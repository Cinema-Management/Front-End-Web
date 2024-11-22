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
import { useMutation, useQuery, useQueryClient } from 'react-query';
const Avatar = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const [visible, setVisible] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState('');
    const queryClient = useQueryClient();

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
        permissionRequest.length > 0 ? setOpenModal(true) : toast.info('Không có thông báo nào!');
    };

    const handleClose = () => {
        setOpenModal(true);
        setOpen(false);
        setSelectedStaff('');
    };
    const handleOpen = () => {
        setOpen(true);
        setOpenModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
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

    const getAllStaffPermissionRequest = async () => {
        try {
            const response = await axios.get('/api/users/getAllStaffPermissionRequest');

            const data = response.data;

            return data;
        } catch (error) {
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                throw new Error('Error: No response received from server');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    };

    const fetchCinemasFullAddress = async () => {
        try {
            const response = await axios.get('/api/cinemas/getAllFullAddress');

            const data = response.data;

            const arrayNameCinema = data.map((cinema) => ({
                name: cinema.name,
                code: cinema.code,
            }));
            return { optionNameCinema: arrayNameCinema };
        } catch (error) {
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                throw new Error('Error: No response received from server');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    };
    const {
        data: { optionNameCinema = [] } = {},
        isLoading: isLoadingCinemas,
        error: CinemaError,
    } = useQuery('cinemasFullAddress1', fetchCinemasFullAddress, {
        staleTime: 1000 * 60 * 7,
        cacheTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 7,
    });

    const {
        data: permissionRequest = [],
        isLoading,
        error,
        refetch,
    } = useQuery('getAllStaffPermissionRequest', getAllStaffPermissionRequest, {
        staleTime: 1000 * 60 * 10,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60 * 10,
    });

    const handleConfirm = async (request) => {
        try {
            await axios.put('api/users/updatePermissionRequest/' + request?.code, {
                status: 2,
            });
            await axios.put('api/users/' + request?.code, {
                type: 1,
                isAdmin: false,
            });
            toast.success('Phê duyệt thành công!');
            if (permissionRequest.length === 1) {
                setOpenModal(false);
            }

            refetch();
        } catch (error) {
            toast.error('Phê duyệt thất bại!');
        }
    };

    const mutation = useMutation(handleConfirm, {
        onSuccess: () => {
            // Refetch dữ liệu cần thiết
            queryClient.refetchQueries('fetchStaff');
        },
    });

    function formatDate(timeRequest) {
        const currentDate = new Date();
        const requestDate = new Date(timeRequest);

        const diffInMillis = currentDate - requestDate;
        const diffInSeconds = Math.floor(diffInMillis / 1000); // Chênh lệch thời gian tính bằng giây
        const diffInHours = Math.floor(diffInSeconds / 3600); // Chênh lệch thời gian tính bằng giờ

        if (diffInHours < 24) {
            return 'Hôm nay';
        } else if (diffInHours >= 24 && diffInHours < 48) {
            return 'Hôm qua';
        } else {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            return requestDate.toLocaleDateString('vi-VN', options);
        }
    }

    const handleReject = async (request) => {
        try {
            await axios.put('api/users/updatePermissionRequest/' + request?.code, {
                status: 3,
            });

            toast.warning('Bạn đã từ chối!');

            refetch();
            if (permissionRequest.length === 1) {
                setOpenModal(false);
            }
        } catch (error) {
            toast.error('Từ chối thất bại!');
        }
    };
    if (isLoading || isLoadingCinemas) return;
    if (error || CinemaError) return <p>error: {error.message || CinemaError.message}</p>;

    return (
        <div className="flex justify-end mt-1 items-end h-[50px]  custom-nest-hub-max1 max-lg:pr-[80px] ">
            <div
                className={`flex justify-center items-center relative h-[40px] w-[40px] mr-3 bg-gray-300 rounded-[50%] ${
                    user?.isAdmin ? '' : 'hidden'
                }`}
                onClick={handleBellClick}
            >
                <GoBell className="text-center m-auto" size={22} />
                {permissionRequest.length > 0 && (
                    <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-[12px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center">
                        {permissionRequest.length}
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
                width="auto"
                height="auto"
                title="Thông báo"
            >
                <div className=" overflow-auto grid  ">
                    {permissionRequest.map((request, index) => (
                        <div key={index} className="grid justify-between h-auto  px-2 bg-gray-200   grid-cols-4 gap-3">
                            <div className="  grid col-span-3  ">
                                <div
                                    className="flex items-center w-full h-auto py-2 cursor-pointer "
                                    onClick={() => {
                                        handleOpen(request);
                                        setSelectedStaff(request);
                                    }}
                                >
                                    <img
                                        src={request?.avatar || 'https://www.w3schools.com/w3images/avatar6.png'}
                                        alt={request?.name}
                                        className="rounded-full mr-3 w-12 h-12"
                                    />
                                    <div>
                                        <div className="flex  justify-between  ">
                                            <span className="text-xs text-gray-800">
                                                {formatDate(request?.permissionRequest?.date)}
                                            </span>
                                        </div>
                                        <h1 className="text-base font-bold">
                                            {request?.name}{' '}
                                            <span className="font-medium">yêu cầu cấp quyền nhân viên.</span>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 items-center justify-center space-x-2 col-span-1  ">
                                <Button
                                    text="Từ chối"
                                    className="bg-[#a6a6a7] text-black"
                                    onClick={() => handleReject(request)}
                                >
                                    Từ chối
                                </Button>
                                <Button type="primary" className="bg-blue-500" onClick={() => mutation.mutate(request)}>
                                    Phê duyệt
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end border-t space-x-3 mt-4 pr-2 py-2">
                    <ButtonComponent text="Đóng" className="bg-[#a6a6a7]" onClick={handleCloseModal} />
                </div>
            </ModalComponent>

            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="55%"
                height="58%"
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
                <div className="h-90p grid grid-rows-6 gap-2  ">
                    <div className="grid row-span-5">
                        <div className="grid text-[15px] items-center px-3 ">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2 grid-cols-2 gap-2">
                                    <h1 className=" font-bold">Mã nhân viên:</h1>
                                    <h1 className=" font-normal">{selectedStaff?.code}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Họ và tên:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedStaff?.name}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Giới tính:</h1>
                                    <h1 className="grid  font-normal">{selectedStaff?.gender}</h1>
                                </div>
                                <div className="grid col-span-3  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Email:</h1>
                                    <h1 className="font-normal grid col-span-2">{selectedStaff?.email}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày sinh:</h1>
                                    <h1 className="font-normal">{getFormatteNgay(selectedStaff?.birthDate)}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Số điện thoại:</h1>
                                    <h1 className="grid col-span-2 font-normal">{selectedStaff?.phone}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Trạng thái:</h1>
                                    <h1 className="grid  font-normal">
                                        {selectedStaff?.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Vai trò:</h1>
                                    <h1 className="font-normal col-span-2">
                                        {selectedStaff?.isAdmin === null
                                            ? 'Chưa cấp quyền'
                                            : selectedStaff?.isAdmin === false
                                            ? 'Nhân viên'
                                            : 'Quản lý'}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Rạp:</h1>
                                    <h1 className="grid  font-normal">
                                        {selectedStaff?.isAdmin
                                            ? 'Tất cả rạp'
                                            : selectedStaff?.cinemaCode
                                            ? optionNameCinema.find((item) => item.code === selectedStaff?.cinemaCode)
                                                  ?.name
                                            : 'Chưa cập nhật'}
                                    </h1>
                                </div>
                                <div className="grid col-span-3  grid-cols-3 gap-2">
                                    <h1 className="font-bold">Địa chỉ:</h1>
                                    <h1 className="font-normal grid col-span-2">{selectedStaff?.fullAddress}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="grid text-[15px] items-center px-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="grid col-span-2  grid-cols-2 gap-2">
                                    <h1 className="font-bold">Ngày tạo:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedStaff?.createdAt)}</h1>
                                </div>
                                <div className="grid col-span-3 grid-cols-3 gap-2">
                                    <h1 className="font-bold">Ngày cập nhật:</h1>
                                    <h1 className="font-normal">{FormatSchedule(selectedStaff?.updatedAt)}</h1>
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
