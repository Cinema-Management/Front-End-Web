import React from 'react';
import { Modal, Box } from '@mui/material';

const ModalComponent = ({
    open,
    handleClose,
    width,
    height,
    top,
    left,
    children,
    smallScreenWidth,
    smallScreenHeight,
    mediumScreenWidth,
    mediumScreenHeight,
    largeScreenHeight,
    largeScreenWidth,
    maxHeightScreenHeight,
    maxHeightScreenWidth,
    title,
}) => {
    const style = {
        position: 'absolute',
        top: top || '50%',
        left: left || '50%',
        transform: 'translate(-50%, -50%)',
        width: width,
        height: height,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        // p: 3,
        '@media (max-width: 800px)': {
            width: smallScreenWidth,
            height: smallScreenHeight,
        },
        '@media (min-width: 801px) and (max-width: 960px)': {
            width: mediumScreenWidth,
            height: mediumScreenHeight,
        },
        '@media (min-height: 1300px)': {
            height: largeScreenHeight,
            width: largeScreenWidth,
        },
        '@media (max-height: 700px)': {
            height: maxHeightScreenHeight,
            width: maxHeightScreenWidth,
        },
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box sx={style}>
                <div className="border-b ">
                    <h1 className="uppercase font-bold text-[20px] py-2 px-4">{title}</h1>
                </div>
                {children}
            </Box>
        </Modal>
    );
};

export default ModalComponent;
