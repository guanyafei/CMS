<template>
  <div class="daily-column__item">
    <div class="column-row">
      <div class="column-row__left">
        <sn-button type="default" :plain="true" :disabled="upDisabled" @click="move(columnIndex, 1)">上移</sn-button>
        <sn-button type="default" :plain="true" :disabled="downDisabled" @click="move(columnIndex, -1)">下移</sn-button>
        <sn-button type="warning" :gutter="15" :plain="true" :disabled="delDisabled" @click="handleDelDailyColum">删除栏目</sn-button>
      </div>
      <div class="column-row__right">
        <sn-form-item
          label="栏目标题"
          class="column-row__title"
          ref="titleItem"
          :prop="'dailyColumnList.' + columnIndex + '.title'"
          :rules="titleRules"
        >
          <sn-input
            ref="titleInput"
            v-model="data.title"
            :placeholder="'请输入栏目标题，2-8个字'"
            width="640"
            :totalWords="8"
            showWord
          ></sn-input>
        </sn-form-item>
        <daily-editor
          v-model="data.content.ctt"
          :columnIndex="columnIndex"
          :ruleForm="ruleForm"
          ref="dailyEditor"
        >
        </daily-editor>
      </div>
    </div>
    <sn-confirm v-if="viewType === 'confirm'" title="删除栏目" type="del" @sure="doDelDailyColum" @close="close" txt noflag>
    </sn-confirm>
  </div>
</template>

<script>
import InfoTitle from './infoTitle';
import DailyEditor from './dailyColumnEditor';

export default {
  name: 'DailyColumn',
  componentName: 'DailyColumn',
  components: {
    InfoTitle,
    DailyEditor
  },
  props: ['data', 'columnIndex', 'deleteItemFunc', 'ruleForm', 'len'],
  data () {
    return {
      viewType: null,
      titleRules: [{
        required: true,
        message: `请输入栏目标题`,
        trigger: 'blur'
      }, {
        min: 2,
        max: 8,
        message: '长度在 2 到 8 个字符',
        trigger: 'blur'
      }]
    }
  },
  computed: {
    delDisabled () {
      return this.len === 1;
    },
    upDisabled () {
      return this.columnIndex === 0;
    },
    downDisabled () {
      return this.columnIndex === this.len - 1;
    }
  },
  methods: {
    // 删除日报栏目
    handleDelDailyColum () {
      this.viewType = 'confirm';
    },
    doDelDailyColum () {
      this.viewType = null;
      this.deleteItemFunc(this.columnIndex);
    },
    vaildTitleTrigger (errMsg) {
      this.$refs.titleItem.vaildTrigger(false, errMsg);
    },
    vaildEditorTrigger (errMsg) {
      this.$refs.dailyEditor.$refs.dailyEditorItem.vaildTrigger(false, errMsg);
    },
    move (index, type) {
      let replaceIndex = type === 1 ? index - 1 : index + 1;
      let dailyColumnList = this.ruleForm.dailyColumnList;
      let ableMove = false;

      if (type === 1 && !this.upDisabled) {
        ableMove = true;
      }
      if (type === -1 && !this.downDisabled) {
        ableMove = true;
      }
      if (ableMove) {
        //this.$bus.$emit('move-column', index, replaceIndex)
        let replaceArr = dailyColumnList.splice(replaceIndex, 1, dailyColumnList[index]);
        dailyColumnList.splice(index, 1, replaceArr[0]);
        this.ruleForm.dailyColumnList = [...dailyColumnList];
      }
    },
    close () {
      this.viewType = null;
    }
  }
}
</script>

<style scoped>
.daily-column__item {
  &:not(:nth-last-child(1)) {
    border-bottom: 1px solid #eee;
  }
  &:not(:first-of-type) {
    margin-top: 30px;
  }
}

.column-row {
  display: flex;
  .column-row__left {
    flex: 0 0 120px;
    button {
      margin-bottom: 10px;
    }
  }
  .column-row__right {
    flex: 0 0 900px;
  }
}
</style>
