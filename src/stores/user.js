import { ref } from "vue";
import { defineStore } from "pinia";

export const userStore = defineStore(
  "user",
  () => {
    const user = ref({ id: null, code: "", name: "" });

    function setUser(userP) {
      user.value = userP;
    }

    return { user, setUser };
  },
  { persist: { enabled: true, strategies: [{ storage: sessionStorage }] } }
);
