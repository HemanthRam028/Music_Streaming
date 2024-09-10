import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, getRedirectResult } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmBqUL9Ck-EyiHkk8Q_e1EPU260cd22ko",
  authDomain: "musicstreaming-c2d8d.firebaseapp.com",
  projectId: "musicstreaming-c2d8d",
  storageBucket: "musicstreaming-c2d8d.appspot.com",
  messagingSenderId: "322471070754",
  appId: "1:322471070754:web:fa8c62d51393a67028ce7b",
  measurementId: "G-TZCD1QD92N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

function App() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Error during sign-out:", error.message);
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          setUser(user);
        }
      })
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
      });
  }, []);

  const fetchTrendingSongs = async () => {
    const API_KEY = "YOUR_YOUTUBE_API_KEY";
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=10&regionCode=IN&key=${API_KEY}`);
      const data = await response.json();
      setSongs(data.items);
    } catch (error) {
      console.error("Error fetching songs:", error.message);
    }
  };

  const addToFavorites = async (songId) => {
    if (user) {
      try {
        await addDoc(collection(db, 'favorites'), {
          googleId: user.uid,
          songId: songId
        });
        console.log('Added to Favorites');
      } catch (error) {
        console.error('Error adding to favorites:', error.message);
      }
    } else {
      alert('Please log in to add favorites');
    }
  };

  return (
    <div className="app-container">
      <div className="header">Login Music Streaming</div>
      <div className="logo-container">
        <img src="Music_logo.png" alt="Music Logo" className="logo" />
      </div>

      {!user ? (
        <button onClick={signInWithGoogle} className="signin-button">
          Sign in with Google
        </button>
      ) : (
        <>
          <button onClick={signOutUser} className="signout-button">
            Sign out
          </button>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={fetchTrendingSongs}>
            Show Trending Songs
          </button>
          <div>
            <h2>Trending Songs</h2>
            <ul>
              {songs.map(song => (
                <li key={song.id}>
                  <a href={`https://www.youtube.com/watch?v=${song.id}`} target="_blank" rel="noopener noreferrer">
                    {song.snippet.title}
                  </a>
                  <button className="favorite-btn" onClick={() => addToFavorites(song.id)}>
                    Add to Favorites
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
