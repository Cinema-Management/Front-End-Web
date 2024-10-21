import React, { useEffect, useState } from 'react';
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
    type,
    heightSelect,
    borderRadius,
    color,
    ...props // Các props khác tùy chỉnh
}) => {
    const [inputValue, setInputValue] = useState(value || '');
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleInputChange = (newInputValue) => {
        if (type === 'number') {
            const numericValue = parseFloat(newInputValue);
            if (numericValue <= 0) {
                return;
            }
        }
        setInputValue(newInputValue);
    };
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
                    onInputChange={(event, newInputValue) => handleInputChange(newInputValue)}
                    // Chỉ cập nhật giá trị khi người dùng chọn hoặc nhấn Enter
                    onChange={(event, newValue) => onChange(newValue)}
                    // Cập nhật giá trị khi người dùng rời khỏi input (blur)
                    onBlur={() => onChange(inputValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            type={type}
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
