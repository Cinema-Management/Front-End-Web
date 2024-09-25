import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Chip } from '@mui/material';

const Select = ({
    options,
    label,
    placeholder,
    defaultValue,
    onChange,
    className1,
    title,
    borderRadius,
    color,
    heightSelect,
    disableClearable,
    ...props
}) => {
    const [selectedOptions, setSelectedOptions] = useState(defaultValue || []);

    // Effect to handle default value updates
    useEffect(() => {
        if (defaultValue) {
            setSelectedOptions(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (event, value) => {
        setSelectedOptions(value);
        onChange(value);
    };

    return (
        <Stack spacing={2} sx={{ width: 'auto' }} className={`${className1}`}>
            <div>
                <h1 className="text-[16px] truncate mb-1">{title}</h1>
                <Autocomplete
                    multiple
                    disableClearable={disableClearable}
                    options={options.filter((option) => !selectedOptions.map((opt) => opt.code).includes(option.code))}
                    getOptionLabel={(option) => option.title || option}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    renderTags={(tagValue, getTagProps) => {
                        return (
                            <div style={{ display: 'flex', overflowX: 'auto', padding: '5px' }}>
                                {tagValue.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option.code} // Use a unique key, such as the code
                                        label={option.title}
                                        sx={{
                                            height: '25px',
                                            borderRadius: '5px',
                                            padding: '0px',
                                            margin: '0px',
                                            fontSize: '12px',
                                            marginLeft: '0px !important',
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '35px',
                                    borderRadius: borderRadius,
                                    color: color,
                                    padding: '0px 0px',
                                    paddingLeft: '10px',
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
                    sx={{
                        '& .MuiAutocomplete-tag': {
                            marginTop: '0px',
                            backgroundColor: 'silver',
                            marginLeft: '-5px',
                        },
                    }}
                />
            </div>
        </Stack>
    );
};

export default Select;
