<template>
  <div :class='{"bread":true,"hidebread":!showBread}'>
    <ul>
      <li>
        <a class='w100p h100p inline-block pl8 homebread' href='javascript:void(0)' title='首页'>
          <i class='fa fa-home mr0' @click='$root.goHome()'></i></a>
      </li>
      <li class='bread-item' v-for='item in breadcrumbList' :title='item.text'>
        <span class='w100p h100p inline-block' :title='item.name'>
          <a class='w100p h100p inline-block' href='javascript:void(0)' v-text='item.name'
             @click='goPage(item)'></a>
        </span>
      </li>
    </ul>
    <button type="button" class="btn btn-outline-purple btn-sm fr mr5 mt4 pt3" @click='$root.goBack()'
       v-if='showGoBack' title='返回'>
      <i class='fa fa-reply mr5'></i>返回
    </button>
  </div>
</template>

<script>
import {breadcrumbStore} from "@/stores/breadcrumb.js"
  export default {
    name: 'breadcrumb',
    data () {
      return {
        breadcrumbList: []
      }
    },
    mounted: function () {
      this.setBreadcrumb();
    },
    methods: {
      goPage(item) {
        if (item == null) {
          console.log('返回首页');
        } else {
          this.$router.push({path: item.path, query: item.query, params: item.params});
        }
      },
      setBreadcrumb: function () {
        this.breadcrumbList = breadcrumbStore().breadcurmb.breadcurmbList;
      }
    },
    computed: {
      showGoBack: function() {
        var breadcrumb = breadcrumbStore().breadcurmb.breadcurmbList
        return breadcrumb && breadcrumb.length > 0;
      },
      showBread() {
        return this.getShowBreadcrumb();
      }
    }
  }
</script>

<style scoped>
  .fa-home {
    color: #93c;
    transition:0.1s;
    font-size:1.2rem;
  }
  .homebread:hover .fa-home{transform:scale(1.3);}
  .bread.hidebread{height:0;}
</style>
