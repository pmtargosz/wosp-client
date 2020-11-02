import { action, configure, makeObservable, observable } from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class DashboardStore {
  menu = false;
  header = "Dashboard";

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      menu: observable,
      setMenu: action,
      header: observable,
      setHeader: action,
    });
  }

  setMenu = (val) => {
    this.menu = val;
  };

  setHeader = (val) => {
    this.header = val;
  };
}
