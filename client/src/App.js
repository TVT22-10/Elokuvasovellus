import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { AuthProvider } from './components/Contexts'; // Adjust the path if necessary
import { Register } from './components/Register';
import HomePage from './pages/start/start'; // Import HomePage
import MovieDetail from './moviecomponents/MovieDetail'; // Adjust the path as per your directory structure
import Profile from "./pages/profile/my_profile/my_profile";
import CreateGroup from './pages/groups/create_group/create_group';
import GroupPage from './pages/groups/group_page/group_page';
import EditGroup from './pages/groups/edit_group/edit_group';
import BrowseAll from './pages/browse/browse_all/browse_all';
import BrowseReviews from './pages/browse/browse_reviews/browse_reviews';
import Edit_Profile from './pages/profile/edit_profile/edit_profile';
import SearchPage from './pages/search/search';
import React, { useContext, useEffect } from 'react';
import SearchGroups from './pages/groups/search_groups/search_groups';
import { AuthContext } from './components/Contexts'; // Adjust the path as necessary

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
    <AuthProvider> {/* Wrap everything within AuthProvider */}
          <RepeatingLogComponent /> {/* Add this line */}

          <Router>
       <TopBar />  {/*Render TopBar on all pages */}
      <Routes>
      <Route path="/" element={<HomePage />} /> {/* HomePage as the default route */}
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/Auth" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}
        <Route path="/profile" element={<Profile />} /> {/* Profile page */}
        <Route path="/edit_profile" element={<Edit_Profile />} /> {/* Profile page */}
        <Route path="/create_group" element={<CreateGroup />} /> {/* Create group page */}
        <Route path="/edit_group/:groupId" element={<EditGroup />} /> {/* Edit group page */}
        <Route path="/browse_all" element={<BrowseAll />} /> {/* Browse all page */}
        <Route path="/browse_reviews" element={<BrowseReviews />} /> {/* Browse reviews page */}
        <Route path="/search" element={<SearchPage />} /> {/* Search page */}
        <Route path="/search_groups" element={<SearchGroups />} /> {/* Search group page */}
        <Route path="/group_page/" element={<GroupPage />} /> {/* Group page */}
      </Routes>
    </Router>
    </AuthProvider>

  );
}

export default App;
