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
        margin-bottom: 20px;
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
      margin-left: 0;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .remind-text {
    display: none;
    margin-top: 0;
    padding: 0 0 9px 80px;
    font-size: 12px;
    color: #f00;
  }
  .btn-block {
    text-align: center;
    .sn-button--default {
      margin-left: 30px;
    }
    .lastStep {
      margin-right: 30px;
    }
  }
  .author-item {
    position: relative;
    .search-btn {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 86px;
    }
  }
  .info-par {
    padding-bottom: 12px;
  }
  .info-par p {
    padding: 3px 0;
  }
  .form-item__content {
    line-height: 32px;
    position: relative;
    font-size: 14px;
    margin-left: 80px;
    .form-item__error {
      color: #ff4949;
      font-size: 12px;
      line-height: 1;
      padding-top: 2px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
  .is-column {
    p {
      a {
        margin-right: 10px;
      }
      margin-bottom:10px;
    }
    line-height: 0.8;
  }
  .matchContainer {
    width: 640px;
    .form-item {
      padding: 0 30px;
      .form-item__label {
        width: 80px;
      }
      .form-item__content {
        margin-left: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .form-item__error {
          display: none;
        }
        .btn-search {
          background-color: #ccc;
        }
      }
    }
    tbody {
      height: 400px;
    }
  }
  .btn-disabled {
    background-color: #ccc;
  }
  .articleList {
    width: 555px;
  }
  .editMatchDesc {
    height: 60px;
  }
}
</style>
<template>
  <div class="container">
    <sn-topbar title="专题展示管理"
      labels="底部导航,推荐比赛,坑位管理"
      @tab="tabChange">
      <span slot="subtitle">专题名称: {{channel.channelName}} 专题ID: {{channel.channelId}}</span>
    </sn-topbar>
    <div v-show="tab == 0">
      <section class="ibox end">
        <div class="btns">
          <sn-button type="outline"
            @click="addLink">添加导航</sn-button>
        </div>
      </section>
      <sn-table ref="table0"
        :data="linkList">
        <sn-table-column label="顺序"
          prop="index"
          width="10%"
          sloted>
          <template slot-scope="row">
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label="导航名称"
          prop="navigationName"
          width="20%"></sn-table-column>
        <sn-table-column label="导航链接"
          prop="navigationUrl"
          width="50%"></sn-table-column>
        <sn-table-column label="操作"
          prop="opt"
          width="20%"
          sloted>
          <template slot-scope="row">
            <div class="is-column">
              <p>
                <a href="javascript:;"
                  @click="editLink(row)">编辑</a>
              </p>
              <p>
                <a v-if="row.$index"
                  href="javascript:;"
                  @click="move(1,row)">上移</a>
                <a v-if="row.$index != linkList.length -1 "
                  href="javascript:;"
                  @click="move(2,row)">下移</a>
              </p>
              <p>
                <a href="javascript:;"
                  @click="delLink(row.id)">删除</a>
              </p>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <div v-show="tab == 1">
      <section class="ibox end">
        <div class="btns">
          <sn-button type="outline"
            @click="addMatch">添加比赛</sn-button>
        </div>
      </section>
      <sn-table :data='topicList'
        ref='table1'>
        <sn-table-column label='顺序'
          width='13.75%'
          sloted>
          <template slot-scope='row'>
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label='节目ID'
          prop='matchitemShowId'
          width='13.75%'></sn-table-column>
        <sn-table-column label='节目名称'
          prop='matchitemShowName'
          width='15%'></sn-table-column>
        <sn-table-column label='节目信息'
          prop='matchDes'
          width='15%'></sn-table-column>
        <sn-table-column label='开始时间'
          prop='startTime'
          width='15%'></sn-table-column>
        <sn-table-column label='状态'
          width='13.75%'
          sloted>
          <template slot-scope="row">
            {{getMatchStatus(row.startTime, row.endTime)}}
          </template>
        </sn-table-column>
        <sn-table-column label='操作'
          width='13.75%'
          sloted>
          <template slot-scope="row">
            <div class="is-column">
              <a v-if="row.$index > 0"
                href="javascript:;"
                @click="exchange(1,row.$index)">上移</a><br v-if="row.$index > 0">
              <a v-if="(row.$index+1) < pageSize &&　dataTotal > (row.$index+1)"
                href="javascript:;"
                @click="exchange(2,row.$index)">下移</a><br v-if="(row.$index+1) < pageSize &&　dataTotal > (row.$index+1)">
              <a href="javascript:;"
                @click="showEditConfirm(row)">编辑</a><br>
              <a href="javascript:;"
                @click="showDelConfirm(row.channelId, row.id)">删除</a>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination :total="dataTotal"
        :size="pageSize"
        @goto="goto" />
      <sn-confirm txt
        ref="delConfirm"
        :flag="delConFlag"
        @sure="delChannel(delChannelId,delId)"
        @close="hideDelConfirm">
        确定要删除吗？
      </sn-confirm>
    </div>
    <div v-show="tab == 2">
      <section class="ibox end"
        v-if="dataTotalFloor != 4">
        <div class="btns">
          <sn-button type="outline"
            @click="addFloor">新增</sn-button>
        </div>
      </section>
      <div class="ibox-empty"></div>
      <sn-table :data='floorList'
        ref='table2'>
        <sn-table-column label='坑位'
          width='10%'
          sloted>
          <template slot-scope='row'>
            {{row.indexs}}
          </template>
        </sn-table-column>
        <sn-table-column label='展示样式'
          width='15%'
          sloted>
          <template slot-scope="row">
            {{getFloorType(row.floorType)}}
          </template>
        </sn-table-column>
        <sn-table-column label='图片'
          width='30%'
          sloted>
          <template slot-scope='row'>
            <img v-if="row.floorType == 2 && row.advImgUrl"
              :src="row.advImgUrl"
              width="120"
              height="80">
          </template>
        </sn-table-column>
        <sn-table-column label='信息'
          sloted
          width="30%">
          <template slot-scope="row">
            <div class="info-par"
              v-if="row.floorType == 2">
              <p>跳转类型：{{getJumpType(row.advJumpType)}}</p>
              <p>跳转链接：{{row.advJumpUrl}}</p>
            </div>
            <div class="info-par"
              v-if="row.floorType == 1">
              <p>作者ID：{{row.authorId}}</p>
              <p>咨询ID：{{row.news1Id}}</p>
              <p>
                <em class="space-em"></em>{{row.news2Id}}</p>
              <p>
                <em class="space-em"></em>{{row.news3Id}}</p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label='操作'
          width='15%'
          sloted>
          <template slot-scope='row'>
            <a href="javascript:;"
              @click="showEnableFloor(row)">删除</a>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <!--导航管理--导航弹框-->
    <sn-confirm :title="isEditOrAddTitle"
      ref="addLinkConfirm"
      txt
      :flag="addLinkFlag"
      @sure="saveLinkSure('linkFormData')"
      @close="addLinkClose"
      closeIcon>
      <sn-form ref="linkFormData"
        :model="linkFormData"
        :rules="linkRuleForm"
        label-width="80px"
        formWidth="360">
        <sn-form-item label="导航名称"
          ref="linkName"
          prop="linkName">
          <sn-input v-model="linkFormData.linkName"
            :maxlength="4"
            :totalWords="4"
            showWord="true"
            width="268"
            placeholder="请输入名称"></sn-input>
        </sn-form-item>
        <sn-form-item label="导航链接"
          ref="linkUrl"
          prop="linkUrl">
          <sn-input v-model="linkFormData.linkUrl"
            width="268"
            placeholder="请输入链接"></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!--温馨提示-->
    <sn-confirm txt
      title="温馨提示"
      :flag="errTipsFlag"
      cancelButtonText="关闭"
      :sureBtnIsShow=false
      @close="tipClose">最多只支持4个底部导航位置!</sn-confirm>
    <!--底部导航删除弹框-->
    <sn-confirm txt
      ref="delNavConfirm"
      title="删除导航"
      :flag="delNavFlag"
      @sure="delNavSure"
      @close="delNavClose">确定要删除该导航吗?</sn-confirm>
    <sn-confirm ref="matchModal"
      rules="rules"
      title='添加比赛'
      txt
      @sure="addSure"
      @close="addClose"
      confirmButtonText="添加"
      :flag="addFlag"
      :sureBtnIsShow="sureBtnIsShow">
      <div class="matchContainer">
        <div class="form-item">
          <label class="form-item__label">添加比赛</label>
          <div class="form-item__content">
            <sn-input placeholder="请输入节目ID"
              @focus="clear"
              @change="removeTip"
              prop="matchID"
              v-model="matchID"
              width="360"
              :maxlength="10"
              :totalWords="10" />
            <div class="form-item__error">请输入正确的ID</div>
            <sn-button v-if="matchID != ''"
              type="primary"
              @click="searchMatch">搜索</sn-button>
            <sn-button class="btn-search"
              v-else
              type="primary"
              @click="searchMatch"
              disabled>搜索</sn-button>
          </div>
        </div>
        <sn-scroll-loader @loadmore="doLoad">
          <thead class="bg-gray">
            <tr>
              <th>节目ID</th>
              <th>节目信息</th>
              <th>节目名称</th>
              <th>开始时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="matchItem&&matchItem.matchitemShowId">
              <td>{{matchItem.matchitemShowId}}</td>
              <td>{{matchItem.matchDes}}</td>
              <td>{{matchItem.matchitemShowName}}</td>
              <td>{{matchItem.startTime}}</td>
            </tr>
            <tr v-if="!(matchItem&&matchItem.matchitemShowId)">
              <td colspan="4">当前暂无数据</td>
            </tr>
          </tbody>
        </sn-scroll-loader>
      </div>
    </sn-confirm>
    <!-- 坑位管理--楼层编辑 -->
    <sn-confirm @close="hideEditFloor"
      txt
      :flag="editFloorFlag"
      title="编辑">
      <!-- 展示样式--通用 -->
      <div v-if="editFloorInfo.floorType == '2'">
        <sn-form ref="commonFloor"
          :model="editFloorInfo"
          :rules="rules"
          label-width="80px"
          formWidth="480">
          <sn-form-item label="展示样式"
            prop="floorType">
            <sn-select v-model="editFloorInfo.floorType"
              placeholder="请选择"
              radius="6"
              width="400"
              @change="handleFloorType">
              <sn-option v-for="item in floorTypeList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="选择坑位"
            prop="fixedFloorId"
            ref="fixedFloorId">
            <sn-select v-model="editFloorInfo.fixedFloorId"
              placeholder="请选择"
              radius="6"
              width="400"
              @change="handleFixedFloorId">
              <sn-option v-for="item in fixedFloorIdList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="跳转类型"
            prop="advJumpType"
            ref="advJumpType">
            <sn-select v-model="editFloorInfo.advJumpType"
              placeholder="请选择"
              radius="6"
              width="400"
              @change="handleFJumpType">
              <sn-option v-for="item in jumpTypeList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item :label="JumpName"
            prop="topicId"
            ref="topicId">
            <sn-input v-model="editFloorInfo.topicId"
              width="400"
              :placeholder="JumpPlaceholder" />
          </sn-form-item>
          <sn-form-item label="封面"
            prop="advImgUrl"
            ref="advImgUrl">
            <sn-cropper :aspectRatio="aspectRatio"
              v-model="editFloorInfo.advImgUrl"
              ref="cropper"
              label="封面"
              width="360"
              :height="aspectRatioHeight"
              isScoped></sn-cropper>
          </sn-form-item>
        </sn-form>
        <div class="btn-block">
          <sn-button size="mini"
            type="primary"
            @click="editCommonFloor">保存</sn-button>
          <sn-button size="mini"
            @click="hideEditFloor">取消</sn-button>
        </div>
      </div>
      <!-- 展示样式--作者专栏 -->
      <div v-if="editFloorInfo.floorType == '1'">
        <div v-if="!showArticleList"
          id="editInfoForm">
          <sn-form :model="editFloorInfo"
            label-width="80px"
            formWidth="480">
            <sn-form-item label="展示样式">
              <sn-select v-model="editFloorInfo.floorType"
                placeholder="请选择"
                radius="6"
                width="400"
                @change="handleFloorType">
                <sn-option v-for="item in floorTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"></sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="选择坑位"
              prop="fixedFloorId">
              <sn-select v-model="editFloorInfo.fixedFloorId"
                placeholder="请选择"
                radius="6"
                width="400"
                @change="handleFixedFloorId">
                <sn-option v-for="item in fixedFloorIdList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"></sn-option>
              </sn-select>
            </sn-form-item>
            <div class="author-item">
              <sn-form-item label="作者ID"
                class="author-item">
                <sn-input v-model="authorName"
                  width="310"
                  placeholder="请输入作者ID精确查询" />
                <sn-button v-if="authorName != ''"
                  type="primary"
                  @click="queryAuthorList(authorName)"
                  class="search-btn">搜索</sn-button>
                <sn-button v-else
                  type="primary"
                  @click="queryAuthorList(authorName)"
                  class="search-btn btn-disabled"
                  disabled>搜索</sn-button>
              </sn-form-item>
            </div>
          </sn-form>
          <p id="remindTxt"
            class="remind-text">请选择作者!</p>
          <div id="authorList">
            <sn-scroll-loader :distance="-73"
              ref="authorLoader"
              :complete="true">
              <thead class="bg-gray">
                <tr>
                  <th>操作</th>
                  <th>作者名称</th>
                  <th>作者ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in authorList"
                  :key="item.authorId">
                  <td>
                    <sn-radio :label="index"
                      v-model="checkedIndex">&nbsp;</sn-radio>
                  </td>
                  <td>{{item.authorName}}</td>
                  <td>{{item.authorId}}</td>
                </tr>
                <tr v-if="!authorList.length">
                  <td colspan="3">当前暂无数据</td>
                </tr>
              </tbody>
            </sn-scroll-loader>
          </div>
          <div class="btn-block">
            <sn-button v-if="authorList.length>0"
              size="mini"
              type="primary"
              @click="nextStep">下一步</sn-button>
            <sn-button class="btn-disabled"
              v-else
              size="mini"
              type="primary"
              disabled>下一步</sn-button>
            <sn-button size="mini"
              @click="hideEditFloor">取消</sn-button>
          </div>
        </div>
        <!-- 作者专栏--下一步 -->
        <div v-if="showArticleList"
          class="articleList">
          <p class="info-par">
            <label>作者名字：</label>
            <label>{{sltedAuthorItem.authorName}}</label>
          </p>
          <sn-scroll-loader :distance="-73"
            ref="articleLoader"
            :complete="true">
            <thead class="bg-gray">
              <tr>
                <th>操作</th>
                <th>文章ID</th>
                <th>文章标题</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in articleList"
                :key="item.newsId">
                <td>
                  <sn-checkbox v-model="checkedArticles"
                    :label="index"></sn-checkbox>
                </td>
                <td>{{item.newsId}}</td>
                <td>{{item.title}}</td>
              </tr>
            </tbody>
          </sn-scroll-loader>
          <p id="sltArticleRemind"
            class="remind-text">请选择3篇文章!</p>
          <sn-pagination :total="authorDataTotal"
            :size="authorPageSize"
            @goto="gotoAuthor" />
          <div class="btn-block"
            style="margin-top:10px;">
            <sn-button class="lastStep"
              size="mini"
              type="primary"
              @click="returnPage">上一步</sn-button>
            <sn-button v-if="articleList.length>0"
              size="mini"
              type="primary"
              @click="editAuthorFloor">保存</sn-button>
            <sn-button v-else
              class="btn-disabled"
              size="mini"
              type="primary"
              disabled>保存</sn-button>
            <sn-button size="mini"
              @click="hideEditFloor">取消</sn-button>
          </div>
        </div>
      </div>
      <div slot="btn-group"></div>
    </sn-confirm>
    <!-- 坑位管理--停启用 -->
    <sn-confirm @sure="editFloorStatus"
      @close="hideEnableFloor"
      txt
      :flag="floorStatusFlag">
      确定{{floorConfirmTxt}}吗？
    </sn-confirm>
    <!-- 推荐比赛--编辑比赛信息 -->
    <sn-confirm txt
      :flag="editMatchFlag"
      title="编辑节目信息"
      @close="hideEditMatch"
      @sure="editMatchFun"
      confirmButtonText="保存">
      <div class="edit-block">
        <sn-input class="editMatchDesc"
          type="textarea"
          v-model="editMatchItem.matchDes"
          :rows="3"></sn-input>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  props: {
    channel: {
      type: [String, Object],
      default: function () {
        return {};
      }
    }
  },
  data () {
    let handleValidate = (rule, value, callback) => {
      if (value == '') {
        callback();
      } else if (!(value.startsWith('http://') || value.startsWith('https://'))) {
        callback(new Error('链接地址必须以http://或https://开头'));
      }
      callback();
    }
    return {
      navId:'',//删除导航传的id
      delNavFlag: false,//导航删除弹框标识
      errTipsFlag: false,//温馨提示弹框
      isEditOrAddTitle: '',//弹框显示标题
      addLinkFlag: false,
      linkList: [],//导航列表
      linkFormData: {
        linkId: '',
        linkName: '',
        linkUrl: ''
      },
      linkRuleForm: {
        linkName: [{
          required: true,
          type: 'string',
          message: '请输入名称',
          trigger: 'change'
        }, {
          min: 2,
          max: 4,
          message: '名称必须为2到4个字符',
          trigger: 'change'
        }],
        linkUrl: [{
          required: true,
          type: 'string',
          message: '请输入链接',
          trigger: 'change'
        }, {
          validator: handleValidate,
          trigger: 'change'
        }]
      },
      tab: 0,
      pageIndex: 0, //默认是0
      pageSize: 20, //默认是20
      dataTotal: 2, //查询出来的数据条数
      authorPageIndex: 0, //默认是0
      authorPageSize: 10, //默认是20
      authorDataTotal: 2, //查询出来的数据条数
      topicList: [],
      floorList: [],
      dataTotalFloor: 0,
      list: [],
      ruleForm: {
        id: '',
        title: '',
        num: "",
        style: ''
      },
      delConFlag: false,
      delChannelId: '',
      delId: '',
      addFlag: false,
      matchID: '',
      editFloorFlag: false, //坑位管理--编辑楼层弹框开关
      editFloorInfo: {
        floorType: '2',
        authorId: '',
        advJumpType: '',
        fixedFloorId: '',
        topicId: '',
        advImgUrl: ''
      }, //坑位管理--编辑对象
      showArticleList: false, //显示作者列表
      checkedIndex: null, //选中索引，添加作者
      authorList: [],//坑位管理--编辑楼层--添加作者
      floorStatusFlag: false, //广告坑位--楼层停启用弹框开关
      operateFloorItem: '', //广告坑位--操作楼层
      floorConfirmTxt: '', //楼层停启用确认文字
      floorTypeList: Constant.FLOOR_TYPE, //坑位管理--楼层列表
      jumpTypeList: Constant.JUMP_TYPE, //跳转类型列表
      authorName: '',
      sltedAuthorItem: '', //坑位管理--选中作者
      checkedArticles: [], //选中文章索引
      matchItem: {},
      fixedFloorIdList: [{
        name: '1',
        value: 1
      }, {
        name: '2',
        value: 2
      }, {
        name: '3',
        value: 3
      }, {
        name: '4',
        value: 4
      }],
      articleList: [],
      rules: {
        fixedFloorId: [{
          required: true,
          type: 'number',
          message: '请选择坑位',
          trigger: 'change'
        }],
        advJumpType: [{
          required: true,
          type: 'number',
          message: '请选择跳转类型',
          trigger: 'change'
        }],
        topicId: [{
          required: true,
          message: '请输入ID',
          trigger: 'blur'
        }],
        matchID: [{
          required: true,
          type: 'number',
          message: '请输入节目ID',
          trigger: 'change'
        }],
        advImgUrl: [{
          required: true,
          type: 'string',
          message: '请上传图片',
          trigger: 'change'
        }]
      },
      JumpName: '跳转ID',
      JumpPlaceholder: '请输入跳转ID',
      editMatchFlag: false, //编辑比赛弹框开关
      editMatchItem: {}, //编辑比赛项
      aspectRatio: 750 / 260,
      aspectRatioHeight: 360 * 260 / 750 + ''
    }
  },
  created () {
    this.queryLinkList();//查询导航列表
    this.queryList(0);
    this.queryFloorList();
  },
  computed: {
    sureBtnIsShow () {
      return this.matchItem && this.matchItem.matchitemShowId != undefined;
    }
  },
  methods: {
    queryLinkList () { //查询导航列表
      this.$ajax({
        url: DI.topic.queryNavigationList,
        data: JSON.stringify({
          channelId: this.channel.channelId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.linkList = res.data || [];
          } else {
            this.$message.success(res.retMsg);
          }
        },
        error: () => {
          this.$message.success('查询失败!');
        }
      });
    },
    addLink () { //导航新增
      if (this.linkList.length >= 4) {
        this.errTipsFlag = true;
        return;
      }
      this.isEditOrAddTitle = '添加导航';
      this.$refs.linkName && this.$refs.linkName.resetField();
      this.$refs.linkUrl && this.$refs.linkUrl.resetField();
      this.addLinkFlag = true;
    },
    editLink (row) { //编辑
      this.isEditOrAddTitle = '编辑导航';
      this.linkFormData.linkName = row.navigationName;
      this.linkFormData.linkUrl = row.navigationUrl;
      this.linkFormData.linkId = row.id;
      this.addLinkFlag = true;
    },
    saveLinkSure (formName) { //保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '';
          let pms = {
            channelId: this.channel.channelId,
            navigationName: this.linkFormData.linkName,
            navigationUrl: this.linkFormData.linkUrl
          };
          if (this.isEditOrAddTitle == '添加导航') {
            url = DI.topic.addNavigation;
          } else {
            url = DI.topic.editNavigation;
            pms.navigationId = this.linkFormData.linkId;
          }
          this.$ajax({
            url: url,
            data: JSON.stringify(pms),
            context: this,
            success: (res) => {
              if (res.retCode == '0') {
                this.$message.success('保存成功!');
                this.addLinkFlag = false;
                setTimeout(() => {
                  this.queryLinkList();
                }, 1300);
              } else {
                this.$message.success(res.retMsg);
              }
            },
            error: () => {
              this.$message.success('保存失败!');
            }

          });
        }
      });
    },
    addLinkClose () { //导航新增--取消
      this.addLinkFlag = false;
    },
    tipClose () {
      this.errTipsFlag = false;
    },
    move (flag, row) { //导航上下移
      let pms = {
        channelId: this.channel.channelId,
        navigationId: row.id,
        moveLogo: flag
      }
      this.$ajax({
        url: DI.topic.moveNavigation,
        data: JSON.stringify(pms),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success(`${flag === 1 ? '上移' : '下移'}成功!`);
            setTimeout(() => {
              this.queryLinkList();
            }, 1300);
          } else {
            this.$message.success(res.retMsg);
          }
        },
        error: () => {
          this.$message.success('移动失败!');
        }
      });
    },
    delNavSure () { //导航删除---确定
      this.$ajax({
        url: DI.topic.removeNavigation,
        data: JSON.stringify({
          subjectId: this.channel.channelId,
          navigationId: this.navId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success('删除成功!');
            this.delNavFlag = false;
            setTimeout(() => {
              this.queryLinkList();
            }, 1300);
          } else {
            this.$message.success(res.retMsg);
          }
        },
        error: () => {
          this.$message.success('删除失败!');
        }
      });
    },
    delNavClose () {
      this.delNavFlag = false;
    },
    delLink (id) { //弹框显示
      this.navId = id;
      this.delNavFlag = true;
    },
    clear () {
      this.matchID = '';
    },
    timeFormat (time) {
      let a = time.split(/[^0-9]/);
      let d = new Date(a[0], a[1] - 1, a[2], a[3], a[4]);
      return d.getTime();
    },
    getMatchStatus (start, end) {
      let s = this.timeFormat(start);
      let e = this.timeFormat(end);
      let curTime = new Date().getTime();
      if (curTime < s) {
        return '未开始';
      } else if (s <= curTime && curTime <= e) {
        return '进行中';
      } else {
        return '已结束';
      }
    },
    doLoad () {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push({
            id: ++this.count,
            title: '第八轮比赛',
            name: '中超联赛',
            time: '2017-05-20'
          })
        }
      }, 1500);
    },
    exchange (flag, index) {
      let curChannel = this.topicList[index];
      this.$ajax({
        url: DI.topic.moveChannelRecmdMatch,
        data: {
          "channelId": curChannel.channelId,
          "id": curChannel.id,
          "movingState": flag
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.queryList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showDelConfirm (channelId, id) { //显示删除确认框
      this.delConFlag = true;
      this.delChannelId = channelId;
      this.delId = id;
    },
    showEditConfirm (item) {
      this.editMatchFlag = true;
      this.editMatchItem = _.cloneDeep(item);
    },
    hideDelConfirm () {
      this.delConFlag = false;
    },
    delChannel (channelId, id) { //删除频道
      this.delConFlag = false;
      this.$ajax({
        url: DI.topic.removeChannelRecmdMatch,
        data: {
          "channelId": channelId, //删除频道Id
          "id": id
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.$message.success("删除成功！");
            setTimeout(() => {
              this.queryList(this.pageIndex);
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
    addSure () {
      // 添加比赛
      if (this.list.length == 0) {
        this.$ajax({
          url: DI.topic.saveChannelRecmdMatch,
          data: JSON.stringify({
            "advImgUrl": this.matchItem.advImgUrl,
            "awayLogo": this.matchItem.awayLogo,
            "awayTeam": this.matchItem.awayTeam,
            "awayTeamId": this.matchItem.awayTeamId == null ? '' : this.matchItem.awayTeamId,
            "bestVedioFlag": this.matchItem.bestVedioFlag,
            "channelId": this.matchItem.channelId,
            "endTime": this.matchItem.endTime,
            "homeLogo": this.matchItem.homeLogo,
            "homeTeam": this.matchItem.homeTeam,
            "homeTeamId": this.matchItem.homeTeamId,
            "isPushAdv": this.matchItem.isPushAdv,
            "isTop": this.matchItem.isTop,
            "matchDes": this.matchItem.matchDes,
            "matchitemId": this.matchItem.matchitemId,
            "matchitemShowId": this.matchItem.matchitemShowId,
            "matchitemShowName": this.matchItem.matchitemShowName,
            "matchLogo": this.matchItem.matchLogo,
            "narrator": this.matchItem.narrator,
            "prospectFlag": this.matchItem.prospectFlag,
            "score": this.matchItem.score,
            "startTime": this.matchItem.startTime
          }),
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              this.$message.success('添加成功');
              this.addFlag = false;
              setTimeout(() => {
                this.queryList(this.pageIndex);
                this.clearData();
              }, 1300);
            } else {
              this.$message.error(res.retMsg);;
            }
          },
          error: () => { }
        });
      }
    },
    clearData () {
      this.matchID = '';
      this.matchItem = {};
    },
    addClose () {
      this.addFlag = false;
      this.clearData();
    },
    addMatch () {
      this.addFlag = true;
    },
    goto (num) {
      this.pageIndex = num;
      this.queryList(num);
    },
    gotoAuthor (num) {
      this.authorPageIndex = num;
      this.queryArticleList(this.sltedAuthorItem.authorId, num);
    },
    tabChange (tab) {
      this.tab = tab;
    },
    removeTip () {
      $('.form-item__error').hide();
    },
    searchMatch () {
      if (isNaN(this.matchID)) {
        $('.form-item__error').show();
        return;
      } else {
        this.$ajax({
          url: DI.topic.addChannelRecmdMatch,
          data: {
            "channelId": this.channel.channelId,
            "matchitemShowId": parseInt(this.matchID)
          },
          type: 'GET',
          context: this,
          success: (res) => {
            if (res.retCode == "0") {
              this.matchItem = res.data || {};
            } else {
              this.matchItem = {};
              this.$message.error(res.retMsg);;
            }
          },
          error: () => { }
        });
      }
    },
    addFloor () {
      this.editFloorFlag = true;
    },
    getFloorType (val) { //获取楼层名称
      return Constant.getItemByValue(Constant.FLOOR_TYPE, val).name;
    },
    getJumpType (val) { //获取跳转类型(根据类型ID)
      return Constant.getItemByValue(Constant.JUMP_TYPE, val).name;
    },
    hideEditFloor () { //坑位管理--编辑楼层
      this.editFloorFlag = false;
      this.showArticleList = false;
      this.checkedIndex = null;
      this.authorList = '';
      this.init();
    },
    init () {
      this.editFloorInfo = {
        floorType: '2',
        authorId: '',
        advJumpType: '',
        fixedFloorId: '',
        topicId: '',
        advImgUrl: ''
      };
      this.$refs.fixedFloorId && this.$refs.fixedFloorId.resetField();
      this.$refs.advJumpType && this.$refs.advJumpType.resetField();
      this.$refs.topicId && this.$refs.topicId.resetField();
      this.$refs.advImgUrl && this.$refs.advImgUrl.resetField();
    },
    handleFloorType (val) {
      this.editFloorInfo.floorType = val;
    },
    showEnableFloor (rowItem) { //楼层停用启用弹出框
      this.floorStatusFlag = true;
      this.operateFloorItem = rowItem;
      this.floorConfirmTxt = '删除';
    },
    hideEnableFloor () { //楼层停用启用弹出框
      this.floorStatusFlag = false;
    },
    editFloorStatus () { //编辑楼层状态停启用
      let curItem = this.operateFloorItem;
      if (curItem.enableFlag == '1') {
        curItem.enableFlag = '2';
      } else {
        curItem.enableFlag = '1';
      }
      this.hideEnableFloor();
      this.$ajax({
        url: DI.floorMan.deleteChannelFixedFloor,
        data: JSON.stringify({
          "channelId": this.channel.channelId,
          "indexs": curItem.indexs
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.$message.success("操作成功！");
            setTimeout(() => {
              this.queryFloorList();
            }, 1300);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error')
        }
      });
    },
    handleFJumpType (val) { //编辑楼层--选择跳转类型
      this.editFloorInfo.advJumpType = val;
      this.JumpName = Constant.ADVMENT_LABEL[val - 1].label;
      this.JumpPlaceholder = Constant.ADVMENT_LABEL[val - 1].placeholder;
    },
    handleFixedFloorId (val) { //编辑楼层--选择跳转类型
      this.editFloorInfo.fixedFloorId = val;
    },
    editCommonFloor () {
      this.$refs.commonFloor.validate((valid) => {
        if (valid) {
          this.submitFloorFun();
        }
      });
    },
    submitFloorFun () {
      let floorFormData = this.editFloorInfo;
      this.$ajax({
        url: DI.floorMan.editFloor,
        data: JSON.stringify({
          "advImgUrl": floorFormData.advImgUrl, //广告图片
          "advJumpType": floorFormData.advJumpType, //
          "advJumpUrl": floorFormData.topicId, //帖子id
          "authorId": floorFormData.authorId,
          "channelId": this.channel.channelId,
          "fixedFloorId": null,
          "indexs": floorFormData.fixedFloorId,
          "floorType": floorFormData.floorType,
          "news1Id": floorFormData.news1Id,
          "news2Id": floorFormData.news2Id,
          "news3Id": floorFormData.news3Id,
          "vedioSetId": floorFormData.vedioSetId //视频合集ID
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.hideEditFloor();
            this.$message.success("提交成功！");
            setTimeout(() => {
              this.queryFloorList();
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
    hideEditMatch () { //编辑比赛信息弹框隐藏
      this.editMatchFlag = false;
    },
    editMatchFun () { //编辑比赛信息
      let editItem = this.editMatchItem;
      this.hideEditMatch();
      this.$ajax({
        url: DI.topic.updateChannelRecmdMatch,
        data: JSON.stringify({
          "channelId": editItem.channelId,
          "id": editItem.id,
          "matchDes": editItem.matchDes
        }),
        context: this,
        loadingText: '正在提交，请稍候！',
        success: (res) => {
          if (res.retCode == "0") {
            this.$message.success("编辑成功！");
            setTimeout(() => {
              this.queryList && this.queryList(this.mPageNum);
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
    queryAuthorList (name) { //查询作者列表(根据作者名)
      this.$ajax({
        url: DI.authorLibrary.queryAuthorInfo,
        data: JSON.stringify({
          "authorId": this.authorName,
          "pageIndex": 0,
          "pageSize": 20
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            let resData = res.data || {};
            if (resData.authorId) {
              this.authorList = [];
              this.authorList.push(resData);
            }
            this.$refs.authorLoader.complete = true;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    nextStep () { //编辑楼层--下一步
      let checkedIndex = this.checkedIndex;
      if (checkedIndex != null && !isNaN(parseInt(checkedIndex))) {
        this.showArticleList = true;
        let authorList = this.authorList;
        this.sltedAuthorItem = authorList[checkedIndex];
        let sltedAuthorId = this.sltedAuthorItem.authorId;
        this.editFloorInfo.authorId = sltedAuthorId;
        this.queryArticleList(sltedAuthorId, this.authorPageIndex);
      } else {
        $("#remindTxt").show();
        return false;
      }
    },
    returnPage () {
      this.showArticleList = false;
      this.articleList = [];
      this.checkedArticles = [];
    },
    editAuthorFloor (type) { //编辑楼层方法
      let sltedAuthor = this.sltedAuthorItem,
        checkedArticles = this.checkedArticles,
        formData = this.editFloorInfo,
        articleList = this.articleList,
        articleIdList = [];
      if (checkedArticles.length != 3) { //选择文章必须为三个
        $("#sltArticleRemind").show();
        return false;
      } else {
        $("#sltArticleRemind").hide();
        for (let i = 0; i < checkedArticles.length; i++) { //获取选中文章id
          let checkedIndex = checkedArticles[i];
          articleIdList.push(articleList[checkedIndex].newsId);
        }
        formData.news1Id = articleIdList[0];
        formData.news2Id = articleIdList[1];
        formData.news3Id = articleIdList[2];
        this.submitFloorFun();
      }
    },
    queryArticleList (authorId, pageNum) { //查询文章列表(根据作者ID)
      this.$ajax({
        url: DI.infoLibrary.getContentList,
        data: JSON.stringify({
          "authorId": authorId, //作者Id
          "pageIndex": pageNum ? (pageNum - 1) * this.authorPageSize : 0,
          "pageSize": this.authorPageSize,
          "type": true
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            let resData = res.data || {};
            this.articleList = resData.relList || [];
            this.authorDataTotal = resData.count || 0;
            this.$refs.articleLoader.complete = true;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryList (pageNum) {
      this.$ajax({
        url: DI.topic.queryRecmdMatchitem,
        data: {
          "channelId": this.channel.channelId
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.topicList = res.data.recmdMatchList || [];
            this.dataTotal = this.topicList.length;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    queryFloorList () {
      for (let i = 0; i < 4; i++) {
        this.fixedFloorIdList[i].disabled = false;
      }
      this.$ajax({
        url: DI.topic.queryChannelFixedFloorList,
        data: JSON.stringify({
          "channelId": this.channel.channelId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.floorList = res.data.list || [];
            this.dataTotalFloor = this.floorList.length;
            for (let i = 0; i < this.dataTotalFloor; i++) {
              let indexs = this.floorList[i].indexs;
              this.fixedFloorIdList[indexs - 1].disabled = true;
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    }
  }
}
</script>
