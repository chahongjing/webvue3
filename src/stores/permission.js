import { reactive } from "vue";
import { defineStore } from "pinia";

export const permissionStore = defineStore(
  "permission",
  () => {
    const permission = reactive({list: []});

    function setPermission(list) {
        permission.list = list;
    }

    return { permission, setPermission };
  },
  { persist: { enabled: true, strategies: [{ storage: sessionStorage }] } }
);
