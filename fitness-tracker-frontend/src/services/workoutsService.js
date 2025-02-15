import axios from 'axios';

const API_URL = 'https://localhost:5054/api/workouts';

const getWorkouts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export default { getWorkouts };