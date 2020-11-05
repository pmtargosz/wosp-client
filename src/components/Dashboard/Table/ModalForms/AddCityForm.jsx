import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";
import * as Yup from "yup";

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

const AddCityForm = observer(({ title }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const addCityForm = useFormik({
    initialValues: {
      name: "",
      people: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nazwa miasta jest wymagana"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        await rootStore.citiesStore.addCity(values);
        if (rootStore.citiesStore.addCityError) {
          setFieldError("name", rootStore.citiesStore.addCityError);
          return;
        }
        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Miasto zostało dodane!");
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
          onSubmit={addCityForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={addCityForm.isSubmitting}
            id="name"
            label="Miasto"
            name="name"
            onChange={addCityForm.handleChange}
            required
            type="text"
            value={addCityForm.values.name}
            variant="outlined"
            helperText={addCityForm.touched.name && addCityForm.errors.name}
            error={
              addCityForm.touched.name && addCityForm.errors.name !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={addCityForm.isSubmitting}
            id="people"
            label="Uczestników"
            name="people"
            onChange={addCityForm.handleChange}
            type="number"
            inputProps={{
              min: 0,
            }}
            value={addCityForm.values.people}
            variant="outlined"
          />
          <DialogActions className={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={addCityForm.isSubmitting}
            >
              Dodaj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {addCityForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default AddCityForm;
