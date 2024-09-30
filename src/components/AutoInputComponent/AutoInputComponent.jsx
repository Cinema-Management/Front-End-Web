import React, { useState } from 'react';
import { Autocomplete, TextField, Stack } from '@mui/material';

const AutoInputComponent = ({
    label, // Nhãn của input
    options = [], // Các tùy chọn cho Autocomplete
    value = '', // Giá trị mặc định ban đầu
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
    // Tạo một state để theo dõi giá trị nhập tạm thời (chưa commit)
    const [inputValue, setInputValue] = useState(value || ''); // Đảm bảo inputValue không bị undefined

    return (
        <Stack spacing={2} sx={{ width: 'auto' }} className={`${className1}`}>
            <div>
                <h1 className="text-[16px] truncate mb-1">{title}</h1>
                <Autocomplete
                    freeSolo={freeSolo}
                    disableClearable={disableClearable}
                    options={options}
                    getOptionLabel={(option) => option.name || option}
                    value={inputValue} // Giá trị được điều khiển (controlled)
                    inputValue={inputValue} // Giá trị input được điều khiển (controlled)
                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Cập nhật inputValue tạm thời
                    // Chỉ cập nhật giá trị khi người dùng chọn hoặc nhấn Enter
                    onChange={(event, newValue) => onChange(newValue)}
                    // Cập nhật giá trị khi người dùng rời khỏi input (blur)
                    onBlur={() => onChange(inputValue)}
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

export default React.memo(AutoInputComponent);
