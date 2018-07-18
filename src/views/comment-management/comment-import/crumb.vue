<template>
  <div>
    <sn-search-box>
      <sn-search-item :children="[{
          type: 'button',
          text: '添加灌水任务',
          buttonType: 'outline',
          gutter: 10,
          triggerEvent: add,
          isRight: true
        }]">
      </sn-search-item>
    </sn-search-box>
  </div>
</template>

<script>
export default {
  name: 'Crumb',
  methods: {
    add () {
      this.$parent
          .$parent
          .componentElm = 'add';
    }
  }

}
</script>

<style scoped>

</style>
