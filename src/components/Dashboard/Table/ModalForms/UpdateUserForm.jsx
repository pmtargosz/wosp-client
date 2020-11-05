import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";

import { useFormik } from "formik";

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

const UpdateUserForm = observer(({ title, id, username, city }) => {
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

  const updateUserForm = useFormik({
    initialValues: {
      username: username,
      password: "",
      cityId: rootStore.citiesStore.getCityId(city)
        ? rootStore.citiesStore.getCityId(city)
        : "",
    },

    onSubmit: async (values, { setFieldError }) => {
      try {
        const { username, password, cityId } = values;

        await rootStore.usersStore.updateUser({
          id: id,
          username: username,
          password: password,
          cityId: cityId.length > 0 ? cityId : undefined,
        });
        if (rootStore.usersStore.updateUserError) {
          setFieldError("username", rootStore.usersStore.updateUserError);
          return;
        }
        rootStore.alertStore.setType("success");
        rootStore.alertStore.setMsg("Dane koordynatora zostały uaktualnione!");
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
          onSubmit={updateUserForm.handleSubmit}
        >
          <TextField
            autoFocus
            className={styles.input}
            disabled={updateUserForm.isSubmitting}
            id="username"
            label="Nazwa użytkownika"
            name="username"
            onChange={updateUserForm.handleChange}
            required
            type="text"
            value={updateUserForm.values.username}
            variant="outlined"
            helperText={
              updateUserForm.touched.username && updateUserForm.errors.username
            }
            error={
              updateUserForm.touched.username &&
              updateUserForm.errors.username !== undefined
                ? true
                : false
            }
          />
          <TextField
            autoComplete="current-password"
            className={styles.input}
            disabled={updateUserForm.isSubmitting}
            id="password"
            label="Nowe hasło"
            name="password"
            onChange={updateUserForm.handleChange}
            required
            type={showPassword ? "text" : "password"}
            value={updateUserForm.values.password}
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
          />
          <TextField
            className={styles.input}
            disabled={updateUserForm.isSubmitting}
            id="cityId"
            label="Miasto"
            name="cityId"
            onChange={updateUserForm.handleChange}
            select
            value={updateUserForm.values.cityId}
            variant="outlined"
          >
            <MenuItem value="">
              <em> - </em>
            </MenuItem>
            {citiesList}
          </TextField>
          <DialogActions className={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={updateUserForm.isSubmitting}
            >
              Edytuj
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Anuluj
            </Button>
          </DialogActions>
          {updateUserForm.isSubmitting && (
            <CircularProgress size={24} className={styles.progress} />
          )}
        </form>
      </DialogContent>
    </>
  );
});

export default UpdateUserForm;
