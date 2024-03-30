import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";

class Session {
  uuid: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUuid() {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      this.uuid = storedUuid;
    } else {
      this.uuid = v4();
      localStorage.setItem("uuid", this.uuid);
    }
  }
}

// TODO: real authentication
export const sessionStore = new Session();
