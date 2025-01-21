import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsCollectionPlayFill } from "react-icons/bs";
import { gapi } from 'gapi-script';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { DropZone } from './DropZone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Home = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch playlists on component mount
  useEffect(() => {
    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);


   useEffect(() => {
      // Initialize the Google API client
      const initClient = () => {
        gapi.client.init({
          apiKey: 'AIzaSyDvzwDFrJQSUoSBLPUJGHUUn9QwLcLTFn4', // YouTube API key
          clientId: '1012840825507-9tf1veqnd9gcodjh41u6ldh7vvbijh5c.apps.googleusercontent.com', // Your OAuth 2.0 client ID
          scope: 'https://www.googleapis.com/auth/youtube.readonly', // Scope to access YouTube data
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        });
      };
      gapi.load('client:auth2', initClient);
    }, []);


    const handleSignInSuccess = (token) => {
      // You can perform any additional logic here, like redirecting to Home
      localStorage.setItem('accessToken', token);
    };

    // Sign in the user with Google OAuth 2.0
    const handleGoogleSignIn = () => {
      gapi.auth2.getAuthInstance().signIn().then((googleUser) => {
        // Get the Google access token after sign-in
        const token = googleUser.getAuthResponse().access_token;
  
        // Store the token in localStorage
        localStorage.setItem('accessToken', token);
  
        // Pass the token to the parent component or store it in the state
        handleSignInSuccess(token);
        toast.success('Import successfull ');

        // navigate('/home');
      });
    };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: 'snippet', // Get the playlist snippet (title, description, thumbnails)
          mine: true, // Get playlists of the authenticated user
          maxResults: 10, // Limit to 10 playlists
        },
      });

      const playlistsData = response.data.items;

      // Fetch the video count for each playlist by querying playlistItems API
      const playlistsWithVideoCount = await Promise.all(playlistsData.map(async (playlist) => {
        const playlistItemsResponse = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            part: 'snippet',
            playlistId: playlist.id,
            maxResults: 1, // We only need the count of items, so we just fetch one item
          },
        });
        const videoCount = playlistItemsResponse.data.pageInfo.totalResults; // Get the total number of videos in the playlist
        return {
          ...playlist,
          videoCount, // Add video count to playlist data
        };
      }));

      setPlaylists(playlistsWithVideoCount); // Update the playlists state with video counts
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Fetch videos for the selected playlist
  const fetchPlaylistVideos = async (playlistId) => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 10, // Limit to 10 videos per playlist
        },
      });
      setVideos(response.data.items);
      setSelectedPlaylistId(playlistId); // Set selected playlist to highlight
      setSelectedVideo(null); // Clear selected video when new playlist is selected
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
    }
  };

  // Handle video selection from the playlist
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  // Handle log out
  const handleLogOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setPlaylists([]);
    setSelectedVideo(null);
    toast.success('Logged out successfully')
    setTimeout(() => {

      navigate('/');
    },3000)
  };

  return (
    <div className="home-container">
      {/* Sidebar Section */}
      <div className="sidebar">
       <Sidebar></Sidebar>
      </div>

      {/* Main Content Section */}
      <div className="content">
        {/* Navbar */}
        <div className="navbar">
          <div>
            <p>Design Studio</p>
          </div>
          <div className="btnDiv">
            <button className="btn" onClick={handleGoogleSignIn}>Import from Youtube</button>
            <button className="btn">Save Layout</button>
            <button className="btn">Load Layout</button>
            <button className="btn" onClick={handleLogOut}>Logout</button>
            <p>email &nbsp;<i class="fa fa-angle-down" aria-hidden="true"></i></p>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="playlist-container">
        <DndProvider backend={HTML5Backend}>
          <div className="playlists">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`playlist`}
                onClick={() => fetchPlaylistVideos(playlist.id)}
              >
              <div className='playDiv'>

                <img
                  className="playlist-thumbnail"
                  src={playlist.snippet.thumbnails.medium.url}
                  alt={playlist.snippet.title}
                />
                <h3 className='playlistTitle'>{playlist.snippet.title}</h3>
                {/* Display video count */}
                <div className='cntBtn'>
                <BsCollectionPlayFill /> &nbsp; &nbsp;
                <h4 className=''>{playlist.videoCount} Videos</h4> 
                </div>
              </div>
              </div>
            ))}
          </div>
          </DndProvider>
          <DropZone playlists={playlists} setPlaylists={setPlaylists} />

          {/* Video Section */}
          <div className="videos">
            {selectedPlaylistId && (
              <>
                <h2 style={{ color: "white",textDecoration:"underline" }}>Videos in Playlist</h2>
                <div className="video-thumbnails">
                  {videos.slice(0, 5).map((video) => (
                    <div key={video.id} className="video-item" onClick={() => handleVideoClick(video)}>
                    <div className='vidDiv'>
                    <div>

                      <img
                        className="video-thumbnail"
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                      />
                    </div>
                    <div style={{marginLeft:"10px"}}>
                      <p>{video.snippet.title}</p>
                    </div>
                    </div>
                    </div>
                  ))}
                </div>

                {/* Display Selected Video */}
                {selectedVideo && (
                  <div className="video-details">
                    <h2>{selectedVideo.snippet.title}</h2>
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.snippet.resourceId.videoId}`}
                      title={selectedVideo.snippet.title}
                      // frameBorder="0"
                      allowFullScreen
                      className="video-player"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
