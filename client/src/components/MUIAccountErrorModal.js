import { Alert, Button, Modal, Box } from "@mui/material";
import React, { useContext } from "react";
import AuthContext from "../auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const MUIAccountErrorModal = () => {
  const { auth } = useContext(AuthContext);

  const handleCloseModal = () => {
    auth.clearError();
  };

  return (
    <Modal open={auth.error !== null}>
      <Box sx={style}>
        <Alert closeText="Close" onClose={handleCloseModal}>
          {auth.error?.message}
        </Alert>
      </Box>
    </Modal>
  );
};

export default MUIAccountErrorModal;
