import React from 'react';
import { Autocomplete, TextField, Stack } from '@mui/material';

const AutoInputComponent = ({
    label, // Nhãn của input
    options = [], // Các tùy chọn cho Autocomplete
    value, // Giá trị hiện tại của input
    onChange, // Hàm xử lý khi giá trị thay đổi
    freeSolo, // Cho phép nhập tự do
    disableClearable,
    placeholder,
    className1,
    title,
    heightSelect,
    borderRadius,
    color,
    ...props // Các props khác tùy chỉnh
}) => {
    return (
        <Stack spacing={2} sx={{ width: 'auto' }} className={`${className1}`}>
            <div>
                <h1 className="text-[16px] truncate mb-1 ">{title}</h1>
                <Autocomplete
                    freeSolo={freeSolo}
                    disableClearable={disableClearable}
                    options={options}
                    value={value}
                    onChange={(event, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '35px',
                                    paddingLeft: '6px',
                                    borderRadius: borderRadius,
                                    color: color,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                            }}
                        />
                    )}
                    ListboxProps={{
                        style: {
                            height: 'auto',
                            maxHeight: heightSelect,
                        },
                    }}
                    {...props}
                />
            </div>
        </Stack>
    );
};

export default AutoInputComponent;
