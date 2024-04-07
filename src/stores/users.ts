import { User } from "@/utils/schema/UserSchema";
import { trpcClient } from "@/utils/trpc";
import { makeAutoObservable } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";

export class UsersStore {
  users: Record<string, IPromiseBasedObservable<User>> = {};
  constructor() {
    makeAutoObservable(this);
  }

  get(userId: string) {
    const observablePromise = this.users[userId];

    if (!observablePromise) {
      return undefined;
    }
    return observablePromise.state === "fulfilled"
      ? observablePromise.value
      : undefined;
  }

  async resolveUser(userId: string) {
    const existingUser = this.users[userId];

    if (existingUser) {
      return existingUser;
    }

    this.users[userId] = fromPromise(trpcClient.getUser.query({ userId }));
  }
}

export const usersStore = new UsersStore();
