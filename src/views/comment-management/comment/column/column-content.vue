<template>
  <div class="info">
    <div class="info-cover" v-if="hasImg">
      <img v-img="{src:imgUrl}" :src="imgUrl|smallImage" class="img-logo" alt="">
    </div>
    <div class="info-content" style="-webkit-box-orient: vertical;">
      <sn-td-ellipsis :str="row | fmtWords" :title="row.commContent" ref="contents" style="display:inline"></sn-td-ellipsis>
      <slot name="desc"></slot>
      <div class='comment-elements'>
        <span v-for="elem in commentElement" :key="elem.key" :class="[`elem-${elem.key}`,'elem-item']">
          {{row[`${elem.key}Num`] | fmtOverNumber}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
import { overTenThousand,findSensitive } from 'js/filters'
export default {
  name: 'name',
  props: ['row'],
  data () {
    return {
      commentElement: Constant.COMMENT_ELEMENT,
    };
  },
  computed: {
    hasImg () {
      return this.row.commImgList && this.row.commImgList.length > 0;
    },
    imgUrl () {
      return this.hasImg ? this.row.commImgList[0].imgUrl : null;
    }
  },
  filters:{
    //敏感词
    fmtWords(row){
      let len = row.commContent.length;
      let fmt = row.commContent;
      if(row.commImgList && row.commImgList.length){
        if(len > 50){
          fmt = `${fmt.substr(0,50)}...`; 
        }
      }else{
        if(len > 100){
          fmt = `${fmt.substr(0,100)}...`; 
        }
      }
      return findSensitive(fmt);
    },
    //过万
    fmtOverNumber(val){
      return overTenThousand(val);
    }
  }
}
</script>

<style scoped>
.info {
  display: flex;
  height: 100%;
  .info-cover{
    max-height: 120px;
  }
  .img-logo {
    width: 120px;
  }
  .info-content {
    display: -webkit-box;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    padding-left: 10px;
    color: #000
  }
  .comment-elements {
    display: flex;
    padding-top: 8px;
    .elem-item {
      margin-right: 16px;
      padding-left: 20px;
      font-size: 16px;
      color: #777;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      &.elem-report {
        background-image: url(../../../../assets/icon-warning-gray.png);
      }
      &.elem-reply {
        background-image: url(../../../../assets/icon-comment.png);
      }
      &.elem-like {
        background-image: url(../../../../assets/icon-like.png);
      }
    }
  }
}

</style>
