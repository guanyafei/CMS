<template>
  <div id="idx">
    <sn-topbar title="前台展示配置" labels="APP展示配置,PC展示配置" @tab="handleTabChange"/>
    <div class="tab-menu" v-if="viewType == 'faceAChannel' || viewType == 'faceBChannel'|| viewType == 'searchBar' || viewType == 'floorTab'">
    <sn-tabs v-model="viewType" @tab-click="handleTabClick">
      <sn-tab-pane v-for="item in configMenuList" :key="item.key" :name="item.key" :label="item.name"></sn-tab-pane>
    </sn-tabs>
    </div>
    <List v-if="viewType == 'floorTab'"></List>
    <face-a-channel v-if="viewType == 'faceAChannel'"></face-a-channel>
    <face-b-channel v-if="viewType == 'faceBChannel'"></face-b-channel>
    <search-bar-display v-if="viewType == 'searchBar'"></search-bar-display>
    <desk-top-display v-if="viewType == 'pcDisplay'"></desk-top-display>
  </div>
</template>
<script>
import List from './floorTab';
import FaceAChannel from './faceAChannel';
import FaceBChannel from './faceBChannel';
import SearchBarDisplay from './searchBarDisplay';
import DeskTopDisplay from './deskTopDisplay';
import * as Constant from 'js/constant';
export default {
  components: {
    List,
    FaceAChannel,
    FaceBChannel,
    SearchBarDisplay,
    DeskTopDisplay
  },
  data() {
    return {
      viewType: 'floorTab',
      configMenuList: Constant.CONFIG_MENU_LIST,
    };
  },
  methods: {
    handleTabChange(tab) {
       if(tab == 1){
          this.viewType = 'pcDisplay';
       }else {
         this.viewType = 'floorTab';
       }
    },
    handleTabClick(event) {
      this.viewType = event.name;
    }
  }
};
</script>
<style scoped>
.tab-menu {
  padding: 10px 0px 0px 8px;
  display: flex;
  background: #fff;
  justify-content: flex-start;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>

