import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchSongs, getNewReleases, getFeaturedPlaylists } from './spotifyApi';
import './HomePage.css';

const HomePage = ({ user, signOutUser, addToFavorites, removeFromFavorites }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [songs, setSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const [fetchedSongs, fetchedNewReleases, fetchedFeaturedPlaylists] = await Promise.all([
          searchSongs('trending'),
          getNewReleases(),
          getFeaturedPlaylists()
        ]);
        setSongs(fetchedSongs);
        setNewReleases(fetchedNewReleases);
        setFeaturedPlaylists(fetchedFeaturedPlaylists);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };

    fetchMusicData();

    // Retrieve favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    const favoritesArray = savedFavorites ? JSON.parse(savedFavorites) : [];
    if (Array.isArray(favoritesArray)) {
      setFavorites(new Set(favoritesArray));
    } else {
      console.error('Favorites data is not an array:', favoritesArray);
    }
  }, []); // Added empty dependency array for initial data fetch

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const results = await searchSongs(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching for songs:', error);
      }
    }
  };

  const playSong = (song) => {
    if (song.previewUrl) {
      setCurrentSong(song);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = song.previewUrl;
        audioRef.current.play()
          .then(() => console.log('Playing song:', song.name))
          .catch(error => console.error('Error playing the song:', error));
      }
    } else {
      console.log('No preview available for this song.');
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSongClick = (song) => {
    if (currentSong?.id === song.id && isPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const handleAddToFavorites = (song) => {
    if (favorites.has(song.id)) {
      removeFromFavorites(song.id);
      setFavorites(prevFavorites => {
        const updatedFavorites = new Set(prevFavorites);
        updatedFavorites.delete(song.id);
        localStorage.setItem('favorites', JSON.stringify([...updatedFavorites]));
        return updatedFavorites;
      });
    } else {
      addToFavorites(song.id);
      setFavorites(prevFavorites => {
        const updatedFavorites = new Set(prevFavorites);
        updatedFavorites.add(song.id);
        localStorage.setItem('favorites', JSON.stringify([...updatedFavorites]));
        return updatedFavorites;
      });
    }
  };

  const handleHomeClick = () => {
    // Reset state
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSong(null);
    setIsPlaying(false);
    setIsShuffle(false);

    // Navigate to home page
    navigate('/home');
  };

  if (!user) return <p>Please log in to view this page.</p>;

  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="logo">Music App</div>
        <div className="nav-buttons">
          <button type="button" className="nav-button" onClick={handleHomeClick}>Home</button>
          <button type="button" className="nav-button" onClick={() => navigate('/favorites')}>Favorites</button>
          <button type="button" className="nav-button" onClick={signOutUser}>Sign Out</button>
        </div>
      </header>

      <div className="main-content">
        <h1>Welcome, {user.displayName}</h1>

        <section className="search-section">
          <h2>Search Songs</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, artists, or albums"
          />
          <button type="button" onClick={handleSearch}>Search</button>
          <div className="search-results">
            {searchResults.length ? (
              searchResults.map((song) => (
                <div key={song.id} className="song-card">
                  <img
                    src={song.imageUrl}
                    alt={song.name}
                    className="album-art"
                    onClick={() => handleSongClick(song)}
                  />
                  <div className="song-info">
                    <h3>{song.name}</h3>
                    <p><strong>Artist:</strong> {song.artist}</p>
                    <p><strong>Album:</strong> {song.albumName}</p>
                    <button type="button" onClick={() => handleAddToFavorites(song)}>
                      {favorites.has(song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    {currentSong?.id === song.id && isPlaying ? (
                      <button type="button" onClick={pauseSong}>Pause</button>
                    ) : (
                      <button type="button" onClick={() => playSong(song)}>Play</button>
                    )}
                  </div>
                </div>
              ))
            ) : <p>No results found.</p>}
          </div>
        </section>

        <section className="trending-section">
          <h2>Trending Songs</h2>
          <div className="song-cards">
            {songs.length ? (
              songs.map((song) => (
                <div key={song.id} className="song-card">
                  <img
                    src={song.imageUrl}
                    alt={song.name}
                    className="album-art"
                    onClick={() => handleSongClick(song)}
                  />
                  <div className="song-info">
                    <h3>{song.name}</h3>
                    <p>{song.artist}</p>
                    <button type="button" onClick={() => handleAddToFavorites(song)}>
                      {favorites.has(song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    {currentSong?.id === song.id && isPlaying ? (
                      <button type="button" onClick={pauseSong}>Pause</button>
                    ) : (
                      <button type="button" onClick={() => playSong(song)}>Play</button>
                    )}
                  </div>
                </div>
              ))
            ) : <p>No trending songs available.</p>}
          </div>
        </section>

        <section className="new-releases-section">
          <h2>New Releases</h2>
          <div className="song-cards">
            {newReleases.length ? (
              newReleases.map((song) => (
                <div key={song.id} className="song-card">
                  <img
                    src={song.imageUrl}
                    alt={song.name}
                    className="album-art"
                    onClick={() => handleSongClick(song)}
                  />
                  <div className="song-info">
                    <h3>{song.name}</h3>
                    <p>{song.artist}</p>
                    <button type="button" onClick={() => handleAddToFavorites(song)}>
                      {favorites.has(song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    {currentSong?.id === song.id && isPlaying ? (
                      <button type="button" onClick={pauseSong}>Pause</button>
                    ) : (
                      <button type="button" onClick={() => playSong(song)}>Play</button>
                    )}
                  </div>
                </div>
              ))
            ) : <p>No new releases available.</p>}
          </div>
        </section>

        <section className="featured-playlists-section">
          <h2>Featured Playlists</h2>
          <div className="playlist-cards">
            {featuredPlaylists.length ? (
              featuredPlaylists.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    className="playlist-art"
                  />
                  <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.description}</p>
                  </div>
                </div>
              ))
            ) : <p>No featured playlists available.</p>}
          </div>
        </section>

        <footer className="footer">
          <audio ref={audioRef} onEnded={handleAudioEnded} controls>
            Your browser does not support the audio element.
          </audio>
          <div className="controls">
            <button type="button" onClick={toggleShuffle}>
              {isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;