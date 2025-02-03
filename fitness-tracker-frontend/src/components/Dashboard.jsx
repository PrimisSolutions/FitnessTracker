import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://localhost:5001/api/workouts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWorkouts(response.data);
        };
        fetchWorkouts();
    }, []);

    return (
        <div>
            <h1>Workouts</h1>
            <ul>
                {workouts.map(workout => (
                    <li key={workout.id}>{workout.type} - {workout.duration} minutes</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;