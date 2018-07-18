<template>
  <div class="edit-item__wrapper">
    <div class="edit-item__header">
      <div class="edit-item__title" v-if="title">
        {{ title }}
      </div>
      <div class="edit-item__line-area">
        <div class="edit-item_line"></div>
      </div>
    </div>
    <div :class="['edit-item__container']">
      <div class="edit-item__content" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditItem',
  componentName: 'EditItem',
  props: {
    title: String,
    labelWidth: {
      type: Number,
      default: 20
    }
  },
  computed: {
    contentStyle() {
      return {
        marginLeft: `${this.labelWidth}px`
      };
    }
  }
};
</script>

<style scoped>
.edit-item__wrapper {
  .edit-item__header,
  .edit-item__container {
    display: flex;
  }
  .edit-item__title {
    min-width: 70px;
    margin-right: 10px;
    font-weight: bold;
  }
  .edit-item__line-area {
    flex: 1 100%;
    padding: 10px 0;
    margin-bottom: 20px;
    .edit-item_line {
      border-top: 1px solid #eee;
    }
  }
  .edit-item__container {
    .edit-item__content {
      flex: 1 1 auto;
    }
  }
}
</style>

