import React, { useEffect } from 'react';

const HomePage = ({
  user,
  signOutUser,
  fetchTrendingSongs,
  trendingSongs,
  fetchNewReleases,
  newReleases,
  addToFavorites
}) => {
  useEffect(() => {
    // Fetch trending and new releases when the component is mounted
    fetchTrendingSongs();
    fetchNewReleases();
  }, [fetchTrendingSongs, fetchNewReleases]);

  return (
    <div>
      <div className="header">
        <h1>Welcome to Music Streaming, {user.displayName}</h1>
        <button onClick={signOutUser} className="signout-button">Sign out</button>
        {user && (
          <div className="user-info">
            <img src={user.photoURL} alt="User Profile" className="user-avatar" />
          </div>
        )}
      </div>

      <div className="trending-section">
        <h2>Trending Songs</h2>
        <div className="song-grid">
          {trendingSongs.map(song => (
            <div key={song.id} className="song-card">
              <img src={song.snippet.thumbnails.default.url} alt={song.snippet.title} />
              <p>{song.snippet.title}</p>
              <button className="favorite-btn" onClick={() => addToFavorites(song.id)}>Add to Favorites</button>
            </div>
          ))}
        </div>
      </div>

      <div className="new-releases-section">
        <h2>New Releases</h2>
        <div className="song-grid">
          {newReleases.map(song => (
            <div key={song.id} className="song-card">
              <img src={song.snippet.thumbnails.default.url} alt={song.snippet.title} />
              <p>{song.snippet.title}</p>
              <button className="favorite-btn" onClick={() => addToFavorites(song.id)}>Add to Favorites</button>
            </div>
          ))}
        </div>
      </div>

      <div className="favorites-section">
        <h2>Your Favorite Songs</h2>
        {/* Implement the logic to display the user's favorite songs */}
      </div>
    </div>
  );
};

export default HomePage;
