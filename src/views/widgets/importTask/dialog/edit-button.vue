<template>
  <i class="edit-icon" @click="doEdit"></i>
</template>

<script>
export default {
  name: 'name',
  props: ['edit'],
  methods: {
    doEdit () {
      this.$emit('update:edit', true);
    }
  }

}
</script>

<style scoped>
.edit-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-top: 2px;
  margin-left: 5px;
  cursor: pointer;
  background: url(../../../../assets/icon-edit-small.png) no-repeat;
}
</style>
