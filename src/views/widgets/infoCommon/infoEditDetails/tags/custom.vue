<template>
  <div>
    <sn-form-item label="自定义标签">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="labelName"
        :fetchSuggestions="querySearchAsync"
        :addSuggestionsOptions="addCustomTagAsync"
        :isSupportSuggestionsNew="true"
        historyKey="customTag"
        placeholder="请添加自定义标签"
        @select="selectItem"
        :width="510"
      >
        <template slot-scope="{item}" slot="history">
          {{item.labelName}}
        </template>
      </sn-autocomplete>
    </sn-form-item>
    <selected-tags
      v-if="!ruleForm.hideTag"
      class="custom-tags-container"
      :tags="ruleForm.customLabels"
      @close="handleClose"
      :label="''"
      labelWidth="108px"
    ></selected-tags>
  </div>
</template>

<script>
import DI from 'interface'
import emitter from 'mixins/emitter'
import * as Constant from 'js/constant'
import { setHistoryArrData } from 'utils/util';
import SelectedTags from './match-tags/selected-tags';

export default {
  mixins: [emitter],
  name: 'CustomTags',
  componentName: 'CustomTags',
  components: {
    SelectedTags
  },
  props: ['ruleForm'],
  data () {
    return {
      searchInput: ''
    }
  },
  methods: {
    handleClose (index) {
      this.ruleForm.customLabels.splice(index, 1);
    },
    querySearchAsync (options, cb) {
      this.$ajax({
        url: DI.infoLibrary.fetchCustomLabelsByTitle,
        context: this,
        loadingText: "false",
        data: JSON.stringify({
          name: options.queryString
        }),
        success: (res) => {
          const labelList = (res.data || {}).labelList || [];
          cb(labelList);
        },
        error: () => {
          console.log("error");
        }
      });
    },
    addCustomTagAsync (queryString, cb) {
      this.$ajax({
        url: DI.infoLibrary.addCustomLabel,
        context: this,
        loadingText: "false",
        data: JSON.stringify({
          labelName: queryString
        }),
        success: (res) => {
          const data = res.data || {};
          cb(data);
        },
        error: () => {
          console.log("error");
        }
      });
    },
    selectItem (item) {
      setHistoryArrData('customTag', [item], 'labelId');
      if (this.ruleForm.hideTag) {
        this.ruleForm.customLabels = [item];
        return;
      }
      let { customLabels } = this.ruleForm;
      for (let i = 0; i < customLabels.length; i++) {
        const labelItem = customLabels[i];
        if (item.labelId == labelItem.labelId) {
          return;
        }
      };
      customLabels.push(item);
      this.ruleForm.customLabels = [...customLabels];
    }
  },
};
</script>
<style scoped>
.custom-tags-container {
  margin-bottom: 0;
  min-height: 0;
}
</style>



