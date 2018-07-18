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
        <sn-table-column label='球队ID' prop='teamId' width='10%'>
        </sn-table-column>
        <sn-table-column label='球队logo' prop='teamLogo' width='10%' sloted>
          <template slot-scope='row'>
            <img :src="row.teamLogo|smallImage(80)" class="img-logo" alt="">
          </template>
        </sn-table-column>
        <sn-table-column label='球队名称' prop='teamName' align='left' width='60%'>
        </sn-table-column>
        <sn-table-column label='操作' width='' sloted>
          <template slot-scope='row'>
            <div class="btn-group">
              <div>
                <button :class="{'is-disabled':(curPageStartNo + row.$index)==0}" @click.stop='move(row, 1, row.$index)'>上移</button>
                <button :class="{'is-disabled':(curPageStartNo + row.$index+1)==total}" @click.stop='move(row, 2, row.$index)'>下移</button>
              </div>
              <div class="pt-5">
                <button @click.stop='showDelConfirm(row)'>删除</button>
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
            <span class="label">球队名称</span>
            <sn-select-filter
              :list="filterTeamList"
              outputField="teamName"
              displayField="teamName"
              v-model="teamInput"
              conWidth="260"
              placeholder="请输入球队名称"
              class="mt-10"
              @input="selectTeamInput"
            >
            </sn-select-filter>
          </div>
        </div>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='manage'" :title='modalTitle' @close="close" @sure="sure" confirmButtonText="同步球队" noflag>
      <div class="modal-body manage">
        <sn-table :data='teamList' theme="dialog">
          <sn-table-column label='序号' prop='indexs' width='20%'>
          </sn-table-column>
          <sn-table-column label='球队ID' prop='teamId' width='25%' align='left'>
          </sn-table-column>
          <sn-table-column label='球队名称' prop='teamName' width='25%' align='left'>
          </sn-table-column>
          <sn-table-column label='操作' width='' sloted>
            <template slot-scope='team'>
              <div class="btn-group">
                <button :class="{'is-disabled':team.$index==0}" @click.stop='move(team, 0, team.$index)'>上移</button>
                <button :class="{'is-disabled':(team.$index+1)==teamList.length}" @click.stop='move(team, 1, team.$index)'>下移</button>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
    <sn-confirm v-else-if="viewType=='confirm'" title="删除球队" txt type='del' @sure="doDel" @close="close" noflag>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
export default {
  name: 'match',

  props: {
    list: Array,
    total: [String, Number]
  },

  data () {
    return {
      viewType: "",
      modalTitle: "",
      teamInput: "",
      selectedInputObj: null,
      selectedTeamItem: null,
      filterTeamList: [],
      curPageStartNo: this.$bus.curPageStartNo.team || 0
    }
  },

  watch: {
    teamInput (newVal) {
      if (newVal.trim() === '') return;

      this.queryFilterTeamList(newVal);
    }
  },

  beforeUpdate () {
    this.curPageStartNo = this.$bus.curPageStartNo.team || 0
  },

  methods: {
    getPageIndex (index) {
      index++;
      index += this.$bus.curPageStartNo.team || 0;

      if (index < 10) {
        return `0${index}`
      }
      return index;
    },

    add () {
      this.modalTitle = "添加球队";
      this.viewType = "add";
    },

    editTeam (matchId) {
      this.$ajax({
        url: DI.label.matchTeamlist,
        context: this,
        type: 'get',
        data: {
          matchId
        },
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.viewType = "manage";
            this.$nextTick(() => {
              this.modalTitle = "球队管理";
              this.teamList = [...(data.matchTeamList || [])];
            })
          } else {
            this.$message.error(res.error.message);
          }
        },
        error: () => {
          console.log("error");
        }
      });

    },

    showDelConfirm (row) {
      this.selectedTeamItem = row;
      this.viewType = "confirm";
    },

    doDel () {
      this.$ajax({
        url: DI.label.delTeam,
        context: this,
        type: 'get',
        loadingText: '正在删除球队',
        data: {
          id: this.selectedTeamItem.id
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

    queryFilterTeamList: _.debounce(function (newVal) {
      this.duringAjax = true;
      this.$ajax({
        url: DI.label.getFilterTeamList,
        context: this,
        type: 'get',
        data: {
          teamName: newVal
        },
        success: (res) => {
          this.duringAjax = false;
          if (res.retCode == "0") {
            const data = res.data;
            this.filterTeamList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });

    }, 500),

    selectTeamInput (value, obj) {
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
        url: DI.label.moveTeam,
        context: this,
        type: 'get',
        loadingText: '正在移动球队',
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
      this.selectedInputObj = "";
      this.viewType = null;
    },

    sure () {
      if (!this.selectedInputObj) {
        this.$message.warning("请选择球队");
        return;
      }

      let { teamId, teamLogo, teamName } = this.selectedInputObj;

      this.$ajax({
        url: DI.label.addTeam,
        context: this,
        type: 'get',
        loadingText: '正在新增球队',
        data: {
          teamId,
          teamLogo,
          teamName
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.viewType = null;
            this.filterTeamList = [];
            this.selectedInputObj = null;
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

.img-logo {
  width: 80px;
  height: 80px;
}

.mt-10 {
  margin-top: 10px;
}
.pt-5 {
  padding-top: 5px;
}
</style>
