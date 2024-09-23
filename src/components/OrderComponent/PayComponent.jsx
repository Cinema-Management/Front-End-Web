import React, { useState } from 'react';
import AutoInputComponent from '../AutoInputComponent/AutoInputComponent';

const PayComponent = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState('');
    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };
    return (
        <div className="h-[550px] overflow-auto custom-height-lg2 custom-height-md2 p-5 mini1 custom-height-sm15 justify-between">
            <div className="mb-3">
                <button className="bg-gray-200 border border-[gray] shadow-2xl  p-1 rounded-md text-[14px] text-[gray]">
                    Quét mã vạch
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-3 mini1">
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Mã khách hàng"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius={'10px'}
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Số điện thoại"
                    freeSolo={true}
                    disableClearable={false}
                    placeholder="Nhập ..."
                    heightSelect={200}
                    borderRadius="10px"
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Tên khách hàng"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
                <AutoInputComponent
                    value={selectedMovie}
                    onChange={setSelectedMovie}
                    title="Tích điểm"
                    freeSolo={true}
                    disableClearable={false}
                    heightSelect={200}
                    borderRadius="10px"
                    disabled={true}
                    className="bg-gray-200 rounded-[10px]"
                />
            </div>
            <div className="bg-[#95989D] mt-6 py-8 mini">
                <div className=" p-3 gap-3 flex-col text-white font-black flex items-center text-[16px] ">
                    <button
                        className={`border border-black rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'cash' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('cash')}
                    >
                        Thanh toán bằng tiền mặt
                    </button>
                    <button
                        className={`border border-black rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'momo' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('momo')}
                    >
                        Thanh toán qua <span className="text-[#F61988]">MOMO</span>
                        <sup>QR</sup>
                    </button>
                    <button
                        className={`border border-black   rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'vnpay' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('vnpay')}
                    >
                        Thanh toán qua <span className="text-[#EB0E0E]">VN</span>
                        <span className="text-[#007AFF]">Pay</span>
                        <sup className="text-[#EB0E0E]">QR</sup>
                    </button>
                    <button
                        className={`border border-black   rounded-[10px] p-2 w-[60%] text-center ${
                            selectedButton === 'zalopay' ? 'border-[#EB0E0E]' : ''
                        }`}
                        onClick={() => handleButtonClick('zalopay')}
                    >
                        Thanh toán qua <span className="text-[#007AFF]">Zalo</span>
                        <span className="text-[#22E242]">Pay</span>
                        <sup className="text-[#007AFF]">QR</sup>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayComponent;
