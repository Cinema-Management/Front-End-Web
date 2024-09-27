import React from 'react';

const InputComponent = ({
    placeholder,
    readOnly,
    value,
    disabled,
    onChange,
    className = '',
    className1 = '',
    title,
    type = 'text',
}) => {
    const handleChange = (event) => {
        if (event && event.target) {
            onChange(event);
        }
    };

    return (
        <div className={`${className1}`}>
            <h1 className="text-[16px] truncate mb-1">{title}</h1>
            <input
                placeholder={placeholder}
                value={value}
                onChange={handleChange} // Sử dụng handleChange
                className={`border py-[6px] px-4 truncate border-[black] h-[35px] w-full focus:border-[black] ${className}`}
                type={type}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    );
};

export default InputComponent;
