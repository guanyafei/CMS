<template>
  <sn-form-item labelWidth="0">
    <div class="shelf">
      <table width="100%">
        <tbody>
          <tr class="channel-item">
            <td width="50px">
              <div class="label cell">{{ getChannelTypeItemByKey('channel').name }}</div>
            </td>
            <td>
              <div class="list cell">
                <div v-for="channel in (ruleForm.channelAllList||[])" :key="channel.channelId">
                  <sn-checkbox v-model="innerChannelSelectedIds" :label="channel.channelId" @change="handleCheckedChange(channel)">
                    {{ channel.channelName }}
                  </sn-checkbox>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </sn-form-item>
</template>
<script>
import * as Constant from 'js/constant';
export default {
  name: 'InfoChannel',
  componentName: 'InfoChannel',
  props: ['ruleForm'],
  data() {
    return {
      channelTypeList: Constant.INFO_CHANNEL_TYPE
    };
  },
  computed: {
    innerChannelSelectedIds: {
      get() {
        const { channelSet } = this.ruleForm;
        let seletedIds = channelSet.reduce((container, item) => {
          container.push(item);
          return container;
        }, []);

        return seletedIds;
      },
      set(newId) {}
    }
  },
  methods: {
    getChannelTypeItemByKey(key) {
      return Constant.getItemByKey(this.channelTypeList, key);
    },
    handleCheckedChange(item) {
      const id = item.channelId;
      const index = this.innerChannelSelectedIds.indexOf(id);
      let { channelSet } = this.ruleForm;

      if (index > -1) {
        for (let i = 0, len = channelSet.length; i < len; i++) {
          const itemId = channelSet[i];
          if (id == itemId) {
            channelSet.splice(i, 1);
            this.ruleForm.channelSet = channelSet;
            break;
          }
        }
      } else {
        this.ruleForm.channelSet.push(item.channelId);
      }
    }
  }
};
</script>
<style scoped>
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
    width: 600px;
  }
}
</style>
