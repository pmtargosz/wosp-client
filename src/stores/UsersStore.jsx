import {
  action,
  configure,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class UsersStore {
  users = [];
  usersError = null;
  usersLoading = true;
  removeUserError = null;
  addUserError = null;
  updateUserError = null;
  userError = null;
  userLoading = true;
  user = {};
  updateUserCityError = null;
  updateUserCityLoading = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      users: observable,
      usersError: observable,
      usersLoading: observable,
      getUsers: action,
      removeUser: action,
      removeUserError: observable,
      addUserError: observable,
      updateUserError: observable,
      updateUser: action,
      userError: observable,
      userLoading: observable,
      user: observable,
      getUser: action,
      updateUserCityError: observable,
      updateUserCityLoading: observable,
      updateUserCity: action,
      clearUser: observable,
    });
  }
  removeCity(city) {
    this.users = this.users.map((user) =>
      user.city === city ? { ...user, city: undefined } : user
    );
  }

  async getUsers() {
    runInAction(() => {
      this.usersError = null;
      this.usersLoading = true;
      this.users = [];
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/user`, {
        credentials: "include",
      });
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.usersLoading = false;
          this.users = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.usersError = error.message;
        this.usersLoading = false;
        this.users = [];
      });
    }
  }

  async getUser(id) {
    runInAction(() => {
      this.userError = null;
      this.userLoading = true;
      this.user = {};
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/user/${id}`, {
        credentials: "include",
      });
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.userLoading = false;
          this.user = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.userError = error.message;
        this.userLoading = false;
        this.user = {};
      });
    }
  }

  clearUser() {
    this.user = {};
  }

  async updateUserCity(val) {
    try {
      runInAction(() => {
        this.updateUserCityError = null;
        this.updateUserCityLoading = true;
      });

      const request = await fetch(`${process.env.REACT_APP_API}/user/city`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.updateUserCityLoading = false;
          this.user = {
            ...this.user,
            city: response,
          };
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.updateUserCityLoading = false;
        this.updateUserCityError = error.message;
      });
    }
  }

  async removeUser(id) {
    runInAction(() => {
      this.removeUserError = null;
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/user/delete`, {
        body: JSON.stringify({ id }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.users = this.users.filter((user) => user.id !== id);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.removeUserError = error.message;
      });
    }
  }

  async addUser(val) {
    try {
      runInAction(() => {
        this.addUserError = null;
      });

      const request = await fetch(`${process.env.REACT_APP_API}/user/create`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();
      if (request.ok) {
        runInAction(() => {
          this.users.push(response);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.addUserError = error.message;
      });
    }
  }

  async updateUser(val) {
    try {
      runInAction(() => {
        this.updateUserError = null;
      });

      const request = await fetch(`${process.env.REACT_APP_API}/user/update`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.users = this.users.map((user) =>
            user.id === response.id ? { ...response } : user
          );
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.updateUserError = error.message;
      });
    }
  }
}
