import { useState, useEffect } from 'react';

const HeightComponent = () => {
    const [height, setHeight] = useState(440);

    const updateHeight = () => {
        const screenHeight = window.innerHeight;

        if (screenHeight === 600) {
            setHeight(300); // Màn hình Nest hub
        } else if (screenHeight > 700 && screenHeight < 750) {
            setHeight(430);
        } else if (screenHeight === 800) {
            setHeight(480); // Màn hình lớn
        } else if (screenHeight > 1015 && screenHeight < 1030) {
            setHeight(680); // Màn hình Air
        } else if (screenHeight > 1175 && screenHeight < 1190) {
            setHeight(830); // Màn hình Air
        } else if (screenHeight >= 1360) {
            setHeight(1030); // Màn hình Air Pro
        } else {
            setHeight(300);
        }
    };

    useEffect(() => {
        // Tính toán chiều cao ban đầu khi component được mount
        updateHeight();

        // Lắng nghe sự thay đổi kích thước cửa sổ để cập nhật chiều cao
        window.addEventListener('resize', updateHeight);

        // Cleanup event listener khi component bị unmount
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return height; // Trả về chiều cao
};

export default HeightComponent;
