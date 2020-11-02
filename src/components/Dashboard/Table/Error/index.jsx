import { Typography } from "@material-ui/core";
import React from "react";

const Error = ({ msg = "Brak" }) => (
  <Typography component="p" variant="h6" gutterBottom>
    {msg}
  </Typography>
);

export default Error;
