<style scoped>
	.select-area {
		display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
		.selected-tag {
	    position: relative;
	    display: inline-block;
	    box-sizing: border-box;
	    height: 28px;
	    line-height: 28px;
	    min-width: 64px;
	    border: 1px solid #09bbfe;
	    color: #666;
	    vertical-align: top;
	    padding: 0 22px 0 10px;
	    border-radius: 16px;
	    margin-right: 12px;
	    margin-bottom: 10px;
	    .close {
	      position: absolute;
	      right: 8px;
	      top: 10px;
	      display: inline-block;
	      width: 10px;
	      height: 10px;
	      background: url(../../../assets/icon_close.png) no-repeat;
	      background-size: 100% 100%;
	      cursor: pointer;
	    }
	  }
	}
	.match-suggestions__item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  height: 100%;
	  padding-right: 10px;
	}
	.searchInput {
		margin-bottom: 10px;
	}
	.selectWrap {
		display: flex;
		justify-content: space-between;
	}
	.ml-90 {
		margin-left: -90px;
	}
	.mb-10 {
		margin-bottom: 10px;
	}
	.select-area {
	  width: 500px;
	  display: flex;
	  flex-wrap: wrap;
    margin-left: 90px;
	  .selected-tag {
	    position: relative;
	    display: inline-block;
	    box-sizing: border-box;
	    height: 28px;
	    line-height: 28px;
	    min-width: 64px;
	    border: 1px solid #09bbfe;
	    color: #666;
	    font-size: 14px;
	    vertical-align: top;
	    padding: 0 22px 0 10px;
	    border-radius: 16px;
	    margin-right: 12px;
	    margin-bottom: 10px;
	    .close {
	      position: absolute;
	      right: 8px;
	      top: 10px;
	      display: inline-block;
	      width: 10px;
	      height: 10px;
	      background: url(../../../assets/icon_close.png) no-repeat;
	      background-size: 100% 100%;
	      cursor: pointer;
	    }
	  }
	}
</style>
<template>
	<div>
		<!-- 标签类型 -->
		<sn-form-item label="标签类型">
		  <sn-select v-model="tagType" placeholder="请选择" radius="6" width="100%" @change="changeType">
		    <sn-option v-for="item in tagTypeList" :key="item.value" :name="item.name" :value="item.value"></sn-option>
		  </sn-select>
		</sn-form-item>
		<!-- 标签 -->
		<sn-form-item :label="labelName+'标签'" v-show="tagType!=7 && tagType!=8 && tagType!=9">
	  	<sn-autocomplete 
	  		v-show="tagType==2 || tagType==6"
	  		class="searchInput"
        v-model="searchInput"
        valueKey="matchName"
        :fetchSuggestions="querySearchAsync"
        :isSuggestionsPages="true"
        placeholder="输入赛事关键词快速添加"
        historyKey="matchTag"
        @select="selectSearchItem"
        width="100%"
      >
        <template slot-scope="{item}" slot="history">
          {{item.matchName || item.competitionName}}
        </template>
        <template slot-scope="{item}">
          <div class="match-suggestions__item">
            <template v-if="item.matchName">
              <span>{{item.matchName}}</span>
              <span>{{item.matchDateTime}}</span>
            </template>
            <span v-else>{{item.competitionName}}</span>
          </div>
        </template>
      </sn-autocomplete>
		  <!-- 运动标签 -->
      <sn-select class="mb-10" v-show="tagType == 4 || tagType == 5 || tagType == 6" v-model="sportItemId" placeholder="请选择" radius="6" width="510" @change="selectSport">
		  	<sn-option value="" name="请选择"></sn-option>
		    <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId"></sn-option>
		  </sn-select>
		  <!-- 赛事标签 -->
		  <sn-select class="mb-10" v-show="tagType == 5 || tagType==6" v-model="competitionId" :disabled="sportItemId?false:true" placeholder="请选择" radius="6" width="510" @change="selectCompetition">
		  	<sn-option value="" name="请选择"></sn-option>
		    <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
		  </sn-select>
		  <div v-show="tagType==5 || tagType == 6" class="selectWrap">
		  	<!-- 赛季标签 -->
			  <sn-select v-model="seasonId" :disabled="competitionId?false:true" placeholder="请选择" radius="6" width="140" @change="selectSeason">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in seasonList" :key="item.seasonId" :name="item.seasonName" :value="item.seasonId"></sn-option>
			  </sn-select>
			  <!-- 阶段/轮次标签 -->
			  <sn-select v-model="roundId" :disabled="seasonId?false:true" placeholder="请选择" radius="6" width="140" @change="selectRound">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in roundList" :key="item.stageRoundId" :name="item.stageRoundName" :value="item.stageRoundId"></sn-option>
			  </sn-select>
			  <!-- 小组标签 -->
			  <sn-select v-show="tagType==5" v-model="groupId" :disabled="roundId?false:true" placeholder="请选择" radius="6" width="210" @change="selectGroup">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in groupList" :key="item.groupId" :name="item.groupName" :value="item.groupId"></sn-option>
			  </sn-select>
			  <!-- 比赛标签 -->
			  <sn-select v-show="tagType==6" v-model="matchId" :disabled="roundId?false:true" placeholder="请选择" radius="6" width="210" @change="selectMatch">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in matchList" :key="item.matchId" :name="item.matchName" :value="item.matchId"></sn-option>
			  </sn-select>
		  </div>
      <div class="selectWrap">
      	<!-- 运动标签 -->
	      <sn-select v-show="tagType==1 || tagType==2 || tagType == 3" v-model="sportItemId" placeholder="请选择" radius="6" :width="getWidth" @change="selectSport">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId"></sn-option>
			  </sn-select>
			  <!-- 赛事标签 -->
			  <sn-select v-show="tagType==2 || tagType == 3 || tagType == 4" v-model="competitionId" :disabled="sportItemId?false:true" placeholder="请选择" radius="6" :width="getWidth" @change="selectCompetition">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
			  </sn-select>
			  <!-- 赛季标签 -->
			  <sn-select v-show="tagType==3 || tagType==4" v-model="seasonId" :disabled="competitionId?false:true" placeholder="请选择" radius="6" :width="getWidth" @change="selectSeason">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in seasonList" :key="item.seasonId" :name="item.seasonName" :value="item.seasonId"></sn-option>
			  </sn-select>
			  <!-- 阶段/轮次标签 -->
			  <sn-select v-show="tagType==4" v-model="roundId" :disabled="seasonId?false:true" placeholder="请选择" radius="6" :width="getWidth" @change="selectRound">
			  	<sn-option value="" name="请选择"></sn-option>
			    <sn-option v-for="item in roundList" :key="item.stageRoundId" :name="item.stageRoundName" :value="item.stageRoundId"></sn-option>
			  </sn-select>
      </div>
		</sn-form-item>
		<sn-form-item v-show="tagType==7 || tagType==8 || tagType==9">
	    <team-tag class="ml-90" v-show="tagType==7" :ruleForm="ruleForm"></team-tag>
	  	<player-tag class="ml-90" v-show="tagType==8" :ruleForm="ruleForm"></player-tag>
	  	<custom-tag class="ml-90" v-show="tagType==9" :ruleForm="ruleForm"></custom-tag>
		</sn-form-item>
		<!-- 已选标签 -->
	  <section class="select-area">
      <span class="selected-tag" v-for="(item,index) in tags" :key="index">
        <slot name="item" :item="item">{{item['labelName']}}</slot>
        <span class="close" @click="close(index)"></span>
      </span>
    </section>
	</div>
</template>

<script>
	import DI from 'interface'
	import * as Constant from 'js/constant'
	import { fetchInfoInitDataAction } from '../../publish-management/publish/fetch'
	import { setHistoryArrData } from 'utils/util'
	import TeamTag from 'widgets/infoCommon/infoEditDetails/tags/team'
	import PlayerTag from 'widgets/infoCommon/infoEditDetails/tags/player'
	import CustomTag from 'widgets/infoCommon/infoEditDetails/tags/custom'
	export default {
		props: {

		},
		components: {
			TeamTag,
	    PlayerTag,
	    CustomTag
		},
		data() {
			return {
				ruleForm: {
					hideTag: true,
					teamLabels: [],
					playerLabels: [],
					customLabels: []
				},
				tagType: 1,
				tagTypeList: Constant.THEME_LABEL_TYPE,
				labelName: '运动',
				tags: [],
				searchInput: '',
				sportItemId: '', // 运动
				sportList: [],
				competitionId: '',// 赛事
				competitionList: [],
				seasonId: '', //赛季
				seasonList: [],
				groupId: '', //小组
				groupList: [],
				roundId: '', //阶段/轮次
				roundList: [],
				matchId: '', //比赛
				matchList: []
			}
		},
		computed: {
			getWidth() {
				switch(this.tagType) {
					case 1:
						return '510';
						break;
					case 2:
						return '250';
						break;
					case 3:
					case 4:
					case 5:
						return '160';
						break;
				}
			}
		},
		watch: {
	    'ruleForm.teamLabels': function(newVal, oldVal) { // labeType 8
	    	this.addTags(newVal);
	    },
	    'ruleForm.playerLabels': function(newVal, oldVal) { // labeType 9
	    	this.addTags(newVal);
	    },
	    'ruleForm.customLabels': function(newVal, oldVal) { // labeType 11
	    	this.addTags(newVal);
	    }
		},
		methods: {
			addTags(list) {
				list.filter(item => {
	    		let flag = true;
	    		this.tags.filter(tag => {
	    			if (item.labelId == tag.labelId && item.labelType == tag.labelType) flag = false;
	    		});
	    		if (flag) this.tags.push(item);
	    	});
			},
			getSportList() {
		   return new Promise((resolve, reject) => {
					fetchInfoInitDataAction(this, {
			      params: {
			        newsType: '1'
			      }
			    }).then(res => {
			    	this.sportList = res.sportsTypeList || [];
			    	resolve(this.sportList);
			    });
		    });
			},
			clearData() {
				this.tagType = 1;
				this.labelName = '运动';
				this.tags = [];
				this.searchInput = '';
				this.sportItemId = '';
				this.competitionId = ''; 
				this.competitionList = [];
				this.seasonId = '';
				this.seasonList = [];
				this.groupId = '';
				this.groupList = [];
				this.roundId = '';
				this.roundList = [];
				this.matchId = '';
				this.matchList = [];
			},
			getData() {
				return this.tags;
	    },
	    setData(tags) {
	    	this.tags = tags;
	    },
			changeType(val) {
				this.tagType = val;
				this.sportItemId = '';
				this.competitionId = '';
				this.competitionList = [];
				this.seasonId = '';
				this.seasonList = [];
				this.roundId = '';
				this.roundList = [];
				this.matchId = '';
				this.matchList = [];
				this.labelName = Constant.getItemByValue(this.tagTypeList, val).name;
			},
	    selectSport(sportItemId) {
	    	this.sportItemId = sportItemId;
	    	let flagIndex = this.tags.findIndex(val => val.labelId == sportItemId && val.labelType == 3);
	    	if (sportItemId && flagIndex == -1 && this.tagType == 1) { // 标签类型为运动自动添加
		    	this.tags.push({
		    		labelId: sportItemId,
		    		labelName: this.getName(sportItemId, 'sportItemId', 'sportItemName', this.sportList),
		    		labelType: 3
		    	});
	    	}
	    	if (sportItemId && this.tagType != 1) {
	    		this.getCompetitonList();
	    	}
    		this.competitionId = '';
				this.competitionList = [];
				this.seasonId = '';
				this.seasonList = [];
				this.groupId = '';
				this.groupList = [];
				this.roundId = '';
				this.roundList = [];
				this.matchId = '';
				this.matchList = [];
	    },
	    getName(ID, id, name, list) {
	    	let arr = list.filter(item => {
    			return item[id] == ID;
	    	});
	    	return arr[0][name];
	    },
	    selectCompetition(competitionId) {
	    	this.competitionId = competitionId;
	    	let flagIndex = this.tags.findIndex(val => val.labelId == competitionId && val.labelType == 4);
	    	if (competitionId && flagIndex == -1 && this.tagType == 2) {
		    	this.tags.push({
		    		labelId: competitionId,
		    		labelName: this.getName(competitionId, 'competitionId', 'competitionName', this.competitionList),
		    		labelType: 4
		    	});
	    	}
	    	if (competitionId && (this.tagType == 3 || this.tagType == 4 || this.tagType == 5 || this.tagType == 6)) {
	    		this.getSeasonList();
	    	}
    		this.seasonId = '';
    		this.seasonList = [];
    		this.roundId = '';
    		this.roundList = [];
    		this.matchId = '';
    		this.matchList = [];
	    },
	    selectSeason(seasonId) {
	    	this.seasonId = seasonId;
	    	let flagIndex = this.tags.findIndex(val => val.labelId == seasonId && val.labelType == 5);
	    	if (seasonId && flagIndex == -1 && this.tagType == 3) {
	    		let labelName = this.getName(this.competitionId, 'competitionId', 'competitionName', this.competitionList) + ' ' + this.getName(seasonId, 'seasonId', 'seasonName', this.seasonList);
	    		this.tags.push({
		    		labelId: seasonId,
		    		labelName: labelName,
		    		labelType: 5
		    	});
	    	}
	    	if (seasonId && (this.tagType == 4 || this.tagType == 5 || this.tagType == 6)) {
	    		this.getRoundList();
	    	}
    		this.roundId = '';
    		this.roundList = [];
    		this.groupId = '';
    		this.groupList = [];
    		this.matchId = '';
    		this.matchList = [];
	    },
	    selectRound(roundId) { // 阶段/轮次
	    	this.roundId = roundId;
	    	if (roundId && this.tagType == 4) {
	    		let flagIndex = this.tags.findIndex(val => val.labelId == roundId && val.labelType == 6);
		    	if (roundId && flagIndex == -1) {
		    		let labelName = this.getName(this.competitionId, 'competitionId', 'competitionName', this.competitionList) + ' ' + this.getName(roundId, 'stageRoundId', 'stageRoundName', this.roundList);
			    	this.tags.push({
			    		labelId: roundId,
			    		labelName: labelName,
			    		labelType: 6
			    	});
		    	}
	    	} else if (roundId && this.tagType == 5) {
	    		this.getGroupList();
	    	} else if (roundId && this.tagType == 6) {
	    		this.getMatchList();
	    	}
    		this.groupId = '';
    		this.groupList = [];
    		this.matchId = '';
    		this.matchList = [];
	    },
	    selectGroup(groupId) { // 小组标签类型 12？
	    	this.groupId = groupId;
	    	let flagIndex = this.tags.findIndex(val => val.labelId == groupId && val.labelType == 12);
	    	if (groupId && flagIndex == -1 && this.tagType == 5) {
	    		let labelName = this.getName(this.competitionId, 'competitionId', 'competitionName', this.competitionList) + ' ' + this.getName(groupId, 'groupId', 'groupName', this.groupList);
		    	this.tags.push({
		    		labelId: groupId,
		    		labelName: labelName,
		    		labelType: 12
		    	});
	    	}
	    },
	    selectMatch(matchId) {
	    	this.matchId = matchId;
	    	let flagIndex = this.tags.findIndex(val => val.labelId == matchId && val.labelType == 7);
	    	if (matchId && flagIndex == -1) { // 比赛
		    	this.tags.push({
		    		labelId: matchId,
		    		labelName: this.getName(matchId, 'matchId', 'matchName', this.matchList),
		    		labelType: 7
		    	});
	    	}
	    },
	    getCompetitonList() {
	    	this.$ajax({
          url: DI.infoLibrary.getGameList,
          type: 'get',
          data: {
            sportItemId: this.sportItemId
          },
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              const data = res.data;
              this.competitionList = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
	    },
	    getSeasonList() {
	    	this.$ajax({
          url: DI.infoLibrary.getSeasonList,
          type: 'get',
          data: {
          	sportItemId: this.sportItemId,
            competitionId: this.competitionId
          },
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              const data = res.data;
              this.seasonList = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
	    },
	    getGroupList() {
	    	this.$ajax({
          url: DI.infoLibrary.getGroupList,// 小组
          type: 'get',
          data: {
          	stageId: this.roundId
          },
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              const data = res.data;
              this.groupList = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
	    },
	    getRoundList() {
	    	this.$ajax({
          url: DI.infoLibrary.getRoundList,// 轮次
          type: 'get',
          data: {
          	sportItemId: this.sportItemId,
            competitionId: this.competitionId,
            seasonId: this.seasonId
          },
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              const data = res.data;
              this.roundList = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
	    },
	    getMatchList() {
	    	this.$ajax({
          url: DI.infoLibrary.getScheduleList,// 比赛
          type: 'get',
          data: {
          	sportItemId: this.sportItemId,
            competitionId: this.competitionId,
            seasonId: this.seasonId,
            stageRoundId: this.roundId
          },
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              const data = res.data;
              this.matchList = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
	    },
	    close(index) {
	    	this.tags.splice(index, 1);
	    },
	    querySearchAsync(options, cb) {
	      this.$ajax({
	        url: DI.infoLibrary.fetchMatchLabelsByTitle,
	        context: this,
	        loadingText: 'false',
	        data: JSON.stringify({
	          name: options.queryString,
	          pageIndex: options.pageIndex,
	          pageSize: options.pageSize
	        }),
	        success: res => {
	          const matchlist = (res.data || {}).matchlist || [];
	          cb(matchlist);
	        },
	        error: () => {
	          console.log('error');
	        }
	      });
	    },
	    selectSearchItem(item) {
	    	if (item.sportItemId) {
	    		this.sportItemId = parseInt(item.sportItemId);
	    		this.getCompetitonList();
	    	}
	    	if (item.competitionId) {
	    		this.competitionId = item.competitionId;
	    		this.getSeasonList();
	    	}
	    	if (item.seasonId) {
	    		this.seasonId = parseInt(item.seasonId);
	    		this.getRoundList();
	    	}
	    	if (item.stageRoundId) {
	    		this.roundId = item.stageRoundId;
	    		this.getMatchList();
	    	}
	    	if (item.matchId) this.matchId = parseInt(item.matchId);
    		setHistoryArrData('matchTag', [item], ['matchId', 'competitionId']);
	      // 比赛标签没有matchId不添加
	      let flagIndex = '';
	      flagIndex = this.tags.findIndex(val => val.labelId == item.matchId && val.labelType == 7);
        if (flagIndex == -1 && item.matchId && item.matchName && this.tagType == 6) {
          this.tags.push({
            labelId: item.matchId,
            labelName: item.matchName,
            labelType: 7
          });
        }
        // 赛事标签没有competitionId不添加
        flagIndex = this.tags.findIndex(val => val.labelId == item.competitionId && val.labelType == 4);
        if (flagIndex == -1 && item.competitionId && item.competitionName && this.tagType == 2) {
      		this.tags.push({
            labelId: item.competitionId,
            labelName: item.competitionName,
            labelType: 4
          });
        }
	    },
		}
	}
</script>