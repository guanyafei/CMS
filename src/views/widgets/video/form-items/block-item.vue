<template>
 <sn-form-item label="地域屏蔽" class="regionBlock">
    <div class="content-tip">请设置地域屏蔽数据</div>
    <region-block :dialogVisible.sync="dialogVisible" :regionMap.sync="regionMap">
      <sn-button type="primary" @click="openBlockCitySet">查看详情</sn-button>
    </region-block>
  </sn-form-item>
</template>
<script>
import RegionBlock from 'widgets/video/region-block';
import { CHANNEL_LIST } from 'js/constant';

export default {
  props: ['ruleForm'],
  components: {
    RegionBlock
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    regionMap: {
      get() {
        let { terminal } = this.ruleForm;
        return CHANNEL_LIST.reduce((obj, channel) => {
          if (channel.key !== 'all') {
            let temp = terminal[channel.key] || {};
            obj[channel.key] = {
              city: temp.forbidden ? temp.forbidden.split(',') : [],
              blockReason: temp.forbiddenReason || 1,
              blockStrength: temp.forbidden == temp.forceForbidden ? 1 : 2,
              securityPolicy: temp.ottSafe || '10'
            };
          }
          return obj;
        }, {});
      },
      set(newMap) {
        this.ruleForm.terminal = CHANNEL_LIST.reduce((obj, channel) => {
          if (channel.key !== 'all') {
            let selectedMapItem = newMap[channel.key];
            let cityStr = selectedMapItem.city.join(',') || ' ';
            obj[channel.key] = {
              cataId: '',
              forbidden: cityStr,
              forbiddenReason: selectedMapItem.blockReason,
              forceForbidden: selectedMapItem.blockStrength == 1 ? cityStr : '',
              ottSafe: selectedMapItem.securityPolicy,
              status: 1
            };
          }
          return obj;
        }, {});
        console.log(this.ruleForm.terminal);
        if (this.ruleForm.terminal.androidpad && this.ruleForm.terminal.androidpad.forbidden) {
          $('.regionBlock .form-item__error').hide();
        }
      }
    }
  },
  methods: {
    getSubmitData() {},
    openBlockCitySet() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped>
  .content-tip {
    margin: 5px 0;
    height: 20px;
    padding-left: 22px;
    line-height: 18px;
    background-image: url(../../../../assets/icon-warning.png);
    background-repeat: no-repeat;
    background-position-y: 1px;
  }
</style>
