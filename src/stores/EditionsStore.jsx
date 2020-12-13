import {
  action,
  configure,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class EditionsStore {
  editions = [];
  editionsError = null;
  editionsLoading = true;
  removeEditionError = null;
  addEditionError = null;
  updateEditionError = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      editions: observable,
      editionsError: observable,
      editionsLoading: observable,
      getEditions: action,
      removeEditionError: observable,
      addEditionError: observable,
      updateEditionError: observable,
      updateEdition: action,
      toggleActive: action,
      // toggleTimer: action,
    });
  }

  async getEditions() {
    runInAction(() => {
      this.editionsError = null;
      this.editionsLoading = true;
      this.editions = [];
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/edition`, {
        credentials: "include",
      });
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.editionsLoading = false;
          this.editions = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.editionsError = error.message;
        this.editionsLoading = false;
        this.editions = [];
      });
    }
  }

  async removeEdition(id) {
    runInAction(() => {
      this.removeEditionError = null;
    });
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/edition/delete`,
        {
          body: JSON.stringify({ id }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.editions = this.editions.filter((edition) => edition.id !== id);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.removeEditionError = error.message;
      });
    }
  }

  async addEdition(val) {
    try {
      runInAction(() => {
        this.addEditionError = null;
      });
      const request = await fetch(
        `${process.env.REACT_APP_API}/edition/create`,
        {
          body: JSON.stringify(val),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.editions.push(response);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.addEditionError = error.message;
      });
    }
  }

  async updateEdition(val) {
    try {
      runInAction(() => {
        this.updateEditionError = null;
      });

      const request = await fetch(
        `${process.env.REACT_APP_API}/edition/update`,
        {
          body: JSON.stringify(val),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.editions = this.editions.map((edition) =>
            edition.id === response.id ? { ...response } : edition
          );
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.updateEditionError = error.message;
      });
    }
  }

  toggleActive(id) {
    this.editions = this.editions.map(
      (edition) =>
        edition.id === id
          ? { ...edition, isActive: !edition.isActive }
          : { ...edition, isActive: false } //{ ...edition, isActive: false, activeTimer: false }
    );
  }

  // toggleTimer(id) {
  //   this.editions = this.editions.map((edition) =>
  //     edition.id === id
  //       ? { ...edition, activeTimer: !edition.activeTimer }
  //       : { ...edition, activeTimer: false }
  //   );
  // }
}
