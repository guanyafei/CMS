<template>
  <sn-search-box :fields="searchFilters">
    <sn-search-item
      :children="[{
        type: 'duration',
        prop: ['createTimeStart','createTimeEnd'],
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
        :fromVue='fromVue'
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
        label: '视频ID',
        placeholder: '请输入视频ID',
        inputType: 'number',
        maxlength: 20
      },{
        type: 'input',
        prop: 'title',
        placeholder: '请输入视频标题',
        label: '视频标题',
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
        prop: 'hide'
      }, {
        type: 'slot',
        prop: 'star'
      }]">
      <sn-button slot="star" type="extra1" @click="batchHandle('batchPublish')">批量发布</sn-button>
    </sn-search-item>
  </sn-search-box>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import BaseClassify from 'widgets/video/base-classify.vue';

import createConstantArr from 'utils/constant-array';

export default {
  name: 'VideoLibSearchBox',
  componentName: 'VideoLibSearchBox',
  components: {
    BaseClassify
  },
  props: ['searchFilters', 'videoPublishStatusList'],
  data() {
    return {
      // videoStatusList: Constant.VIDEO_STATUS, // 视频状态
      videoStatusList: this.videoPublishStatusList ? createConstantArr(this.videoPublishStatusList) : Constant.VIDEO_STATUS, // 视频状态
      authorList: Constant.AUTHOR_TYPE, // 作者列表
      buList: Constant.BU_TYPE, // 所属BU
      infoSourceList: Constant.INFO_SOURCE_TYPES, // 资讯来源
      dialogVisible: false,
      selectedTagList: [],
      fromVue:0,//区分基础分类组件里为空是否可以点击的判断
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
      if (!this.searchFilters.createTimeStart && this.searchFilters.createTimeEnd) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (!this.searchFilters.createTimeEnd && this.searchFilters.createTimeStart) {
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
        this.$message.warning('请至少选中一条！');
        return;
      }
      if ($borther.selecteds.length > 5) {
        this.$message.warning('最多只能批量发布5条！');
        return;
      }

      $borther.batchHandle(type);
    },
    openFrontClassifyDialog() {
      this.dialogVisible = true;
      this.fromVue = 0;//区分基础分类组件里为空是否可以点击的判断
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
    }
  }
};
</script>
