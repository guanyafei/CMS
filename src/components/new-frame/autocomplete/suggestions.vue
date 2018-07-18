<template>
  <transition name="fade">
    <ul v-show="showPopper"
      :class="[{'is-loading': $parent.loading}, 'dropdown-list']"
      v-infinite-scroll="$parent.infiniteScrollLoad"
      infinite-scroll-disabled="$parent.scrollLoading"
      infinite-scroll-distance="10"
    >
      <li v-if="$parent.loading">正在加载中。。。</li>
      <template v-else>
        <template v-if="$parent.isSupportSuggestionsNew">
          <slot v-if="$parent.value"></slot>
          <li v-else>暂无数据</li>
        </template>
        <template v-else>
          <slot v-if="$parent.suggestions.length > 0"></slot>
          <li v-else>暂无数据</li>
        </template>
      </template>
      <li v-if="$parent.scrollLoading" :class="[{'is-finished':$parent.isFinished}]">
        {{$parent.isFinished ? '数据已加载完毕.':'加载中。。。'}}
      </li>
    </ul>
  </transition>
</template>
<script>
  export default {
    name: 'AutocompleteSuggestions',
    componentName: 'AutocompleteSuggestions',
    props: ['activated'],
    data () {
      return {
        showPopper: false
      }
    },
    created() {
      this.$on('visible', (val) => {
        this.showPopper = val;
      });
    }
  }
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .2s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
.is-finished {
  text-align: center;
}
</style>

