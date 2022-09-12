import { reactive } from "vue";
import { defineStore } from "pinia";

export const leftMenuStore = defineStore(
    "leftMenu",
    () => {
        const leftMenu = reactive({ menuList:[],showMenu:true });

        function setLeftMenu(list) {
            leftMenu.menuList = list;
        }

        function setShowMenu(show) {
            leftMenu.showMenu = show;
        }

        return { leftMenu, setLeftMenu, setShowMenu };
    },
    { persist: { enabled: true, strategies: [{ storage: sessionStorage }] } }
);
