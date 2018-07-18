<template>
  <div>
    <div class="crumb">
      <sn-button type="outline" @click="add">添加</sn-button>
    </div>
    <div class="list">
      <sn-table :data='list' ref='table'>
        <sn-table-column label='权重序号' prop='$index' width='10%' sloted>
          <template slot-scope='row'>
            {{getPageIndex(row.$index)}}
          </template>
        </sn-table-column>
        <sn-table-column label='赛事ID' prop='matchId' width='10%'>
        </sn-table-column>
        <sn-table-column label='赛事名称' prop='matchName' align='left' width='70%'>
        </sn-table-column>
        <sn-table-column label='操作' width='' sloted>
          <template slot-scope='row'>
            <div class="btn-group">
              <button @click.stop='editTeam(row, $event)'>球队管理</button>
              <div class="pt-5">
                <button @click.stop='showDelConfirm(row)'>删除</button>
              </div>
              <div class="pt-5">
                <button :class="{'is-disabled':(curPageStartNo + row.$index)==0}" @click.stop='moveMatch(row, 1, row.$index)'>上移</button>
                <button :class="{'is-disabled':(curPageStartNo + row.$index + 1)==total}" @click.stop='moveMatch(row, 2, row.$index)'>下移</button>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="pagination" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
    <sn-confirm v-if="viewType=='add'" :title='modalTitle' @close="close" @sure="sure" noflag>
      <div class="modal-body">
        <select-group v-model='selectedMatchObj'></select-group>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='manage'" :title='modalTitle' @close="close" @sure="showSyncConfirm" confirmButtonText="同步球队" cancelButtonText="关闭" noflag>
      <div class="modal-body manage">
        <sn-table :data='teamList' theme="dialog" height="250">
          <sn-table-column label='序号' prop='indexs' width='20%'>
          </sn-table-column>
          <sn-table-column label='球队ID' prop='teamId' width='25%' align='left'>
          </sn-table-column>
          <sn-table-column label='球队名称' prop='teamName' width='25%' align='left'>
          </sn-table-column>
          <sn-table-column label='操作' width='' sloted>
            <template slot-scope='team'>
              <div class="btn-group">
                <button :class="{'is-disabled':team.$index==0}" @click.stop='moveTeam(team, 1, team.$index)'>上移</button>
                <button :class="{'is-disabled':(team.$index+1)==teamList.length}" @click.stop='moveTeam(team, 2, team.$index)'>下移</button>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
    <sn-confirm v-else-if="viewType=='confirmDel'" title="删除赛事" class="del" txt @sure="delMatch" @close="close" type='del' noflag>
    </sn-confirm>
    <sn-confirm v-show="secondViewType=='confirmSync'" title="同步球队" class="del" txt @sure="syncPlayerList" @close="closeSecondView" noflag>
      同步球队会覆盖当前操作，确认同步球队吗？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
import SelectGroup from './widgets/SelectGroup'
export default {
  name: 'match',
  components: {
    SelectGroup
  },
  props: {
    list: Array,
    total: [String, Number]
  },
  data () {
    return {
      viewType: "",
      secondViewType: '',
      teamList: [],
      modalTitle: "",
      matchInput: "",
      selectedMatchItem: null,
      selectedMatchObj: null,
      curPageStartNo: this.$bus.curPageStartNo.match || 0
    }
  },
  beforeUpdate () {
    this.curPageStartNo = this.$bus.curPageStartNo.match || 0
  },
  methods: {
    getPageIndex (index) {
      index++;
      index += this.curPageStartNo;

      if (index < 10) {
        return `0${index}`
      }
      return index;
    },
    add () {
      this.modalTitle = "添加赛事";
      this.viewType = "add";
    },
    editTeam (item) {
      this.selectedMatchItem = item;
      this.viewType = "manage";
      this.modalTitle = "球队管理";
      this.$nextTick(() => {
        this.queryTeamList();
      })
    },
    showDelConfirm (item) {
      this.selectedMatchItem = item;
      this.viewType = 'confirmDel';
    },
    goto (num) {
      this.$emit("goto", num);
    },
    close () {
      this.selectedMatchObj = null;
      this.viewType = null;
    },
    closeSecondView () {
      this.secondViewType = null;
    },
    showSyncConfirm () {
      this.secondViewType = 'confirmSync';
    },
    syncPlayerList () {
      this.secondViewType = null;
      this.$ajax({
        url: DI.label.syncPlayerList,
        loadingText: '正在同步球队列表',
        type: 'get',
        context: this,
        data: {
          matchId: this.selectedMatchItem.matchId
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.queryTeamList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    delMatch () {
      this.$ajax({
        url: DI.label.delMatch,
        context: this,
        type: 'get',
        loadingText: '正在删除赛事',
        data: {
          id: this.selectedMatchItem.id
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
    moveMatch (match, opType, index) {
      let tmp = null,
        moveIndex = null,
        list = this.list;

      if ((opType == 1 && (this.curPageStartNo + index) == 0) || (opType == 2 && (this.curPageStartNo + index) == +this.total - 1)) return;

      this.$ajax({
        url: DI.label.moveMatch,
        context: this,
        type: 'get',
        loadingText: '正在移动赛事',
        data: {
          id: match.id,
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
    moveTeam (team, opType, index) {
      let tmp = null,
        moveIndex = null,
        teamList = this.teamList;

      if ((opType == 1 && index == 0) || (opType == 2 && index == teamList.length - 1)) return;
      this.$ajax({
        url: DI.label.moveTeamInMatch,
        context: this,
        type: 'get',
        loadingText: '正在移动球队',
        data: {
          id: team.id,
          matchId: this.selectedMatchItem.matchId,
          movingState: opType
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.queryTeamList();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    queryTeamList () {
      this.$ajax({
        url: DI.label.matchTeamlist,
        loadingText: '正在加载球队列表',
        type: 'get',
        context: this,
        data: {
          matchId: this.selectedMatchItem.matchId
        },
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.teamList = data.matchTeamList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    sure () {
      if (this.selectedMatchObj == null) {
        this.$message.warning('请选择赛事');
        return;
      }
      this.$ajax({
        url: DI.label.addMatch,
        context: this,
        type: 'get',
        loadingText: '正在新增赛事',
        data: {
          matchId: this.selectedMatchObj.competitionId,
          matchLogo: this.selectedMatchObj.competitionLogo,
          matchName: this.selectedMatchObj.competitionName
        },
        success: (res) => {
          if (res.retCode == "0") {
            this.selectedMatchObj = null;
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

.pt-5 {
  padding-top: 5px;
}
</style>
