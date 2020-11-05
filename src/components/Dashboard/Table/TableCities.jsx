import React, { useContext, useEffect } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { RootStoresContext } from "../../../stores/RootStore";

import styles from "./styles.module.scss";
import Error from "../Table/Error";
import { BodyCell, DeleteCell, EditCell } from "../Table/Cell";
import { ModalRemove } from "../../Modal";
import UpdateCityForm from "../Table/ModalForms/UpdateCityForm";

const TableCitiesView = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const handleRemoveUser = (id, city) => async () => {
    await rootStore.citiesStore.removeCity(id);
    rootStore.usersStore.removeCity(city);
  };

  const tableBodyRows = toJS(rootStore.citiesStore.cities).map((city) => (
    <TableRow key={city.id} className={styles.row}>
      <EditCell
        modalType={<UpdateCityForm title="Edytuj miasto:" {...city} />}
      />
      <BodyCell>{city.name}</BodyCell>
      <BodyCell align="center">{city.people}</BodyCell>
      <DeleteCell
        modalType={
          <ModalRemove
            callback={handleRemoveUser(city.id, city.name)}
            msg={`Czy napewno chcesz usunać miasto: ${city.name}?`}
          />
        }
      />
    </TableRow>
  ));

  return (
    <TableContainer className={styles.container}>
      <Table stickyHeader aria-label="Cities Table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Miasto</TableCell>
            <TableCell align="center">Uczestników</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </TableContainer>
  );
});

const TableCities = observer(() => {
  const rootStore = useContext(RootStoresContext);

  useEffect(() => {
    rootStore.citiesStore.getCities();
  }, [rootStore.citiesStore]);

  if (rootStore.citiesStore.citiesLoading) {
    return <CircularProgress className={styles.progress} />;
  }

  if (
    !rootStore.citiesStore.citiesLoading &&
    rootStore.citiesStore.cities.length > 0
  ) {
    return <TableCitiesView />;
  }

  return <Error />;
});

export default TableCities;
