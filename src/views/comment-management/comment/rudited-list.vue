<template>
    <!-- 已审核列表-->
    <div id="rudited-list">
        <sn-datatable :data="list" ref="ruditedList" :border="true">
            <sn-datacolumn label="自定义" prop="checkbox" width="2%" :column-border="false">
            <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
            <template slot="checkbox" slot-scope="cell">
            <sn-checkbox type="checkbox" :label="cell.row" v-model="curSelecteds"></sn-checkbox>
            </template>
        </sn-datacolumn>
            <sn-datacolumn label="评论ID" prop="commId" width="5%" alignment="center"></sn-datacolumn>
            <sn-datacolumn label="评论内容" prop="commContent" width="20%" alignment="center">
                <template slot-scope="cell" slot="commContent">
                    <column-content :row="cell.row">
                        <template slot="desc">
                            <div v-html="fmtComment(cell.row)" :title="(cell.row.replyComment && cell.row.replyComment.commContent) || (cell.row.parentComment && cell.row.parentComment.commContent)" style="display:inline;"></div>
                        </template>
                    </column-content>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="内容信息" prop="commTitle" width="10%" alignment="center">
                <template slot-scope="cell" slot="commTitle">
                    <column-info :row="cell.row"></column-info>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="发表时间" prop="createTime" width="6%" alignment="center">
                <template slot-scope="cell" slot="createTime">
                    <p>{{fmtDisplayDateTime(cell.row.createTime).date}}</p>
                    <p class="mt-5">{{fmtDisplayDateTime(cell.row.createTime).time}}</p>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="评论人" prop="userId" width="7%" alignment="center">
                <template slot-scope="cell" slot="userId">
                    <div>
                        <div>ID: {{cell.row.userId}}</div>
                        <div class="mt-5">{{cell.row.userNickName}}</div>
                        <div class="day mt-5" v-show="getBanItem(cell.row.forbiddenStatus).key!=='normal'">
                        <sn-button type="warning" style="padding-right:5px;padding-left:5px;">
                            {{
                            getBanItem(cell.row.forbiddenStatus).key === "forever"?
                            getBanItem(cell.row.forbiddenStatus).name
                            :
                            `禁言剩余${cell.row.forbiddenDays}天`
                            }}
                        </sn-button>
                        </div>
                    </div>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="展示状态" prop="forbiddenStatus" width="4%" alignment="center">
                <template slot-scope="cell" slot="forbiddenStatus">
                    <div>
                        {{ cell.row | displayStatus}}
                    </div>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="评论来源" prop="commSource" width="5%" alignment="center">
                <template slot-scope="cell" slot="commSource">
                    <div>
                        {{ cell.row | getItemSource}}
                    </div>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="后台发布工号" prop="soaUserId" width="6%" alignment="center"></sn-datacolumn>
            <sn-datacolumn label="操作记录" prop="commId" width="7%" alignment="center">
                <template slot-scope="cell" slot="commId">
                    <div>
                        <p>{{cell.row.operationUser || '-'}}</p>
                        <p class="mt-5">{{fmtDisplayDateTime(cell.row.operationDate).date}}</p>
                        <p class="mt-5">{{fmtDisplayDateTime(cell.row.operationDate).time}}</p>
                        <p class="mt-5">{{cell.row.operationType | getOperationType}}</p>
                    </div>
                </template>
            </sn-datacolumn>
            <sn-datacolumn label="操作" prop="opt" width="5%" alignment="center">
                <template slot-scope="cell" slot="opt">
                    <div>
                        <toggle-hide :row="cell.row"></toggle-hide>
                        <toggle-forbidden :row="cell.row"></toggle-forbidden>
                        <edit-like :row="cell.row"></edit-like>
                        <reply :row="cell.row"></reply>
                    </div>
                </template>
            </sn-datacolumn>
        </sn-datatable>
    </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import { findSensitive } from 'js/filters'
import ColumnContent from './column/column-content'//评论内容
import ColumnInfo from './column/column-info'//内容信息
import ToggleHide from './column/actions/toggle-hide'//隐藏
import ToggleForbidden from './column/actions/toggle-forbidden'//用户禁言
import EditLike from './column/actions/edit-like'//修改点赞数
import Reply from './column/actions/reply' //回复
export default {
    name:'RuditedList',
    components:{
        ColumnContent,
        ColumnInfo,
        ToggleHide,
        ToggleForbidden,
        EditLike,
        Reply
    },
    props:{
        selecteds:{
            type:Array
        },
        list:{
            type:Array,
            default:function(){
                return [];
            }
        },
        checkAll:Boolean
    },
    computed:{
        curSelecteds:{
            get(){
                return this.selecteds;
            },
            set(val){
                this.$emit('update:selecteds',val);
            }
        }
    },
    watch:{
        curSelecteds(newVal){
            this.$emit('update:selecteds', newVal);
        }
    },
    filters:{
        //展示状态
        displayStatus(row){
            return Constant.getItemByValue(Constant.COMMENT_STATUS, row.commStatus).name;
        },
        //评论来源
        getItemSource(row){
            return Constant.getItemByValue(Constant.COMMENT_SOURCE_TYPE, row.commSource).name || '前台评论';
        },
        //操作类型
        getOperationType(val){
            switch(val){
                case 1:
                return '审核通过'
                break;
                case 2:
                return '隐藏'
                break;
                case 3:
                return '取消隐藏'
                break;
                default: '';
            }
        }
    },
    methods:{
        //格式化评论,分类父级与引用
        fmtComment(row){
            let fmt = '',len = 0;
            if(row.replyComment){//引用
                len = row.replyComment.commContent.length;
                fmt = row.replyComment.commContent;
                if(row.commImgList && row.commImgList.length){
                    if(len > 50){
                    fmt = `${fmt.substr(0,50)}...`; 
                    }
                }else{
                    if(len > 100){
                    fmt = `${fmt.substr(0,100)}...`; 
                    }
                }
                return  `//<span style="color:#0abbfe">${row.replyComment.userNickName || '匿名用户'}: </span>${row.replyComment.commImgList && row.replyComment.commImgList.length ? '[图片]':''}${findSensitive(fmt)}`;
            }
            if(row.parentComment){//父级
                len = row.parentComment.commContent.length;
                fmt = row.parentComment.commContent;
                if(row.commImgList && row.commImgList.length){
                    if(len > 50){
                    fmt = `${fmt.substr(0,50)}...`; 
                    }
                }else{
                    if(len > 100){
                    fmt = `${fmt.substr(0,100)}...`; 
                    }
                }
                return  `//<span style="color:#0abbfe">${row.parentComment.userNickName || '匿名用户'}: </span>${row.parentComment.commImgList && row.parentComment.commImgList.length ? '[图片]':''}${findSensitive(fmt)}`;
            }
            return '';
        },
        getBanItem(val) {
            return Constant.getItemByValue(Constant.BANNED_STATUS, val);
        },
        handleCheckAllChange(event) {
        this.$emit('update:checkAll', event.target.checked);
        },
        fmtDisplayDateTime(dateTime){
            if(!dateTime){
                return '-';
            }
            dateTime = dateTime.split(' ');
            return {date:dateTime[0],time:dateTime[1]}
        }
    }
}
</script>
<style>
 .day{
     .sn-button.sn-button--warning{
         padding-right:5px !important;
         padding-left:5px !important;
     }
 }
 .text-over{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-align: left;
    line-height: 16px;
    cursor: default;
 }
</style>
