<template>
  <common-modal :show-modal='showDialog' :options="modalOpt">
    <div class="modal-header" slot='headerSlot'>
      <h5 class="modal-title" v-text='title'></h5>
      <button type="button" class="close" @click='defaultClose()'>
        <span class='closeicon' title="关闭">&times;</span>
      </button>
    </div>
    <div class="modal-body p15" slot="bodySlot">
      <form class='myform infotip form-label-w60 block-form-group'>
        <div class="form-group">
          <label class="form-label">文件：</label>
          <div class="form-content">
            <input type="file" id='testFile' class="form-control" multiple placeholder="文件" :disabled="allDisabled"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">进度：</label>
          <div class="form-content">
            <div style="width:90%;margin:10px 0;position: relative">
              <progress id="progress" max="100" value="0" style="width:100%;height:30px;display:none"></progress>
              <div class="progress">
                <div class="progress-bar progress-bar-success progress-bar-striped active" :style="{width: Math.floor(progress) + '%'}">
                  <span class="sr-only">0%</span>
                </div>
              </div>
              <span style="position:absolute;right:-40px;top:-3px;" v-text="progress + '%'"></span>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer" slot="footerSlot">
      <button type="button" class='btn btn-purple' @click='uploadBigFile()':disabled="allDisabled">
        <i class='fa fa-upload'></i><span>上传</span>
      </button>
    </div>
  </common-modal>
</template>

<script>
import commonModal from '@/components/common/commonModal';
import SparkMD5 from "spark-md5";

export default {
    data() {
      return {
        allDisabled: false,
        progress: 0,
        showDialog: false,
        title: '上传文件',
        closeBtn: {show: true, cls: '', showIcon: true, iconCls: '', text: '关闭', fn: null},
        modalOpt: {width: '600px',maxWidth: '600px'}
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
          me.$destroy(true);
          me.$el.parentNode.removeChild(me.$el);
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
      },
      uploadBigFile(){
        this.allDisabled = true
        var me = this;
        var files = $('#testFile')[0].files;
        if(!files || files.length === 0) {
          me.$toaster.warning('请选择要上传的文件！');
          this.allDisabled = false
          return;
        }
        // Read in chunks of 2MB
        var unit1Mb = 1024 * 1024
        var file = files[0]
        var param = {
          file: file,
          fileName: file.name,
          chunkSize: unit1Mb * 2,
          chunks: Math.ceil(file.size / (unit1Mb * 2)),
          chunk: 0,
          fileId: null,
          fileMd5: null,
          size: file.size
        }
        // 超过10mb的大文件只校验前2mb和后2mb
        if(param.size > 10 * unit1Mb) {
          this.uploadByHeadTailMd5(param)
        } else {
          // 小文件校验整个文件的md5
          this.uploadByMd5(param)
        }
      },
      uploadByMd5: function(param) {
        var me = this
        // 小文件直接获取整个文件的md5值
        me.getMd5(param.file, (md5) => {
          param.fileMd5 = md5;
          var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
          me.$axios.get('/file/checkFileMd5', uParam).then(function(resp) {
            if(resp.data && resp.data.value) {
              param.fileId = resp.data.value.id;
              param.chunk = resp.data.value.chunk;
            }
            if(resp.data.status === ResultStatus.OK.value) {
              // 文件已存在
              resp.data.value.exists = true
              me.callback && me.callback(resp)
              me.defaultClose()
              // me.$toaster.warning('file exists:' + resp.data.value.url);
              me.allDisabled = false
            } else if(resp.data.status === ResultStatus.NO.value) {
              // 没有上传过，开始切片上传
              me.sliceUpload(param);
            }
          })
        });
      },
      uploadByHeadTailMd5:function(param) {
        var me = this
        // 大文件获取md5值较慢，校验前2mb，后2mb两个md5和后台数据对比
        me.getMd5(me.getBlobSlice().call(param.file, 0, param.chunkSize), (sliceMd5) => {
          param.headMd5 = sliceMd5
          me.getMd5(me.getBlobSlice().call(param.file, param.size - param.chunkSize, param.size), (sliceMd5) => {
            param.tailMd5 = sliceMd5
            var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
            me.$axios.get('/file/checkFileMd5', uParam).then(function(resp) {
              if(resp.data && resp.data.value) {
                param.fileId = resp.data.value.id;
                param.chunk = resp.data.value.chunk;
              }
              if(resp.data.status === ResultStatus.OK.value) {
                // 文件已存在
                resp.data.value.exists = true
                me.callback && me.callback(resp)
                me.defaultClose()
                // me.$toaster.warning('file exists:' + resp.data.value.url);
                me.allDisabled = false
              } else if(resp.data.status === ResultStatus.NO.value) {
                // 没有上传过，开始切片上传
                me.sliceUpload(param);
              }
            })
          })
        })
      },
      sliceUpload: function(param) {
        var me = this
        var start = param.chunk * param.chunkSize,
          end = ((start + param.chunkSize) >= param.size) ? param.size : start + param.chunkSize;
        var chunkFile = me.getBlobSlice().call(param.file, start, end);
        me.getMd5(chunkFile, (sliceMd5) => {
          var uParam = {fileMd5: param.fileMd5, fileHeadMd5: param.headMd5, fileTailMd5: param.tailMd5, fileId: param.fileId, md5: sliceMd5,size: param.chunkSize,chunk:param.chunk,showMsg:false}
          me.$axios.get('/file/checkSliceMd5', uParam).then(function(resp) {

            if(resp.data.status === ResultStatus.OK.value) {
              console.log('slice exists:', resp.data.value.url);
              me.afterSliceUpload(param)
            } else if(resp.data.status === ResultStatus.NO.value) {
              var formData = new FormData();
              formData.append("sliceFile", chunkFile);
              formData.append("md5", sliceMd5);
              formData.append("chunkSize", chunkFile.size);
              formData.append("chunk", param.chunk);

              formData.append("fileName", param.fileName);
              formData.append("fileMd5", param.fileMd5 || '');
              formData.append("fileId", param.fileId);
              formData.append("fileHeadMd5", param.headMd5 || '');
              formData.append("fileTailMd5", param.tailMd5 || '');
              formData.append("chunks", param.chunks);
              formData.append("size", end - start);
              me.$axios.post('/file/uploadSlice', formData).then(function(resp) {
                if(resp.data.status === ResultStatus.OK.value) {
                  me.afterSliceUpload(param)
                }
              })
            }
          })
        })
      },
      afterSliceUpload: function(param) {
        param.chunk++;
        this.progress = Math.floor((param.chunk / param.chunks) * 100);
        // 文件已存在
        if (param.chunk < param.chunks) {
          this.sliceUpload(param);
        } else {
          // 上传完成，可以合并文件
          this.mergeSliceFile(param.fileId, param.fileMd5, param.fileName, param.headMd5, param.tailMd5, param.chunkSize);
        }
      },
      mergeSliceFile: function(fileId, fileMd5, fileName, headMd5, tailMd5, chunkSize) {
        var me = this
        var param = {
          id: fileId,
          fileName: fileName,
          md5: fileMd5,
          headMd5: headMd5,
          tailMd5: tailMd5,
          chunkSize: chunkSize
        }
        this.$axios.get('/file/mergeSliceFile', param).then(function(resp) {
          if(resp.data.status === ResultStatus.OK.value){
            me.callback && me.callback(resp)
            me.defaultClose()
          } else if(resp.data.status === ResultStatus.NO.value) {
            me.$toaster.error('文件合并失败');
          }
          me.allDisabled = false
        })
      },
      getMd5: function(file, callback) {
        var me = this
        var fileReader = new FileReader()
        fileReader.onload = function (e) {
          // Append array buffer
          var spark = me.getSpark()
          spark.append(e.target.result);
          callback && callback(spark.end());
        }
        fileReader.onerror = function () {
          console.warn('oops, something went wrong.');
        };
        fileReader.readAsArrayBuffer(file);
      },
      getBlobSlice: function() {
        return File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      },
      getSpark: function() {
        return new SparkMD5.ArrayBuffer()
      }
    },
    mounted: function () {
    },
    components: {commonModal}
  }
</script>

<style scoped>
  .modal-header {
    border-bottom: none;
  }
</style>
