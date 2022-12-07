import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import Comments from "./Comments";
import { Typography } from "@mui/material";
import GlobalStoreContext from "../store";
import { useContext } from "react";

const SidePanel = () => {
  const { store } = useContext(GlobalStoreContext);

  const [tab, setTab] = useState("0");
  const onChange = (event, newTab) => setTab(newTab);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={onChange} centered>
            <Tab label="Youtube Player" value="0" />
            <Tab
              label="Comments"
              value="1"
              disabled={!store.currentList?.isPublished}
            />
          </TabList>
        </Box>
        <Typography component={"span"} hidden={tab !== "0"}>
          <YoutubePlayer />
        </Typography>
        <Typography component={"span"} hidden={tab !== "1"}>
          <Comments />
        </Typography>
      </TabContext>
    </Box>
  );
};

export default SidePanel;
