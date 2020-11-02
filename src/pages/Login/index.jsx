import React, { memo, useContext } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from "@material-ui/core";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";

import { ReactComponent as WospLogo } from "../../files/wosp_logo.svg";
import Copyright from "../../components/Copyright";
import PageAlert from "../../components/PageAlert";

const Login = () => {
  const rootStore = useContext(RootStoresContext);

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Nazwa użytkownika jest wymagana"),
      password: Yup.string().required("Hasło jest wymagane"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        await rootStore.authStore.logIn(values);

        if (rootStore.authStore.logInError) {
          setFieldError("username", "");
          setFieldError("password", "");

          rootStore.alertStore.setType("error");
          rootStore.alertStore.setMsg(
            " Wprowadzona nazwa użytkownika i hasło nie zgadzają się z naszymi danymi. Sprawdź dokładnie i spróbuj ponownie."
          );
          rootStore.alertStore.setOpen(true);
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <PageAlert />
      <div className={styles.login}>
        <WospLogo className={styles.logo} />
        <form
          className={styles.form}
          noValidate
          spellCheck="fasle"
          onSubmit={loginForm.handleSubmit}
        >
          <TextField
            autoFocus
            fullWidth
            id="username"
            label="Nazwa użytkownika"
            margin="normal"
            name="username"
            required
            type="text"
            variant="outlined"
            onChange={loginForm.handleChange}
            value={loginForm.values.username}
            helperText={loginForm.touched.username && loginForm.errors.username}
            error={
              loginForm.touched.username &&
              loginForm.errors.username !== undefined
                ? true
                : false
            }
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="password"
            label="Hasło"
            margin="normal"
            name="password"
            required
            type="password"
            variant="outlined"
            onChange={loginForm.handleChange}
            value={loginForm.values.password}
            helperText={loginForm.touched.password && loginForm.errors.password}
            error={
              loginForm.touched.password &&
              loginForm.errors.password !== undefined
                ? true
                : false
            }
          />
          <Box mt={2} className={styles.submit}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loginForm.isSubmitting}
            >
              Zaloguj się
            </Button>
            {loginForm.isSubmitting && (
              <CircularProgress size={24} className={styles.progress} />
            )}
          </Box>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default memo(Login);
