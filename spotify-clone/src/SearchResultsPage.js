import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchSongs } from './spotifyApi';
import './SearchResultsPage.css';

const SearchResultsPage = ({ addToFavorites, removeFromFavorites, favorites }) => {
  const [searchResults, setSearchResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const results = await searchSongs(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleAddToFavorites = (song) => {
    if (favorites.has(song.id)) {
      removeFromFavorites(song.id);
      // Update favorites
    } else {
      addToFavorites(song.id);
      // Update favorites
    }
  };

  return (
    <div className="search-results-page">
      <h1>Search Results for "{query}"</h1>
      <div className="search-results">
        {searchResults.length ? (
          searchResults.map((song) => (
            <div key={song.id} className="song-card">
              <img
                src={song.imageUrl}
                alt={song.name}
                className="album-art"
              />
              <div className="song-info">
                <h3>{song.name}</h3>
                <p><strong>Artist:</strong> {song.artist}</p>
                <p><strong>Album:</strong> {song.albumName}</p>
                <button type="button" onClick={() => handleAddToFavorites(song)}>
                  {favorites.has(song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          ))
        ) : <p>No results found.</p>}
      </div>
    </div>
  );
};

export default SearchResultsPage;
