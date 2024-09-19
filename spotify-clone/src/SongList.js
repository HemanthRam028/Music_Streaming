import React, { useState, useEffect } from 'react';

const SongList = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [songs, setSongs] = useState([]); // Assuming you fetch or have a list of songs

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(new Set(storedFavorites));
  }, []);

  const handleAddToFavorites = (song) => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = storedFavorites.some(favSongId => favSongId === song.id);

    if (isFavorite) {
      const updatedFavorites = storedFavorites.filter(favSongId => favSongId !== song.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(new Set(updatedFavorites));
    } else {
      const updatedFavorites = [...storedFavorites, song.id];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(new Set(updatedFavorites));
    }
  };

  return (
    <div>
      {songs.map(song => (
        <SongComponent 
          key={song.id} 
          song={song} 
          handleAddToFavorites={handleAddToFavorites} 
          favorites={favorites}
        />
      ))}
    </div>
  );
};

const SongComponent = ({ song, handleAddToFavorites, favorites }) => {
  const isFavorite = favorites.has(song.id);

  return (
    <div className="song-card">
      <img src={song.imageUrl} alt={song.name} className="album-art" />
      <div className="song-info">
        <h3>{song.name}</h3>
        <p><strong>Artist:</strong> {song.artist}</p>
        <button onClick={() => handleAddToFavorites(song)}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default SongList;
