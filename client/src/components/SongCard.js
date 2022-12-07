import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function SongCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const { song, index } = props;

  function handleDragStart(event) {
    event.dataTransfer.setData("song", index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    let targetIndex = index;
    let sourceIndex = Number(event.dataTransfer.getData("song"));
    setDraggedTo(false);

    // UPDATE THE LIST
    store.addMoveSongTransaction(sourceIndex, targetIndex);
  }
  function handleRemoveSong(event) {
    store.showRemoveSongModal(index, song);
  }
  function handleDoubleClick(event) {
    // DOUBLE CLICK IS FOR SONG EDITING

    store.showEditSongModal(index, song);
  }

  const handleClick = () => {
    store.playIndex(index);
  };

  return (
    <Paper
      sx={{
        backgroundColor: "wheat",
        color: "black",
        "&:hover": {
          backgroundColor: "gray",
          color: "white",
        },
        padding: "1% 2%",
        margin: "2% 1%",
      }}
    >
      <Stack
        key={index}
        id={"song-" + index + "-card"}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable="true"
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Typography variant="h6">
          {index + 1}.
          <Link to={"https://www.youtube.com/watch?v=" + song.youTubeId}>
            {song.title} by {song.artist}
          </Link>
        </Typography>
        <IconButton id={"remove-song-" + index} onClick={handleRemoveSong}>
          <ClearIcon />
        </IconButton>
        {/* {index + 1}. */}
        {/* <a id={"song-" + index + "-link"} className="song-link">
        {song.title} by {song.artist}
      </a> */}
      </Stack>
    </Paper>
  );
}

export default SongCard;
