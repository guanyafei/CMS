import * as Constant from 'js/constant';
import { getHistoryMapData, setHistoryMapData } from 'utils/util';
export default {
  data() {
    return {
      ruleForm: this.getInitPublishData()
    };
  },
  methods: {
    getInitPublishData(videoDetailsList) {
      let batchVideoList = [];
      let initialObj = null;
      if (videoDetailsList && videoDetailsList.length) {
        initialObj = videoDetailsList[0];
        videoDetailsList.map(videoDetails => {
          let epTitle = '';
          if (videoDetails.setList && videoDetails.setList.length > 0) {
            epTitle = videoDetails.setList[0].epTitle;
          }
          batchVideoList.push({
            id: videoDetails.id,
            coverPic: videoDetails.picUrl,
            newsCover: videoDetails.picUrl,
            description: videoDetails.description,
            duration: videoDetails.duration,
            definition: videoDetails.definition,
            title: videoDetails.title,
            epTitle, // 分集名
            coverLibList: [],
            prevType: videoDetails.pushVipStatus == 1 ? 1 : 3,
            type: videoDetails.pushVipStatus == 1 ? 1 : 3
          });
        });
      }
      let initData = {
        newsType: 3,
        batchVideoList: batchVideoList || [],
        authorList: [],
        status: 1,
        operator: '',
        authorId: '',
        authorName: '',
        authorType: '',
        source: '',
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
        customLabels: [],
        videoLabelList: [],
        columnLabelList: [],
        buLabelList: [],
        sportsTypeList: [],
        selectedSetLabels: [],
        topicAllList: [],
        columnAllList: [],
        channelList: [],
        channelSet: []
      };
      if (initialObj) {
        initialObj = this.recoverDataFromHistory(initialObj);
        let selectedTags = initialObj.nlrList || [];

        initData.authorId = initialObj.authorId || '';
        initData.authorName = initialObj.authorName || '';
        initData.authorType = initialObj.authorType || '';
        initData.authorList = initialObj.authorList;
        initData.operator = initialObj.operator;
        let bppCata = initialObj.bppCata; //	基础分类
        if (bppCata) {
          initData.baseClassifySelectedItem.id = bppCata.bppCataId;
          initData.baseClassifySelectedItem.title = bppCata.bppCataTitle;
        }
        if (initialObj.bppPropValue) {
          initData.videoSelectedLabels = initialObj.bppPropValue.split(',');
        }
        let { epgCataList } = initialObj;
        if (epgCataList && epgCataList.length > 0) {
          epgCataList.map(item => {
            initData.frontClassifySelectedLabels.push({ id: item.epgCataId, title: item.epgCataTitle });
          });
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
        initData.selectedTags = selectedTags;
        initData.infoColumnVal = this.getSelectedLabelIdByKey(selectedTags, 'column');
        initData.infoBuVal = this.getSelectedLabelIdByKey(selectedTags, 'bu');
        initData.matchLabels = this.getMatchInfoSelectedLabels(selectedTags, 'match');
        initData.teamLabels = this.getSelectedLabels(selectedTags, 'team');
        initData.playerLabels = this.getSelectedLabels(selectedTags, 'player');
        initData.customLabels = this.getSelectedLabels(selectedTags, 'custom');
        initData.videoLabelList = initialObj.programTypeList || [];
        initData.columnLabelList = initialObj.columnLabelList || [];
        initData.buLabelList = initialObj.buLabelList || [];
        initData.sportsTypeList = initialObj.sportsTypeList || [];
        initData.topicAllList = this.filterSubjectListList(initialObj, [], 'topic');
        initData.columnAllList = this.filterSubjectListList(initialObj, [], 'column');
      }
      return initData;
    },
    recoverDataFromHistory(initialObj) {
      let historyData = getHistoryMapData('videoPublishItem');
      if (!initialObj) {
        return historyData;
      }
      if (initialObj) {
        let { bppCata, bppPropValue, nlrList, terminal } = historyData;
        if (!initialObj.bppCata && bppCata) {
          initialObj.bppCata = bppCata;
        }
        if (!initialObj.bppPropValue && bppPropValue) {
          initialObj.bppPropValue = bppPropValue;
        }
        if (!initialObj.nlrList && nlrList) {
          initialObj.nlrList = nlrList;
        }
        if (!initialObj.terminal && terminal) {
          initialObj.terminal = terminal;
        }
      }
      return initialObj;
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
      let list = [];
      if (columnLabel) list.push(columnLabel);
      if (buLabel) list.push(buLabel);
      let data = {
        bppCata: {
          bppCataId: baseClassifySelectedItem.id,
          bppCataTitle: baseClassifySelectedItem.title
        },
        bppPropValue: submitData.programType,
        nlrList: list,
        terminal: submitData.terminal
      };
      setHistoryMapData('videoPublishItem', data);
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
    },
    filterSubjectListList(initData, draftDetail, type) {
      let draftSubjectList = (draftDetail.subjectList || []).filter(subject => {
        return type == 'column' ? subject.subjectType == 1 : subject.subjectType == 3;
      });
      let defaultSubjectList = (initData.subjectList || []).filter(subject => {
        return type == 'column' ? subject.subjectType == 1 : subject.subjectType == 3;
      });
      let totalSubjectList = [...draftSubjectList, ...defaultSubjectList];
      let subjectObject = {};
      for (let index = 0, len = totalSubjectList.length; index < len; index++) {
        const subject = totalSubjectList[index];
        if (!subjectObject[subject.subjectId]) {
          subjectObject[subject.subjectId] = subject;
        }
      }
      return Object.values(subjectObject).reverse();
    }
  }
};
