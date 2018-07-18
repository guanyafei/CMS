<template>
	<div id="idx">
		<sn-topbar title="热门搜索词" />
		<search-box ref="searchBox" :checkAll="checkAll" :fields="filterFields"></search-box>
		<List ref='searchList' :list="searchList" :selecteds.sync="selecteds" />
	</div>
</template>
<script>
	import List from './list';
	import DI from 'interface';
	import SearchBox from './search-box';
	export default {
		data() {
			return {
				searchList: [],
				selecteds: [],
				filterFields: {
					startTime: '',
					endTime: '',
					keyword: ''
				},
				curNum:0
			}
		},
		components: {
			List,
			SearchBox
		},
		computed: {
			checkAll: {
				get() {
					return this.searchList.length !== 0 && this.selecteds.length === this.searchList.length;
				},
				set(value) {
					if(value) {
						this.selecteds = this.searchList;
					} else {
						this.selecteds = [];
					}
				}
			}
		},
		created() {
			let _this = this;
			this.$bus.$on('checkAllBtn-click', (flag) => {
				_this.checkAll = flag;
			});
		},
		mounted() {
			this.queryList();
		},
		methods: {
			queryList() {
				let pms = {
					keyword: this.filterFields.keyword || '',
					startTime: this.filterFields.startTime || '',
					endTime: this.filterFields.endTime || ''
				};
				this.$ajax({
					url: DI.searchWord.queryList,
					data: JSON.stringify(pms),
					type: 'POST',
					context: this,
					loadingText: '正在查询，请稍候...',
					success: (res) => {
						if(res.retCode == '0') {
							this.searchList = res.data.keywordList || [];
							this.curNum = res.data.keywordNum;
							this.selecteds = [];
						} else {
							this.$message.error(res.retMsg);
						}
					},
					error: () => {
						console.error('error');
					}
				});
			}
		}
	}
</script>
