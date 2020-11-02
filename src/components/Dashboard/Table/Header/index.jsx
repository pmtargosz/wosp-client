import React, { memo, useContext } from "react";

import { Box, Fab, Tooltip, Typography } from "@material-ui/core";

import { RootStoresContext } from "../../../../stores/RootStore";

import styles from "./styles.module.scss";

const Header = ({ children, title = "Add", icon: Icon, modalType }) => {
  const rootStore = useContext(RootStoresContext);
  const handleClick = () => {
    rootStore.modalStore.setModalView(modalType);
    rootStore.modalStore.setModal(true);
  };
  return (
    <Box className={styles.header}>
      <Typography
        component="h2"
        variant="h6"
        color="primary"
        className={styles.title}
      >
        {children}
      </Typography>
      <Tooltip title={title}>
        <Fab
          size="small"
          color="primary"
          aria-label={title}
          onClick={handleClick}
        >
          <Icon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default memo(Header);
