import axios from 'axios';

const API_URL = 'https://localhost:5054/api/workout';

const getWorkouts = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error;
    }
};

export default { getWorkouts };