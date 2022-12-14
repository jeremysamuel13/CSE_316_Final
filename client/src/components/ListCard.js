import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import WorkspaceScreen from "./WorkspaceScreen";
import PublishIcon from "@mui/icons-material/Publish";
import PublishedListCard from "./PublishedListCard";
import AuthContext from "../auth";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const { idNamePair, expanded } = props;
  const [error, setError] = useState(false);

  useEffect(() => {
    if (expanded && !idNamePair.isPublished) {
      store.listen(idNamePair._id);
    }
  }, [expanded]);

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  function handleDeleteList(event, id) {
    event.stopPropagation();
    // let _id = event.target.id;
    // _id = ("" + _id).substring("delete-list-".length);
    store.markListForDeletion(id);
  }

  function handleKeyPress(event) {
    console.log(event.code);
    if (event.code === "Enter" && !error) {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
    const err = store.idNamePairs.some(
      (x) =>
        x._id !== idNamePair._id && x.name.trim() === event.target.value.trim()
    );
    if (err !== error) {
      setError(err);
    }
  }

  const handleOpenList = () => {
    if (!expanded) {
      store.setCurrentList(idNamePair._id);
    }
  };

  const handlePublishList = () => {
    store.publishList(idNamePair._id);
  };

  const owned = auth.user?.username === idNamePair.username;
  const playing = store.currentList?._id === idNamePair._id;

  const backgroundColor = playing ? "#7f02a3" : owned ? "#FFFDD0" : undefined;

  if (idNamePair.isPublished) {
    return <PublishedListCard expanded={expanded} playlist={idNamePair} />;
  }

  if (editActive) {
    return (
      <TextField
        error={error}
        margin="normal"
        required
        id={"list-" + idNamePair._id}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 36 } }}
        InputLabelProps={{ style: { fontSize: 16 } }}
        autoFocus
        sx={{ backgroundColor }}
      />
    );
  }

  console.log(idNamePair);

  return (
    <Accordion expanded={expanded} sx={{ margin: "2% 0%", backgroundColor }}>
      <AccordionSummary
        onDoubleClick={!expanded ? handleToggleEdit : undefined}
      >
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Stack>
            <Typography variant="h6">{idNamePair.name}</Typography>
            <Typography variant="caption">
              <b>By:</b> {idNamePair.username}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton
            onClick={(event) => {
              handleDeleteList(event, idNamePair._id);
            }}
            aria-label="delete"
          >
            <DeleteIcon style={{ fontSize: "16pt" }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton onClick={(event) => handlePublishList(event)}>
            <PublishIcon style={{ fontSize: "16pt" }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton
            onClick={(event) => handleOpenList(event)}
            aria-label="delete"
          >
            <KeyboardArrowDownIcon style={{ fontSize: "16pt" }} />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {expanded && <WorkspaceScreen id={idNamePair._id} />}
      </AccordionDetails>
    </Accordion>
  );
}

export default ListCard;
