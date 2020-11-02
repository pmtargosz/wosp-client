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
    const { id, name, target, startDate, isActive, activeTimer } = values;
    rootStore.editionsStore.toggleActive(id);
    await rootStore.editionsStore.updateEdition({
      id,
      name,
      target,
      startDate,
      isActive: !isActive,
      activeTimer: isActive ? false : activeTimer,
    });
  };

  const handleChangeTimer = (values) => async () => {
    const { id, name, target, startDate, isActive, activeTimer } = values;
    rootStore.editionsStore.toggleTimer(id);
    await rootStore.editionsStore.updateEdition({
      id,
      name,
      target,
      startDate,
      isActive,
      activeTimer: !activeTimer,
    });
  };

  const tableBodyRows = toJS(rootStore.editionsStore.editions).map(
    (edition) => (
      <TableRow key={edition.id} className={styles.row}>
        <EditCell
          modalType={
            <UpdateEditionForm title="Edutuj wydażenie:" {...edition} />
          }
        />
        <BodyCell>{edition.name}</BodyCell>
        <BodyCell>{edition.target}</BodyCell>
        <BodyCell>
          {dateFns.format(dateFns.date(edition.startDate), "dd/MM/yyyy HH:mm")}
        </BodyCell>
        <BodyCell>
          <Tooltip title={edition.isActive ? "Dezaktywuj" : "Aktywuj"}>
            <Switch
              checked={edition.isActive}
              name={edition.id}
              onChange={handleChangeActive(edition)}
              color="primary"
            />
          </Tooltip>
        </BodyCell>
        <BodyCell>
          <Tooltip title={edition.activeTimer ? "Dezaktywuj" : "Aktywuj"}>
            <Switch
              checked={edition.activeTimer}
              name={edition.id}
              onChange={handleChangeTimer(edition)}
              color="primary"
              disabled={!edition.isActive}
            />
          </Tooltip>
        </BodyCell>
        <DeleteCell
          modalType={
            <ModalRemove
              callback={handleRemove(edition.id)}
              msg={`Czy napewno chcesz usunać wydażenie: ${edition.name}?`}
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
            <TableCell align="left">Cel</TableCell>
            <TableCell align="left">Czas Rozpoczecia</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Aktywuj czas</TableCell>
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
