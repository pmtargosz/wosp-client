import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const UpdateCityForm = observer(({ title, id, name, people }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const updateCityForm = useFormik({
    initialValues: {
      name: name,
      people: people,
    },
    onSubmit: async (values, { setFieldError }) => {
      try {
        await rootStore.citiesStore.updateCity({
          id: id,
          ...values,
        });

        if (rootStore.citiesStore.updateCityError) {
          setFieldError("name", rootStore.citiesStore.updateCityError);
          return;
        }
        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Dane miasta zostały uaktualnione!");
        rootStore.alertStore.setOpen(true);

        rootStore.modalStore.setModal(false);
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <>
      <DialogTitle color="secondary">{title}</DialogTitle>
      <DialogContent>
        <form
          className={styles.form}
          noValidate
          spellCheck="fasle"
          onSubmit={updateCityForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={updateCityForm.isSubmitting}
            id="name"
            label="Miasto"
            name="name"
            onChange={updateCityForm.handleChange}
            required
            type="text"
            value={updateCityForm.values.name}
            variant="outlined"
            helperText={
              updateCityForm.touched.name && updateCityForm.errors.name
            }
            error={
              updateCityForm.touched.name &&
              updateCityForm.errors.name !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={updateCityForm.isSubmitting}
            id="people"
            label="Uczestnikow"
            name="people"
            onChange={updateCityForm.handleChange}
            type="number"
            inputProps={{
              min: 0,
            }}
            value={updateCityForm.values.people}
            variant="outlined"
          />
          <DialogActions className={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={updateCityForm.isSubmitting}
            >
              Edytuj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {updateCityForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default UpdateCityForm;
