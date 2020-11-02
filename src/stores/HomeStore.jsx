import {
  action,
  configure,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class HomeStore {
  page = {};
  pageLoading = true;
  pageError = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      page: observable,
      pageLoading: observable,
      pageError: observable,
      getPage: action,
    });
  }

  async getPage() {
    runInAction(() => {
      this.pageError = null;
      this.pageLoading = true;
      this.page = {};
    });
    try {
      const request = await fetch(process.env.REACT_APP_API, {
        credentials: "include",
      });
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.pageLoading = false;
          this.page = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.pageError = error.message;
        this.pageLoading = false;
        this.page = {};
      });
    }
  }
}
