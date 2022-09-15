import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import headerAndMenu from "@/components/layout/headerAndMenu.vue";
import Index from '@/views/index.vue'
import Login from '@/views/admin/user/login.vue'
import V401 from '@/views/sys/401.vue'
import V405 from '@/views/sys/405.vue'
import {userStore} from "@/stores/user.js"
import {breadcrumbStore} from "@/stores/breadcrumb.js"
import {permissionStore} from "@/stores/permission.js"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: headerAndMenu,
      children:[{
          path: "",
          name: 'home',
          component: Index,
          meta: {
            breadcurmbName: '首页',
          },
      }]
    },
    {
      path: "/login",
      name: 'login',
      component: Login,
      meta: {
        breadcurmbName: '用户登录',
      }
    },
    {
      path: '/user',
      name: 'user',
      component: headerAndMenu,
      children: [
        {
          path: 'userList',
          name: 'userList',
          component: () => import('@/views/admin/user/userList.vue'),
          meta:{
            breadcurmbName: '用户列表',
            // pageCode: 'userList'
          }
        },
        {
          path: 'userEdit',
          name: 'userEdit',
          component: () => import('@/views/admin/user/userEdit.vue'),
          meta:{
            breadcurmbName: '用户详情',
            // pageCode: 'userEdit'
          }
        },
        {
          path: 'userRole',
          name: 'userRole',
          component: () => import('@/views/admin/user/userRole.vue'),
          meta:{
            breadcurmbName: '用户角色',
            // pageCode: 'userRole'
          }
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: headerAndMenu,
      children: [
        {
          path: 'menuList',
          name: 'menuList',
          component: () => import('@/views/admin/menuList.vue'),
          meta:{
            breadcurmbName: '菜单列表',
            // pageCode: 'menuList'
          }
        },
        {
          path: 'menuEdit',
          name: 'menuEdit',
          component: () => import('@/views/admin/menuEdit.vue'),
          meta:{
            breadcurmbName: '菜单详情',
            // pageCode: 'menuEdit'
          }
        },
        {
          path: 'functionList',
          name: 'functionList',
          component: () => import('@/views/admin/functionList.vue'),
          meta:{
            breadcurmbName: '功能列表',
            pageCode: 'functionList'
          }
        },
        {
          path: 'functionEdit',
          name: 'functionEdit',
          component: () => import('@/views/admin/functionEdit.vue'),
          meta:{
            breadcurmbName: '功能详情',
            pageCode: 'functionEdit'
          }
        },
        {
          path: 'permissionList',
          name: 'permissionList',
          component: () => import('@/views/admin/permissionList.vue'),
          meta:{
            breadcurmbName: '权限列表',
            pageCode: 'permissionList'
          }
        },
        {
          path: 'permissionEdit',
          name: 'permissionEdit',
          component: () => import('@/views/admin/permissionEdit.vue'),
          meta:{
            breadcurmbName: '权限详情',
            pageCode: 'permissionEdit'
          }
        },
        {
          path: 'roleList',
          name: 'roleList',
          component: () => import('@/views/admin/roleList.vue'),
          meta:{
            breadcurmbName: '角色列表',
            pageCode: 'roleList'
          }
        },
        {
          path: 'roleEdit',
          name: 'roleEdit',
          component: () => import('@/views/admin/roleEdit.vue'),
          meta:{
            breadcurmbName: '角色详情',
            pageCode: 'roleEdit'
          }
        },
        {
          path: 'configInfoList',
          name: 'configInfoList',
          component: () => import('@/views/admin/configInfoList.vue'),
          meta:{
            breadcurmbName: '配置列表',
            pageCode: 'configInfoList'
          }
        },
        {
          path: 'configInfoEdit',
          name: 'configInfoEdit',
          component: () => import('@/views/admin/configInfoEdit.vue'),
          meta:{
            breadcurmbName: '配置详情',
            pageCode: 'configInfoEdit'
          }
        },
        {
          path: 'roleGrantPermission',
          name: 'roleGrantPermission',
          component: () => import('@/views/admin/grantPermission.vue'),
          meta:{
            breadcurmbName: '角色授权',
            pageCode: 'grantPermission'
          }
        },
        {
          path: 'userGrantPermission',
          name: 'userGrantPermission',
          component: () => import('@/views/admin/grantPermission.vue'),
          meta:{
            breadcurmbName: '用户授权',
            pageCode: 'grantPermission'
          }
        },
        {
          path: 'operateLogList',
          name: 'operateLogList',
          component: () => import('@/views/admin/operateLogList.vue'),
          meta:{
            breadcurmbName: '日志列表',
            pageCode: 'operateLogList'
          }
        },
        {
          path: 'operateLogEdit',
          name: 'operateLogEdit',
          component: () => import('@/views/admin/operateLogEdit.vue'),
          meta:{
            breadcurmbName: '日志详情',
            pageCode: 'operateLogEdit'
          }
        },
        {
          path: 'fileList',
          name: 'fileList',
          component: () => import('@/views/admin/fileList.vue'),
          meta:{
            breadcurmbName: '文件管理',
            // pageCode: 'operateLogEdit'
          }
        },
        {
          path: 'fileEdit',
          name: 'fileEdit',
          component: () => import('@/views/admin/fileEdit.vue'),
          meta:{
            breadcurmbName: '文件详情',
            // pageCode: 'operateLogEdit'
          }
        },
        {
          path: 'fileSliceList',
          name: 'fileSliceList',
          component: () => import('@/views/admin/fileSliceList.vue'),
          meta:{
            breadcurmbName: '文件分片',
            // pageCode: 'operateLogEdit'
          }
        },
      ]
    },
    {
      path:'/sys',
      component: headerAndMenu,
      children: [
        {
          path: '401',
          name: '401',
          component: V401,
          meta: {
            breadcurmbName: '未授权'
          }
        },
      ]
    },
    {
      path: '/kvConfig',
      name: 'kv',
      component: headerAndMenu,
      children: [
        {
          path: 'list',
          name: 'kvList',
          component: () => import('@/views/tools/kvConfig/kvList.vue'),
          meta:{
            breadcurmbName: '键值对列表',
            // pageCode: 'menuList'
          }
        },
        {
          path: 'edit',
          name: 'kvEdit',
          component: () => import('@/views/tools/kvConfig/kvEdit.vue'),
          meta:{
            breadcurmbName: '键值对编辑',
            // pageCode: 'menuList'
          }
        }
      ]
    },
    {
      path: '/upgradeLog',
      name: 'upgradeLog',
      component: headerAndMenu,
      children: [
        {
          path: 'list',
          name: 'upgradeLogList',
          component: () => import('@/views/tools/upgradeLog/upgradeLogList.vue'),
          meta:{
            breadcurmbName: '升级日志列表',
            pageCode: 'upgradeLog'
          }
        },
        {
          path: 'edit',
          name: 'upgradeLogEdit',
          component: () => import('@/views/tools/upgradeLog/upgradeLogEdit.vue'),
          meta:{
            breadcurmbName: '升级日志编辑',
            pageCode: 'upgradeLogEdit'
          }
        },
        {
          path: 'preview',
          name: 'upgradeLogPreview',
          component: () => import('@/views/tools/upgradeLog/upgradeLogPreview.vue'),
          meta:{
            breadcurmbName: '升级日志预览',
            pageCode: 'menuList'
          }
        }
      ]
    },
    {
      path: '/switch',
      name: 'switch',
      component: headerAndMenu,
      children: [
        {
          path: 'list',
          name: 'switchList',
          component: () => import('@/views/tools/switch/list.vue'),
          meta:{
            breadcurmbName: '开关控制室',
            pageCode: 'switchList'
          }
        }
      ]
    },
    {
      path: '/redis',
      component: headerAndMenu,
      children: [
        {
          path: '',
          name: 'redisOpt',
          component: () => import('@/views/tools/redis/redis.vue'),
          meta:{
            breadcurmbName: 'redis操作',
            pageCode: 'redisOpt'
          }
        }
      ]
    },
    {
      path:'/test',
      component: headerAndMenu,
      children: [
        {
          path: '',
          name: 'test',
          component: () => import('@/views/other/test.vue'),
          meta: {
            breadcurmbName: '测试'
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)',
      component: headerAndMenu,
      children: [
        {
          path: '',
          name: '404',
          component: V405,
          meta: {
            breadcurmbName: '无法访问'
          }
        }
      ]
    }
  ]
})

router.beforeEach(function (to, from, next) {
  if (to.matched.length === 0) {
    next({name: '404'});
    return;
  }
  var user = userStore().user;
  var permissionList = permissionStore().permission.list;
  if((!user || !user.id) && to && to.path != '/login') {
    next({
      path: 'login',
      query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
    });
    return;
  }
  // 判断有没有页面权限
  if(to.meta.pageCode) {
    if(!(permissionList && permissionList.some(item => item == to.meta.pageCode))) {
      // router.app.$toaster.error('没有权限！');
      // next(false);
      next({name: '401'});
      return;
    }
  }
  // 不跳转传false
  // next(false);
  // 处理面包屑
  if(to.path != from.path) {
    var breadcrumb = breadcrumbStore().breadcurmb.breadcurmbList;
    var breadcrumbIgnoreUrl = ['/', '/login'];
    var i = 0;
    for(; i < breadcrumb.length; i++) {
      if(breadcrumb[i].path == to.path) {
        breadcrumb.splice(i, breadcrumb.length - i);
        break;
      }
    }
    if(!breadcrumbIgnoreUrl.includes(to.path)) {
      breadcrumb.push({name: to.meta.breadcurmbName || to.name, path:to.path,
        query:to.query,params:to.params});
    }
    breadcrumbStore().setBreadcurmbList(breadcrumb)
  }

  next();
});

export default router
