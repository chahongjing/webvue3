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
      <div class="modal-body p15">
        <form class='myform infotip form-label-w60 block-form-group' style="width:550px">
          <div class="form-group file-box">
            <label class="form-label">文件：</label>
            <label class="form-content relative mb0" title="点击选择文件">
              <span class="upload-btn">
                <i class="fa fa-upload c71a"></i>
              </span>
              <span class="text">个数限制：<span class="font-weight-bold c71a">5</span> 个；每个大小限制：<span class="font-weight-bold c71a">10</span> MB；格式参见说明</span>
              <input type="file" id='testFile' class="form-control" multiple @change="changeFile" :disabled="allDisabled"/>
            </label>
            <div class='form-info pointer' style="display:inline-block;">
              <i class='fa fa-file-archive-o cd55' v-tooltip="fileSuffixMemo"></i>
            </div>
          </div>
          <div class="form-group" v-if="uploadResult.fileList && uploadResult.fileList.length > 0">
            <label class="form-label">&nbsp;</label>
            <div class="form-content">
              <ul>
                <li v-for="(file, index) in uploadResult.fileList">
                  <span v-text="index + 1 + '.'" class="inline-block text-right mr5" style="width:20px;"></span>
                  <i :class="getFileTypeIcon(file)"></i>
                  <span v-text="file.file.name"></span>
                  <i class="fa fa-spinner fa-spin ml5 fr c09c" style="font-size:15px;vertical-align: middle" v-if="file.type == 1"></i>
                  <i class="fa fa-check-circle-o ml5 fr c393" style="font-size:15px;vertical-align: middle" v-if="file.type == 2"></i>
                  <i class="fa fa-download ml5 fr c393 pointer" style="font-size:15px;vertical-align: middle" @click="download(file.data)" v-if="file.type == 2"></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">进度：</label>
            <div class="form-content">
              <div style="margin:10px 0;position: relative">
<!--                <progress id="progress" max="100" value="0" style="width:100%;height:30px;display:none"></progress>-->
                <div class="progress">
                  <div class="progress-bar bg-success progress-bar-striped progress-bar-animated active" :style="{width: Math.floor(uploadResult.progress) + '%'}">
                  </div>
                </div>
              </div>
            </div>
            <div class='form-info' style="display: inline-block;right:-33px;line-height:34px;" v-text="uploadResult.progress + '%'">
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footerSlot>
      <div class="modal-footer">
        <button type="button" class='btn btn-purple' @click='upload()' :disabled="allDisabled">
          <i class='fa fa-upload'></i><span>上传</span>
        </button>
      </div>
    </template>
  </common-modal>
</template>

<script>
import commonModal from '@/components/common/commonModal.vue';
import commonSrv from '@/common/commonService';
import directive from '@/common/directives';
import fileService from "@/common/fileService";

export default {
    data() {
      return {
        allDisabled: false,
        progress: 0,
        showDialog: false,
        title: '上传文件',
        closeBtn: {show: true, cls: '', showIcon: true, iconCls: '', text: '关闭', fn: null},
        modalOpt: {width: '600px',maxWidth: '600px'},
        uploadResult: {
          progress: 0,
          fileList: []
        },
        fileList:[],
        currFileIndex: -1,
        unit1Mb: fileService.unit1Mb,
        fileSuffixMemo: '支持格式：<span style="color:red">xls</span>, xlsx, doc, docx, ppt, pptx, png, jpg'
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
      },
      changeFile() {
        var files = $('#testFile')[0].files;
        if(!files || files.length === 0) {
          this.uploadResult.fileList.length = 0
          this.uploadResult.progress = 0
          return;
        }
        for(var i = 0; i < files.length; i++) {
          this.uploadResult.fileList.push({file: files[i], type: 0})
        }
      },
      async upload(){
        this.allDisabled = true
        // this.uploadNext();
        var result = await fileService.uploadFileList(this.uploadResult)
        this.callback && this.callback(this.uploadResult.fileList)
        this.defaultClose()
        this.allDisabled = false
      },
      download: function (item) {
        var me = this;
        this.$axios.getDownload('/file/download/', {id: item.id, fileName: item.fileName}).then(function (resp) {
          Utility.downloadAfterAjax(resp.data, resp.headers);
        });
      },
      // uploadNext() {
      //   this.currFileIndex++
      //   if(this.currFileIndex >= this.fileList.length) {
      //     this.callback && this.callback(this.fileList)
      //     this.defaultClose()
      //     this.allDisabled = false
      //     return
      //   }
      //   var fileObj = this.fileList[this.currFileIndex]
      //   fileObj.type = 1
      //   if(fileObj.file.size > 10 * this.unit1Mb) {
      //     this.uploadBigFile(fileObj.file)
      //   } else {
      //     this.uploadSimple(fileObj.file)
      //   }
      // },
      // uploadSimple(file) {
      //   var me = this
      //   var formData = new FormData();
      //   formData.append("myfile", file);
      //   this.$axios.post('/file/upload', formData).then(function (resp) {
      //     if (resp.data.status == ResultStatus.OK.value) {
      //       var fileObj = me.fileList[me.currFileIndex]
      //       fileObj.data = resp.data.value
      //       fileObj.type = 2
      //       me.uploadNext()
      //     } else {
      //       me.$toaster.error(resp.data.msg);
      //       me.allDisabled = false
      //     }
      //   });
      // },
      // uploadBigFile(file){
      //   // Read in chunks of 2MB
      //   var param = {
      //     file: file,
      //     fileName: file.name,
      //     chunkSize: this.unit1Mb * 2,
      //     chunks: Math.ceil(file.size / (this.unit1Mb * 2)),
      //     chunk: 0,
      //     fileId: null,
      //     fileMd5: null,
      //     size: file.size
      //   }
      //   // 超过10mb的大文件只校验前2mb和后2mb
      //   if(param.size > 10 * this.unit1Mb) {
      //     this.uploadByHeadTailMd5(param)
      //   } else {
      //     // 小文件校验整个文件的md5
      //     this.uploadByMd5(param)
      //   }
      // },
      // uploadByMd5: function(param) {
      //   var me = this
      //   // 小文件直接获取整个文件的md5值
      //   me.getMd5(param.file, (md5) => {
      //     param.fileMd5 = md5;
      //     var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
      //     me.$axios.get('/file/checkFileMd5', uParam).then(function(resp) {
      //       if(resp.data && resp.data.value) {
      //         param.fileId = resp.data.value.id;
      //         param.chunk = resp.data.value.chunk;
      //       }
      //       if(resp.data.status === ResultStatus.OK.value && resp.data.value.exists) {
      //         // 文件已存在
      //         var fileObj = me.fileList[me.currFileIndex]
      //         fileObj.data = resp.data.value
      //         fileObj.type = 2
      //         me.uploadNext()
      //       } else if(resp.data.status === ResultStatus.NO.value) {
      //         // 没有上传过，开始切片上传
      //         me.sliceUpload(param);
      //       }
      //     })
      //   });
      // },
      // uploadByHeadTailMd5:function(param) {
      //   var me = this
      //   // 大文件获取md5值较慢，校验前2mb，后2mb两个md5和后台数据对比
      //   me.getMd5(me.getBlobSlice().call(param.file, 0, param.chunkSize), (sliceMd5) => {
      //     param.headMd5 = sliceMd5
      //     me.getMd5(me.getBlobSlice().call(param.file, param.size - param.chunkSize, param.size), (sliceMd5) => {
      //       param.tailMd5 = sliceMd5
      //       var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
      //       me.$axios.get('/file/checkFileMd5', uParam).then(function(resp) {
      //         if(resp.data && resp.data.value) {
      //           param.fileId = resp.data.value.id;
      //           param.chunk = resp.data.value.chunk;
      //         }
      //         if(resp.data.status === ResultStatus.OK.value && resp.data.value.exists) {
      //           // 文件已存在
      //           var fileObj = me.fileList[me.currFileIndex]
      //           fileObj.data = resp.data.value
      //           fileObj.type = 2
      //           me.uploadNext()
      //         } else if(resp.data.status === ResultStatus.NO.value) {
      //           // 没有上传过，开始切片上传
      //           me.sliceUpload(param);
      //         }
      //       })
      //     })
      //   })
      // },
      // sliceUpload: function(param) {
      //   var me = this
      //   var start = param.chunk * param.chunkSize,
      //     end = ((start + param.chunkSize) >= param.size) ? param.size : start + param.chunkSize;
      //   var chunkFile = me.getBlobSlice().call(param.file, start, end);
      //   me.getMd5(chunkFile, (sliceMd5) => {
      //     var uParam = {fileMd5: param.fileMd5, fileHeadMd5: param.headMd5, fileTailMd5: param.tailMd5, fileId: param.fileId, md5: sliceMd5,size: param.chunkSize,chunk:param.chunk,showMsg:false}
      //     me.$axios.get('/file/checkSliceMd5', uParam).then(function(resp) {
      //       if(resp.data.status === ResultStatus.OK.value) {
      //         console.log('slice exists:', resp.data.value.url);
      //         me.afterSliceUpload(param)
      //       } else if(resp.data.status === ResultStatus.NO.value) {
      //         var formData = new FormData();
      //         formData.append("sliceFile", chunkFile);
      //         formData.append("md5", sliceMd5);
      //         formData.append("chunkSize", chunkFile.size);
      //         formData.append("chunk", param.chunk);
      //
      //         formData.append("fileName", param.fileName);
      //         formData.append("fileMd5", param.fileMd5 || '');
      //         formData.append("fileId", param.fileId);
      //         formData.append("fileHeadMd5", param.headMd5 || '');
      //         formData.append("fileTailMd5", param.tailMd5 || '');
      //         formData.append("chunks", param.chunks);
      //         formData.append("size", end - start);
      //         me.$axios.post('/file/uploadSlice', formData).then(function(resp) {
      //           if(resp.data.status === ResultStatus.OK.value) {
      //             me.afterSliceUpload(param)
      //           }
      //         })
      //       }
      //     })
      //   })
      // },
      // afterSliceUpload: function(param) {
      //   param.chunk++;
      //   this.progress = Math.floor((param.chunk / param.chunks) * 100);
      //   // 文件已存在
      //   if (param.chunk < param.chunks) {
      //     this.sliceUpload(param);
      //   } else {
      //     // 上传完成，可以合并文件
      //     this.mergeSliceFile(param.fileId, param.fileMd5, param.fileName, param.headMd5, param.tailMd5, param.chunkSize);
      //   }
      // },
      // mergeSliceFile: function(fileId, fileMd5, fileName, headMd5, tailMd5, chunkSize) {
      //   var me = this
      //   var param = {
      //     id: fileId,
      //     fileName: fileName,
      //     md5: fileMd5,
      //     headMd5: headMd5,
      //     tailMd5: tailMd5,
      //     chunkSize: chunkSize
      //   }
      //   this.$axios.get('/file/mergeSliceFile', param).then(function(resp) {
      //     if(resp.data.status === ResultStatus.OK.value){
      //       var fileObj = me.fileList[me.currFileIndex]
      //       fileObj.data = resp.data.value
      //       fileObj.type = 2
      //       me.uploadNext()
      //     } else if(resp.data.status === ResultStatus.NO.value) {
      //       me.$toaster.error('文件合并失败');
      //     }
      //   })
      // },
      // getMd5: function(file, callback) {
      //   var me = this
      //   var fileReader = new FileReader()
      //   fileReader.onload = function (e) {
      //     // Append array buffer
      //     var spark = me.getSpark()
      //     spark.append(e.target.result);
      //     callback && callback(spark.end());
      //   }
      //   fileReader.onerror = function () {
      //     console.warn('oops, something went wrong.');
      //   };
      //   fileReader.readAsArrayBuffer(file);
      // },
      // getBlobSlice: function() {
      //   return File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      // },
      // getSpark: function() {
      //   return new SparkMD5.ArrayBuffer()
      // },
      getFileTypeIcon: function(item) {
        var obj = {fa: true}
        commonSrv.getFileFaType(item.file.name).forEach(cls => obj[cls] = true)
        return obj
      },
    },
    mounted: function () {
    },
    components: {commonModal},
    directives: {'tooltip':directive.tooltip}
  }
</script>

<style scoped>
  .modal-header {
    border-bottom: none;
  }

</style>
