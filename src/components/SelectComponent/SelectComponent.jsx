import { InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const SelectComponent = ({ value, onChange, className = '', className1 = '', title, options, selectStyles }) => {
    const defaultValue = options.length > 0 ? options[0].value : '';

    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: 150,
                overflowY: 'auto',
            },
        },
    };

    return (
        <div className={`${className1}`}>
            <InputLabel sx={{ fontSize: '16px', color: 'black', marginBottom: '5px' }}>{title}</InputLabel>
            <Select
                value={options.some((option) => option.value === value) ? value : defaultValue}
                onChange={onChange}
                displayEmpty
                className={`py-[6px] truncate  rounded-[5px] h-10 w-full ${className}`}
                MenuProps={menuProps}
                sx={{
                    height: '35px',
                    borderRadius: '5px',
                    '&.MuiOutlinedInput-root': {
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
                    ...selectStyles,
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default SelectComponent;
