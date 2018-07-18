<template>
  <sn-form-item label="加入专题" label-width="110px">
    <sn-autocomplete
      v-model="searchInput"
      valueKey="subjectName"
      :fetchSuggestions="querySearchAsync"
      placeholder="请输入专题名称查询"
      @select="selectItem"
      :width="360"
    >
    <template slot-scope="{item}">
      {{item['subjectName']}}
      <span class="selected-text">{{getSuggestItemSelectedText(item)}}</span>
    </template>
    </sn-autocomplete>
    <section class="select-area">
      <sn-checkbox
        v-for="subject in defaultSubjectList"
        :key="subject.infoFlowId"
        v-model="innerSubjectSelectedIds"
        :label="subject.infoFlowId"
        :disabled="findInDisabled(subject.infoFlowId)"
        @change="handleCheckedChange(subject)">
          {{ subject.subjectName }}
      </sn-checkbox>
    </section>
  </sn-form-item>
</template>

<script>
import DI from 'interface';
import emitter from 'mixins/emitter';
import * as Constant from 'js/constant';

export default {
  mixins: [emitter],
  name: 'InfoTopic',
  componentName: 'InfoTopic',
  props: ['ruleForm'],
  data() {
    return {
      searchInput: ''
    };
  },
  computed: {
    defaultSubjectList() {
      return this.ruleForm.topicAllList;
    },
    innerSubjectSelectedIds: {
      get() {
        const { channelSet } = this.ruleForm;
        let seletedIds = channelSet.reduce((container, item) => {
          container.push(item);
          return container;
        }, []);

        return seletedIds;
      },
      set(newId) {}
    }
  },
  methods: {
    findInDisabled(id) {
      return this.ruleForm.channelDisabledIds && this.ruleForm.channelDisabledIds.indexOf(id) !== -1;
    },
    getSuggestItemSelectedText(item) {
      const { channelSet } = this.ruleForm;

      for (let i = 0; i < channelSet.length; i++) {
        const infoFlowId = channelSet[i];
        if (item.infoFlowId == infoFlowId) {
          return '(已选)';
        }
      }
      return '';
    },
    querySearchAsync(options, cb) {
      this.$ajax({
        url: this.ruleForm.libraryType == 1 ? DI.publish.querySpecial: DI.publish.queryTopicListByName,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          specialName: options.queryString
        }),
        success: res => {
          const labelList = (res.data || {}).subjectList || [];
          cb(labelList);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectItem(item) {
      if (this.ruleForm.channelSet.indexOf(item.infoFlowId) === -1) {
        this.ruleForm.channelSet.push(item.infoFlowId);
      }

      let flag = true;
      this.defaultSubjectList.filter(subject => {
        if (subject.infoFlowId == item.infoFlowId) flag = false;
      });
      if (flag) this.ruleForm.topicAllList.push(item);
    },
    handleCheckedChange(item) {
      const id = item.infoFlowId;
      const index = this.innerSubjectSelectedIds.indexOf(id);
      let { channelSet } = this.ruleForm;

      if (index > -1) {
        for (let i = 0, len = channelSet.length; i < len; i++) {
          const itemId = channelSet[i];
          if (id == itemId) {
            channelSet.splice(i, 1);
            this.ruleForm.channelSet = channelSet;
            break;
          }
        }
      } else {
        this.ruleForm.channelSet.push(item.infoFlowId);
      }
    }
  }
};
</script>
<style scoped>
.custom-tags-container {
  margin-bottom: 0;
  min-height: 0;
}
.select-area {
  margin-top: 5px;
  .checkbox {
    margin: 0 15px 10px 0;
    + .checkbox {
      margin-left: 0;
    }
  }
}
.selected-text {
  color: #09bbfe;
}
</style>


