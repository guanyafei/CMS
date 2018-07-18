<template>
  <div>
    <button @click.stop="viewType=true">删除</button>
    <sn-confirm v-if="viewType" title="删除内容" @close='close' @sure='submit()' txt noflag>
      确认将删除当前内容？
    </sn-confirm>
  </div>
</template>

<script>
import * as Constant from "js/constant";
import DI from "interface";

export default {
  name: "ToggleComment",
  props: ["row"],
  data() {
    return {
      viewType: null
    };
  },
  methods: {
    submit() {
      let { channelId, contentId, contentType } = this.row;
      let params = {
        contentList: [
          {
            channelId,
            contentId,
            contentType
          }
        ],
        contentDelFlag: true
      };

      this.viewType = null;
      this.$ajax({
        url: DI.recommend.delContent,
        context: this,
        loadingText: "正在删除，请稍候！",
        data: JSON.stringify(params),
        success: res => {
          if (res.retCode == "0") {
            this.$bus.$emit("reload");
          } else {
            this.viewType = true;
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    close() {
      this.viewType = null;
    }
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}
.strong {
  color: #f88a6f;
}
</style>
