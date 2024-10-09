import { observable, makeObservable, action } from "mobx";

class ErrorStore {
  @observable errors: Error[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  addError(error: Error) {
    this.errors.push(error);
  }

  @action
  clearErrors() {
    this.errors = [];
  }
}

export const errorStore = new ErrorStore();
