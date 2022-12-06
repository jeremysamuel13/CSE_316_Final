import { useContext } from "react";
import HomeScreen from "../components/HomeScreen";
import SplashScreen from "../components/SplashScreen";
import AuthContext from "../auth";

export default function HomeWrapper() {
  const { auth } = useContext(AuthContext);
  console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

  if (auth.loggedIn) return <HomeScreen />;
  else return <SplashScreen />;
}
