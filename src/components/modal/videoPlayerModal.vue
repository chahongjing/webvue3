<template>
  <common-modal :show-modal='showDialog' :options="modalOpt">
    <template #headerSlot>
      <div class="modal-header">
        <h5 class="modal-title" v-text='title'></h5>
        <button type="button" class="close" @click='defaultClose()'>
          <span class='closeicon' title="关闭">&times;</span>
        </button>
      </div>
    </template>
    <template #bodySlot>
      <div class="modal-body p0">
        <video-player :src="src"></video-player>
      </div>
    </template>
    <template #footerSlot>
      <div class="modal-footer">
        <button type="button" class='btn btn-dmall' @click='defaultConfirm()' :data-src="src">
          <i class='fa fa-times'></i><span>关闭</span>
        </button>
      </div>
    </template>
  </common-modal>
</template>

<script>
  import commonModal from '@/components/common/commonModal.vue';
  import videoPlayer from "@/components/common/videoPlayer.vue";

  export default {
    data() {
      return {
        showDialog: false,
        title: '视频播放',
        closeBtn: {show: true, cls: '', showIcon: true, iconCls: '', text: '关闭', fn: null},
        modalOpt: {width: '900px',maxWidth: '900px'},
        src: null
      }
    },
    methods: {
      show: function () {
        this.showDialog = true;
      },
      hide: function () {
        this.showDialog = false;
        // 删除弹框元素
        var me = this;
        setTimeout(function () {
          me.$el.parentNode.removeChild(me.$el);
          // me.$destroy(true);
        }, 200);
      },
      defaultClose: function () {
        var me = this;
        if (me.closeBtn && me.closeBtn.fn) {
          me.closeBtn && me.closeBtn.fn();
        }
        me.showDialog = false;
        this.hide();
      },
      defaultConfirm: function () {
        var me = this;
        if (me.confirmBtn && me.confirmBtn.fn) {
          me.confirmBtn && me.confirmBtn.fn();
        }
        me.showDialog = false;
        me.hide();
      }
    },
    mounted: function () {
    },
    components: {commonModal,videoPlayer}
  }
</script>

<style scoped>
  .modal-header {
    border-bottom: none;
  }
</style>
