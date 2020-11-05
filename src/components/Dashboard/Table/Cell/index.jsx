import React, { useContext } from "react";

import {
  DeleteForever as DeleteForeverIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import {
  IconButton,
  TableCell as MuiTableCell,
  Tooltip,
  withStyles,
} from "@material-ui/core";

import { RootStoresContext } from "../../../../stores/RootStore";

const TableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(MuiTableCell);

export const EditCell = ({ modalType }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClick = () => {
    rootStore.modalStore.setModalView(modalType);
    rootStore.modalStore.setModal(true);
  };

  return (
    <TableCell align="center" style={{ width: "50" }}>
      <Tooltip title="Edit">
        <IconButton
          aria-label="Edit"
          component="button"
          size="small"
          onClick={handleClick}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
};

export const DeleteCell = ({ modalType }) => {
  const rootStore = useContext(RootStoresContext);

  const handleClick = () => {
    rootStore.modalStore.setModalView(modalType);
    rootStore.modalStore.setModal(true);
  };

  return (
    <TableCell align="center" style={{ width: "50" }}>
      <Tooltip title="Delete">
        <IconButton
          aria-label="Delete"
          component="button"
          size="small"
          onClick={handleClick}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
};

export const BodyCell = ({ children, align }) => {
  return <TableCell align={align}>{children}</TableCell>;
};
