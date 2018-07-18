<template>
  <div>
    <div class="crumb">
      <sn-button type="outline" @click="add">添加</sn-button>
    </div>
    <div class="list">
      <sn-table :data='list' ref='table'>
        <sn-table-column label='序号' prop='$index' width='10%' sloted>
          <template slot-scope='row'>
            {{getPageIndex(row.$index)}}
          </template>
        </sn-table-column>
        <sn-table-column label='ID' prop='playerId' width='10%'>
        </sn-table-column>
        <sn-table-column label='球员logo' prop='playerLogo' width='10%' sloted>
          <template slot-scope='row'>
            <img :src="row.playerLogo|smallImage(80)" class="img-logo" alt="">
          </template>
        </sn-table-column>
        <sn-table-column label='球员名称' prop='playerName' align='left' width='60%'>
        </sn-table-column>
        <sn-table-column label='操作' width='' sloted>
          <template slot-scope='row'>
            <div class="btn-group">
              <div>
                <button :class="{'is-disabled':(curPageStartNo + row.$index)==0}" @click.stop='move(row, 1, row.$index)'>上移</button>
                <button :class="{'is-disabled':(curPageStartNo + row.$index+1)==total}" @click.stop='move(row, 2, row.$index)'>下移</button>
              </div>
              <div class="pt-5">
                <button @click.stop='delConfirm(row)'>删除</button>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="pagination" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
    <sn-confirm v-if="viewType=='add'" :title='modalTitle' @close="close" @sure="sure" noflag>
      <div class="modal-body">
        <div class="is-line input-group">
          <div class="is-line">
            <span class="label">球员名称</span>
            <sn-select-filter
              :list="filterPlayerList"
              outputField="playerName"
              :displayField="['playerName','teamName']"
              v-model="playerInput"
              conWidth="260"
              placeholder="请输入球员名称"
              class="mt-10"
              @input="selectPlayerInput"
            >
            </sn-select-filter>
          </div>
        </div>
      </div>
    </sn-confirm>
    <sn-confirm v-else-if="viewType=='confirm'" title="删除球员" txt type='del' @sure="doDel" @close="close" noflag>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
export default {
  name: 'player',
  props: {
    list: Array,
    total: [String, Number]
  },
  data () {
    return {
      viewType: "",
      modalTitle: "",
      playerInput: "",
      selectedInputObj: null,
      filterPlayerList: [],
      curPageStartNo: this.$bus.curPageStartNo.player || 0
    }
  },
  watch: {
    playerInput (newVal) {
      if (newVal.trim() === '') return;

      this.queryFilterPlayerList(newVal);
    }
  },
  beforeUpdate () {
    this.curPageStartNo = this.$bus.curPageStartNo.player || 0
  },
  methods: {
    getPageIndex (index) {
      index++;
      index += this.$bus.curPageStartNo.player || 0;

      if (index < 10) {
        return `0${index}`
      }
      return index;
    },
    add () {
      this.modalTitle = "添加球员";
      this.viewType = "add";
    },
    delConfirm (row) {
      this.selectedPlayer = row;
      this.viewType = "confirm";
    },
    doDel () {
      this.$ajax({
        url: DI.label.delPlayer,
        context: this,
        type: 'get',
        loadingText: '正在删除球员',
        data: {
          id: this.selectedPlayer.id
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
    goto (num) {
      this.$emit("goto", num);
    },
    queryFilterPlayerList: _.debounce(function (newVal) {
      this.duringAjax = true;
      this.$ajax({
        url: DI.label.getFilterPlayerList,
        context: this,
        type: 'get',
        data: {
          playerName: newVal
        },
        success: (res) => {
          this.duringAjax = false;
          if (res.retCode == "0") {
            const data = res.data;
            this.filterPlayerList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });

    }, 500),
    selectPlayerInput (value, obj) {
      if (obj) {
        this.selectedInputObj = obj;
      }
    },
    move (row, opType, index) {
      let tmp = null,
        moveIndex = null,
        list = this.list;

      if ((opType == 1 && (this.curPageStartNo + index) == 0) || (opType == 2 && (this.curPageStartNo + index) == +this.total - 1)) return;

      this.$ajax({
        url: DI.label.movePlayer,
        context: this,
        type: 'get',
        loadingText: '正在移动球员',
        data: {
          id: row.id,
          movingState: opType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.$parent.queryList(this.curPageStartNo / 20 + 1);
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
    sure () {
      if (!this.selectedInputObj) {
        this.$message.warning("请选择球员");
        return;
      }

      let { playerId, playerLogo, playerName } = this.selectedInputObj;

      this.$ajax({
        url: DI.label.addPlayer,
        context: this,
        type: 'get',
        loadingText: '正在新增球员',
        data: {
          playerId,
          playerLogo,
          playerName
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
  height: 40px;
}

.is-disabled {
  color: #bfcbd9;
  cursor: not-allowed;
}

.modal-body {
  width: 420px;
  &.manage {
    width: 540px;
  }
}

.input-group {
  justify-content: space-between;
  .label {
    margin-right: 20px;
  }
}

.mt-10 {
  margin-top: 10px;
}

.img-logo {
  width: 80px;
  height: 80px;
}

.pt-5 {
  padding-top: 5px;
}
</style>
