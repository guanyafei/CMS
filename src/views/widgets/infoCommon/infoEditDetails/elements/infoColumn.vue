<template>
  <sn-form-item label="加入栏目" label-width="110px">
    <section class="select-area" v-if="defaultSubjectList.length">
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
  name: 'infoColumn',
  componentName: 'InfoColumn',
  props: ['ruleForm'],
  data() {
    return {};
  },
  computed: {
    defaultSubjectList() {
      return this.ruleForm.columnAllList;
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
  margin-top: 8px;
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