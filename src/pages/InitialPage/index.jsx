import React from "react";
import { Box, CircularProgress, Container } from "@material-ui/core";

import styles from "./styles.module.scss";

const InitialPage = () => {
  return (
    <Container maxWidth="xs">
      <Box display="flex" height="100vh" flex="1" justifyContent="center">
        <CircularProgress className={styles.progress} />
      </Box>
    </Container>
  );
};

export default InitialPage;
