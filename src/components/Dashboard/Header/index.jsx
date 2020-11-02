import React, { useState, useContext, memo } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  AppBar,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
  Menu,
} from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";

import { RootStoresContext } from "../../../stores/RootStore";

import styles from "./styles.module.scss";

import { ReactComponent as WospLogo } from "../../../files/wosp_logo.svg";

const DashboardHeader = observer(() => {
  const rootStore = useContext(RootStoresContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleDrawerOpenMenu = () => {
    rootStore.dashboardStore.setMenu(true);
  };

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleUserLogOut = () => {
    handleCloseUserMenu();
    rootStore.authStore.logOut();
    rootStore.usersStore.clearUser();
  };

  return (
    <div className={styles.dashboardHeader}>
      <AppBar
        position="absolute"
        className={`${styles.appBar} ${
          rootStore.dashboardStore.menu ? styles.appBarShift : ""
        }`}
      >
        <Toolbar className={styles.toolbar}>
          {rootStore.authStore.user.isAdmin ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenMenu}
              className={`${styles.menuButton} ${
                rootStore.dashboardStore.menu ? styles.menuButtonHidden : ""
              }`}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={styles.title}
          >
            {rootStore.dashboardStore.header}
          </Typography>

          <Link to="/" className={styles.logoLink} title="Home">
            <WospLogo className={styles.logo} />
          </Link>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openUserMenu}
            onClick={handleCloseUserMenu}
          >
            <MenuItem onClick={handleUserLogOut}>Wyloguj</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
});

export default memo(DashboardHeader);
