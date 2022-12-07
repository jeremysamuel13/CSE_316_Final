import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/HighlightOff";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import { Stack, Toolbar, Typography } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);

  function handleAddNewSong() {
    store.addNewSong();
  }
  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }
  function handleClose() {
    store.closeCurrentList();
  }
  function handleCreateNewList() {
    store.createNewList();
  }
  const handleDuplicateList = () => {};

  return (
    <Stack direction={"row"} display="flex" justifyContent="center">
      <Stack display="flex" alignItems="center">
        <Toolbar>
          <Button
            disabled={!store.canAddNewSong()}
            id="add-song-button"
            onClick={handleAddNewSong}
            variant="contained"
          >
            <AddIcon />
          </Button>
        </Toolbar>
        <Typography variant="button">Song</Typography>
      </Stack>
      <Stack display="flex" alignItems="center">
        <Toolbar>
          <Button
            disabled={!store.canUndo()}
            id="undo-button"
            onClick={handleUndo}
            variant="contained"
          >
            <UndoIcon />
          </Button>
          <Button
            disabled={!store.canRedo()}
            id="redo-button"
            onClick={handleRedo}
            variant="contained"
          >
            <RedoIcon />
          </Button>
        </Toolbar>
        <Typography variant="button">History</Typography>
      </Stack>
      <Stack display="flex" alignItems="center">
        <Toolbar>
          <Button
            disabled={!store.currentList}
            variant="contained"
            onClick={handleDuplicateList}
          >
            <ContentCopyRoundedIcon />
          </Button>
          <Button
            disabled={store.currentList || store.published}
            variant="contained"
            onClick={handleCreateNewList}
          >
            <PlaylistAddCheckRoundedIcon />
          </Button>
          <Button
            disabled={!store.canClose()}
            id="close-button"
            onClick={handleClose}
            variant="contained"
          >
            <CloseIcon />
          </Button>
        </Toolbar>
        <Typography variant="button">Playlists</Typography>
      </Stack>
    </Stack>
  );
}

export default EditToolbar;
