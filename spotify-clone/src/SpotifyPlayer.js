import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ accessToken }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); },
      });

      setPlayer(player);

      // Error handling
      player.addListener('initialization_error', ({ message }) => console.error(message));
      player.addListener('authentication_error', ({ message }) => console.error(message));
      player.addListener('account_error', ({ message }) => console.error(message));
      player.addListener('playback_error', ({ message }) => console.error(message));

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const playSong = async (trackUri) => {
    if (!deviceId) return;

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    setIsPlaying(true);
  };

  const pauseSong = async () => {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setIsPlaying(false);
  };

  return (
    <div>
      <button onClick={() => playSong('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp')}>Play Song</button>
      {isPlaying && <button onClick={pauseSong}>Pause Song</button>}
    </div>
  );
};

export default SpotifyPlayer;
