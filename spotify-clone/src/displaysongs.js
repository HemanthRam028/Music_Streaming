import { searchSongs } from './utils/spotifyApi';

const displaySongs = async () => {
  const query = 'NTR';
  const songs = await searchSongs(query);
  
  songs.forEach(song => {
    console.log(`Song: ${song.name}, Artist: ${song.artist}, Album: ${song.albumName}`);
    console.log(`Image URL: ${song.imageUrl}`);
  });
};

displaySongs();
