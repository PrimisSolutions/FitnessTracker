import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workoutService from '../services/workoutsService';

const Workouts = () => {
	const [workouts, setWorkouts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Workout form states
	const [open, setOpen] = useState(false);
	const [newWorkout, setNewWorkout] = useState({
		name: '',
		type: '',
		duration: 0,
		calories: 0,
		date: new Date().toISOString().split('T')[0]
	});
	const [formError, setFormError] = useState('');

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

	const handleAddWorkout = () => {
		//TODO: Pop up a window to let user add a workout when clicked
		setOpen(true)
	};

	const handleClose = () => {
		setOpen(false);
		setFormError('');
		setNewWorkout({
			name: '',
			type: '',
			duration: 0,
			calories: 0,
			date: new Date().toISOString().split('T')[0]
		});
	};

	// Form changes
	const handleChange = (e) => {
		const {name, value} = e.target;
		setNewWorkout({
			...newWorkout,
			[name]: value
		});
	};

	// Form submission
	const handleSubmit = async () => {
		// Validation
		if (!newWorkout.name || !newWorkout.type) {
			setFormError('Name and type are required.');
			return;
		}

		try {
			// Convert string to numbers where needed
			const workoutToSubmit = {
				...newWorkout,
				duration: parseFloat(newWorkout.duration),
				calories: parseFloat(newWorkout.calories)
			}

			const result = await workoutService.createWorkout(workoutToSubmit);
			setWorkouts([...workouts, result]);
			handleClose();
		} catch (error) {
			console.error('Failed to create workout:', error);
			setFormError('Failed to create workout. Please try again.');
		}
	}

	// Workout type options
	const workoutTypes = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'HIIT', 'Other']

	return (
		<div>
			<div>
				<button onClick={() => navigate('/dashboard')} className="back-button">
					Back to Dashboard
				</button>
			</div>
			<div>
				<h1>My Workouts</h1>
				<Button
				variant="contained"
				color="primary"
				onClick={handleAddWorkout}
				sx = {{ mb: 2 }}
				>
					Add Workout
				</Button>
			</div>
			{loading ? (
				<p>Loading workouts...</p>
			) : (
				<table>
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