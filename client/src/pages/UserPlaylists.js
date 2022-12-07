import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "../components/ListCard.js";
import MUIDeleteModal from "../components/MUIDeleteModal";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import EditToolbar from "../components/EditToolbar";
import { Paper } from "@mui/material";
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const UserPlaylists = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  function handleCreateNewList() {
    store.createNewList();
  }

  return (
    <div>
      <div>
        <Fab
          color="primary"
          aria-label="add"
          id="add-list-button"
          onClick={handleCreateNewList}
        >
          <AddIcon />
        </Fab>
        <Typography variant="h2">Your Lists</Typography>
      </div>

      <Paper style={{ maxHeight: "50vh", overflow: "auto" }}>
        <List sx={{ margin: "0px 20px", bgcolor: "background.paper" }}>
          {store?.idNamePairs?.map((pair) => (
            <ListCard
              key={pair._id}
              idNamePair={pair}
              selected={false}
              expanded={pair._id === store.currentList?._id}
            />
          ))}
        </List>
      </Paper>

      <EditToolbar />

      <MUIDeleteModal />
    </div>
  );
};

export default UserPlaylists;
