// import Vue from 'vue'
import { createApp } from 'vue'
import audioPlayerModal from '@/components/modal/audioPlayerModal.vue'
import videoPlayerModal from '@/components/modal/videoPlayerModal.vue'
import sliceUpload from '@/components/modal/sliceUploadModal.vue'
import axios from '@/common/axios.js';

function showModal(com, options) {
  var parent = document.createElement('div');
  var app = createApp(com);
  app.config.globalProperties.$axios = axios
  const instance = app.mount(parent)
  var tempOption = {};
  $.extend(true, tempOption, options || {});
  Object.assign(instance, tempOption);
  document.body.appendChild(instance.$el);
  instance.show();
  return instance;
}

const modal = {
  showAudio: function (options) {
    showModal(audioPlayerModal, options);
  },
  showVideo: function (options) {
    showModal(videoPlayerModal, options);
  },
  showSliceUpload: function (options) {
    showModal(sliceUpload, options);
  }
};

export default modal;
