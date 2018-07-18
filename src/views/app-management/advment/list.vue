<style scoped>
  .container {
    .ibox {
      display: flex;
      align-items: center;
      min-height: 72px;
      padding: 0 20px;
      background: #fff;
      margin-bottom: 10px;
      &.end {
        justify-content: flex-end;
      }
      &.between {
        justify-content: space-between;
      }
      &.p20 {
        padding-top: 20px;
        padding-bottom: 20px;
      }
      .search-box {
        .time-box {
          display: flex;
          align-items: center;
          height: 30px;
          font-size: 12px;
          color: #999999;
          margin-bottom: 20px;
          margin-top: 20px;
          .time-text {
            margin-right: 10px;
          }
          .split {
            margin: 0 8px;
          }
        }
        .input-box {
          display: flex;
          margin-bottom: 20px;
          div {
            &+div {
              margin-left: 30px;
            }
          }
        }
        .select-box {
          display: flex;
          height: 30px;
          align-items: center;
          margin-bottom: 20px;
          color: #999;
          .text {
            margin-right: 10px;
          }
        }
      }
      .btns {
        display: flex;
        flex-direction: column;
        button {
          &+button {
            margin-top: 20px;
          }
        }
      }
    }
    .ibox-empty {
      margin-bottom: 10px;
    }
    a {
      color: #1684C2;
      &+a {
        margin-left: 10px;
      }
      &:hover {
       text-decoration: underline;
     }
    }
    .adv-info {
      display: flex;
      align-items: center;
      .img-wrap {
        position: relative;
        .id-info {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 12px;
          width: 100%;
          height: 22px;
          line-height: 22px;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
        }
        .adv-img {
          display: inline-block;
          width: 200px;
          height: 64.1px;
        }
      }
      .adv-title {
        padding-left: 8px;
      }
    }
    .remind-par {
      display: none;
      padding-top: 5px;
      color: #f00;
      font-size: 12px;
      &.error {
        display: block;
        position: relative;
        top: -15px;
      }
    }
    .form-item {
      margin-bottom: 15px;
    }
    .form-item__label {
      width: 80px;
    }
    .form-item__content {
      margin-left: 80px;
      display: flex;
      align-items: center;
      span {
        margin: 0 8px;
      }
    }
  }
</style>
<template>
	<div class="container">
		<sn-topbar title="广告管理" />
		<section class="ibox between">
			<div class="search-box">
				<div class="time-box"><span class="time-text">有效时间</span>
					<sn-timer width="180" placeholder="起始时间" ref="filterTimeS" :maxDate="ruleForm.endTime" v-model="ruleForm.startTime" showTimepicker />
					<span class="split">至</span>
					<sn-timer width="180" placeholder="结束时间" ref="filterTimeE" :minDate="ruleForm.startTime" v-model="ruleForm.endTime" showTimepicker />
				</div>
				<div v-if="filteTtimeRemind" class="remind-par error">开始时间不能大于或等于结束时间</div>
				<div class="input-box">
					<sn-input width="178" radius="16" placeholder="请输入广告标题" v-model="ruleForm.advTitle" :maxlength="30"></sn-input>
					<sn-input width="178" radius="16" placeholder="请输入跳转链接/ID" v-model="ruleForm.advJumpUrl" :maxlength="30"></sn-input>
				</div>
				<div class="select-box">
					<span class="text">跳转类型</span>
					<sn-select v-model="ruleForm.advJumpType" ref="select" placeholder="请选择" radius="16" width="120" @change="filterJumpChangeHandler">
						<sn-option name='全部' value='0'></sn-option>
						<sn-option v-for="item in selectList" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
					</sn-select>
				</div>
			</div>
			<div class="btns">
				<sn-button type="primary" @click="searchHandler">查询</sn-button>
				<sn-button type="default" @click="reset">重置</sn-button>
				<sn-button type="outline" @click="add">添加广告</sn-button>
			</div>
		</section>
		<sn-table :data="list" ref="table1">
			<sn-table-column label="顺序" width="5%" sloted>
				<template slot-scope="row">
					{{(pageIndex?(pageIndex-1)*pageSize:0)+row.$index+1}}
				</template>
			</sn-table-column>
			<sn-table-column label="广告基本信息" prop="info" width="30%" align="left" sloted>
				<template slot-scope="row">
					<div class="adv-info">
						<div class="img-wrap">
							<img alt="" class="adv-img" :src="row.advImgUrl" />
							<p class="id-info">ID：{{row.advId}}</p>
						</div>
						<span class="adv-title">{{row.advTitle}}</span>
					</div>
				</template>
			</sn-table-column>
			<sn-table-column label="跳转类型" prop="advJumpType" width="10%"></sn-table-column>
			<sn-table-column label="跳转链接/ID" prop="advJumpUrl" width="10%"></sn-table-column>
			<sn-table-column label="展示标签" prop="showLabel" width="10%"></sn-table-column>
			<sn-table-column label="生效时间" prop="startTime" width="10%"></sn-table-column>
			<sn-table-column label="失效时间" prop="endTime" width="10%"></sn-table-column>
			<sn-table-column label="广告状态" prop="advstate" width="10%" sloted>
				<template slot-scope="row">
					{{advStatus(row.startTime, row.endTime)}}
				</template>
			</sn-table-column>
			<sn-table-column label="操作" width="5%" sloted>
				<template slot-scope="row">
					<div class="is-column">
						<a href="javascript:;" @click="edit(row)">编辑</a>
						<br>
						<a href="javascript:;" @click="showDelConfirm(row)">删除</a>
					</div>
				</template>
			</sn-table-column>
		</sn-table>
		<sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
		<!-- 删除框 -->
		<sn-confirm txt ref="delConfirm" title="删除提醒" :flag="delConFlag" @sure="deleteAdv" @close="hideDelConfirm">
			确认删除该条广告？
		</sn-confirm>
		<sn-confirm ref="confirm" :title='modalTitle' txt @sure="advsure('formData')" @close="advclose" :flag="advFlag">
			<sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
				<sn-form-item label="内容类型" prop="advType" v-show="advTypeIsShow">
					<sn-select v-model="formData.advType" ref="select" placeholder="请选择" radius="16" width="120" @change="contentChangeHandler">
						<sn-option v-for="item in typelist" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
					</sn-select>
				</sn-form-item>
				<sn-form-item label="广告标题" prop="advTitle">
					<sn-input placeholder="请输入广告标题" v-model="formData.advTitle" :maxlength="30" :totalWords="30" width="306" :showWord="true" />
				</sn-form-item>
				<sn-form-item label="广告封面" prop="advImgUrl" ref="advImgUrl">
					<sn-cropper :aspectRatio="702/225" v-model='formData.advImgUrl' ref="cropper" label="封面" width="307" :height="307*225/702+''" />
				</sn-form-item>
				<sn-form-item label="跳转类型" prop="advJumpType">
					<sn-select v-model="formData.advJumpType" ref="select" placeholder="请选择" radius="6" width="306" @change="jumpChangeHandler">
						<sn-option v-for="item in selectList" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled">
						</sn-option>
					</sn-select>
				</sn-form-item>
				<sn-form-item :label="jumpLabel" prop="advJumpUrl">
					<sn-input :placeholder="jumpPlaceholder" v-model="formData.advJumpUrl" width="306" @blur="queryVedioSet" />
				</sn-form-item>
				<sn-form-item label="合集ID" prop="vedioSet" v-show="vedioSetIsShow">
					<sn-select v-model="formData.vedioSetId" ref="vedioselect" placeholder="请选择" width="306" @change="vedioSetChangeHandler">
						<sn-option v-for="item in vedioList" :key="item.setId" :title="item.setId+':'+item.setTitle" :name="handleCidTitle(item)" :value="item.setId" :disabled="item.disabled"></sn-option>
					</sn-select>
				</sn-form-item>
				<sn-form-item label="展示标签" prop="showLabel">
					<sn-input placeholder="请输入展示标签" v-model="formData.showLabel" width="306" />
				</sn-form-item>
				<div class="form-item">
					<label class="form-item__label">生效时间</label>
					<div class="form-item__content">
						<sn-timer width="138" radius="4" ref="timerS" v-model="formData.startTime" showTimepicker :maxDate="formData.endTime" />
						<span>至</span>
						<sn-timer width="138" radius="4" ref="timerE" v-model="formData.endTime" showTimepicker :minDate="formData.startTime" />
						<!-- <div class="form-time-error" style="display:none;">请选择时间</div> -->
					</div>
					<div v-if="timeRemind" class="remind-par">开始时间不能大于或等于结束时间</div>
				</div>
			</sn-form>
		</sn-confirm>
	</div>
</template>
<script>
	import DI from 'interface'
  import * as Constant from 'js/constant'
  import { VIDEOSET_URL } from 'utils/envUrl'

	export default {
		computed: {
			curSelecteds: {
				get() {
					return this.selecteds;
				},
				set(value) {
					this.$emit('update:selecteds', value);
				}
			}
		},
		watch: {
			curSelecteds(value) {
				this.$emit('update:selecteds', value);
			}
		},
		mounted() {
			let _this = this;

			// 点击全选按钮触发selecteds改变
			this.$bus.$on("checkboxAll-click", (type) => {
				if(type) {
					let checks = _this.list.reduce((perVal, val) => {
						perVal.push(val.commId);
						return perVal;
					}, []);
					_this.selecteds = [...checks];
				} else {
					_this.selecteds = [];
				}
			});
		},
		data() {
			return {
				pageIndex: 0, //默认是0
				pageSize: 20, //默认是20
				dataTotal: 2, //查询出来的数据条数
				formData: {
					advType: 2,
					advTitle: '',
					advImgUrl: '',
					advJumpType: '',
					advJumpUrl: '',
					showLabel: '',
					startTime: '',
					endTime: '',
					vedioSetId: ''
				},
				ruleForm: {
					advJumpType: '',
					advJumpUrl: '',
					advTitle: '',
					advType: 2,
					endTime: '',
					startTime: ''
				},
				typelist: Constant.ADV_TYPE_LIST,
				list: [],
				advFlag: false,
				selectList: Constant.JUMP_TYPE,
				delConFlag: false, //删除弹框显示开关
				delContent: {},
				vedioList: [], // 合集ID
				rules: {
					advTitle: [{
						required: true,
						min: 5,
						max: 30,
						message: '请输入广告标题，长度为[5,30]个字符',
						trigger: 'change'
					}],
					advImgUrl: [{
						required: true,
						message: '请上传图片',
						trigger: 'change'
					}],
					advJumpType: [{
						required: true,
						type: 'number',
						message: '请选择跳转类型',
						trigger: 'change'
					}],
					advJumpUrl: [{
						required: true,
						message: '请输入跳转地址',
						trigger: 'change'
					}],
					vedioSet: [{
						required: false,
						message: '请输入合集ID',
						trigger: 'change'
					}],
					showLabel: [{
						required: false,
						min: 2,
						max: 2,
						message: '请输入展示标签，长度为2个字符',
						trigger: 'change'
					}],
					startTime: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'change'
					}],
					endTime: [{
						required: true,
						message: '请选择结束时间',
						trigger: 'change'
					}]
				},
				jumpLabel: '跳转地址',
				jumpPlaceholder: '请输入跳转地址',
				vedioSetIsShow: false, // 跳转类型选择视频的时候，根据选择的视频查询，如果对应的视频有合集，显示组件，默认不显示
				advTypeIsShow: false, // 内容类型暂时默认为视频，不显示
				filteTtimeRemind: false, // 过滤部分时间校验不符的校验提示
				timeRemind: false // 创建部分时间校验不符的校验提示
			}
		},
		mounted() {
			this.queryList(0);
		},
		methods: {
			toggleCheckAll(type){
				this.$bus.$emit('checkAllBtn-click', !type);
			},

			timeFormat(time) {
				var a = time.split(/[^0-9]/);
				var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4]);
				return d.getTime();
			},
			advStatus(start, end) {
				let s = this.timeFormat(start);
				let e = this.timeFormat(end);
				let curTime = new Date().getTime();
				if(curTime < s) {
					return '未开始';
				} else if(s <= curTime && curTime <= e) {
					return '进行中';
				} else {
					return '已结束';
				}
			},
			searchHandler() {
				let getStartTime = parseInt(new Date(this.ruleForm.startTime).getTime(), 10),
					getEndTime = parseInt(new Date(this.ruleForm.endTime).getTime(), 10);
				if(getStartTime >= getEndTime) {
					this.filteTtimeRemind = true;
					return false;
				} else {
					this.filteTtimeRemind = false;
				}
				this.queryList(0);
			},
			clearVal() {
				this.formData = {
					advType: 2,
					advTitle: '',
					advImgUrl: '',
					advJumpType: '',
					advJumpUrl: '',
					showLabel: '',
					startTime: '',
					endTime: ''
				};
				this.timeRemind = false;
				this.$refs.formData.resetFields();
				this.jumpLabel = '跳转链接';
				this.jumpPlaceholder = '请输入跳转链接';
				this.vedioSetIsShow = false;
				this.$refs.timerS.showErr(false);
				this.$refs.timerE.showErr(false);
			},
			goto(num) {
				this.pageIndex = num;
				this.queryList(num);
			},
			advsure(formName) {
				// 时间校验
				let getStartTime = parseInt(new Date(this.formData.startTime).getTime(), 10),
					getEndTime = parseInt(new Date(this.formData.endTime).getTime(), 10);
				if(getStartTime >= getEndTime) {
					this.timeRemind = true;
					return false;
				} else {
					this.timeRemind = false;
				}
				this.$refs[formName].validate((valid) => {
					if(valid && this.formData.startTime != '' && this.formData.endTime != '') {
						let url = '';
						if(this.modalTitle === '添加广告') {
							url = DI.appAdvment.addCommonAdv;
						} else {
							url = DI.appAdvment.editCommonAdv;
						}
						this.$ajax({
							url: url,
							data: JSON.stringify(this.formData),
							context: this,
							loadingText: this.modalTitle === '添加广告' ? '正在添加，请稍候...' : '正在保存，请稍候...',
							success: (res) => {
								if(res.retCode == '0') {
									this.$message.success('提交成功');
									this.clearVal();
									this.advFlag = false;
									setTimeout(() => {
										this.queryList(this.pageIndex)
									}, 1000);
								} else {
									this.$message.error(res.retMsg);
								}
							},
							error: () => {
								console.error('error')
							}
						});
					} else {
						if(this.formData.startTime == '') {
							this.$refs.timerS.showErr('请选择开始时间');
						}
						if(this.formData.endTime == '') {
							this.$refs.timerE.showErr('请选择结束时间');
						}
						return false;
					}
				});
			},
			advclose() {
				this.clearVal();
				this.advFlag = false;
			},
			add() {
				this.modalTitle = '添加广告';
				this.advFlag = true;
			},
			edit(row) {
				if(row.vedioSetId) {
					this.vedioSetIsShow = true;
				}
				this.formData = {
					advId: row.advId,
					advType: 2,
					advTitle: row.advTitle,
					advImgUrl: row.advImgUrl,
					advJumpType: row.advJumpTypeNum,
					advJumpUrl: row.advJumpUrl,
					showLabel: row.showLabel,
					startTime: row.startTime,
					endTime: row.endTime,
					vedioSetId: row.vedioSetId || ''
				};
				this.jumpLabel = Constant.ADVMENT_LABEL[row.advJumpTypeNum - 1].label;
				this.modalTitle = '编辑广告';
				this.advFlag = true;
				this.queryVedioSet();
			},
			showDelConfirm(row) { //显示删除确认框
				this.delConFlag = true;
				this.delContent = row;
			},
			hideDelConfirm() {
				this.delConFlag = false;
			},
			deleteAdv() {
				let params = {};
				params.advId = this.delContent.advId;
				params.advType = 2;
				this.$ajax({
					url: DI.appAdvment.removeCommonAdv,
					data: params,
					type: 'GET',
					context: this,
					success: (res) => {
						if(res.retCode == "0") {
							this.$message.success('删除成功');
							this.delConFlag = false;
							setTimeout(() => {
								this.queryList(this.pageIndex);
							}, 1300);
						} else {
							this.$message.error(res.retMsg);
						}
					},
					error: () => {
						console.log('error')
					}
				});
			},
			queryList(pageNum) {
				if(pageNum == 0) {
					this.pageIndex = pageNum;
					this.$bus.$emit('syncCurPage', 1);
				}
				var params = {};
				// 无跳转类型时不传参
				if(this.ruleForm.advJumpType !== '0') {
					params.advJumpType = this.ruleForm.advJumpType;
				}
				params.advJumpUrl = this.ruleForm.advJumpUrl;
				params.advTitle = this.ruleForm.advTitle;
				params.advType = 2;
				// 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
				params.startTime = this.$refs.filterTimeS.$refs.input.value;
				params.endTime = this.$refs.filterTimeE.$refs.input.value;
				params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
				params.pageSize = this.pageSize;
				params = this.$bus.deleteNullProperty(params);

        this.$ajax({
          url: DI.appAdvment.queryCommonAdv,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在查询，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.list = res.data.commonAdvList || [];
              this.list = this.conventType(this.list);//将返回的跳转类型的数值转换为相应类型的字符串
              this.dataTotal = res.data.commonAdvCount || 0;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log('error')
          }
        });
      },
      reset() { // 重置的方法
        this.ruleForm.advJumpUrl = '';
        this.ruleForm.advTitle = '';
        this.ruleForm.advType = 2;
        this.ruleForm.endTime = '';
        this.ruleForm.startTime = '';
        this.filteTtimeRemind = false;
      },
      filterJumpChangeHandler(val) {   // 过滤表单-跳转类型的change事件
        this.ruleForm.advJumpType = val;
        this.queryList(0);
      },
      contentChangeHandler(val) {  // 弹窗表单-内容类型的change事件
        this.formData.advType = val;
      },
      // 跳转类型的监听事件
      jumpChangeHandler(val) { // 弹窗表单-跳转类型的change事件
        this.vedioSetIsShow = false;
        this.formData.advJumpUrl = '';
        this.formData.advJumpType = val;
        this.jumpLabel = Constant.ADVMENT_LABEL[val - 1].label;
        this.jumpPlaceholder = Constant.ADVMENT_LABEL[val - 1].placeholder;
      },
      conventType(list) {   // 将返回的跳转类型的数值转换为相应类型的字符串
        if(!list) return;
        let listlen = list.length;
        for (let i = listlen - 1; i >= 0; i--) {
          let num = list[i].advJumpType;
          list[i].advJumpTypeNum = num;
          list[i].advJumpType = this.selectList[num - 1].name;
        }
        return list;
      },
      // 选择合集的change事件
      vedioSetChangeHandler(val) {
        this.formData.vedioSetId = val+'';
      },
      handleCidTitle(item) {
        return item.setId + ':' + (item.setTitle && item.setTitle.length > 15 ? (item.setTitle.slice(0, 15) + '...') : item.setTitle);
      },
      // 如果选择的跳转类型是视频，输入视频ID的时候需要查询是否有合集ID，若有显示合集ID的输入框
      queryVedioSet() {
        if(this.jumpLabel==='视频ID') {
          let vedioId  = this.formData.advJumpUrl;
          if(!vedioId && !this.vedioSetIsShow) return;
          $.ajax({
            url: `${VIDEOSET_URL}/bppchannel.api?id=${vedioId}&showset=1&format=jsonp`,
            data: {},
            dataFilter: function(data) {
              return data;
            },
            loadingText: '正在查询合集列表，请稍候...',
            dataType: "jsonp",
            type: 'GET',
            context: this,
            success: (res) => {
              if(res.channels && res.channels.length){
                this.vedioSetIsShow = true;
                this.vedioList = res.channels[0].setRelates || [];
              } else {
                this.vedioSetIsShow = false;
              }
            },
            error: () => {
              console.error('error')
              this.vedioSetIsShow = false;
            }
          });
        } else {
          return false;
        }
      }
    }
  }
</script>
