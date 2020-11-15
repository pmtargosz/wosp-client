import {
  action,
  configure,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

configure({ enforceActions: "observed" });
// useProxies: "never" for ie11
export class CitiesStore {
  cities = [];
  citiesError = null;
  citiesLoading = true;
  removeCityError = null;
  addCityError = null;
  updateCityError = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      cities: observable,
      citiesError: observable,
      citiesLoading: observable,
      getCities: action,
      getCityId: action,
      removeCity: action,
      removeCityError: observable,
      addCityError: observable,
      addCity: action,
      updateCityError: observable,
      updateCity: action,
      socketUpdateCity: action,
    });
  }

  async getCities() {
    runInAction(() => {
      this.citiesError = null;
      this.citiesLoading = true;
      this.cities = [];
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/city`, {
        credentials: "include",
      });
      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.citiesLoading = false;
          this.cities = response;
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.citiesError = error.message;
        this.citiesLoading = false;
        this.cities = [];
      });
    }
  }

  getCityId(name) {
    const city = this.cities.find((city) => city.name === name);
    return city ? city.id : undefined;
  }

  async removeCity(id) {
    runInAction(() => {
      this.removeCityError = null;
    });
    try {
      const request = await fetch(`${process.env.REACT_APP_API}/city/delete`, {
        body: JSON.stringify({ id }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.cities = this.cities.filter((city) => city.id !== id);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.removeCityError = error.message;
      });
    }
  }

  async addCity(val) {
    try {
      runInAction(() => {
        this.addCityError = null;
      });

      const request = await fetch(`${process.env.REACT_APP_API}/city/create`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.cities.push(response);
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.addCityError = error.message;
      });
    }
  }

  async updateCity(val) {
    try {
      runInAction(() => {
        this.updateCityError = null;
      });

      const request = await fetch(`${process.env.REACT_APP_API}/city/update`, {
        body: JSON.stringify(val),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const response = await request.json();

      if (request.ok) {
        runInAction(() => {
          this.cities = this.cities.map((city) =>
            city.id === response.id ? { ...response } : city
          );
        });
      } else {
        throw new Error(response.msg);
      }
    } catch (error) {
      runInAction(() => {
        this.updateCityError = error.message;
      });
    }
  }

  socketUpdateCity(val) {
    this.cities = this.cities.map((city) =>
      city.id === val.id ? { ...val } : city
    );
  }
}
