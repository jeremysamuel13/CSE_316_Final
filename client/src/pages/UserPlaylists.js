import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "../components/ListCard.js";
import MUIDeleteModal from "../components/MUIDeleteModal";

import List from "@mui/material/List";
import EditToolbar from "../components/EditToolbar";
import { Paper, Stack } from "@mui/material";
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const UserPlaylists = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadIdNamePairs();
    if (store.published) {
      store.setPublished(false);
    }
  }, []);

  return (
    <Stack>
      <Paper style={{ maxHeight: "70vh", overflow: "auto" }}>
        <List sx={{ margin: "0px 20px", bgcolor: "background.paper" }}>
          {store?.idNamePairs?.map((pair) => (
            <ListCard
              key={pair._id}
              idNamePair={pair}
              expanded={pair._id === store.currentList?._id}
            />
          ))}
        </List>
      </Paper>
      <EditToolbar />
      <MUIDeleteModal />
    </Stack>
  );
};

export default UserPlaylists;
