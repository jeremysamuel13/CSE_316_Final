import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Box } from "@mui/system";
import { useContext } from "react";
import { Route } from "react-router-dom";
import AuthContext from "../auth";
import SplashScreen from "../components/SplashScreen";
import { YoutubePlayer } from "../components/YoutubePlayer";

import {
  UserPlaylists,
  LoginScreen,
  RegisterScreen,
  PublishedPlaylists,
} from "../pages";

const PATHS = [
  {
    path: "/",
    component: <SplashScreen />,
    allowGuest: true,
    withPlayer: false,
  },
  {
    path: "/playlists/",
    component: <UserPlaylists />,
    allowGuest: false,
    withPlayer: true,
  },
  {
    path: "/published/",
    component: <PublishedPlaylists />,
    allowGuest: true,
    withPlayer: true,
  },
  {
    path: "/login/",
    component: <LoginScreen />,
    allowGuest: true,
    withPlayer: false,
  },
  {
    path: "/register/",
    component: <RegisterScreen />,
    allowGuest: true,
    withPlayer: false,
  },
];

export const NotAuthorized = () => {
  return <>User is not authorized</>;
};

const HorizontalStack = ({ children }) => {
  return (
    <Grid2 container spacing={3} direction="row" sx={{ minHeight: "70vh" }}>
      <Grid2 xs={7} alignItems="center" justifyContent="center">
        {children}
      </Grid2>
      <Grid2 xs={5}>
        <Box
          style={{ width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <YoutubePlayer />
        </Box>
      </Grid2>
    </Grid2>
  );
};

export const Router = () => {
  const { auth } = useContext(AuthContext);

  return PATHS.map((r) => {
    if (!auth.loggedIn && r.allowGuest === false) {
      return <NotAuthorized key={r.path} />;
    }
    if (r.withPlayer) {
      return (
        <Route path={r.path} exact key={r.path}>
          <HorizontalStack>{r.component}</HorizontalStack>
        </Route>
      );
    }

    return (
      <Route path={r.path} exactkey={r.path}>
        {r.component}
      </Route>
    );
  });
};
