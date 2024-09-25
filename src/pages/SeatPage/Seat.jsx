import React, { useState } from 'react';
import { LuArmchair } from 'react-icons/lu';
import { IoIosArrowBack } from 'react-icons/io';
import phim1 from '~/assets/phim1.png';
import { ImSpoonKnife } from 'react-icons/im';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { GrFormNext } from 'react-icons/gr';
import { styled } from '@mui/system';
import ButtonComponent from '~/components/ButtonComponent/Buttoncomponent';
import AutoInputComponent from '~/components/AutoInputComponent/AutoInputComponent';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
const SeatComponent = React.lazy(() => import('~/components/OrderComponent/SeatComponent'));
const FoodComponent = React.lazy(() => import('~/components/OrderComponent/FoodComponent'));
const PayComponent = React.lazy(() => import('~/components/OrderComponent/PayComponent'));

const CustomTab = styled(({ isActive, ...other }) => <Tab {...other} />)(({ isActive }) => ({
    borderBottom: isActive ? '2px solid red' : '1px solid transparent',
    color: isActive ? 'red' : 'black',
    transition: 'border-bottom 0.3s',
    textTransform: 'none',
    fontSize: '16px',
    width: 'auto',
    '&.Mui-selected': {
        color: 'red',
    },
}));

const Seat = ({ setSelectSchedule }) => {
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [setGhe, setSetGhe] = useState([]);
    // const [priceSeat, setPriceSeat] = useState(0);
    const [selectedCombos, setSelectedCombos] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [selectedMovie, setSelectedMovie] = useState('');
    // const handlePrice = () => {
    //     // Add seat prices and combo prices together
    //     const seatPrice = setGhe.reduce((total, item) => total + item.gia, 0);
    //     const totalPrice = seatPrice + 0;
    //     setPriceSeat(totalPrice);
    // };

    const handleNext = () => {
        if (value < 2) setValue(value + 1);
    };

    const handlePrevious = () => {
        if (value > 0) setValue(value - 1);
    };

    return (
        <div className="max-h-screen">
            <div className=" rounded-[10px] px-4 h-[675px] custom-height-xxl2 max-h-screen custom-height-sm3 custom-height-md1 custom-height-lg1 custom-height-xl1">
                <div className="flex mb-1">
                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                        onClick={() => {
                            setSelectSchedule(false);
                        }}
                    >
                        <IoIosArrowBack size={20} />
                        Quay lại
                    </Button>
                </div>
                <div
                    className="grid grid-cols-4 max-lg:grid-rows-5 custom-height-sm13 custom-height-sm4 
                        max-lg:grid-cols-3 max-lg:gap-3 gap-2 h-[94%] "
                >
                    <div
                        className=" text-white max-lg:row-span-2 max-lg:w-[300px] max-lg:mx-[50%] custom-height-sm5 custom-height-sm8
                      bg-[#334767] text-[13px] rounded-[10px]  grid grid-rows-8"
                    >
                        <div className="  row-span-5 grid grid-rows-5 p-2">
                            <div className="grid grid-cols-5 row-span-3 gap-3 max-lg:gap-0">
                                <div className="col-span-2 ">
                                    <img
                                        src={phim1}
                                        alt="phim1"
                                        className="object-contain h-[160px] max-lg:h-[120px]"
                                    />
                                </div>
                                <div className="pt-4 col-span-3 space-y-2 max-lg:space-y-0">
                                    <h1 className="uppercase font-bold text-[13px]">Đẹp trai thấy sai sai</h1>
                                    <div className="flex  space-x-3  justify-center items-center">
                                        <h1 className="bg-[#95989D] p-1 text-white text-[12px] w-[30%] text-center rounded-md ">
                                            13+
                                        </h1>
                                        <h1 className="bg-[#95989D] p-1 text-white w-[70%] text-[12px] text-center rounded-md ">
                                            2D Phụ Đề Anh
                                        </h1>
                                    </div>
                                    <h1 className="text-[12px] font-[200px]">Hài, Kinh dị</h1>
                                    <h1 className="text-[12px] ">100 phút</h1>
                                </div>
                            </div>
                            <div className="row-span-2 grid grid-rows-3 ">
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Rạp:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">Lotte Gò Vấp</h1>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Phòng:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">Phòng 1</h1>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    <h1 className="col-span-2">Suất chiếu:</h1>
                                    <h1 className="font-bold grid col-span-4 justify-items-end">17:00, 18/09/2024</h1>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-b-2 row-span-1  border-dashed items-center justify-between flex p-2 space-x-4">
                            <div className=" flex items-center ">
                                <LuArmchair className="text-white" size={25} />
                                <h1 className="ml-2">Ghế:</h1>
                            </div>
                            <div className="flex space-x-1 flex-wrap">
                                {setGhe.map((seat) => (
                                    <h1 key={seat.id} className="font-bold">
                                        {seat.so_ghe}
                                    </h1>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#334767] rounded-es-[10px] rounded-ee-[10px] grid grid-rows-3 row-span-2 p-2">
                            <div className="grid items-center grid-cols-6 gap-2">
                                <div className=" grid  col-span-2 ">
                                    <h1 className="flex">
                                        <LuArmchair className="text-white mr-2" size={25} />
                                        Ghế:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">0 đ</h1>
                            </div>
                            <div className="grid items-center grid-cols-6 gap-2 ">
                                <div className=" grid  col-span-2 ">
                                    <h1 className="flex">
                                        <ImSpoonKnife className="text-white mr-2" size={25} />
                                        Combo:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">0 đ</h1>
                            </div>
                            <div className="grid items-center grid-cols-6 gap-2">
                                <div className=" grid col-span-2 ">
                                    <h1 className="">Tổng tiền:</h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">0 đ</h1>
                            </div>
                        </div>
                    </div>

                    <div className=" bg-white  flex rounded-[10px] col-span-3 max-lg:row-span-3 custom-height-sm9">
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'gray' }}>
                                <Tabs
                                    value={value}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: 0,
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'red',
                                        },
                                    }}
                                >
                                    <CustomTab
                                        label="1. Chọn ghế"
                                        isActive={value >= 0}
                                        sx={{ flexGrow: 1, textAlign: 'center' }} // Flex to occupy space and center text
                                    />
                                    <CustomTab
                                        label="2. Chọn đồ ăn và nước"
                                        isActive={value >= 1}
                                        sx={{ flexGrow: 1, textAlign: 'center' }}
                                    />
                                    <CustomTab
                                        label="3. Thanh toán"
                                        isActive={value === 2}
                                        sx={{ flexGrow: 1, textAlign: 'center' }}
                                    />
                                </Tabs>
                            </Box>

                            {value === 0 && <SeatComponent setSetGhe={setSetGhe} />}
                            {value === 1 && (
                                <FoodComponent selectedCombos={selectedCombos} setSelectedCombos={setSelectedCombos} />
                            )}
                            {value === 2 && <PayComponent />}
                            <Box
                                sx={{
                                    display: 'flex',
                                    position: 'absolute',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    bottom: 10,
                                    padding: '0 20px',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', padding: '2px 8px 2px 4px' }}
                                    onClick={handlePrevious}
                                    disabled={value === 0}
                                >
                                    <IoIosArrowBack size={20} />
                                    Quay lại
                                </Button>

                                {value === 2 ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            padding: '2px 4px 2px 8px',
                                        }}
                                        onClick={handleOpen}
                                    >
                                        Thanh toán
                                        <GrFormNext size={22} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            padding: '2px 4px 2px 8px',
                                        }}
                                        onClick={handleNext}
                                        disabled={value === 2}
                                    >
                                        Tiếp theo
                                        <GrFormNext size={22} />
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>
            <ModalComponent
                open={open}
                handleClose={handleClose}
                width="30%"
                height="45%"
                smallScreenWidth="45%"
                smallScreenHeight="33%"
                mediumScreenWidth="45%"
                mediumScreenHeight="30%"
                largeScreenHeight="25%"
                largeScreenWidth="45%"
                maxHeightScreenHeight="55%"
                maxHeightScreenWidth="45%"
                heightScreen="45%"
                title="Thanh toán"
            >
                <div className=" h-[80%] grid grid-rows-4 gap-y-10 pb-6 ">
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tổng tiền"
                        freeSolo={true}
                        disableClearable={false}
                        disabled={true}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                        className="bg-gray-300"
                    />
                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tiền khách đưa"
                        freeSolo={true}
                        disableClearable={false}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                    />

                    <AutoInputComponent
                        value={selectedMovie}
                        onChange={setSelectedMovie}
                        title="Tiền trả lại"
                        freeSolo={true}
                        disableClearable={false}
                        disabled={true}
                        placeholder="Nhập ..."
                        heightSelect={200}
                        className1="p-3"
                        className="bg-gray-300"
                    />
                    <div className="justify-end flex space-x-3 border-t py-4 px-4 mt-4 ">
                        <ButtonComponent text="Hủy" className="bg-[#a6a6a7]" onClick={handleClose} />
                        <ButtonComponent text="Xác nhận" className=" bg-blue-500 " />
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default Seat;
