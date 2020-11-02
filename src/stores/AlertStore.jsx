import { action, configure, makeObservable, observable } from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class AlertStore {
  type = "";
  msg = "";
  open = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      type: observable,
      msg: observable,
      open: observable,
      setType: action,
      setMsg: action,
      setOpen: action,
    });
  }

  setType = (val) => {
    this.type = val;
  };

  setMsg = (val) => {
    this.msg = val;
  };

  setOpen = (val) => {
    this.open = val;
  };
}
