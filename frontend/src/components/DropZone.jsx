// DropZone.js
import { useDrop } from "react-dnd";
import { DraggablePlaylistCard } from "./DraggablePlaylistCard";

export const DropZone = ({ playlists, setPlaylists }) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => {
      const movedPlaylist = playlists[item.index];
      const updatedPlaylists = [...playlists];
      updatedPlaylists.splice(item.index, 1); // Remove the item from the original position
      updatedPlaylists.splice(item.index, 0, movedPlaylist); // Insert the item in the new position
      setPlaylists(updatedPlaylists);
    },
  }));

  return (
    <div ref={drop} className="playlists">
      {playlists.map((playlist, index) => (
        <DraggablePlaylistCard
          key={playlist.id}
          index={index}
          playlist={playlist}
          movePlaylist={setPlaylists}
        />
      ))}
    </div>
  );
};
