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

import { socket } from "../../config";

import DateFnsAdapter from "@date-io/date-fns";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";
import { Add, Remove } from "@material-ui/icons";
import { useState } from "react";

const DashboardUser = observer(() => {
  const rootStore = useContext(RootStoresContext);

  const getPage = useCallback(() => {
    rootStore.homeStore.getPage();
  }, [rootStore.homeStore]);

  useEffect(() => {
    getPage();
  }, [getPage]);

  const [isDisable, setDisable] = useState(true);
  const dateFns = new DateFnsAdapter();
  useEffect(() => {
    const time = setInterval(() => {
      setDisable(
        +dateFns.date(rootStore.homeStore.page.endDate) - +dateFns.date() < 0 ||
          +dateFns.date(rootStore.homeStore.page.startDate) - +dateFns.date() >
            0
      );
    }, 1000);

    return () => clearInterval(time);
  });

  const getUser = useCallback(() => {
    !rootStore.usersStore.userError &&
      Object.keys(rootStore.usersStore.user).length === 0 &&
      rootStore.usersStore.getUser(rootStore.authStore.user.userId);
  }, [rootStore.usersStore, rootStore.authStore]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // Connect to socket
  useEffect(() => {
    socket.open();

    socket.on("update_cities", (data) => {
      if (rootStore.usersStore.user.city.id === data.id) {
        rootStore.usersStore.updateUserCity(data);
      }
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [rootStore.usersStore]);

  const handleClick = (action) => () => {
    const people =
      action === "remove"
        ? rootStore.usersStore.user.city.people > 0
          ? rootStore.usersStore.user.city.people - 1
          : 0
        : rootStore.usersStore.user.city.people + 1;

    socket.emit("update_cities", {
      id: rootStore.usersStore.user.city.id,
      name: rootStore.usersStore.user.city.name,
      people,
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
                  <span>
                    <Fab
                      disabled={rootStore.usersStore.userLoading || isDisable}
                      size="large"
                      color="secondary"
                      aria-label="Odejmij"
                      onClick={handleClick("remove")}
                    >
                      <Remove />
                    </Fab>
                  </span>
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
                    Uczestników
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
                  <span>
                    <Fab
                      disabled={rootStore.usersStore.userLoading || isDisable}
                      size="large"
                      color="primary"
                      aria-label="Dadaj"
                      onClick={handleClick("add")}
                    >
                      <Add />
                    </Fab>
                  </span>
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
