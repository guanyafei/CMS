<template>
  <i :class="'sn-icon-' + name"></i>
</template>

<script>
/**
 * @author 17050542 2017/8/30
 */
export default {
  name: 'SnIcon',

  props: {
    name: String
  }
};
</script>



