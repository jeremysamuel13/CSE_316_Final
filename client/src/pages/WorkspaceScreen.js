import { useContext } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "../components/SongCard.js";
import MUIEditSongModal from "../components/MUIEditSongModal";
import MUIRemoveSongModal from "../components/MUIRemoveSongModal";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { GlobalStoreContext } from "../store/index.js";

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  console.log("rerender");

  let modalJSX = "";
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
  }

  return (
    <Box>
      <List id="playlist-cards" sx={{ width: "100%", margin: "2%" }}>
        {store.currentList?.songs.map((song, index) => (
          <SongCard
            id={"playlist-song-" + index}
            key={"playlist-song-" + index}
            index={index}
            song={song}
          />
        ))}
      </List>
      {modalJSX}
    </Box>
  );
}

export default WorkspaceScreen;
