import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Box, Container } from "@material-ui/core";

import { RootStoresContext } from "../../stores/RootStore";

import styles from "./styles.module.scss";

import DashboardHeader from "../../components/Dashboard/Header";
import DashboardMenu from "../../components/Dashboard/Menu";
import DashboardAdmin from "../../components/Dashboard/DashboardAdmin";
import Copyright from "../../components/Copyright";
import Modal from "../../components/Modal";
import PageAlert from "../../components/PageAlert";
import DashboardUser from "../../components/Dashboard/DashboardUser";

const Admin = observer(() => {
  const rootStore = useContext(RootStoresContext);

  switch (rootStore.dashboardStore.header) {
    case "Dashboard":
      return <DashboardAdmin />;
    default:
      return "";
  }
});

const Dashboard = () => {
  const rootStore = useContext(RootStoresContext);
  return (
    <>
      <DashboardHeader />
      {rootStore.authStore.user.isAdmin ? <DashboardMenu /> : null}
      <main role="main" className={styles.content}>
        <Container maxWidth="lg" className={styles.container}>
          {rootStore.authStore.user.isAdmin ? <Admin /> : <DashboardUser />}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
      <PageAlert />
      <Modal />
    </>
  );
};

export default Dashboard;
