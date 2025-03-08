import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Dashboard from '../Dashboard'

// Mock axios calls
vi.mock('axios')

describe('Dashboard Component', () => {
	const mockWorkouts = [
		{
			id: 1,
			name: "Morning Run",
			type: 'Running',
			duration: 30,
			calories: 150,
			date: new Date().toISOString()
		}
	];

	const setup = async (mockData = []) => {
		// Mock token in localStorage
		localStorage.setItem('token', 'test-token')

		// Mock axios response
		axios.get.mockResolvedValue({
			data: mockData
		})

		return render(
			<BrowserRouter>
				<Dashboard />
			</BrowserRouter>
		)
	}

	beforeEach(() => {
		localStorage.clear()
		vi.clearAllMocks()
	})

	it('renders and fetches workouts successfully', async () => {
		await act(async () => { 
			await setup(mockWorkouts)
		 })

		// Wait for workouts to load
		expect(await screen.findByText(`${mockWorkouts[0].type} – ${mockWorkouts[0].duration} minutes`))
			.toBeInTheDocument()
		// Verify axios call
		expect(axios.get).toHaveBeenCalledWith('https://localhost:5054/api/workout', {
			headers: { Authorization: 'Bearer test-token' }
		})
	})

	it('displays "No workouts found" when workouts array is empty', async () => {
		await act(async () => {
			await setup([])
		})

		// Check for empty state message
		expect(await screen.findByText(/no workouts found/i)).toBeInTheDocument()
		// Verify axios call
		expect(axios.get).toHaveBeenCalledWith('https://localhost:5054/api/workout', {
			headers: { Authorization: 'Bearer test-token' }
		})
	})

	it('logs out and redirects', async () => {
		let findByText;
		await act(async () => {
			const setupResult = await setup();
			findByText = setupResult.findByText;
		});

		// Click logout button
		const logoutButton = await findByText(/logout/i)
		fireEvent.click(logoutButton)

		// Token removed from localStorage
		expect(localStorage.getItem('token')).toBeNull()
		// You can add additional checks for navigation if needed
	})
})