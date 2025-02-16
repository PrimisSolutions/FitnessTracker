import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workoutService from '../services/workoutsService';
import './Workouts.css';

const Workouts = () => {
	const [workouts, setWorkouts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const data = await workoutService.getWorkouts();
				setWorkouts(data);
			} catch (error) {
				console.error('Failed to fetch workouts:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchWorkouts();
	}, []);

	return (
		<div className="workouts-container">
			<div>
				<button onClick={() => navigate('/dashboard')} className="back-button">
					Back to Dashboard
				</button>
			</div>
			<div className="header">
				<h1>My Workouts</h1>
			</div>
			{loading ? (
				<p>Loading workouts...</p>
			) : (
				<table className="workouts-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Duration (mins)</th>
							<th>Calories</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{workouts.map(workout => (
							<tr key={workout.id}>
								<td>{workout.name}</td>
								<td>{workout.type}</td>
								<td>{workout.duration}</td>
								<td>{workout.calories}</td>
								<td>{new Date(workout.date).toLocaleDateString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Workouts;