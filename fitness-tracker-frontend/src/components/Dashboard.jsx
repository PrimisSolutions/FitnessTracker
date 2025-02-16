import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
	const [workouts, setWorkouts] = useState([]);
	const navigate = useNavigate();

	const handleLogout = () => {
		clearLocalStorage();
		navigate('/login');
	}

	const clearLocalStorage = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
	};

	useEffect(() => {
		const fetchWorkouts = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get('https://localhost:5054/api/workouts', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setWorkouts(response.data);
		};
		fetchWorkouts();
	}, []);

	return (
		<div className='dashboard'>
			<button className='logout-button' onClick={handleLogout}>Logout</button>
			<div className='dashboard-grid'>
				<button className='grid-item' onClick={() => navigate('/workouts')}
				>
					<h2>Workouts</h2>
					<ul>
						{workouts.slice(0, 5).map(workout => (
							<li key={workout.id}>{workout.type} - {workout.duration} minutes</li>
						))}
					</ul>
				</button>
				<button className='grid-item' onClick={() => navigate('/exercises')}>
					<h2>Exercises</h2>
					<ul>
						<li>Coming soon...</li>
					</ul>
				</button>
				<button className='grid-item' onClick={() => navigate('/diet')}>
					<h2>Diet</h2>
					<ul>
						<li>Coming soon...</li>
					</ul>
				</button>
				<button className='grid-item' onClick={() => navigate('/calories')}>
					<h2>Calories</h2>
					<ul>
						<li>Coming soon...</li>
					</ul>
				</button>
			</div>
		</div>
	);
};

export default Dashboard;