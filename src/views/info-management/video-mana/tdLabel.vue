<template>
  <div class="td">
    <span v-for="(label, index) in data" v-if="index < 3" :key="index" class="pt-5 text-gray">{{label.labelName}}{{index == 2 ? '':'/'}}</span>
    <div class="show-more text-orange pt-5" v-if="flag" @click="toggle" v-clickoutside="handleClose">查看更多</div>
    <div class="dropdown-list" v-show="showMore">
      <ul>
        <li v-for="(labels, index) in data" :key="index" class="text-gray pt-5">
          {{labels.labelName}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import Clickoutside from 'directives/clickoutside';
export default {
  name: 'td-label',

  directives: { Clickoutside },

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      showMore: false
    };
  },

  computed: {
    flag() {
      return (this.data || []).length > 3;
    }
  },
  methods: {
    toggle() {
      this.showMore = !this.showMore;
    },

    handleClose() {
      this.showMore = false;
    }
  }
};
</script>

<style scoped>
.text-gray {
  color: #666666;
}

.show-more {
  cursor: pointer;
}

.text-orange {
  color: #f88a6f;
}

.td {
  .dropdown-list {
    z-index: 99999;
    position: absolute;
    left: 50%;
    width: 212px;
    padding: 10px 0px 10px 20px;
    margin-top: 5px;
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    text-align: left;
    background-color: #fff;
    transform: translate(-50%);
  }
}
</style>
