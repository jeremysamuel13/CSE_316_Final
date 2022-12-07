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
  Typography,
} from "@mui/material";
import WorkspaceScreen from "./WorkspaceScreen";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
const PublishedListCard = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const { playlist, expanded } = props;

  const handleOpenList = () => {
    if (!expanded) {
      store.setCurrentList(playlist._id);
    } else {
      store.closeCurrentList();
    }
  };

  return (
    <Accordion expanded={expanded} sx={{ margin: "2% 0%" }}>
      <AccordionSummary>
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Typography variant="h6">{playlist.name}</Typography>
          {
            <Typography>
              <b>Published:</b>
              {playlist.publishDate}
            </Typography>
          }
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
        {expanded && <WorkspaceScreen id={playlist._id} />}
      </AccordionDetails>
    </Accordion>
  );
};

export default PublishedListCard;
