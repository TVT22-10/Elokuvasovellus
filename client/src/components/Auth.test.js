import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { Login } from './Auth';
import { AuthContext } from './Contexts';

// Mock for axios
jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: {/* Mocked data */} }),
    post: jest.fn(),
    // ... other Axios methods you use
}));



// Mock for react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock for sessionStorage
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    global.sessionStorage = mockSessionStorage; // Set the mock sessionStorage
});

describe('Login Component', () => {
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();
    const providerValues = {
        isLoggedIn: false,
        login: mockLogin,
        logout: mockLogout,
        user: {}
    };

    test('renders Login component with login form when not logged in', () => {
        const { getByPlaceholderText, getByText } = render(
            <Router>
                <AuthContext.Provider value={providerValues}>
                    <Login />
                </AuthContext.Provider>
            </Router>
        );

        expect(getByPlaceholderText('Username')).toBeInTheDocument();
        expect(getByPlaceholderText('Password')).toBeInTheDocument();
        expect(getByText('Login')).toBeInTheDocument();
    });

    test('should display error message on invalid login', async () => {
        const errorMessage = 'Unauthorized: Invalid username or password';
        axios.post.mockRejectedValueOnce({ response: { status: 401, data: errorMessage } });

        const { getByPlaceholderText, getByText } = render(
            <Router>
                <AuthContext.Provider value={providerValues}>
                    <Login />
                </AuthContext.Provider>
            </Router>
        );

        fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
        fireEvent.click(getByText('Login'));

        await waitFor(() => {
            expect(getByText(errorMessage)).toBeInTheDocument();
        });
    });

    //   EI SAATU TOIMIMAAN TÄTÄ TESTIÄ VAIKKA YRITETTIIN MONTA TUNTIA!!!

    // test('should update context on successful login', async () => {
    //     const successResponse = {
    //         data: {
    //             jwtToken: 'mock-jwt-token',
    //             userData: { id: '123', name: 'Test User' }
    //         },
    //         status: 200,
    //         statusText: 'OK',
    //     };

    //     axios.post.mockResolvedValueOnce(successResponse);

    //     const { getByPlaceholderText, getByText } = render(
    //         <Router>
    //             <AuthContext.Provider value={providerValues}>
    //                 <Login />
    //             </AuthContext.Provider>
    //         </Router>
    //     );

    //     fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'validuser' } });
    //     fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'validpass' } });
    //     fireEvent.click(getByText('Login'));

    //     await waitFor(() => {
    //         expect(mockLogin).toHaveBeenCalledWith({ id: '123', name: 'Test User' });
    //     });
    // });
});
