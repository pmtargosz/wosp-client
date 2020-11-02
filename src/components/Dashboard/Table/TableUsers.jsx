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
import UpdateUserForm from "../Table/ModalForms/UpdateUserForm";

const TableUsersView = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const handleRemoveUser = (id) => async () => {
    await rootStore.usersStore.removeUser(id);
  };

  const tableBodyRows = toJS(rootStore.usersStore.users).map((user) => (
    <TableRow key={user.id} className={styles.row}>
      <EditCell
        modalType={<UpdateUserForm title="Edytuj koordynatora:" {...user} />}
      />
      <BodyCell>{user.username}</BodyCell>
      <BodyCell>{user.city}</BodyCell>
      <DeleteCell
        modalType={
          <ModalRemove
            callback={handleRemoveUser(user.id)}
            msg={`Czy napewno chcesz usunać koordynatora: ${user.username}?`}
          />
        }
      />
    </TableRow>
  ));

  return (
    <TableContainer className={styles.container}>
      <Table stickyHeader aria-label="Users Table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Koordynator</TableCell>
            <TableCell align="left">Miasto</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </TableContainer>
  );
});

const DashboardTableUsers = observer(() => {
  const rootStore = useContext(RootStoresContext);

  useEffect(() => {
    rootStore.usersStore.getUsers();
  }, [rootStore.usersStore]);

  if (rootStore.usersStore.usersLoading) {
    return <CircularProgress className={styles.progress} />;
  }

  if (
    !rootStore.usersStore.usersLoading &&
    rootStore.usersStore.users.length > 0
  ) {
    return <TableUsersView />;
  }

  return <Error />;
});

export default DashboardTableUsers;
