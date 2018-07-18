<template>
  <div id="editLike-option">
    <button class="mt-5" @click.stop="viewType=true">修改点赞数</button>
    <sn-confirm v-if="viewType" title="修改点赞数" @close="close" @sure="submit()" noflag>
      <div class="modal-body">
        <sn-input v-model="likeNum" inputType="number" width="250" :maxlength="8" required autoValid></sn-input>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
import { setTimeout } from 'timers';

export default {
  name: 'EditLike',
  props: ['row'],
  data() {
    return {
      likeNum: this.row.likeNum,
      viewType: null
    }
  },
  watch:{
    'viewType':function(newVal){
      if(newVal){
        this.likeNum = this.row.likeNum
      }
    }
  },
  methods: {
    close () {
      this.likeNum = '';
      this.viewType = null;
    },
    submit () {
      if (this.likeNum === '') {
        return;
      }
      let { commId, commTitleType, commTitleId } = this.row;

      this.viewType = null;
      this.$ajax({
        url: DI.commentLibrary.editLikeNum,
        context: this,
        loadingText: '正在修改点赞数，请稍候！',
        data: JSON.stringify({
          commId,
          contentTitleId: commTitleId,
          contentTitleType: commTitleType,
          likeNum: parseInt(this.likeNum,10)
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.row.likeNum = this.likeNum;
            this.$message.success('操作成功');
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
    }
  }

}
</script>

<style scoped>
button {
  color: #0ABBFE;
}
.modal-body {
  padding-bottom: 0px;
  width: 300px;
}
</style>
<style>
#editLike-option{
  .sn-popup .sn-popup-modal .sn-popup-title{
      font-weight: bolder;
  }
}
</style>
