import { useContext, useEffect, useState } from "react";
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
import AuthContext from "../auth";
import WorkspaceScreen from "./WorkspaceScreen";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Stack } from "@mui/system";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
const PublishedListCard = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { playlist, expanded } = props;

  const [ratingState, setRatingState] = useState(null);

  useEffect(() => {
    if (playlist.hasLiked) {
      setRatingState("liked");
    } else if (playlist.hasDisliked) {
      setRatingState("disliked");
    } else {
      setRatingState("null");
    }
  }, [playlist]);

  const handleOpenList = () => {
    if (!expanded) {
      store.setCurrentList(playlist._id);
    } else {
      store.closeCurrentList();
    }
  };

  const handleLike = async () => {
    if (ratingState !== "liked") {
      await store.likePlaylist(playlist._id);
      setRatingState("liked");
    }
  };

  const handleDislike = async () => {
    console.log(playlist.hasDisliked);
    if (ratingState !== "disliked") {
      await store.dislikePlaylist(playlist._id);
      setRatingState("disliked");
    }
  };

  const guest = !auth.loggedIn;

  const likeValue =
    playlist.likes -
    (playlist.hasLiked ? 1 : 0) +
    (ratingState === "liked" ? 1 : 0);
  const dislikeValue =
    playlist.dislikes -
    (playlist.hasDisliked ? 1 : 0) +
    (ratingState === "disliked" ? 1 : 0);

  return (
    <Accordion expanded={expanded} sx={{ margin: "2% 1%" }}>
      <AccordionSummary>
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Stack>
            <Typography variant="h6">{playlist.name}</Typography>
            <Stack direction="row" spacing={3}>
              <Typography>
                <b>Published:</b>
                {new Date(playlist.publishDate).toLocaleDateString("en-US")}
              </Typography>
              <Typography>
                <b>Listens:</b>
                {playlist.listens}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton disabled={guest} onClick={handleLike}>
            {ratingState === "liked" ? (
              <ThumbUpAltIcon />
            ) : (
              <ThumbUpOffAltIcon />
            )}
            {Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(likeValue)}
          </IconButton>
          <IconButton disabled={guest} onClick={handleDislike}>
            {ratingState === "disliked" ? (
              <ThumbDownAltIcon />
            ) : (
              <ThumbDownOffAltIcon />
            )}
            {Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(dislikeValue)}
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
        {expanded && <WorkspaceScreen id={playlist._id} />}
      </AccordionDetails>
    </Accordion>
  );
};

export default PublishedListCard;
