<style scoped></style>
<template>
  <div id="idx">
    <Vdisplay v-if="viewType == 'vdisplay'" @change-view="change" :channelId="id" />
    <ExReview v-if="viewType == 'exreview'" :channelId="id" />
  </div>
</template>
<script>
import Vdisplay from './vdisplay'; //视频频道展示管理
import ExReview from '../../common/exempt_review'; //通用免审页面
export default {
  data () {
    return {
      viewType: 'vdisplay',
      id: ''
    }
  },
  components: {
    Vdisplay,
    ExReview
  },
  methods: {
    change (value) {
      console.log('index-change')
      this.viewType = value;
    }
  }
}
</script>
