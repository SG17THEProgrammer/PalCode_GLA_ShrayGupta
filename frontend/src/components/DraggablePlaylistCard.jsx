// DraggablePlaylistCard.js
import { useDrag } from "react-dnd";
import { BsCollectionPlayFill } from "react-icons/bs";

export const DraggablePlaylistCard = ({ playlist, index, movePlaylist }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: playlist.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="playlist"
      onClick={() => console.log(`Playlist clicked: ${playlist.id}`)} // Modify this as needed
    >
      <div className="playDiv">
        <img
          className="playlist-thumbnail"
          src={playlist.snippet.thumbnails.medium.url}
          alt={playlist.snippet.title}
        />
        <h3 className="playlistTitle">{playlist.snippet.title}</h3>
        <div className="cntBtn">
          <BsCollectionPlayFill /> &nbsp; &nbsp;
          <h4>{playlist.videoCount} Videos</h4>
        </div>
      </div>
    </div>
  );
};
