import {
  action,
  configure,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class AuthStore {
  user = null;
  authUserError = null;
  authUserLoading = true;
  logInError = null;
  logOutError = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      user: observable,
      authUser: action,
      authUserError: observable,
      authUserLoading: observable,
      logIn: action,
      logInError: observable,
      logOut: action,
      logOutError: observable,
    });
  }

  async authUser() {
    runInAction(() => {
      this.authUserError = null;
      this.authUserLoading = true;
      this.user = null;
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/auth`, {
        credentials: "include",
      });
      const response = await request.json();
      if (request.ok) {
        runInAction(() => {
          this.authUserLoading = false;
          this.user = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.authUserError = error.message;
        this.authUserLoading = false;
        this.user = null;
      });
    }
  }

  async logIn(val) {
    runInAction(() => {
      this.logInError = null;
      this.user = null;
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/login`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();
      if (request.ok) {
        runInAction(() => {
          this.user = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.logInError = error.message;
        this.user = null;
      });
    }
  }

  async logOut() {
    runInAction(() => {
      this.logOutError = null;
    });

    try {
      await fetch(`${process.env.REACT_APP_API}/logout`, {
        credentials: "include",
      });

      runInAction(() => {
        this.user = null;
      });
    } catch (error) {
      runInAction(() => {
        this.logOutError = error.message;
      });
    }
  }
}
