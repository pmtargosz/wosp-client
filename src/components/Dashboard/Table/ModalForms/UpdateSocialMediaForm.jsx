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
  MenuItem,
} from "@material-ui/core";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const UpdateSocialMediaForm = observer(({ title, id, name, url, type }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const updateSocialMediaForm = useFormik({
    initialValues: {
      name: name,
      url: url,
      type: type
    },
    onSubmit: async (values, { setFieldError }) => {
      try {
        await rootStore.socialMediaStore.addSocialMedia({
          id: id,
          ...values,
        });

        if (rootStore.socialMediaStore.addSocialMediaError) {
          setFieldError("name", rootStore.socialMediaStore.addSocialMediaError);
          return;
        }

        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Dane Social Media zostały uaktualnione!");
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
          onSubmit={updateSocialMediaForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={updateSocialMediaForm.isSubmitting}
            id="name"
            label="Nazwa"
            name="name"
            onChange={updateSocialMediaForm.handleChange}
            required
            type="text"
            value={updateSocialMediaForm.values.name}
            variant="outlined"
            helperText={
              updateSocialMediaForm.touched.name && updateSocialMediaForm.errors.name
            }
            error={
              updateSocialMediaForm.touched.name &&
              updateSocialMediaForm.errors.name !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={updateSocialMediaForm.isSubmitting}
            id="url"
            label="Url"
            name="url"
            onChange={updateSocialMediaForm.handleChange}
            type="text"
            value={updateSocialMediaForm.values.url}
            variant="outlined"
          />
           <TextField
            className={styles.input}
            disabled={updateSocialMediaForm.isSubmitting}
            id="type"
            label="Typ"
            name="type"
            onChange={updateSocialMediaForm.handleChange}
            select
            value={updateSocialMediaForm.values.type}
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
              disabled={updateSocialMediaForm.isSubmitting}
            >
              Edytuj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {updateSocialMediaForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default UpdateSocialMediaForm;
