function getFormattedDate(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function getFormatteNgay(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}

function FormatDate(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function FormatSchedule(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

function getFormattedDateTime(isoString) {
    const date = new Date(isoString);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

function handleChangAge(age) {
    if (age === 13) {
        return 'C13';
    } else if (age === 16) {
        return 'C16';
    } else if (age === 18) {
        return 'C18';
    } else {
        return 'P';
    }
}
function getDayName(day) {
    switch (day) {
        case 0:
            return 'CN';
        case 1:
            return '2';
        case 2:
            return '3';
        case 3:
            return '4';
        case 4:
            return '5';
        case 5:
            return '6';
        case 6:
            return '7';
        default:
            return '';
    }
}
function getTimeSlot(time) {
    switch (time) {
        case 1:
            return 'Cả ngày';
        case 2:
            return 'trước 17h';
        case 3:
            return 'sau 17h';

        default:
            return '';
    }
}

function getVideoIdFromUri(uri) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = uri.match(regex);
    return match ? match[1] : null;
}
module.exports = {
    getFormattedDate,
    getFormatteNgay,
    FormatDate,
    FormatSchedule,
    getFormattedDateTime,
    handleChangAge,
    getDayName,
    getTimeSlot,
    getVideoIdFromUri,
};
