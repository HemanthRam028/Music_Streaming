import axios from 'axios';

// Replace with your Client ID and Client Secret from Spotify Developer Dashboard
const CLIENT_ID = '6bcdb26f14f9477fb7ca8db3b3d15774';
const CLIENT_SECRET = 'c9f4c2526337403ea90402a79dc6086b';
const REDIRECT_URI = 'http://localhost:3000/callback'; // Redirect URL for Spotify login
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-library-modify',
  'streaming',
];

// Function to handle login and redirect to Spotify's authorization page
export const loginToSpotify = () => {
  window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES.join(' '))}`;
};

// Extract the access token from the URL hash after Spotify login
export const getAccessTokenFromUrl = () => {
  const hash = window.location.hash;
  let token = '';
  if (hash) {
    token = hash
      .substring(1)
      .split('&')
      .find(elem => elem.startsWith('access_token'))
      .split('=')[1];
    window.location.hash = ''; // Clean the hash after getting the token
  }
  return token;
};

// Get access token from Spotify (Client Credentials Flow)
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }), // Proper encoding
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    throw new Error('Failed to get access token');
  }
};

// Helper function to safely get the first image from an item
const getFirstImage = (item) => {
  if (item && item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0].url;
  }
  return 'default-image-url'; // Replace with a real default image URL
};

// Function to search songs
export const searchSongs = async (query) => {
  const token = getAccessTokenFromUrl() || await getAccessToken(); // Get token from URL or request a new one
  if (!token) {
    console.error('No access token available');
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 10,
        },
      }
    );

    const tracks = response.data?.tracks?.items?.map(track => ({
      id: track.id,
      name: track.name,
      albumName: track.album.name,
      artist: track.artists[0]?.name,
      imageUrl: getFirstImage(track.album),
      previewUrl: track.preview_url, // Preview URL (audio link)
    })) || [];

    return tracks;
  } catch (error) {
    console.error('Error searching songs:', error.response?.data || error.message);
    return []; // Return an empty array on error
  }
};

// Function to get new releases
export const getNewReleases = async () => {
  const token = getAccessTokenFromUrl() || await getAccessToken();
  if (!token) {
    console.error('No access token available');
    return [];
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: { Authorization: `Bearer ${token}` },
      params: { country: 'US', limit: 10 },
    });

    const albums = response.data?.albums?.items || [];
    return albums;
  } catch (error) {
    console.error('Error fetching new releases:', error.response?.data || error.message);
    return []; // Return an empty array on error
  }
};

// Function to get featured playlists
export const getFeaturedPlaylists = async () => {
  const token = getAccessTokenFromUrl() || await getAccessToken();
  if (!token) {
    console.error('No access token available');
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/browse/featured-playlists',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          country: 'US',
          limit: 10,
        },
      }
    );

    const playlists = response.data?.playlists?.items?.map(playlist => ({
      id: playlist.id, // Ensure playlist ID is included
      name: playlist.name,
      description: playlist.description,
      imageUrl: getFirstImage(playlist),
    })) || [];

    return playlists;
  } catch (error) {
    console.error('Error fetching featured playlists:', error.response?.data || error.message);
    return []; // Return an empty array on error
  }
};

// Exporting the object as default
const spotifyApi = {
  searchSongs,
  getNewReleases,
  getFeaturedPlaylists,
  loginToSpotify,
  getAccessTokenFromUrl,
};

export default spotifyApi;
