import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

function PlaylistsPage({ user, signOutUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const db = getFirestore();

  // Fetch playlists from Firebase Firestore
  const fetchPlaylists = async () => {
    try {
      const playlistsCollection = await getDocs(collection(db, 'playlists'));
      const playlistsData = playlistsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error fetching playlists:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  // Create a new playlist
  const createPlaylist = async () => {
    if (playlistName && user) {
      try {
        await addDoc(collection(db, 'playlists'), {
          googleId: user.uid,
          name: playlistName,
          songs: [],
        });
        setPlaylistName('');
        fetchPlaylists();
      } catch (error) {
        console.error('Error creating playlist:', error.message);
      }
    } else {
      alert('Please enter a playlist name and log in to create playlists');
    }
  };

  return (
    <div className="playlists-page">
      <h1>Your Playlists</h1>
      <button onClick={signOutUser}>Sign Out</button>

      <div className="create-playlist">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter playlist name"
        />
        <button onClick={createPlaylist}>Create Playlist</button>
      </div>

      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p>No playlists found. Create one!</p>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item">
              <h3>{playlist.name}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlaylistsPage;
