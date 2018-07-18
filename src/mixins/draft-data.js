import * as Constant from 'js/constant';
const maxUploadVideoSize = 200;
import { staticDefaultCover } from 'utils/envUrl';

export default {
  computed: {
    newsTypeItem() {
      return this.getNewsItem(this.ruleForm.newsType);
    },
    newsTypeKey() {
      return this.newsTypeItem.key || '';
    }
  },
  methods: {
    getInfoDraftInitData(data) {
      let initData = {
        newsType: '',
        newsId: '',
        authorId: '',
        authorName: '',
        authorType: '',
        author: {
          account: '',
          authorId: '',
          authorName: '',
          authorType: ''
        },
        content: '',
        dailyColumnList: [],
        fileSize: maxUploadVideoSize,
        checkQueue: [],
        sensitiveMsgList: [],
        title: '',
        rate: 1,
        vedioId: '',
        vedioSetId: '',
        vedioSetList: '',
        vedioName: '',
        cover: staticDefaultCover,
        source: '',
        sourceDetailType: 1,
        relNewsId: '',
        relNewsName: '',
        infoTypeVal: '',
        infoColumnVal: '',
        infoBuVal: '',
        authorList: [],
        selectedTags: [],
        matchLabels: [],
        teamLabels: [],
        playerLabels: [],
        matchLabels: [],
        customLabels: [],
        categoryLabelList: [],
        columnLabelList: [],
        buLabelList: [],
        sportsTypeList: [],
        columnAllList: [],
        topicAllList: [],
        channelSet: [],
        editorImgsContainer: {}
      };
      if (data) {
        let selectedTags = JSON.parse(data.labelSet || '[]');
        initData.authorId = data.authorId || '';
        initData.authorName = data.authorName || '';
        initData.authorType = data.authorType || '';
        initData.author = {
          account: data.account,
          authorId: data.authorId,
          authorName: data.authorName,
          authorType: data.authorType
        };
        initData.newsId = data.newsId || '';
        initData.newsType = data.newsType || '';
        initData.content = data.content || '';
        if (this.getNewsItem(data.newsType).key === 'daily') {
          let parseContent = JSON.parse(data.content || '{}');
          let dailyColumnList = parseContent.columnList || [
            {
              key: Date.now(),
              title: '',
              content: { ctt: '', dom: '' }
            }
          ];
          dailyColumnList.map(item => {
            if (!item.key) {
              item.key = Date.now();
            }
          });

          initData.content = parseContent.textContent;
          initData.dailyColumnList = dailyColumnList;
        }
        initData.fileSize = data.fileSize || maxUploadVideoSize;
        initData.title = data.title || '';
        initData.rate = data.level || 1;
        initData.vedioId = data.vedioId || '';
        initData.vedioSetId = data.vedioSetId || '';
        initData.vedioName = data.vedioName || '';
        if (data.cover) {
          initData.cover = data.cover;
        }
        initData.source = data.source || '';
        initData.sourceDetailType = data.sourceDetailType || 1;
        initData.relNewsId = data.relNewsId || '';
        initData.relNewsName = data.relNewsName || '';
        initData.selectedTags = selectedTags;
        initData.infoTypeVal = this.getSelectedLabelIdByKey(selectedTags, 'type');
        initData.infoColumnVal = this.getSelectedLabelIdByKey(selectedTags, 'column');
        initData.infoBuVal = this.getSelectedLabelIdByKey(selectedTags, 'bu');
        initData.matchLabels = this.getMatchInfoSelectedLabels(selectedTags, 'match');
        initData.teamLabels = this.getSelectedLabels(selectedTags, 'team');
        initData.playerLabels = this.getSelectedLabels(selectedTags, 'player');
        initData.customLabels = this.getSelectedLabels(selectedTags, 'custom');
        initData.categoryLabelList = data.categoryLabelList || [];
        initData.columnLabelList = data.columnLabelList || [];
        initData.buLabelList = data.buLabelList || [];
        initData.sportsTypeList = data.sportsTypeList || [];
        initData.authorList = data.authorList || [];
        initData.topicAllList = data.topicAllList || [];
        initData.columnAllList = data.columnAllList || [];
        initData.channelSet = data.channelSet || [];
      }
      return initData;
    },
    getNewsItem(value) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, value);
    },
    getSelectedLabelIdByKey(selectedTags, labelKey) {
      const toVal = Constant.getItemByKey(Constant.INFO_TAB_TYPE, labelKey).value;
      let result = {};

      for (let i = 0, len = selectedTags.length; i < len; i++) {
        const labelItem = selectedTags[i];
        if (labelItem.labelType === toVal) {
          result = labelItem;
          break;
        }
      }

      return (result.labelId || '') + '';
    },
    getMatchInfoSelectedLabels(selectedTags, labelKey) {
      let result = [];

      for (let i = 0, len = selectedTags.length; i < len; i++) {
        const labelItem = selectedTags[i];
        const belongTagKey = Constant.getItemByValue(Constant.INFO_TAB_TYPE, labelItem.labelType).belongTag;

        if (belongTagKey && labelKey === belongTagKey) {
          result.push(labelItem);
        }
      }

      return result;
    },
    getSelectedLabels(selectedTags, labelKey) {
      const toVal = Constant.getItemByKey(Constant.INFO_TAB_TYPE, labelKey).value;
      let result = [];

      for (let i = 0, len = selectedTags.length; i < len; i++) {
        const labelItem = selectedTags[i];
        if (labelItem.labelType === toVal) {
          result.push(labelItem);
        }
      }

      return result;
    }
  }
};
