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
import UpdateSocialMediaForm from "../Table/ModalForms/UpdateSocialMediaForm";

const TableSocialMediaView = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const handleRemoveUser = (id) => async () => {
    await rootStore.socialMediaStore.removeSocialMedia(id);
  };

  const tableBodyRows = toJS(rootStore.socialMediaStore.socialMedia).map((social) => (
    <TableRow key={social.id} className={styles.row}>
      <EditCell
        modalType={<UpdateSocialMediaForm title="Edytuj Social Media:" {...social} />}
      />
      <BodyCell>{social.name}</BodyCell>
      <BodyCell>{social.url}</BodyCell>
      <BodyCell>{social.type === 'fb'? 'Facebook' : 'YouTube'}</BodyCell>
      <DeleteCell
        modalType={
          <ModalRemove
            callback={handleRemoveUser(social.id)}
            msg={`Czy napewno chcesz usunać: ${social.name}?`}
          />
        }
      />
    </TableRow>
  ));

  return (
    <TableContainer className={styles.container}>
      <Table stickyHeader aria-label="Social Media Table">
        <TableHead>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Nazwa</TableCell>
            <TableCell align="left">Url</TableCell>
            <TableCell align="left">Typ</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </TableContainer>
  );
});

const TableSocialMedia = observer(() => {
  const rootStore = useContext(RootStoresContext);

  useEffect(() => {
    rootStore.socialMediaStore.getSocialMedia();
  }, [rootStore.socialMediaStore]);

  if (rootStore.socialMediaStore.socialMediaLoading) {
    return <CircularProgress className={styles.progress} />;
  }

  if (
    !rootStore.socialMediaStore.socialMediaLoading &&
    rootStore.socialMediaStore.socialMedia.length > 0
  ) {
    return <TableSocialMediaView />;
  }

  return <Error />;
});

export default TableSocialMedia;
