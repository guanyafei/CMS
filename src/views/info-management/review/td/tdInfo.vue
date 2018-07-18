<template>
  <div class="info">
    <div class="info-img">
      <div :class='["info-type", infoTypeItem.key]' v-show="infoTypeItem.key!=null">
        {{ infoTypeItem.name }}
      </div>
      <img :src="itemCover|smallImage" class="img-logo">
      <div class="sub-title">
        <span> {{ `ID: ${row.contentId}` }} </span>
      </div>
    </div>
    <div :class="['info-title', {'is-highlight':infoStatusKey === 'published'}]" @click.stop="showPreview(row)">
      {{ row.contentTitle }}
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import { getInfoPreviewUrl } from 'src/utils/envUrl';

export default {
  name: 'TdInfo',
  props: ['row'],
  data() {
    return {
      inforElements: Constant.INFOR_ELEMENT,
      showDetail: false
    };
  },
  computed: {
    infoTypeItem() {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, this.row.contentType);
    },
    infoStatusKey() {
      return Constant.getItemByValue(Constant.INFOR_STATUS, this.row.status).key;
    },
    itemCover() {
      return (this.row.contentCover || '').split(';')[0];
    }
  },
  methods: {
    showPreview(row) {
      if (this.infoStatusKey !== 'published') {
        this.$message.warning('该资讯不支持预览！');
        return;
      }
      const url = getInfoPreviewUrl({
        type: this.infoTypeItem.key,
        newsId: row.contentId
      });
      this.$bus.openPreview(url);
    },
    mouseover() {
      this.showDetail = true;
    },
    mouseleave() {
      this.showDetail = false;
    }
  }
};
</script>

<style scoped>
.info {
  display: flex;
  height: 80px;
  .info-type {
    &.imgtext {
      background-color: #09bbfe;
    }
    &.video {
      background-color: #f88a6f;
    }
    &.picture {
      background-color: #8074c8;
    }
    &.daily {
      background-color: #a9d86e;
    }
    position: absolute;
    background-color: #f86f6f;
    color: #ffffff;
    padding: 3px 10px 3px 6px;
    top: 2px;
    border-radius: 0 10px 10px 0;
  }
  .info-img {
    display: inline-block;
    width: 120px;
    position: relative;
    .img-logo {
      width: 120px;
      height: 80px;
    }
    .sub-title {
      background-color: rgba(0, 0, 0, 0.3);
      color: rgb(255, 255, 255);
      text-align: center;
      position: absolute;
      top: 59px;
      width: 100%;
      height: 21px;
      line-height: 21px;
    }
  }
  .info-title {
    align-self: center;
    padding-left: 10px;
    cursor: pointer;
    &.is-highlight {
      color: #1684c2;
    }
  }
}
</style>

