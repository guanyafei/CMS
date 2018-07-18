<template>
  <div class="is-line">
    <sn-form-item label="开始时间" prop="startTime" :rules="startTimeRules">
      <sn-timer
        v-model="ruleForm.startTime"
        timeFormat="HH:mm:ss"
        showTimepicker="true"
        radius="4"
        ref="startTime"
        placeholder="起始时间"
        :minDate="new Date()"
        :maxDate="ruleForm.endTime"
        :disabled="disabled"
      ></sn-timer>
    </sn-form-item>
    <sn-form-item label="结束时间" prop="endTime" :rules="endTimeRules">
      <sn-timer
        v-model="ruleForm.endTime"
        timeFormat="HH:mm:ss"
        showTimepicker="true"
        ref="endTime"
        radius="4"
        placeholder="结束时间"
        :minDate="ruleForm.startTime"
        :disabled="disabled"
      ></sn-timer>
    </sn-form-item>
  </div>
</template>

<script>
export default {
  name: 'TimeRange',
  props: ['ruleForm'],
  data() {
    return {};
  },
  computed: {
    startTimeRules() {
      return [
        {
          required: true,
          message: `请设置起始时间`,
          trigger: 'blur'
        }
      ];
    },
    endTimeRules() {
      return [
        {
          required: true,
          message: `请设置结束时间`,
          trigger: 'blur'
        }
      ];
    }
  },

  methods: {}
};
</script>
<style scoped>
.is-line {
  justify-content: space-between;
}
</style>


