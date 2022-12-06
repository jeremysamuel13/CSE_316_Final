import { useContext } from "react";
import { Route } from "react-router-dom";
import AuthContext from "../auth";
import { YoutubePlayer } from "../components/YoutubePlayer";
import {
  HomeWrapper,
  LoginScreen,
  RegisterScreen,
  WorkspaceScreen,
} from "../pages";

const PATHS = [
  {
    path: "/",
    component: HomeWrapper,
    guest_access: true,
  },
  {
    path: "/login/",
    component: LoginScreen,
    guest_access: true,
  },
  {
    path: "/register/",
    component: RegisterScreen,
    guest_access: true,
  },
  {
    path: "/playlist/:id",
    component: WorkspaceScreen,
    guest_access: false,
  },
  {
    path: "/youtube",
    component: YoutubePlayer,
    guest_access: false,
  },
];

export const NotAuthorized = () => {
  return <>User is not authorized</>;
};

export const Router = () => {
  const { auth } = useContext(AuthContext);

  return PATHS.map((r) => {
    if (!auth.loggedIn && r.guest_access === false) {
      return <NotAuthorized key={r.path} />;
    } else {
      return <Route path={r.path} exact component={r.component} key={r.path} />;
    }
  });
};
