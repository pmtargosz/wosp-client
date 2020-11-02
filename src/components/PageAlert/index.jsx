import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { RootStoresContext } from "../../stores/RootStore";

const PageAlert = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    rootStore.alertStore.setOpen(false);
  };
  return (
    <Snackbar
      open={rootStore.alertStore.open}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert
        severity={rootStore.alertStore.type}
        variant="filled"
        onClose={handleClose}
      >
        {rootStore.alertStore.msg}
      </Alert>
    </Snackbar>
  );
});

export default PageAlert;
