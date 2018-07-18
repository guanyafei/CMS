<template>
  <div id='idx'>
    <keep-alive>
      <comment-import ref='commentImport' v-if="componentElm==='import'"></comment-import>
    </keep-alive>
    <add v-if="componentElm==='add'" ref="add" @close="componentElm='import'" @ok="refresh"></add>
    <sn-toptip></sn-toptip>
  </div>
</template>

<script>
import add from 'widgets/importTask/'
import commentImport from './import'
export default {
  name: 'CommentIndex',
  components: {
    commentImport,
    add
  },
  data() {
    return {
      componentElm: "import"
    }
  },
  methods: {
    refresh() {
      this.componentElm = "import";
      this.$nextTick(()=>{
        this.$refs.commentImport.queryList();
      })
    }
  }
}
</script>

<style scoped>

</style>
