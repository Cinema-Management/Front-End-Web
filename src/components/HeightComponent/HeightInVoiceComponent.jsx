import { useState, useEffect } from 'react';

const HeightInVoiceComponent = () => {
    const [height, setHeight] = useState(410);
    const updateHeight = () => {
        const screenHeight = window.innerHeight;
        console.log(screenHeight);
        if (screenHeight === 600) {
            setHeight(210); // Màn hình Nest hub
        } else if (screenHeight > 700 && screenHeight < 750) {
            setHeight(360);
        } else if (screenHeight === 800) {
            setHeight(420); // Màn hình lớn
        } else if (screenHeight > 1015 && screenHeight < 1030) {
            setHeight(608); // Màn hình Air
        } else if (screenHeight > 1175 && screenHeight < 1190) {
            setHeight(750); // Màn hình Air
        } else if (screenHeight >= 1360) {
            setHeight(1000); // Màn hình Air Pro
        } else {
            setHeight(270);
        }
    };

    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);

        // Cleanup event listener khi component bị unmount
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return height; // Trả về chiều cao
};

export default HeightInVoiceComponent;
