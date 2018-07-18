<template>
  <div id="idx">
    <router-view class="view" :key="key"></router-view>
  </div>
</template>
<script>
export default {
  name: 'PublishManagement',
  computed: {
    key() {
      return this.$route.path;
    }
  }
}
</script>
