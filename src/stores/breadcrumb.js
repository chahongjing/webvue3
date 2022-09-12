import { reactive } from "vue";
import { defineStore } from "pinia";

export const breadcrumbStore = defineStore(
  "breadcrumb",
  () => {
    const breadcurmb = reactive({ breadcurmbList:[],showBreadcrumb:true });

  function setBreadcurmbList(list) {
      if(breadcurmb.breadcurmbList == list) {
          breadcurmb.breadcurmbList = list;
      } else {
          breadcurmb.breadcurmbList.length = 0
          Array.prototype.push.apply(breadcurmb.breadcurmbList, list);
      }
  }
  function setShowBreadcrumb(show) {
      breadcurmb.showBreadcrumb = show;
  }

    return { breadcurmb, setBreadcurmbList, setShowBreadcrumb };
  },
  { persist: { enabled: true, strategies: [{ storage: sessionStorage }] } }
);
