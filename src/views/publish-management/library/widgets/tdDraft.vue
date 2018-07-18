<template>
  <div class="info">
    <div class="info-img">
      <div :class='["info-type", infoTypeItem.key]' v-show="infoTypeItem.key!=null">
        {{infoTypeItem.name}}
      </div>
      <img :src="itemCover|smallImage" class="img-logo" alt="">
      <div class="info-id">
        <span> {{`ID: ${row.draftId}`}} </span>
      </div>
    </div>
    <div class="info-title">
      <div>{{row.title}}</div>
    </div>
  </div>
</template>
<script>
import * as Constant from 'js/constant';
export default {
  props: ['row'],
  data () {
    return {

    }
  },
  computed: {
    infoTypeItem () {
      return Constant.getItemByValue(Constant.PUBLISH_ARTICLE_TYPE, this.row.newsType);
    },
    itemCover () {
      return (this.row.cover).split(';')[0];
    }
  }
}

</script>
<style scoped>
.info {
  display: flex;
  height: 80px;
  .info-type {
    &.imgtext {
      background-color: #09BBFE;
    }
    &.video {
      background-color: #F88A6F;
    }
    &.picture {
      background-color: #8074C8;
    }
    &.daily {
      background-color: #A9D86E;
    }
    &.shortV {
      background-color: #F86F6F;
    }
    position: absolute;
    background-color: #09BBFE;
    color: #FFFFFF;
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
    .info-id {
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 175px;
    padding-left: 10px;
    margin-top:30px;
    color: #000;
  }
}
</style>

