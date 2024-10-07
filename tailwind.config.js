/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                roboto: ['IBM Plex Sans'],
            },
            width: {
                '28p': '28%',
            },
            height: {
                '90p': '90%',
                '95p': '95%',
                '60p': '60%',
            },
            backgroundImage: {
                'custom-bg': "url('./assets/imgbg.png')", // Đảm bảo đường dẫn đúng
            },
        },
        screens: {
            xs: '320px',
            sm: '640px',
            md: '768px',
            air: '830px',
            lg: '1025px',
            xl: '1281px',
            xxl: '1500px',
            pc: '1280px',
            xl900: '900px',
            mh850: '850px',
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.print\\:block': {
                    '@media print': {
                        display: 'block',
                    },
                },
                '.print\\:hidden': {
                    '@media print': {
                        display: 'none',
                    },
                },
            };
            addUtilities(newUtilities);
        },
    ],
};
