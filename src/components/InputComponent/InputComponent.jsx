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
    return (
        <div className={`${className1}`}>
            <h1 className="text-[16px] truncate mb-1 ">{title}</h1>
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`border py-[6px] px-4 truncate border-[gray] rounded-[10px] h-10 w-full ${className}`}
                type={type}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    );
};

export default InputComponent;
