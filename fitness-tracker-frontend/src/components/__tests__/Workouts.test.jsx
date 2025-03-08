import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from 'react';
// useNavigate is used for mocking, eslint false positive.
// eslint-disable-next-line no-unused-vars
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Workouts from '../Workouts';
import workoutsService from '../../services/workoutsService';

// Mock custom service
vi.mock('../../services/workoutsService');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Workouts Component', () => {
    const mockWorkouts = [
        {
            id: 1,
            name: "Morning Run",
            type: 'Running',
            duration: 30,
            calories: 150,
            date: new Date().toISOString()
        },
        {
            id: 2,
            name: "Evening Walk",
            type: 'Walking',
            duration: 45,
            calories: 100,
            date: new Date().toISOString()
        },
        {
            id: 3,
            name: "10 Min HIIT Session",
            type: 'HIIT',
            duration: 60,
            calories: 200,
            date: new Date().toISOString()
        }
    ];

    const setup = async (mockData = mockWorkouts) => {
        // Mock token in localStorage
        localStorage.setItem('token', 'test-token');

        // Mock service methods
        workoutsService.getWorkouts.mockResolvedValue(mockData);
        workoutsService.createWorkout.mockImplementation(workout =>
            Promise.resolve({ ...workout, id: 999 }));

        return render(
            <BrowserRouter>
                <Workouts />
            </BrowserRouter>
        )
    }

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    })

    it('displays loading state initially', async () => {
        // Pause promise resolution
        workoutsService.getWorkouts.mockReturnValue(new Promise(() => { }));

        render(
            <BrowserRouter>
                <Workouts />
            </BrowserRouter>
        )

        // Should show loading text before data loads
        expect(screen.getByText(/loading workouts/i)).toBeInTheDocument();
    });

    it('displays workouts in a table after loading', async () => {
        await act(async () => {
            setup();
        });

        //  Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        })

        // Verify all workouts are displayed
        expect(screen.getByText('Morning Run')).toBeInTheDocument();
        expect(screen.getByText('Evening Walk')).toBeInTheDocument();
        expect(screen.getByText('10 Min HIIT Session')).toBeInTheDocument();

        // Verify workout service was called
        expect(workoutsService.getWorkouts).toHaveBeenCalledTimes(1);
    });

    it('navigates back to dashboard when back button pressed', async () => {
        await act(async () => {
            setup();
        });

        // Click back button
        fireEvent.click(screen.getByText(/back to dashboard/i));

        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('opens dialog when Add Workout button is called', async () => {
        await act(async () => {
            setup();
        });

        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        });

        // Dialog should not initially be visible
        expect(screen.queryByText(/add new workout/i)).not.toBeInTheDocument();

        // Click Add Workout button
        fireEvent.click(screen.getByText(/add workout/i));

        // Verify dialog is open
        expect(screen.getByText(/add new workout/i)).toBeInTheDocument();
    });

    it('validates form inputs before submission', async () => {
        await act(async () => {
            setup();
        });

        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        });

        // Click Add Workout button
        fireEvent.click(screen.getByText(/add workout/i));

        // Submit form without required fields
        fireEvent.click(screen.getByRole('button', { name: /add workout$/i }));

        // Verify validation error
        expect(screen.getByText(/name and type are required/i)).toBeInTheDocument();

        // Verify service was not called
        expect(workoutsService.createWorkout).not.toHaveBeenCalled();
    });

    it('adds a new workout when form is submitted', async () => {
        await act(async () => {
            setup();
        });

        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        });

        // Open dialog
        fireEvent.click(screen.getByText(/add workout/i));

        // Fill out form
        fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Test Workout' } });

        fireEvent.mouseDown(screen.getByLabelText(/workout type/i));
        fireEvent.click(screen.getByText('Cardio'));

        fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '45' } });

        fireEvent.change(screen.getByLabelText(/calories burned/i), { target: { value: '150' } });

        // Submit form
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /add workout$/i }));
        });

        // Verify service was called with correct data
        expect(workoutsService.createWorkout).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Workout',
            type: 'Cardio',
            duration: 45,
            calories: 150
        }));

        // Wait for dialog to close
        await waitFor(() => {
            expect(screen.queryByText(/add new workout/i)).not.toBeInTheDocument();
        });
    });

    it('handles empty workout list', async () => {
        await act(async () => {
            setup([]);
        });

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        });

        // Should render table but with no data rows
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.queryByText('Morning Run')).not.toBeInTheDocument();
    });

    it('closes dialog when cancel button is clicked', async () => {
        await act(async () => {
            setup();
        });

        await waitFor(() => {
            expect(screen.queryByText(/Loading workouts.../i)).not.toBeInTheDocument();
        });

        // Open dialog
        fireEvent.click(screen.getByText(/add workout/i));
        expect(screen.getByText(/add new workout/i)).toBeInTheDocument();

        // Click cancel button
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        // Due to animation speed, wait for dialog animation to be completed
        await waitFor(() => {
            expect(screen.queryByText(/add new workout/i)).not.toBeInTheDocument();
        });
    });
});