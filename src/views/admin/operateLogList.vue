<template>
  <div class='maincontent listcontent'>
    <div class='list-header-but-group'>
      <button type="button" class="btn btn-outline-purple inline-block" @click="deleteAll()" v-authcode='"operateLogList_deleteAll"'>
        <i class='fa fa-trash mr5'></i>删除全部
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
          <label class="form-label colon">日志级别</label>
          <div class="form-content">
            <select class='form-control' v-model="logLevel">
              <option value="">-- 全部 --</option>
              <option v-for="item in logLevelList" :value="item.value" v-text="item.name"></option>
            </select>
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
          <th class='w70'>级别</th>
          <th class="w70">时间&nbsp;<i class="fa fa-info-circle" v-tooltip='"单位：毫秒 ms"'></i></th>
          <th class="w300">内容</th>
          <th class='w100'>用户</th>
          <th class='w300'>控制器</th>
          <th class='w150'>方法</th>
          <th class='w170'>时间</th>
          <th class='w70'>操作</th>
        </tr>
        </thead>
        <tbody v-if='!pager.loading'>
        <tr v-for="(item, index) in list">
          <td class="text-center" v-text='index + 1'></td>
          <td v-text='$filters.enumNameFilter(item.logLevel, "LogLevel")'></td>
          <td class="text-right" v-text='item.duration'></td>
          <td v-text='item.content' :title="item.content"></td>
          <td v-text='item.userName' :title="item.userName"></td>
          <td v-text='item.controller' :title="item.controller"></td>
          <td v-text='item.method' :title="item.method"></td>
          <td class="text-center" v-text='$filters.formatDate(item.createdOn)'></td>
          <td class="operate">
            <a class='inline-block mybtn' href='javascript:void(0)' @click='edit(item)' v-authcode='"operateLogList_view"' title='查看'><i
              class='fa fa-eye cf05'></i>
            </a>
            <a class='inline-block mybtn' href='javascript:void(0)' @click='deleteItem(item)' v-authcode='"operateLogList_delete"' title='删除'><i
              class='fa fa-trash cf05'></i>
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
    name: 'operateLogList',
    data () {
      return {
        allDisabled: true,
        searchKey: null,
        list: [],
        logLevel: '',
        logLevelList: [],
        pager: {pageNum: 1, pageSize: 10, loading: true}
      }
    },
    methods: {
      edit(entity) {
        this.$router.push({path: '/admin/operateLogEdit', query: {id: entity.id}});

      },
      search() {
        var me = this;
        me.allDisabled = true;
        me.pager.loading = true;
        this.$axios.get('/operateLog/queryPageList', {
          name: this.searchKey,
          logLevel: this.logLevel,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize
        }).then(function (resp) {
          if(resp.data.status == ResultStatus.OK.value) {
            me.list = resp.data.value.list;
            me.pager = commonSrv.getPagerInfo(resp.data.value, me.goPage);
          }
          me.allDisabled = false;
        });
      },
      goPage(page) {
        this.pager.pageNum = page;
        this.search();
      },
      deleteItem: function (entity) {
        var me = this;
        this.$confirm.confirm('确定要删除日志吗？', function () {
          me.$axios.get('/operateLog/delete', {id: entity.logID}).then(function (resp) {
            if(resp.data.status == ResultStatus.OK.value) {
              me.$toaster.success('删除成功！');
              me.search();
            }
          });
        });
      },
      deleteAll: function () {
        var me = this;
        this.$confirm.confirm('确定要清空所有日志吗？', function () {
          me.$axios.get('/operateLog/deleteAll').then(function (resp) {
            if(resp.data.status == ResultStatus.OK.value) {
              me.$toaster.success('清空成功！');
              me.search();
            }
          });
        });
      },
      getEnumList: function() {
        var list = [];
        for (var item in enumMap.LogLevel) {
          list.push(enumMap.LogLevel[item]);
        }
        this.logLevelList = list;
      }
    },
    mounted: function () {
      this.getEnumList();
      this.search();
    }
  }
</script>
<style scoped>
  .fixtable-header-top,.fixtable-con{min-width:990px;}
</style>
