import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchSongs } from './spotifyApi'; // Adjust import path

const FavoritesPage = ({ user, signOutUser, removeFromFavorites }) => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Fetch the list of favorite songs when the component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoriteSongs = await Promise.all(
          savedFavorites.map(songId => searchSongs(songId)) // Adjust based on how you fetch songs
        );
        setFavorites(favoriteSongs.flat());
      } catch (error) {
        console.error('Error fetching favorite songs:', error);
      }
    };

    fetchFavorites();
  }, []);

  // Handle removing a song from favorites
  const handleRemoveFromFavorites = async (songId) => {
    try {
      await removeFromFavorites(songId);
      setFavorites(prevFavorites => prevFavorites.filter(song => song.id !== songId));
      const updatedFavorites = favorites.filter(song => song.id !== songId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites.map(song => song.id)));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (!user) return <p>Please log in to view this page.</p>;

  return (
    <div className="favorites-page">
      <header className="navbar">
        <div className="logo">Music App</div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate('/home')}>Home</button>
          <button className="nav-button" onClick={() => navigate('/favorites')}>Favorites</button>
          <button className="nav-button" onClick={signOutUser}>Sign Out</button>
        </div>
      </header>

      <div className="main-content">
        <h1>Favorites</h1>
        <div className="favorites-list">
          {favorites.length ? (
            favorites.map((song) => (
              <div key={song.id} className="song-card">
                <img src={song.imageUrl} alt={song.name} className="album-art" />
                <div className="song-info">
                  <h3>{song.name}</h3>
                  <p><strong>Artist:</strong> {song.artist}</p>
                  <p><strong>Album:</strong> {song.albumName}</p>
                  <button onClick={() => handleRemoveFromFavorites(song.id)}>
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))
          ) : <p>No favorite songs available.</p>}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
