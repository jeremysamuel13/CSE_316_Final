import React, { useEffect, useState, useContext } from "react";
import {
  ButtonGroup,
  Input,
  Button,
  Box,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import GlobalStoreContext from "../store";
import { Stack } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MUIDuplicatePlaylistModal = () => {
  const { store } = useContext(GlobalStoreContext);
  const [nameInput, setNameInput] = useState(null);

  const name = nameInput ?? store.currentList?.name;

  function handleDuplicateList(event) {
    store.createNewList({ songs: store.currentList?.songs, name });
    store.hideModals();
    setNameInput(null);
  }
  function handleCloseModal(event) {
    store.hideModals();
    setNameInput(null);
  }

  return (
    <Modal open={store.isDuplicateListModal()}>
      <Paper sx={style}>
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <Typography variant="h6">New List Name: </Typography>
            <Input
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </Stack>
          <ButtonGroup>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleDuplicateList}>Duplicate</Button>
          </ButtonGroup>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default MUIDuplicatePlaylistModal;
