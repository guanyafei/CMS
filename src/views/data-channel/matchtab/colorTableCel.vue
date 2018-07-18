<style scoped>
	.rank-wrap {
    p {
      display: flex;
      margin-bottom: 4px;
    }
    .label {
      margin-right: 10px;
    }
    .rank-colour {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 4px;
      &.bg-red {
        background: #FA4C4C;
      }
      &.bg-blue {
        background: #4C97FA;
      }
      &.bg-purple {
        background: #B729DB;
      }
      &.bg-green {
        background: #00B255;
      }
      &.bg-grey {
        background: #909090;
      }
      &.hack {
        margin-top: -2px;
      }
    }
    .rank-name {
      max-width: 90px;
      text-align: left;
      line-height: 1.3;
    }
  }
</style>
<template>
	<div class="rank-wrap">
		<p v-if="colorList.red_list.length">
	    <span class="rank-colour bg-red"></span>
	    <span class="rank-name">{{colorList.red_list.join('、')}}</span>
	  </p>
	  <p v-if="colorList.blue_list.length">
      <span class="rank-colour bg-blue"></span>
      <span class="rank-name">{{colorList.blue_list.join('、')}}</span>
    </p>
    <p v-if="colorList.purple_list.length">
      <span class="rank-colour bg-purple"></span>
      <span class="rank-name">{{colorList.purple_list.join('、')}}</span>
    </p>
    <p v-if="colorList.green_list.length">
      <span class="rank-colour bg-green"></span>
      <span class="rank-name">{{colorList.green_list.join('、')}}</span>
    </p>
    <p v-if="colorList.grey_list.length">
      <span class="rank-colour bg-grey"></span>
      <span class="rank-name">{{colorList.grey_list.join('、')}}</span>
    </p>
	</div>
</template>
<script>
	export default {
		props:{
			tableInfo: {
	      type: Object,
	      default: function() {
	        return {};
	      }
	    }
		},
		data() {
			return{
				colorList: {
        	red_list: [],
        	blue_list: [],
        	purple_list: [],
        	green_list: [],
        	grey_list: []
        }
			}
		},
    watch: {
      tableInfo(val) {
        this.handleMatchTabColor(val);
      }
    },
		mounted() {
      this.handleMatchTabColor(this.tableInfo);
		},
		methods: {
			handleMatchTabColor(row) {
        let list = row.matchTabColorEntityList || [];
        let colorList = {
        	red_list: [],
        	blue_list: [],
        	purple_list: [],
        	green_list: [],
        	grey_list: []
        };
        list.filter((item) => {
          switch(item.color) {
            case '#FA4C4C':
              colorList.red_list.push(item.rank);
              break;
            case '#4C97FA':
              colorList.blue_list.push(item.rank);
              break;
            case '#B729DB':
              colorList.purple_list.push(item.rank);
              break;
            case '#00B255':
              colorList.green_list.push(item.rank);
              break;
            case '#909090':
              colorList.grey_list.push(item.rank);
              break;
          }
        });
        this.colorList = colorList;
      },
		}
	}
</script>
