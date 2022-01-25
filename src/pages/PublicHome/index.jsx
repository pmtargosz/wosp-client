import React, { useCallback, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import { Container, Grid } from "@material-ui/core";

import DateFnsAdapter from "@date-io/date-fns";

import { socket } from "../../config";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";

import InitialPage from "../InitialPage";

import { ReactComponent as IndorRowing } from "../../files/indor_rowing.svg";

const SocialMedia = () => {
  const rootStore = useContext(RootStoresContext);

  const displaySocialMedia = rootStore.homeStore.page.socialMedia.map((social, index) => (
    <a key={index} className={`${styles.socialMediaLink} ${social.type === 'yt' ? styles.socialMediaLinkYt : styles.socialMediaLinkFb}`} target="_blank" rel="noopener noreferrer" href={social.url} title={social.name}>{social.name}</a>
  ))

  return (
    <div className={styles.socialMedia}>
      {displaySocialMedia}
    </div>
  )
}

const HomeInitView = () => {
  return (
    <Container
      role="main"
      component="main"
      maxWidth={false}
      className={styles.container}
    >
      <Grid container spacing={4} alignItems="center" justify="center">
        <Grid item xs={10} className={styles.titleHeader}>
          <svg viewBox="0 0 300 26" className={styles.svgTitle}>
            <text x="0" dx="0" dy="1.2em">
              Wiosłowanie dla WOŚP
            </text>
          </svg>
        </Grid>
        <Grid item xs={10} className={styles.titleSub}>
          <svg viewBox="0 0 300 150" className={styles.svgTitle}>
            <text x="0" dy="1.2em">
              <tspan dy="1.2em" x="0" dx="0">
                Już
              </tspan>
              <tspan dy="1.2em" x="0" dx="0">
                niedługo
              </tspan>
              <tspan dy="1.2em" x="0" dx="0">
                startujemy!
              </tspan>
            </text>
          </svg>
        </Grid>
      </Grid>
    </Container>
  );
};

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
              width: `calc(${percent}%)`,
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

export const calculateTimeLeft = (date, currentDate) => {
  const difference = date - currentDate;
  let timeLeft = null;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const Counter = () => {
  const dateFns = new DateFnsAdapter();
  const rootStore = useContext(RootStoresContext);
  const [timeToStart, setTimeToStart] = useState(
    calculateTimeLeft(
      +dateFns.date(rootStore.homeStore.page.startDate),
      +dateFns.date()
    )
  );

  const [timeToEnd, setTimeToEnd] = useState(
    calculateTimeLeft(
      +dateFns.date(rootStore.homeStore.page.endDate),
      +dateFns.date()
    )
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeToStart(
        calculateTimeLeft(
          +dateFns.date(rootStore.homeStore.page.startDate),
          +dateFns.date()
        )
      );
    }, 1000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeToEnd(
        calculateTimeLeft(
          +dateFns.date(rootStore.homeStore.page.endDate),
          +dateFns.date()
        )
      );
    }, 1000);

    return () => clearTimeout(timer);
  });

  const hours = timeToStart
    ? timeToStart.hours + timeToStart.days * 24
    : timeToEnd
    ? timeToEnd.hours + timeToEnd.days * 24
    : 0;

  const minutes = timeToStart
    ? timeToStart.minutes
    : timeToEnd
    ? timeToEnd.minutes
    : 0;

  const seconds = timeToStart
    ? timeToStart.seconds
    : timeToEnd
    ? timeToEnd.seconds
    : 0;

  return (
    <div className={styles.counterContainer}>
      <svg viewBox="0 0 200 18" className={styles.counterSvgText}>
        <text x="98%" dx="0" dy="1.2em">
          {`${
            timeToStart
              ? "do rozpoczęcia pozostało"
              : timeToEnd
              ? "do zakończenia pozostało"
              : "koniec"
          }`}
        </text>
      </svg>
      <div className={styles.counters}>
        <div className={styles.counter}>
          <span className={styles.counterNumber}>
            {hours > 9 ? hours : `0${hours}`}
          </span>
          <span className={styles.counterText}>godz.</span>
        </div>
        <div className={styles.counter}>
          <span className={styles.counterNumber}>
            {minutes > 9 ? minutes : `0${minutes}`}
          </span>
          <span className={styles.counterText}>min.</span>
        </div>
        <div className={styles.counter}>
          <span className={styles.counterNumber}>
            {seconds > 9 ? seconds : `0${seconds}`}
          </span>
          <span className={styles.counterText}>sek.</span>
        </div>
      </div>
    </div>
  );
};

const HomeView = () => {
  const rootStore = useContext(RootStoresContext);

  // Connect to socket
  useEffect(() => {
    socket.open();

    socket.on("update_cities", (data) => {
      rootStore.homeStore.socketUpdateCity(data);
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [rootStore.homeStore]);

  const displayResults = rootStore.homeStore.page.cities.sort((a, b) => b.people - a.people).map((city) => (
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
      <SocialMedia />
      <Grid container spacing={4} justify="center">
        <Grid item xs={10} className={styles.titleHeader}>
          <svg viewBox="0 0 300 26" className={styles.svgTitle}>
            <text x="50%" dx="0" dy="1.2em">
              {rootStore.homeStore.page.name}
            </text>
          </svg>
        </Grid>
        <Grid item xs={10} className={styles.results}>
          {displayResults}
        </Grid>
        <Grid item xs={10} className={styles.time}>
          <Counter />
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
      {rootStore.homeStore.pageError && <HomeInitView />}
    </>
  );
});

export default PublicHome;
