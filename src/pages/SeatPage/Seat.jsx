import React from 'react';
import { LuArmchair } from 'react-icons/lu';
import { IoIosArrowBack } from 'react-icons/io';
import phim1 from '~/assets/phim1.png';
import screen from '~/assets/screen.png';
import seatvip from '~/assets/Seatvip.png';
import seat from '~/assets/Seat.png';
import seatcouple from '~/assets/Seatcouple.png';
import { ImSpoonKnife } from 'react-icons/im';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { GrFormNext } from 'react-icons/gr';
import { styled } from '@mui/system';

const CustomTab = styled(Tab)(({ isActive }) => ({
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleNext = () => {
        if (value < 2) setValue(value + 1);
    };

    const handlePrevious = () => {
        if (value > 0) setValue(value - 1);
    };

    const seats = [
        // Ghế thường
        {
            id: '0-0',
            ma_san_pham: 'SP1',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 1,
            so_ghe: 'A1',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-1',
            ma_san_pham: 'SP2',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 2,
            so_ghe: 'A2',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-2',
            ma_san_pham: 'SP3',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 3,
            so_ghe: 'A3',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-3',
            ma_san_pham: 'SP4',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 4,
            so_ghe: 'A4',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-4',
            ma_san_pham: 'SP5',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 5,
            so_ghe: 'A5',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-5',
            ma_san_pham: 'SP6',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 6,
            so_ghe: 'A6',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-6',
            ma_san_pham: 'SP7',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 7,
            so_ghe: 'A7',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-7',
            ma_san_pham: 'SP8',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 8,
            so_ghe: 'A8',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-8',
            ma_san_pham: 'SP9',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 9,
            so_ghe: 'A9',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-9',
            ma_san_pham: 'SP10',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 10,
            so_ghe: 'A10',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-0',
            ma_san_pham: 'SP1',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 1,
            so_ghe: 'A1',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-1',
            ma_san_pham: 'SP2',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 2,
            so_ghe: 'A2',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-2',
            ma_san_pham: 'SP3',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 3,
            so_ghe: 'A3',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-3',
            ma_san_pham: 'SP4',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 4,
            so_ghe: 'A4',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-4',
            ma_san_pham: 'SP5',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 5,
            so_ghe: 'A5',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-5',
            ma_san_pham: 'SP6',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 6,
            so_ghe: 'A6',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-6',
            ma_san_pham: 'SP7',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 7,
            so_ghe: 'A7',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-7',
            ma_san_pham: 'SP8',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 8,
            so_ghe: 'A8',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-8',
            ma_san_pham: 'SP9',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 9,
            so_ghe: 'A9',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-9',
            ma_san_pham: 'SP10',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 10,
            so_ghe: 'A10',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-0',
            ma_san_pham: 'SP1',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 1,
            so_ghe: 'A1',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-1',
            ma_san_pham: 'SP2',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 2,
            so_ghe: 'A2',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-2',
            ma_san_pham: 'SP3',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 3,
            so_ghe: 'A3',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-3',
            ma_san_pham: 'SP4',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 4,
            so_ghe: 'A4',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-4',
            ma_san_pham: 'SP5',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 5,
            so_ghe: 'A5',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-5',
            ma_san_pham: 'SP6',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 6,
            so_ghe: 'A6',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-6',
            ma_san_pham: 'SP7',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 7,
            so_ghe: 'A7',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-7',
            ma_san_pham: 'SP8',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 8,
            so_ghe: 'A8',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-8',
            ma_san_pham: 'SP9',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 9,
            so_ghe: 'A9',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-9',
            ma_san_pham: 'SP10',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 10,
            so_ghe: 'A10',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-0',
            ma_san_pham: 'SP1',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 1,
            so_ghe: 'A1',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-1',
            ma_san_pham: 'SP2',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 2,
            so_ghe: 'A2',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-2',
            ma_san_pham: 'SP3',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 3,
            so_ghe: 'A3',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-3',
            ma_san_pham: 'SP4',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 4,
            so_ghe: 'A4',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-4',
            ma_san_pham: 'SP5',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 5,
            so_ghe: 'A5',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-5',
            ma_san_pham: 'SP6',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 6,
            so_ghe: 'A6',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-6',
            ma_san_pham: 'SP7',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 7,
            so_ghe: 'A7',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-7',
            ma_san_pham: 'SP8',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 8,
            so_ghe: 'A8',
            kieu: 0,
            trang_thai: 0,
        },
        {
            id: '0-8',
            ma_san_pham: 'SP9',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 9,
            so_ghe: 'A9',
            kieu: 0,
            trang_thai: 1,
        },
        {
            id: '0-9',
            ma_san_pham: 'SP10',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Thường',
            anh_san_pham: seat,
            vi_tri_hang: 'A',
            vi_tri_cot: 10,
            so_ghe: 'A10',
            kieu: 0,
            trang_thai: 0,
        },

        // Ghế VIP
        {
            id: '1-0',
            ma_san_pham: 'SP21',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 1,
            so_ghe: 'B1',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-1',
            ma_san_pham: 'SP22',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 2,
            so_ghe: 'B2',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-2',
            ma_san_pham: 'SP23',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 3,
            so_ghe: 'B3',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-3',
            ma_san_pham: 'SP24',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 4,
            so_ghe: 'B4',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-4',
            ma_san_pham: 'SP25',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 5,
            so_ghe: 'B5',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-5',
            ma_san_pham: 'SP26',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 6,
            so_ghe: 'B6',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-6',
            ma_san_pham: 'SP27',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 7,
            so_ghe: 'B7',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-7',
            ma_san_pham: 'SP28',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 8,
            so_ghe: 'B8',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-8',
            ma_san_pham: 'SP29',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 9,
            so_ghe: 'B9',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-9',
            ma_san_pham: 'SP30',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 10,
            so_ghe: 'B10',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-0',
            ma_san_pham: 'SP21',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 1,
            so_ghe: 'B1',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-1',
            ma_san_pham: 'SP22',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 2,
            so_ghe: 'B2',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-2',
            ma_san_pham: 'SP23',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 3,
            so_ghe: 'B3',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-3',
            ma_san_pham: 'SP24',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 4,
            so_ghe: 'B4',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-4',
            ma_san_pham: 'SP25',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 5,
            so_ghe: 'B5',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-5',
            ma_san_pham: 'SP26',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 6,
            so_ghe: 'B6',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-6',
            ma_san_pham: 'SP27',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 7,
            so_ghe: 'B7',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-7',
            ma_san_pham: 'SP28',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 8,
            so_ghe: 'B8',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-8',
            ma_san_pham: 'SP29',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 9,
            so_ghe: 'B9',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-9',
            ma_san_pham: 'SP30',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 10,
            so_ghe: 'B10',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-0',
            ma_san_pham: 'SP21',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 1,
            so_ghe: 'B1',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-1',
            ma_san_pham: 'SP22',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 2,
            so_ghe: 'B2',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-2',
            ma_san_pham: 'SP23',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 3,
            so_ghe: 'B3',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-3',
            ma_san_pham: 'SP24',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 4,
            so_ghe: 'B4',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-4',
            ma_san_pham: 'SP25',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 5,
            so_ghe: 'B5',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-5',
            ma_san_pham: 'SP26',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 6,
            so_ghe: 'B6',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-6',
            ma_san_pham: 'SP27',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 7,
            so_ghe: 'B7',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-7',
            ma_san_pham: 'SP28',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 8,
            so_ghe: 'B8',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-8',
            ma_san_pham: 'SP29',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 9,
            so_ghe: 'B9',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-9',
            ma_san_pham: 'SP30',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 10,
            so_ghe: 'B10',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-0',
            ma_san_pham: 'SP21',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 1,
            so_ghe: 'B1',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-1',
            ma_san_pham: 'SP22',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 2,
            so_ghe: 'B2',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-2',
            ma_san_pham: 'SP23',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 3,
            so_ghe: 'B3',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-3',
            ma_san_pham: 'SP24',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 4,
            so_ghe: 'B4',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-4',
            ma_san_pham: 'SP25',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 5,
            so_ghe: 'B5',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-5',
            ma_san_pham: 'SP26',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 6,
            so_ghe: 'B6',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-6',
            ma_san_pham: 'SP27',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 7,
            so_ghe: 'B7',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-7',
            ma_san_pham: 'SP28',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 8,
            so_ghe: 'B8',
            kieu: 1,
            trang_thai: 1,
        },
        {
            id: '1-8',
            ma_san_pham: 'SP29',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 9,
            so_ghe: 'B9',
            kieu: 1,
            trang_thai: 0,
        },
        {
            id: '1-9',
            ma_san_pham: 'SP30',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế VIP',
            anh_san_pham: seatvip,
            vi_tri_hang: 'B',
            vi_tri_cot: 10,
            so_ghe: 'B10',
            kieu: 1,
            trang_thai: 1,
        },

        // Ghế đôi
        {
            id: '2-0',
            ma_san_pham: 'SP11',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 1,
            so_ghe: 'C1',
            kieu: 2,
            trang_thai: 0,
        },
        {
            id: '2-1',
            ma_san_pham: 'SP12',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 2,
            so_ghe: 'C2',
            kieu: 2,
            trang_thai: 1,
        },
        {
            id: '2-2',
            ma_san_pham: 'SP13',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 3,
            so_ghe: 'C3',
            kieu: 2,
            trang_thai: 0,
        },
        {
            id: '2-3',
            ma_san_pham: 'SP14',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 4,
            so_ghe: 'C4',
            kieu: 2,
            trang_thai: 1,
        },
        {
            id: '2-4',
            ma_san_pham: 'SP15',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 5,
            so_ghe: 'C5',
            kieu: 2,
            trang_thai: 0,
        },
        {
            id: '2-5',
            ma_san_pham: 'SP16',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 6,
            so_ghe: 'C6',
            kieu: 2,
            trang_thai: 1,
        },
        {
            id: '2-6',
            ma_san_pham: 'SP17',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 7,
            so_ghe: 'C7',
            kieu: 2,
            trang_thai: 0,
        },
        {
            id: '2-7',
            ma_san_pham: 'SP18',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 8,
            so_ghe: 'C8',
            kieu: 2,
            trang_thai: 1,
        },
        {
            id: '2-8',
            ma_san_pham: 'SP19',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 9,
            so_ghe: 'C9',
            kieu: 2,
            trang_thai: 0,
        },
        {
            id: '2-9',
            ma_san_pham: 'SP20',
            ma_phong: 'PH1',
            ten_san_pham: 'Ghế Đôi',
            anh_san_pham: seatcouple,
            vi_tri_hang: 'C',
            vi_tri_cot: 10,
            so_ghe: 'C10',
            kieu: 2,
            trang_thai: 1,
        },
    ];

    function CustomTabPanel() {
        const handleSeatClick = (id) => {
            console.log(`Ghế ${id} được chọn`);
            // Thêm logic của bạn cho việc chọn ghế ở đây
        };
        return (
            <div className="grid grid-rows-5 max-lg:grid-rows-7 h-[500px] custom-height-md2 ">
                <div className=" grid max-lg:row-span-2  ">
                    <div className=" grid grid-cols-4 max-lg:grid-cols-3  h-[100px]">
                        <div className="grid grid-rows-3  text-[13px] gap-1 pt-3 pl-3">
                            <div className="flex ">
                                <img src={seat} alt="seat" className="object-contain h-[20px] " />
                                <h1 className="ml-3">Ghế thường</h1>
                            </div>
                            <div className="flex">
                                <img src={seatvip} alt="seat" className="object-contain h-[25px] " />
                                <h1 className="ml-3">Ghế vip</h1>
                            </div>
                            <div className="flex">
                                <img src={seatcouple} alt="seat" className="object-contain h-[25px] " />
                                <h1 className="ml-3">Ghế đôi</h1>
                            </div>
                        </div>

                        <div className=" items-center grid justify-center col-span-2 max-lg:col-span-1">
                            <img src={screen} alt="screen" className="object-contain h-[80px] " />
                        </div>
                        <div className=" grid-rows-4 custom-height-sm10 text-[13px] justify-end grid gap-1 pt-2 items-center  pr-3">
                            <div className="flex">
                                <div className="bg-[#64DAF4] custom-height-sm11 px-6"></div>
                                <h1 className="ml-3">Ghế đang chọn</h1>
                            </div>
                            <div className="flex">
                                <div className="bg-[#007AFF] custom-height-sm11 px-6"></div>
                                <h1 className="ml-3">Ghế đang giữ</h1>
                            </div>
                            <div className="flex">
                                <div className="bg-[#FB5B5E] px-6"></div>
                                <h1 className="ml-3">Ghế đã đặt</h1>
                            </div>
                            <div className="flex">
                                <div className="bg-[#F1BE3F] px-6"></div>
                                <h1 className="ml-3">Ghế bảo trì</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row-span-4 max-lg:row-span-5 mt-3 custom-height-sm12  ">
                    <div className="grid grid-cols-10 px-40 max-lg:px-5 max-air:gap-[6px] gap-3 custom-height-sm14 mt-2">
                        {seats.map((seat) => (
                            <div
                                key={seat.id}
                                className={`relative flex text-[13px] justify-center items-center 
                                 ${seat.ten_san_pham === 'Ghế Thường' ? 'h-[22px]' : 'h-[35px]'} 
                                ${seat.ten_san_pham === 'Ghế Thường' ? ' custom-height-md3 ' : ' custom-height-md4'} 
                              ${seat.ten_san_pham === 'Ghế Thường' ? 'custom-height-sm6 ' : ' custom-height-sm7'} 
                                w-full cursor-pointer`}
                                onClick={() => seat.trang_thai === 0 && handleSeatClick(seat.id)}
                                style={{
                                    // opacity: seat.trang_thai === 1 ? 0.6 : 1,
                                    gridColumn: seat.ten_san_pham === 'Ghế Đôi' ? 'span 2' : 'span 1', // Ghế VIP chiếm 2 cột
                                }}
                            >
                                <img
                                    src={seat.anh_san_pham}
                                    alt={seat.ten_san_pham}
                                    className="object-cover w-full h-full "
                                />
                                <div className="absolute text-[12px] text-center">{seat.so_ghe}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    function CustomTabPanel2() {
        return (
            <div>
                <h1> Màn hình3</h1>
            </div>
        );
    }
    function CustomTabPanel1() {
        return (
            <div>
                <h1> Màn hình2</h1>
            </div>
        );
    }
    return (
        <div className="max-h-screen">
            <div className=" rounded-[10px] px-4 h-[675px] custom-height-xxl2 max-h-screen custom-height-sm3 custom-height-md1 custom-height-lg1 custom-height-xl1">
                <div className="flex mb-1">
                    <button
                        className="flex border rounded-md text-white bg-[#FB5B5E] py-1 justify-between items-center"
                        onClick={() => {
                            setSelectSchedule(false);
                        }}
                    >
                        <IoIosArrowBack className="text-[black]" color="white" size={22} />
                        <h1 className="text-[14px] pr-2 ">Quay lại</h1>
                    </button>
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
                            <div className=" flex items-center">
                                <LuArmchair className="text-white" size={25} />
                                <h1 className="ml-2">Ghế:</h1>
                            </div>
                            <h1>A1, A2, A3, A4, A5, A6, A7, A8 </h1>
                        </div>

                        <div className="bg-[#334767] rounded-es-[10px] rounded-ee-[10px] grid grid-rows-3 row-span-2 p-2">
                            <div className="grid grid-cols-6 gap-2">
                                <div className=" grid items-center col-span-2 ">
                                    <h1 className="flex">
                                        <LuArmchair className="text-white mr-2" size={25} />
                                        Ghế:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">160,000 đ</h1>
                            </div>
                            <div className="grid grid-cols-6 gap-2 ">
                                <div className=" grid items-center col-span-2 ">
                                    <h1 className="flex">
                                        <ImSpoonKnife className="text-white mr-2" size={25} />
                                        Combo:
                                    </h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">0 đ</h1>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                <div className=" grid items-center col-span-2 ">
                                    <h1 className="">Tổng tiền:</h1>
                                </div>
                                <h1 className="font-bold grid col-span-4 justify-items-end">160,000 đ</h1>
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

                            {value === 0 && <CustomTabPanel />}
                            {value === 1 && <CustomTabPanel1 />}
                            {value === 2 && <CustomTabPanel2 />}
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
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seat;
