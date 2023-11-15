import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { Register } from './components/Register';
import HomePage from './pages/start/start'; // Import HomePage
import MovieDetail from './moviecomponents/MovieDetail'; // Adjust the path as per your directory structure
import Profile from "./pages/profile/my_profile/my_profile";
import EditProfile from "./pages/profile/edit_profile/edit_profile";


function App() {
  return (
    <Router>
      <TopBar /> {/* Render TopBar on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage as the default route */}
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/Auth" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}
        <Route path="/profile" element={<Profile />} /> {/* Profile page */}
        <Route path="/profile" element={<EditProfile />} /> {/* Edit profile page */}
      </Routes>
    </Router>
  );
}

export default App;
