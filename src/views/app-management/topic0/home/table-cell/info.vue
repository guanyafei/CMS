<template>
  <div class="adv-info">
    <div class="img-wrap">
      <img alt="" class="adv-img" :src="row.channelLogo" />
      <p class="id-info">ID：{{row.channelId}}</p>
    </div>
    <span class="adv-title">
      <p>{{row.channelName}}</p>
      <p class="adv-des" :title="row.channelDes">{{row.channelDes}}</p>
    </span>
  </div>
</template>
<script>
export default {
  name: 'CellInfo',
  componentName: 'CellInfo',
  props: ['row']
}
</script>
<style scoped>
.adv-info {
  display: flex;
  align-items: center;
  .img-wrap {
    position: relative;
    .id-info {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 0 12px;
      width: 100%;
      height: 22px;
      line-height: 22px;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
    }
    .adv-img {
      display: inline-block;
      width: 179px;
      height: 100px;
    }
  }
  .adv-title {
    padding-left: 8px;
    color: #333333;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    .adv-des {
      /*height: 66px;*/
      overflow: hidden;
      text-overflow: ellipsis;
      display: box;
      display: -webkit-box;
      box-orient: vertical;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      line-clamp: 3;
      -webkit-line-clamp: 3;
      letter-spacing: 3px;
      line-height: 1.8;
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>

