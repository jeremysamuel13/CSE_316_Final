import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Fade,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRef, useContext } from "react";
import YouTube from "react-youtube";
import GlobalStoreContext from "../store";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export const YoutubePlayer = () => {
  const { store } = useContext(GlobalStoreContext);

  const playerRef = useRef(null);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlay = () => {
    playerRef.current.playVideo();
  };

  const onPause = () => {
    playerRef.current.pauseVideo();
  };

  const canPlay = store.currentSongIndex !== -1;
  const canPause = store.currentSongIndex !== -1;
  const hasNext =
    store.currentList?.songs.length > 0 &&
    store.currentSongIndex + 1 < store.currentList?.songs.length;
  const hasPrevious = store.currentSongIndex - 1 > 0;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          id="yt-player-div"
          style={{
            position: "relative",
            paddingBottom: "56.25%" /* 16:9 */,
            paddingTop: 25,
            height: 0,
          }}
        >
          <YouTube
            disabled={!store?.currentSong}
            videoId={store?.currentSong?.youTubeId ?? ""}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: {
                autoplay: 0,
                controls: 0,
                fs: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
              },
            }}
            onReady={onPlayerReady}
            onEnd={store.playNext}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Grid>
      <Grid xs={12} item container direction="row" justifyContent="center">
        <ButtonGroup
          color="primary"
          variant="contained"
          sx={{ margin: "3% 0%", backgroundColor: "white" }}
        >
          <Button disabled={!hasPrevious} onClick={store?.playPrevious}>
            <SkipPreviousIcon />
          </Button>
          <Button disabled={!canPlay} onClick={onPlay}>
            <PlayArrowIcon />
          </Button>
          <Button disabled={!canPause} onClick={onPause}>
            <PauseIcon />
          </Button>
          <Button disabled={!hasNext} onClick={store?.playNext}>
            <SkipNextIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Fade in={!!(store.currentSong || store.currentList)}>
        <Grid item xs={12} sx={{ margin: "0% 5%" }}>
          <Paper>
            <Card>
              <CardContent>
                {store.currentSong && (
                  <>
                    <Typography>
                      <b>Song: </b> {store.currentSong.title}
                    </Typography>
                    <Typography>
                      <b>Artist: </b> {store.currentSong.artist}
                    </Typography>
                  </>
                )}
                <Typography>
                  <b>Playlist: </b> {store.currentList?.name}
                </Typography>
                <Typography>
                  <b>Position: </b>
                  {store.currentSongIndex >= 0
                    ? store.currentSongIndex + 1
                    : "-"}
                  /{store.currentList?.songs?.length}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Fade>
    </Grid>
  );
};
