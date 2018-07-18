<template>
  <div class="container">
    <a href="javascript:;" v-if="channel.subjectId">
      <span slot="subtitle" class="goback" @click="goback">←</span>
    </a>
    <sn-topbar class="title-manage" :title="tabTitle" :labels="labelsStr" @tab="tabChange" :index="tabIndex" style="padding:0 18px 0 45px;">
      <span slot="subtitle"> 展示位ID: {{channel.subjectId}}</span>
    </sn-topbar>
    <!--zhaojh 2018.5.2-->
    <!-- PC二级导航 -->
    <div v-show="isPc == 1 && ( ((showType == 1 || showType == 2) && tabIndex == 4 && hotChannelId == hotSubjectId) || ((showType == 1 || showType == 2) && tabIndex == 5 && hotChannelId != hotSubjectId) || (showType == 4 && tabIndex == 2) || (showType == 5 && tabIndex == 3))">
      <section class="ibox between">
        <div class="search-box"></div>
        <div class="btns">
          <sn-button type="outline" @click="modifySubNav">添加导航</sn-button>
        </div>
      </section>
      <sn-datatable :data="subNavList" :border="true">
        <sn-datacolumn label="序号" prop="index" width="10%">
        </sn-datacolumn>
        <sn-datacolumn label="导航名称" prop="navigationName" width="20%">
        </sn-datacolumn>
        <sn-datacolumn label="导航类型" prop="navigationType" width="10%">
        </sn-datacolumn>
        <sn-datacolumn label="URL" prop="jumpUrl">
        </sn-datacolumn>
        <sn-datacolumn label="操作" prop="opt" width="10%">
        </sn-datacolumn>
        <template slot-scope="cell" slot="index">
          {{cell.index + 1}}
        </template>
        <template slot-scope="cell" slot="navigationName">
          {{cell.row.navigationName}}
        </template>
        <template slot-scope="cell" slot="navigationType">
          {{cell.row.navigationType|switchSubNavType}}
        </template>
        <template slot-scope="cell" slot="jumpUrl">
          {{cell.row.jumpUrl}}
        </template>
        <template slot-scope="cell" slot="opt">
          <div class="floor-page btn-group">
            <div class="pt-5">
              <button @click.stop="deleteSubNav(cell.row)">删除</button>
              <!-- <button @click.stop="modifySubNav(cell.row)">编辑</button> -->
            </div>
            <div class="pt-5">
              <button @click.stop="moveSubNav(cell.row, 1)" v-show="cell.index !== 0">上移</button>
              <button @click.stop="moveSubNav(cell.row, 2)" v-show="cell.index + 1 < subNavList.length">下移</button>
            </div>
          </div>
        </template>
      </sn-datatable>
    </div>
    <!--zhaojh 2018.5.2-->
    <!-- PC背景 -->
    <div v-show="isPc == 1 && (((showType == 1 || showType == 2) && tabIndex == 5 && hotChannelId == hotSubjectId) || ((showType == 1 || showType == 2) && tabIndex == 6 && hotChannelId != hotSubjectId) || (showType == 4 && tabIndex == 3) || (showType == 5 && tabIndex == 4))">
      <sn-datatable :data="channelBgsList" :border="true">
        <sn-datacolumn label="序号" prop="index" width="10%">
        </sn-datacolumn>
        <sn-datacolumn label="位置" prop="backgroundType" width="20%">
        </sn-datacolumn>
        <sn-datacolumn label="背景图片" prop="backgroundUrl" alignment="left">
        </sn-datacolumn>
        <sn-datacolumn label="操作" prop="opt" width="10%">
        </sn-datacolumn>
        <template slot-scope="cell" slot="index">
          {{cell.index + 1}}
        </template>
        <template slot-scope="cell" slot="backgroundType">
          {{`${+cell.row.backgroundType === 1 ? '频道' : '导航栏'}背景图`}}
        </template>
        <template slot-scope="cell" slot="backgroundUrl">
          <img :src="cell.row.backgroundUrl|smallImage(420)" width="420px" height="120px">
        </template>
        <template slot-scope="cell" slot="opt">
          <div class="floor-page btn-group">
            <div class="pt-5">
              <button @click.stop="modifyChannelBg(cell.row)">修改</button>
            </div>
            <div class="pt-5">
              <button @click.stop="deleteChannelBg(cell.row)">清除</button>
            </div>
          </div>
        </template>
      </sn-datatable>
    </div>

    <!--数据入口   暂定不显示 -->
    <div v-show="tabIndex == 9999" v-if="hasDataFloor" class="floor-page">
      <section class="ibox between">
        <div class="search-box"></div>
        <div class="btns">
          <sn-button type="outline" @click="openNewChannelFloorDataDialog">添加入口</sn-button>
        </div>
      </section>
      <sn-datatable :data="channelDataFloorList" :border="true">
        <sn-datacolumn label="顺序" prop="index" width="5%" alignment="left">
        </sn-datacolumn>
        <sn-datacolumn label="LOGO" prop="logoUrl" width="10%" alignment="left">
        </sn-datacolumn>
        <sn-datacolumn label="导航名称" prop="name" width="20%" alignment="left">
        </sn-datacolumn>
        <sn-datacolumn label="导航链接" prop="linkUrl" alignment="left">
        </sn-datacolumn>
        <sn-datacolumn label="操作" prop="opt" width="8%" align="left">
        </sn-datacolumn>
        <template slot-scope="cell" slot="index">
          {{cell.index + 1}}
        </template>
        <template slot-scope="cell" slot="logoUrl">
          <img :src="cell.row.logoUrl|smallImage(80, 80)" width="80px" height="80px" alt="">
        </template>
        <template slot-scope="cell" slot="linkUrl">
          <div>{{cell.row.linkUrl}}</div>
        </template>
        <template slot-scope="cell" slot="opt">
          <div class="btn-group">
            <div>
              <button :class="{'is-disabled':cell.index==0}" @click.stop="moveFloorItem(cell.row, 1, cell.index)">上移</button>
              <button :class="{'is-disabled':(cell.index+1)==channelDataFloorList.length}" @click.stop="moveFloorItem(cell.row, 2, cell.index)">下移</button>
            </div>
            <div class="pt-5">
              <button @click.stop="openFloorDelDailog(cell.row)">删除</button>
            </div>
          </div>
        </template>
      </sn-datatable>
      <sn-confirm title="删除楼层" txt :flag="floorItemDelPopFlag" @sure="doDelFloor" @close="closeDelFloorConfirmDialog" type='del'>
      </sn-confirm>
      <!-- 添加数据入口-->
      <sn-confirm ref="floorPopup" title="添加数据入口" txt @sure="addChannelFloorItem" @close="hideAddFloorPopup" :flag="floorPopFlag">
        <sn-form :model="floorItemForm" ref="floorItemForm" label-width="80px" formWidth="400">
          <sn-form-item label="导航名称" prop="name" ref="floorNameField" :rules="[
                                {
                                  required: true,
                                  message: '请输入导航名称',
                                  trigger: 'change'
                                }, {
                                  min: 2,
                                  max: 4,
                                  message: '长度为2-4个字符',
                                  trigger: 'change'
                                }
                              ]">
            <sn-input placeholder="请输入名称" v-model="floorItemForm.name" width="310" :maxlength="4" />
          </sn-form-item>
          <sn-form-item label="跳转链接" ref="linkUrlField" prop="linkUrl" :rules="floorLinkRules">
            <div>
              <sn-radio-group v-model="floorItemForm.floorLinkType">
                <sn-radio v-for="item in floorLinkList" :key="item.key" :label="item.key">{{ item.name }}
                </sn-radio>
              </sn-radio-group>
              <sn-input ref="linkJumpInput" width="310" v-model="floorItemForm.linkUrl" :placeholder="floorLinkPlaceholder"></sn-input>
            </div>
          </sn-form-item>
          <sn-form-item label="LOGO" prop="logoUrl" ref="logoUrl">
            <sn-cropper v-model="floorItemForm.logoUrl" ref="cropper" label="封面" width="120" height="120" :aspectRatio="1/1" noGif isScoped :pixelScope="{
                                  max: 200,
                                  min: 0
                                }">
              <p class="cropper-tip" slot="tip">图片格式支持JPG、JPEG、PNG，限制大小为500K以下，宽度小于200.</p>
            </sn-cropper>
          </sn-form-item>
        </sn-form>
      </sn-confirm>
    </div>
    <!-- app 连版 wuxa 2018/6/1-->
    <app-continuous-list ref="appContinuousList" v-show="(showType == 1 || showType == 2 || showType == 4 || showType == 5) && tabIndex == 0 " :tabIndex="tabIndex" :channel="channel"></app-continuous-list>
    <!--zhaojh 2018.5.3-->
    <!-- PC 连版管理 -->
    <div v-show="(showType == 1 || showType == 2 || showType == 4 || showType == 5) && pcContinuousShowByIndex[tabIndex]">
      <section class="ibox between">
        <div class="search-box">
          <div class="time-box">
            <span class="time-text">生效时间</span>
            <sn-timer width="180" ref="filterTimeS" :maxDate="endTime" v-model="startTime" showTimepicker/>
            <span class="split">至</span>
            <sn-timer width="180" ref="filterTimeE" :minDate="startTime" v-model="endTime" showTimepicker/>
          </div>
          <div v-if="filteTtimeRemind" class="remind-par" style="display:block;margin-bottom:5px">开始时间不能大于或等于结束时间</div>
          <div class="input-box" style="margin-bottom:0px;">
            <span class="text text-title pc-label">广告标题</span>
            <sn-input class="adv-title" width="178" radius="16" v-model="advTitle" placeholder="请输入广告标题" :maxlength="30"></sn-input>
          </div>
          <div class="select-box">
            <span class="text" style="padding-top:20px;">跳转类型</span>
            <sn-select v-model="advJumpType" ref="select" placeholder="请选择" radius="16" width="120" @change="handleJumpType" class="jump-type">
              <sn-option name="全部" value="''"></sn-option>
              <sn-option v-for="item in jumpTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </div>
        </div>
        <div class="btns">
          <sn-button type="primary" @click="searchAdvCon">查询</sn-button>
          <sn-button type="outline reset-button" @click="reset">重置</sn-button>
          <sn-button type="outline" @click="showAdvPopup(false)">添加广告</sn-button>
        </div>
      </section>
      <sn-table :data="advList" ref="table1">
        <sn-table-column label="顺序" width="4%" sloted>
          <template slot-scope="row">
            {{(advPageIndex - 1)*pageSize+row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label="标题" width="12.2%" sloted>
          <template slot-scope="row">
            <div class="ta-left">
              <p class="id-info">ID：{{row.advId}}</p>
              <p class="adv-title">{{row.advTitle}}</p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="封面" width="10%" align="center" sloted>
          <template slot-scope="row">
            <div class="adv-info">
              <div class="img-wrap">
                <img alt="" class="adv-img" :src="row.advPcImgUrl|smallImage(200)" width="120px" height="80px" />
              </div>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="跳转类型" width="6%" sloted>
          <template slot-scope="row">
            {{getJumpType(row.advJumpType)}}
          </template>
        </sn-table-column>
        <sn-table-column label="跳转链接" width="9%" prop="advJumpUrl"></sn-table-column>
        <sn-table-column label="展示标签" width="6%" prop="showLabel"></sn-table-column>
        <!-- <sn-table-column label="展示标签" width="6%" prop="showLabel" v-show="tabIndex == 2"></sn-table-column> -->
        <sn-table-column label="生效时间" width="6.6%" prop="startTime" v-show="tabIndex == 2"></sn-table-column>
        <sn-table-column label="失效时间" width="6.6%" prop="endTime" v-show="tabIndex == 2"></sn-table-column>

        <sn-table-column label="广告状态" width="5%" align="center" prop="advStatus" sloted v-show="tabIndex == 0">
          <template slot-scope="row">
            {{getAdvStatus(row.advStatus)}}
          </template>
        </sn-table-column>
        <sn-table-column label="操作" width="6%" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px">
                <a href="javascript:;" @click="showDelConfirm(row.advId)">删除</a>
                <a href="javascript:;" @click="showAdvPopup(true, row)">设置</a>
              </div>
              <div>
                <a v-if="row.$index > 0 || advPageIndex !==1" @click="moveVideoCol(1,row.$index)" href="javascript:;">上移</a>
                <a v-if="(row.$index+1+(advPageIndex-1)*pageSize) < dataTotal " @click="moveVideoCol(2,row.$index)" href="javascript:;">下移</a>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="advGoto" />
    </div>

    <!-- 功能位管理 jiangtao-->
    <div v-show="hotChannelId != hotSubjectId && ((showType == 1 || showType == 2) && tabIndex == 3)">
      <section>
        <div class="fn-manage">
          <span v-if="channel.subjectType == 1"></span>
          <sn-radio-group v-model="funcPositionFlag" v-if="channel.subjectType != 1">
            <span style="margin-top: 7px;margin-right: 10px;">展示位样式 </span>
            <span @click="funStylefn">
              <sn-radio :label="1">赛事默认数据楼层</sn-radio>
            </span>
            <span @click="funStylefn">
              <sn-radio :label="2">自定义</sn-radio>
            </span>
          </sn-radio-group>
          <sn-button type="outline" @click="showFunManage(false)">添加</sn-button>
        </div>
      </section>
      <sn-table :data="funList" ref="table1">
        <sn-table-column label="顺序" width="3%" align="center" sloted>
          <template slot-scope="row">
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label="图片" width="5%" align="center" sloted>
          <template slot-scope="row">
            <div class="adv-info">
              <div class="img-wrap">
                <img alt="" class="adv-img" :src="row.logoUrl|smallImage(200)" width="80px" height="80px" />
                <span style="display:none;">{{row.id}}</span>
              </div>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="名称" width="7.2%" align="center" sloted>
          <template slot-scope="row">
            {{row.name}}
          </template>
        </sn-table-column>
        <sn-table-column label="字体颜色" width="5%" align="center" sloted>
          <template slot-scope="row">
            <div>
              <p class="colorpad" :style="`background:${row.nameColor ? row.nameColor : '#202020'}`"></p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="跳转类型" width="6.8%" align="center" sloted>
          <template slot-scope="row">
            {{(row.linkType == 1 ? "内部页面" : "H5页面")}}
          </template>
        </sn-table-column>
        <sn-table-column label="地址" width="20%" align="center" sloted>
          <template slot-scope="row">
            {{row.linkUrl}}
          </template>
        </sn-table-column>
        <sn-table-column label="操作" width="8.5%" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px">
                <a href="javascript:;" @click="showDelFunManage(row.id)">删除</a>
                <a href="javascript:;" @click="showFunManage(true, row)">编辑</a>
              </div>
              <div>
                <a v-if="row.$index > 0" @click="moveFunManage(1,row.id)" href="javascript:;">上移</a>
                <a v-if="row.$index !=funList.length-1" @click="moveFunManage(2,row.id)" href="javascript:;">下移</a>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <!-- <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="advGoto" /> -->
    </div>

    <sn-confirm @sure="switchFunStyle" @close="hideFunStyle" txt :flag="funStyle">
      确定切换展示位样式？
    </sn-confirm>

    <!-- PC推荐标签 jiangtao -->
    <div v-show="isPc == 1 && (((showType == 1 || showType == 2) && tabIndex == 3 && hotChannelId == hotSubjectId) || ((showType == 1 || showType == 2) && tabIndex == 4 && hotChannelId != hotSubjectId) || (showType == 4 && tabIndex == 1) || (showType == 5 && tabIndex == 2))">
      <section>
        <div class="fn-manage">
          <span></span>
          <sn-button type="outline" @click="showPcRec(false)">添加数据</sn-button>
        </div>
      </section>
      <sn-table :data="pcRecList" ref="table1">
        <sn-table-column label="顺序" width="3%" sloted>
          <template slot-scope="row">
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label="展示标题" width="6%" sloted>
          <template slot-scope="row">
            <div class="adv-info">
              <p class="id-info">{{row. tagTitle}}</p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="内容类型" width="6%" sloted>
          <template slot-scope="row">
            {{getPcRecType(row.tagType)}}
          </template>
        </sn-table-column>
        <sn-table-column label="ID/URL" width="10%" sloted>
          <template slot-scope="row">
            <p class="id-info">{{row.jumpUrl}}</p>
          </template>
        </sn-table-column>
        <sn-table-column label="操作" width="6%" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px">
                <a href="javascript:;" @click="showPcRecConfirm(row.id)">删除</a>
              </div>
              <div>
                <a v-if="row.$index > 0" @click="movePcRec(1,row.id)" href="javascript:;">上移</a>
                <a v-if="row.$index !=pcRecList.length-1" @click="movePcRec(2,row.id)" href="javascript:;">下移</a>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <!-- <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="advGoto" /> -->
    </div>

    <!-- 专题推荐比赛 -->
    <div v-show="showType == 3 && tabIndex == 0">
      <section class="ibox end">
        <div class="btns">
          <sn-button type="outline" @click="showAddMatch">添加比赛</sn-button>
        </div>
      </section>
      <sn-table :data='topicList' ref='table1'>
        <sn-table-column label='顺序' width='13.75%' sloted>
          <template slot-scope='row'>
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label='节目ID' prop='matchitemShowId' width='13.75%'></sn-table-column>
        <sn-table-column label='节目名称' prop='matchitemShowName' width='15%'></sn-table-column>
        <sn-table-column label='节目信息' prop='matchDes' width='15%'></sn-table-column>
        <sn-table-column label='开始时间' prop='startTime' width='15%'></sn-table-column>
        <sn-table-column label='状态' width='13.75%' sloted>
          <template slot-scope="row">
            {{getSpecailMatchStatus(row.startTime, row.endTime)}}
          </template>
        </sn-table-column>
        <sn-table-column label='操作' width='13.75%' sloted>
          <template slot-scope="row">
            <div class="is-column">
              <a v-if="row.$index > 0" href="javascript:;" @click="exchange(1,row.$index)">上移</a><br v-if="row.$index > 0">
              <a v-if="(row.$index+1) < pageSize &&　dataTotal > (row.$index+1)" href="javascript:;" @click="exchange(2,row.$index)">下移</a><br v-if="(row.$index+1) < pageSize &&　dataTotal > (row.$index+1)">
              <a href="javascript:;" @click="showEditConfirmSpecial(row)">编辑</a><br>
              <a href="javascript:;" @click="showSpecialDelConfirm(row.channelId, row.id)">删除</a>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination :total="dataTotal" :size="pageSize" @goto="gotoSpecial" />
      <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delChannel(delChannelId,delId)" @close="hideSpecialDelConfirm">
        确定要删除吗？
      </sn-confirm>
    </div>

    <!-- 专题推荐比赛--编辑比赛信息 -->
    <sn-confirm txt :flag="editMatchFlagSpecial" title="编辑节目信息" @close="hideEditMatchSpecial" @sure="editMatchSpecialFun" confirmButtonText="保存">
      <div class="edit-block">
        <sn-input class="editMatchDesc" type="textarea" v-model="editMatchItemSpecial.matchDes" :rows="3"></sn-input>
      </div>
    </sn-confirm>

    <!-- 频道推荐比赛 -->
    <div v-show="(showType == 1 || showType == 2) && tabIndex == 1">
      <section class="ibox between p20">
        <!--2018/5/28 wuxa 将时间轴变为时间下拉选择 -->
        <div class="time-box">
          <span class="time-text mr-10">选择日期</span>
        <sn-timer width="180" ref="timeTool" v-model="sltDate" @input="sltSearchDate"/>
        </div>
        <!-- 原始修改前版-->
        <!-- <sn-time-axis @select="sltSearchDate" rel="timeTool" v-model="sltDate" ></sn-time-axis>
        <span></span> -->

        <div class="btn-operate">
          <sn-button type="outline" @click="topManage">置顶管理</sn-button>
          <sn-button type="outline" @click="syncMatchData">同步</sn-button>
          <sn-button type="primary" @click="showAddMatch">插入比赛</sn-button>
        </div>
      </section>
      <template>
        <!--推荐频道--推荐比赛-->
        <sn-table v-if="channel.subjectType == 1 || channel.subjectType == 2" :data='recomdMatchList' ref='recomdTable'>
          <sn-table-column label='序号' width="8%" align='center' sloted>
            <template slot-scope='row'>
              <div class="is-column">
                <p class="operate-par" v-if="row.isTop == '1'">
                  <label class="topBtn">{{(mPageNum-1)*pageSize+row.$index+1}} 置顶</label>
                </p>
                <p class="operate-par" v-else>{{(mPageNum-1)*pageSize+row.$index+1}}</p>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label="节目ID" prop="matchitemShowId" width="8%" align="center"></sn-table-column>
          <sn-table-column label="场次ID" prop="matchitemId" width="6%" align="center"></sn-table-column>
          <sn-table-column label="节目名称" prop="matchitemShowName" width="10%" align="center"></sn-table-column>
          <sn-table-column label="节目信息" prop="matchDes" width="8%" align="center"></sn-table-column>
          <sn-table-column label="节目时间" prop="startTime" width="10%" align="center" sloted>
            <template slot-scope="row">
              <!-- {{row.startTime}}-{{row.endTime}} -->
              {{specialmatchitem(row)}}
            </template>
          </sn-table-column>
          <sn-table-column label="开始时间" prop="matchStartTime" width="10%" align="center" sloted>
            <template slot-scope="row">
              <div v-if="row.matchitemId">{{row.matchStartTime}}</div>
            </template>
          </sn-table-column>
          <sn-table-column label="状态" prop="title" width="6%" align="center" sloted>
            <template slot-scope="row">
              {{getMatchStatus(row.status)}}
            </template>
          </sn-table-column>
          <sn-table-column label="是否推到连版" width="6%" align="center" sloted>
            <template slot-scope="row">
              {{getIsPushAdv(row.isPushAdv)}}
            </template>
          </sn-table-column>
          <sn-table-column label="连版图片" align="center" width="21%" sloted>
            <template slot-scope="row">
              <img v-if="row.advImgUrl" class="continue-img" v-img="{src:row.advImgUrl}" :src="row.advImgUrl|smallImage(120)" />
            </template>
          </sn-table-column>
          <sn-table-column label="操作" width="12%" align="center" sloted>
            <template slot-scope="row">
              <div class="is-column">
                <!-- <p v-if="channelFlag == '2'" class="link-par"> -->
                <p class="link-par">
                  <a v-if="row.isPushAdv == '0' " href="javascript:;" @click="showConPopup(row)">推到连版</a>
                  <a v-else href="javascript:;" @click="showCancelConfirm(row)">撤出连版</a>
                </p>
                <p class="link-par">
                  <a v-if="row.isTop == '0' " href="javascript:;" @click="showTopConfirm(row)">置顶</a>
                  <a v-else href="javascript:;" @click="showTopConfirm(row)">取消置顶</a>
                </p>
                <p class="link-par">
                  <a href="javascript:;" @click="showEditMatch(row)">编辑</a>
                </p>
                <p class="link-par">
                  <a href="javascript:;" @click="showDelMatch(row.id)">删除</a>
                </p>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
        <!--赛事频道--推荐比赛-->
        <sn-table v-else :data="recomdMatchList" ref="recomdTable">
          <sn-table-column label="序号" width="100" align="center" sloted>
            <template slot-scope="row">
              <div class="is-column">
                <p class="operate-par" v-if="row.isTop == '1'">
                  <label class="topBtn">{{(mPageNum-1)*pageSize+row.$index+1}} 置顶</label>
                </p>
                <p class="operate-par" v-else>{{(mPageNum-1)*pageSize+row.$index+1}}</p>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label="节目ID" prop="matchitemShowId" width="98" align="center"></sn-table-column>
          <sn-table-column label="节目名称" prop="matchitemShowName" width="125" align="center"></sn-table-column>
          <sn-table-column label="比赛ID" prop="matchitemId" width="100" align="center"></sn-table-column>
          <sn-table-column label="赛事信息" prop="matchDes" width="100" align="center"></sn-table-column>
          <sn-table-column label="节目时间" prop="startTime" width="170" align="center" sloted>
            <template slot-scope="row">
              {{row.startTime}}-{{row.endTime}}
            </template>
          </sn-table-column>
          <sn-table-column label="比赛开始时间" prop="matchStartTime" width="200" align="center" sloted>
            <template slot-scope="row">
              <div v-if="row.matchitemId">{{row.matchStartTime}}</div>
            </template>
          </sn-table-column>
          <sn-table-column label="状态" prop="title" width="70" align="center" sloted>
            <template slot-scope="row">
              {{getMatchStatus(row.status)}}
            </template>
          </sn-table-column>
          <sn-table-column label="操作" width="98" align="center" sloted>
            <template slot-scope="row">
              <div class="is-column">
                <p class="link-par">
                  <a v-if="row.isTop == '0' " href="javascript:;" @click="showTopConfirm(row)">置顶</a>
                  <a v-else href="javascript:;" @click="showTopConfirm(row)">取消置顶</a>
                </p>
                <p class="link-par">
                  <a href="javascript:;" @click="showEditMatch(row)">编辑</a>
                </p>
                <p class="link-par">
                  <a href="javascript:;" @click="showDelMatch(row.id)">删除</a>
                </p>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
      </template>
      <sn-pagination :total="matchTotal" :size="pageSize" @goto="matchGoto" />
    </div>

    <!-- zhaojh 2018.5.3 -->
    <!-- 坑位管理 -->
    <div v-show="(tabIndex == 2 && (showType == 1 || showType == 2)) || (tabIndex == 1 && (showType == 3 || showType == 5))">
      <section class="ibox end p20">
        <div class="btns">
          <sn-button type="primary" :disabled="addFloorDisable" @click="showAddFloor">新增</sn-button>
        </div>
      </section>
      <sn-table :data='floorList' ref='table2'>
        <sn-table-column label='坑位' width='160' sloted>
          <template slot-scope='row'>
            {{row.indexs}}
          </template>
        </sn-table-column>
        <sn-table-column label='展示样式' width='140' sloted>
          <template slot-scope="row">
            {{getFloorType(row.floorType)}}
          </template>
        </sn-table-column>
        <!-- <sn-table-column label='PC端封面' width='220' sloted>
          <template slot-scope='row'>
            <img v-if="row.floorType == 2 && row.advPcImgUrl" :src="row.advPcImgUrl|smallImage(150)" width="135px" height="85px">
          </template>
        </sn-table-column> -->
        <sn-table-column label='封面' width='220' sloted>
          <template slot-scope='row'>
            <img v-if="row.floorType == 2 && row.advImgUrl" :src="row.advImgUrl|smallImage(150)" width="135px" height="85px"> 
          </template>
        </sn-table-column>
        <sn-table-column label='信息' sloted width="auto">
          <template slot-scope="row">
            <div class="info-par" v-if="row.floorType == 2">
              <p>跳转类型：{{getJumpType(row.advJumpType)}}</p>
              <p>跳转链接：{{row.advJumpUrl}}</p>
            </div>
            <div class="info-par author-info" v-if="row.floorType == 1">
              <p>作者ID：{{row.authorId}}</p>
              <p>资讯ID：{{row.news1Id}}</p>
              <p>
                <em class="space-em"></em>{{row.news2Id}}</p>
              <p>
                <em class="space-em"></em>{{row.news3Id}}</p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label='操作' width='140' sloted>
          <template slot-scope='row'>
            <div class="is-column">
              <a href="javascript:;" @click="showDelFloor(row.indexs)">删除</a>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>

    <!--********************  底部导航  *************************** -->

    <div v-show="tabIndex == 2 && showType == 3">
      <section class="ibox end">
        <div class="btns">
          <sn-button type="outline" @click="addLink">添加导航</sn-button>
        </div>
      </section>
      <sn-table ref="table0" :data="linkList">
        <sn-table-column label="顺序" prop="index" width="10%" sloted>
          <template slot-scope="row">
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label="导航名称" prop="navigationName" width="20%"></sn-table-column>
        <sn-table-column label="导航链接" prop="navigationUrl" width="50%"></sn-table-column>
        <sn-table-column label="操作" prop="opt" width="20%" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <p>
                <a href="javascript:;" @click="editLink(row)">编辑</a>
              </p>
              <p>
                <a v-if="row.$index" href="javascript:;" @click="move(1,row)">上移</a>
                <a v-if="row.$index != linkList.length -1 " href="javascript:;" @click="move(2,row)">下移</a>
              </p>
              <p>
                <a href="javascript:;" @click="delLink(row.id)">删除</a>
              </p>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>

    <!--导航管理--导航弹框-->
    <sn-confirm :title="isEditOrAddTitle" ref="addLinkConfirm" txt :flag="addLinkFlag" @sure="saveLinkSure('linkFormData')" @close="addLinkClose" closeIcon>
      <sn-form ref="linkFormData" :model="linkFormData" :rules="linkRuleForm" label-width="80px" formWidth="360">
        <sn-form-item label="导航名称" ref="linkName" prop="linkName">
          <sn-input v-model="linkFormData.linkName" :maxlength="4" :totalWords="4" showWord="true" width="268" placeholder="请输入名称"></sn-input>
        </sn-form-item>
        <sn-form-item label="导航链接" ref="linkUrl" prop="linkUrl">
          <sn-input v-model="linkFormData.linkUrl" width="268" placeholder="请输入链接"></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!--温馨提示-->
    <sn-confirm txt title="温馨提示" :flag="errTipsFlag" cancelButtonText="关闭" :sureBtnIsShow=false @close="tipClose">最多只支持4个底部导航位置!</sn-confirm>
    <!--底部导航删除弹框-->
    <sn-confirm txt ref="delNavConfirm" title="删除导航" :flag="delNavFlag" @sure="delNavSure" @close="delNavClose">确定要删除该导航吗?
    </sn-confirm>

    <!-- 删除连版广告 -->
    <sn-confirm @sure="delConAdv" @close="hideDelConfirm" txt :flag="delAdvFlag">
      确定需要删除？
    </sn-confirm>
    <!-- 删除功能位 -->
    <sn-confirm @sure="delFunManage" @close="hideFunManage" txt :flag="delFunFlag">
      确定需要删除？
    </sn-confirm>
    <!-- PC推荐删除 -->
    <sn-confirm @sure="delPcRec" @close="hidePcRec" txt :flag="delPcRecFlag">
      确定需要删除？
    </sn-confirm>

    <!-- 添加广告&设置广告 zhaojh 2018.5.3-->
    <sn-confirm ref="advPopup" :title="popupTitle" txt @sure="submitAdvFun" @close="hideAdvPopup" :flag="advPopFlag">
      <sn-form :model="advData" ref="addAdvForm" :rules="addAdvRole" label-width="80px" formWidth="400">
        <sn-form-item label="广告标题" prop="advTitle">
          <sn-input placeholder="请输入广告标题" v-model="advData.advTitle" width="310" :maxlength="30" />
        </sn-form-item>
        <!-- <sn-form-item label="封面1" prop="advImgUrl" ref="advImgUrl" v-if="!advData.advImgUrl&&!advData.advPcImgUrl">
          <sn-cropper :aspectRatio="16/9" v-model="advData.advImgUrl" ref="cropper" label="封面" width="250" height="140" @input="getUnitImg" isScoped></sn-cropper>
        </sn-form-item> -->
        <!-- <sn-form-item label="封面" prop="advImgUrl" ref="advImgUrl" v-if="advData.advImgUrl || advData.advPcImgUrl">
          <sn-cropper :aspectRatio="16/9" v-model="advData.advImgUrl" ref="cropper" label="封面" width="250" height="140" isScoped></sn-cropper>
          <p style="margin: 10px 0;font-size:14px;width: 250px;">移动端封面</p>
        </sn-form-item> -->
        <!-- <sn-form-item prop="advPcImgUrl" ref="advPcImgUrl" v-if="advData.advImgUrl || advData.advPcImgUrl"> -->
        <sn-form-item label="广告封面" prop="advPcImgUrl" ref="advPcImgUrl">
          <sn-cropper :aspectRatio="15/7" v-model="advData.advPcImgUrl" ref="cropper" label="封面" width="250" height="140" isScoped>
            <span slot="tip"></span>
          </sn-cropper>
        </sn-form-item>
        <sn-form-item label="跳转类型" prop="advJumpType" id="pcAdvImg-p">
          <sn-select v-model="advData.advJumpType" placeholder="请选择" radius="4" width="310" @change="changeFormAdvJumpType">
            <sn-option v-for="item in jumpTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="isEditing">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item :label="jumpLabel" prop="advJumpUrl">
          <sn-input :placeholder="jumpPlaceholder" v-model="advData.advJumpUrl" width="306" @blur="queryVedioSet" :disabled="isEditing" />
        </sn-form-item>
        <sn-form-item label="合集ID" prop="vedioSet" v-show="vedioSetIsShow">
          <sn-select v-model="advData.vedioSetId" ref="vedioselect" placeholder="请选择" width="306" @change="vedioSetChangeHandler">
            <sn-option name='请选择' value=''></sn-option>
            <sn-option v-for="item in vedioList" :key="item.setId" :title="item.setId+':'+item.setTitle" :name="handleCidTitle(item)" :value="item.setId" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="展示标签" prop="showLabel">
          <sn-input placeholder="请输入展示标签" v-model="advData.showLabel" width="310" :maxlength="4" />
        </sn-form-item>
        <div class="time-field">
          <sn-form-item label="生效时间" prop="startTime" class="start-time" ref="startTime">
            <sn-timer width="138" radius="4" v-model="advData.startTime" :maxDate="advData.endTime" showTimepicker @change="startTimeChange"></sn-timer>
          </sn-form-item>
          <sn-form-item label="至" prop="endTime" class="end-time" ref="endTime">
            <sn-timer width="138" radius="4" v-model="advData.endTime" :minDate="advData.startTime" showTimepicker @change="endTimeChange"></sn-timer>
          </sn-form-item>
        </div>
        <div v-if="timeRemind" class="remind-par" style="display:block;">开始时间不能大于或等于结束时间</div>
      </sn-form>
    </sn-confirm>

    <!-- 添加功能位弹框 jiangtao-->
    <sn-confirm ref="funPopup" :title="popupTitle" txt @sure="submitFun" @close="hideAdvPopup" :flag="funPopFlag">
      <sn-form :model="funData" ref="funPopForm" :rules="addfunRole" label-width="95px" formWidth="450">
        <div class="addfuninput">
          <sn-form-item label="功能位名称" prop="name" labelWidth="95">
            <sn-input placeholder="2-5个文本字符" v-model="funData.name" width="300" :maxlength="30" />
          </sn-form-item>
        </div>
        <sn-form-item label="字体颜色" prop="fontColor">
          <sn-color-picker v-model="funData.fontColor"></sn-color-picker>
        </sn-form-item>
        <sn-form-item label="图片" prop="logoUrl" ref="funLogoUrl">
          <sn-cropper v-model="funData.logoUrl" ref="cropper" label="图片" width="150" height="150" @input="getFunImg" :aspectRatio="1/1" :noGif=t rue isScoped></sn-cropper>
        </sn-form-item>
        <sn-form-item label="跳转类型" prop="linkType" ref="linkType">
          <sn-select v-model="funData.linkType" placeholder="请选择" radius="4" width="310" @change="changeFormFunJumpType">
            <sn-option v-for="item in funjumpTypeList" :name="item.name" :value="item.value" :key="item.value">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item :label="funJumpLabel" prop="linkUrl">
          <sn-input :placeholder="funJmpPlaceholder" v-model="funData.linkUrl" width="310" />
        </sn-form-item>
      </sn-form>
    </sn-confirm>

    <!-- PC推荐标签 添加数据 jiangtao-->
    <sn-confirm :title="popupTitle" txt @sure="surePcRec" @close="hideAdvPopup" :flag="pcRecPopFlag">
      <sn-form :model="pcRecData" ref="ruleFormPcRecForm" label-width="80px" formWidth="440" :rules="addPcRecRole">
        <sn-form-item label="内容类型" prop="type">
          <sn-select v-model="ruleFormPcRec.subjectType" placeholder="请选择" radius="6" width="375px" @change="handleAddType">
            <sn-option v-for="item in pcRecommendContent" :key="item.value" :name="item.name" :value="item.value"></sn-option>
          </sn-select>
        </sn-form-item>

        <sn-form-item :label="ruleFormPcRec.subjectType < 5 ? placeholderTypeList[ruleFormPcRec.subjectType-1].label : '主题查询'" v-show="ruleFormPcRec.subjectType != 10" ref="matchLabels" prop="matchLabels">
          <sn-autocomplete v-model="searchInput" valueKey="matchName" :fetchSuggestions="querySearchPcRecList" :isSuggestionsPages="true" :placeholder="placeholderTypeList[ruleFormPcRec.subjectType-1].placeholder" @select="selectItem" @input="checkSelectItem" :width="360">
            <template slot-scope="{item}" slot="history">
              {{item.name || item.competitionName}}
            </template>
            <template slot-scope="{item}">
              <div class="match-suggestions__item">
                <template v-if="item.matchName">
                  <span>{{item.name}}</span>
                  <span>{{item.id}}</span>
                </template>
                <span v-else style="display:flex;justify-content: space-between;">
                  <span style="">{{item.name}}</span>
                  <span style="padding-right: 5px;" v-if="ruleFormPcRec.subjectType == 2">{{item.teamName}}</span>
                </span>
              </div>
            </template>
          </sn-autocomplete>
        </sn-form-item>

        <sn-form-item label="URL" v-if="ruleFormPcRec.subjectType == 10" prop="pcCheckcontent" ref="pcCheckcontent">
          <sn-input :placeholder="placeholderTypeList[9].placeholder" v-model="pcRecData.pcCheckcontent" />
        </sn-form-item>
        <sn-form-item label="展示标题" v-if="ruleFormPcRec.subjectType == 10" ref="pcInputTite">
          <sn-input placeholder="请输入展示标题（1-10个字）" v-model="pcRecData.title" />
        </sn-form-item>
        <p class="remindMsg" v-if="remindTitleFlag">展示标题不能为空</p>
        <div v-if="ruleFormPcRec.subjectType != 7 && ruleFormPcRec.subjectType != 9 && ruleFormPcRec.subjectType != 5">
          <div v-if="selectedLablesItem">
            <sn-form-item v-if="selectedLablesItem.name || selectedLablesItem.name == ''" label="展示名称">
              <sn-input v-model="selectedLablesItem.name" style="color: #333;" />

            </sn-form-item>
            <p class="remindMsg" v-if="remingErrFlag">展示名称不能为空</p>
            <sn-form-item v-if="selectedLablesItem.id" :label="ruleFormPcRec.subjectType < 5 ? pcRecommendContent[ruleFormPcRec.subjectType-1].name+'ID' : '主题ID'">
              <sn-input v-model="selectedLablesItem.id" disabled style="color: #333;" />
            </sn-form-item>
            <sn-form-item v-if="ruleFormPcRec.subjectType < 5 ? selectedLablesItem.logo:selectedLablesItem.matchLogo" :label="ruleFormPcRec.subjectType < 5 ? pcRecommendContent[ruleFormPcRec.subjectType-1].name+'logo' : 'logo'" style="overflow: hidden;">
              <img style="width:80px;height:80px;float: left;" :src="ruleFormPcRec.subjectType < 5 ? selectedLablesItem.logo:selectedLablesItem.matchLogo" alt="">
            </sn-form-item>
          </div>
        </div>
        <div v-else>
          <div v-if="selectedLablesItem">
            <sn-form-item label="展示名称" v-if="selectedLablesItem.name || selectedLablesItem.name == ''">
              <sn-input v-model="selectedLablesItem.name" style="color: #333;" />
            </sn-form-item>
            <p class="remindMsg" v-if="remingErrFlag">展示名称不能为空</p>
            <sn-form-item label="主题ID" v-if="selectedLablesItem.id">
              <sn-input v-model="selectedLablesItem.id" disabled style="color: #333;" />
            </sn-form-item>
            <sn-form-item label="赛事名称" v-if="(ruleFormPcRec.subjectType == 7 || ruleFormPcRec.subjectType == 9) && selectedLablesItem.matchName">
              <sn-input v-model="selectedLablesItem.matchName" disabled style="color: #333;" />
            </sn-form-item>
          </div>
        </div>
      </sn-form>
    </sn-confirm>

    <!-- 推荐比赛-是否置顶 -->
    <sn-confirm @sure="pushTopAdv(false)" @close="hideTopConfirm" txt :flag="topConfirmFlag">
      确定{{isTopStr}}？
    </sn-confirm>
    <!-- 推荐比赛-撤销连版 -->
    <sn-confirm @sure="pushTopAdv(true,true)" @close="hideCancelConfirm" txt :flag="cancelConFlag">
      确定撤销连版？
    </sn-confirm>
    <!-- 推荐比赛-删除 -->
    <sn-confirm @sure="delMatchFun" @close="hideDelMatch" txt :flag="matchDelFlag">
      确定需要删除吗？
    </sn-confirm>

    <!-- 推荐比赛-编辑比赛信息 -->
    <sn-confirm txt :flag="editMatchFlag" title="编辑节目信息" @sure="editMatchFun" @close="hideEditMatch" confirmButtonText="保存">
      <sn-form :model="editMatchItem" ref="editAdvForm" :rules="matchEditRole" label-width="80px" formWidth="400">
        <sn-form-item label="编辑赛事信息" prop="matchDes" ref="advImgUrl" labelWidth="84px">
          <sn-input type="textarea" v-model="editMatchItem.matchDes" width="240" height="35" :rows="3"></sn-input>
        </sn-form-item>
        <sn-form-item v-if="editMatchItem.isPushAdv" label="编辑连版封面图" prop="advImgUrl" ref="advImgUrl" labelWidth="84px">
          <sn-cropper v-model="editMatchItem.advImgUrl" ref="cropper" label="封面" width="250" height="140" :aspectRatio="25/14" isScoped></sn-cropper>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 添加连版图片 -->
    <sn-confirm title="添加连版图片" ref="conConfirm" :flag="conAdvFlag" txt @close="hideConPopup" @sure="pushTopAdv(true)">
      <sn-form ref="dataForm" :rule="conAdvRule" label-width="70px" formWidth="340">
        <sn-form-item label="广告封面" prop="advImgUrl">
          <sn-cropper ref="advImg" label="封面" width="250" height="140" v-model="curAdvItem.advImgUrl" @input="getPushAdvImg" :aspectRatio="25/14" isScoped></sn-cropper>
          <p id="remindPar" class="remind-par remind-adv">请上传广告封面</p>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 推荐比赛--插入比赛 zhaojh 2018.5.3 -->
    <sn-confirm title="添加比赛" ref="addMatchPop" :flag="addMatchFlag" txt>
      <div class="matchContainer">
        <div class="form-item">
          <label class="form-item__label">比赛类型</label>
          <div class="form-item__content">
            <sn-select v-model="thisMatchType" placeholder="请选择" radius="6" width="510" @change="thisMatchTpeChanged">
              <sn-option v-for="item in matchTypeList" :name="item.name" :value="item.key" :key="item.key">
              </sn-option>
            </sn-select>
          </div>
        </div>
        <div v-if="+thisMatchType===1">
          <div class="form-item">
            <label class="form-item__label">节目查询</label>
            <div class="form-item__content">
              <sn-input placeholder="请输入节目ID" @change="matchIdValidate" v-model="matchID" width="510" :maxlength="10" @blur="searchMatch" />
              <div class="form-item__error" v-if="matchError">请输入正确的ID</div>
            </div>
          </div>
          <sn-scroll-loader class="match-info">
            <thead class="bg-gray">
              <tr>
                <th>节目ID</th>
                <th>赛事信息</th>
                <th class="program-col">节目信息</th>
                <th>开始时间</th>
                <!-- <th>操作</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-if="JSON.stringify(this.matchItem) != '{}'">
                <td>{{matchItem.matchitemShowId}}</td>
                <td>{{matchItem.matchDes}}</td>
                <td>
                  <p class="program-info">{{matchItem.matchitemShowName}}</p>
                </td>
                <td>{{matchItem.startTime}}</td>
                <!-- <td>
                  <sn-checkbox v-model="matchIsChecked" theme="radio">&nbsp;</sn-checkbox>
                </td> -->
              </tr>
              <tr v-else>
                <td colspan="5">当前暂无数据</td>
              </tr>
            </tbody>
          </sn-scroll-loader>
        </div>
        <!--zhaojh 2018.5.5-->
        <div v-if="+thisMatchType===2">
          <sn-form>
            <labels-com2 ref="labelsCom2" :labelTypeProp="labelsCom2Props.labelTypeProp" :labelSearchProp="labelsCom2Props.labelSearchProp" :callback="selectedMatch">
            </labels-com2>
          </sn-form>
          <sn-scroll-loader class="match-info">
            <thead class="bg-gray">
              <tr>
                <th>赛事ID</th>
                <th>赛事名称</th>
                <th>比赛时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="matchItem in selectedMatchesList" :key="matchItem.competitionId" v-if="selectedMatchesList.length>0">
                <td>{{matchItem.labelId}}</td>
                <td>{{matchItem.labelName}}</td>
                <td>{{matchItem.labelTime}}</td>
              </tr>
              <tr v-else>
                <td colspan="5">当前暂无数据</td>
              </tr>
            </tbody>
          </sn-scroll-loader>
        </div>
      </div>
      <div slot="btn-group" class="btn-group">
        <sn-button size="mini" type="primary" @click="addMatchFun" :disabled="!matchIsChecked" v-if="+thisMatchType===1">保存</sn-button>
        <sn-button size="mini" type="primary" @click="addMatchesFun" :disabled="selectedMatchesList.length===0" v-if="+thisMatchType===2">保存</sn-button>
        <sn-button size="mini" @click="hideAddMatch" class="cancel-btn">取消</sn-button>
      </div>
    </sn-confirm>
    <!-- 置顶管理弹框 -->
    <sn-confirm title="置顶管理" ref="addMatchPop" :flag="topManageFlag" width="60%" txt>
      <div class="topContainer">
        <sn-table :data='topRecMatchList' ref='table1'>
          <sn-table-column label='序号' align='center' width="8%" sloted>
            <template slot-scope='row'>
              <div class="is-column">
                <p class="operate-par">{{row.$index+1}}</p>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label='节目ID' align='center' width="9%" sloted>
            <template slot-scope="row">
              <div class="adv-info">
                <span class="adv-title">{{row.matchitemShowId}}</span>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label='节目名称' width="15%" sloted>
            <template slot-scope="row">
              {{row.matchitemShowName}}
            </template>
          </sn-table-column>
          <sn-table-column label='赛事信息' prop='matchDes' width="15%"></sn-table-column>
          <sn-table-column label='节目时间' prop='showLabel' width='18%' sloted>
            <template slot-scope="row">
              {{row.startTime}}-{{row.endTime}}
            </template>
          </sn-table-column>
          <sn-table-column label='比赛开始时间' prop='matchStartTime' width="12%"></sn-table-column>
          <sn-table-column label='状态' prop='status' width="8%" sloted>
            <template slot-scope="row">
              {{row.status ? '未开始' : '正在进行'}}
            </template>
          </sn-table-column>
          <sn-table-column label='操作' align="center" sloted>
            <template slot-scope="row">
              <div class="is-column">
                <div>
                  <a v-if="row.$index > 0" @click="moveTopManage(1,row.$index)" href="javascript:;">上移</a>
                  <a v-if="(row.$index+1) < topDataTotal " @click="moveTopManage(2,row.$index)" href="javascript:;">下移</a>
                </div>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
      </div>
      <div slot="btn-group" class="btn-block" style="margin-top: 20px;">
        <!-- <sn-button size="mini" type="primary" @click="topSaveBtn">保存</sn-button> -->
        <sn-button size="mini" type="primary" @click="topCalBtn">关闭</sn-button>
      </div>
    </sn-confirm>
    <!-- 坑位管理-楼层添加 zhaojh 2018.5.3-->
    <sn-confirm @close="hideAddFloor" txt :flag="addFloorFlag" title="新增广告">
      <!-- 展示样式-通用 -->
      <div v-if="editFloorInfo.floorType == '2'">
        <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="80px" formWidth="480">
          <sn-form-item label="展示样式" prop="floorType">
            <sn-select v-model="editFloorInfo.floorType" placeholder="请选择" radius="6" width="400" @change="handleFloorType">
              <sn-option v-for="item in floorTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="选择坑位" prop="fixedFloorId">
            <sn-select v-model="editFloorInfo.fixedFloorId" placeholder="请选择" radius="6" width="400" @change="handleFixedFloorId">
              <sn-option v-for="item in fixedFloorIdList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="跳转类型" prop="advJumpType">
            <sn-select v-model="editFloorInfo.advJumpType" placeholder="请选择" radius="6" width="400" @change="handleFJumpType">
              <sn-option v-for="item in jumpTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item :label="JumpName" prop="topicId">
            <sn-input v-model="editFloorInfo.topicId" width="400" :placeholder="JumpPlaceholder" @blur="JumpSiteChange" />
            <div class="form-item__error" style="display:none;">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="合集ID" prop="vedioSet" v-show="vedioSetIsShow">
            <sn-select v-model="editFloorInfo.vedioSetId" ref="vedioselect" placeholder="请选择" width="400" @change="vedioSetChangeHandler">
              <sn-option name='请选择' value=''></sn-option>
              <sn-option v-for="item in vedioList" :key="item.setId" :title="item.setId+':'+item.setTitle" :name="handleCidTitle(item)" :value="item.setId" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="editFloorInfo.advJumpType==3" label="来自圈子" prop="comefrom">
            <sn-input width="100%" v-model="editFloorInfo.comefrom" :disabled="true"></sn-input>
          </sn-form-item>
          <sn-form-item label="封面" prop="advImgUrl" ref="advImgUrl" v-if="!editFloorInfo.advImgUrl&&!editFloorInfo.advPcImgUrl">
            <sn-cropper :aspectRatio="aspectRatio" v-model="editFloorInfo.advImgUrl" ref="cropper" label="封面" width="375" :height="aspectRatioHeight" @input="getUnitImg" isScoped></sn-cropper>
          </sn-form-item>
          <sn-form-item label="封面" prop="advImgUrl" ref="advImgUrl" v-if="editFloorInfo.advImgUrl || editFloorInfo.advPcImgUrl">
            <sn-cropper :aspectRatio="aspectRatio" v-model="editFloorInfo.advImgUrl" ref="cropper" label="封面" width="375" :height="aspectRatioHeight" isScoped></sn-cropper>
          </sn-form-item>
          <!-- <sn-form-item prop="advPcImgUrl" ref="advPcImgUrl" v-if="editFloorInfo.advImgUrl || editFloorInfo.advPcImgUrl">
            <sn-cropper :aspectRatio="aspectRatio" v-model="editFloorInfo.advPcImgUrl" ref="cropper" label="封面" width="375" :height="aspectRatioHeight" isScoped>
              <span slot="tip"></span>
            </sn-cropper>
            <p style="margin: 10px 0;font-size:14px;">PC端封面</p>
          </sn-form-item> -->
        </sn-form>
        <div class="btn-block">
          <sn-button size="mini" type="primary" @click="addCommonFloor">保存</sn-button>
          <sn-button size="mini" @click="hideAddFloor">取消</sn-button>
        </div>
      </div>
      <!-- 展示样式-作者专栏（目前已没有入口） zhaojh 2018.5.3-->
      <div v-if="editFloorInfo.floorType == '1'">
        <div v-if="!showArticleList" id="editInfoForm">
          <sn-form :model="editFloorInfo" label-width="80px" formWidth="480">
            <sn-form-item label="展示样式">
              <sn-select v-model="editFloorInfo.floorType" placeholder="请选择" radius="6" width="400" @change="handleFloorType">
                <sn-option v-for="item in floorTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="选择坑位" prop="fixedFloorId">
              <sn-select v-model="editFloorInfo.fixedFloorId" placeholder="请选择" radius="6" width="400" @change="handleFixedFloorId">
                <sn-option v-for="item in fixedFloorIdList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
            <p id="fixed-floor-warn" class="remind-text">请选择坑位!</p>
            <div class="author-item">
              <sn-form-item label="作者ID" class="author-item">
                <sn-input v-model="authorId" width="310" placeholder="请输入作者ID精确查询" />
                <sn-button type="primary" @click="queryAuthorList(authorId)" class="search-btn">搜索</sn-button>
              </sn-form-item>
            </div>
          </sn-form>
          <p id="remindTxt" class="remind-text">请选择作者!</p>
          <div id="authorList">
            <sn-scroll-loader :distance="-73" ref="loader" :empty='isEmpty'>
              <thead class="bg-gray">
                <tr>
                  <th>操作</th>
                  <th>作者名称</th>
                  <th>作者ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="authorInfo.authorId">
                  <td>
                    <sn-checkbox v-model="checkedIndex" theme="radio">&nbsp;</sn-checkbox>
                  </td>
                  <td>{{authorInfo.authorName}}</td>
                  <td>{{authorInfo.authorId}}</td>
                </tr>
              </tbody>
            </sn-scroll-loader>
            <div class="remind-text" v-if="remindShow">请选择作者！</div>
          </div>
          <div class="btn-block">
            <sn-button size="mini" type="primary" @click="nextStep" :disabled="authorId == ''">下一步</sn-button>
            <sn-button size="mini" @click="hideAddFloor">取消</sn-button>
          </div>
        </div>
        <div v-if="showArticleList" style="width:555px;">
          <p class="info-par">
            <label>作者名字：</label>
            <label>{{sltedAuthorItem.authorName}}</label>
          </p>
          <p id="sltArticleRemind" class="remind-text">请选择3篇文章!</p>
          <sn-scroll-loader :distance="-73" ref="articleLoader" :complete="true">
            <thead class="bg-gray">
              <tr>
                <th style="width:60px;">操作</th>
                <th style="width:80px;">文章ID</th>
                <th>文章标题</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in articleList" :key="item.newsId">
                <td>
                  <sn-checkbox v-model="checkedArticles" :label="index"></sn-checkbox>
                </td>
                <td>{{item.newsId}}</td>
                <td>{{item.title}}</td>
              </tr>
            </tbody>
          </sn-scroll-loader>
          <sn-pagination :total="authorDataTotal" :size="authorPageSize" @goto="gotoAuthor" />
          <div class="btn-block" style="margin-top:10px;">
            <sn-button size="mini" type="primary" @click="addAuthorFloor">保存</sn-button>
            <sn-button size="mini" @click="hideAddFloor">取消</sn-button>
          </div>
        </div>
      </div>
      <div slot="btn-group"></div>
    </sn-confirm>
    <!-- 坑位管理--删除 -->
    <sn-confirm @sure="delFloorFun" @close="hideDelFloor" txt :flag="floorDelFlag">
      确定需要删除吗？
    </sn-confirm>
    <!-- zhaojh 2018.5.2 -->
    <sn-confirm txt :flag="modifySubNavFlag" :title="`${thisSubNav.id ? '编辑' : '添加'}导航`" @sure="modifySubNavSure" @close="modifySubNavFlag = false" confirmButtonText="保存">
      <sn-form :model="thisSubNav" ref="subNavForm" label-width="80px" formWidth="400" :rules="navigationRules">
        <sn-form-item label="导航类型">
          <sn-select width="310" v-model="thisSubNav.navigationType" @change="thisSubNavTypechanged">
            <sn-option v-for="item in subNavSelects" :name="item.value" :value="item.key" :key="item.key" />
          </sn-select>
        </sn-form-item>
        <sn-form-item label="导航名称" prop="navigationName" :rules="[
                                {
                                  required: true,
                                  message: '请输入导航名称',
                                  trigger: 'blur',
                                }, {
                                  min: 1,
                                  max: 10,
                                  message: '长度为1-10个字符',
                                  trigger: 'blur',
                                }
                              ]">
          <sn-input v-model="thisSubNav.navigationName" width="310" placeholder="请输入导航名称（1-10个字）" />
        </sn-form-item>
        <sn-form-item label="URL" v-if="thisSubNav.navigationType === 8" prop="jumpUrl">
          <sn-input v-model="thisSubNav.jumpUrl" width="310" placeholder="请输入链接" />
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <sn-confirm @sure="deleteSubNavSure" @close="deleteSubNavFlag = false" txt :flag="deleteSubNavFlag">
      确定需要删除吗？
    </sn-confirm>
    <sn-confirm txt :flag="modifyChannelBgFlag" title="修改图片" @sure="modifyChannelBgSure" @close="modifyChannelBgFlag = false" confirmButtonText="确定">
      <sn-form :model="thisChannelBg" label-width="80px" formWidth="400">
        <sn-form-item label="广告封面">
          <sn-cropper v-model="thisChannelBg.backgroundUrl" label="封面" width="120" height="120" noGif isScoped>
          </sn-cropper>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <sn-confirm @sure="deleteChannelBgSure" @close="deleteChannelBgFlag = false" txt :flag="deleteChannelBgFlag">
      确定需要清除吗？
    </sn-confirm>
  </div>
</template>
<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import { VIDEOSET_URL } from 'utils/envUrl';
import { setHistoryArrData } from 'utils/util';
import labelsCom from '../../../../frontDisplay-management/theme-management/labels';
import labelsCom2 from './labels2';
import AppContinuousList from './app-continuous-list';//app连版管理

export default {
  props: {
    channel: {
      //获取频道列表页面传过来的channel
      type: Object,
      default: {}
    }
  },
  components: {
    labelsCom,
    labelsCom2,
    AppContinuousList
  },
  data() {
    // 底部导航添加链接 校验
    let handleValidate = (rule, value, callback) => {
      if (value == '') {
        callback();
      } else if (!(value.startsWith('http://') || value.startsWith('https://'))) {
        callback(new Error('链接地址必须以http://或https://开头'));
      }
      callback();
    };
    // 功能位标题 校验
    let handleFunTitleValidate = (rule, value, callback) => {
      if (value == '') {
        callback();
      } else if (value.length < 2 || value.length > 5) {
        callback(new Error('名称仅限2-5个文本字符'));
      }
      callback();
    };
    // 功能位 链接校验
    let handleFunValidate = (rule, value, callback) => {
      if (this.funData.linkType == 2) {
        if (value == '') {
          callback();
        } else if (!(value.startsWith('http://') || value.startsWith('https://'))) {
          callback(new Error('链接地址必须以http://或https://开头'));
        }
      } else {
        if (value == '') {
          callback();
        } else if (!value.startsWith('pptvsports://')) {
          callback(new Error('内部地址必须以pptvsports://开头'));
        }
      }
      callback();
    };
    let pcContinuousShowByIndex = { 4: true, 5: true, 6: true, 7: true }; //PC连版管理显示 tabindex
    //Pc连版管理,根据所在tab index位置显示
    let showPcContiByIndex = keys => {
      for (let key in pcContinuousShowByIndex) {
        key == keys ? (pcContinuousShowByIndex[key] = true) : (pcContinuousShowByIndex[key] = false);
      }
    };
    //初始化推荐比赛时间
    let initMatchDate = ()=>{
      let now = new Date();
      let mon = now.getMonth()+1;
      let day = now.getDate();
      mon = mon < 10 ? `0${mon}` : mon;
      day = day < 10 ? `0${day}` : day;
      return `${now.getFullYear()}-${mon}-${day}`;
    }
    let hasDataFloor = false;
    let labelsStr = '';
    let isSptMatchData = this.channel.subjectType;
    let isPc = this.channel.isPC;
    let ishotChannel = this.channel.hotChannelId;
    let difIsubjectId = this.channel.subjectId;
    if (isSptMatchData == 1 || isSptMatchData == 2) {
      // 栏目 或 赛事
      if (isPc == 1 && ishotChannel == difIsubjectId) {
        // 是PC且是热门
        labelsStr = '连版管理,推荐比赛,坑位管理,PC推荐标签,PC二级导航,PC频道背景管理,PC连版管理';
        showPcContiByIndex(6);
      } else if (isPc == 1 && ishotChannel != difIsubjectId) {
        // 是PC且 不是热门
        labelsStr = '连版管理,推荐比赛,坑位管理,功能位管理,PC推荐标签,PC二级导航,PC频道背景管理,PC连版管理';
        showPcContiByIndex(7);
      } else if (isPc != 1 && ishotChannel == difIsubjectId) {
        //不是PC 且 是热门
        labelsStr = '连版管理,推荐比赛,坑位管理';
      } else if (isPc != 1 && ishotChannel != difIsubjectId) {
        //不是PC不是热门
        labelsStr = '连版管理,推荐比赛,坑位管理,功能位管理';
      }
    } else if (isSptMatchData == 3) {
      //专题
      labelsStr = isPc == 1 ? '推荐比赛,坑位管理,底部导航管理' : '推荐比赛,坑位管理,底部导航管理';
    } else if (isSptMatchData == 4) {
      //节目集
      labelsStr = isPc == 1 ? '连版管理,PC推荐标签,PC二级导航,PC频道背景管理,PC连版管理' : '连版管理';
      if (isPc == 1) {
        showPcContiByIndex(4);
      }
    } else if (isSptMatchData == 5) {
      //小组
      labelsStr = isPc == 1 ? '连版管理,坑位管理,PC推荐标签,PC二级导航,PC频道背景管理,PC连版管理' : '连版管理,坑位管理';
      if (isPc == 1) {
        showPcContiByIndex(5);
      }
    } else {
      // 比赛场次 暂无
      labelsStr = '';
    }
    return {
      pcContinuousShowByIndex: pcContinuousShowByIndex,//pc连版显示tabindex
      remindTitleFlag: false,
      remingErrFlag: false,
      pThemeIndex: Number,
      searchInput: '',
      navId: '', //删除导航传的id
      errTipsFlag: false, //温馨提示弹框
      isEditOrAddTitle: '', //弹框显示标题
      delNavFlag: false, //导航删除弹框标识
      addLinkFlag: false,
      delConFlag: false, //专题推荐比赛 删除标识
      delChannelId: '',
      delId: '',
      pageIndex: 0, //默认是0
      linkList: [], //导航列表
      selectedLablesItem: null,
      funcPositionFlag: this.channel.funcPositionFlag,
      hotChannelId: this.channel.hotChannelId,
      hotSubjectId: this.channel.subjectId,
      idFuncPositionFlag: '',
      funStyle: false, //功能位 功能位样式弹窗开关
      tabIndex: 0,
      labelsStr,
      hasDataFloor,
      isPc: this.channel.isPC,
      authorPageIndex: 0, //默认是0
      authorPageSize: 10, //默认是20
      authorDataTotal: 2, //查询出来的数据条数
      channelFlag: this.channel.channelFlag, //频道标记
      showType: this.channel.subjectType, //1栏目,2赛事,3专题,4节目集,5小组
      tabTitle: this.channel.subjectName || '',
      //连版广告列表查询参数
      advTitle: '',
      advJumpType: '', //跳转类型
      pageSize: 20,
      advPageIndex: 1,
      startTime: '',
      endTime: '',
      dataTotal: 0, //获得的列表数据总条数
      topDataTotal: 0, //置顶管理列表总条数
      funLabelList: Constant.FUN_LABEL,
      matchTypeList: [
        {
          key: 1,
          name: '节目'
        },
        {
          key: 2,
          name: '比赛'
        }
      ],
      thisMatchType: 1,
      matchId: '', //比赛
      matchList: [],
      funjumpTypeList: Constant.FUN_JUMP_TYPE, //功能位跳转类型
      jumpTypeList: Constant.JUMP_TYPE, //跳转类型列表
      pcRecommendContent: Constant.PC_REC_TYPE, // pC推荐标签 内容
      hasPcRecPopData: false,
      pcRecSercachFlag: true,
      videoSetList: [], //视频合集列表(根据视频ID搜索出)
      advList: [], //连版广告列表(查询出)
      pcRecList: [], //pc推荐列表查询
      funList: [], //功能位管理 列表(查询出)
      topicList: [],
      topRecMatchList: [], //置顶管理查询列表
      delAdvFlag: false, //删除广告弹框开关
      delAdvId: '', //删除广告Id
      delFunId: '', //删除功能位Id
      delFunFlag: false, //删除功能位弹窗开关
      delPcRecFlag: false, //删除PC推荐弹框开关
      delPcRecId: '', //删除PC推荐id
      editFlag: false, //设置广告 开关
      pcRecEditFlag: false, //pc推荐编辑 开关
      funEditFlag: false, //设置功能位 开关
      popupTitle: '添加广告', //添加广告&设置广告 弹框标题
      advPopFlag: false, //添加广告&设置广告 弹框开关
      funPopFlag: false, //添加功能位 弹框开关
      pcRecPopFlag: false, //pc推荐 弹框开关
      filteTtimeRemind: false, // 过滤部分时间校验不符的校验提示
      timeRemind: false, //时间错误提示--添加广告
      jumpLabel: '跳转地址',
      funJumpLabel: '内部地址',
      jumpPlaceholder: '请输入跳转地址',
      funJmpPlaceholder: 'pptvsports://开头的页面路由地址',
      PcRecTypeList: '球队查询',
      vedioSetIsShow: false, // 跳转类型选择视频的时候，根据选择的视频查询，如果对应的视频有合集，显示组件，默认不显示
      advData: {
        //广告表单提交数据(添加&设置共用)
        advId: '', //设置广告时使用
        channelId: '', //设置广告时使用
        advTitle: '',
        advImgUrl: '', //广告图片
        advJumpType: '', //跳转类型
        advJumpUrl: '', //跳转地址
        videoId: '', //视频ID(跳转类型为MIP视频)
        vedioSetId: '', //合集ID(跳转为视频时)
        showLabel: '', //展示标签
        startTime: '',
        endTime: '',
        advAppImgUrl: '',
        advPcImgUrl: ''
      },
      linkFormData: {
        linkId: '',
        linkName: '',
        linkUrl: ''
      },
      navigationRules: {
        jumpUrl: [
          {
            required: true,
            message: '请输入链接',
            trigger: 'change'
          },
          {
            validator: handleValidate,
            trigger: 'change'
          }
        ]
      },
      linkRuleForm: {
        linkName: [
          {
            required: true,
            type: 'string',
            message: '请输入名称',
            trigger: 'change'
          },
          {
            min: 2,
            max: 4,
            message: '名称必须为2到4个字符',
            trigger: 'change'
          }
        ],
        linkUrl: [
          {
            required: true,
            type: 'string',
            message: '请输入链接',
            trigger: 'change'
          },
          {
            validator: handleValidate,
            trigger: 'change'
          }
        ]
      },
      funData: {
        //功能位表单提交数据(添加&设置共用)
        id: '', //设置功能位时使用
        channelId: '', //设置功能位时使用
        name: '',
        fontColor:{hex:'#202020'},//字体颜色,默认色
        logoUrl: '', //功能位图片
        linkType: 1, //跳转类型
        linkUrl: '' //跳转地址
      },
      pcRecData: {
        pcRecSercach: '',
        pcCheckcontent: '',
        title: ''
      },
      // PruleFormPcRecC推荐弹框 jiangtao
      ruleFormPcRec: {
        subjectType: 1,
        subjectName: '',
        resource: 1,
        onSaleType: 1,
        logo: '',
        description: ''
      },
      placeholderTypeList: Constant.PC_REC_content,
      // zhaojh 2018.5.3
      addAdvRole: {
        //添加广告表单规则
        advTitle: [
          {
            required: true,
            message: '请输入广告标题',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'change'
          }
        ],
        advImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'blur'
          }
        ],
        advAppImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'blur'
          }
        ],
        advPcImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'blur'
          }
        ],
        advJumpType: [
          {
            required: true,
            type: 'number',
            message: '请选择跳转类型',
            trigger: 'change'
          }
        ],
        advJumpUrl: [
          {
            required: true,
            type: 'string',
            message: '请输入跳转地址',
            trigger: 'blur'
          }
        ],
        videoId: [
          {
            required: true,
            type: 'string',
            message: '请输入视频ID',
            trigger: 'blur'
          }
        ],
        showLabel: [
          {
            required: false,
            min: 2,
            max: 4,
            message: '请输入展示标签，长度为2-4个字符',
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ]
      },
      addfunRole: {
        //添加功能位表单规则
        name: [
          {
            required: true,
            message: '请输入功能位名称',
            trigger: 'blur'
          },
          {
            validator: handleFunTitleValidate,
            trigger: 'change'
          }
        ],
        fontColor: [
          {
            required: true,
            message: '请选择字体颜色',
            trigger: 'blur',
            type:'object'
          }
        ],
        logoUrl: [
          {
            required: true,
            message: '请上传功能位图片',
            trigger: 'blur'
          }
        ],
        linkType: [
          {
            required: true,
            type: 'number',
            message: '请选择跳转类型',
            trigger: 'change'
          }
        ],
        linkUrl: [
          {
            required: true,
            type: 'string',
            message: '请输入跳转地址',
            trigger: 'change'
          },
          {
            validator: handleFunValidate,
            trigger: 'change'
          }
        ]
      },

      //添加PC推荐标签位表单规则
      addPcRecRole: {
        pcRecSercach: [
          {
            required: true,
            message: '请输入名称/id',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'change'
          }
        ],
        pcCheckcontent: [
          {
            required: true,
            message: '请输入URL',
            trigger: 'change'
          },
          {
            validator: handleValidate,
            trigger: 'change'
          }
        ]
      },
      matchEditRole: {
        //添加广告表单规则
        matchDes: [
          {
            required: true,
            message: '请输入赛事信息',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'change'
          }
        ]
      },
      isEditing: false, //是否正在编辑广告
      isFunEditing: false, //是否正在编辑功能位
      /*****************连版广告 end********************/
      matchTotal: 0, //推荐比赛列表--数据总量
      sltDate: initMatchDate(), //选择查询的日期
      curTime: '', //当前日期
      labelName: '球队查询',
      isCurtime: true,
      recomdMatchList: [], //推荐比赛列表
      mPageNum: 1, //推荐比赛列表索引
      topConfirmFlag: false, //置顶确认框开关
      curAdvItem: '', //当前选择的广告列表(推到连版、置顶)
      isTopStr: '', //是否置顶文字
      conAdvFlag: false, //推到连载确认框开关
      cancelConFlag: false, //撤销连载确认框开关
      matchDelFlag: false, //删除推荐比赛
      delMatchId: '', //删除推荐比赛id
      editMatchFlag: false, //编辑比赛弹框开关
      editMatchFlagSpecial: false,
      editMatchItemSpecial: {},
      editMatchItem: {}, //编辑比赛项
      matchIsChecked: false, //插入比赛是否选中
      addMatchFlag: false, //插入比赛弹框开关
      topManageFlag: false, //置顶管理弹框开关
      matchError: false, //插入比赛--错误提示开关
      matchID: '', //插入比赛--比赛ID
      matchItem: {}, //插入比赛--查询出对象
      /*****************推荐比赛 end********************/
      floorList: [], //广告坑位列表
      addFloorDisable: true, //添加坑位按钮是否能用
      remindShow: false, //提示显示(选中作者)
      authorId: '', //作者ID
      fixedFloorIdList: Constant.FLOOR_INDEX, //坑位位置
      authorInfo: '', //作者信息(搜索出的)
      addFloorFlag: false, //坑位管理--编辑楼层弹框开关
      floorDelFlag: false, //坑位管理--删除楼层弹框开关
      floorDelIndex: '', //删除楼层索引
      floorTypeList: Constant.FLOOR_TYPE, //坑位管理--楼层列表
      editFloorInfo: {
        floorType: '2',
        authorId: '',
        advJumpType: '',
        vedioSetId: '',
        fixedFloorId: '',
        advImgUrl: '',
        advAppImgUrl: '',
        advPcImgUrl: '',
        topicId: '',
        comefrom: ''
      }, //坑位管理--编辑对象
      sltedAuthorItem: '', //坑位管理--选中作者
      checkedIndex: false, //选中索引，添加作者
      authorList: [], //坑位管理--编辑楼层--添加作者
      showArticleList: false, //显示作者列表
      articleList: [], //文章列表(作者名下)
      checkedArticles: [], //选中文章索引
      floorRules: {
        fixedFloorId: [
          {
            required: true,
            type: 'number',
            message: '请选择坑位',
            trigger: 'change'
          }
        ],
        advJumpType: [
          {
            required: true,
            type: 'number',
            message: '请选择跳转类型',
            trigger: 'change'
          }
        ],
        advJumpUrl: [
          {
            required: true,
            type: 'string',
            message: '请输入跳转地址',
            trigger: 'change'
          }
        ],
        advImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'change'
          }
        ],
        advAppImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'change'
          }
        ],
        advPcImgUrl: [
          {
            required: true,
            message: '请上传广告封面',
            trigger: 'change'
          }
        ],
        topicId: [
          {
            required: true,
            message: '请输入ID或URL',
            trigger: 'change'
          }
        ]
      },
      conAdvRule: {
        //推到连版验证
        advImgUrl: [
          {
            required: true,
            message: '请上传连版图片',
            trigger: 'change'
          }
        ]
      },
      ruleForm: {
        id: '',
        title: '',
        num: '',
        style: ''
      },
      advFlag: false,
      JumpName: '跳转ID',
      JumpPlaceholder: '请输入跳转ID',
      isEmpty: 'true', // 表格是否为空
      aspectRatio: 750 / 260,
      aspectRatioHeight: 360 * 260 / 750 + '',
      vedioList: [],
      vedioTitle: '',
      floorItemDelPopFlag: false,
      channelDataFloorList: [],
      floorLinkList: Constant.FLOOR_LINK_TYPES,
      floorPopFlag: false,
      floorItemForm: {
        ...this.defaultFloorItemData()
      },
      // zhaojh 2018.5.2
      subNavSelects: [
        {
          key: 1,
          value: '赛程'
        },
        {
          key: 2,
          value: '积分榜'
        },
        {
          key: 3,
          value: '射手榜'
        },
        {
          key: 4,
          value: '球队'
        },
        {
          key: 5,
          value: '节目'
        },
        {
          key: 6,
          value: '视频'
        },
        {
          key: 7,
          value: '图集'
        },
        {
          key: 8,
          value: 'URL'
        }
      ],
      subNavList: {},
      modifySubNavFlag: false,
      deleteSubNavFlag: false,
      thisSubNav: {},
      channelBgsList: [],
      modifyChannelBgFlag: false,
      deleteChannelBgFlag: false,
      thisChannelBg: {},
      timer: null,
      // zhaojh 2018.5.5
      labelsCom2Props: {
        labelTypeProp: {
          showFlag: false
        },
        labelSearchProp: {
          labelName: '比赛查询'
        }
      },
      selectedMatchesList: {}
    };
  },
  mounted() {
    this.tabChange(this.tabIndex);
  },
  // zhaojh 2018.5.2
  filters: {
    switchSubNavType(index) {
      let str = '';
      switch (+index) {
        case 1:
          str = '赛程';
          break;
        case 2:
          str = '积分榜';
          break;
        case 3:
          str = '射手榜';
          break;
        case 4:
          str = '球队';
          break;
        case 5:
          str = '节目';
          break;
        case 6:
          str = '视频';
          break;
        case 7:
          str = '图集';
          break;
        case 8:
          str = 'URL';
          break;
        default:
          break;
      }
      return str;
    }
  },
  computed: {
    floorLinkTypeItem() {
      return Constant.getItemByKey(this.floorLinkList, this.floorItemForm.floorLinkType);
    },
    floorLinkPlaceholder() {
      return this.floorLinkTypeItem.placeholder || '请输入跳转链接';
    },
    floorLinkRules() {
      let linkJumpValidation = (rule, value, callback) => {
        let { reg, errMsg } = this.floorLinkTypeItem;
        if (value && reg && !reg.test(value)) {
          callback(new Error(errMsg));
        }

        callback();
      };
      return [
        {
          required: true,
          message: this.floorLinkPlaceholder,
          trigger: 'change'
        },
        {
          validator: linkJumpValidation,
          trigger: 'change'
        }
      ];
    }
  },
  methods: {
    //频道推荐比赛节目时间
    specialmatchitem(row) {
      return row.matchitemShowId ? row.startTime + '-' + row.endTime : '';
    },
    //底部导航添加确认
    saveLinkSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = '';
          let pms = {
            subjectId: this.channel.subjectId,
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
            success: res => {
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
    delNavSure() {
      //导航删除---确定
      this.$ajax({
        url: DI.topic.removeNavigation,
        data: JSON.stringify({
          subjectId: this.channel.subjectId,
          navigationId: this.navId
        }),
        context: this,
        success: res => {
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
    delLink(id) {
      //弹框显示
      this.navId = id;
      this.delNavFlag = true;
    },
    delNavClose() {
      this.delNavFlag = false;
    },
    tipClose() {
      this.errTipsFlag = false;
    },
    //查询导航列表
    queryLinkList() {
      this.$ajax({
        url: DI.topic.queryNavigationList,
        data: JSON.stringify({
          subjectId: this.channel.subjectId
        }),
        context: this,
        success: res => {
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
    move(flag, row) {
      //导航上下移
      let pms = {
        subjectId: this.channel.subjectId,
        navigationId: row.id,
        moveLogo: flag
      };
      this.$ajax({
        url: DI.topic.moveNavigation,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
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
    addLinkClose() {
      //导航新增--取消
      this.addLinkFlag = false;
    },
    editLink(row) {
      //编辑
      this.isEditOrAddTitle = '编辑导航';
      this.linkFormData.linkName = row.navigationName;
      this.linkFormData.linkUrl = row.navigationUrl;
      this.linkFormData.linkId = row.id;
      this.addLinkFlag = true;
    },
    addLink() {
      //导航新增
      if (this.linkList.length >= 4) {
        this.errTipsFlag = true;
        return;
      }
      this.isEditOrAddTitle = '添加导航';
      this.$refs.linkName && this.$refs.linkName.resetField();
      this.$refs.linkUrl && this.$refs.linkUrl.resetField();
      this.addLinkFlag = true;
    },
    // zhaojh 2018.5.5
    selectedMatch(list) {
      this.selectedMatchesList = JSON.parse(JSON.stringify(list));
    },
    // zhaojh 2018.5.3
    getUnitImg(imgUrl) {
      this.editFloorInfo.advImgUrl = imgUrl;
      this.editFloorInfo.advPcImgUrl = imgUrl;
      this.advData.advImgUrl = imgUrl;
      this.advData.advPcImgUrl = imgUrl;
    },
    thisMatchTpeChanged(index) {
      this.thisMatchType = index;
      if (+this.thisMatchType === 2) {
        this.$nextTick().then(() => {
          this.$refs.labelsCom2.changeType(6);
        });
      }
    },
    // PC推荐快速查询
    selectItem(item) {
      setHistoryArrData('matchTag', [item], ['matchId', 'competitionId']);
      this.selectedLablesItem = { ...item };
    },
    checkSelectItem() {
      if (this.selectedLablesItem) {
        this.$refs.matchLabels && (this.$refs.matchLabels.validateState = 'success');
        this.$refs.matchLabels && (this.$refs.matchLabels.validateMessage = '');
      }
    },
    querySearchPcRecList(options, cb) {
      this.$ajax({
        url: DI.themeShow.getPcTagSearch,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          tagSearch: options.queryString,
          pageIndex: options.pageIndex,
          pageSize: options.pageSize,
          tagType: this.ruleFormPcRec.subjectType
        }),
        success: res => {
          const matchlist = (res.data || {}).list || [];
          cb(matchlist);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    // 楼层数据入口
    defaultFloorItemData() {
      return {
        name: '',
        channelId: '',
        linkUrl: '',
        logoUrl: '',
        floorLinkType: 'inter'
      };
    },
    queryDataFloorListByChannelId() {
      this.$ajax({
        url: DI.channel.getChannelDataFloorList,
        data: JSON.stringify({
          channelId: this.channel.subjectId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.channelDataFloorList = res.data || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    openNewChannelFloorDataDialog() {
      this.floorPopFlag = true;
    },
    goback() {
      this.$parent.themeIndex = parseInt(this.channel.subjectType) - 1;
      this.$parent.subjectType = parseInt(this.channel.subjectType);
      this.$emit('change-view', 'list');
    },
    hideAddFloorPopup() {
      this.floorPopFlag = false;
      this.floorItemForm = {
        ...this.defaultFloorItemData()
      };
      this.$nextTick().then(() => {
        this.$refs.floorNameField.vaildTrigger(true);
        this.$refs.linkUrlField.vaildTrigger(true);
      });
    },
    moveFloorItem(row, opType, index) {
      let tmp = null,
        moveIndex = null,
        list = this.channelDataFloorList;

      if ((opType == 1 && index == 0) || (opType == 2 && index == list.length - 1)) return;
      this.$ajax({
        url: DI.channel.changeFloorItemOrder,
        context: this,
        loadingText: '正在移动楼层，请稍候',
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          id: row.id,
          movingState: opType
        }),
        success: res => {
          if (res.retCode == '0') {
            this.queryDataFloorListByChannelId();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    openFloorDelDailog(item) {
      this.delFloorItem = item;
      this.floorItemDelPopFlag = true;
    },
    doDelFloor() {
      this.$ajax({
        url: DI.channel.deleteDataFloorItem,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          id: this.delFloorItem.id
        }),
        context: this,
        loadingText: '正在删除楼层，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.floorItemDelPopFlag = false;
            this.queryDataFloorListByChannelId();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    closeDelFloorConfirmDialog() {
      this.floorItemDelPopFlag = false;
    },
    addChannelFloorItem() {
      this.$refs.floorItemForm.validate(valid => {
        if (valid) {
          let floorItemForm = this.floorItemForm;
          this.$ajax({
            url: DI.channel.addChannelFloorData,
            data: JSON.stringify({
              channelId: this.channel.subjectId,
              logoUrl: floorItemForm.logoUrl,
              linkUrl: floorItemForm.linkUrl,
              name: floorItemForm.name
            }),
            context: this,
            loadingText: '正在新增楼层，请稍候！',
            success: res => {
              if (res.retCode == '0') {
                this.hideAddFloorPopup();
                this.queryDataFloorListByChannelId();
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          console.log('存在未校验表单字段.');
        }
      });
    },
    // 开始时间的监听事件
    startTimeChange(val) {
      val && this.$refs.startTime.resetField();
      this.advData.startTime = val;
    },
    // 结束时间的监听事件
    endTimeChange(val) {
      val && this.$refs.endTime.resetField();
      this.advData.endTime = val;
    },
    handleJumpType(val) {
      //获取跳转类型ID(点击下拉)
      if (val == "''") {
        val = '';
      }
      this.advJumpType = val;
      this.advPageIndex = 1;
      this.queryConList(1);
      this.$refs.advPageTurn.reset();
    },
    getJumpType(val) {
      //获取跳转类型(根据类型ID)
      return Constant.getItemByValue(Constant.LIST_JUMP_TYPE, val).name;
    },
    getAdvStatus(val) {
      //获取广告状态(根据状态ID)
      return Constant.getItemByValue(Constant.ADV_STATUS, val).name;
    },
    getFloorType(val) {
      //获取楼层名称
      return Constant.getItemByValue(Constant.FLOOR_TYPE, val).name;
    },
    getFloorStatus(val) {
      //获取楼层名称
      return Constant.getItemByValue(Constant.ENABLE_FLAG, val).name;
    },
    getMatchStatus(val) {
      //获得比赛状态(推荐比赛)
      return Constant.getItemByValue(Constant.MATCH_STATUS, val).name;
    },
    showEditConfirm(item) {
      this.editMatchFlag = true;
      this.editMatchItem = _.cloneDeep(item);
    },
    showEditConfirmSpecial(item) {
      this.editMatchFlagSpecial = true;
      this.editMatchItemSpecial = _.cloneDeep(item);
    },
    showSpecialDelConfirm(channelId, id) {
      //显示删除确认框
      this.delConFlag = true;
      this.delChannelId = channelId;
      this.delId = id;
    },
    delChannel(channelId, id) {
      //删除频道
      this.delConFlag = false;
      this.$ajax({
        url: DI.topic.removeChannelRecmdMatch,
        data: {
          channelId: this.channel.subjectId, //删除频道Id
          id: id
        },
        type: 'GET',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            setTimeout(() => {
              this.querySpecialList(this.pageIndex);
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
    hideSpecialDelConfirm() {
      this.delConFlag = false;
    },
    gotoSpecial(num) {
      this.pageIndex = num;
      this.querySpecialList(num);
    },
    exchange(flag, index) {
      let curChannel = this.topicList[index];
      this.$ajax({
        url: DI.topic.moveChannelRecmdMatch,
        data: {
          channelId: curChannel.channelId,
          id: curChannel.id,
          movingState: flag
        },
        type: 'GET',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.querySpecialList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    timeFormat(time) {
      time = time + '';
      let a = time.split && time.split(/[^0-9]/);
      let d = new Date(a[0], a[1] - 1, a[2], a[3], a[4]);
      return d.getTime();
    },
    getSpecailMatchStatus(start, end) {
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
    handleFloorType(val) {
      this.editFloorInfo = {
        floorType: '2',
        authorId: '',
        advJumpType: '',
        fixedFloorId: '',
        vedioSetId: '',
        advImgUrl: '',
        advPcImgUrl: '',
        topicId: '',
        comefrom: ''
      };
      this.authorId = '';
      this.vedioSetIsShow = false;
      this.JumpName = '跳转地址';
      this.JumpPlaceholder = '请输入跳转地址';
      this.editFloorInfo.floorType = val;
    },
    searchAdvCon() {
      let getStartTime = parseInt(new Date(this.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.endTime).getTime(), 10);
      if (getStartTime >= getEndTime) {
        this.filteTtimeRemind = true;
        return false;
      } else {
        this.filteTtimeRemind = false;
      }
      this.advPageIndex = 1;
      this.queryConList(1);
      this.$refs.advPageTurn.reset();
    },
    queryConList(pageIndex) {
      //连版广告列表查询
      let startTime = this.startTime;
      let endTime = this.endTime;
      // 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
      if (startTime) {
        startTime = this.$refs.filterTimeS.$refs.input.value + ':00';
      }
      if (endTime) {
        endTime = this.$refs.filterTimeE.$refs.input.value + ':00';
      }
      this.$ajax({
        url: DI.continueAdv.queryList,
        data: JSON.stringify({
          advJumpType: this.advJumpType, //跳转类型
          advTitle: this.advTitle,
          channleId: this.channel.subjectId, //频道Id
          pageIndex: (pageIndex - 1) * this.pageSize,
          pageSize: this.pageSize,
          startTime: startTime,
          endTime: endTime,
          terminalType: 2//pc连版
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.advList = resData.list || []; //广告列表
            this.dataTotal = resData.listNum || 0; //数据总条数
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    //功能位管理列表查询
    queryFunList() {
      this.$ajax({
        url: DI.themeShow.getFunList,
        data: JSON.stringify({
          channelId: this.channel.subjectId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || [];
            this.funList = resData.dataFloorlList || []; //功能位列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    //获取PC推荐位 内容类型
    getPcRecType(val) {
      //获取广告状态(根据状态ID)
      return Constant.getItemByValue(Constant.PC_REC_TYPE, val).name;
    },
    // PC推荐标签列表查询
    queryPcRecList() {
      this.$ajax({
        url: DI.themeShow.getPcTagList,
        data: JSON.stringify({
          subjectId: this.channel.subjectId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.pcRecList = resData.list || []; //PC推荐列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    advGoto(val) {
      //连版广告翻页跳转
      this.queryConList(val);
      this.advPageIndex = val;
      document.body.scrollTop = 0;
    },
    gotoAuthor(num) {
      this.authorPageIndex = num;
      this.queryArticleList(this.sltedAuthorItem.authorId, num);
    },
    showDelConfirm(advId) {
      //连版广告删除确认框显示
      this.delAdvFlag = true;
      this.delAdvId = advId;
    },
    hideDelConfirm() {
      //连版广告删除确认框隐藏
      this.delAdvFlag = false;
    },
    delConAdv() {
      //连版广告删除
      this.hideDelConfirm();
      this.$ajax({
        url: DI.continueAdv.advDel,
        data: JSON.stringify({
          advId: this.delAdvId, //广告Id
          channleId: this.channel.subjectId //频道Id
        }),
        context: this,
        loadingText: '正在删除，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryConList(this.advPageIndex);
            this.$message.success('删除成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    funStylefn() {
      this.idFuncPositionFlag = this.funcPositionFlag;
      this.funStyle = true;
    },
    hideFunStyle() {
      this.funcPositionFlag = this.idFuncPositionFlag;
      this.funStyle = false;
    },
    switchFunStyle() {
      this.funStyle = false;
      this.$ajax({
        url: DI.themeShow.funcPosition,
        data: JSON.stringify({
          funcPositionFlag: this.funcPositionFlag, //功能位标记
          subjectId: this.channel.subjectId //主题id
        }),
        context: this,
        loadingText: '正在切换，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.funcPositionFlag = this.funcPositionFlag;
            this.$message.success('切换成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    // PC推荐删除确认框显示
    showPcRecConfirm(id) {
      this.delPcRecFlag = true;
      this.delPcRecId = id;
    },
    hidePcRec() {
      this.delPcRecFlag = false;
    },
    delPcRec() {
      this.hidePcRec();
      this.$ajax({
        url: DI.themeShow.delPcTag,
        data: JSON.stringify({
          id: this.delPcRecId, //Id
          subjectId: this.channel.subjectId //主题Id
        }),
        context: this,
        loadingText: '正在删除，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryPcRecList();
            this.$message.success('删除成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    // 功能位删除确认框显示
    showDelFunManage(id) {
      this.delFunFlag = true;
      this.delFunId = id;
    },
    hideFunManage() {
      this.delFunFlag = false;
    },
    // 功能位删除
    delFunManage() {
      this.hideFunManage();
      this.$ajax({
        url: DI.themeShow.delFunManage,
        data: JSON.stringify({
          id: this.delFunId, //Id
          channelId: this.channel.subjectId //频道Id
        }),
        context: this,
        loadingText: '正在删除，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryFunList();
            this.$message.success('删除成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    showAdvPopup(editFlag, item) {
      //添加广告&设置广告 弹框显示
      this.$refs.PcadvImgUrl && (this.$refs.PcadvImgUrl.$el.getElementsByTagName('p')[0].innerHTML = '');
      this.advPopFlag = true;
      this.editFlag = editFlag;
      if (item) {
        this.advData = { ...item };
        // 截取时间去掉秒 显示在编辑框中
        this.advData.startTime = item.startTime.substring(0, 16);
        this.advData.endTime = item.endTime.substring(0, 16);
        // 视频贴还原为帖子类型
        if (item.advJumpType == 10) {
          this.advData.advJumpType = 3;
        }
      }
      if (editFlag) {
        this.isEditing = true;
        this.popupTitle = '设置广告';
        this.jumpLabel = Constant.ADVMENT_LABEL[this.advData.advJumpType - 1].label;
        this.advJumpUrl = item.advJumpUrl;
      } else {
        this.isEditing = false;
        this.popupTitle = '添加广告';
        this.advData.advImgUrl = '';
        this.advData.advPcImgUrl = '';
      }
    },
    //editFlag true编辑,false新增
    showFunManage(editFlag, item) {
      //添加功能位 弹框显示
      this.funPopFlag = true;
      this.funEditFlag = editFlag;
      if (item) {
        if(!item.nameColor){//若无展示默认值
          item.nameColor = '#202020';
        }
        this.funData = { fontColor: {}, ...item};
        this.funData.fontColor.hex = item.nameColor;
      }
      if (editFlag) {
        this.isFunEditing = true;
        this.popupTitle = '设置功能位';
        this.funData.linkType = item.linkType / 1;
        this.funJumpLabel = Constant.FUN_LABEL[this.funData.linkType - 1].label;
        this.logoUrl = item.logoUrl;
      } else {
        (this.logoUrl = ''), (this.isFunEditing = false);
        this.popupTitle = '添加功能位';
      }
    },
    showPcRec(editFlag) {
      //PC推荐弹框 弹框显示
      this.pcRecPopFlag = true;
      this.popupTitle = '添加数据';
    },
    hideAdvPopup() {
      // 添加广告&设置广告 弹框隐藏
      this.advPopFlag = false;
      this.funPopFlag = false;
      this.pcRecPopFlag = false;
      this.vedioSetIsShow = false;
      this.pcRecSercachFlag = true;
      this.clearAdvData();
    },
    submitAdvFun() {
      // 提交广告(添加广告&设置广告)
      let interfaceStr = '',
        advData = this.advData,
        editFlag = this.editFlag,
        getStartTime = parseInt(new Date(advData.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(advData.endTime).getTime(), 10),
        channelId = '';
      if (getStartTime >= getEndTime) {
        this.timeRemind = true;
        return false;
      } else {
        this.timeRemind = false;
      }
      if (editFlag) {
        //判断是否是设置广告,提交接口、channelId不一样
        interfaceStr = DI.continueAdv.advUpdate;
        channelId = advData.channleId;
      } else {
        interfaceStr = DI.continueAdv.advAdd;
        channelId = this.channel.subjectId;
      }
      let advJumpType = advData.advJumpType;
      // 查询帖子信息是否为视频贴
      if (advJumpType == 3) {
        this.$ajax({
          url: DI.channel.getTopicInfo,
          data: JSON.stringify({
            topicId: advData.advJumpUrl
          }),
          context: this,
          loadingText: '正在校验帖子信息，请稍候！',
          success: res => {
            if (res.retCode == '0') {
              let data = res.data || {};
              if (data.isVideoTopic) {
                advJumpType = 10; // 设置为视频贴
              }
              submitNextStep.call(this, advJumpType);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      } else {
        submitNextStep.call(this, advJumpType);
      }
      function submitNextStep(advJumpType) {
        this.$refs.addAdvForm.validate(valid => {
          if (valid) {
            this.$ajax({
              url: interfaceStr,
              data: JSON.stringify({
                advId: advData.advId, //设置广告使用
                advImgUrl: '', //广告图片
                advPcImgUrl: advData.advPcImgUrl, //pc广告图片
                advJumpType: advJumpType, //跳转类型
                advJumpUrl: advData.advJumpUrl || advData.videoId, //跳转链接
                advTitle: advData.advTitle,
                channleId: channelId,
                endTime: advData.endTime + ':00', //添加秒
                showLabel: advData.showLabel,
                startTime: advData.startTime + ':00', //添加秒
                vedioSetId: advData.vedioSetId, //合集ID(跳转类型为视频时)
                terminalType: 2 //pc连版
              }),
              context: this,
              loadingText: '正在保存，请稍候！',
              success: res => {
                if (res.retCode == '0') {
                  // 如果是编辑刷新当前页 如果是创建重置为首页
                  if (this.isEditing) {
                    this.queryConList(this.advPageIndex);
                  } else {
                    this.queryConList(1);
                  }
                  this.hideAdvPopup();
                  setTimeout(() => {
                    if (editFlag) {
                      this.$message.success('编辑成功！');
                    } else {
                      this.$message.success('添加成功！');
                    }
                  }, 800);
                  this.$nextTick(() => {
                    this.clearAdvData();
                  });
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                console.error('error');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    // 添加功能位 提交
    submitFun() {
      let interfaceStr = '',
        funData = this.funData,
        editFlag = this.funEditFlag,
        id = '',
        channelId = '';
      if (editFlag) {//编辑
        interfaceStr = DI.themeShow.editFunManage;
        id = funData.id;
      } else {//新增
        interfaceStr = DI.themeShow.addFunManage;
        channelId = this.channel.subjectId;
      }
      submitNextStepFun.call(this);

      function submitNextStepFun() {
        this.$refs.funPopForm.validate(valid => {
          if (valid) {
            this.$ajax({
              url: interfaceStr,
              data: JSON.stringify({
                channelId: this.channel.subjectId,
                linkType: funData.linkType,
                linkUrl: funData.linkUrl,
                logoUrl: funData.logoUrl,
                nameColor: funData.fontColor.hex,
                name: funData.name,
                id: id
              }),
              context: this,
              loadingText: '正在保存，请稍候！',
              success: res => {
                if (res.retCode == '0') {
                  // 如果是编辑刷新当前页 如果是创建重置为首页
                  if (this.isFunEditing) {
                    this.queryFunList();
                  } else {
                    this.queryFunList();
                  }
                  this.hideAdvPopup();
                  setTimeout(() => {
                    if (editFlag) {
                      this.$message.success('编辑成功！');
                    } else {
                      this.$message.success('添加成功！');
                    }
                  }, 800);
                  this.$nextTick(() => {
                    this.clearAdvData();
                  });
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                console.error('error');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    clearAdvData() {
      this.remindTitleFlag = false;
      this.remingErrFlag = false;
      this.timeRemind = false;
      let advData = this.advData;
      this.selectedLablesItem = null;
      advData.advImgUrl = ''; //广告图片
      advData.advJumpType = ''; //跳转类型
      advData.advJumpUrl = ''; //跳转链接
      advData.advTitle = '';
      advData.endTime = '';
      advData.showLabel = '';
      advData.startTime = '';
      advData.vedioSetId = '';
      this.editFloorInfo.vedioSetId = '';
      this.jumpLabel = '跳转链接';
      this.funJumpLabel = '内部地址';
      this.jumpPlaceholder = '请输入跳转链接';
      advData.vedioSetId = ''; //合集ID(跳转类型为视频时)
      this.$refs.addAdvForm && this.$refs.addAdvForm.resetFields();
      this.$refs.editAdvForm && this.$refs.editAdvForm.resetFields();
      /******************   PC推荐标签弹框重置 jiagtao  ***************************/
      this.ruleFormPcRec.subjectType = 1;
      this.pcRecData.pcCheckcontent = '';
      this.$refs.ruleFormPcRecForm && this.$refs.ruleFormPcRecForm.resetFields();
      /******************   功能位弹框重置 jiagtao  ***************************/
      this.$refs.funPopForm && this.$refs.funPopForm.resetFields();
      this.timeRemind = false;
    },
    getAppAdvImg(imgUrl) {
      //添加广告--获取图片
      if (imgUrl) {
        this.$refs.advImgUrl.resetField();
      }
      this.advData.advImgUrl = imgUrl;
    },
    getFunImg(imgUrl) {
      //添加广告--获取图片
      if (imgUrl) {
        this.$refs.funLogoUrl.resetField();
      }
      this.funData.logoUrl = imgUrl;
    },
    getPcAdvImg(imgUrl) {
      if (imgUrl) {
        this.$refs.advImgUrl.resetField();
      }
      this.advData.advImgUrl = imgUrl;
    },
    /********************连版广告  end***********************/
    showDelMatch(id) {
      //删除推荐比赛确认显示
      this.matchDelFlag = true;
      this.delMatchId = id;
    },
    hideDelMatch() {
      //删除推荐比赛确认隐藏
      this.matchDelFlag = false;
    },
    delMatchFun() {
      //删除推荐比赛
      this.hideDelMatch();
      this.$ajax({
        url: DI.channelDisplay.delRecmdMatch,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          id: this.delMatchId
        }),
        context: this,
        loadingText: '正在删除，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            setTimeout(() => {
              this.queryRecomMatches(this.mPageNum);
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
    showEditMatch(item) {
      //编辑比赛信息弹框显示
      this.editMatchFlag = true;
      this.editMatchItem = _.cloneDeep(item);
    },
    hideEditMatch() {
      //编辑比赛信息弹框隐藏
      this.editMatchFlag = false;
    },
    hideEditMatchSpecial() {
      //编辑比赛信息弹框隐藏
      this.editMatchFlagSpecial = false;
    },
    editMatchSpecialFun() {
      //专题编辑比赛信息
      let editItem = this.editMatchItemSpecial;
      this.hideEditMatchSpecial();
      this.$ajax({
        url: DI.topic.updateChannelRecmdMatch,
        data: JSON.stringify({
          channelId: editItem.channelId,
          id: editItem.id,
          matchDes: editItem.matchDes
        }),
        context: this,
        loadingText: '正在提交，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('编辑成功！');
            setTimeout(() => {
              this.querySpecialList && this.querySpecialList(this.mPageNum);
            }, 500);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    editMatchFun() {
      //频道编辑比赛信息
      let editItem = this.editMatchItem;
      this.$refs.editAdvForm.validate(vaild => {
        if (vaild) {
          this.hideEditMatch();
          this.$ajax({
            url: DI.channelDisplay.updateMatch,
            data: JSON.stringify({
              channelId: this.channel.subjectId,
              id: editItem.id,
              matchDes: editItem.matchDes,
              advImgUrl: editItem.advImgUrl || ''
            }),
            context: this,
            loadingText: '正在提交，请稍候！',
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('编辑成功！');
                setTimeout(() => {
                  this.queryRecomMatches(this.mPageNum);
                }, 500);
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        }
      });
    },
    sltSearchDate(timeVal) {
      //点击时间轴，查询列表
      this.sltDate = timeVal;
      this.queryRecomMatches(1);
    },
    getIsPushAdv(val) {
      //获取广告状态(根据状态ID)
      return Constant.getItemByValue(Constant.PUSH_ADV, val).name;
    },
    querySpecialList(pageNum) {
      this.$ajax({
        url: DI.topic.queryRecmdMatchitem,
        data: {
          channelId: this.channel.subjectId
        },
        type: 'GET',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.topicList = res.data.recmdMatchList || [];
            this.dataTotal = this.topicList.length;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {}
      });
    },

    queryRecomMatches(pageIndex) {
      //频道推荐比赛列表查询
      this.$ajax({
        url: DI.channelDisplay.queryRecomMatches,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          startDate: this.sltDate,
          pageIndex: (pageIndex - 1) * this.pageSize,
          pageSize: this.pageSize
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.recomdMatchList = resData.matchList || []; //推荐比赛列表
            this.matchTotal = resData.matchNum || 0; //数据总条数
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    matchGoto(val) {
      //推荐比赛翻页
      this.mPageNum = val;
      this.queryRecomMatches(val);
    },
    showTopConfirm(rowItem) {
      //是否置顶弹框显示
      this.topConfirmFlag = true;
      this.curAdvItem = rowItem;
      let topVal = rowItem.isTop;
      if (topVal == '0') {
        this.isTopStr = '需要置顶';
      } else {
        this.isTopStr = '取消置顶';
      }
    },
    hideTopConfirm() {
      //是否置顶弹框隐藏
      this.topConfirmFlag = false;
    },
    showConPopup(rowItem) {
      //推到连版弹框显示
      this.curAdvItem = _.cloneDeep(rowItem);
      this.conAdvFlag = true;
    },
    hideConPopup() {
      //推到连版弹框隐藏
      $('#remindPar').hide();
      this.conAdvFlag = false;
    },
    showCancelConfirm(rowItem) {
      //撤销连版确认框显示
      this.cancelConFlag = true;
      this.curAdvItem = _.cloneDeep(rowItem);
    },
    hideCancelConfirm() {
      //撤销连版确认框隐藏
      this.cancelConFlag = false;
    },
    pushTopAdv(isCon, isCal) {
      //是否推荐比赛推到连版&是否置顶接口
      let curAdvItem = this.curAdvItem, //当前操作广告对象
        advImgUrl = curAdvItem.advImgUrl, //关联广告图片
        topVal = curAdvItem.isTop,
        pushVal = curAdvItem.isPushAdv;
      if (isCon) {
        if (!advImgUrl) {
          //判断广告图片是否上传
          $('#remindPar').show();
          return false;
        }
        if (isCal) {
          advImgUrl = ''; //如果是撤销连版，图片url清空
        }
        this.hideConPopup();
        this.hideCancelConfirm();
        if (pushVal == '0') {
          pushVal = '1';
        } else {
          pushVal = '0';
        }
      } else {
        if (topVal == '0') {
          topVal = '1';
        } else {
          topVal = '0';
        }
        this.hideTopConfirm();
      }
      this.$ajax({
        url: DI.channelDisplay.pushTopAdv,
        data: JSON.stringify({
          advImgUrl: advImgUrl, // 关联广告图片
          channelId: curAdvItem.channelId, // 频道Id
          id: curAdvItem.id,
          isPushAdv: pushVal,
          isTop: topVal
        }),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('操作成功！');
            this.queryRecomMatches(this.mPageNum);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    syncMatchData() {
      //同步推荐比赛数据
      this.$ajax({
        url: DI.channelDisplay.syncMatchData,
        data: JSON.stringify({
          startDate: this.sltDate
        }),
        context: this,
        loadingText: '正在同步，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('同步成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    topManage() {
      this.topManageFlag = true;
      this.topRecMatch();
    },
    topCalBtn() {
      this.topManageFlag = false;
    },
    getPushAdvImg(imgUrl) {
      //推荐比赛--推到连版--获取图片
      this.curAdvItem.advImgUrl = imgUrl;
      $('#remindPar').hide();
    },
    tabChange(i) {
      //tab切换方法
      this.tabIndex = i;
      if (this.isCurtime) {
        this.curTime = this.sltDate;
        this.isCurtime = false;
      }
      this.tabTitle = this.channel.subjectName;

      // 判断主题 类型
      if (this.channel.subjectType == 1 || this.channel.subjectType == 2) {
        if (i == 0) {
          //app连版管理
          this.$refs.appContinuousList.queryConList();
        }
        if (i == 1) {
          //推荐比赛
          this.queryRecomMatches(this.mPageNum);
        }
        if (i == 2) {
          //坑位
          this.queryFloorList();
        }
        if (this.isPc == 1 && this.hotChannelId != this.channel.subjectId) {
          if (i == 3) {
            //功能位
            this.queryFunList();
          }
          if (i == 4) {
            // PC推荐标签
            this.queryPcRecList();
          }
          if (i == 5) {
            //PC二级导航
            this.querySubNavs();
          }
          if (i == 6) {
            //PC频道管理
            this.queryChannelBgs();
          }
          if(this.pcContinuousShowByIndex[i]){
            // PC连版管理
            this.queryConList(this.advPageIndex);
          }
        } else if (this.isPc == 1 && this.hotChannelId == this.channel.subjectId) {
          if (i == 3) {
            // PC推荐标签
            this.queryPcRecList();
          }
          if (i == 4) {
            //PC二级导航
            this.querySubNavs();
          }
          if (i == 5) {
            //PC频道管理
            this.queryChannelBgs();
          }
          if(this.pcContinuousShowByIndex[i]){
            // PC连版管理
            this.queryConList(this.advPageIndex);
          }
        } else if (this.isPc != 1 && this.hotChannelId != this.channel.subjectId) {
          if (i == 3) {
            //功能位
            this.queryFunList();
          }
        }
      } else if (this.channel.subjectType == 3) {
        if (i == 0) {
          // 推荐比赛
          this.querySpecialList(this.pageIndex);
        }
        if (i == 1) {
          this.queryFloorList();
        }
        if (i == 2) {
          this.queryLinkList();
        }
      } else if (this.channel.subjectType == 4) {
        if (i == 0) {
          //app连版管理
          this.$refs.appContinuousList.queryConList();
        }
        if (this.isPc == 1) {
          //区别PC
          if (i == 1) {
            this.queryPcRecList();
          }
          if (i == 2) {
            this.querySubNavs();
          }
          if (i == 3) {
            this.queryChannelBgs();
          }
          if(this.pcContinuousShowByIndex[i]){
            // PC连版管理
            this.queryConList(this.advPageIndex);
          }
        }
      } else if (this.channel.subjectType == 5) {
        if (i == 0) {
          //app连版管理
          this.$refs.appContinuousList.queryConList();
        }
        if (i == 1) {
          this.queryFloorList();
        }
        if (this.isPc == 1) {
          //区别PC
          if (i == 2) {
            this.queryPcRecList();
          }
          if (i == 3) {
            this.querySubNavs();
          }
          if (i == 4) {
            this.queryChannelBgs();
          }
          if(this.pcContinuousShowByIndex[i]){
            // PC连版管理
            this.queryConList(this.advPageIndex);
          }
        }
      } else {
      }
    },
    showAddMatch() {
      //插入比赛弹框显示
      this.addMatchFlag = true;
    },
    hideAddMatch() {
      //插入比赛弹框隐藏
      this.matchID = '';
      this.matchItem = {};
      this.matchIsChecked = false;
      this.matchError = false;
      this.addMatchFlag = false;
      this.selectedMatchesList = [];
      this.thisMatchType = 1;
    },
    matchIdValidate() {
      //插入比赛--搜索比赛输入框失去焦点
      this.matchID;
      if (isNaN(this.matchID)) {
        this.matchError = true;
      } else {
        this.matchError = false;
      }
      return this.matchError;
    },
    searchMatch() {
      //插入比赛--查询比赛 wuxiaoan 18/5/28 变为失去焦点查询
      // clearTimeout(this.timer);
      if (!this.matchIdValidate() && this.matchID) {
        const _self = this;
        // this.timer = setTimeout(function() {
        _self.$ajax({
          url: DI.channelDisplay.queryMatchItem,
          data: JSON.stringify({
            matchitemShowId: parseInt(_self.matchID)
          }),
          context: _self,
          success: res => {
            if (res.retCode == '0') {
              _self.matchItem = res.data || {};
              _self.matchIsChecked = true;
            } else {
              _self.matchItem = {};
              _self.$message.error(res.retMsg);
              _self.matchIsChecked = false;
            }
          },
          error: () => {
            console.error('error');
            _self.matchIsChecked = false;
          }
        });
        // }, 1200);
      }
    },
    topRecMatch() {
      this.$ajax({
        url: DI.channelDisplay.queryTopRecomMatches,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          startDate: this.curTime
        }),
        type: 'POST',
        contentType: 'application/json',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.topRecMatchList = (res.data || {}).matchList;
            this.topDataTotal = (res.data || {}).matchList.length;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    addMatchesFun() {
      for (let item of this.selectedMatchesList) {
        this.addMatchFunNew(item);
      }
    },
    addMatchFunNew(item = {}) {
      let url = +this.channel.subjectType === 3 ? DI.channelDisplay.specialChannelAddMatchItemById : DI.channelDisplay.addMatchItemById;
      //插入比赛--添加比赛
      this.$ajax({
        url: url,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          matchitemId: item.labelId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.hideAddMatch();
            this.$message.success('添加成功');
            setTimeout(() => {
              if (this.channel.subjectType == 3) {
                this.querySpecialList(this.pageIndex);
              } else {
                this.queryRecomMatches(this.mPageNum);
              }
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
    addMatchFun() {
      //插入比赛--添加比赛
      let url = +this.channel.subjectType === 3 ? DI.channelDisplay.specialChannelAddMatchItem : DI.channelDisplay.addMatchItem;
      this.$ajax({
        url: url,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          matchitemShowId: this.matchItem.matchitemShowId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.hideAddMatch();
            this.$message.success('添加成功');
            setTimeout(() => {
              if (this.channel.subjectType == 3) {
                this.querySpecialList(this.pageIndex);
              } else {
                this.queryRecomMatches(this.mPageNum);
              }
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
    /********************推荐比赛  end***********************/
    queryFloorList() {
      //查询固定楼层列表
      for (let i = 0; i < 4; i++) {
        this.fixedFloorIdList[i].disabled = false;
      }
      this.$ajax({
        url: DI.floorMan.queryList,
        data: JSON.stringify({
          channelId: this.channel.subjectId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.floorList = res.data.list || [];
            let dataLen = this.floorList.length;
            if (dataLen < 4) {
              this.addFloorDisable = false;
            } else {
              this.addFloorDisable = true;
            }
            for (let i = 0; i < dataLen; i++) {
              let indexs = this.floorList[i].indexs;
              this.fixedFloorIdList[indexs - 1].disabled = true;
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showDelFloor(delIndex) {
      //删除楼层确认框显示
      this.floorDelFlag = true;
      this.floorDelIndex = delIndex;
    },
    hideDelFloor() {
      //删除楼层确认框隐藏
      this.floorDelFlag = false;
    },
    delFloorFun() {
      //坑位管理--删除楼层方法
      this.hideDelFloor();
      this.$ajax({
        url: DI.floorMan.deleteChannelFixedFloor,
        data: JSON.stringify({
          channelId: this.channel.subjectId,
          indexs: this.floorDelIndex
        }),
        context: this,
        loadingText: '正在删除，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('操作成功！');

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
    handleFixedFloorId(val) {
      //新增楼层--选择坑位
      this.editFloorInfo.fixedFloorId = val;
      if (val) {
        $('#fixed-floor-warn').hide();
      }
    },
    showAddFloor(rowItem) {
      //坑位管理--新增楼层
      this.$refs.advPcImgUrl && (this.$refs.advPcImgUrl.$el.getElementsByTagName('p')[0].innerHTML = '');
      if (!this.addFloorDisable) {
        //判断是否可以继续添加
        this.addFloorFlag = true;
      }
    },
    hideAddFloor() {
      //坑位管理--添加楼层弹框隐藏
      this.addFloorFlag = false;
      this.showArticleList = false;
      this.authorId = '';
      this.authorInfo = '';
      this.remindShow = false;
      this.checkedIndex = false;
      this.checkedArticles = [];
      this.editFloorInfo = {
        floorType: '2',
        authorId: '',
        advJumpType: '',
        vedioSetId: '',
        fixedFloorId: '',
        advImgUrl: '',
        advPcImgUrl: '',
        topicId: '',
        comefrom: '',
        vedioSetId: ''
      };
      this.$refs.commonFloor && this.$refs.commonFloor.resetFields();
      this.authorId = '';
      this.JumpName = '跳转地址';
      this.JumpPlaceholder = '请输入跳转地址';
      this.vedioSetIsShow = false;
    },
    getAppFloorImg(val) {
      //坑位管理--编辑楼层--封面
      this.editFloorInfo.advImgUrl = val;
      this.$refs.commonFloor.validate();
    },
    getPcFloorImg(val) {
      //坑位管理--编辑楼层--封面
      this.editFloorInfo.advImgUrl = val;
      this.$refs.commonFloor.validate();
    },
    queryAuthorList(authorId) {
      //查询作者列表(根据作者ID)
      this.$ajax({
        url: DI.authorLibrary.queryAuthorInfo,
        data: JSON.stringify({
          authorId: this.authorId //作者Id
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.isEmpty = false;
            this.authorInfo = res.data || {};
            if (JSON.stringify(this.authorInfo) == '{}') {
              this.isEmpty = true;
              this.$message.warning('未查询到数据！');
            }
            this.checkedIndex = false;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    handleFJumpType(val) {
      //添加楼层--选择跳转类型
      this.editFloorInfo.advJumpType = val;
      this.JumpName = Constant.ADVMENT_LABEL[val - 1].label;
      this.JumpPlaceholder = Constant.ADVMENT_LABEL[val - 1].placeholder;
    },
    addAuthorFloor(type) {
      //添加作者坑位
      let sltedAuthor = this.sltedAuthorItem,
        checkedArticles = this.checkedArticles,
        formData = this.editFloorInfo,
        articleList = this.articleList,
        articleIdList = [];
      if (checkedArticles.length != 3) {
        //选择文章必须为三个
        $('#sltArticleRemind').show();
        return false;
      } else {
        $('#sltArticleRemind').hide();
        for (let i = 0; i < checkedArticles.length; i++) {
          //获取选中文章id
          let checkedIndex = checkedArticles[i];
          articleIdList.push(articleList[checkedIndex].newsId);
        }
        formData.news1Id = articleIdList[0];
        formData.news2Id = articleIdList[1];
        formData.news3Id = articleIdList[2];
        formData.authorId = sltedAuthor.authorId;
        this.submitFloorFun();
      }
    },
    JumpSiteChange(id) {
      //新增坑位--根据帖子id查询帖子信息
      if (this.JumpName === '帖子ID') {
        this.$ajax({
          url: DI.channel.getTopicInfo,
          data: JSON.stringify({
            topicId: this.editFloorInfo.topicId //'77e43646969c42ebb59b451515d95079,008d153ceb194647963f4fc33929e4ab'//id
          }),
          context: this,
          loadingText: '正在保存，请稍候！',
          success: res => {
            if (res.retCode == '0') {
              let data = res.data || {};
              this.editFloorInfo.advImgUrl = ''; //帖子查询不要带入图片 用户自己传
              this.editFloorInfo.advPcImgUrl = '';
              this.editFloorInfo.comefrom = data.clubName || '';
              this.editFloorInfo.isVideoTopic = data.isVideoTopic || false;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      } else if (this.JumpName === '视频ID') {
        let vedioId = this.editFloorInfo.topicId;
        if (!vedioId && !this.vedioSetIsShow) return;
        $.ajax({
          url: `${VIDEOSET_URL}/bppchannel.api?id=${vedioId}&showset=1&format=jsonp`,
          dataFilter: function(data) {
            return data;
          },
          loadingText: '正在查询，请稍候。。。',
          dataType: 'jsonp',
          type: 'GET',
          context: this,
          success: res => {
            if (res.channels && res.channels.length) {
              this.vedioSetIsShow = true;
              this.vedioList = res.channels[0].setRelates;
            } else {
              this.vedioSetIsShow = false;
            }
          },
          error: () => {
            console.error('error');
            this.vedioSetIsShow = false;
          }
        });
      }
    },
    addCommonFloor() {
      this.$refs.commonFloor.validate(valid => {
        if (valid) {
          this.submitFloorFun();
        }
      });
    },
    submitFloorFun() {
      //提交坑位信息
      let floorFormData = this.editFloorInfo;
      let advJumpType = floorFormData.advJumpType;
      // 查询帖子信息是否为视频贴
      if (advJumpType == 3) {
        if (this.editFloorInfo.isVideoTopic) {
          advJumpType = 10;
        }
      }
      this.$ajax({
        url: DI.floorMan.editFloor,
        data: JSON.stringify({
          advImgUrl: floorFormData.advImgUrl, //广告图片
          advPcImgUrl: floorFormData.advPcImgUrl,
          advJumpType: advJumpType, //
          advJumpUrl: floorFormData.topicId, //帖子id
          authorId: floorFormData.authorId,
          channelId: this.channel.subjectId,
          indexs: floorFormData.fixedFloorId,
          floorType: floorFormData.floorType,
          news1Id: floorFormData.news1Id,
          news2Id: floorFormData.news2Id,
          news3Id: floorFormData.news3Id,
          vedioSetId: floorFormData.vedioSetId == '请选择' ? '' : floorFormData.vedioSetId //视频合集ID
        }),
        loadingText: '正在保存，请稍候！',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('提交成功！');
            this.editFloorInfo = {
              floorType: '2',
              authorId: '',
              topicId: '',
              advJumpType: '',
              fixedFloorId: '',
              advImgUrl: '',
              advPcImgUrl: ''
            };
            this.hideAddFloor();
            $('.form-item__error').hide();
            setTimeout(() => {
              this.queryFloorList();
            }, 600);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    nextStep() {
      //编辑楼层--下一步
      if (!this.editFloorInfo.fixedFloorId) {
        $('#fixed-floor-warn').show();
        return false;
      }
      let checkedIndex = this.checkedIndex;
      if (checkedIndex) {
        this.showArticleList = true;
        this.sltedAuthorItem = this.authorInfo;
        let sltedAuthorItem = this.authorInfo;
        let sltedAuthorId = sltedAuthorItem.authorId;
        this.queryArticleList(sltedAuthorId, this.authorPageIndex);
      } else {
        $('#remindTxt').show();
        return false;
      }
    },
    queryArticleList(authorId, pageNum) {
      //查询文章列表(根据作者ID)
      this.$ajax({
        url: DI.infoLibrary.getContentList,
        data: JSON.stringify({
          authorId: authorId, //作者Id
          pageIndex: pageNum ? (pageNum - 1) * this.authorPageSize : 0,
          pageSize: this.authorPageSize,
          type: true
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
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
    reset() {
      this.advTitle = '';
      (this.advJumpUrl = ''), (this.pageSize = 20);
      this.advPageIndex = 1;
      this.startTime = '';
      this.endTime = '';
      this.filteTtimeRemind = false;
    },
    changeFormAdvJumpType(value) {
      this.vedioSetIsShow = false;
      this.advData.advJumpUrl = '';
      this.advData.advJumpType = value;
      this.jumpLabel = Constant.ADVMENT_LABEL[value - 1].label;
      this.jumpPlaceholder = Constant.ADVMENT_LABEL[value - 1].placeholder;
    },
    // jiangtao
    changeFormFunJumpType(value) {
      this.funData.linkUrl = '';
      this.funData.linkType = value;
      this.funJumpLabel = Constant.FUN_LABEL[value - 1].label;
      this.funJmpPlaceholder = Constant.FUN_LABEL[value - 1].placeholder;
    },
    // 选择合集的change事件
    vedioSetChangeHandler(val) {
      this.advData.vedioSetId = val + '';
      this.editFloorInfo.vedioSetId = val + '';
    },
    handleCidTitle(item) {
      return item.setId + ':' + (item.setTitle && item.setTitle.length > 15 ? item.setTitle.slice(0, 15) + '...' : item.setTitle);
    },
    // 如果选择的跳转类型是视频，输入视频ID的时候需要查询是否有合集ID，若有显示合集ID的输入框
    queryVedioSet() {
      if (this.jumpLabel === '视频ID') {
        let vedioId = this.advData.advJumpUrl;
        if (!vedioId && !this.vedioSetIsShow) return;
        $.ajax({
          url: `${VIDEOSET_URL}/bppchannel.api?id=${parseInt(vedioId)}&showset=1&format=jsonp`,
          dataFilter: function(data) {
            return data;
          },
          dataType: 'jsonp',
          type: 'GET',
          context: this,
          loadingText: '正在查询，请稍候。。。',
          success: res => {
            if (res.channels && res.channels.length) {
              this.vedioSetIsShow = true;
              this.vedioList = res.channels[0].setRelates;
            } else {
              this.vedioSetIsShow = false;
            }
          },
          error: () => {
            console.error('error');
            this.vedioSetIsShow = false;
          }
        });
      } else {
        return false;
      }
    },
    // 连版管理上移下移
    moveVideoCol(flag, index) {
      let moveFlag = parseInt(flag); //上下移标志
      let curVideoCol = this.advList[index]; //获取当前操作行
      let curId = curVideoCol.advId;
      let postBody = {
        advId: curId, //广告id
        channleId: this.channel.subjectId, // 频道id
        moveLogo: moveFlag, // 移动标识，1上移，2下移
        terminalType: 2 //pc连版
      };
      this.$ajax({
        url: DI.continueAdv.advMove,
        data: JSON.stringify(postBody),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryConList(this.advPageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    // 功能位上下移动
    moveFunManage(flag, id) {
      let moveFlag = parseInt(flag); //上下移标志
      let postBody = {
        id: id, //功能位id
        channelId: this.channel.subjectId, // 频道id
        movingState: moveFlag // 移动标识，1上移，2下移
      };
      this.$ajax({
        url: DI.themeShow.moveFunManage,
        data: JSON.stringify(postBody),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryFunList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    // PC推荐标签上下移动
    movePcRec(pcFlag, id) {
      let movePcFlag = parseInt(pcFlag); //上下移标志
      let postBody = {
        id: id, //推荐位id
        movingState: movePcFlag // 移动标识，1上移，2下移
      };
      this.$ajax({
        url: DI.themeShow.movePcRec,
        data: JSON.stringify(postBody),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryPcRecList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    moveTopManage(flag, index) {
      let moveFlag = parseInt(flag); //上下移标志
      let curTopMageCol = this.topRecMatchList; //获取当前操作行
      let idOne = curTopMageCol[index].id;
      let idTwo = null;
      if (flag === 1) {
        idTwo = curTopMageCol[index - 1].id;
      } else {
        idTwo = curTopMageCol[index + 1].id;
      }
      let postBody = {
        channelId: this.channel.subjectId,
        idOne: idOne,
        idTwo: idTwo
      };
      this.$ajax({
        url: DI.channelDisplay.updateIndex,
        data: JSON.stringify(postBody),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.topRecMatch();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    handleAddType(val) {
      this.pcRecData.pcCheckcontent = '';
      this.$refs.pcCheckcontent && (this.$refs.pcCheckcontent.validateState = 'success');
      this.$refs.pcCheckcontent && (this.$refs.pcCheckcontent.validateMessage = '');
      this.$refs.matchLabels && (this.$refs.matchLabels.validateState = 'success');
      this.$refs.matchLabels && (this.$refs.matchLabels.validateMessage = '');
      this.selectedLablesItem = null;
      this.flag_error = false;
      this.ruleFormPcRec = {
        subjectType: val,
        subjectName: '',
        resource: 1,
        onSaleType: 1,
        logo: '',
        description: ''
      };
      this.remindTitleFlag = false;
      this.remingErrFlag = false;
      this.$refs.ruleFormPcRec && this.$refs.ruleFormPcRec.resetFields();
    },
    // PC推荐标签  jiangtao
    surePcRec() {
      let sendData = {
          tagType: this.ruleFormPcRec.subjectType,
          subjectId: this.channel.subjectId
        },
        flag = false;
      if (this.ruleFormPcRec.subjectType != 10) {
        if (this.selectedLablesItem) {
          this.$refs.matchLabels && (this.$refs.matchLabels.validateState = 'success');
          this.$refs.matchLabels && (this.$refs.matchLabels.validateMessage = '');
          flag = true;
        } else {
          this.$refs.matchLabels && (this.$refs.matchLabels.validateState = 'error');
          this.$refs.matchLabels && (this.$refs.matchLabels.validateMessage = '请输入名称/id');
          flag = false;
        }
      } else {
        flag = this.pcRecData.pcCheckcontent == '' ? false : true;
      }
      if (this.ruleFormPcRec.subjectType == 10) {
        sendData.jumpUrl = this.pcRecData.pcCheckcontent;
        sendData.tagTitle = this.pcRecData.title;
      } else {
        sendData.jumpUrl = this.selectedLablesItem && this.selectedLablesItem.id;
        sendData.tagTitle = this.selectedLablesItem && this.selectedLablesItem.name;
      }
      if (this.ruleFormPcRec.subjectType == 10 && !this.pcRecData.title) {
        this.remindTitleFlag = true;
        return;
      }
      if (this.ruleFormPcRec.subjectType != 10 && flag && !this.selectedLablesItem.name) {
        this.remingErrFlag = true;
        return;
      }
      submitPcRec.call(this);
      function submitPcRec() {
        this.$refs.ruleFormPcRecForm.validate(valid => {
          if (valid && flag) {
            this.$ajax({
              url: DI.themeShow.addgetPcTag,
              data: JSON.stringify(sendData),
              context: this,
              loadingText: '正在保存，请稍候！',
              success: res => {
                if (res.retCode == '0') {
                  this.queryPcRecList();
                  this.hideAdvPopup();
                  setTimeout(() => {
                    this.$message.success('添加成功！');
                  }, 800);
                  this.$nextTick(() => {
                    this.clearAdvData();
                  });
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                console.error('error');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    insertTop() {},
    // zhaojh 2018.5.2
    querySubNavs() {
      this.$ajax({
        url: DI.subNav.queryList,
        data: JSON.stringify({
          subjectId: this.channel.subjectId
        }),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            const resData = res.data || {};
            this.subNavList = resData.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    modifySubNav(
      item = {
        jumpUrl: '',
        navigationName: '',
        navigationType: 1
      }
    ) {
      this.$nextTick(function() {
        this.$refs.subNavForm.resetFields();
      });
      this.thisSubNav = JSON.parse(JSON.stringify(item));
      this.modifySubNavFlag = true;
    },
    thisSubNavTypechanged(index) {
      this.thisSubNav.navigationType = index;
    },
    modifySubNavSure() {
      const _self = this;
      this.$nextTick(function() {
        this.$refs.subNavForm.validate(valid => {
          if (valid) {
            _self.$ajax({
              url: DI.subNav.save,
              data: JSON.stringify({
                subjectId: _self.channel.subjectId,
                ..._self.thisSubNav
              }),
              method: 'POST',
              context: _self,
              success: res => {
                if (+res.retCode === 0) {
                  _self.modifySubNavFlag = false;
                  _self.querySubNavs();
                } else {
                  _self.$message.error(res.retMsg);
                }
              },
              error: () => {
                console.error('error');
              }
            });
          }
        });
      });
    },
    deleteSubNav(item = {}) {
      this.thisSubNav = item;
      this.deleteSubNavFlag = true;
    },
    deleteSubNavSure() {
      this.$ajax({
        url: DI.subNav.delete,
        data: JSON.stringify({
          subjectId: this.channel.subjectId,
          id: this.thisSubNav.id
        }),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            this.deleteSubNavFlag = false;
            this.querySubNavs();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    moveSubNav(item = {}, flag) {
      if (!flag) return;
      this.$ajax({
        url: DI.subNav.move,
        data: JSON.stringify({
          id: item.id,
          movingState: +flag
        }),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            this.querySubNavs();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryChannelBgs() {
      this.$ajax({
        url: DI.channelBg.queryList,
        data: JSON.stringify({
          subjectId: this.channel.subjectId
        }),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            this.channelBgsList = res.data || [];
            // 没有数据的时候，处理一下数据，让其展示默认情况
            if (this.channelBgsList.length === 0) {
              this.channelBgsList = [
                {
                  subjectId: this.channel.subjectId,
                  backgroundId: '',
                  backgroundType: 1,
                  backgroundUrl: ''
                },
                {
                  subjectId: this.channel.subjectId,
                  backgroundId: '',
                  backgroundType: 2,
                  backgroundUrl: ''
                }
              ];
            } else if (this.channelBgsList.length === 1) {
              let item = this.channelBgsList[0] || {};
              let item2 = {
                subjectId: this.channel.subjectId
              };
              if (+item.backgroundType === 1) {
                item2.backgroundType = 2;
                this.channelBgsList.push(item2);
              } else {
                item2.backgroundType = 1;
                this.channelBgsList.unshift(item2);
              }
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    modifyChannelBg(item = {}) {
      this.thisChannelBg = JSON.parse(JSON.stringify(item));
      this.modifyChannelBgFlag = true;
    },
    modifyChannelBgSure() {
      this.$ajax({
        url: DI.channelBg.save,
        data: JSON.stringify(this.thisChannelBg),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            this.modifyChannelBgFlag = false;
            this.queryChannelBgs();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    deleteChannelBg(item = {}) {
      this.thisChannelBg = item;
      this.deleteChannelBgFlag = true;
    },
    deleteChannelBgSure() {
      this.$ajax({
        url: DI.channelBg.delete,
        data: JSON.stringify({
          subjectId: this.channel.subjectId,
          backgroundId: this.thisChannelBg.backgroundId
        }),
        method: 'POST',
        context: this,
        success: res => {
          if (+res.retCode === 0) {
            this.deleteChannelBgFlag = false;
            this.queryChannelBgs();
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
};
</script>
<style scoped>
.container {
  .remindMsg {
    margin-left: -183px;
    margin-top: -10px;
    color: red;
    font-size: 12px;
  }
  .title-manage > .nav-box > div {
    margin-left: 20px;
  }
  .floor-page {
    button {
      color: #0abbfe;
    }
    .btn-group {
      height: 50px;
    }
    .is-disabled {
      color: #bfcbd9;
      cursor: not-allowed;
    }
  }
  #pcAdvImg-p {
    .cropper-tip {
      display: none;
    }
  }
  .fn-manage {
    display: flex;
    justify-content: space-between;
    height: 70px;
    background: #fff;
    align-items: center;
    padding: 0 20px;
  }
  .goback {
    font-size: 26px;
    color: #000;
    position: absolute;
    top: 21px;
    left: 25px;
  }
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
        .dropdown-list {
          top: -10px;
        }
      }
      .input-box {
        margin-bottom: -10px;
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 10px;
        padding-top: 23px;
        padding-bottom: 30px;
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
        & + button {
          margin-top: 20px;
        }
      }
    }
    .btn-operate {
      display: flex;
      button {
        & + button {
          margin-left: 30px;
        }
      }
    }
  }
  .ibox-empty {
    margin-bottom: 10px;
  }
  a {
    color: #1684c2;
    & + a {
      margin-left: 5px;
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
      }
    }
    .adv-title {
      padding-left: 8px;
    }
  }
  .reset-button {
    border-color: #ccc;
    color: #666;
  }
  .time-field {
    display: flex;
    .start-time {
      position: relative;
      background-color: #fff;
    }
    .end-time {
      margin-left: -50px;
    }
  }
  .link-par {
    padding-bottom: 8px;
  }
  .remind-par {
    display: none;
    padding-top: 5px;
    color: #f00;
    font-size: 12px;
  }
  .remind-adv {
    padding-top: 15px;
    margin-left: -250px;
  }
  .info-par p {
    padding: 3px 0;
  }
  .operate-par {
    padding: 5px 0;
  }
  .space-em {
    display: inline-block;
    width: 4em;
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
  .container .scroll-container .content {
    height: 280px;
  }
  .data-table {
    width: 100%;
    tr {
      border-bottom: solid 1px #f5f5f5;
    }
    th,
    td {
      padding: 8px 0;
      text-align: center;
    }
    tbody {
      max-height: 60px;
      overflow-y: auto;
    }
  }
  .hide {
    display: none;
  }
  .btn-block {
    text-align: center;
    .sn-button--default {
      margin-left: 30px;
    }
  }
  .info-par {
    padding-bottom: 12px;
  }
  .author-info {
    text-align: left;
  }
  .remind-text {
    display: none;
    margin-top: -6px;
    padding: 0 0 9px 80px;
    font-size: 12px;
    color: #f00;
  }
  .jump-type {
    position: relative;
    top: 10px;
  }
  .text-title {
    color: #999;
  }
  .adv-title {
    display: inline-block;
  }
  .topBtn {
    border-radius: 15px;
    padding: 5px 8px;
    color: #fff;
    background: #ffa488;
  }
  .continue-img {
    width: 120px;
    height: 80px;
  }
  .form-item {
    margin-bottom: 15px;
  }
  .topContainer {
    width: 900px;
  }
  .matchContainer {
    width: 640px;
    .form-item {
      padding: 0 30px 5px 30px;
      .form-item__label {
        width: 80px;
      }
      .form-item__content {
        margin-left: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    tbody {
      height: 400px;
    }
  }
  .btn-group {
    text-align: center;
    .cancel-btn {
      margin-left: 30px;
    }
  }
  .match-info {
    .program-col {
      width: 32%;
    }
    .program-info {
      line-height: 1.4;
    }
  }
  .selectWrap {
    display: flex;
    justify-content: space-between;
  }
  .ta-left {
    width: 100%;
    text-align: left;
  }
  .ibox {
    .time-box {
      .time-text {
        float: left;
        line-height: 30px;
      }
      .sn-timer {
        float: left;
      }
    }
    .text-title.pc-label{
      display: inline-block;
      float: left;
      margin-right: 10px;
      line-height: 25px;
    }
  }
  .colorpad{
    width: 30px;
    height: 30px;
  }
}
</style>
<style>
  .sn-popup{
    overflow: auto;
  }
  .vc-sketch{
    z-index: 9999 !important;
}
</style>

