<template>
  <sn-form-item label="视频分类" class="mb-10" prop="videoSelectedLabels" :rules="videoClassifyRules">
    <sn-checkbox-group v-model="ruleForm.videoSelectedLabels">
      <sn-checkbox
        class="radio-group__item"
        v-for="item in ruleForm.videoLabelList"
        :key="item.value"
        :label="''+item.value"
        :disabled="item.cName=='自制节目' && ruleForm.isEdit"
      >
        {{item.cName}}
      </sn-checkbox>
    </sn-checkbox-group>
  </sn-form-item>
</template>

<script>
export default {
  name: 'videoTypeLabel',
  props: ['ruleForm'],
  computed: {
    videoClassifyRules() {
      return [
        {
          required: true,
          message: '请选择视频分类',
          type: 'array',
          trigger: 'change'
        }
      ];
    }
  }
};
</script>
<style scoped>
  .mb-10 {
    margin-bottom: 17px;
  }
</style>

