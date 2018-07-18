<template>
  <div>
    <div class="crumb">
      <sn-button type="outline" @click="add">添加</sn-button>
    </div>
    <div class="list">
      <sn-table :data='list' ref='table'>
        <sn-table-column label='栏目序号' prop='$index' width='10%' sloted>
          <template slot-scope='row'>
            {{getPageIndex(row.$index)}}
          </template>
        </sn-table-column>
        <sn-table-column label='栏目ID' prop='labelId' width='10%'>
        </sn-table-column>
        <sn-table-column label='内容栏目' prop='labelName' align='left' width='70%'>
        </sn-table-column>
        <sn-table-column label='操作' width='' sloted>
          <template slot-scope='row'>
            <div class="btn-group">
              <button @click.stop='edit(row, $event)'>编辑</button>
              <div class="pt-5">
                <button @click.stop='showDel(row)'>删除</button>
              </div>
              <div class="pt-5">
                <button :class="{'is-disabled':row.$index==0}" @click.stop='move(row, 1, row.$index)'>上移</button>
                <button :class="{'is-disabled':(row.$index+1)==list.length}" @click.stop='move(row, 2, row.$index)'>下移</button>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <sn-confirm v-if="viewType=='add'||viewType=='edit'" :title='modalTitle' @close="close" @sure="confirm" noflag>
      <div class="modal-body">
        <div class="is-line input-group">
          <span class="label">栏目名称</span>
          <sn-input
            ref='columnInput'
            v-model='columnInput'
            placeholder='请输入栏目名称'
            :minlength='2'
            :maxlength='4'
            width='275'
            autoValid></sn-input>
        </div>
      </div>
    </sn-confirm>
    <sn-confirm v-else-if="viewType=='confirmDel'" title="删除栏目" txt @sure="doDel" @close="close" type='del' noflag>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
export default {
  name: 'column',
  props: {
    list: Array
  },
  data () {
    return {
      viewType: "",
      nameList: [],
      modalTitle: "",
      columnInput: "",
      selectedColumn: null
    }
  },
  methods: {
    getPageIndex (index) {
      index++;
      index += this.$bus.curPageStartNo.columnLabel || 0;

      if (index < 10) {
        return `0${index}`
      }
      return index;
    },

    add () {
      this.modalTitle = "添加栏目";
      this.viewType = "add";
    },

    edit (row) {
      this.modalTitle = "编辑";
      this.viewType = "edit";
      this.columnInput = row.labelName;
      this.selectedColumn = row;
    },

    showDel (row) {
      this.selectedColumn = row;
      this.viewType = "confirmDel";
    },

    doDel () {
      this.$ajax({
        url: DI.label.delColumn,
        context: this,
        type: 'get',
        loadingText: '正在删除栏目',
        data: {
          labelId: this.selectedColumn.labelId
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.viewType = null;
            this.$parent.queryList();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    move (row, opType, index) {
      let tmp = null,
        moveIndex = null,
        list = this.list;

      if ((opType == 1 && index == 0) || (opType == 2 && index == list.length - 1)) return;
      this.$ajax({
        url: DI.label.moveColumn,
        context: this,
        type: 'get',
        loadingText: '正在移动栏目',
        data: {
          labelId: row.labelId,
          movingState: opType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.$parent.queryList();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    close () {
      this.viewType = null;
    },

    confirm () {
      let url = '',
        loadingText = '',
        data = {
          labelName: this.columnInput
        };

      let isVaid = this.$refs.columnInput.check();

      if (isVaid == null) {
        return;
      }

      if (this.viewType == 'edit') {
        url = DI.label.editColumnLabel;
        data.labelId = this.selectedColumn.labelId;
        loadingText = '正在编辑栏目标签';
      } else {
        url = DI.label.addColumnLabel;
        loadingText = '正在添加栏目标签';
      }

      this.$ajax({
        url,
        context: this,
        type: 'get',
        loadingText,
        data,
        success: (res) => {
          if (res.retCode == "0") {
            this.columnInput = '';
            this.viewType = null;
            this.$parent.queryList();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    }
  }

}
</script>

<style scoped>
.crumb {
  display: flex;
  justify-content: flex-end;
  padding: 18px 15px;
  background-color: #ffffff;
}

.list {
  background-color: #ffffff;
  margin-top: 20px;
  padding-bottom: 20px;
}

button {
  color: #0abbfe;
}

.btn-group {
  height: 50px;
}

.is-disabled {
  color: #bfcbd9;
  cursor: not-allowed;
}

.modal-body {
  width: 420px;
}

.input-group {
  justify-content: space-between;
  .label {
    margin-right: 20px;
  }
}

.pt-5 {
  padding-top: 5px;
}
</style>
