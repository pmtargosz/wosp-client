import React from "react";

import { Grid, Paper } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";

import TableHeader from "./Table/Header";
import TableUsers from "./Table/TableUsers";
import TableCities from "./Table/TableCities";
import TableEditions from "./Table/TableEditions";

import AddCityForm from "./Table/ModalForms/AddCityForm";
import AddUserForm from "./Table/ModalForms/AddUserForm";
import AddEditionForm from "./Table/ModalForms/AddEditionForm";

const DashboardAdmin = () => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={styles.paper}>
            <TableHeader
              title="Add"
              icon={AddIcon}
              modalType={<AddUserForm title="Dodaj koordynatora:" />}
            >
              Koordynatorzy
            </TableHeader>
            <TableUsers />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={styles.paper}>
            <TableHeader
              title="Add"
              icon={AddIcon}
              modalType={<AddCityForm title="Dodaj miasto:" />}
            >
              Miasta
            </TableHeader>
            <TableCities />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.paper}>
            <TableHeader
              title="Add"
              icon={AddIcon}
              modalType={<AddEditionForm title="Dodaj wydarzenie:" />}
            >
              Wydarzenia
            </TableHeader>
            <TableEditions />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardAdmin;
