import React, { useContext, useEffect } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

import {
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";

import DateFnsAdapter from "@date-io/date-fns";

import { RootStoresContext } from "../../../stores/RootStore";

import styles from "./styles.module.scss";

import Error from "./Error";
import { BodyCell, DeleteCell, EditCell } from "./Cell";
import { ModalRemove } from "../../Modal";
import UpdateEditionForm from "./ModalForms/UpdateEditionForm";

const TableEditionsView = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const dateFns = new DateFnsAdapter();

  const handleRemove = (id) => async () => {
    await rootStore.editionsStore.removeEdition(id);
  };

  const handleChangeActive = (values) => async () => {
    const { id, name, target, startDate, endDate, isActive } = values;
    rootStore.editionsStore.toggleActive(id);
    await rootStore.editionsStore.updateEdition({
      id,
      name,
      target,
      startDate,
      endDate,
      isActive: !isActive,
    });
  };

  const tableBodyRows = toJS(rootStore.editionsStore.editions).map(
    (edition) => (
      <TableRow key={edition.id} className={styles.row}>
        <EditCell
          modalType={
            <UpdateEditionForm title="Edytuj wydarzenie:" {...edition} />
          }
        />
        <BodyCell>{edition.name}</BodyCell>
        <BodyCell align="center">{edition.target}</BodyCell>
        <BodyCell align="center">
          {dateFns.format(dateFns.date(edition.startDate), "dd/MM/yyyy HH:mm")}
        </BodyCell>
        <BodyCell align="center">
          {edition.endDate !== undefined
            ? dateFns.format(dateFns.date(edition.endDate), "HH:mm")
            : ""}
        </BodyCell>
        <BodyCell align="center">
          <Tooltip title={edition.isActive ? "Dezaktywuj" : "Aktywuj"}>
            <Switch
              checked={edition.isActive}
              name={edition.id}
              onChange={handleChangeActive(edition)}
              color="primary"
            />
          </Tooltip>
        </BodyCell>
        <DeleteCell
          modalType={
            <ModalRemove
              callback={handleRemove(edition.id)}
              msg={`Czy napewno chcesz usunać wydarzenie: ${edition.name}?`}
            />
          }
        />
      </TableRow>
    )
  );

  return (
    <TableContainer className={styles.container}>
      <Table stickyHeader aria-label="Cities Table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Nazwa</TableCell>
            <TableCell align="center">Cel</TableCell>
            <TableCell align="center">Data Rozpoczecia</TableCell>
            <TableCell align="center">Godzina Zakończenia</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </TableContainer>
  );
});

const TableEditions = observer(() => {
  const rootStore = useContext(RootStoresContext);

  useEffect(() => {
    rootStore.editionsStore.getEditions();
  }, [rootStore.editionsStore]);

  if (rootStore.editionsStore.editionsLoading) {
    return <CircularProgress className={styles.progress} />;
  }

  if (
    !rootStore.editionsStore.editionsLoading &&
    rootStore.editionsStore.editions.length > 0
  ) {
    return <TableEditionsView />;
  }

  return <Error />;
});

export default TableEditions;
