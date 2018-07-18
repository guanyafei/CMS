<template>
  <div class="info">
    <sn-form-item label="活动名称" prop="resource">
      <sn-input v-model="activityNameOwn" :maxlength="20" placeholder="请输入活动名称" width="410" :disabled="disabled"></sn-input>
    </sn-form-item>
  </div>
</template>

<script>
import * as Constant from 'js/constant'

export default {
  name: 'ActName',
  props: ['activityName','disabled'],
  data () {
    return {

    }
  },
  computed: {
    activityNameOwn: {
      get () {
        return this.activityName;
      },
      set (value) {
        this.$emit('update:activityName', value);
      }
    }
  },
  methods: {

  },
};
</script>

<style scoped>
.info{
  margin-left:-38px;
}
</style>

