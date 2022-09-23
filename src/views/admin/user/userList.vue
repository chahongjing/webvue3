<template>
  <div class='maincontent listcontent'>
    <div class='list-header-but-group'>
      <button type="button" class="btn btn-outline-purple inline-block" @click="add()" v-authcode='"userList_add"'>
        <i class='fa fa-plus fa-plus-myrotate mr5'></i>添加
      </button>
      <button type="button" class="btn btn-outline-purple inline-block ml10" @click="showBatchImportModal()" v-authcode='"userList_add"'>
        <i class='fa fa-cloud-upload mr5'></i>批量导入
      </button>
      <button type="button" class="btn btn-outline-purple inline-block ml10" @click="download()" v-authcode='"userList_add"' :disabled="allDisabled">
        <i class='fa fa-cloud-download mr5'></i>导出
      </button>
    </div>
    <div class='searchbar'>
      <form class='myform form-inline form-group-w280 form-label-w80'>
        <div class="form-group">
          <label class="form-label colon">名称</label>
          <div class="form-content">
            <input type="text" class="form-control" placeholder="名称" autofocus v-model='searchKey'>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label colon">性别</label>
          <div class="form-content">
            <select class='form-control' v-model="sexValue">
              <option value="">-- 全部 --</option>
              <option v-for="item in sexList" :value="item.value" v-text="item.name"></option>
            </select>
          </div>
        </div>
        <div class="form-group btn100">
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
          <th class='sortheader' :class='getOrderByClass(nameOrderBy)' @click='setOrderBy(nameOrderBy)'>名称</th>
          <th class='w200 sortheader' :class='getOrderByClass(codeOrderBy)' @click='setOrderBy(codeOrderBy)'>编码</th>
          <th class='w170 sortheader' :class='getOrderByClass(createdOnOrderBy)' @click='setOrderBy(createdOnOrderBy)'>创建时间</th>
          <th class='w70'>性别</th>
          <th class='w90'>类型</th>
          <th class='w70 text-center'>状态</th>
          <th class='w120'>操作</th>
        </tr>
        </thead>
        <tbody v-if='!pager.loading'>
        <tr v-for="(item, index) in list">
          <td class="text-center" v-text='((pager.pageNum - 1) * pager.pageSize) + index + 1'></td>
          <td>
            <a class='block w100p h100p' href='javascript:void(0)' v-text='item.name' @click='edit(item)'></a>
          </td>
          <td v-text='item.code + " [ " + item.id + " ]"'></td>
          <td class='text-center' v-text='$filters.formatDate(item.createdOn)'></td>
          <td class='text-center'>
            <i class='fa mr0' :class='{"fa-female": item.sex == Sex.FEMALE.value,"fa-male": item.sex == Sex.MALE.value}'></i>
            <span v-text='$filters.enumNameFilter(item.sex, "Sex")'></span>
          </td>
          <td class='text-center' v-text='$filters.enumNameFilter(item.type, "UserTypeEnum")'></td>
          <td class='text-center' v-text='$filters.enumNameFilter(item.status, "UserStatus")'></td>
          <td class='operate'>
            <a class='inline-block mybtn' v-authcode='"userList_grant"' href='javascript:void(0)' @click='grant(item, "role")' title='授权角色'>
              <i class='fa fa-id-badge c66c'></i>
            </a>
            <a class='inline-block mybtn' v-authcode='"userList_grant"' href='javascript:void(0)' @click='grant(item, "permission")' title='授权权限'>
              <i class='fa fa-user-secret c66c'></i>
            </a>
            <a class='inline-block mybtn' v-authcode='"userList_resetPassword"' href='javascript:void(0)' @click='setPassword(item)' title='修改密码'>
              <i class='fa fa-key c393'></i>
            </a>
            <a class='inline-block mybtn' v-authcode='"userList_delete"' href='javascript:void(0)' @click='deleteItem(item)' title='删除' v-if='canDelete(item)'>
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
    <common-modal :show-modal='showChangePasswordDialog' :options="modalOpt">
      <template #headerSlot>
        <div class="modal-header">
          <h5 class="modal-title">修改密码</h5>
          <button type="button" class="close" @click='showChangePasswordDialog = false'>
            <span class='closeicon' title="关闭">&times;</span>
          </button>
        </div>
      </template>
      <template #bodySlot>
        <div class="modal-body pr20">
          <form class='myform form-label-w100 block-form-group'>
            <div class="form-group">
              <label class="form-label req colon">新密码</label>
              <div class="form-content">
                <input type="password" class="form-control" placeholder="新密码" autofocus
                       v-model='password' v-focus/>
              </div>
              <div class='form-info'>
                <i class='fa'></i>
              </div>
            </div>
          </form>
        </div>
      </template>
      <template #footerSlot>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click='showChangePasswordDialog = false'>
            <i class='fa fa-times'></i><span>取消</span>
          </button>
          <button type="button" class="btn btn-purple" @click='changePassword()'>
            <i class='fa fa-check'></i><span>确定</span>
          </button>
        </div>
      </template>
    </common-modal>
    <common-modal :show-modal='batchImportModal' :options="importModalOpt">
      <template #headerSlot>
        <div class="modal-header">
          <h5 class="modal-title">批量导入</h5>
          <button type="button" class="close" @click='closeImportModal'>
            <span class='closeicon' title="关闭">&times;</span>
          </button>
        </div>
      </template>
      <template #bodySlot>
        <div class="modal-body pr20">
          <form class='myform infotip form-label-w60 block-form-group import-user-form'>
            <div class="form-group file-box">
              <label class="form-label">文件：</label>
              <label class="form-content relative mb0" title="点击选择文件">
                <span class="upload-btn">
                  <i class="fa fa-upload c71a"></i>
                </span>
                <span class="text">格式限制：<span class="font-weight-bold c71a">xls, xlsx</span> ；数据量限制：<span class="font-weight-bold c71a">10000</span> 条；</span>
                <input type="file" id='testFile' class="form-control" @change="fileChange($event)" :disabled="allDisabled"/>
              </label>
            </div>
            <div class="form-group" v-if="selectFile && selectFile.fileName">
              <label class="form-label">&nbsp;</label>
              <div class="form-content form-content-label">
                <i :class="getFileTypeIcon(selectFile)"></i>
                <span v-text="selectFile.fileName"></span>
                <i class="fa fa-times fr mt3 cf05 pointer" @click="resetFile"></i>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label colon">模板</label>
              <div class="form-content">
                <label class="radio_checkbox mt2" v-for="item in excelTypeList">
                  <input type='radio' name="excelType" :value="item.code" v-model="excelType"/>
                  <i></i>
                  <span v-text="item.name"></span>
                </label>
                <a href="javascript:void(0)" class="inline-block mt5" @click="downloadImportTemplate">下载模板</a>
              </div>
            </div>
<!--            <div class="form-group">-->
<!--              <label class="form-label">模板：</label>-->
<!--              <div class="form-content form-content-label">-->
<!--                <a href="javascript:void(0)" @click="downloadImportTemplate">下载模板</a>-->
<!--              </div>-->
<!--            </div>-->
          </form>
        </div>
      </template>
      <template #footerSlot>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click='closeImportModal'>
            <i class='fa fa-times'></i><span>取消</span>
          </button>
          <button type="button" class="btn btn-purple" @click='batchImport()' :disabled="allDisabled">
            <i class='fa fa-check'></i><span>确定</span>
          </button>
        </div>
      </template>
    </common-modal>
  </div>
</template>

<script>
  import commonSrv from '@/common/commonService';
  import commonModal from '@/components/common/commonModal.vue';

  export default {
    name: 'userList',
    inject: ['reload'],
    data () {
      return {
        allDisabled: true,
        searchKey: null,
        list: [],
        sexValue: '',
        sexList: [],
        nameOrderBy: {value: enumMap.OrderByType.ASC.value},
        codeOrderBy: {value: null},
        createdOnOrderBy: {value: null},
        pager: {pageNum: 1, pageSize: 10, loading: true},
        showChangePasswordDialog: false,
        code: null,
        password: null,
        YesNo: enumMap.YesNo,
        Sex: enumMap.Sex,
        modalOpt: {width: '350px'},
        importModalOpt: {width: '450px'},
        batchImportModal: false,
        fileSuffixMemo:'支持格式：.xls',
        selectFile: {},
        excelType: 1,
        excelTypeList: [{code:1,name:'xls'}, {code:2,name:'xlsx'}]
      }
    },
    methods: {
      reloadPage() {
        this.reload();
      },
      add() {
        this.$router.push({path: '/user/userEdit', query: {id: null}});
      },
      edit(entity) {
        this.$router.push({path: '/user/userEdit', query: {id: entity.id}});
      },
      search() {
        this.goPage(1);
      },
      queryList() {
        var me = this;
        me.allDisabled = true;
        me.pager.loading = true;
        this.$axios.get('/user/queryPageList', {
          name: this.searchKey,
          sex: this.sexValue,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          nameOrderBy: this.nameOrderBy.value,
          codeOrderBy: this.codeOrderBy.value,
          createdOnOrderBy: this.createdOnOrderBy.value
        }).then(function (resp) {
          if(resp.data.status == ResultStatus.OK.value) {
            me.list = resp.data.value.list;
            me.pager = commonSrv.getPagerInfo(resp.data.value, me.goPage);
          } else {
              me.pager.loading = false;
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
        this.$confirm.confirm('确定要删除用户吗？', function () {
          me.$axios.get('/user/delete', {id: entity.id}).then(function (resp) {
            if(resp.data.status == ResultStatus.OK.value) {
              me.$toaster.success('删除成功！');
              me.queryList();
            }
          });
        });
      },
      grant(entity, type) {
        if(type === 'role') {
          this.$router.push({path: '/user/userRole', query: {id: entity.id}});
        } else if(type === 'permission') {
          this.$router.push({path: '/admin/userGrantPermission', query: {id: entity.id, type: 'user'}});
        }
      },
      getEnumList() {
        var list = [];
        for (var item in enumMap.Sex) {
          list.push(enumMap.Sex[item]);
        }
        this.sexList = list;
      },
      setOrderBy(field) {
        if(this.nameOrderBy != field) {
          this.nameOrderBy.value = null;
        }
        if(this.codeOrderBy != field) {
          this.codeOrderBy.value = null;
        }
        if(this.createdOnOrderBy != field) {
          this.createdOnOrderBy.value = null;
        }
        field.value = (field.value == enumMap.OrderByType.ASC.value ? enumMap.OrderByType.DESC.value : enumMap.OrderByType.ASC.value);
        this.queryList();
      },
      setPassword(entity) {
        this.code = entity.code;
        this.password = '';
        this.showChangePasswordDialog = true;
      },
      changePassword() {
        var me = this;
        if (this.code === null || this.code === undefined
          || this.code === '' || this.code.trim() === '') {
          me.$toaster.warning('当前用户编码不能为空！');
          return;
        }
        if (this.password === null || this.password === undefined
          || this.password === '' || this.password.trim() === '') {
          me.$toaster.warning('新密码不能为空！');
          return;
        }
        me.$axios.get('/user/resetPassword', {
          code: this.code,
          password: this.password
        }).then(function (resp) {
          if (resp.data.status == ResultStatus.OK.value) {
            me.$toaster.success('修改密码成功！');
            me.showChangePasswordDialog = false;
          }
        });
      },
      showBatchImportModal() {
        this.batchImportModal = true
      },
      batchImport() {
        var me = this;
        me.allDisabled = true;
        var files = $('#testFile')[0].files;
        if(!files || files.length == 0) {
          me.$toaster.warning('请选择excel！');
          return;
        }
        var formData = new FormData();
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            formData.append('myfile', files[i]);
          }
        }
        this.$axios.postDownload('/user/batchImportUser', formData).then(function (resp) {
          me.allDisabled = false;
          // if(isDownloadError) {
            if(resp.data.byteLength == 0) {
              me.$toaster.success('上传成功！');
              me.queryList()
              me.closeImportModal()
            } else {
              Utility.downloadAfterAjax(resp.data, resp.headers);
            }
          // } else {
          //   resp = JSON.parse(Utility.readArrayBufferAsText(resp.data));
          //   if (resp.status == ResultStatus.OK.value) {
          //     me.$toaster.success(resp.value || '上传成功！');
          //   } else {
          //     me.$toaster.warning(resp.value.join("。"));
          //   }
          // }
        });
      },
      downloadImportTemplate() {
        var me = this
        if(this.allDisabled) return
        this.allDisabled = true
        this.$axios.getDownload('/user/downloadImportUserTemplate?type=' + this.excelType).then(function (resp) {
          me.allDisabled = false;
          if(resp.data.byteLength == 0) {
            me.$toaster.success('下载模板失败！');
          } else {
            Utility.downloadAfterAjax(resp.data, resp.headers);
          }
          me.allDisabled = false
        });
      },
      fileChange(e) {
        let fileInput = e.target
        if(fileInput.files && fileInput.files.length > 0) {
          this.selectFile.fileName = fileInput.files[0].name
        } else {
          this.selectFile.fileName = null
        }
      },
      getFileTypeIcon: function(item) {
        var obj = {fa: true}
        if(!item || !item.fileName) {
          return obj
        }
        commonSrv.getFileFaType(item.fileName).forEach(cls => obj[cls] = true)
        return obj
      },
      resetFile() {
        document.querySelector('form.import-user-form input[type=file]').value = ''
        this.selectFile = {}
        this.excelType = 1
      },
      closeImportModal(){
        this.batchImportModal = false
        this.resetFile()
      },
      download() {
        var me = this;
        me.allDisabled = true;
        this.$axios.getDownload('/user/download', {
          name: this.searchKey,
          sex: this.sexValue,
          nameOrderBy: this.nameOrderBy.value,
          codeOrderBy: this.codeOrderBy.value,
          createdOnOrderBy: this.createdOnOrderBy.value
        }).then(function (resp) {
          if(resp.data.byteLength == 0) {
            me.$toaster.success('导出失败！');
          } else {
            Utility.downloadAfterAjax(resp.data, resp.headers);
          }
          me.allDisabled = false;
        });
      },
      canDelete(entity) {
        if(!entity) return false
        if(entity.type === window.enumMap.UserTypeEnum.SUPER_ADMIN.value) {
          return false
        }
        var currUser = this.getUser();
        if(currUser == null) return false
        if(currUser.id == entity.id) return false
        return true
      }
    },
    computed: {
      getOrderByClass() {
        return function(field) {
          var res = {};
          if(field.value === 1) {
            res.desc = true;
          } else if (field.value === 2) {
            res.asc = true;
          }
          return res;
        }
      }
    },
    mounted: function () {
      this.search();
      this.getEnumList();
    },
    components: {commonModal}
  }
</script>
<style scoped>
  .fa-female{color:#f3c;}
  .fa-male{color:#09c;}
</style>
