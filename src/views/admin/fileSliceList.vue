<template>
  <div class='maincontent listcontent'>
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
          <th class='w180'>创建人</th>
          <th class='w200'>MD5</th>
          <th class='w80'>大小</th>
          <th class='w80'>状态</th>
          <th class='w120'>URI</th>
          <th class='w90'>分片位置</th>
          <th class='w100'>操作</th>
        </tr>
        </thead>
        <tbody v-if='!pager.loading'>
        <tr v-for="(item, index) in list">
          <td class="text-center" v-text='((pager.pageNum - 1) * pager.pageSize) + index + 1'></td>
          <td v-text='item.fileStoreName'></td>
          <td v-text='$options.filters.formatDate(item.createdDate)'></td>
          <td class="text-center" v-text='item.creator'></td>
          <td class="text-center" v-text='item.md5' v-tooltip='item.md5'></td>
          <td class="text-center" v-text='commonSrv.getFileSize(item.size)'></td>
          <td class="text-center" v-text='$options.filters.enumNameFilter(item.status, "FileUploadStatus")'></td>
          <td class="text-center" v-text='item.url' v-tooltip='item.url'></td>
          <td class="text-center" v-text='item.chunk'></td>
          <td class="operate">
            <a class='inline-block mybtn' href='javascript:void(0)' @click='deleteItem(item)' v-authcode='"fileSlice_delete"' title='删除'>
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
  name: 'fileSliceList',
  data () {
    return {
      allDisabled:true,
      searchKey: null,
      list: [],
      pager: {pageNum: 1, pageSize: 10, loading: true},
      commonSrv: commonSrv,
      fileId: null
    }
  },
  methods: {
    add() {
      var me = this;
      this.$cstModal.showSliceUpload({callback: function(resp) {
          if(resp.data.status === ResultStatus.OK.value){
            me.$toaster.success('文件上传完成');
            me.queryList();
          }
        }
      });
    },
    edit(entity) {
      this.$router.push({path: '/admin/fileEdit', query: {id: entity.id}});
    },
    search() {
      this.goPage(1);
    },
    queryList() {
      var me = this;
      me.pager.loading = true;
      me.allDisabled = true;
      this.$axios.get('/file/queryPageSliceList', {
        fileId: me.fileId,
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
          commonSrv.setPagerModel('fileSliceList', model);
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
        me.$axios.get('/file/deleteSlice', {id: entity.id}).then(function (resp) {
          if (resp.data.status === ResultStatus.OK.value) {
            me.$toaster.success('删除成功！');
            me.queryList();
          }
        });
      });
    },
    permissionList: function (entity) {
      // this.$router.push({path: '/admin/permissionList', query: {functionId: entity.id}});
    },
    getSize: function(size) {
      if(!size) return '0'
      if(size / this.G >= 1) {
        return ((size / this.G) * 1.0).toFixed(2) + 'G'
      }
      if(size / this.M >= 1) {
        return ((size / this.M) * 1.0).toFixed(2) + 'M'
      }
      if(size / this.K >= 1) {
        return ((size / this.K) * 1.0).toFixed(2) + 'K'
      }
      return size + 'B'
    }
  },
  mounted: function () {
    var model = commonSrv.getPagerModel('fileSliceList');
    this.pager.pageNum = model.pageNum;
    this.pager.pageSize = model.pageSize;
    this.searchKey = model.filter.searchKey;
    this.fileId = this.$route.query.id

    this.queryList();
  }
}
</script>
