<template>
  <sn-search-box :fields="searchFilters">
    <sn-search-item
      :children="[{
        type: 'duration',
        prop: ['publishTimeStart','publishTimeEnd'],
      },{
        type: 'slot',
        label: '基础分类',
        prop: 'cataIds',
        placeholder: '请选择分类',
        maxlength: 30
      },{
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: query,
        isRight: true
      }]">
      <base-classify
        slot="cataIds"
        title="基础分类"
        :dialogVisible.sync="dialogVisible"
        :selectedList.sync="selectedTagList"
        :querySuggestionList="querySuggestionList"
        :fromVue="fromVue"
      >
        <div class="is-line">
          <label class="mr-10">基础分类</label>
          <sn-input
            v-model="tagsInput"
            readOnly
            radius="16"
            placeholder="请选择基础分类"
            @focus="openFrontClassifyDialog"
            width="190"
          ></sn-input>
        </div>
      </base-classify>
    </sn-search-item>
    <sn-search-item
      :children="[ {
        type: 'input',
        prop: 'id',
        placeholder: '请输入视频ID',
        label: '视频ID',
        inputType: 'number',
        maxlength: 20
      },{
        type: 'input',
        prop: 'title',
        label: '视频标题',
        placeholder: '请输入视频标题',
        maxlength: 30
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: resetFilterInputs,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item
        :children="[{
          type: 'select',
          label: '视频状态',
          prop: 'status',
          list: videoStatusList,
          triggerEvent: handleSelectChange
        }]">
    </sn-search-item>
    <sn-search-item
      :children="[{
        type: 'slot',
        prop: 'star'
      }]">
      <sn-button slot="star" type="extra1" @click="batchHandle('batchStar')">批量设置星级</sn-button>
    </sn-search-item>
  </sn-search-box>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import BaseClassify from 'widgets/video/base-classify.vue';

export default {
  name: 'VideoHeader',
  componentName: 'VideoHeader',
  components: {
    BaseClassify
  },
  props: ['searchFilters'],
  data() {
    return {
      videoStatusList: Constant.VIDEO_STATUS, // 视频状态
      authorList: Constant.AUTHOR_TYPE, // 作者列表
      buList: Constant.BU_TYPE, // 所属BU
      infoSourceList: Constant.INFO_SOURCE_TYPES, // 资讯来源
      dialogVisible: false,
      selectedTagList: [],
      fromVue:0,
    };
  },
  computed: {
    tagsInput() {
      this.searchFilters.cataIds = '';
      return this.selectedTagList.reduce((str, tag) => {
        if (str) {
          str += `、${tag.ptitle}>${tag.title}`;
          this.searchFilters.cataIds += `,${tag.id}`;
        } else {
          this.searchFilters.cataIds = tag.id;
          str = `${tag.ptitle}>${tag.title}`;
        }
        return str;
      }, '');
    }
  },
  methods: {
    query() {
      if (!this.searchFilters.publishTimeStart && this.searchFilters.publishTimeEnd) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (!this.searchFilters.publishTimeEnd && this.searchFilters.publishTimeStart) {
        this.$bus.$emit('end-error-info');
        return;
      }
      this.$parent.goto(1);
    },
    handleSelectChange(code, field) {
      this.searchFilters[field] = code;
      this.$nextTick(() => {
        this.query();
      });
    },
    querySuggestionList(options, callback) {
      this.$ajax({
        url: DI.componentsMediaClassify.queryBaseClassifySuggestionList,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          title: options.queryString
        }),
        success: res => {
          if (res.retCode == '0') {
            let list = res.data || [];
            callback(list);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    openFrontClassifyDialog() {
      this.dialogVisible = true;
      this.fromVue = 0;
    },
    handleInfoSourceSelectChange(code) {
      this.handleSelectChange(code, 'sourceDetailType');
    },
    clearDateErrMsg() {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },
    resetFilterInputs() {
      this.selectedTagList = [];
      this.clearDateErrMsg();
      this.$parent.resetFilterInputs();
    },
    batchHandle(type) {
      let $borther = this.$parent.$refs.list;
      if ($borther.selecteds.length === 0) {
        this.$message.warning('请至少选中一条资讯！');
        return;
      }

      $borther.batchHandle(type);
    }
  }
};
</script>
