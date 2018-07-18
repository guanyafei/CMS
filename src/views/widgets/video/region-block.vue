<template>
  <div>
    <slot></slot>
    <sn-dialog title="地域屏蔽" :visible.sync="curDialogVisible" :width="755" :before-close="handleClose">
      <sn-tabs v-model="activeChannel" @tab-click="handleClick">
        <sn-tab-pane v-for="channel in channelList" :key="channel.key" :label="channel.name" :name="channel.key">
          <div class="safe">
            <span>安全版</span>
            <sn-radio-group v-if="channel.key === 'all'" v-model="allSelectedPolicy">
              <sn-radio v-for="policy in securityPolicies" :key="policy.key" :label="policy.value">
                {{policy.name}}
              </sn-radio>
            </sn-radio-group>
            <sn-radio-group v-else v-model="selectedChannelInfo[channel.key].securityPolicy">
              <sn-radio v-for="policy in securityPolicies" :key="policy.key" :label="policy.value">
                {{policy.name}}
              </sn-radio>
            </sn-radio-group>
          </div>

          <div class="reason">
            <span>屏蔽原因</span>
            <sn-radio-group v-if="channel.key === 'all'" v-model="allSelectedReason">
              <sn-radio v-for="reason in blockReasons" :key="reason.key" :label="reason.value">
                {{reason.name}}
              </sn-radio>
            </sn-radio-group>

            <sn-radio-group v-else v-model="selectedChannelInfo[channel.key].blockReason">
              <sn-radio v-for="reason in blockReasons" :key="reason.key" :label="reason.value">
                {{reason.name}}
              </sn-radio>
            </sn-radio-group>
          </div>

          <div class="strong">
            <span>屏蔽强度</span>
            <sn-radio-group v-if="channel.key === 'all'" v-model="allSelectedStrength">
              <sn-radio v-for="item in blockStrengthTypes" :key="item.key" :label="item.value">
                {{item.name}}
              </sn-radio>
            </sn-radio-group>

            <sn-radio-group v-else v-model="selectedChannelInfo[channel.key].blockStrength">
              <sn-radio v-for="item in blockStrengthTypes" :key="item.key" :label="item.value">
                {{item.name}}
              </sn-radio>
            </sn-radio-group>
          </div>

          <div class="subMenu">
            <span style="margin-left:5px;">快速屏蔽策略选择</span>
            <div class="subTab">
              <ul>
                <li v-for="item in quickBatchCheckArray" :key="item.key" :class="{'is-active':quickPolicySelectedList.indexOf(item.key)!==-1}">
                  <a @click="handleQuickCheckChange(item.key)" href="javascript:;">{{ item.name }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div style="margin-top:18px;">
            <span style="margin-left:5px;">精确选择地区</span>
            <div class="cityArea">
              <sn-checkbox-group v-if="channel.key==='all'" v-model="allSelectedCityList" class="city">
                <sn-checkbox style="margin:12px 32px 0px 0px;" v-for="city in cityList" :isPartCheckStatus="unionPartialList.indexOf(city.value) !== -1" :key="city.value" :label="city.value">{{city.name}}</sn-checkbox>
              </sn-checkbox-group>
              <sn-checkbox-group v-else v-model="selectedChannelInfo[channel.key].city" class="city">
                <sn-checkbox style="margin:12px 32px 0px 0px;" v-for="country in cityList" :key="country.value" :label="country.value">{{country.name}}</sn-checkbox>
              </sn-checkbox-group>
            </div>
          </div>
        </sn-tab-pane>
      </sn-tabs>
      <span slot="footer" class="dialog-footer">
        <sn-button type="primary" @click="submit" v-if="saveBtnIsShow">保 存</sn-button>
        <sn-button @click="cancel" v-if="cancelBtnIsShow">取 消</sn-button>
      </span>
    </sn-dialog>
  </div>
</template>
<script>
import cloneDeep from 'clone-deep';
import { getIntersectionArr, getUnionArr, getDiffereceArrInPrevArr } from 'utils/util';
import {
  CHANNEL_LIST,
  SECURITY_POLICIES,
  BLOCK_REASONS,
  CITY_LIST,
  MAINLAND_CITY_LIST,
  FOREIGN_COUNTRY_LIST,
  SPECIAL_AREA_CITY_LIST,
  BLOCK_STRENGTH_TYPES,
  QUICK_SELECT_CITY_POLICIES
} from 'js/constant';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    regionMap: {}
  },
  data() {
    return {
      saveBtnIsShow: true,
      cancelBtnIsShow: true,
      quickBatchCheckArray: QUICK_SELECT_CITY_POLICIES,
      mainlandCityList: MAINLAND_CITY_LIST,
      foreignCountryList: FOREIGN_COUNTRY_LIST,
      specialAreaCityList: SPECIAL_AREA_CITY_LIST,
      blockStrengthTypes: BLOCK_STRENGTH_TYPES,
      channelList: CHANNEL_LIST,
      securityPolicies: SECURITY_POLICIES,
      blockReasons: BLOCK_REASONS,
      cityList: CITY_LIST,
      activeChannel: 'all',
      unionPartialList: [],
      quickPolicySelectedList: [],
      selectedChannelInfo: this.getInitialSelectedChannelInfo()
    };
  },
  computed: {
    curDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newValue) {
        this.$emit('update:dialogVisible', newValue);
      }
    },
    allSelectedReason: {
      get() {
        let reason =
          this.channelList.reduce((preVal, channel) => {
            let reasonVal = '';
            if (channel.key == 'all') {
              return preVal;
            } else {
              reasonVal = this.selectedChannelInfo[channel.key].blockReason;
            }
            if (!preVal) {
              preVal = reasonVal;
            }
            return preVal;
          }, null) || '';
        return reason;
      },
      set(newVal) {
        this.channelList.map(channel => {
          if (channel.key !== 'all') {
            this.selectedChannelInfo[channel.key].blockReason = newVal;
          }
        });
      }
    },
    allSelectedPolicy: {
      get() {
        let policy =
          this.channelList.reduce((preVal, channel) => {
            let policyVal = '';
            if (channel.key == 'all') {
              return preVal;
            } else {
              policyVal = this.selectedChannelInfo[channel.key].securityPolicy;
            }
            if (!preVal) {
              preVal = policyVal;
            }
            return preVal;
          }, null) || '';
        return policy;
      },
      set(newVal) {
        this.channelList.map(channel => {
          if (channel.key !== 'all') {
            this.selectedChannelInfo[channel.key].securityPolicy = newVal;
          }
        });
      }
    },
    allSelectedStrength: {
      get() {
        let strength =
          this.channelList.reduce((preVal, channel) => {
            let strengthVal = '';
            if (channel.key == 'all') {
              return preVal;
            } else {
              strengthVal = this.selectedChannelInfo[channel.key].blockStrength;
            }
            if (!preVal) {
              preVal = strengthVal;
            }
            return preVal;
          }, null) || '';
        return strength;
      },
      set(newVal) {
        this.channelList.map(channel => {
          if (channel.key !== 'all') {
            this.selectedChannelInfo[channel.key].blockStrength = newVal;
          }
        });
      }
    },
    allSelectedCityList: {
      get() {
        let unionList = [];
        let city =
          this.channelList.reduce((intersection, channel) => {
            let toOperateList = [];
            if (channel.key === 'all') {
              return intersection;
            } else {
              toOperateList = this.selectedChannelInfo[channel.key].city;
            }
            if (!intersection) {
              intersection = toOperateList;
            }
            unionList = getUnionArr(unionList, toOperateList);
            intersection = getIntersectionArr(intersection, toOperateList);
            return intersection;
          }, null) || [];
        this.unionPartialList = getDiffereceArrInPrevArr(unionList, city);
        return city;
      },
      set(newArr) {
        let removeArr = getDiffereceArrInPrevArr(this.allSelectedCityList, newArr);
        let addArr = getDiffereceArrInPrevArr(newArr, this.allSelectedCityList);
        this.channelList.map(channel => {
          if (channel.key !== 'all') {
            let channelCity = this.selectedChannelInfo[channel.key].city;
            channelCity = getDiffereceArrInPrevArr(channelCity, removeArr);
            this.selectedChannelInfo[channel.key].city = [...new Set([...addArr, ...channelCity])];
          }
        });
      }
    }
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        this.selectedChannelInfo = this.getInitialSelectedChannelInfo(this.regionMap);
        console.log(this.selectedChannelInfo);
      }
    }
  },
  mounted() {
    this.getDefaultData();
  },
  methods: {
    hiddenBtn() {
      this.saveBtnIsShow = false;
      this.cancelBtnIsShow = false;
    },
    handleClose() {
      this.activeChannel = 'all';
      this.dialogVisible = false;
      this.quickPolicySelectedList = [];
    },
    getInitialSelectedChannelInfo(data) {
      let channelList = CHANNEL_LIST;
      let selectedInfo = {};

      channelList.reduce((obj, channel) => {
        if (channel.key !== 'all') {
          if (data) {
            obj[channel.key] = data[channel.key];
          } else {
            obj[channel.key] = {
              securityPolicy: '',
              blockReason: '',
              blockStrength: '',
              city: []
            };
          }
        }
        return obj;
      }, selectedInfo);

      return cloneDeep(selectedInfo);
    },
    handleClick(event) {
      this.activeChannel = event.name;
    },
    handleQuickCheckChange(key) {
      let selectedCityList =
        this.activeChannel === 'all' ? [...this.allSelectedCityList] : this.selectedChannelInfo[this.activeChannel].city;

      let { quickPolicySelectedList } = this;
      let thisPolicySelectedIndex = quickPolicySelectedList.indexOf(key);
      let isThisPolicySelected = thisPolicySelectedIndex !== -1;

      switch (key) {
        case 'mainlandCheck':
          if (isThisPolicySelected) {
            quickPolicySelectedList.splice(thisPolicySelectedIndex, 1);
            this.mainlandCityList.map(city => {
              let cityInSelectedListIndex = selectedCityList.indexOf(city.value);
              if (cityInSelectedListIndex !== -1) {
                selectedCityList.splice(cityInSelectedListIndex, 1);
              }
            });
          } else {
            quickPolicySelectedList.push(key);
            this.mainlandCityList.map(city => {
              if (selectedCityList.indexOf(city.value) === -1) {
                selectedCityList.push(city.value);
              }
            });
          }

          break;
        case 'spicalCheck':
          if (isThisPolicySelected) {
            quickPolicySelectedList.splice(thisPolicySelectedIndex, 1);
            this.specialAreaCityList.map(city => {
              let cityInSelectedListIndex = selectedCityList.indexOf(city.value);
              if (cityInSelectedListIndex !== -1) {
                selectedCityList.splice(cityInSelectedListIndex, 1);
              }
            });
          } else {
            quickPolicySelectedList.push(key);
            this.specialAreaCityList.map(city => {
              if (selectedCityList.indexOf(city.value) === -1) {
                selectedCityList.push(city.value);
              }
            });
          }
          break;
        case 'overseaCheck':
          if (isThisPolicySelected) {
            quickPolicySelectedList.splice(thisPolicySelectedIndex, 1);
            this.foreignCountryList.map(city => {
              let cityInSelectedListIndex = selectedCityList.indexOf(city.value);
              if (cityInSelectedListIndex !== -1) {
                selectedCityList.splice(cityInSelectedListIndex, 1);
              }
            });
          } else {
            quickPolicySelectedList.push(key);
            this.foreignCountryList.map(country => {
              if (selectedCityList.indexOf(country.value) === -1) {
                selectedCityList.push(country.value);
              }
            });
          }
          break;
        case 'allCheck':
          this.quickBatchCheckArray.map(item => {
            if (item.key != 'allUncheck' && item.key != key) {
              let index = quickPolicySelectedList.indexOf(item.key);
              if (index == -1) {
                quickPolicySelectedList.push(item.key);
              }
            }
          });
          this.cityList.map(city => {
            if (selectedCityList.indexOf(city.value) === -1) {
              selectedCityList.push(city.value);
            }
          });
          break;
        case 'allUncheck':
          this.quickBatchCheckArray.map(item => {
            let index = quickPolicySelectedList.indexOf(item.key);
            quickPolicySelectedList.splice(index, 1);
          });
          selectedCityList = [];
          break;
        default:
          break;
      }

      if (this.activeChannel === 'all') {
        this.allSelectedCityList = [...selectedCityList];
      } else {
        this.selectedChannelInfo[this.activeChannel].city = selectedCityList;
      }
    },
    getDefaultData() {
      this.activeChannel = 'all';
      this.allSelectedPolicy = '10';
      this.allSelectedReason = 1;
      this.allSelectedStrength = 1;
      this.allSelectedCityList = [];
      this.quickPolicySelectedList = [];
    },
    cancel() {
      this.getDefaultData();
      this.curDialogVisible = false;
    },
    submit() {
      this.$emit('update:regionMap', cloneDeep(this.selectedChannelInfo));
      this.curDialogVisible = false;
    }
  }
};
</script>

<style scoped>
.sn-tabs .sn-tabs__item {
  padding: 8px 7px;
}
.safe,
.reason,
.strong {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  margin-left: 10px;
}

.safe span {
  margin-right: 34px;
}
.reason span,
.strong span {
  margin-right: 20px;
}
.subMenu {
  margin: 10px 0px;
  .subTab > ul {
    width: 100%;
    margin: 20px 0px 0px 3px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    li {
      margin-right: 20px;
      &.is-active {
        a {
          color: #09bbfe;
        }
      }
    }
    a {
      color: #000;
    }
    .isActived {
      color: #09bbfe;
    }
  }
}
.cityArea {
  margin: 10px 0px 0px 6px;
  .city {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .checkbox + .checkbox {
      margin-left: 0px;
    }
  }
}

.dialog-footer {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 40px;
  }
}
</style>
