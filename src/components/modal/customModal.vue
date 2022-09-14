<template>
  <common-modal :show-modal='showDialog'>
    <template #headerSlot>
      <div class="modal-header">
        <h5 class="modal-title" v-text='title'></h5>
        <button type="button" class="close" @click='defaultClose()'>
          <span class='closeicon' title="关闭">&times;</span>
        </button>
      </div>
    </template>
    <template #bodySlot>
      <div class="modal-body" v-text='message'>
      </div>
    </template>
    <template #footerSlot>
      <div class="modal-footer">
        <button type="button" class='btn btn-secondary' @click='defaultClose()'>
          <i class="fa fa-times"></i><span>关闭</span>
        </button>
        <button type="button" class='btn btn-purple' @click='defaultConfirm()'>
          <i class='fa fa-check'></i><span>确定</span>
        </button>
      </div>
    </template>
  </common-modal>
</template>

<script>
  import commonModal from '@/components/common/commonModal.vue';

  export default {
    name: 'confirm',
    data () {
      return {
        showDialog: false,
        title: '确认信息',
        message: '确定要退出吗？',
        closeBtn: {show: true, cls: '', showIcon: true, iconCls: '', text: '关闭', fn: null},
        confirmBtn: {show: true, cls: '', showIcon: true, iconCls: '', text: '确定', fn: null}
      }
    },
    methods: {
      show: function () {
        this.showDialog = true;
      },
      hide: function() {
        this.showDialog = false;
        // 删除弹框元素
        var me = this;
        setTimeout(function() {
          me.$el.parentNode.removeChild(me.$el);
          me.$destroy(true);
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
    components: {commonModal}
  }
</script>
