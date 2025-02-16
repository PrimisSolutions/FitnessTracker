import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import Dashboard from '../Dashboard'

// Mock axios calls
vi.mock('axios')

describe('Dashboard Component', () => {
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

	it('renders and fetches workouts', async () => {
		await setup([{ id: 1, type: 'Running', duration: 30 }])

		// Wait for workouts to load
		expect(await screen.findByText(/running - 30 minutes/i)).toBeInTheDocument()
		// Verify axios call
		expect(axios.get).toHaveBeenCalledWith('https://localhost:5001/api/workouts', {
			headers: { Authorization: 'Bearer test-token' }
		})
	})

	it('logs out and redirects', async () => {
		const { findByText } = await setup()

		// Click logout button
		const logoutButton = await findByText(/logout/i)
		fireEvent.click(logoutButton)

		// Token removed from localStorage
		expect(localStorage.getItem('token')).toBeNull()
		// You can add additional checks for navigation if needed
	})
})