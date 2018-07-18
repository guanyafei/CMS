<template>
    <div :style="tdStyle" v-html="str ? str : '暂无'" :title="title || str">

    </div>
</template>

<script>
export default {
  name: 'TdEllipsis',
  componentName: 'TdEllipsis',
  props:{
    str:{
      type:String
    },
    title:{
      type:String
    }
  },
  computed: {
    tdStyle () {
      return {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        overflow: 'hidden',
        lineHeight: '16px'
      }
    }
  }
};
</script>

<style scoped>
.multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>

