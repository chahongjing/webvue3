import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'jquery';
import '../static/js/jquery-ui.js';
import './assets/main.css'

import {userStore} from "@/stores/user.js"
import {breadcrumbStore} from "@/stores/breadcrumb.js"
import {permissionStore} from "@/stores/permission.js"
import {leftMenuStore} from "@/stores/leftMenu.js"
import axios from '@/common/axios.js';
import filters from '@/common/filters'
import directives from '@/common/directives';
import confirm from '@/common/confirm';
import cstModal from '@/common/customModal';
import toaster from '@/common/toaster';
import piniaPersist from 'pinia-plugin-persist'
import pagination from '@/components/common/pagination.vue';
import tableListLoading from '@/components/common/tableListLoading.vue';
import dateTimePicker from '@/components/common/dateTimePicker.vue';
import ulTree from '@/components/common/ulTree.vue';
import processList from '@/components/common/processList.vue';
import select2 from '@/components/common/select2.vue';
// import dateTimeRangePicker from '@/components/common/dateTimeRangePicker.vue';
// import dateTimeRangePicker2 from '@/components/common/dateTimeRangePicker2.vue';
// import videoPlayer from '@/components/common/videoPlayer.vue';
import audioPlayer from '@/components/common/audioPlayer.vue';
// import mediaPlayer from '@/components/common/mediaPlayer.vue';
// import fileUploadAndPreview from '@/components/common/fileUploadAndPreview.vue';

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)

app.config.globalProperties.$axios = axios
app.config.globalProperties.$filters = filters
app.config.globalProperties.$confirm = confirm
app.config.globalProperties.$cstModal = cstModal
app.config.globalProperties.$toaster = toaster

Object.keys(directives).forEach(k => app.directive(k, directives[k]));
app.component('pagination', pagination);
app.component('tableListLoading', tableListLoading);
app.component('dateTimePicker', dateTimePicker);
app.component('ulTree', ulTree);
app.component('processList', processList);
app.component('select2', select2);
// app.component('videoPlayer', videoPlayer);
app.component('audioPlayer', audioPlayer);
// app.component('mediaPlayer', mediaPlayer);
// app.component('fileUploadAndPreview', fileUploadAndPreview);
// app.component('dateTimeRangePicker', dateTimeRangePicker);
// app.component('dateTimeRangePicker2', dateTimeRangePicker2);

app.mixin({
    data: function() {
        return {
            showLoadingBox: false,
            loadingText: '',
            resRoot: '/static/'
        }
    },
    methods: {
        test(){return Math.random()},
        getUser() {
            return userStore().user;
        },
        setUser(user) {
            userStore().setUser(user)
        },
        clearUser() {
            userStore().setUser({})
        },
        getMenuList() {
            return leftMenuStore().leftMenu.menuList
        },
        setMenuList(menuList) {
            leftMenuStore().setLeftMenu(menuList)
        },
        clearMenuList() {
            leftMenuStore().setLeftMenu([])
        },
        getShowMenu() {
            return leftMenuStore().leftMenu.showMenu
        },
        setShowMenu(showMenu) {
            leftMenuStore().setShowMenu(showMenu)
        },
        getBreadcrumb() {
            return breadcrumbStore().breadcurmb.breadcurmbList
        },
        setBreadcrumb(breadcurmbList) {
            breadcrumbStore().setBreadcurmbList(breadcurmbList)
        },
        setBreadcrumbName(name) {
            var list = this.getBreadcrumb()
            if(!list || list.length == 0) return;
            list[list.length - 1].name = name;
        },
        clearBreadrumb() {
            breadcrumbStore().setBreadcurmbList([])
        },
        getShowBreadcrumb() {
            return breadcrumbStore().breadcurmb.showBreadcrumb
        },
        setShowBreadcrumb(showBreadcrumb) {
            breadcrumbStore().setShowBreadcrumb(showBreadcrumb)
        },
        getPermissionList() {
            return permissionStore().permission.list
        },
        setPermissionList(permissionList) {
            permissionStore().setPermission(permissionList)
        },
        clearPermissionList() {
            permissionStore().setPermission([])
        },
        showLoading: function(loadingText) {
            this.loadingText = loadingText;
            this.showLoadingBox = true;
        },
        hideLoading: function() {
            this.showLoadingBox = false;
            this.loadingText = '';
        },
        goHome() {
            this.clearBreadrumb();
            var menuList = this.getMenuList() || [];
            for(var i = 0; i < menuList.length; i++) {
                for(var j = 0; j < menuList[i].children.length; j++) {
                    menuList[i].children[j].isSelected = false;
                    menuList[i].children[j].checked = false;
                }
            }
            this.setMenuList(menuList);
            this.$router.push({path: '/'});
        },
        goBack: function () {
            var breadcrumb = this.getBreadcrumb();
            if (breadcrumb.length <= 1) {
                this.goHome();
                return;
            }
            var item = breadcrumb[breadcrumb.length - 2];
            if (item != null) {
                this.$router.push({path: item.path, query: item.query, params: item.params});
            } else {
                this.goHome();
            }
        }
    }
})

app.mount('#app')
