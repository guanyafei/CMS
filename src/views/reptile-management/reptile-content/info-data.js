import * as Constant from 'js/constant';
const maxUploadVideoSize = 200;
import { staticDefaultCover } from 'utils/envUrl';

export default {
  computed: {
    newsTypeItem() {
      return this.getNewsItem(this.data.newsType);
    },
    newsTypeKey() {
      return this.newsTypeItem.key || '';
    }
  },
  methods: {
    getInitData(data) {
      let initData = {
        newsType: '',
        id: '',
        authorId: '',
        authorName: '',
        authorType: '',
        content: '',
        dailyColumnList: [],
        fileSize: maxUploadVideoSize,
        checkQueue: [],
        sensitiveMsgList: [],
        title: '',
        rate: 1,
        cover: staticDefaultCover,
        source: '',
        sourceWebsite: '',
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
        channelList: [],
        editorImgsContainer: {}
      };
      if (data) {
        let selectedTags = data.nlrList || [];
        initData.authorId = data.authorId || '';
        initData.authorName = data.authorName || '';
        initData.authorType = data.authorType || '';
        initData.id = data.id || '';
        initData.newsType = data.newsType || '';
        initData.content = data.content || '';
        initData.fileSize = data.fileSize || maxUploadVideoSize;
        initData.title = data.title || '';
        initData.rate = data.level || 1;
        if (data.cover) {
          initData.cover = data.cover;
        }
        initData.authorList = data.authorList || [];
        initData.source = data.source || '';
        initData.sourceWebsite = data.sourceWebsite || '';
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
        initData.channelList = data.soaList || [];
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

      return result.labelId || '';
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
