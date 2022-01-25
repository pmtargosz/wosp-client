import { createContext } from "react";

import { DashboardStore } from "./DashboardStore";
import { AuthStore } from "./AuthStore";
import { UsersStore } from "./UsersStore";
import { CitiesStore } from "./CitiesStore";
import { AlertStore } from "./AlertStore";
import { ModalStore } from "./ModalStore";
import { EditionsStore } from "./EditionsStore";
import { HomeStore } from "./HomeStore";
import { SocialMediaStore } from "./SocialMediaStore";

export class RootStore {
  authStore = new AuthStore(this);
  dashboardStore = new DashboardStore(this);
  usersStore = new UsersStore(this);
  citiesStore = new CitiesStore(this);
  editionsStore = new EditionsStore(this);
  modalStore = new ModalStore(this);
  alertStore = new AlertStore(this);
  homeStore = new HomeStore(this);
  socialMediaStore = new SocialMediaStore(this);
}

export const RootStoresContext = createContext(new RootStore());
