import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
	Box, Button, AppBar, Toolbar, Typography, Drawer, List,
	ListItem, ListItemButton, ListItemText, Grid2, Card, CardContent
} from '@mui/material';
import DashboardCard from './DashboardCard';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

// Constants
const DRAWER_WIDTH = 240;

// Navigation items
const MENU_ITEMS = [
	{ text: 'Dashboard', path: '/dashboard' },
	{ text: 'Profile', path: '/profile' },
	{ text: 'Settings', path: '/settings' }
];

// Dashboard cards configuration
const DASHBOARD_CARDS = [
	{
		title: 'Workouts', path: '/workouts', getContent: (workouts) =>
			workouts.length > 0 ? workouts.slice(0, 5).map(w => `${w.type} – ${w.duration} minutes`) : ['No workouts found']
	},
	{ title: 'Exercises', path: '/exercises', getContent: () => ['Coming soon...'] },
	{ title: 'Diet', path: '/diet', getContent: () => ['Coming soon...'] },
	{ title: 'Challenges', path: '/challenges', getContent: () => ['Coming soon...'] }
];

const Dashboard = () => {
	const [workouts, setWorkouts] = useState([]);
	const navigate = useNavigate();

	// Handle authentication
	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		navigate('/login');
	};

	// Fetch data
	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('https://localhost:5054/api/workout', {
					headers: { Authorization: `Bearer ${token}` }
				});
				setWorkouts(response.data);
			} catch (error) {
				console.error('Failed to fetch workouts:', error);
			}
		};
		fetchWorkouts();
	}, []);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<DashboardHeader onLogout={handleLogout} />
			<DashboardSidebar menuItems={MENU_ITEMS} onNavigate={navigate} />
			{/* Main Content */}
			<Grid2 
			container 
			spacing={{ xs: 2, md: 3}}
			columns={{ xs: 4, sm: 8, md: 12 }}>
				{DASHBOARD_CARDS.map((card) => (
					<Grid2 key={`grid-${card.title}`}
					 size={{xs: 2, sm: 4, md: 6}} >
						<DashboardCard
							key={`card-${card.title}`}
							title={card.title}
							path={card.path}
							content={card.getContent(workouts)}
						/>
					</Grid2>
				))}
			</Grid2>
		</Box>
	);
};

export default Dashboard;