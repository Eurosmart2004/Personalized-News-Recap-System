import { createSlice } from '@reduxjs/toolkit';
import collectionAction from '../action/collectionAction';
/* 
state = {
{
    "collections" : [
        {
            "collection": {
                "id": 3,
                "name": "test"
            },
            "news": [
                {
                    "date": "13:51 17/01/2025 (GMT+0700)",
                    "id": 1,
                    "image": "https://i1-kinhdoanh.vnecdn.net/2025/01/17/microsoft-1737092146-173709216-2482-9938-1737093701.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=yqvBouwQL26Af8STHvUgpg",
                    "link": "https://vnexpress.net/microsoft-shell-mua-tin-chi-carbon-nhieu-nhat-the-gioi-4840174.html",
                    "summary": "Theo báo cáo của AlliedOffsets, Microsoft và Shell đã mua khoảng 20 triệu tín chỉ carbon vào năm ngoái, với mức giá chênh nhau tới 45 lần do khác biệt về nguồn gốc và chất lượng. Trong đó, Shell mua 14,5 triệu tín chỉ với giá trung bình 4,15 USD/tCO2, tập trung vào các dự án năng lượng tái tạo và trồng rừng để đạt mục tiêu phát thải ròng bằng 0 (Net Zero) vào năm 2050. Microsoft lại mua 5,5 triệu tín chỉ carbon với giá trung bình lên tới 189 USD/tCO2, chủ yếu từ các dự án loại bỏ carbon trực tiếp (CDR).",
                    "title": "Microsoft, Shell mua tín chỉ carbon nhiều nhất thế giới",
                    "topic": "economic"
                },
                ...
            ]
        },
        ...
    ],
}
*/

export const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        collections: null,
    },
    reducers: {
        setCollection: collectionAction.setCollection,
    }
});

export const { setCollection } = collectionSlice.actions;
export default collectionSlice.reducer;