import { defineStore } from "pinia";

export const userStore = defineStore("user", {
  persist: {
    enabled: true,
    strategies: [{ storage: sessionStorage, paths: ["user"] }],
  },
  state: () => ({ user: { id: null, code: "", name: "" } }),
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
});
