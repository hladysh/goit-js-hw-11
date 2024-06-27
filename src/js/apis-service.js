import axios from 'axios';

const API_KEY = '44624200-09d3ba93349a0766cb6ff30e2';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page) => {
    const response = await axios.get(`${BASE_URL}`, {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: page,
            per_page: 40,
        },
    });
    return response.data;
};
