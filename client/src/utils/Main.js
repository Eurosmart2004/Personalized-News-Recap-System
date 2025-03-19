import dayjs from "dayjs";
export const BASEURL = `${process.env.REACT_APP_SERVER_URL}/api` || 'http://localhost:5000/api';
export const TOPIC = {
    "news": "Thời sự",
    "politic": "Chính trị",
    "economic": "Kinh tế",
    "sport": "Thể thao",
    "health": "Sức khỏe",
    "car": "Xe",
    "technology": "Công nghệ",
};

export const DOMAIN = {
    "vnexpress.net": {
        "logo": `${process.env.PUBLIC_URL}/logo/vnexpress.webp`,
        "name": "VnExpress"
    },
    "baotintuc.vn": {
        "logo": `${process.env.PUBLIC_URL}/logo/baotintuc.png`,
        "name": "Thông Tấn Xã Việt Nam"
    },
    "dantri.com.vn": {
        "logo": `${process.env.PUBLIC_URL}/logo/dantri.png`,
        "name": "Dân Trí"
    },
    "vietnamnet.vn": {
        "logo": `${process.env.PUBLIC_URL}/logo/vietnamnet.png`,
        "name": "VietNamNet"
    },
    "thanhnien.vn": {
        "logo": `${process.env.PUBLIC_URL}/logo/thanhnien.png`,
        "name": "Thanh Niên"
    }
};

export const formatDateTime = (input) => {
    const parts = input.split(" ");
    const time = parts[0]; // "11:53:00"
    const dateParts = parts[1].split("/"); // ["15", "03", "2025"]

    const formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
    const formattedTime = time.slice(0, 5); // "11:53"

    return `${formattedDate} ${formattedTime}`;
};

export const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
};

export const extractDomain = (url) => {
    try {
        const hostname = new URL(url).hostname;
        const domainParts = hostname.split('.');
        // Handle cases with subdomains
        if (domainParts.length > 2) {
            return domainParts.slice(-3).join('.');
        }
        return domainParts.slice(-2).join('.');
    } catch (error) {
        console.error("Invalid URL:", url, error);
        return null;
    }
};