import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { RootStoresContext } from "../../stores/RootStore";

export const ModalRemove = observer(({ callback, msg }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const handleRemove = async () => {
    try {
      await callback();
      handleClose();
    } catch (err) {
      handleClose();
      console.error(err);
    }
  };
  return (
    <>
      <DialogTitle color="secondary">Usuń</DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleRemove}>
            Usuń
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Anuluj
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
});

const Modal = observer(() => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  return rootStore.modalStore.modalView ? (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={rootStore.modalStore.modal}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      {rootStore.modalStore.modalView}
    </Dialog>
  ) : (
    ""
  );
});

export default Modal;
