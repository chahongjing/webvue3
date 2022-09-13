<template>
  <div class='maincontent listcontent'>
    <div class='list-header-but-group'>
      <button type="button" class="btn btn-outline-purple inline-block" @click="add()" v-authcode='"file_add"'>
        <i class='fa fa-plus mr5'></i>添加
      </button>
    </div>
    <div class='searchbar'>
      <form class='myform form-inline form-group-w250 form-label-w80'>
        <div class="form-group">
          <label class="form-label">名称：</label>
          <div class="form-content">
            <input type="text" class="form-control" placeholder="名称" autofocus v-model='searchKey'>
          </div>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-purple ml20" @click='search()' :disabled='allDisabled'>
            <i class='fa fa-search mr5'></i>搜索
          </button>
        </div>
      </form>
    </div>
    <div class='table-list'>
      <table class="table table-hover">
        <thead>
        <tr>
          <th class='w50'>#</th>
          <th class=''>名称</th>
          <th class='w170'>创建时间</th>
          <th class='w200'>MD5</th>
          <th class='w80'>大小</th>
          <th class='w80'>状态</th>
          <th class='w120'>URI</th>
          <th class='w70'>分片数</th>
          <th class='w90'>分片大小</th>
          <th class='w100'>操作</th>
        </tr>
        </thead>
        <tbody v-if='!pager.loading'>
        <tr v-for="(item, index) in list">
          <td class="text-center" v-text='((pager.pageNum - 1) * pager.pageSize) + index + 1'></td>
          <td>
            <a class='block w100p h100p' href='javascript:void(0)' @click='edit(item)'><i :class="getFileTypeIcon(item.fileName)"></i>{{item.fileName}}</a>
          </td>
          <td v-text='$filters.formatDate(item.createdDate)'></td>
          <td class="text-center" v-text='item.md5' v-tooltip='item.md5'></td>
          <td class="text-center" v-text='commonSrv.getFileSize(item.size)'></td>
          <td class="text-center" v-text='$filters.enumNameFilter(item.status, "FileUploadStatus")'></td>
          <td class="text-center" v-text='item.url' v-tooltip='item.url'></td>
          <td class="text-center" v-text='item.chunks'></td>
          <td class="text-center" v-text='commonSrv.getFileSize(item.chunkSize)'></td>
          <td class="operate">
            <a class='inline-block mybtn' href='javascript:void(0)' @click='goToSliceList(item)' v-authcode='"fileSliceList"' title='分片列表'>
              <i class='fa fa-file-text-o cf90'></i>
            </a>
            <a class='inline-block mybtn' href='javascript:void(0)' @click='download(item)' v-authcode='"file_download"' title='下载'>
              <i class='fa fa-download c66c'></i>
            </a>
            <a class='inline-block mybtn' href='javascript:void(0)' @click='deleteItem(item)' v-authcode='"file_delete"' title='删除'>
              <i class='fa fa-trash cf05'></i>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
      <table-list-loading :list='list' :loading='pager.loading'></table-list-loading>
    </div>
    <div class='footer-pager'>
      <pagination :pager-info='pager'></pagination>
    </div>
  </div>
</template>

<script>
import commonSrv from '@/common/commonService';

export default {
  name: 'fileList',
  data () {
    return {
      allDisabled:true,
      searchKey: null,
      list: [],
      pager: {pageNum: 1, pageSize: 10, loading: true},
      commonSrv: commonSrv
    }
  },
  methods: {
    add() {
      var me = this;
      this.$cstModal.showSliceUpload({callback: function(resp) {
          if(resp.data.status === ResultStatus.OK.value){
            if(resp.data.value.exists) {
              me.$toaster.warning('文件已存在:' + resp.data.value.url);
            } else {
              me.$toaster.success('文件上传完成');
              me.queryList();
            }
          }
        }
      });
    },
    edit(entity) {
      this.$router.push({path: '/admin/fileEdit', query: {id: entity.id}});
    },
    goToSliceList(entity) {
      this.$router.push({path: '/admin/fileSliceList', query: {id: entity.id}});
    },
    search() {
      this.goPage(1);
    },
    queryList() {
      var me = this;
      me.pager.loading = true;
      me.allDisabled = true;
      this.$axios.get('/file/queryPageList', {
        name: me.searchKey,
        pageNum: me.pager.pageNum,
        pageSize: me.pager.pageSize
      }).then(function (resp) {
        if (resp.data.status === ResultStatus.OK.value) {
          me.list = resp.data.value.list;
          me.pager = commonSrv.getPagerInfo(resp.data.value, me.goPage);

          var model = {
            pageNum: me.pager.pageNum,
            pageSize: me.pager.pageSize,
            filter: {searchKey: me.searchKey}
          }
          commonSrv.setPagerModel('fileList', model);
        }
        me.allDisabled = false;
      });
    },
    goPage(page) {
      this.pager.pageNum = page;
      this.queryList();
    },
    deleteItem: function (entity) {
      var me = this;
      this.$confirm.confirm('确定要删除文件吗？', function () {
        me.$axios.get('/file/delete', {id: entity.id}).then(function (resp) {
          if (resp.data.status === ResultStatus.OK.value) {
            me.$toaster.success('删除成功！');
            me.queryList();
          }
        });
      });
    },
    getFileType: function (fileName) {
      var fileMediaType = commonSrv.getFileMediaType(fileName);
      switch (fileMediaType) {
        case commonSrv.mediaType.picture: return 'fa-file-image-o';
        case commonSrv.mediaType.audio: return 'fa-file-audio-o';
        case commonSrv.mediaType.video: return 'fa-file-video-o';
        case commonSrv.mediaType.code: return 'fa-file-code-o';
        case commonSrv.mediaType.excel: return 'fa-file-excel-o';
        case commonSrv.mediaType.ppt: return 'fa-file-powerpoint-o';
        case commonSrv.mediaType.word: return 'fa-file-word-o';
        case commonSrv.mediaType.pdf: return 'fa-file-pdf-o';
        case commonSrv.mediaType.text: return 'fa-file-text-o';
        case commonSrv.mediaType.zip: return 'fa-file-archive-o';
        default: return 'fa-file-o'
      }
    },
    getFileTypeIcon: function(fileName) {
      var obj = {fa: true}
      obj[this.getFileType(fileName)] = true
      return obj
    },
    download: function(entity) {
      var me = this;
      if(this.allDisabled) return;
      this.allDisabled = true
      this.$axios.getDownload('/file/download/', {id: entity.id, fileName: entity.fileName}).then(function (resp) {
        Utility.downloadAfterAjax(resp.data, resp.headers);
        me.allDisabled = false
      });
    }
  },
  mounted: function () {
    var model = commonSrv.getPagerModel('fileList');
    this.pager.pageNum = model.pageNum;
    this.pager.pageSize = model.pageSize;
    this.searchKey = model.filter.searchKey;

    this.queryList();
  }
}
</script>
