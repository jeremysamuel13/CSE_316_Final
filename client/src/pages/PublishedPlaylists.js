import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import MUIDeleteModal from "../components/MUIDeleteModal";

import List from "@mui/material/List";
import EditToolbar from "../components/EditToolbar";
import { Paper, Stack } from "@mui/material";
import PublishedListCard from "../components/PublishedListCard";
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const PublishedPlaylists = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadPublishedPlaylists();
    if (!store.published) {
      store.setPublished(true);
    }
  }, []);

  return (
    <Stack>
      <Paper style={{ maxHeight: "70vh", overflow: "auto" }}>
        <List sx={{ margin: "0px 20px", bgcolor: "background.paper" }}>
          {store?.publishedPlaylists?.map((pl) => (
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

export default PublishedPlaylists;
