import { useContext, useState } from "react";
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

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const { idNamePair, expanded } = props;

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
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  const handleOpenList = () => {
    if (!expanded) {
      store.setCurrentList(idNamePair._id);
    } else {
      store.closeCurrentList();
    }
  };

  const handlePublishList = () => {
    store.publishList(idNamePair._id);
  };

  if (idNamePair.isPublished) {
    return <PublishedListCard expanded={expanded} playlist={idNamePair} />;
  }

  if (editActive) {
    return (
      <TextField
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
      />
    );
  }

  console.log(idNamePair);
  return (
    <Accordion expanded={expanded} sx={{ margin: "2% 0%" }}>
      <AccordionSummary>
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Stack>
            <Typography variant="h6">{idNamePair.name}</Typography>
            <Typography variant="caption">
              <b>By:</b> {idNamePair.username}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton onClick={handleToggleEdit} aria-label="edit">
            <EditIcon style={{ fontSize: "16pt" }} />
          </IconButton>
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
