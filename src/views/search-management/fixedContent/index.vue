<template>
  <div id="idx">
     <sn-topbar title="固定内容"/>
    <List v-if="viewType == 'list'" ref="list" @change-view="change"></List>
    <sn-tips></sn-tips>
  </div>
</template>

<script>
import List from './list';
  export default {
    components:{
      List
    },
    data(){
      return{
         viewType:'list'
      }
    },
    methods:{
      change(viewtype){
         this.viewType = viewtype;
      }
    }
  }
</script>
<style scoped>

</style>

