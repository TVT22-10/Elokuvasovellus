// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Login } from './components/Auth';
import { AuthProvider} from './components/Contexts';
import { Register } from './components/Register';
import HomePage from './pages/start/start';
import MovieDetail from './moviecomponents/MovieDetail';
import SeriesDetail from './moviecomponents/SeriesDetail';
import ActorDetail from './moviecomponents/ActorDetail';
import Profile from "./pages/profile/my_profile/my_profile";
import PublicProfile from "./pages/profile/public_profile/public_profile";
import CreateGroup from './pages/groups/create_group/create_group';
import GroupPage from './pages/groups/group_page/group_page';
import BrowseReviews from './pages/browse/browse_reviews/browse_reviews';
import EditProfile from './pages/profile/edit_profile/edit_profile';
import BrowseGroups from './pages/browse/browse_groups/browse_groups';
import SearchPage from './pages/search/search';
import SearchTVPage from './pages/search/searchtv';
import SearchGroups from './pages/groups/search_groups/search_groups';
import TheatreAreasPage from './xmlcomponents/TheatreAreas';
import NewsPage from './xmlcomponents/News';
import EventsPage from './xmlcomponents/Events';
import SchedulePage from './xmlcomponents/Schedule';
import BrowseMoviesPage from './pages/browse/browse_movies/browse_movies';
import BrowseSeriesPage from './pages/browse/browse_series/browse_series';
import LeaderboardsPage from './pages/leaderboard/leaderboards';


function App() {
  return (
    <AuthProvider>

      <Router>
        <TopBar /> {/* Render TopBar on all pages */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* HomePage as the default route */}
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/actors/:actorId" element={<ActorDetail />} />
          <Route path="/series/:seriesId" element={<SeriesDetail />} />
          <Route path="/Auth" element={<Login />} /> {/* Login page */}
          <Route path="/register" element={<Register />} /> {/* Registration page */}
          <Route path="/profile" element={<Profile />} /> {/* Profile page */}
          <Route path="/public_profile/:username" element={<PublicProfile />} />
          <Route path="/edit_profile" element={<EditProfile />} /> {/* Edit profile page */}
          <Route path="/create_group" element={<CreateGroup />} /> {/* Create group page */}
          <Route path="/browse_all" element={<BrowseMoviesPage />} /> {/* Browse all page */}
          <Route path="/browse_series" element={<BrowseSeriesPage />} /> {/* Browse all page */}
          <Route path="/browse_reviews" element={<BrowseReviews />} /> {/* Browse reviews page */}
          <Route path="/browse_groups" element={<BrowseGroups />} /> {/* Browse groups page */}
          <Route path="/leaderboards" element={<LeaderboardsPage />} /> {/* Browse all page */}
          <Route path="/search" element={<SearchPage />} /> {/* Search page */}
          <Route path="/searchtv" element={<SearchTVPage />} /> {/* Search page */}
          <Route path="/search_groups" element={<SearchGroups />} /> {/* Search group page */}
          <Route path="/groups/:groupId" element={<GroupPage/>} />
          <Route path="/theatre_areas" element={<TheatreAreasPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />

        </Routes>
      </Router>

    </AuthProvider>
  );
}

export default App;
