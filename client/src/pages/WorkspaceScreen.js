import { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  console.log("rerender");

  useEffect(() => {
    if (store.currentList?._id !== id) {
      store.setCurrentList(id, true);
    }
  }, []);

  let modalJSX = "";
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
  }

  return (
    <Box>
      <List
        id="playlist-cards"
        sx={{ width: "100%", bgcolor: "background.paper" }}
      >
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
