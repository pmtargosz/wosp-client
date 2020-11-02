import { action, configure, makeObservable, observable } from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class ModalStore {
  modal = false;
  modalView = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      modal: observable,
      setModal: action,
      modalView: observable,
      setModalView: action,
    });
  }

  setModal = (val) => {
    this.modal = val;
  };

  setModalView = (view) => {
    this.modalView = view;
  };
}
