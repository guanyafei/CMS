<template>
  <!-- 评论隐藏-->
  <div id="hide-option">
    <button @click.stop="viewType=true">{{ txt.title }}</button>
    <sn-confirm v-if="viewType" :title="txt.title" @close='close' @sure='submit()' txt noflag>
      确认将
      <span class="strong" v-if="row.userNickName">{{row.userNickName}}</span>
      <template v-else>当前</template>
      评论设置为{{txt.title}}吗
    </sn-confirm>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import DI from 'interface'

export default {
  name: 'ToggleComment',
  props: ['row'],
  data () {
    return {
      viewType: null
    }
  },
  computed: {
    commStatusObj () {
      return Constant.getItemByValue(Constant.COMMENT_STATUS, this.row.commStatus);
    },
    isHideAction () {
      return this.commStatusObj.key === 'normal';
    },
    txt () {
      if (this.isHideAction) {
        return  {
          title: '隐藏',
          loadingText: '正在隐藏评论，请稍候！'
        }
      } else {
        return  {
          title: '显示',
          loadingText: '正在显示评论，请稍候！'
        }
      }

    }
  },
  methods: {
    getStatusItemByKey(val) {
      return Constant.getItemByKey(Constant.COMMENT_STATUS, val);
    },
    submit() {
      let { commId, commTitleType, commTitleId } = this.row;

      this.viewType = null;
      this.$ajax({
        url: DI.commentLibrary.handleCommentVisible,
        context: this,
        loadingText: this.txt.loadingText,
        data: JSON.stringify({
          commId,
          contentTitleId: commTitleId,
          contentTitleType: commTitleType,
          isHide: this.isHideAction
        }),
        success: (res) => {
          if (res.retCode == "0") {
            setTimeout(()=>{
              this.$bus.$emit("reload");
            },1000)
          } else {
            this.viewType = true;
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          this.viewType = true;
          console.log("error");
        }
      });
    },
    close () {
     this.viewType = null;
    }
  }
}
</script>

<style scoped>
button {
  color: #0ABBFE;
}
.strong {
  color: #f88a6f
}
</style>
<style>
#hide-option{
    .sn-popup .sn-popup-modal .sn-popup-title{
        font-weight: bolder;
    }
}
</style>