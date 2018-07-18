<template>
  <div class="atmosphereTimes">
    <sn-form-item label="开始时间">
      <sn-timer
        v-model="startTimeOwn"
        timeFormat="HH:mm:ss"
        showTimepicker="true"
        radius="4"
        ref="startTime"
        placeholder="起始时间"
        :minDate="formatDateToStr()"
        :maxDate="endTime"
        width="160"
        :disabled="disabled"
      ></sn-timer>
    </sn-form-item>
    <sn-form-item label="结束时间" label-width="90px">
      <sn-timer
        v-model="endTimeOwn"
        timeFormat="HH:mm:ss"
        showTimepicker="true"
        ref="endTime"
        radius="4"
        placeholder="结束时间"
        :minDate="startTime"
        width="160"
        :disabled="disabled"
      ></sn-timer>
    </sn-form-item>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import { formatDate } from 'utils/util';

export default {
  name: 'TimeRange',
  props: ['startTime', 'endTime', 'disabled'],

  data () {
    return {

    }
  },
  computed: {
    startTimeOwn: {
      get() {
        return this.startTime;
      },
      set(value) {
        this.$emit('update:startTime', value);
      }
    },
    endTimeOwn: {
      get() {
        return this.endTime;
      },
      set(value) {
        this.$emit('update:endTime', value);
      }
    }
  },
  methods: {
    formatDateToStr() {
      return formatDate(new Date(), 'yyyy-MM-dd hh:mm');
    }
  }
};
</script>

<style scoped>
.atmosphereTimes {
  display: flex;
  margin-left:-38px;
}
</style>

