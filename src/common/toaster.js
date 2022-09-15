// import Vue from 'vue';
// import Toastr from 'vue-toastr';
// import 'vue-toastr/dist/vue-toastr.css'
import { createApp } from 'vue'
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

// var parent = document.createElement('div');
// var app = createApp(Toastr);
// const vm = app.mount(parent)

// const VueComponent = Vue.extend(Toastr);
// const vm = new VueComponent().$mount();
// vm.defaultProgressBar = false;
// vm.defaultPosition = "toast-bottom-right";
// vm.defaultPreventDuplicates = true;

// https://openbase.com/categories/js/best-vue-toast-libraries
let init = false;
let toast = null
let option = {
  transition: "Vue-Toastification__fade",
  position: "bottom-right",
  timeout: 3000,
  closeOnClick: false,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
}

if (!init) {
//   document.body.appendChild(vm.$el);
  init = true;
  toast = useToast()
}

const toaster = {
  success: function (msg) {
    toast.success(msg, option);
  },
  warning: function (msg) {
    toast.warning(msg, option)
  },
  warningWt: function (msg, title) {
    console.log(msg)
    // vm.w(msg, title);
  },
  info: function (msg) {
    toast.info(msg, option)
  },
  error: function (msg) {
    toast.error(msg, option)
  },
  errorWt: function (msg, title) {
    console.log(msg)
    // vm.e(msg, title);
  }
};

export default toaster;
