<template>
	<sn-search-box :fields="fields">
		<sn-search-item :children="[{
			label:'上架时间',
					type: 'duration',
					prop: ['startTime','endTime'],
					width:'200',
					showTimepicker:true
				}, {
					type: 'button',
					buttonType: 'primary',
					text: '查询',
					triggerEvent: query,
					isRight: true
				}]">
		</sn-search-item>
		<sn-search-item :children="[{
				type: 'input',
				prop: 'keyword',
				placeholder: '请输入关键字',
			}, {
				disabled: this.$parent.curNum >= MAX,
				type: 'button',
				buttonType: 'outline',
				text: '新增',
				triggerEvent: add,
				isRight: true
			}]">
		</sn-search-item>
		<sn-search-item :children="[{
			type:'slot',
			prop:'checkAll'
		},{
			type:'slot',
			prop:'delAll'
		}]">
			<sn-button slot="checkAll"
			  type="primary"
			  @click="toggleCheckAll(checkAll)">{{checkAll?'取消全选':'全选'}}</sn-button>
			<sn-button slot="delAll"
			  type="warning"
			  @click="delAll">批量删除</sn-button>
		</sn-search-item>
	</sn-search-box>
</template>
<script>
export default {
	name: 'searchCrumb',
	componentName: 'searchCrumb',
	props: ['checkAll', 'fields'],
	data () {
		return {
			fields: {},
			flag: false,
			MAX: 20
		}
	},
	methods: {
		add () {
			this.$bus.$emit('openDialog');
		},
		clearDateErrMsg () {
			this.$bus.$emit('clear-start-error');
			this.$bus.$emit('clear-end-error');
		},
		query () {
			this.clearDateErrMsg();
			if (!this.fields.startTime && this.fields.endTime) {
				this.$bus.$emit('start-error-info');
				return;
			}
			if (this.fields.startTime && !this.fields.endTime) {
				this.$bus.$emit('end-error-info');
				return;
			}
			if (this.fields.startTime > this.fields.endTime) {
        this.$message.warning('开始时间必须小于结束时间!');
				return;
			}
			this.$parent.queryList();
		},
		toggleCheckAll (flag) {
			this.$bus.$emit('checkAllBtn-click', !flag);
		},
		delAll () {
			let $borther = this.$parent.$refs.searchList;
			if ($borther.selecteds.length == 0) {
				this.$message.warning("请至少选中一条内容 !");
				return;
			}
			$borther.batchDelHandle();
		}
	}
}
</script>
