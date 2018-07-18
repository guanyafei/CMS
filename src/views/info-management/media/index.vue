<template>
  <div id="idx">
    <router-view class="view"></router-view>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>

export default {
  name: 'MediaIndex',
  data () {
    return {
      componentElm: "Home",
      item: null
    }
  }
}
</script>

