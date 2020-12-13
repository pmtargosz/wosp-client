import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";
import * as Yup from "yup";
import DateFnsAdapter from "@date-io/date-fns";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const AddEditionForm = observer(({ title }) => {
  const rootStore = useContext(RootStoresContext);
  const dateFns = new DateFnsAdapter();

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const addEditionForm = useFormik({
    initialValues: {
      name: "",
      startDate: dateFns.date(),
      startDateTime: dateFns.date(),
      endDate: dateFns.date(),
      target: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nazwa jest wymagana!"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const { name, startDate, startDateTime, endDate, target } = values;
        const date = dateFns.format(startDate, "yyyy-MM-dd"); //dd/MM/yyyy
        const time = dateFns.format(startDateTime, "HH:mm"); //HH:mm

        await rootStore.editionsStore.addEdition({
          name,
          startDate: `${date} ${time}`,
          endDate: dateFns.date(endDate),
          target,
          isActive: false,
          // activeTimer: false,
        });

        if (rootStore.editionsStore.addEditionError) {
          setFieldError("name", rootStore.editionsStore.addEditionError);
          return;
        }

        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Wydarzenie zostało dodane!");
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
          onSubmit={addEditionForm.handleSubmit}
        >
          <TextField
            autoFocus
            fullWidth
            className={styles.input}
            disabled={addEditionForm.isSubmitting}
            id="name"
            label="Wydarzenie"
            name="name"
            onChange={addEditionForm.handleChange}
            required
            type="text"
            value={addEditionForm.values.name}
            variant="outlined"
            helperText={
              addEditionForm.touched.name && addEditionForm.errors.name
            }
            error={
              addEditionForm.touched.name &&
              addEditionForm.errors.name !== undefined
                ? true
                : false
            }
          />
          <MuiPickersUtilsProvider utils={DateFnsAdapter}>
            <KeyboardDatePicker
              inputVariant="outlined"
              id="startDate"
              name="startDate"
              label="Data rozpoczęcia"
              format="dd/MM/yyyy"
              className={styles.input}
              value={addEditionForm.values.startDate}
              onChange={(startDate) =>
                addEditionForm.setFieldValue("startDate", startDate)
              }
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardTimePicker
              inputVariant="outlined"
              ampm={false}
              id="startDateTime"
              name="startDateTime"
              label="Godzina rozpoczęcia"
              className={styles.input}
              value={addEditionForm.values.startDateTime}
              onChange={(startDateTime) =>
                addEditionForm.setFieldValue("startDateTime", startDateTime)
              }
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
            <KeyboardTimePicker
              inputVariant="outlined"
              ampm={false}
              id="endDate"
              name="endDate"
              label="Godzina rozpoczęcia"
              className={styles.input}
              value={addEditionForm.values.endDate}
              onChange={(endDate) =>
                addEditionForm.setFieldValue("endDate", endDate)
              }
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            className={styles.input}
            disabled={addEditionForm.isSubmitting}
            id="target"
            label="Cel"
            name="target"
            onChange={addEditionForm.handleChange}
            type="number"
            inputProps={{
              min: 0,
            }}
            value={addEditionForm.values.target}
            variant="outlined"
          />
          <DialogActions className={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={addEditionForm.isSubmitting}
            >
              Dodaj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {addEditionForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default AddEditionForm;
