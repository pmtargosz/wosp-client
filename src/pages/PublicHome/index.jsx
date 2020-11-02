import React, { useCallback, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";

import InitialPage from "../InitialPage";
import { Box, Container, Grid, Typography } from "@material-ui/core";

const HomeView = () => {
  const rootStore = useContext(RootStoresContext);
  return (
    <Container
      role="main"
      component="main"
      maxWidth={false}
      className={styles.container}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} className={styles.titleHeader}>
          <svg viewBox="0 0 260 20" className={styles.svgTitle}>
            <text x="0" y="15">
              {rootStore.homeStore.page.name}
            </text>
          </svg>
        </Grid>
        <Grid item xs={12} className={styles.content}>
          <Grid item xs={12}>
            Poznan
          </Grid>
          <Grid item xs={12}>
            Poznan
          </Grid>
          <Grid item xs={12}>
            Poznan
          </Grid>
          <Grid item xs={12}>
            Poznan
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const PublicHome = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const getPage = useCallback(() => {
    rootStore.homeStore.getPage();
  }, [rootStore.homeStore]);

  useEffect(() => {
    getPage();
  }, [getPage]);

  return (
    <>
      {!rootStore.homeStore.pageLoading &&
        Object.keys(rootStore.homeStore.page).length > 0 && <HomeView />}
      {rootStore.homeStore.pageLoading && !rootStore.homeStore.pageError && (
        <InitialPage />
      )}
    </>
  );
});

export default PublicHome;
