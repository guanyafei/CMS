<style scoped>
	.checkBox {
		display: flex;
    align-items: left;
		margin-bottom: 0;
    flex-direction: column
	}
	.selectAll {
		float: left;
    margin-top: 6px;
    width: 100%;
    text-align: left;
    span {
    	position: absolute;
	    top: 1px;
	    font-size: 14px;
	    color: #666666;
    }
	}
	.selectBox {
		margin-top: 5px;
    text-align: left;
		.selectBox-item {
	    margin: 0px 27px 10px 0px !important;
	    span {
	    	color: #999999;
	    }
		}
	}
</style>
<template>
	<div>
		<!-- 内容类型 -->
		<sn-form-item label="内容类型">
			<div class="checkBox">
				<sn-checkbox class="selectAll" v-model="isAllGraphic" @change="selectAllGraphic">
					<span>图文</span>
				</sn-checkbox>
				<sn-checkbox-group class="selectBox"
				  v-model="curCheckedValGraphic">
					<sn-checkbox class="selectBox-item"
					  :label="item.labelId+''"
					  v-for="(item,index) in graphicList"
					  :key="index">
					  	<span>{{item.labelName}}</span>
					  </sn-checkbox>
				</sn-checkbox-group>
			</div>
			<div class="checkBox">
				<sn-checkbox class="selectAll" v-model="isAllImage" @change="selectAllImage">
					<span>图集</span>
				</sn-checkbox>
				<sn-checkbox-group class="selectBox"
				  v-model="curCheckedValImage">
					<sn-checkbox class="selectBox-item"
					  :label="item.labelId+''"
					  v-for="(item,index) in imageList"
					  :key="index">
					  	<span>{{item.labelName}}</span>
					  </sn-checkbox>
				</sn-checkbox-group>
			</div>
			<div class="checkBox">
				<sn-checkbox class="selectAll" v-model="isAllVideo" @change="selectAllVideo">
					<span>视频</span>
				</sn-checkbox>
				<sn-checkbox-group class="selectBox"
				  v-model="curCheckedValVideo">
					<sn-checkbox class="selectBox-item"
					  :label="item.labelId+''"
					  v-for="(item,index) in videoList"
					  :key="index">
					  	<span>{{item.labelName}}</span>
					  </sn-checkbox>
				</sn-checkbox-group>
			</div>
		</sn-form-item>
		<labels ref="labels"></labels>
		<!-- 设置星级 -->
		<sn-form-item label="设置星级">
			<sn-rate v-model="rate" align="left"></sn-rate>
		</sn-form-item>
	</div>
</template>

<script>
	import DI from 'interface'
	import * as Constant from 'js/constant'
	import labels from './labels'
	export default {
		props: {

		},
		components: {
			labels
		},
		data() {
			return {
				isAllGraphic: false,
				graphicList: [],
				curCheckedValGraphic: [],
				isAllImage: false,
				imageList: [],
				curCheckedValImage: [],
				isAllVideo: false,
				videoList: [],
				curCheckedValVideo: [],
				rate: 1
			}
		},
		watch: {
			curCheckedValGraphic(newVal, oldVal) {
	      if (newVal.length) {
	          this.isAllGraphic = true;
	        } else {
	          this.isAllGraphic = false;
	        }
	    },
	    curCheckedValImage(newVal, oldVal) {
	      if (newVal.length) {
	          this.isAllImage = true;
	        } else {
	          this.isAllImage = false;
	        }
	    },
	    curCheckedValVideo(newVal, oldVal) {
	      if (newVal.length) {
	          this.isAllVideo = true;
	        } else {
	          this.isAllVideo = false;
	        }
	      }
		},
		methods: {
      getLabelList() {
        return new Promise((resolve, reject) => {
        	let typePromise = this.getTypeList();
        	let videoPromise = this.getVideoList();
        	let sportPromise = this.$refs.labels.getSportList();
        	Promise.all([typePromise, videoPromise, sportPromise]).then(([resType, resVideo, resSport]) => {
        		(resType.data.CategoryLabelList || []).filter(item => {
              if (item.labelType == '1') this.graphicList = item.categoryLabels;
              if (item.labelType == '2') this.imageList = item.categoryLabels;
            });
        		this.videoList = resVideo.data.videoCategoryLableList || [];
        		resolve();
        	});
        });
      },
      getTypeList() {
      	return new Promise((resolve, reject) => {
          this.$ajax({
            url: DI.label.typelist,
            type: 'post',
            loadingText: '正在查询初始化数据，请稍候···',
            context: this,
            success: (res) => {
              resolve(res);
            },
            error: () => {
              console.log("error");
            }
          });
        });
      },
      getVideoList() {
      	return new Promise((resolve, reject) => {
          this.$ajax({
            url: DI.theme.videoList,
            type: 'post',
            loadingText: '正在查询初始化数据，请稍候···',
            context: this,
            success: (res) => {
              resolve(res);
            },
            error: () => {
              console.log("error");
            }
          });
        });
      },
			clearData() {
				this.isAllGraphic = false;
				this.curCheckedValGraphic = [];
				this.isAllImage = false;
				this.curCheckedValImage = [];
				this.isAllVideo = false;
				this.curCheckedValVideo = [];
				this.rate = 1;
				this.$refs.labels.clearData();
			},
			getData() {
				let labels = [];
				this.curCheckedValGraphic.filter(labelId => {
					labels.push({
						labelId: parseInt(labelId),
						labelName: this.$refs.labels.getName(labelId, 'labelId', 'labelName', this.graphicList),
						labelType: 1,
            newsType: 1  //图文
					});
				});
				this.curCheckedValImage.filter(labelId => {
					labels.push({
						labelId: parseInt(labelId),
						labelName: this.$refs.labels.getName(labelId, 'labelId', 'labelName', this.imageList),
						labelType: 1,
            newsType: 2  //图集
					});
				});
				this.curCheckedValVideo.filter(labelId => {
					labels.push({
						labelId: parseInt(labelId),
						labelName: this.$refs.labels.getName(labelId, 'labelId', 'labelName', this.videoList),
						labelType: 1,
            newsType: 3  //视频
					});
				});

				return this.$refs.labels.getData().concat(labels);
	    },
	    setData(ruleForm) {
	    	this.rate = ruleForm.level;
				 // 标签类型
				let tags = (ruleForm.labelnrStr || []).filter(tag => { return tag.labelType != 1});
				this.$refs.labels.setData(tags);
				// 内容类型 查询id勾选
				let sptLabels = (ruleForm.labelnrStr || []).filter(tag => { return tag.labelType == 1});
				sptLabels.filter(label => {
					this.graphicList.filter(graphic => {
						if (label.labelId == graphic.labelId) {
							this.curCheckedValGraphic.push(label.labelId);
						}
					});
					this.imageList.filter(image => {
						if (label.labelId == image.labelId) {
							this.curCheckedValImage.push(label.labelId);
						}
					});
					this.videoList.filter(video => {
						if (label.labelId == video.labelId) {
							this.curCheckedValVideo.push(label.labelId);
						}
					});
				});
	    },
			selectAllGraphic() {
	      let list = [];
	      if (this.isAllGraphic) {
	        this.graphicList.filter(item => {
	          list.push(item.labelId + '');
	        });
	      }
	      this.curCheckedValGraphic = list;
	    },
	    selectAllImage() {
	      let list = [];
	      if (this.isAllImage) {
	        this.imageList.filter(item => {
	          list.push(item.labelId + '');
	        });
	      }
	      this.curCheckedValImage = list;
	    },
	    selectAllVideo() {
	    	let list = [];
	      if (this.isAllVideo) {
	        this.videoList.filter(item => {
	          list.push(item.labelId + '');
	        });
	      }
	      this.curCheckedValVideo = list;
	    },
		}
	}
</script>
