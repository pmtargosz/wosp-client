import {
    action,
    configure,
    makeObservable,
    observable,
    runInAction,
  } from "mobx";
  
  configure({ enforceActions: "observed" });
  // useProxies: "never" for ie11
  export class SocialMediaStore {
    socialMedia = [];
    socialMediaError = null;
    socialMediaLoading = true;
    removeSocialMediaError = null;
    addSocialMediaError = null;
  
    constructor(rootStore) {
      this.rootStore = rootStore;
      makeObservable(this, {
        socialMedia: observable,
        socialMediaError: observable,
        socialMediaLoading: observable,
        getSocialMedia: action,
        removeSocialMedia: action,
        removeSocialMediaError: observable,
        addSocialMediaError: observable,
        addSocialMedia: action,
      });
    }
  
    async getSocialMedia() {
      runInAction(() => {
        this.socialMediaError = null;
        this.socialMediaLoading = true;
        this.socialMedia = [];
      });
      try {
        const request = await fetch(`${process.env.REACT_APP_API}/social`, {
          credentials: "include",
        });
        const response = await request.json();
  
        if (request.ok) {
          runInAction(() => {
            this.socialMediaLoading = false;
            this.socialMedia = response;
          });
        } else {
          throw new Error(response.msg);
        }
      } catch (error) {
        runInAction(() => {
          this.socialMediaError = error.message;
          this.socialMediaLoading = false;
          this.socialMedia = [];
        });
      }
    }
  
  
    async removeSocialMedia(id) {
      runInAction(() => {
        this.removeSocialMediaError = null;
      });
      try {
        const request = await fetch(`${process.env.REACT_APP_API}/social/delete`, {
          body: JSON.stringify({ id }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
  
        const response = await request.json();
  
        if (request.ok) {
          runInAction(() => {
            this.socialMedia = this.socialMedia.filter((city) => city.id !== id);
          });
        } else {
          throw new Error(response.msg);
        }
      } catch (error) {
        runInAction(() => {
          this.removeSocialMediaError = error.message;
        });
      }
    }
  
    async addSocialMedia(val) {
      try {
        runInAction(() => {
          this.addSocialMediaError = null;
        });
  
        const request = await fetch(`${process.env.REACT_APP_API}/social/create`, {
          body: JSON.stringify(val),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
  
        const response = await request.json();
  
        if (request.ok) {
          runInAction(() => {
              const isUpdateMode = this.socialMedia.filter(social => social.id === response.id);

              if (isUpdateMode.length > 0) {
                this.socialMedia = this.socialMedia.map((social) =>
                social.id === response.id ? { ...response } : social
                );
              } else {
                this.socialMedia.push(response);
              }

          });
        } else {
          throw new Error(response.msg);
        }
      } catch (error) {
        runInAction(() => {
          this.addSocialMediaError = error.message;
        });
      }
    }
  }
  