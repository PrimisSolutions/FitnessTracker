import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'

describe('Login Component', () => {
	const setup = () => {
		return render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		)
	}

	it('renders login form', () => {
		setup()
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
	})

	it('shows browser validation for empty username', async () => {
		setup();
		const emailInput = screen.getByLabelText(/email/i)

		expect(emailInput).toBeRequired();
		expect(emailInput).toHaveAttribute('type', 'email');
	})

	it('shows browser validation error when form is submitted empty', async () => {
		setup()
		const emailInput = screen.getByLabelText(/email/i)
		const passwordInput = screen.getByLabelText(/password/i)
		const submitButton = screen.getByRole('button', { name: /login/i })

		fireEvent.click(submitButton)

		expect(emailInput).toBeInvalid()
		expect(passwordInput).toBeInvalid()
	})
})