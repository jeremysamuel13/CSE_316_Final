import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function SplashScreen() {
  return (
    <div id="splash-screen">
      <Stack spacing={2} alignItems="center">
        <Typography
          variant="h1"
          noWrap
          component="div"
          sx={{
            color: "red",
            fontFamily: "'Satisfy', cursive",
            fontWeight: "bold",
          }}
        >
          Playlister
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "black",
            fontWeight: "bold",
          }}
        >
          Welcome to Playlister!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "black",
          }}
        >
          All your favorite music in one place. Start creating and browsing
          numerous playlists today!
        </Typography>
        <Stack spacing={2} direction="row">
          <Button
            size="large"
            variant="contained"
            sx={{ backgroundColor: "black" }}
            href="/login"
          >
            Login
          </Button>
          <Button
            size="large"
            variant="contained"
            sx={{ backgroundColor: "black" }}
            href="/register"
          >
            Register
          </Button>
          <Button
            size="large"
            variant="contained"
            sx={{ backgroundColor: "black" }}
            href="/all"
          >
            Continue as Guest
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
