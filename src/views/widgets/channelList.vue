<template>
  <div class="shelf">
    <table width="100%">
      <tbody>
        <tr
          v-for="(typeItem, index) in channelTypeList"
          v-if="filterListByChannelType(typeItem)!==0"
          :key='index'
          class="channel-item">
          <td width="16%">
            <div class="label cell">{{typeItem.name}}</div>
          </td>
          <td width="84%">
            <div class="list cell">
              <template>
                <div
                  v-for="(channel,index) in channelAllList"
                  :key='index'
                  v-if="typeItem.value==channel.channelType">
                  <sn-checkbox
                    v-model="innerChannelSelectedIds"
                    :label="channel.channelId"
                    :disabled="findInDisabled(channel.channelId)"
                    @change="handleChange">
                    {{channel.channelName}}
                  </sn-checkbox>
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
export default {
  name: 'ChannelList',
  componentName: 'ChannelList',
  props: ['channelAllList', 'channelSelectedIds', 'channelDisabledIds', 'type'],
  data() {
    return {
      channelTypeList: Constant.INFO_CHANNEL_TYPE,
      innerChannelSelectedIds: [...(this.channelSelectedIds || [])]
    };
  },
  methods: {
    findInDisabled(id) {
      return this.channelDisabledIds.indexOf(id) !== -1;
    },
    handleChange() {
      this.$emit('changeId', this.innerChannelSelectedIds);
    },
    filterListByChannelType(item) {
      if (item.disableds && item.disableds.indexOf(this.type) !== -1) {
        return 0;
      }
      let count = 0;
      this.channelAllList.map(channel => {
        if (item.value == channel.channelType) {
          ++count;
        }
      });

      return count;
    }
  }
};
</script>

<style scoped>
.shelf {
  margin-top: 20px;
}
.channel-item {
  td:first-of-type {
    vertical-align: top;
  }
  .cell {
    margin: 5px 0;
  }
  .label {
    margin-right: 10px;
    text-align: right;
  }
  .checkbox {
    margin-left: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

