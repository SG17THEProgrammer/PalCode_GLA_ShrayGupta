// src/services/youtubeApi.js
export const fetchPlaylists = async (authToken) => {
    const res = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.json();
  };
  
  export const fetchVideos = async (playlistId, authToken) => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.json();
  };
  