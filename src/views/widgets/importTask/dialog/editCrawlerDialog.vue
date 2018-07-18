<template>
  <sn-confirm v-if="isShow" title="爬虫库评论" @close="cancel" @sure="save" confirmButtonText="保存" noflag closeIcon>
    <div class="modal-body">
      <sn-search-box :fields="fields" class="crawler-dialog_searchbox">
        <sn-search-item :children="[{
              type: 'duration',
              prop: ['startTime','endTime'],
              timeFormat: 'HH:mm:ss',
              showTimepicker: true,
              width: '160'
            }, {
              type: 'button',
              buttonType: 'primary',
              text: '查询',
              triggerEvent: queryList,
              isRight: true
            }]">
        </sn-search-item>
        <sn-search-item :children="[{
              type: 'input',
              prop: 'commContent',
              placeholder: '请输入内容评论',
              maxlength: 100
            }, {
              type: 'input',
              prop: 'commTitle',
              placeholder: '请输入内容标题',
              maxlength: 100
            }, {
              type: 'button',
              text: '重置',
              triggerEvent: reset,
              isRight: true
            }]">
        </sn-search-item>
        <sn-search-item :children="[{
                type: 'select',
                label: '评论来源',
                prop: 'source',
                list: sourceList,
                triggerEvent: selectSourceChange
              }]">
        </sn-search-item>
        <sn-search-item :children="[{
            type: 'slot',
            prop: 'checkAll'
          }]">
          <button slot="checkAll" class="button--check" @click="toggle(checkAll)">{{checkAll?'取消全选':'全选'}}</button>
        </sn-search-item>
      </sn-search-box>
      <sn-table :data="list" ref="table">
        <sn-table-column width='40' wall="false" tdPaddingRight='5' sloted>
          <template slot-scope='row'>
            <sn-checkbox v-model="totalSelectedIds" :label="row.id" theme="radio">
            </sn-checkbox>
          </template>
        </sn-table-column>
        <sn-table-column label="评论内容" width="30%" prop="commContent" sloted>
          <template slot-scope="row">
            <sn-td-ellipsis :str="row.commContent"></sn-td-ellipsis>
          </template>
        </sn-table-column>
        <sn-table-column label="内容标题" width="30%" prop="commTitle">
        </sn-table-column>
        <sn-table-column label="发表时间" width="15%" prop="createTime" sloted>
          <template slot-scope='row'>
            <sn-td-date :time="row.createTime"></sn-td-date>
          </template>
        </sn-table-column>
        <sn-table-column label="来源" prop="source"></sn-table-column>
      </sn-table>
      <sn-pagination :pageIndex.sync="pageIndex" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
  </sn-confirm>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  name: 'EditCrawler',
  props: ['viewType'],
  data () {
    return {
      totalSelectedIds: [],
      totalSelectedList: [],
      pageIndex: 1,
      pageSize: 10,
      list: [],
      total: 0,
      sourceList: JSON.parse(window.localStorage.getItem('sourceList')),
      fields: {
        source: -1,
        ...this.getDefaultData()
      },
    }
  },
  computed: {
    checkAll: {
      get () {
        let { totalSelectedIds, list } = this;
        if (list.length === 0) {
          return false;
        }

        for (let index = 0; index < list.length; index++) {
          let element = list[index];
          if (totalSelectedIds.indexOf(element.id) === -1) {
            return false;
          }
        };

        return true;
      },
      set (newValue) {
        let { totalSelectedIds, totalSelectedList, list } = this;
        if (newValue) {
          for (let index = 0; index < list.length; index++) {
            let element = list[index];
            let curIndex = totalSelectedIds.indexOf(element.id);
            if (curIndex === -1) {
              totalSelectedIds.push(element.id);
              totalSelectedList.push(element);
            }
          };
        } else {
          for (let index = 0; index < list.length; index++) {
            let element = list[index];
            let curIndex = totalSelectedIds.indexOf(element.id);
            if (curIndex > -1) {
              totalSelectedIds.splice(curIndex, 1);
              totalSelectedList.splice(curIndex, 1);
            }
          };
        }
      }
    },
    isShow: {
      get () {
        return this.viewType;
      },
      set (newValue) {
        this.$emit('update:viewType', newValue);
      }
    },
    pageNo () {
      return (this.pageIndex - 1) * this.pageSize;
    }
  },
  watch: {
    isShow (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.queryList();
      }
    },
    totalSelectedIds (newArr, oldArr) {
      let { totalSelectedList, list } = this,
        diff = Math.abs(newArr.length - oldArr.length),
        isAdd = true,
        keep = [],
        long = [];

      if (diff === 0) {
        return;
      }

      if (newArr.length > oldArr.length) {
        keep = oldArr;
        long = newArr;
      } else {
        isAdd = false;
        keep = newArr;
        long = oldArr;
      }

      for (let index = 0; index < long.length; index++) {
        if (diff < 1) {
          break;
        };
        let element = long[index];
        if (keep.indexOf(element) === -1) {
          if (isAdd) {
            let addItem = list.find(item => item.id === element);
            totalSelectedList.push(addItem);
          } else {
            let delIndex = totalSelectedList.findIndex(item => item.id === element);
            totalSelectedList.splice(delIndex, 1);
          }
          diff--;
        }
      };
    },

  },
  methods: {
    getDefaultData () {
      return {
        startTime: null,
        endTime: null,
        commContent: '',
        commTitle: '',
      }
    },
    toggle (type) {
      this.checkAll = !type;
    },
    goto (num) {
      this.queryList(num);
    },
    queryList (pageNo = 1) {
      if (!this.fields.startTime && this.fields.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (!this.fields.endTime && this.fields.startTime) {
        this.$bus.$emit('end-error-info');
        return;
      }
      let pageSize = 20;
      let pageIndex = (pageNo - 1) * pageSize;

      let { fields } = this;

      this.$ajax({
        url: DI.commentImport.queryCrawlerList,
        data: JSON.stringify({
          startTime: fields.startTime,
          endTime: fields.endTime,
          commContent: fields.commContent,
          commTitle: fields.commTitle,
          source: fields.source == -1 ? '' : fields.source,
          pageIndex,
          pageSize
        }),
        context: this,
        loadingText: '正在查询爬虫库评论内容列表，请稍候！',
        success: (res) => {
          if (res.retCode == "0") {
            this.pageIndex = pageNo;
            const data = res.data;
            this.list = data.commentList || [];
            this.total = data.commentNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    selectSourceChange (type) {
      this.fields.source = type;
      this.queryList();
    },
    cancel () {
      this.totalSelectedIds = [];
      this.totalSelectedList = [];
      this.resetAllOptions();
      this.$nextTick(()=> {
        this.isShow = null;
      })
    },
    save () {
      this.resetAllOptions();
      this.$nextTick(()=> {
        this.isShow = null;
        this.$parent.$parent.addCrawlerList(this.totalSelectedList);
      })
    },
    reset () {
      this.clearDateErrMsg();
      Object.assign(this.fields, this.getDefaultData());
    },
    resetAllOptions () {
      this.pageIndex = 1;
      this.fields.source = -1;
      this.reset();
    },
    clearDateErrMsg () {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },

  }
}
</script>

<style scoped>
.modal-body {
  width: 800px;
}

.button--check {
  color: #09BBFE;
  padding-right: 30px;
}

.crawler-dialog_searchbox {
  padding: 0;
  margin-bottom: -10px;
}
</style>
