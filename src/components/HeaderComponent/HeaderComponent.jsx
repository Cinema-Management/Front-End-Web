import React, { useEffect, useState } from 'react';
import Logo from '~/assets/Logo.png';
import { GoHome } from 'react-icons/go';
import { FaChevronDown, FaChevronUp, FaFilm, FaUser, FaRegUser } from 'react-icons/fa6';
import { SlScreenDesktop } from 'react-icons/sl';
import { LuCalendarDays } from 'react-icons/lu';
import { LuTicket } from 'react-icons/lu';
import { FcStatistics } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { BsTag } from 'react-icons/bs';
import { ImSpoonKnife } from 'react-icons/im';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaMoneyBills } from 'react-icons/fa6';

const HeaderComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'bg-orange-300' : '';
    };
    const isParentActive = (paths) => {
        return paths.some((path) => location.pathname.startsWith(path)) ? 'bg-orange-200' : '';
    };

    useEffect(() => {
        const dropdownPaths = ['/film', '/cinema', '/schedule', '/price', '/promotion', '/food', '/staff', '/customer'];
        if (dropdownPaths.some((path) => location.pathname.startsWith(path))) {
            setIsDropdownOpen(true);
        }
    }, [location.pathname]);
    return (
        <div className="bg-white xl:w-1/5 max-xl:w-28p  min-w-[300px] custom-mini custom-air1  custom-hubmax1 custom-height-lg3 custom-height-sm21 custom-height-xxl4">
            <div className="py-2 flex flex-col justify-center items-center cursor-pointer">
                <div className="text-center" onClick={() => handleNavigate('/')}>
                    <img src={Logo} alt="Logo" width={90} height={90} className="mx-auto mb-2" />
                    <h1 className="font-bold text-base">ADMIN TDCENIMAS</h1>
                </div>
            </div>
            <div className="text-center">
                <ul className="bg-white border rounded shadow-sm text-[18px] leading-[22px] cursor-pointer">
                    <li className="w-full">
                        <div
                            className={`hover:bg-orange-500 relative max-xl:pl-16 max-lg:pl-3 pl-12 ${isParentActive([
                                '/film',
                                '/cinema',
                                '/schedule',
                                '/price',
                                '/promotion',
                                '/food',
                                '/staff',
                                '/customer',
                            ])}`}
                        >
                            <button onClick={toggleDropdown} className="flex items-center py-2 w-full">
                                <GoHome className="mr-2" /> Master Data{' '}
                                {isDropdownOpen ? (
                                    <FaChevronUp
                                        fontSize={15}
                                        className="transition-transform duration-300 absolute max-xl:right-20 max-lg:right-8 right-16"
                                    />
                                ) : (
                                    <FaChevronDown
                                        fontSize={15}
                                        className="transition-transform duration-300 absolute max-xl:right-20 max-lg:right-8 right-16"
                                    />
                                )}
                            </button>
                        </div>

                        {isDropdownOpen && (
                            <ul className="border-t border-gray-400">
                                <li
                                    className={`hover:bg-orange-500 ${isActive('/film')}`}
                                    onClick={() => handleNavigate('/film')}
                                >
                                    <button className="flex max-lg:ml-9 ml-20 items-center py-2 w-full">
                                        <FaFilm className="mr-2" color="orange" />
                                        Phim
                                    </button>
                                </li>
                                <li
                                    className={`hover:bg-orange-500 ${isActive('/cinema')}`}
                                    onClick={() => handleNavigate('/cinema')}
                                >
                                    <button className="flex max-lg:ml-9 ml-20 items-center py-2 w-full ">
                                        <SlScreenDesktop className="mr-2" color="#66FFFF" />
                                        Rạp
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/schedule')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/schedule')}
                                    >
                                        <LuCalendarDays className="mr-2" color="red" />
                                        Suất chiếu
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/price')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/price')}
                                    >
                                        <MdOutlineAttachMoney className="mr-2" color="#FF6600" />
                                        Bảng giá
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/promotion')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/promotion')}
                                    >
                                        <BsTag className="mr-2" color="orange" />
                                        Mã khuyến mãi
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/food')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/food')}
                                    >
                                        <ImSpoonKnife className="mr-2" />
                                        Đồ ăn & nước
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/staff')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/staff')}
                                    >
                                        <FaRegUser className="mr-2" />
                                        Nhân viên
                                    </button>
                                </li>
                                <li className={`hover:bg-orange-500 ${isActive('/customer')}`}>
                                    <button
                                        className="flex max-lg:ml-9 ml-20 items-center py-2 w-full"
                                        onClick={() => handleNavigate('/customer')}
                                    >
                                        <FaUser className="mr-2" />
                                        Khách hàng
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className={`hover:bg-orange-500 w-full ${isActive('/order')}`}>
                        <button
                            className="flex max-xl:ml-16 items-center max-lg:ml-3 ml-12 py-2 w-full"
                            onClick={() => handleNavigate('/order')}
                        >
                            <LuTicket className="mr-2" color="orange" />
                            Đặt vé
                        </button>
                    </li>
                    <li className={`hover:bg-orange-500 w-full ${isActive('/sale-invoice')}`}>
                        <button
                            className="flex max-xl:ml-16 items-center max-lg:ml-3 ml-12 py-2 w-full"
                            onClick={() => handleNavigate('/sale-invoice')}
                        >
                            <FaMoneyBills className="mr-2" color="green" />
                            Hóa đơn bán
                        </button>
                    </li>
                    <li className={`hover:bg-orange-500 w-full ${isActive('/seat')}`}>
                        <button
                            className="flex max-xl:ml-16 max-lg:ml-3 ml-12 items-center py-2 w-full"
                            // onClick={() => handleNavigate('/seat')}
                        >
                            <FcStatistics className="mr-2" />
                            Thống kê
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HeaderComponent;
