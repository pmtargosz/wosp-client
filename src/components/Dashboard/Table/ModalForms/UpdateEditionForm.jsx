import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";
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

const UpdateEditionForm = observer(
  ({ title, id, name, startDate, endDate, target }) => {
    const rootStore = useContext(RootStoresContext);
    const dateFns = new DateFnsAdapter();

    const handleClose = () => {
      rootStore.modalStore.setModal(false);
    };

    const updateEditionForm = useFormik({
      initialValues: {
        name: name,
        startDate: dateFns.date(startDate),
        startDateTime: dateFns.date(startDate),
        endDate: dateFns.date(endDate),
        target: target,
      },
      onSubmit: async (values, { setFieldError }) => {
        try {
          const { name, startDate, startDateTime, endDate, target } = values;

          const date = dateFns.format(startDate, "yyyy-MM-dd"); //dd/MM/yyyy
          const time = dateFns.format(startDateTime, "HH:mm"); //HH:mm
          const endTime = dateFns.format(endDate, "HH:mm"); //HH:mm

          await rootStore.editionsStore.updateEdition({
            id: id,
            name,
            startDate: new Date(`${date} ${time}`),
            endDate: new Date(`${date} ${endTime}`),
            target,
          });

          if (rootStore.editionsStore.updateEditionError) {
            setFieldError("name", rootStore.editionsStore.updateEditionError);
            return;
          }

          rootStore.alertStore.setType("success");
          rootStore.alertStore.setMsg("Dane wydażenia zostały uaktualnione!");
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
            onSubmit={updateEditionForm.handleSubmit}
          >
            <TextField
              autoFocus
              fullWidth
              className={styles.input}
              disabled={updateEditionForm.isSubmitting}
              id="name"
              label="Wydarzenie"
              name="name"
              onChange={updateEditionForm.handleChange}
              required
              type="text"
              value={updateEditionForm.values.name}
              variant="outlined"
              helperText={
                updateEditionForm.touched.name && updateEditionForm.errors.name
              }
              error={
                updateEditionForm.touched.name &&
                updateEditionForm.errors.name !== undefined
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
                value={updateEditionForm.values.startDate}
                onChange={(startDate) =>
                  updateEditionForm.setFieldValue("startDate", startDate)
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
                value={updateEditionForm.values.startDateTime}
                onChange={(startDateTime) =>
                  updateEditionForm.setFieldValue(
                    "startDateTime",
                    startDateTime
                  )
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
                label="Godzina zakończenia"
                className={styles.input}
                value={updateEditionForm.values.endDate}
                onChange={(endDate) =>
                  updateEditionForm.setFieldValue("endDate", endDate)
                }
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              className={styles.input}
              disabled={updateEditionForm.isSubmitting}
              id="target"
              label="Cel"
              name="target"
              onChange={updateEditionForm.handleChange}
              type="number"
              inputProps={{
                min: 0,
              }}
              value={updateEditionForm.values.target}
              variant="outlined"
            />
            <DialogActions className={styles.actions}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={updateEditionForm.isSubmitting}
              >
                Edytuj
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Anuluj
              </Button>
            </DialogActions>
            {updateEditionForm.isSubmitting && (
              <CircularProgress size={24} className={styles.progress} />
            )}
          </form>
        </DialogContent>
      </>
    );
  }
);

export default UpdateEditionForm;
