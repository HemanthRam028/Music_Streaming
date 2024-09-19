import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth, db, provider } from './firebaseConfig';
import { signInWithPopup, signOut, getRedirectResult } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { loginToSpotify, getAccessTokenFromUrl } from './spotifyAuth';
import { searchSongs, getNewReleases, getFeaturedPlaylists } from './spotifyApi';
import HomePage from './HomePage';
import FavoritesPage from './FavoritesPage';
import PlaylistsPage from './PlaylistsPage';
import SpotifyPlayer from './SpotifyPlayer';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState('');
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Error during sign-out:", error.message);
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) setUser(result.user);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
      });
  }, []);

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  useEffect(() => {
    const token = getAccessTokenFromUrl();
    if (token) {
      setSpotifyAccessToken(token);
    }
  }, []);

  useEffect(() => {
    const loadMusicData = async () => {
      const fetchedNewReleases = await getNewReleases();
      const fetchedPlaylists = await getFeaturedPlaylists();
      setNewReleases(fetchedNewReleases);
      setFeaturedPlaylists(fetchedPlaylists);
    };
    loadMusicData();
  }, []);

  const addToFavorites = async (songId) => {
    if (user) {
      try {
        await addDoc(collection(db, 'favorites'), {
          googleId: user.uid,
          songId: songId,
        });
        console.log('Added to Favorites');
        navigate('/favorites');
      } catch (error) {
        console.error('Error adding to favorites:', error.message);
      }
    } else {
      alert('Please log in to add favorites');
    }
  };

  const removeFromFavorites = async (songId) => {
    if (user) {
      // Implement removal logic here
    } else {
      alert('Please log in to remove favorites');
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="app-container">
          <div className="header">Login Music Streaming</div>
          <div className="logo-container">
            <img src="Music_logo.png" alt="Music Logo" className="logo" />
          </div>
          {!user ? (
            <button onClick={signInWithGoogle} className="signin-button">Sign in with Google</button>
          ) : <p>Redirecting...</p>}
        </div>
      } />
      
      <Route path="/home" element={
        <HomePage
          user={user}
          signOutUser={signOutUser}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          searchSongs={searchSongs}
          newReleases={newReleases}
          featuredPlaylists={featuredPlaylists}
        />
      } />
      
      <Route path="/favorites" element={
        <FavoritesPage user={user} signOutUser={signOutUser} />
      } />
      
      <Route path="/playlists" element={
        <PlaylistsPage user={user} signOutUser={signOutUser} />
      } />
      
      <Route path="/spotify" element={
        <div className="App">
          {!spotifyAccessToken ? (
            <button onClick={loginToSpotify}>Login to Spotify</button>
          ) : (
            <SpotifyPlayer accessToken={spotifyAccessToken} />
          )}
        </div>
      } />
    </Routes>
  );
}

export default App;
