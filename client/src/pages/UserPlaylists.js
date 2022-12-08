import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import PublishedListCard from "../components/PublishedListCard";
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
    store.loadPublishedPlaylists();
    if (!store.published) {
      store.setPublished(true);
    }
  }, []);

  const lists = store.getFilteredPlaylist(
    "published",
    (val) => `${val.firstName} ${val.lastName}`
  );

  return (
    <Stack>
      <Paper>
        <List
          sx={{
            maxHeight: "65vh",
            overflow: "auto",
            margin: "0px 20px",
            bgcolor: "background.paper",
          }}
        >
          {lists?.map((pl) => (
            <PublishedListCard
              key={pl._id}
              playlist={pl}
              expanded={pl._id === store.currentList?._id}
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
