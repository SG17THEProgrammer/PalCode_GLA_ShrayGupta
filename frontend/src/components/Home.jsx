import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsCollectionPlayFill } from "react-icons/bs";
import { gapi } from 'gapi-script';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db, setDoc, getDoc, doc } from '../firebase';

const Home = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: `${import.meta.env.VITE_API_KEY_2}`,
        clientId: `${import.meta.env.VITE_CLIENT_ID}`,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const handleSignInSuccess = (token) => {
    localStorage.setItem('accessToken', token);
  };

  const handleGoogleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then((googleUser) => {
      const token = googleUser.getAuthResponse().access_token;
      localStorage.setItem('accessToken', token);
      handleSignInSuccess(token);
      toast.success('Import successful');
      setTimeout(()=>{
        window.location.reload();
      },1000)
    });
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: 'snippet',
          mine: true,
          maxResults: 10,
        },
      });

      const playlistsData = response.data.items;

      const playlistsWithVideoCount = await Promise.all(playlistsData.map(async (playlist) => {
        const playlistItemsResponse = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            part: 'snippet',
            playlistId: playlist.id,
            maxResults: 1,
          },
        });
        const videoCount = playlistItemsResponse.data.pageInfo.totalResults;
        return {
          ...playlist,
          videoCount,
        };
      }));

      setPlaylists(playlistsWithVideoCount);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchPlaylistVideos = async (playlistId) => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 10,
        },
      });
      setVideos(response.data.items);
      setSelectedPlaylistId(playlistId);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setPlaylists([]);
    setSelectedVideo(null);
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const reorderedPlaylists = Array.from(playlists);
    const [movedItem] = reorderedPlaylists.splice(source.index, 1);
    reorderedPlaylists.splice(destination.index, 0, movedItem);

    setPlaylists(reorderedPlaylists);
  };

  const saveLayout = async () => {
    try {
      await setDoc(doc(db, 'layouts', 'playlistLayout'), {
        playlists: playlists.map(playlist => playlist.id),
      });
      toast.success('Layout saved!');
    } catch (error) {
      console.error('Error saving layout: ', error);
    }
  };

  const loadLayout = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'layouts', 'playlistLayout'));
      if (docSnap.exists()) {
        const savedOrder = docSnap.data().playlists;
        const reorderedPlaylists = [...playlists];
        const newOrder = savedOrder.map(id => reorderedPlaylists.find(playlist => playlist.id === id));
        setPlaylists(newOrder);
        toast.success('Layout loaded!');
      } else {
        toast.error('No saved layout found!');
      }
    } catch (error) {
      console.error('Error loading layout: ', error);
    }
  };

  console.log(JSON.stringify(playlists, null, 2));

  return (
    <div className="home-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <div className="navbar">
          <div>
            <p>Design Studio</p>
          </div>
          <div className="btnDiv">
            <button className="btn" onClick={handleGoogleSignIn}>Import from Youtube</button>
            <button className="btn" onClick={saveLayout}>Save Layout</button>
            <button className="btn" onClick={loadLayout}>Load Layout</button>
            <button className="btn" onClick={handleLogOut}>Logout</button>
          </div>
        </div>
        <div className="playlist-container">
        <React.StrictMode>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="character">
              {(provided) => (
                <div className="playlists" {...provided.droppableProps} ref={provided.innerRef}>
                  {playlists.map((playlist, idx) => (
                    <Draggable key={playlist.id} draggableId={playlist.id} index={idx}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="playlist" onClick={() => fetchPlaylistVideos(playlist.id)}>
                          <div className="playDiv">
                            <img className="playlist-thumbnail" src={playlist.snippet.thumbnails.medium.url} alt={playlist.snippet.title} />
                            <h3 className="playlistTitle">{playlist.snippet.title}</h3>
                            <div className="cntBtn">
                              <BsCollectionPlayFill /> &nbsp; &nbsp;
                              <h4>{playlist.videoCount} Videos</h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          </React.StrictMode>
          <div className="videos">
            {selectedPlaylistId && (
              <>
                <h2 style={{ color: "white", textDecoration: "underline" }}>Videos in Playlist</h2>
                <div className="video-thumbnails">
                  {videos.slice(0, 5).map((video) => (
                    <div key={video.id} className="video-item" 
                    // onClick={() => handleVideoClick(video)}
                    >
                      <div className="vidDiv">
                        <img className="video-thumbnail" src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                        <div style={{ marginLeft: "10px" }}>
                          <p>{video.snippet.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedVideo && (
                  <div className="video-details">
                    <h2>{selectedVideo.snippet.title}</h2>
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.snippet.resourceId.videoId}`}
                      title={selectedVideo.snippet.title}
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
