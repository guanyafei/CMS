<style scoped>
.container {
	.btn_boxs {
		display: flex;
		flex-direction: column;
		align-items: center;
		p {
			margin-top: 10px;
			button {
				margin-right: 16px;
			}
		}
	}
	.form-item {
		margin-top: 10px;
		.form-item__label:before {
			content: "";
			display: inline-block;
			width: 6px;
			height: 6px;
			background: #09BBFE;
			border-radius: 50%;
			margin-right: 5px;
			vertical-align: middle;
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
	.remind-par {
		padding-top: 5px;
		color: #f00;
		font-size: 12px;
		text-align: left;
		width: 100%;
	}
}
</style>
<template>
	<div class="container">
		<!--列表数据-->
		<sn-table :data="list"
		  ref="table">
			<sn-table-column width="40"
			  wall="false"
			  tdPaddingRight="5"
			  sloted>
				<template slot-scope="row">
					<sn-checkbox v-model="curSelecteds"
					  :label="row"
					  theme="radio"></sn-checkbox>
				</template>
			</sn-table-column>
			<sn-table-column label="序号"
			  align="center"
			  prop="index"
			  width="10%"
			  sloted>
				<template slot-scope="row">{{row.$index+1}}</template>
			</sn-table-column>
			<sn-table-column label="关键词"
			  align="center"
			  prop="keyword"
			  width="15%"></sn-table-column>
			<sn-table-column label="状态"
			  align="center"
			  prop="status"
			  width="15%"
			  sloted>
				<template slot-scope="row">{{row.status == 1 ? '上架' : '下架'}}</template>
			</sn-table-column>
			<sn-table-column label="开始时间"
			  align="center"
			  prop="startTime"
			  width="15%"></sn-table-column>
			<sn-table-column label="结束时间"
			  align="center"
			  prop="endTime"
			  width="15%"></sn-table-column>
			<sn-table-column label="修改人"
			  align="center"
			  prop="soaUserId"
			  width="15%"></sn-table-column>
			<sn-table-column label="操作"
			  align="center"
			  width="15%"
			  sloted>
				<template slot-scope="row">
					<div class="btn_boxs">
						<p>
							<sn-button type="text"
							  size="mini"
							  @click="edit(row)">编辑</sn-button>
							<sn-button type="text"
							  size="mini"
							  @click="del(row)">刪除</sn-button>
						</p>
						<p>
							<sn-button type="text"
							  size="mini"
							  @click="move(1,row)"
							  :disabled='row.$index == 0'>上移</sn-button>
							<sn-button type="text"
							  size="mini"
							  @click="move(2,row)"
							  :disabled="row.$index == list.length-1">下移</sn-button>
						</p>
					</div>
				</template>
			</sn-table-column>
		</sn-table>
		<!--删除弹框-->
		<sn-confirm v-if="delFlag"
		  title="删除热门搜索词"
		  @close='close'
		  @sure='submit'
		  txt
		  noflag>
			确认将删除当前内容？
		</sn-confirm>
		<sn-confirm v-if="viewType == 'batchDel'"
		  txt
		  title="删除热门搜索词"
		  ref="delConfirm"
		  @sure="delSearch"
		  @close="close">
			确认删除选中的内容?
		</sn-confirm>
		<!--表单弹框-->
		<sn-confirm txt
		  :title="modalTitle"
		  ref="confirm"
		  :flag="searchFlag"
		  @sure="save('formData')"
		  @close="close">
			<sn-form :model="formData"
			  ref="formData"
			  :rules="rules"
			  labelWidth="80px"
			  formWidth="420">
				<sn-form-item label="关键词"
				  prop="keyword">
					<sn-input v-model="formData.keyword"
					  placeholder="请输入关键词20字以内"
					  width="306"
					  :maxlength="20"
					  @input="handleChange"></sn-input>
					<div class="remind-par"
					  v-if="labelRemind">当前已存在相同的关键字,请重新输入!</div>
				</sn-form-item>
				<div class="form-item">
					<label class="form-item__label">上架时间</label>
					<div class="form-item__content">
						<sn-timer width="160"
						  placeholder="起始时间"
						  radius="4"
						  ref="timerS"
						  v-model="formData.startTime"
						  showTimepicker />
						<span>至</span>
						<sn-timer width="160"
						  placeholder="结束时间"
						  radius="4"
						  ref="timerE"
						  v-model="formData.endTime"
						  :minDate="showTime"
						  showTimepicker />
					</div>
				</div>
			</sn-form>
		</sn-confirm>
	</div>
</template>
<script>
import * as constant from 'js/constant';
import DI from 'interface';
import SearchBox from './search-box';
export default {
	props: {
		selecteds: {
			type: Array
		},
		list: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	computed: {
		curSelecteds: {
			get () {
				return this.selecteds;
			},
			set (val) {
				this.$emit('update:selecteds', val);
			}
		}
	},
	watch: {
		curSelecteds (val) {
			this.$emit('update:selecteds', val);
		}
	},
	mounted () {
		this.$bus.$on('openDialog', () => {
			this.modalTitle = '新增热门搜索词';
			this.searchFlag = true;
			$('.sn-popup .sn-popup-modal .sn-popup-btns button').eq(0).text('保存');
		});
	},
	data () {
		return {
			showTime:new Date(),
			labelRemind: false,
			delFlag: false,
			viewType: '',
			selecteds: [],
			delContent: {},
			list: [],
			searchList: [],
			searchFlag: false,
			modalTitle: '',
			formData: {
				id: '',
				keyword: '',
				startTime: '',
				endTime: ''
			},
			rules: {
				keyword: [{
					required: true,
					message: '请输入关键字',
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
			}
		}
	},
	methods: {
		handleChange () {
			for (let i = 0; i < this.list.length; i++) {
				let item = this.list[i];
				if (this.formData.keyword != '' && this.formData.keyword == item.keyword) {
					this.labelRemind = true;
					return;
				} else {
					this.labelRemind = false;
				}
			}
		},
		clearData () { //清空数据；
			this.formData = {
				id: '',
				keyword: '',
				startTime: '',
				endTime: ''
			};
			this.labelRemind = false;
			this.$refs.formData.resetFields();
			this.$refs.timerS.showErr(false);
			this.$refs.timerE.showErr(false);
		},
		submit () { //删除提交
			this.viewtype = false;
			let pms = {
				keywordIds: [this.delContent.id]
			};
			this.$ajax({
				url: DI.searchWord.delWord,
				data: JSON.stringify(pms),
				context: this,
				loadingText: '正在删除，请稍候...',
				success: (res) => {
					if (res.retCode == '0') {
						this.$message.success('删除成功！');
						this.delFlag = false;
						setTimeout(() => {
							this.$parent.queryList();
						}, 1300);
					} else {
						this.$message.success(res.retMsg);
					}
				},
				error: () => {
					this.$message.success('删除失败！');
				}
			});
		},
		batchDelHandle () {
			this.viewType = 'batchDel';
		},
		del (row) { //弹框显示
			this.delContent = row;
			this.delFlag = true;
		},
		delSearch () { //确认删除
			this.viewType = '';
			let kwIds = this.curSelecteds.reduce((prevArr, ele) => {
				prevArr.push(ele.id);
				return prevArr;
			}, []);
			let pms = {
				keywordIds: kwIds
			};
			this.$ajax({
				url: DI.searchWord.delWord,
				data: JSON.stringify(pms),
				context: this,
				loadingText: '正在批量删除，请稍候...',
				success: (res) => {
					if (res.retCode == '0') {
						this.$message.success('批量删除成功！');
						this.delFlag = false;
						setTimeout(() => {
							this.$parent.queryList(); //刷新列表
						}, 1300);
					} else {
						this.$message.success(res.retMsg);
					}
				},
				error: () => {
					this.$message.success('删除失败！');
				}
			});
		},
		edit (row) { //编辑
			this.searchFlag = true;
			this.modalTitle = '编辑热门搜索词';
			this.formData.id = row.id;
			this.formData.keyword = row.keyword;
			this.formData.startTime = row.startTime;
			this.formData.endTime = row.endTime
		},
		move (flag, row) { //1上移， 2 下移
			this.$ajax({
				url: DI.searchWord.move,
				data: JSON.stringify({
					startTime: this.$parent.filterFields.startTime,
					endTime: this.$parent.filterFields.endTime,
					keyword: this.$parent.filterFields.keyword,
					id: row.id,
					moveType: flag,
				}),
				context: this,
				success: (res) => {
					if (res.retCode == '0') {
						this.$message.success(`${flag == 1 ? '上移' : '下移'}成功!`);
						setTimeout(() => {
							this.$parent.queryList(); //刷新列表
						}, 1300);
					} else {
						this.$message.error(res.retMsg);
					}
				},
				error: () => {
					console.error('error');
				}
			});
		},
		close () { //取消
			this.clearData();
			this.searchFlag = false;
			this.delFlag = false;
			this.viewType = '';
		},
		save (formName) { //保存
			//先对表单进行校验；
			this.$refs[formName].validate((valid) => {
				if (valid && this.formData.startTime != '' && this.formData.endTime != '' && this.formData.startTime <= this.formData.endTime) {
					let url = '';
					if (this.modalTitle == '新增热门搜索词') {
						url = DI.searchWord.addWord;
					} else {
						url = DI.searchWord.editWord;
					}
					this.$ajax({
						url: url,
						data: JSON.stringify(this.formData),
						context: this,
						loadingText: this.modalTitle == '新增热门搜索词' ? '正在添加，请稍候...' : '正在保存，请稍候...',
						success: (res) => {
							if (res.retCode == '0') {
								this.$message.success('保存成功！');
								this.clearData(); //清空数据；
								this.searchFlag = false;
								setTimeout(() => {
									this.$parent.queryList(); //刷新列表
								}, 1300);
							} else {
								this.$message.error(res.retMsg);;
							}
						},
						error: (res) => {
							console.error('error');
						}
					});
				} else {
					if (this.formData.startTime == '') {
						this.$refs.timerS.showErr('请选择开始时间');
					}
					if (this.formData.endTime == '') {
						this.$refs.timerE.showErr('请选择结束时间');
					}
					if (this.formData.startTime!= '' && this.formData.endTime != '' && this.formData.startTime > this.formData.endTime) {
						this.$refs.timerS.showErr('开始时间不能大于结束时间');
					}
				}
			});
		}
	}
}
</script>
