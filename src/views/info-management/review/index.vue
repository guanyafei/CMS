<template>
  <div id="idx">
    <a v-if="channelId" href="javascript:;">
      <span slot="subtitle" class="goback" @click="goback">←</span>
    </a>
    <sn-topbar class="title" :title="title"></sn-topbar>
    <keep-alive>
      <review ref='review' v-if="componentElm==='Review'" :selectedChannelId="channelId"></review>
    </keep-alive>
    <edit v-if="componentElm==='Edit'" :data="item" ref="edit"></edit>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import _ from 'lodash'
import DI from 'interface'
import Edit from './edit'
import Review from './review'
export default {
  name: 'InfoReviewIndex',

  props: {
    channelId: {
      type: String,
      default: ''
    },
    subjectType: { // 主题管理跳转
      type: String,
      default: ''
    }
  },

  components: {
    Edit,
    Review
  },

  data: () => ({
    componentElm: "Review",
    title: "资讯审核",
    item: null
  }),

  mounted() {
    this.$bus.$on('gotoEdit', (row) => {
      this.componentElm = "Edit";
      this.item = _.cloneDeep(row);
    })

    this.$bus.$on('goBack', (option) => {
      this.componentElm = "Review";

      //option={ refresh: true }重新加载页面
      this.$nextTick(() => {
        document.body.scrollTop = this.$bus.bodyScrollTop;
        let $review = this.$refs.review;

        if (option && option.data) {
          this.item = {
            ...this.item,
            ...option.data
          };

          $review.$set($review.list, this.item.$index, this.item);
        }

        if (option && option.refresh) {
          this.$refs.review.queryList();
        }
      })
    })
  },
  methods: {
    goback() {
      this.$parent.viewType = 'list';
      this.$parent.themeIndex = parseInt(this.subjectType) - 1;
      this.$parent.subjectType = parseInt(this.subjectType);
    }
  }
}
</script>

<style scoped>
  .goback {
    font-size: 20px;
    color: #000;
    position: absolute;
    top: 32px;
    left: 25px;
  }
  .title {
    padding-left: 26px;
  }
</style>
