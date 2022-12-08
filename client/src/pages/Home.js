import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "../components/ListCard.js";
import MUIDeleteModal from "../components/MUIDeleteModal";

import List from "@mui/material/List";
import EditToolbar from "../components/EditToolbar";
import { Paper, Stack } from "@mui/material";

const Home = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadIdNamePairs();
    if (store.published) {
      store.setPublished(false);
    }
  }, []);

  const lists = store.getFilteredPlaylist("user", (val) => val.name);

  return (
    <Stack>
      <Paper>
        <List
          sx={{
            overflow: "auto",
            margin: "0px 20px",
            bgcolor: "background.paper",
            maxHeight: "65vh",
          }}
        >
          {lists?.map((pair) => (
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

export default Home;
