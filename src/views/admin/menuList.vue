<template>
  <div class='maincontent listcontent'>
    <div class='list-header-but-group'>
      <button type="button" class="btn btn-outline-purple inline-block" @click="add()" v-authcode='"menuList_add"'>
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
          <th class=''>父级</th>
          <th class='w150'>编码</th>
          <th class='w160'>路径</th>
          <th class='w160'>图标</th>
          <th class='w60'>序号</th>
          <th class='w100'>操作</th>
        </tr>
        </thead>
        <tbody v-if='!pager.loading'>
        <tr v-for="(item, index) in list">
          <td class="text-center" v-text='index + 1'></td>
          <td>
            <a class='block w100p h100p' href='javascript:void(0)' v-text='item.name' @click='edit(item)'></a>
          </td>
          <td v-text='item.parentName'></td>
          <td v-text='item.code'></td>
          <td v-text='item.url'></td>
          <td v-tooltip='item.icon'><i class='fa' :class='item.icon'></i><span v-text='item.icon'></span></td>
          <td class="text-center" v-text='item.seq'></td>
          <td class="operate">
            <a class='inline-block mybtn' href='javascript:void(0)' @click='deleteItem(item)' v-authcode='"menuList_delete"' title='删除'><i
            class='fa fa-trash cf05'></i></a>
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
    name: 'menuList',
    data () {
      return {
        allDisabled:true,
        searchKey: null,
        list: [],
        pager: {pageNum: 1, pageSize: 10, loading: true}
      }
    },
    methods: {
      add() {
        this.$router.push({path: '/admin/menuEdit', query: {id: null}});
      },
      edit(entity) {
        this.$router.push({path: '/admin/menuEdit', query: {id: entity.id}});

      },
      search() {
        var me = this;
        me.pager.loading = true;
        me.allDisabled = true;
        this.$axios.get('/menu/queryPageList', {
          name: this.searchKey,
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
        this.$confirm.confirm('确定要删除菜单吗？', function () {
          me.$axios.get('/menu/delete', {id: entity.id}).then(function (resp) {
            if(resp.data.status == ResultStatus.OK.value) {
              me.$toaster.success('删除成功！');
              me.search();
            }
          });
        });
      }
    },
    mounted: function () {
      this.search();
    }
  }
</script>
<style scoped>
  .table{min-width:850px;}
</style>
