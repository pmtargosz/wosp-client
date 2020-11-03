import React, { useCallback, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Container, Grid } from "@material-ui/core";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";

import InitialPage from "../InitialPage";

import { ReactComponent as IndorRowing } from "../../files/indor_rowing.svg";

const ResultItem = ({ name, people, target }) => {
  const meters = people * 500;
  const percent = ((meters / target) * 100).toFixed(2);
  return (
    <Grid
      container
      spacing={4}
      justify="space-between"
      alignItems="center"
      className={`${styles.result} ${percent >= 100 ? styles.resultDone : ""}`}
    >
      <Grid item className={styles.city}>
        {name}
      </Grid>
      <Grid item className={styles.progressbar}>
        <div className={styles.progress}>
          <span className={styles.progressData}>
            {percent < 100 ? `${percent}%` : "rekord pobity"} / {meters} m
          </span>
          <div
            className={styles.bar}
            style={{
              width: `calc(${percent}% - 12px)`,
            }}
          ></div>
        </div>
      </Grid>
      <Grid item className={styles.peoples}>
        <span>{people}</span>
        <IndorRowing className={styles.rowingIcon} />
      </Grid>
    </Grid>
  );
};

const HomeView = () => {
  const rootStore = useContext(RootStoresContext);
  const displayResults = rootStore.homeStore.page.cities.map((city) => (
    <ResultItem
      key={city.name}
      name={city.name}
      people={city.people}
      target={rootStore.homeStore.page.target}
    />
  ));

  return (
    <Container
      role="main"
      component="main"
      maxWidth={false}
      className={styles.container}
    >
      <Grid container spacing={4} justify="center">
        <Grid item xs={10} className={styles.titleHeader}>
          <svg viewBox="0 0 300 26" className={styles.svgTitle}>
            <text x="0" y="22">
              {rootStore.homeStore.page.name}
            </text>
          </svg>
        </Grid>
        <Grid item xs={10} className={styles.results}>
          {displayResults}
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
