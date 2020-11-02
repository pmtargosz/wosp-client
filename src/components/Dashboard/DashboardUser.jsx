import React, { useContext, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";

import {
  Box,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";
import { Add, Remove } from "@material-ui/icons";

const DashboardUser = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const getUser = useCallback(() => {
    !rootStore.usersStore.userError &&
      Object.keys(rootStore.usersStore.user).length === 0 &&
      rootStore.usersStore.getUser(rootStore.authStore.user.userId);
  }, [rootStore.usersStore, rootStore.authStore]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleClick = (action) => () => {
    rootStore.usersStore.updateUserCity({
      id: rootStore.usersStore.user.city.id,
      people:
        action === "remove"
          ? rootStore.usersStore.user.city.people > 0
            ? rootStore.usersStore.user.city.people - 1
            : 0
          : rootStore.usersStore.user.city.people + 1,
    });
  };

  return (
    <>
      {!rootStore.usersStore.userLoading &&
        Object.keys(rootStore.usersStore.user).length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className={styles.header}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  className={styles.title}
                >
                  Witaj {rootStore.usersStore.user.username}!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Paper className={styles.paperUser}>
                <Tooltip title="Odejmij">
                  <Fab
                    disabled={rootStore.usersStore.updateUserCityLoading}
                    size="large"
                    color="secondary"
                    aria-label="Odejmij"
                    onClick={handleClick("remove")}
                  >
                    <Remove />
                  </Fab>
                </Tooltip>
                <Box className={styles.main}>
                  <Typography
                    component="h2"
                    variant="h4"
                    color="primary"
                    className={styles.title}
                  >
                    {rootStore.usersStore.user.city.name}
                  </Typography>
                  <Typography
                    component="p"
                    color="primary"
                    className={styles.title}
                  >
                    Uczestinków
                  </Typography>
                  <Typography
                    component="p"
                    variant="h4"
                    className={styles.title}
                  >
                    {rootStore.usersStore.user.city.people}
                  </Typography>
                </Box>
                <Tooltip title="Dodaj">
                  <Fab
                    disabled={rootStore.usersStore.updateUserCityLoading}
                    size="large"
                    color="primary"
                    aria-label="Dadaj"
                    onClick={handleClick("add")}
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              </Paper>
            </Grid>
          </Grid>
        )}
      {rootStore.usersStore.userLoading && !rootStore.usersStore.userError && (
        <div className={styles.progressContainer}>
          <CircularProgress className={styles.progress} />
        </div>
      )}
    </>
  );
});

export default DashboardUser;
