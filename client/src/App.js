import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { AuthProvider, AuthContext } from './components/Contexts'; // Corrected import path
import { Register } from './components/Register';
import HomePage from './pages/start/start';
import MovieDetail from './moviecomponents/MovieDetail';
import Profile from "./pages/profile/my_profile/my_profile";
import CreateGroup from './pages/groups/create_group/create_group';
import EditGroup from './pages/groups/edit_group/edit_group';
import BrowseAll from './pages/browse/browse_all/browse_all';
import BrowseReviews from './pages/browse/browse_reviews/browse_reviews';
import Edit_Profile from './pages/profile/edit_profile/edit_profile';
import SearchPage from './pages/search/search';

function RepeatingLogComponent() {
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('User is logged in:', isLoggedIn);
    }, 2000); // Log every 2 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [isLoggedIn]);

  return null; // This component does not render anything
}

function App() {
  return (
    <AuthProvider>
      <RepeatingLogComponent />

      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/Auth" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit_profile" element={<Edit_Profile />} />
          <Route path="/create_group" element={<CreateGroup />} />
          <Route path="/edit_group/:groupId" element={<EditGroup />} />
          <Route path="/browse_all" element={<BrowseAll />} />
          <Route path="/browse_reviews" element={<BrowseReviews />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
