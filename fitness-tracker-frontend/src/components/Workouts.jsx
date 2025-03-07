import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
	Box, 
	Button, 
	Dialog, 
	DialogActions, 
	DialogContent, 
	DialogTitle, 
	FormControl, 
	InputLabel, 
	MenuItem, 
	Select, 
	TextField } from '@mui/material';
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

			{/* Workout Dialog */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add New Workout</DialogTitle>
				<DialogContent>
					{formError && (
						<Box sx={{ color: 'error.main', mb: 2}}>{formError}</Box>
					)}
					<TextField
					autoFocus
					margin="dense"
					id="name"
					name="name"
					label="Workout Name"
					type="text"
					fullWidth
					variant="outlined"
					value={newWorkout.name}
					onChange={handleChange}
					required
					sx = {{ mb: 2}}
					/>
				<FormControl fullWidth sx={{ mb: 2}}>
					<InputLabel id="workout-type-label">Workout Type</InputLabel>
					<Select
					labelId="workout-type-label"
					id="type"
					name="type"
					value={newWorkout.type}
					onChange={handleChange}
					required
					>
						{workoutTypes.map((type) => (
							<MenuItem key={type} value={type}>{type}</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
				margin="dense"
				id="duration"
				name="duration"
				label="Duration (mins)"
				type="number"
				fullWidth
				variant="outlined"
				value={newWorkout.duration}
				onChange={handleChange}
				sx={{ mb: 2}}
				/>
				<TextField
				margin="dense"
				id="calories"
				name="calories"
				label="Calories Burned"
				type="number"
				fullWidth
				variant="outlined"
				value={newWorkout.calories}
				onChange={handleChange}
				sx={{ mb: 2}}
				required
				/>
				<TextField
				margin="dense"
				id="date"
				name="date"
				label="Date"
				type="date"
				fullWidth
				variant="outlined"
				value={newWorkout.date}
				onChange={handleChange}
				required
				slotProps={{inputLabel: {shrink: true}}}
				/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit} variant="contained" color="primary">
						Add Workout
						</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Workouts;