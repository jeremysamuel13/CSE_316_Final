import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import Comments from "./Comments";

const SidePanel = () => {
  const [tab, setTab] = useState("0");

  const onChange = (event, newTab) => setTab(newTab);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={onChange} centered>
            <Tab label="Youtube Player" value="0" />
            <Tab label="Comments" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <YoutubePlayer />
        </TabPanel>
        <TabPanel value="1">
          <Comments />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default SidePanel;
