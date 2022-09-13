// import Vue from 'vue';
import Toastr from 'vue-toastr';
// import 'vue-toastr/dist/vue-toastr.css'
import { createApp } from 'vue'

// var parent = document.createElement('div');
// var app = createApp(Toastr);
// const vm = app.mount(parent)

// const VueComponent = Vue.extend(Toastr);
// const vm = new VueComponent().$mount();
// vm.defaultProgressBar = false;
// vm.defaultPosition = "toast-bottom-right";
// vm.defaultPreventDuplicates = true;
let init = false;

// if (!init) {
//   document.body.appendChild(vm.$el);
//   init = true;
// }

const toaster = {
  success: function (msg) {
    console.log(msg)
    // vm.s(msg);
  },
  warning: function (msg) {
    console.log(msg)
    // vm.w(msg, '提示信息');
  },
  warningWt: function (msg, title) {
    console.log(msg)
    // vm.w(msg, title);
  },
  info: function (msg) {
    console.log(msg)
    // vm.i(msg);
  },
  error: function (msg) {
    console.log(msg)
    // vm.e(msg, '错误信息');
  },
  errorWt: function (msg, title) {
    console.log(msg)
    // vm.e(msg, title);
  }
};

export default toaster;
