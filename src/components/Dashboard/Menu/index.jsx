import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { ChevronLeft, Dashboard, People } from "@material-ui/icons";

import { RootStoresContext } from "../../../stores/RootStore";

import styles from "./styles.module.scss";

const DashboardMenuList = () => {
  const rootStore = useContext(RootStoresContext);

  const itemData = [
    { name: "Dashboard", icon: <Dashboard /> },
    { name: "Koordynatorzy", icon: <People /> },
  ];

  const handlerItemClick = (name) => () => {
    rootStore.dashboardStore.setHeader(name);
  };

  const createList = itemData.map((item, i) => (
    <ListItem
      button
      key={`${item.name}-${i}`}
      onClick={handlerItemClick(item.name)}
    >
      <ListItemIcon title={item.name}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.name} />
    </ListItem>
  ));

  return <List>{createList}</List>;
};

const DashboardMenu = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const handleDrawerClose = () => {
    rootStore.dashboardStore.setMenu(false);
  };
  return (
    <nav role="navigation" className={styles.dashboardMenu}>
      <Drawer
        variant="permanent"
        classes={{
          paper: `${styles.drawerPaper} ${
            !rootStore.dashboardStore.menu ? styles.drawerPaperClose : ""
          }`,
        }}
        open={rootStore.dashboardStore.menu}
      >
        <div className={styles.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <DashboardMenuList />
      </Drawer>
    </nav>
  );
});

export default React.memo(DashboardMenu);
