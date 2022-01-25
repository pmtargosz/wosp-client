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
  MenuItem,
} from "@material-ui/core";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const AddSocialMediaForm = observer(({ title }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const addSocialMediaForm = useFormik({
    initialValues: {
      name: "",
      url: "",
      type: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nazwa jest wymagana"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        await rootStore.socialMediaStore.addSocialMedia(values);
        if (rootStore.socialMediaStore.addSocialMediaError) {
          setFieldError("name", rootStore.socialMediaStore.addSocialMediaError);
          return;
        }
        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Social Media zostało dodane!");
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
          onSubmit={addSocialMediaForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={addSocialMediaForm.isSubmitting}
            id="name"
            label="Nazwa"
            name="name"
            onChange={addSocialMediaForm.handleChange}
            required
            type="text"
            value={addSocialMediaForm.values.name}
            variant="outlined"
            helperText={addSocialMediaForm.touched.name && addSocialMediaForm.errors.name}
            error={
                addSocialMediaForm.touched.name && addSocialMediaForm.errors.name !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={addSocialMediaForm.isSubmitting}
            id="url"
            label="Url"
            name="url"
            onChange={addSocialMediaForm.handleChange}
            type="text"
            value={addSocialMediaForm.values.url}
            variant="outlined"
          />
          <TextField
            className={styles.input}
            disabled={addSocialMediaForm.isSubmitting}
            id="type"
            label="Typ"
            name="type"
            onChange={addSocialMediaForm.handleChange}
            select
            value={addSocialMediaForm.values.type}
            variant="outlined"
          >
            <MenuItem value="">
              <em> - </em>
            </MenuItem>
            <MenuItem value="yt">
              YouTube
            </MenuItem>
            <MenuItem value="fb">
              Facebook
            </MenuItem>
          </TextField>
          <DialogActions className={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={addSocialMediaForm.isSubmitting}
            >
              Dodaj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {addSocialMediaForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default AddSocialMediaForm;
