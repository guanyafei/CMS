<template>
  <div class="info">
    <div class="info-img">
      <div :class='["info-type", getItemArticle(row.newsType).key]' v-show="getItemArticle(row.newsType).key!=null">
        {{getItemArticle(row.newsType).name}}
      </div>
      <img :src="row.cover|smallImage" class="img-logo" alt="">
      <div class="info-id">
        <span> {{`ID: ${row.newsId}`}} </span>
      </div>
    </div>
    <div class="info-title">
      <div class="name" @click.stop="showPreview(row)">{{row.title}}</div>
      <div class="text-gray">
        <div>{{`曝光：${row.exposeNum||0}`}}</div>
        <div class="info-elements" @mouseover="mouseover" @mouseleave="mouseleave">
          <span v-for="elem in inforElements"
            :key="elem.key"
            :class="[`elem-${elem.key}`,'elem-item', 'ellipsis']">
            {{row[`${elem.key}Num`]||0}}
          </span>
        </div>
        <ul class="dropdown-list" v-show="showDetail">
          <li v-for="elem in inforElements"
            :key="elem.key">
            {{elem.name}}：
            <span class="text-default">{{row[`${elem.key}Num`]||0}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
import Clickoutside from 'directives/clickoutside';

export default {
  name: 'TdInfo',
  props: ['row'],
  data() {
    return {
      inforElements: Constant.INFOR_ELEMENT,
      showDetail: false,
    }
  },
  methods: {
    getItemArticle(val) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, val);
    },
    showPreview(row) {
      let infoTypeItem = this.getItemArticle(row.newsType);
      if (infoTypeItem.key === 'daily') {
        return;
      }
      let prefix = 'http://m.ty.pptv.com'
      const href = location.href;
      if (href.indexOf('dev') >= 0 || href.indexOf('sit') >= 0) {
        prefix = 'http://mspssit.suning.com'
      }
      let url = `${prefix}/?pageType=${infoTypeItem.previewName}&contentId=${row.newsId}`;
      this.$bus.openPreview(url);
    },
    mouseover() {
      this.showDetail = true;
    },
    mouseleave() {
      this.showDetail = false;
    },
  },
};
</script>

<style scoped>
.text-gray {
  color: #777;
}
.text-default {
  color: #333;
}
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
    padding-left: 10px;
    color: #000;
    .name {
      cursor: pointer;
    }
  }
}
.info-elements {
  display: flex;
  padding-top: 8px;
  .elem-item {
    max-width: 50px;
    padding-left: 20px;
    margin-right: 10px;
    background-size: 14px 14px;
    background-repeat: no-repeat;
    &.elem-read {
      background-image: url(../../../../assets/icon-reader.png);
    }
    &.elem-like {
      background-image: url(../../../../assets/icon-like.png);
    }
    &.elem-collect {
      background-image: url(../../../../assets/icon-collect.png);
    }
    &.elem-comment {
      background-image: url(../../../../assets/icon-comment.png);
    }
  }
}
.dropdown-list {
  position: absolute;
  left: 125px;
  right: 18px;
  box-shadow: 2px 2px 3px 1px rgba(0,0,0,0.2);
  background: #fff;
  z-index: 99999;
  border-radius: 4px;
  padding: 10px 0px 10px 20px;
  margin-top: 5px;
  width: 150px;
  text-align: left;
  li {
    line-height: 20px;
  }
}
</style>

