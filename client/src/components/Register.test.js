import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { Register } from './Register';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Register Component', () => {
    it('renders the Register form', () => {
        const { getByText, getByPlaceholderText } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Ensure that the Register form elements are present
        expect(getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(getByPlaceholderText('Username')).toBeInTheDocument();
        expect(getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('registers a user successfully', async () => {
        // Mock a successful axios post request
        axios.post.mockResolvedValue({ data: 'Registration successful' });

        const { getByPlaceholderText, getByText, getByRole } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password1' } });

        fireEvent.click(getByRole('button', { name: 'Register' }));

        // Wait for success message to appear
        await waitFor(() => {
            expect(screen.getByText('Registration successful! Redirecting to login...')).toBeInTheDocument();
        });
    });

    it('handles registration error', async () => {
        // Mock an error axios post request
        axios.post.mockRejectedValue({ response: { data: { error: 'Registration failed' } } });

        const { getByPlaceholderText, getByText, getByRole } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password1' } });

        fireEvent.click(getByRole('button', { name: 'Register' }));

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
    });
});
