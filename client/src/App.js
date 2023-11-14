import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { Register } from './components/Register';
import Profile from "./pages/profile/my_profile/my_profile";

function App() {
  return (
    <Router>
      <TopBar /> {/* Render TopBar on all pages */}
      <Routes>
        <Route path="/Auth" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}
        <Route path="/profile" element={<Profile />} /> {/* Profile page */}
      </Routes>
    </Router>
  );
}

export default App;
