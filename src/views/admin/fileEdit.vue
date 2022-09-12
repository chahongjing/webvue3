<template>
  <div class='maincontent'>
    <div class="mypanel" style="width:500px;margin:auto;margin-top:20px;">
      <div class="panel-heading font-bold">文件信息</div>
      <div class="panel-body">
        <form class='myform infotip form-label-w110 block-form-group'>
          <div class="form-group">
            <label class="form-label req colon">文件名称</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="文件名称"
                     v-model='fileBank.fileName' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label req colon">存储名称</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="存储名称"
                     v-model='fileBank.fileStoreName' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">创建时间</label>
            <div class="form-content">
              <date-time-picker v-model='fileBank.createdDate' :option='dateOpt'></date-time-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">创建人</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="创建人"
                     v-model='fileBank.creator' :disabled="allDisabled">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">修改时间</label>
            <div class="form-content">
              <date-time-picker v-model='fileBank.updatedDate' :option='dateOpt'></date-time-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">修改人</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="修改人"
                     v-model='fileBank.updater' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">MD5</label>
            <div class="form-content">
              <div class="input-group">
                <input type="text" class="form-control border-right-0" v-model="fileBank.md5"
                       :disabled="allDisabled"/>
                <div class="input-group-addon input-group-append">
                  <span class="input-group-text pointer" style="padding:8px 10px;" @click="copyToClickboard(fileBank.md5)">
                    <i class="fa fa-files-o mr-0"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">头部MD5</label>
            <div class="form-content">
              <div class="input-group">
                <input type="text" class="form-control border-right-0" v-model="fileBank.headMd5"
                       :disabled="allDisabled"/>
                <div class="input-group-addon input-group-append">
                  <span class="input-group-text pointer" style="padding:8px 10px;" @click="copyToClickboard(fileBank.headMd5)">
                    <i class="fa fa-files-o mr-0"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">尾部MD5</label>
            <div class="form-content">
              <div class="input-group">
                <input type="text" class="form-control border-right-0" v-model="fileBank.tailMd5"
                       :disabled="allDisabled"/>
                <div class="input-group-addon input-group-append">
                  <span class="input-group-text pointer" style="padding:8px 10px;" @click="copyToClickboard(fileBank.tailMd5)">
                    <i class="fa fa-files-o mr-0"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">URI</label>
            <div class="form-content">
              <div class="input-group">
                <input type="text" class="form-control border-right-0" v-model="fileBank.url"
                       :disabled="allDisabled"/>
                <div class="input-group-addon input-group-append">
                  <span class="input-group-text pointer" style="padding:8px 10px;" @click="copyToClickboard(fileBank.url)">
                    <i class="fa fa-files-o mr-0"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">状态</label>
            <div class="form-content">
              <select class='form-control' v-model="fileBank.status" :disabled="allDisabled">
                <option value="" disabled>-- 全部 --</option>
                <option v-for="item in fileUploadStatusList" :value="item.value" v-text="item.name"></option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">大小(K)</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="大小"
                     v-model='fileBank.size' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">分片数</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="分片数"
                     v-model='fileBank.chunks' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label colon">分片大小(K)</label>
            <div class="form-content">
              <input type="text" class="form-control" placeholder="分片大小"
                     v-model='fileBank.chunkSize' :disabled="allDisabled"/>
            </div>
          </div>
          <div class="form-group text-right mb0">
            <button type="button" class="btn btn-outline-purple" @click='$root.goBack()'>
              <i class='fa fa-arrow-circle-o-left fa-plus-myrotate fa-back-myrotate'></i><span>返回</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileDetail',
  data () {
    return {
      allDisabled:true,
      dateOpt:{format: 'yyyy-mm-dd hh:ii:ss', minView: 0,disabled:true},
      fileUploadStatusList: [],
      fileBank: {}
    }
  },
  methods: {
    init: function() {
      this.allDisabled = true;
      this.getDetail(this.$route.query.id);
    },
    getDetail: function(id) {
      var me = this;
      this.$axios.get('/file/getFileDetail', {id: id}).then(function (resp) {
        if (resp.data.status == ResultStatus.OK.value) {
          me.fileBank = resp.data.value;
        }
        // me.allDisabled = false;
      });
    },
    copyToClickboard: function(text) {
      if(window.copy) {
        window.copy(text);
      } else if(window.clipboardData) {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", text);
      } else {
        const input = document.createElement('textarea')
        input.value = text
        document.body.appendChild(input)
        input.focus()
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        this.$toaster.success('复制成功！');
      }
    }
  },
  mounted: function () {
    var list = [];
    for (var item in enumMap.FileUploadStatus) {
      list.push(enumMap.FileUploadStatus[item]);
    }
    this.fileUploadStatusList = list;
    this.init()
  }
}
</script>
