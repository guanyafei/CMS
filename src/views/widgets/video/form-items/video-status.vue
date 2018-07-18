<template>
  <sn-form-item label="状态">
    <sn-radio-group v-model="ruleForm.status">
      <sn-radio
        v-for="videoStatus in videoStatusTypes"
        v-if="videoStatus.key!='untreated'"
        :key="videoStatus.key"
        :label="videoStatus.value"
      >
        {{videoStatus.name}}
      </sn-radio>
    </sn-radio-group>
  </sn-form-item>
</template>
<script>
import { VIDEO_STATUS } from 'js/constant';

export default {
  componentName: 'VideoStatus',
  props: ['ruleForm'],
  data() {
    return {
      videoStatusTypes: VIDEO_STATUS
    };
  }
};
</script>
