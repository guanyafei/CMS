import * as Constant from 'js/constant';
export default {
  data() {
    return {
      ruleForm: this.getInitPublishData()
    };
  },
  methods: {
    getInitPublishData(initialObj) {
      let batchVideoList = [];
      if (initialObj) {
        let epTitle = '';
        if (initialObj.setList && initialObj.setList.length > 0) {
          epTitle = initialObj.setList[0].epTitle;
        }
        batchVideoList.push({
          id: initialObj.id,
          coverPic: initialObj.picUrl,
          newsCover: initialObj.picUrl,
          description: initialObj.description,
          duration: initialObj.duration,
          definition: initialObj.definition,
          title: initialObj.title,
          epTitle, // 分集名
          coverLibList: [],
          prevType: initialObj.pushVipStatus == 1 ? 1 : 3,
          type: initialObj.pushVipStatus == 1 ? 1 : 3
        });
      }
      let initData = {
        newsType: 3,
        batchVideoList: batchVideoList || [],
        authorList: [],
        status: 1,
        authorId: '',
        authorName: '',
        authorType: '',
        source: '',
        operator: '',
        sourceDetailType: 1,
        rate: 1,
        terminal: {},
        baseClassifySelectedItem: {
          id: '',
          title: ''
        },
        frontClassifySelectedLabels: [],
        videoSelectedLabels: [],
        infoColumnVal: '',
        infoBuVal: '',
        authorList: [],
        selectedTags: [],
        matchLabels: [],
        teamLabels: [],
        playerLabels: [],
        matchLabels: [],
        customLabels: [],
        videoLabelList: [],
        columnLabelList: [],
        buLabelList: [],
        sportsTypeList: [],
        selectedSetLabels: [],
        topicAllList: [],
        fileList: []
      };

      if (initialObj) {
        let selectedTags = initialObj.nlrList || [];
        initData.status = initialObj.status;
        initData.operator = initialObj.operator;
        initData.authorId = initialObj.authorId || '';
        initData.authorName = initialObj.authorName || '';
        initData.authorType = initialObj.authorType || '';
        initData.authorList = initialObj.authorList;
        let bppCata = initialObj.bppCata; //	基础分类
        if (bppCata) {
          initData.baseClassifySelectedItem.id = bppCata.bppCataId;
          initData.baseClassifySelectedItem.title = bppCata.bppCataTitle;
        }
        if (initialObj.bppPropValue) {
          initData.videoSelectedLabels = initialObj.bppPropValue.split(',');
        }

        let { terminal } = initialObj;
        if (terminal) {
          initData.terminal = terminal;
          if (terminal.ikan && terminal.ikan.epgCata) {
            let { epgCata } = terminal.ikan;
            if (epgCata.length > 0) {
              epgCata.map(item => {
                initData.frontClassifySelectedLabels.push({ id: item.epgCataId, title: item.epgCataTitle });
              });
            }
          }
        }

        let { source } = initialObj;
        if (source) {
          initData.source = source;
        }
        let { sourceDetailType } = initialObj;
        if (sourceDetailType) {
          initData.sourceDetailType = sourceDetailType;
        }
        let { setList } = initialObj;
        if (setList && setList.length > 0) {
          initData.selectedSetLabels = setList;
        }
        let { fileList } = initialObj;
        if (fileList && fileList.length > 0) {
          initData.fileList = fileList;
        }
        initData.selectedTags = selectedTags;
        initData.infoColumnVal = this.getSelectedLabelIdByKey(selectedTags, 'column');
        initData.infoBuVal = this.getSelectedLabelIdByKey(selectedTags, 'bu');
        initData.matchLabels = this.getMatchInfoSelectedLabels(selectedTags, 'match');
        initData.teamLabels = this.getSelectedLabels(selectedTags, 'team');
        initData.playerLabels = this.getSelectedLabels(selectedTags, 'player');
        initData.customLabels = this.getSelectedLabels(selectedTags, 'custom');
        initData.videoLabelList = initialObj.programTypeList;
        initData.columnLabelList = initialObj.columnLabelList || [];
        initData.buLabelList = initialObj.buLabelList || [];
        initData.sportsTypeList = initialObj.sportsTypeList || [];
      }
      return initData;
    },
    replaceHistoryData(submitData) {
      let {frontClassifySelectedLabels, baseClassifySelectedItem, columnLabelList, infoColumnVal, buLabelList, infoBuVal } = this.ruleForm;
      submitData.terminal.ikan.epgCata = [];
      frontClassifySelectedLabels.map(item =>{
        submitData.terminal.ikan.epgCata.push({
          epgCataId: item.id, epgCataTitle: item.title
        })
      });
      let columnLabel = columnLabelList.find(item => '' + item.labelId === infoColumnVal);
      let buLabel = buLabelList.find(item => '' + item.labelId === infoBuVal);
      let data = {
        bppCata: {
          bppCataId: baseClassifySelectedItem.id,
          bppCataTitle: baseClassifySelectedItem.title
        },
        bppPropValue: submitData.programType,
        nlrList: [columnLabel, buLabel],
        terminal: submitData.terminal
      };
      // setHistoryMapData('videoPublishItem', data);
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
