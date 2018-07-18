<template>
  <div class="td">
    <ul>
      <li v-for="(channel, index) in data" v-if="index < 3" :key="index" class="pt-5">
        {{channel.subjectName}}：
        <span class="text-gray">{{getItemStatus(channel.status).name}}</span>
      </li>
      <li class="show-more text-orange pt-5" v-if="flag" @click="toggle" v-clickoutside="handleClose">查看更多</li>
    </ul>
    <div class="dropdown-list" v-show="showMore">
      <ul>
        <li v-for="(channel, index) in data" :key="index" class="text-gray pt-5">
          {{channel.subjectName}}： {{getItemStatus(channel.status).name}}
          <span v-show="getItemStatus(channel.status).key==='refused'" class="text-orange">
            ({{channel.rejectReason}})
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
import Clickoutside from 'directives/clickoutside';
export default {
  name: 'td-channel',
  directives: { Clickoutside },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      showMore: false
    }
  },

  computed: {
    flag () {
      let refuseStatusIndex = (this.data || []).findIndex(item => {
        let statusKey = Constant.getItemByValue(Constant.APPROVE_STATUS, item.status).key;
        return statusKey === "refused";
      });
      return (this.data || []).length > 3 || refuseStatusIndex > -1;
    }
  },

  methods: {
    getItemStatus (val) {
      return Constant.getItemByValue(Constant.APPROVE_STATUS, val);
    },

    toggle () {
      this.showMore = !this.showMore;
    },

    handleClose () {
      this.showMore = false;
    }
  }
}
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
