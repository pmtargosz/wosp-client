import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const AddUserForm = observer(({ title }) => {
  const rootStore = useContext(RootStoresContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    rootStore.modalStore.setModal(false);
  };

  const addUserForm = useFormik({
    initialValues: {
      username: "",
      password: "",
      cityId: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Nazwa użytkownika jest wymagana"),
      password: Yup.string().required("Hasło jest wymagane"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const { username, password, cityId } = values;

        await rootStore.usersStore.addUser({
          username: username,
          password: password,
          cityId: cityId.length > 0 ? cityId : undefined,
        });
        if (rootStore.usersStore.addUserError) {
          setFieldError("username", rootStore.usersStore.addUserError);
          return;
        }
        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Koordynator został dodany!");
        rootStore.alertStore.setOpen(true);

        rootStore.modalStore.setModal(false);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const citiesList = rootStore.citiesStore.cities.map((city) => (
    <MenuItem key={city.id} value={city.id}>
      {city.name}
    </MenuItem>
  ));

  return (
    <>
      <DialogTitle color="secondary">{title}</DialogTitle>
      <DialogContent>
        <form
          className={styles.form}
          noValidate
          spellCheck="fasle"
          onSubmit={addUserForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={addUserForm.isSubmitting}
            id="username"
            label="Nazwa użytkownika"
            margin="normal"
            name="username"
            onChange={addUserForm.handleChange}
            required
            type="text"
            value={addUserForm.values.username}
            variant="outlined"
            helperText={
              addUserForm.touched.username && addUserForm.errors.username
            }
            error={
              addUserForm.touched.username &&
              addUserForm.errors.username !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={addUserForm.isSubmitting}
            id="password"
            label="Hasło"
            margin="normal"
            name="password"
            onChange={addUserForm.handleChange}
            required
            type={showPassword ? "text" : "password"}
            value={addUserForm.values.password}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={
              addUserForm.touched.password && addUserForm.errors.password
            }
            error={
              addUserForm.touched.password &&
              addUserForm.errors.password !== undefined
                ? true
                : false
            }
          />
          <TextField
            className={styles.input}
            disabled={addUserForm.isSubmitting}
            id="cityId"
            label="Miasto"
            name="cityId"
            onChange={addUserForm.handleChange}
            select
            value={addUserForm.values.cityId}
            variant="outlined"
          >
            <MenuItem value="">
              <em> - </em>
            </MenuItem>
            {citiesList}
          </TextField>
          <DialogActions className={styles.actions}>
            <Button
              color="primary"
              disabled={addUserForm.isSubmitting}
              type="submit"
              variant="contained"
            >
              Dodaj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {addUserForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default AddUserForm;
