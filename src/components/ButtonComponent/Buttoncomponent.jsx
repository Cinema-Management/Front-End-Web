import React from 'react';

const ButtonComponent = ({ text, onClick, className = '' }) => {
    return (
        <button onClick={onClick} className={`bg-[#FF5F5F] text-white rounded-[5px] w-[80px] h-8 ${className}`}>
            {text}
        </button>
    );
};

export default ButtonComponent;
