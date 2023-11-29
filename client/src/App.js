// App.js

import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { AuthProvider, AuthContext } from './components/Contexts';
import { Register } from './components/Register';
import HomePage from './pages/start/start';
import MovieDetail from './moviecomponents/MovieDetail';
import Profile from "./pages/profile/my_profile/my_profile";
import CreateGroup from './pages/groups/create_group/create_group';
import GroupPage from './pages/groups/group_page/group_page';
import EditGroup from './pages/groups/edit_group/edit_group';
import BrowseAll from './pages/browse/browse_all/browse_all';
import BrowseReviews from './pages/browse/browse_reviews/browse_reviews';
import Edit_Profile from './pages/profile/edit_profile/edit_profile';
<<<<<<< Updated upstream
import SearchPage from './pages/search/search';
import SearchGroups from './pages/groups/search_groups/search_groups';
import XmlPage from './xmlcomponents/xmlpage';
=======
import React, { useContext, useEffect } from 'react';

import { AuthContext } from './components/Contexts'; // Adjust the path as necessary
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
      <Router>
        <TopBar /> {/* Render TopBar on all pages */}
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
          <Route
            path="/xml1"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/TheatreAreas/" topLevelProperty="TheatreAreas" nestedProperty="TheatreArea" />}
          />
          <Route
            path="/xml2"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/ScheduleDates/" topLevelProperty="ScheduleDates" nestedProperty="ScheduleDate" />}
          />
          <Route
            path="/xml3"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/Schedule/" topLevelProperty="Schedule" nestedProperty="Shows" />}
          />
          <Route
            path="/xml4"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/Events/" topLevelProperty="Events" nestedProperty="Event" />}
          />
          <Route
            path="/xml5"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/News/" topLevelProperty="News" nestedProperty="NewsArticle" />}
          />
          <Route
            path="/xml6"
            element={<XmlPage xmlUrl="https://www.finnkino.fi/xml/NewsCategories/" topLevelProperty="NewsCategories" nestedProperty="NewsArticleCategory" />}
          />
        </Routes>
      </Router>
=======
    <Router>
      <TopBar /> {/* Render TopBar on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage as the default route */}
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/Auth" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}
        <Route path="/profile" element={<Profile />} /> {/* Profile page */}
        <Route path="/edit_profile" element={<Edit_Profile />} /> {/* Profile page */}
        <Route path="/create_group" element={<CreateGroup />} /> {/* Profile page */}
        <Route path="/edit_group" element={<EditGroup />} /> {/* Profile page */}
        <Route path="/register" element={<Register />} /> {/* Profile page */}
        <Route path="/browse_all" element={<BrowseAll />} /> {/* Profile page */}
        <Route path="/browse_reviews" element={<BrowseReviews />} /> {/* Profile page */}
      </Routes>
    </Router>
>>>>>>> Stashed changes
    </AuthProvider>
  );
}

export default App;