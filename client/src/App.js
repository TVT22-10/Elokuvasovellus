import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { Register } from './components/Register';
import HomePage from './pages/start/start'; 
import MovieDetail from './moviecomponents/MovieDetail'; 
import Profile from "./pages/profile/my_profile/my_profile";
import CreateGroup from './pages/groups/create_group/create_group';
import EditGroup from './pages/groups/edit_group/edit_group';
import BrowseAll from './pages/browse/browse_all/browse_all';
import BrowseReviews from './pages/browse/browse_reviews/browse_reviews';


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
        <Route path="/create_group" element={<CreateGroup />} /> {/* Create Group page */}
        <Route path="/edit_group" element={<EditGroup />} /> {/* edit group page */}
        <Route path="/browse_all" element={<BrowseAll />} /> {/* Profile page */}
        <Route path="/browse_reviews" element={<BrowseReviews />} /> {/* Profile page */}
      </Routes>
    </Router>
  );
}

export default App;
