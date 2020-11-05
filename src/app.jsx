import React, { useContext, useCallback, useEffect, memo } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./index.scss";

import { RootStoresContext } from "./stores/RootStore";

import Dashboard from "./pages/Dashboard";
import InitialPage from "./pages/InitialPage";
import Login from "./pages/Login";
import PublicHome from "./pages/PublicHome";

const App = observer(() => {
  const rootStore = useContext(RootStoresContext);
  const location = useLocation();

  const authUser = useCallback(() => {
    location.pathname !== "/" &&
      location.pathname !== "/admin" &&
      !rootStore.authStore.authUserError &&
      !rootStore.authStore.user &&
      rootStore.authStore.authUser();
  }, [rootStore.authStore, location.pathname]);

  useEffect(() => {
    authUser();
  }, [authUser]);

  return (
    <>
      <Switch>
        <Route path="/login">
          {rootStore.authStore.authUserLoading ? (
            <InitialPage />
          ) : rootStore.authStore.user ? (
            rootStore.authStore.user.isAdmin ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/koordynator" />
            )
          ) : (
            <Login />
          )}
        </Route>
        <Route path="/dashboard">
          {rootStore.authStore.authUserLoading ? (
            <InitialPage />
          ) : !rootStore.authStore.authUserLoading &&
            rootStore.authStore.user ? (
            <Dashboard />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/koordynator">
          {rootStore.authStore.authUserLoading ? (
            <InitialPage />
          ) : !rootStore.authStore.authUserLoading &&
            rootStore.authStore.user ? (
            <Dashboard />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/admin">
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/">
          <PublicHome />
        </Route>
      </Switch>
    </>
  );
});

export default memo(App);
