<template>
  <sn-search-box :fields="searchFilters">
    <sn-search-item :children="[{
        type: 'duration',
        prop: ['startTime','endTime'],
      }, {
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: query,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
        type: 'input',
        prop: 'title',
        placeholder: '请输入文章标题',
        maxlength: 30
      }, {
        type: 'input',
        prop: 'newsId',
        placeholder: '请输入资讯ID',
        inputType: 'number',
        maxlength: 20
      },{
        type: 'input',
        prop: 'authorId',
        placeholder: '请输入作者ID',
        maxlength: 30
      },{
        type: 'input',
        prop: 'labelName',
        placeholder: '请输入标签',
        maxlength: 20
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: reset,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
          type: 'select',
          label: '文章类型',
          prop: 'newsType',
          list: typeList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '发布状态',
          prop: 'status',
          list: statusList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '星级选择',
          prop: 'level',
          list: starList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '结算类型',
          prop: 'settleType',
          list: settleList,
          triggerEvent: handleSelectChange
        }]">
    </sn-search-item>
    <sn-search-item
      :children="[{
        type: 'select',
        label: '展示类型',
        prop: 'showType',
        list: showList,
        triggerEvent: handleSelectChange
      }, {
        type: 'slot',
        prop: 'sourceDetailType'
      }, {
        type: 'slot',
        prop: 'source'
      }]">
        <div class="sn-search__select" slot="sourceDetailType" v-if="isInfoSelectShow">
          <label>资讯来源</label>
          <sn-select
            v-model="searchFilters.sourceDetailType"
            width="135"
            radius="16"
            placeholder="请选择"
            @change="handleInfoSourceSelectChange"
          >
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option
              v-for="item in infoSourceList"
              :key="item.key"
              :name="item.name"
              :value="item.value"
            >
            </sn-option>
          </sn-select>
        </div>
        <sn-input
          v-if="isSourceInputShow"
          slot="source"
          v-model="searchFilters.source"
          width="194"
          radius="16"
          maxlength="10"
          placeholder="请输入外约作者名称"
        >
        </sn-input>
    </sn-search-item>
    <sn-search-item
      :children="[{
        type: 'slot',
        prop: 'checkAll'
      }, {
        type: 'slot',
        prop: 'hide'
      }, {
        type: 'slot',
        prop: 'star'
      }]"
    >
      <sn-button
        slot="checkAll"
        type="primary"
        @click="toggleCheckAll(checkAll)"
      >{{checkAll?'取消全选':'全选'}}</sn-button>
      <sn-button slot="hide" type="success" @click="batchHandle('batchHide')">隐藏</sn-button>
      <sn-button slot="star" type="extra1" @click="batchHandle('batchStar')">设置星级</sn-button>
    </sn-search-item>
  </sn-search-box>
</template>

<script>
import * as Constant from 'js/constant';

export default {
  name: 'SearchBox',
  componentName: 'SearchBox',
  props: ['checkAll', 'searchFilters'],
  data () {
    return {
      typeList: Constant.ARTICLE_TYPE, // 文章类型
      statusList: Constant.MEDIA_INFO_STATUS, // 发布状态
      starList: Constant.STAR_LEVEL, // 星级选择
      settleList: Constant.SETTLE_TYPE, // 结算类型
      showList: Constant.SHOW_TYPE, // 展示类型
      infoSourceList: Constant.INFO_SOURCE_TYPES // 资讯来源
    }
  },
  computed: {
    isInfoSelectShow () {
      let { newsType } = this.searchFilters;
      return false;
    },
    isSourceInputShow () {
      let { sourceDetailType } = this.searchFilters;
      return sourceDetailType == 3;
    }
  },
  methods: {
    query () {
      if (!this.searchFilters.startTime && this.searchFilters.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (!this.searchFilters.endTime && this.searchFilters.startTime) {
        this.$bus.$emit('end-error-info');
        return;
      }
      this.$parent.goto(1);
    },
    handleSelectChange (code, field) {
      this.searchFilters[field] = code;
      if (field === 'newsType') {
        this.searchFilters.sourceDetailType = -1;
      }
      if ((field === 'newsType' || field === 'sourceDetailType')) {
        this.searchFilters.source = '';
      }
      this.$nextTick(() => {
        this.query()
      })
    },
    handleInfoSourceSelectChange (code) {
      this.handleSelectChange(code, 'sourceDetailType');
    },
    clearDateErrMsg () {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },
    resetFilterInputs () {
      this.clearDateErrMsg();
      this.$parent.resetFilterInputs();
    },
    toggleCheckAll (type) {
      this.$bus.$emit('checkAllBtn-click', !type);
    },
    batchHandle (type) {
      let $borther = this.$parent.$refs.list;
      if ($borther.selecteds.length === 0) {
        this.$message.warning("请至少选中一条资讯！");
        return;
      }

      $borther.batchHandle(type);
    },
  }
}
</script>

<style scoped>
</style>
