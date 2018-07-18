<template>
  <div class="list">
    <sn-table :data='list' ref='table'>
      <sn-table-column label='资讯类型' prop='labelType' width='10%' sloted>
        <template slot-scope='row'>
          {{getInfoItem(row.labelType).name}}
        </template>
      </sn-table-column>
      <sn-table-column label='分类标签' prop='categoryLabels' width='83%' align='left' sloted>
        <template slot-scope='row'>
          {{joinLabels(row.categoryLabels)}}
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width='' sloted>
        <template slot-scope='row'>
          <div class="y-center">
            <button @click.stop='edit(row, $event)'>编辑</button>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm v-show='showModal' title='编辑标签' confirmButtonText="保存" @close="close" noflag>
      <div class="modal-body">
        <div class="is-line input-group">
          <div class="is-line">
            <span class="label">添加标签</span>
            <sn-input
              ref="labelInput"
              v-model="labelInput"
              width="260"
              placeholder="请输入标签名称"
              :maxlength="4"
              :minlength="2">
            </sn-input>
          </div>
          <sn-button type='primary' v-if='addBtnStatus==="able"' @click='addLabel'>确认添加</sn-button>
          <sn-button type='info' disabled v-else-if='addBtnStatus==="disabled"'>确认添加</sn-button>
        </div>
        <sn-table :data='selectedLabels' theme="dialog" :height="300">
          <sn-table-column label='序号' prop='$index' width='20%' sloted>
            <template slot-scope='row'>
              {{getPageIndex(row.$index)}}
            </template>
          </sn-table-column>
          <sn-table-column label='名称' prop='labelName' width='50%' align='left'>
          </sn-table-column>
          <sn-table-column label='操作' width='' sloted>
            <template slot-scope='label'>
              <div class="btn-group">
                <button @click.stop='del(label)'>删除</button>
                <div class="">
                  <button :class="{'is-disabled':label.$index==0}" @click.stop='move(label, 1, label.$index)'>上移</button>
                  <button :class="{'is-disabled':(label.$index+1)==selectedLabels.length}" @click.stop='move(label, 2, label.$index)'>下移</button>
                </div>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
      </div>
      <div slot='btn-group'>
        <div class="sn-popup-btns">
          <sn-button size="mini" type="primary"  @click="close">关闭</sn-button>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import _ from 'lodash'
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  name: 'LabelType',

  componentName: 'LabelType',

  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      showModal: false,
      selectItem: null,
      addBtnStatus: 'disabled',
      labelInput: "",
      selectedLabels: [],
    }
  },

  watch: {
    labelInput(newVal, oldVal) {
      if (newVal.trim() === '') {
        this.addBtnStatus = 'disabled';
      } else {
        this.$nextTick(() => {
          let isVaid = this.$refs.labelInput.check();
          if (isVaid) {
            this.addBtnStatus = 'able';
          } else {
            this.addBtnStatus = 'disabled';
          }
        })
      }
    }
  },

  methods: {
    getPageIndex(index) {
      index++;

      if (index < 10) {
        return `0${index}`
      }
      return index;
    },

    getInfoItem(val) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, val)
    },

    joinLabels(labels = []) {
      return (labels||[]).reduce((perVal, label, index) => {
        if (index === 0) {
          return perVal += label.labelName;
        } else {
          return `${perVal}、${label.labelName}`;
        }
      }, "")
    },

    edit(row) {
      this.selectItem = row;
      this.selectedLabels = _.cloneDeep(row.categoryLabels);
      this.showModal = true;
    },

    del(label) {
      this.$ajax({
        url: DI.label.delLabel,
        context: this,
        type: 'get',
        loadingText: '正在删除标签',
        data: {
          labelId: label.labelId,
          labelType: label.labelType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.queryLabelListByType();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    move(label, opType, index) {
      let tmp = null,
        moveIndex = null,
        selectedLabels = [...this.selectedLabels];

      if ((opType == 1 && index == 0) || (opType == 2 && index == selectedLabels.length - 1)) return;

      this.$ajax({
        url: DI.label.moveLabel,
        context: this,
        loadingText: '正在移动标签',
        type: 'get',
        data: {
          labelId: label.labelId,
          labelType: label.labelType,
          movingState: opType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.queryLabelListByType();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });

    },

    addLabel() {
      this.$ajax({
        url: DI.label.addLabel,
        context: this,
        type: 'get',
        loadingText: '正在添加标签',
        data: {
          labelName: this.labelInput,
          labelType: this.selectItem.labelType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.labelInput = '';
            this.$refs.labelInput.setMsg('');

            this.queryLabelListByType();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    queryLabelListByType(){
      this.$ajax({
        url: DI.label.labelList,
        context: this,
        type: 'get',
        loadingText: '正在查询标签列表',
        data: {
          labelType: this.selectItem.labelType
        },
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.selectedLabels = data.categoryLabelList || [];
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    close() {
      this.labelInput = '';
      this.$refs.labelInput.setMsg('');
      this.$set(this.selectItem, 'categoryLabels', this.selectedLabels);
      this.showModal = false;
    }
  }

}
</script>

<style scoped>
.modal-body {
  width: 540px;
}

.input-group {
  padding-bottom: 20px;
  justify-content: space-between;
  .label {
    margin-right: 20px;
  }
}

button {
  color: #0ABBFE;
}

.btn-group {
  height: 30px;
}

.is-disabled {
  color: #bfcbd9;
  cursor: not-allowed;
}
</style>
