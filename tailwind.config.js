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
        },
        screens: {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1025px',
            xl: '1281px',
            xxl: '1400px',
            pc: '1280px',
            xl900: '900px',
            mh850: '850px',
        },
    },
    plugins: [],
};
