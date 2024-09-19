// src/components/MusicApp.js
import React, { useState, useEffect } from 'react';
import { searchSongs, getNewReleases, getFeaturedPlaylists } from '../utils/spotifyApi';  // Adjust the path

const MusicApp = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Search songs when the search term changes
  useEffect(() => {
    if (searchTerm) {
      const fetchSearchResults = async () => {
        try {
          const results = await searchSongs(searchTerm);
          setSearchResults(results);
        } catch (err) {
          setError('Error fetching search results');
          console.error(err);
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Fetch new releases and featured playlists when the component mounts
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const releases = await getNewReleases();
        const playlists = await getFeaturedPlaylists();
        setNewReleases(releases);
        setPlaylists(playlists);
      } catch (err) {
        setError('Error fetching music data');
        console.error(err);
      }
    };
    fetchMusicData();
  }, []);

  return (
    <div>
      <h1>Spotify Music App</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search for a song..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Error handling */}
      {error && <p className="error">{error}</p>}

      {/* Search results */}
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        searchResults.map((track) => (
          <div key={track.id}>
            {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}

      {/* New releases */}
      <h2>New Releases</h2>
      {newReleases.length > 0 ? (
        newReleases.map((album) => (
          <div key={album.id}>
            {album.name} by {album.artists.map((artist) => artist.name).join(', ')}
          </div>
        ))
      ) : (
        <p>No new releases found</p>
      )}

      {/* Featured Playlists (Trending) */}
      <h2>Featured Playlists</h2>
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <div key={playlist.id}>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noreferrer">
              {playlist.name}
            </a>
          </div>
        ))
      ) : (
        <p>No playlists found</p>
      )}
    </div>
  );
};

export default MusicApp;
