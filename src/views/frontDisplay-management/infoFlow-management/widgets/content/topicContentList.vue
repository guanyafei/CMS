<template>
  <div class="container">
    <a href="javascript:;" v-if="channel.infoFlowId">
      <span slot="subtitle" class="goback" @click="goback">←</span>
    </a>
    <sn-topbar class="title" :title="getTitle">
      <span slot="subtitle">信息流ID: {{channel.infoFlowId}}</span>
      <span slot="link">
        <a href="javascript:;" @click="handleColumn">栏目管理</a>
      </span>
    </sn-topbar>
    <div>
      <section class="ibox between">
        <div class="search-box-topic">
          <div class="input-box">
            <sn-input width="178" radius="16" :maxlength="30" placeholder="请输入内容标题" v-model="contentTitle"></sn-input>
          </div>
          <div class="input-box">
            <sn-input width="178" radius="16" placeholder="请输入内容ID" v-model="contentId" inputType="number"></sn-input>
          </div>
          <br/>
          <div class="select-box">
            <span class="text">内容类型</span>
            <sn-select v-model="contentType" placeholder="全部" radius="16" width="120" @change="handleContentType">
              <sn-option name='全部' value=''></sn-option>
              <sn-option v-for="item in contentTypeList" :key="item.id" :name="item.name" :value="item.id" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </div>
          <div class="select-box" v-if="contentType == '0'">
            <span class="text">资讯类型</span>
            <sn-select v-model="newsType" placeholder="全部" radius="16" width="120" @change="handleNewsType">
              <sn-option name="全部" value="">全部</sn-option>
              <sn-option
                v-for="item in newsTypeList"
                :key="item.key"
                :name="item.name"
                :value="item.value"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </div>
          <div class="select-box" style="width: 400px;">
            <sn-button class="btf-batchDel" type="primary" @click="showBatchDelConfirm">批量删除</sn-button>
          </div>
        </div>
        <div class="btns">
          <p class="btn-query">
            <sn-button type="primary" @click="queryList(1)">查询</sn-button>
          </p>
          <p class="btn-query-second">
            <sn-button class="btn-reset" type="outline" @click="reset">重置</sn-button>
          </p>
          <p class="btn-query-third">
            <sn-button type="outline" @click="addContent">插入内容</sn-button>
          </p>
        </div>
      </section>
      <div>
        <div class="ibox-empty"></div>
        <sn-datatable :data="tableList" :border="true" ref='table'>
          <sn-datacolumn label="自定义" prop="checkbox" width="5%" :column-border="false">
            <sn-checkbox type="checkbox" v-model="contentListCheckAll" @change="handleCheckAllChange"></sn-checkbox>
          </sn-datacolumn>
          <sn-datacolumn label="序号" prop="index" width="8%" :column-border="false">
          </sn-datacolumn>
          <sn-datacolumn label="基本信息" prop="info" width="22%" alignment="left">
          </sn-datacolumn>
          <sn-datacolumn label="内容类型" prop="contentType" width="8%" >
          </sn-datacolumn>
          <sn-datacolumn label="展示样式" prop="isBigImg" width="8%">
          </sn-datacolumn>
          <sn-datacolumn label="展示标签" prop="showLabel" width="8%">
          </sn-datacolumn>
          <sn-datacolumn label="状态" prop="newsStatus" width="8%">
          </sn-datacolumn>
          <sn-datacolumn label="所属栏目" prop="columnName" width="8%">
          </sn-datacolumn>
          <sn-datacolumn label="上架时间" prop="createTime" width="8%">
          </sn-datacolumn>
          <sn-datacolumn label="操作" prop="opt" width="15%">
          </sn-datacolumn>

          <template slot-scope="{row}" slot="checkbox">
            <sn-checkbox type="checkbox" :label="row" v-model="contentListSelected"></sn-checkbox>
          </template>
          <div slot-scope="cell" slot="index">
            <template>
              <span class="indexTop" v-if="cell.row.isTop == 1">{{cell.index + 1 +' 置顶'}}</span>
              <span v-else>{{cell.row.$totalIndex}}</span>
            </template>
          </div>
          <template slot-scope="{row}" slot="info">
            <div class="adv-info">
              <div class="img-wrap">
                <span :class="getCornerBG(row.contentType)">{{getContentCellTypeItem(row.contentType).name}}</span>
                <img class="adv-img" :src="getImg(row)" onerror="javascript:this.src='';" alt="暂无图片" />
                <p class="id-info ellipsis" :title="row.contentId">ID：{{row.contentId}}</p>
              </div>
              <a v-if="getJumpStatus(row)" class="adv-title" href="javascript:;" @click="showPreview(row)">
                <span>{{row.contentTitle}}</span>
              </a>
              <span v-else class="adv-title">{{row.contentTitle}}</span><br>
            </div>
          </template>
          <template slot-scope="{row}" slot="contentType">
            {{getContentTypeName(row.contentType)}}
          </template>
          <template slot-scope="{row}" slot="isBigImg">
            {{getStyle(row)}}
          </template>
          <template slot-scope="{row}" slot="showLabel">
            {{row.showLabel}}
          </template>
          <template slot-scope="{row}" slot="newsStatus">
            {{getNewsStatus(row)}}
          </template>
          <template slot-scope="{row}" slot="columnName">
            <div>
              <p>{{ row.columnName }}</p>
            </div>
          </template>
          <template slot-scope="{row}" slot="createTime">
            <sn-td-date :time="row.createTime"></sn-td-date>
          </template>
          <template slot-scope="{row}" slot="opt">
            <div class="is-column">
              <p>
                <a href="javascript:;" @click="showDelConfirm(row)">删除</a>
                <a href="javascript:;" @click="editPit(row)">编辑</a>
              </p>
              <p>
                <a v-if="getChangeUpStatus(row)" href="javascript:;" @click="exchange(1,row)">上移</a>
                <a v-if="getChangeDownStatus(row)" href="javascript:;" @click="exchange(2,row)">下移</a>
              </p>
              <a v-if="insertBtnFlag && row.isTop == 0" href="javascript:;" @click="showTopConfirm(row)">置顶</a>
              <a v-if="insertBtnFlag && row.isTop == 1" href="javascript:;" @click="showTopConfirm(row)">取消置顶</a>
              <a v-if="!row.columnName" href="javascript:;" @click="addToColumn(row)">添加到栏目</a>
              <a href="javascript:;" v-else @click="removeColumn(row)">撤销栏目</a>
              <a v-if="insertBtnFlag" href="javascript:;" @click="showInsertIndexConfirm(row)">插入到</a>
            </div>
          </template>
        </sn-datatable>
      </div>
      <sn-pagination :total="pageInfo.totalNum" :size="pageInfo.pageSize" @goto="goto" />
    </div>
    <!--添加到栏目弹框-->
    <sn-confirm
      txt
      title="添加到栏目"
      ref="addColumnConfirm"
      :flag="addColumnFlag"
      @sure="addColSure('formData')"
      @close="addColClose"
      closeIcon
    >
      <sn-form ref="formData" :model="formData" :rules="columnRuleForm" label-width="86px" formWidth="286">
        <sn-form-item label="栏目名称:" prop="columnName">
          <sn-select v-model="formData.columnName" width="180" @change="handleSelectAddColumn">
            <sn-option
              v-for="item in columnTypeList"
              :key="item.id"
              :name="item.columnName"
              :value="item"
            ></sn-option>
          </sn-select>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 撤销栏目 -->
    <sn-confirm
      txt
      title="撤销栏目"
      ref="removeColumnConfirm"
      :flag="removeColumnFlag"
      @sure="removeColumnSure"
      @close="removeColumnClose"
    >
      确定要撤销吗？
    </sn-confirm>
    <!-- 删除框 -->
    <sn-confirm
      txt
      ref="delConfirm"
      :flag="delConFlag"
      @sure="delContent(delContentObj)"
      @close="hideDelConfirm"
    >
      确定要删除吗？
    </sn-confirm>
    <!-- 置顶框 -->
    <sn-confirm
      txt
      @sure="changeTop"
      @close="hideTopConfirm"
      :title="topConfirmAttrs.title"
      v-if="topConfirmFlag"
      noflag
    >
      <div class="modal__body--top">
        <sn-form
          class="modal__form--top"
          :model="topConfirmAttrs.form"
          ref="topConfirmForm"
          label-width="80px"
          formWidth="280"
        >
          <sn-form-item label="插入到第" prop="positionInput" :rules="positionInputRules">
            <sn-input
              width="168"
              :maxlength="3"
              inputType="number"
              v-model="topConfirmAttrs.form.positionInput"
            >
            </sn-input>
            <span class="modal-input__append--top">条前</span>
          </sn-form-item>
        </sn-form>
      </div>
    </sn-confirm>
    <!-- 插入到框 -->
    <sn-confirm
      txt
      :flag="insertIndexFlag"
      @sure="beforeInsertIndexSure('insertIndexForm')"
      @close="hideInsertIndexConfirm"
      title="编辑"
      :hideCancelButton="true"
      :sureBtnIsShow="false"
    >
      <sn-form
        :model="insertIndexForm"
        :rules="rules"
        ref="insertIndexForm"
        label-width="80px"
        formWidth="390"
      >
        <sn-form-item label="插入到" prop="insertIndex">
          <sn-input width="90%" :maxlength="3" v-model="insertIndexForm.insertIndex"></sn-input>
          <span class="insertText">前</span>
          <div class="form-item__error" v-if="flag_error && insertIndexForm.insertIndex != ''">{{errorTips}}</div>
        </sn-form-item>
      </sn-form>
      <div class="btn-block">
        <sn-button
          style="margin-right:23px;margin-top:10px;"
          :style="getInsertStyle"
          size="mini"
          type="primary"
          @click="beforeInsertIndexSure('insertIndexForm')"
        >确定</sn-button>
        <sn-button size="mini" @click="hideInsertIndexConfirm">取消</sn-button>
      </div>
    </sn-confirm>
    <!-- 插入内容 -->
    <sn-confirm
      @sure="sure('ruleForm')"
      @close="close"
      txt
      :flag="insertFlag"
      title="插入内容"
    >
      <sn-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        formWidth="480"
      >
        <sn-form-item label="内容类型" prop="type">
          <sn-select
            ref="typeSelect"
            v-model="ruleForm.type"
            placeholder="请选择"
            radius="6"
            width="100%"
            @change="handleInsertType"
          >
            <sn-option
              v-for="item in contentTypeList"
              :key="item.id"
              :name="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></sn-option>
          </sn-select>
        </sn-form-item>
        <templete>
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" label="内容ID" prop="id" class="is-required">
            <sn-input
              width="100%"
              placeholder="请输入资讯ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" label="资讯类型" prop="newsName">
            <sn-input width="100%" v-model="ruleForm.newsName" :disabled="true"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" label="资讯标题" prop="title">
            <sn-input
              width="100%"
              v-model="ruleForm.title"
              placeholder="请输入资讯标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" label="封面样式" prop="style" class="coverStyle">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio v-if="ruleForm.newsName!='图集'" :label="0">小图</sn-radio>
              <sn-radio :label="1">大图</sn-radio>
              <sn-radio v-if="ruleForm.newsName!='视频' && ruleForm.newsName!='PGC视频'" :label="2">三图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.style!==2 && (ruleForm.type == '0' || ruleForm.type == '9')" label="资讯封面" prop="img" ref="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
              isScoped
              :lib-imglist="ruleForm.listGroup"
              :nolibrary="false"></sn-cropper>
          </sn-form-item>
          <!-- 三图 -->
          <sn-form-item v-if="ruleForm.type == '0' || ruleForm.type == '9'" v-show="ruleForm.style==2" label="资讯封面" prop="imgList" ref="imgList">
            <sn-cropper-three
              :aspectRatio="226/148"
              :newsId="ruleForm.id"
              :listGroup="ruleForm.listGroup"
              :imgList="ruleForm.imgList"
              ref="cropper-three"
              label="封面"
              aspectWith="255"
              :aspectHeight="255*148/226+''"
              width="130"
              :height="130*148/226+''"
              @img-group="imgGroupChange"></sn-cropper-three>
            <div class="form-item__error" v-if="imgGroupFlag">请上传封面</div>
          </sn-form-item>
        </templete>
        <templete>
          <sn-form-item v-if="ruleForm.type == '4'" label="视频ID" prop="id" class="is-required">
            <sn-input
              width="100%"
              placeholder="请输入视频ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="flag_error_cid && ruleForm.type == '4'" label="合集ID" prop="cid">
            <sn-select
              v-model="ruleForm.cid"
              placeholder="请选择"
              radius="6"
              width="100%"
              @change="handleCid"
            >
              <sn-option name='请选择' value=''></sn-option>
              <sn-option
                v-for="item in contentList"
                :key="item.setId"
                :title="item.setId+':'+item.setTitle"
                :name="handleCidTitle(item)"
                :value="item.setId"
                :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '4'" label="视频标题" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入视频标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '4'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '4'" label="视频样式" prop="style">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio :label="0">小图</sn-radio>
              <sn-radio :label="1">大图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '4'" label="视频封面" prop="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
            ></sn-cropper>
          </sn-form-item>
        </templete>
        <templete>
          <sn-form-item v-if="ruleForm.type == '5'" label="合集ID" prop="id" class="is-required">
            <sn-input
              width="100%"
              placeholder="请输入合集ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '5'" label="合集标题" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入合集标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '5'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
        </templete>
        <templete>
          <sn-form-item v-if="ruleForm.type == '6'" label="专题ID" prop="id" class="is-required">
            <sn-input
              width="100%"
              placeholder="请输入专题ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '6'" label="专题标题" prop="title" :rules="[{
                required:true,
                min:1,
                max:30,
                message:'请输入标题，长度为1-30个字符',
                trigger:'change'
          }]">
            <sn-input
              width="100%"
              placeholder="请输入专题标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '6'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '6'" label="引导语" prop="contentAttachment" :rules="guideLanguageRules">
            <sn-input
              width="100%"
              placeholder="请输入引导语"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.contentAttachment"
            ></sn-input>
          </sn-form-item>
        </templete>
        <templete>
          <sn-form-item v-if="ruleForm.type == '7'" label="圈子ID" prop="Oid">
            <sn-input
              width="100%"
              placeholder="请输入圈子ID"
              v-model="ruleForm.Oid"
              @blur="changeID(ruleForm.type, ruleForm.Oid)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error2 && ruleForm.Oid != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '7'" label="帖子ID" prop="id" class="is-required">
            <sn-input
              width="100%"
              placeholder="请输入帖子ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '7'" label="帖子标题" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入帖子标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '7'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '7'" label="来自圈子" prop="comefrom">
            <sn-input width="100%" v-model="ruleForm.comefrom" :disabled="true"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '7'" label="帖子封面" prop="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
            ></sn-cropper>
          </sn-form-item>
        </templete>
        <!-- 通用类型 -->
        <templete>
          <sn-form-item v-if="ruleForm.type == '11'" label="展示文字" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入链接展示文字，5-30个字"
              :maxlength="30"
              :totalWords="30"
              v-model="ruleForm.title"
              :showWord="true"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '11'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <sn-option
                v-for="item in columnTypeList"
                :key="item.id"
                :name="item.columnName"
                :value="item.id"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item
            label='跳转链接'
            ref="formItem"
            prop="jumpUrl"
            :rules="linkJumpRules"
            v-if="ruleForm.type == '11'"
          >
            <sn-radio-group v-model="ruleForm.jumpStyle" @change="changeJumpStyle">
              <sn-radio
                v-for="linkType in linkTypes"
                :key="linkType.key"
                :label="linkType.value"
              >{{ linkType.name }}</sn-radio>
            </sn-radio-group>
            <sn-input
              v-model="ruleForm.jumpUrl"
              :placeholder="jumpPlaceholder"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '11'" label="展示标签">
            <sn-input width="100%" v-model="ruleForm.showLabel" :maxlength="2"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '11'" label="封面样式" prop="style" class="coverStyle">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio :label="0">小图</sn-radio>
              <sn-radio :label="1">大图</sn-radio>
              <sn-radio :label="2">三图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.style!==2 && ruleForm.type == '11'" label="资讯封面" prop="img" ref="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
              isScoped
              :lib-imglist="ruleForm.listGroup"
              :nolibrary="false"
            ></sn-cropper>
          </sn-form-item>
          <!-- 通用三图 -->
          <sn-form-item v-if="ruleForm.type == '11'" v-show="ruleForm.style==2" label="资讯封面" prop="imgList" ref="imgList">
            <sn-cropper-three
              :aspectRatio="226/148"
              :newsId="ruleForm.id"
              :listGroup="ruleForm.listGroup"
              :imgList="ruleForm.imgList"
              ref="cropper-three"
              label="封面"
              aspectWith="255"
              :aspectHeight="255*148/226+''"
              width="120"
              :height="120*148/226+''"
              @img-group="imgGroupChange"
            ></sn-cropper-three>
            <div class="form-item__error" v-if="imgGroupFlag">请上传图片</div>
          </sn-form-item>
        </templete>
        <!-- 节目类型/栏目类型 -->
        <templete>
          <sn-form-item v-if="ruleForm.type == '13' || ruleForm.type == '16'" :label="getRuleFormTypeName(ruleForm.type) + '查询'" prop="id" class="is-required">
            <input class="programColumnInput" v-model="ruleForm.id" style="display: none;">
            <sn-autocomplete
              v-model="ruleForm.program_column_id"
              valueKey="matchName"
              :fetchSuggestions="queryProgramAndColumnAsync"
              :resetFun="resetFun"
              :isSuggestionsPages="true"
              :placeholder="'请输入' + getRuleFormTypeName(ruleForm.type) + 'ID或标题'"
              @select="selectProgramAndColumn"
              :width="400"
              :resetFlag="resetFlag"
              ref="autoComplete"
            >
              <template slot-scope="{item}">
                <div class="match-suggestions__item" style="white-space: nowrap;text-overflow: ellipsis;">
                  <template v-if="item.subjectName">
                    <span>{{item.subjectName}}</span>
                  </template>
                  <span v-else>{{item.name}}</span>
                </div>
              </template>
            </sn-autocomplete>
            <div class="form-item__error" v-if="flag_error_id && ruleForm.id == ''">请输入ID</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '13' || ruleForm.type == '16'" :label="getRuleFormTypeName(ruleForm.type) + '标题'" prop="title" :rules="[{
                required:true,
                min:1,
                max:30,
                message:'请输入标题，长度为1-30个字符',
                trigger:'change'
          }]">
            <sn-input width="100%" :placeholder="'请输入' + getRuleFormTypeName(ruleForm.type) + '标题'" :maxlength="30" :totalWords="30" :showWord="true"
                      v-model="ruleForm.title"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '13' || ruleForm.type == '16'" label="引导语" prop="contentAttachment" :rules="guideLanguageRules">
            <sn-input width="100%" placeholder="请输入引导语" :maxlength="25" :totalWords="25" :showWord="true"
                      v-model="ruleForm.contentAttachment"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '13' || ruleForm.type == '16'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <template v-if="!duringAjaxColType">
                <sn-option
                  v-for="item in columnTypeList"
                  :key="item.id"
                  :name="item.columnName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></sn-option>
              </template>
              <div v-if="duringAjaxColType" class="text-center">数据加载中。。。</div>
              <div v-if="!duringAjaxColType&&columnTypeList.length==0" class="text-center">暂无数据</div>
            </sn-select>
          </sn-form-item>
        </templete>
        <!-- 比赛类型 -->
        <templete>
          <sn-form-item v-if="ruleForm.type == '15'" label="选择比赛" prop="matchLabels" :rules="matchRules" ref="matchLabels">
            <sn-autocomplete
              v-model="ruleForm.searchInput"
              valueKey="matchName"
              :fetchSuggestions="querySearchAsync"
              :isSuggestionsPages="true"
              placeholder="输入球队/比赛关键词快速添加"
              @select="selectItem"
              :width="400"
            >
              <template slot-scope="{item}" slot="history">
                {{item.matchName || item.competitionName}}
              </template>
              <template slot-scope="{item}">
                <div class="match-suggestions__item" style="white-space: nowrap;text-overflow: ellipsis;">
                  <template v-if="item.matchName">
                    <span>{{item.matchName}}</span>
                    <span>{{item.matchDateTime}}</span>
                  </template>
                  <span v-else>{{item.competitionName}}</span>
                </div>
              </template>
            </sn-autocomplete>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '15'" prop="sportItemId">
            <sn-select v-model="ruleForm.sportItemId" @change="selectSport" placeholder="选择运动" width="400" class="marginRight">
              <template>
                <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId" :disabled="item.disabled"></sn-option>
              </template>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '15'" prop="group">
            <div class="is-line">
              <sn-select v-model="ruleForm.competitionId" :disabled="sportItemId?false:true" @change="selectCompetition" placeholder="选择赛事" width="130" class="marginRight">
                <template v-if="!duringAjaxCompetition">
                  <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
                </template>
                <div v-if="duringAjaxCompetition" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxCompetition&&competitionList.length==0" class="text-center">暂无数据</div>
              </sn-select>
              <sn-select v-model="ruleForm.seasonId" :disabled="competitionId?false:true" @change="selectSeason" placeholder="选择赛季" width="130" class="marginRight">
                <template v-if="!duringAjaxSeason">
                  <sn-option v-for="item in seasonList" :key="item.seasonId" :name="item.seasonName" :value="item.seasonId"></sn-option>
                </template>
                <div v-if="duringAjaxSeason" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxSeason&&seasonList.length==0" class="text-center">暂无数据</div>
              </sn-select>
              <sn-select v-model="ruleForm.roundId" :disabled="seasonId?false:true" @change="selectRound" placeholder="选择阶段"   width="130" class="marginRight">
                <template v-if="!duringAjaxRound">
                  <sn-option v-for="item in roundList" :key="item.stageRoundId" :name="item.stageRoundName" :value="item.stageRoundId"></sn-option>
                </template>
                <div v-if="duringAjaxRound" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxRound&&roundList.length==0" class="text-center">暂无数据</div>
              </sn-select>
            </div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '15'" prop="matchId">
            <sn-select v-model="ruleForm.matchId" :disabled="roundId?false:true" @change="selectMatch" placeholder="选择比赛" width="400">
              <template v-if="!duringAjaxMatch">
                <sn-option v-for="item in matchList" :key="item.matchId" :name="item.matchName" :value="item.matchId"></sn-option>
              </template>
              <div v-if="duringAjaxMatch" class="text-center">数据加载中。。。</div>
              <div v-if="!duringAjaxMatch&&matchList.length==0" class="text-center">暂无数据</div>
            </sn-select>
            <div class="form-item__error" v-if="flag_error_matchId && ruleForm.matchId == ''">请选择比赛</div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '15'" label="引导语" prop="contentAttachment" :rules="guideLanguageRules">
            <sn-input width="100%" placeholder="请输入引导语" :maxlength="30" :totalWords="30" :showWord="true"
                      v-model="ruleForm.contentAttachment"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '15'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <template v-if="!duringAjaxColType">
                <sn-option
                  v-for="item in columnTypeList"
                  :key="item.id"
                  :name="item.columnName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></sn-option>
              </template>
              <div v-if="duringAjaxColType" class="text-center">数据加载中。。。</div>
              <div v-if="!duringAjaxColType&&columnTypeList.length==0" class="text-center">暂无数据</div>
            </sn-select>
          </sn-form-item>
        </templete>
        <!-- 小组类型 -->
        <templete>
          <sn-form-item v-if="ruleForm.type == '14'" label="选择小组" group="sportItemId" prop="sportItemId">
            <sn-select v-model="ruleForm.sportItemId" @change="selectSport" placeholder="选择运动" width="400" class="marginRight">
              <template>
                <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId" :disabled="item.disabled"></sn-option>
              </template>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '14'" prop="competitionId">
            <sn-select v-model="ruleForm.competitionId" :disabled="sportItemId?false:true" @change="selectCompetition" placeholder="选择赛事" width="400" class="marginRight">
              <template v-if="!duringAjaxCompetition">
                <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
              </template>
              <div v-if="duringAjaxCompetition" class="text-center">数据加载中。。。</div>
              <div v-if="!duringAjaxCompetition&&competitionList.length==0" class="text-center">暂无数据</div>
            </sn-select>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '14'" prop="groupId">
            <div class="is-line">
              <sn-select v-model="ruleForm.seasonId" :disabled="competitionId?false:true" @change="selectSeason" placeholder="选择赛季" width="130" class="marginRight">
                <template v-if="!duringAjaxSeason">
                  <sn-option v-for="item in seasonList" :key="item.seasonId" :name="item.seasonName" :value="item.seasonId"></sn-option>
                </template>
                <div v-if="duringAjaxSeason" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxSeason&&seasonList.length==0" class="text-center">暂无数据</div>
              </sn-select>
              <sn-select v-model="ruleForm.roundId" :disabled="seasonId?false:true" @change="selectRound" placeholder="选择阶段"   width="130" class="marginRight">
                <template v-if="!duringAjaxRound">
                  <sn-option v-for="item in roundList" :key="item.stageRoundId" :name="item.stageRoundName" :value="item.stageRoundId"></sn-option>
                </template>
                <div v-if="duringAjaxRound" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxRound&&roundList.length==0" class="text-center">暂无数据</div>
              </sn-select>
              <sn-select v-model="ruleForm.groupId" :disabled="roundId?false:true" @change="selectGroup" placeholder="选择小组" width="130" class="marginRight">
                <template v-if="!duringAjaxGroup">
                  <sn-option v-for="item in groupList" :key="item.groupId" :name="item.groupName" :value="item.groupId"></sn-option>
                </template>
                <div v-if="duringAjaxGroup" class="text-center">数据加载中。。。</div>
                <div v-if="!duringAjaxGroup&&groupList.length==0" class="text-center">暂无数据</div>
              </sn-select>
            </div>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '14'" label="小组名称" prop="groupName">
            <sn-input width="100%" placeholder="请输入小组名称" :maxlength="30" :totalWords="30" :showWord="true"
                      v-model="ruleForm.groupName" :disabled="!ruleForm.groupId"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '14'" label="引导语" prop="contentAttachment" :rules="guideLanguageRules">
            <sn-input width="100%" placeholder="请输入引导语" :maxlength="30" :totalWords="30" :showWord="true"
                      v-model="ruleForm.contentAttachment"></sn-input>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.type == '14'" label="所属栏目" prop="colType">
            <sn-select v-model="ruleForm.colType" width="100%" @change="handleSelectInsertColumn">
              <template v-if="!duringAjaxColType">
                <sn-option
                  v-for="item in columnTypeList"
                  :key="item.id"
                  :name="item.columnName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></sn-option>
              </template>
              <div v-if="duringAjaxColType" class="text-center">数据加载中。。。</div>
              <div v-if="!duringAjaxColType&&columnTypeList.length==0" class="text-center">暂无数据</div>
            </sn-select>
          </sn-form-item>
          <div v-if="ruleForm.type == '14'">
            <div class="ibox-empty"></div>
            <sn-table :data='matchList' tdHeight='15' ref='table'>
              <sn-table-column wall="false" tdPaddingRight="5" width="10%" sloted>
                <template slot-scope="row">
                  <sn-checkbox v-model="dialogSelected" :label="row" :disabled="checkListDisabled(row)" theme="default"></sn-checkbox>
                </template>
              </sn-table-column>
              <sn-table-column label='比赛ID' prop='matchId' width='30%' sloted>
                <template slot-scope="row">
                  {{row.matchId}}
                </template>
              </sn-table-column>
              <sn-table-column label='比赛名称' prop='matchName' width='30%' sloted>
                <template slot-scope="row">
                  {{row.matchName}}
                </template>
              </sn-table-column>
              <sn-table-column label='比赛时间' prop='matchTime' width='30%' sloted>
                <template slot-scope="row">
                  {{row.matchTime}}
                </template>
              </sn-table-column>
            </sn-table>
            <div class="ibox-empty"></div>
          </div>
          <sn-form-item v-if="ruleForm.type == '14'" label="楼层展示内容数量" labelWidth="145px" prop="showNum">
            <sn-radio-group v-model="showNumColumn">
              <sn-radio
                v-for="(item,index) in showNumColumnList"
                :label="index"
                :key="index">{{item.labelName}}</sn-radio>
            </sn-radio-group>
          </sn-form-item>
        </templete>
      </sn-form>
    </sn-confirm>
    <sn-confirm
      title="提示"
      :flag="checkWordConfirm"
      close-icon
      @close="closeCheck"
      @sure="sureCheck"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag
    >
      <div class="modal-body">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word" v-for="(word, index) in sensitiveMsgList" :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
    <!-- 批量删除框 -->
    <sn-confirm txt ref="batchDelConfirm" :flag="batchDelConFlag" @sure="batchDel()" @close="hideBatchDelConfirm">
      确定要删除已选内容吗？
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { getInfoPreviewUrl, VIDEOSET_URL } from 'utils/envUrl';
import { getImgPixelSize } from 'src/utils/image-operate';
const MAX_TOP_NUM = 20; // 允许最大置顶数量

export default {
  props: {
    channel: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      removeColumnFlag: false,
      columnRuleForm: {
        columnName: [
          {
            required: true,
            type: 'string',
            message: '请选择栏目',
            trigger: 'change'
          }
        ]
      },
      formData: {
        columnName: ''
      },
      curItem: {}, // 当前对象
      curRemItem: {}, // 撤销栏目对象
      curSelectedItem: {}, // 当前选中的栏目
      addColumnFlag: false,
      columnTypeList: [], // 栏目列表
      pageInfo: {
        columnContentNum: 0,
        topCountColumn: 0,
        topCountAll: 0, // 置顶条数
        totalNum: 0,
        pageIndex: 1,
        pageSize: 20
      },
      contentTitle: '',
      contentId: '',
      contentType: '',
      newsType: '',
      contentTypeList: Constant.CONTENT_LIST_TYPES,
      contentCellTypes: Constant.CONTENT_CELL_TYPES,
      newsTypeList: Constant.ARTICLE_TYPE,
      linkTypes: Constant.COMMON_JUMP_LINK_TYPES,
      tableList: [],
      contentList: [], //合集ID列表
      vedioTitle: '', //合集标题
      ruleForm: {
        colType: '',
        type: '0',
        cid: '',
        id: '',
        Oid: '',
        newsName: '',
        title: '',
        img: '',
        imgList: {
          img1: '',
          img2: '',
          img3: ''
        },
        style: 0,
        jumpStyle: 1, // 1：内部页面路由 2：内链h5 3：外链h5
        comefrom: '',
        contentAttachment: '',
        jumpUrl: '',
        showLabel: '',
        listGroup: [],
        sportItemId: '', // 运动
        competitionId: '',// 赛事
        seasonId: '', //赛季
        groupId: '', //小组,
        roundId: '', //阶段/轮次
        matchId: '', //比赛
        matchName: '',
        groupName: '',
        program_column_id: '',
        searchInput: '', //插入弹窗-比赛 搜索框内容
      },
      insertFlag: false,
      delConFlag: false, //删除弹框显示开关
      delContentId: '', //删除内容Id
      delContentObj: '', //删除内容
      batchDelConFlag: false, //批量删除弹窗显示开关
      topConfirmFlag: false, //置顶确认框开关
      selectedContentItem: null,
      topConfirmAttrs: {
        title: '',
        form: {
          positionInput: ''
        }
      },
      isTopStr: '',
      flag_error: false,
      flag_error2: false,
      flag_error_cid: false,
      insertIndexFlag: false,
      insertIndexForm: {
        insertIndex: ''
      },
      insertIndexItem: {},
      errorTips: 'error',
      imgGroupFlag: false,
      insertBtnFlag: false,
      sensitiveMsgList: [],
      checkWordConfirm: false, //敏感词提示弹框
      isChannelDes: true,
      params: {},


      contentListCheckAll: false, //内容管理列表全选
      contentListSelected: [],  //内容管理列表多选内容

      programColumnList: [],  //插入弹窗-节目/栏目下拉数据
      resetFlag: false,

      matchTableList: [], //插入/编辑弹窗-小组表格数据
      dialogSelected: [],  //插入/编辑弹窗-小组-表格多选内容
      showNumColumnList: [    //插入/编辑弹窗-小组 radio
        {
          labelName: '1条'
        },
        {
          labelName: '2条'
        },
      ],

      /**插入弹窗关联下拉**/
      showNumColumn: 1, //插入/编辑弹窗-小组 已选radio
      sportItemId: '', // 运动
      sportItemName: '',
      sportList: [],
      competitionId: '',// 赛事
      competitionName: '',
      competitionList: [],
      seasonId: '', //赛季
      seasonName: '',
      seasonList: [],
      groupId: '', //小组
      groupName: '',
      groupList: [],
      roundId: '', //阶段/轮次
      roundName: '',
      roundList: [],
      matchId: '', //比赛
      matchList: [],
      matchName: '',
      duringAjaxCompetition: false,
      duringAjaxSeason: false,
      duringAjaxRound: false,
      duringAjaxGroup: false,
      duringAjaxMatch: false,

      selectedLabelsItem: null,

      flag_error_id: false, //插入-id
      flag_error_matchId: false,  //插入比赛-选取比赛
      flag_error_groupName: false,  //插入小组-输入小组名称
    };
  },
  created() {
    $('body').css('overflow', 'visible');
  },
  watch: {
    insertFlag(val) {
      $('body, html').css('overflow', val ? 'hidden' : 'visible');
    },
    //支持设置楼层露出的内容数量，已选择比赛情况下，默认选择1条内容露出，未选择比赛，则默认选择2条内容露出；
    dialogSelected(val, oldVal) {
      if (oldVal.length == 0) this.showNumColumn = 0;
      if (val.length == 0) this.showNumColumn = 1;
    },
    //检测内容列表多选
    contentListSelected(newVal, oldVal) {
      if (newVal.length < this.tableList.length) {
        //当页无选中项时，取消全选按钮选中
        this.contentListCheckAll = false;
      }
      if (newVal.length == this.tableList.length && newVal.length) {
        //当页所有项都被选中时，自动勾选全选按钮
        this.contentListCheckAll = true;
      }
    }
  },
  computed: {
    coverArr() {
      let coverContent = this.handleImgList(this.ruleForm.imgList);
      return coverContent ? coverContent.split(';') : [];
    },
    jumpTypeItem() {
      return Constant.getItemByValue(this.linkTypes, this.ruleForm.jumpStyle);
    },
    jumpPlaceholder() {
      return this.jumpTypeItem.placeholder || '请输入';
    },
    getInsertStyle() {
      let reg = /^[0-9]+$/;
      if (!reg.test(this.insertIndexForm.insertIndex) || this.insertIndexForm.insertIndex == 0 || this.insertIndexForm.insertIndex > 100) {
        return `background-color:#ddd;cursor:not-allowed;`;
      } else {
        return `background-color:#09BBFE;cursor:pointer;`;
      }
    },
    lastTopPosition() {
      const { columnContentNum, topCountAll, topCountColumn } = this.pageInfo;

      return columnContentNum + (topCountAll - topCountColumn);
    },
    guideLanguageRules() {
        return [
          {
            required: true,
             min: 1,
            max: 30,
            message: '请输入引导语,长度在1-30个字符',
            trigger: 'change'
          }]
    },
    rules() {
      let singleCoverValidator = (rule, value, callback) => {
        if (this.ruleForm.type == '5' || this.ruleForm.type == '7' || this.isGifUrl(value) || this.ruleForm.style == 2 || this.ruleForm.style == 0) {
          callback();
        } else {
          getImgPixelSize(value, this.ruleForm.style == 1, { max: null, min: 500 })
            .then(() => {
              callback();
            })
            .catch(err => {
              let msg = err.msg || '';
              if (err.min && err.width < err.min) {
                msg = `当前封面的像素宽度${err.width}px,小于${err.min}px`;
              }
              callback(new Error(msg));
            });
        }
      };
      return {
        img: [
          {
            required: true,
            type: 'string',
            message: '请上传封面',
            trigger: 'change'
          },
          {
            validator: singleCoverValidator,
            trigger: 'submit'
          }
        ],
        imgList: [
          {
            required: true,
            type: 'object',
            message: '请上传封面',
            trigger: 'change'
          }
        ],
        newsName: [
          {
            required: true,
            message: '资讯类型不能为空',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            min: 5,
            max: 30,
            message: '请输入标题，长度为5-30个字符',
            trigger: 'change'
          }
        ],
        style: [
          {
            required: true,
            type: 'number',
            message: '请选择样式',
            trigger: 'blur'
          }
        ],
        insertIndex: [
          {
            required: true,
            message: '请输入排序号',
            trigger: 'change'
          }
        ],
        groupName: [
          {
            required: true,
            min: 1,
            max: 30,
            message: '请输入小组名称，长度为1-30个字符',
            trigger: 'change'
          }
        ],
        groupId: [
          {
            required: true,
            type: 'number',
            message: '请选择小组',
            trigger: 'change'
          }
        ],
      };
    },
    linkJumpRules() {
      const linkJumpValidation = (rule, value, callback) => {
        let { reg, errMsg } = this.jumpTypeItem;

        if (value && !reg.test(value)) {
          callback(new Error(errMsg));
        }

        callback();
      };
      return [
        {
          required: true,
          message: '请输入跳转链接',
          trigger: 'change'
        },
        {
          validator: linkJumpValidation,
          trigger: 'change'
        }
      ];
    },
    positionInputRules() {
      const { isTop, columnId } = this.selectedContentItem;
      const { topCountAll, topCountColumn, columnContentNum, totalNum } = this.pageInfo;

      const specificPositionValidor = (rule, value, callback) => {
        value = +value;
        let min = 0;
        let max = totalNum < 100 ? totalNum : 100;

        if (isTop) {
          if (columnId) {
            // 场景复杂不予考虑
          } else {
            min = this.lastTopPosition + 1;
          }
        } else {
          if (columnId) {
            // 场景复杂不予考虑
          } else {
            min = columnContentNum + 1;
            max = this.lastTopPosition + 1;
            if (max > totalNum) {
              max = totalNum;
            }
          }
        }

        if (value < min || value > max) {
          callback(new Error(`请输入${min}-${max}数字`));
        }
        callback();
      };

      return [
        {
          validator: specificPositionValidor,
          trigger: 'change'
        }
      ];
    },
    aspectRatio() {
      let picStyle = this.ruleForm.style;
      if (picStyle == '1') {
        return 694 / 390;
      }
      if (picStyle == '0' || picStyle == '2') {
        return 226 / 148;
      }
    },
    aspectRatioWidth() {
      return 131 * this.aspectRatio;
    },
    //根据信息流类型展示标题
    getTitle() {
      let name = '';
      name = this.channel.subjectName || this.infoFlow.infoFlowName;
      return name
    },
  },
  mounted() {
    if (this.channel.isFrom == 'topic' && Constant.getItemByValue(Constant.CONTENT_LIST_TYPES, 9).id == '9') {
      this.contentTypeList.splice(5, 1); // 专题暂时隐藏pp号
    }
    // this.changeStyle(2);
    this.insertBtnFlag = true;
    this.queryList(1);
    window.scrollTo(0, 0);
  },
  methods: {
    queryList(pageIndex) {
      // 内容列表查询
      let reg = /^[\u4E00-\u9FA5\\s]+$/;
      if (reg.test(this.contentId)) {
        this.$message.warning('输入的内容ID不正确');
        this.contentId = '';
        return;
      }

      if (this.contentTitle == '' && this.contentId == '' && this.contentType == '' && this.newsType == '') {
        this.insertBtnFlag = true;
      } else {
        this.insertBtnFlag = false;
      }

      let params = {
        channelId: this.channel.infoFlowId,
        pageNum: (pageIndex - 1) * this.pageInfo.pageSize,
        pageSize: this.pageInfo.pageSize, // 20
        contentTitle: this.contentTitle,
        contentId: this.contentId || '',
        contentType: this.contentType == '' ? this.contentType : parseInt(this.contentType),
        newsType: this.newsType
      };
      params = this.$bus.deleteNullProperty(params);

      this.$ajax({
        url: DI.topic.queryContentList,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          let data = res.data || {};
          if (res.retCode == '0') {
            this.$bus.$emit('syncCurPage', pageIndex);
            let list = data.list || [];
            this.contentListCheckAll = false; //内容管理列表全选
            this.contentListSelected = [];  //内容管理列表多选内容
            this.pageInfo.pageIndex = pageIndex;
            this.pageInfo.topCountAll = data.topCountAll || 0;
            this.pageInfo.topCountColumn = data.topCountColumn || 0;
            this.pageInfo.columnContentNum = data.columnContentNum || 0;
            this.pageInfo.totalNum = data.contentNum || 0;

            list.map((item, index) => {
              let preItem = index === 0 ? null : list[index - 1];
              item.$totalIndex = params.pageNum + index + 1;
              if (pageIndex === 1) {
                if (index === 0) {
                  item.isNumOne = 1;
                } else {
                  item.lastTop = preItem.isTop;
                  item.isSameFlag = item.columnId == preItem.columnId;
                }
              } else {
                if (index != 0) {
                  item.lastTop = preItem.isTop;
                  item.isSameFlag = item.columnId == preItem.columnId;
                }
              }
              if (item.contentTitle.length > 50) {
                item.contentTitle = item.contentTitle.substring(0, 50) + '...';
              }
            });

            this.tableList = list;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {}
      });
    },
    queryColumnList() {
      //栏目查询
      this.$ajax({
        url: DI.topic.querySpecialChannelColumn,
        data: JSON.stringify({
          subjectId: this.channel.infoFlowId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.columnTypeList = res.data || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: res => {
          console.error('error');
        }
      });
    },
    showTopConfirm(rowItem) {
      // 是否置顶弹框显示
      let { topConfirmAttrs } = this;
      let { isTop, columnId } = rowItem;

      this.selectedContentItem = { ...rowItem };
      if (isTop == 0) {
        if (this.topCountAll >= MAX_TOP_NUM) {
          this.$message.warning(`最多置顶${MAX_TOP_NUM}数据，无法置顶`);
          return;
        }
      }

      if (columnId || this.lastTopPosition === this.pageInfo.totalNum) {
        this.beforeSubmitAjax();
        return;
      }

      if (isTop == 0) {
        topConfirmAttrs.title = '置顶';
      } else {
        topConfirmAttrs.title = '取消置顶';
      }

      this.topConfirmFlag = true;
    },
    handleSelectInsertColumn(val) {
      //所属栏目
      this.ruleForm.colType = val;
    },
    handleSelectAddColumn(item) {
      //添加栏目
      this.formData.columnName = item.columnName;
      this.curSelectedItem = item;
    },
    addColSure(formName) {
      //添加栏目---确定
      this.$refs[formName].validate(valid => {
        if (valid) {
          let pms = {
            channelId: this.channel.infoFlowId, //频道id
            relationId: this.curItem.relationId, //内容id
            columnId: this.curSelectedItem.id //栏目id
          };
          this.$ajax({
            url: DI.topic.insertToColumn,
            data: JSON.stringify(pms),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.formData.columnName = '';
                this.addColumnFlag = false;
                let jumpPage = 1;
                // jumpPage = Math.ceil((this.curItem.$index + 1) / this.pageInfo.pageSize);
                jumpPage = Math.ceil(((this.curItem.$index || (this.curItem.$totalIndex - 1)) + 1) / this.pageInfo.pageSize);
                setTimeout(() => {
                  this.queryList(jumpPage);
                }, 1300);
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
    addColClose() {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.addColumnFlag = false;
    },
    addToColumn(row) {
      //添加栏目
      this.$refs.formData && this.$refs.formData.resetFields();
      this.curItem = row;
      this.queryColumnList();
      this.addColumnFlag = true;
    },
    removeColumnSure() {
      //撤销栏目---确定
      this.$ajax({
        url: DI.topic.removeToColumn,
        data: JSON.stringify({
          channelId: this.channel.infoFlowId,
          relationId: this.curRemItem.relationId,
          columnId: this.curRemItem.columnId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.removeColumnFlag = false;
            setTimeout(() => {
              this.queryList(this.pageInfo.pageIndex);
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
    removeColumnClose() {
      this.removeColumnFlag = false;
    },
    removeColumn(row) {
      //撤销栏目
      this.curRemItem = row;
      this.removeColumnFlag = true;
    },
    handleColumn() {
      //跳转到栏目列表页
      this.$emit('change-view', 'columnlist');
      this.$emit('input', this.channel);
    },
    isGifUrl(url) {
      return /.*.gif(\?.*)?$/.test(url);
    },
    imgGroupChange(imgList) {
      if (imgList.img1 != '' && imgList.img2 != '' && imgList.img3 != '') {
        this.imgGroupFlag = false;
      }
      this.ruleForm.imgList = imgList;
    },
    getStyle(row) {
      if (row.contentType == '5' || row.contentType == '6' || row.contentType == '7' || row.contentType == '13' || row.contentType == '14' || row.contentType == '15' || row.contentType == '16') {
        return '';
      } else {
        if (row.isBigImg == 0) {
          return '小图';
        } else if (row.isBigImg == 1) {
          return '大图';
        } else if (row.isBigImg == 2) {
          return '三图';
        }
      }
    },
    getNewsStatus(row) {
      if (row.newsStatus == 1 && row.contentType != '6') {
        return '正常';
      } else if (row.newsStatus == 2 && row.contentType != '6') {
        return '隐藏';
      } else if (row.contentType == '6' && row.newsStatus == 0) {
        return '下架';
      } else if (row.contentType == '6' && row.newsStatus == 1) {
        return '上架';
      } else {
        return '';
      }
    },
    handleInsertType(val) {
      this.clearVal();
      this.flag_error = false;
      this.ruleForm.type = val;
      if (this.ruleForm.type == '0' || this.ruleForm.type == '9') this.changeStyle(2);
    },
    handleCid(val) {
      this.ruleForm.cid = val + '';
    },
    handleCidTitle(item) {
      return item.setId + ':' + (item.setTitle && item.setTitle.length > 20 ? item.setTitle.slice(0, 20) + '...' : item.setTitle);
    },
    getChangeUpStatus(row) {
      //上移
      const { pageInfo } = this;
      return (
        (row.isTop == 1 && row.lastTop == 1 && row.isNumOne != 1) ||
        (row.isTop == 0 && row.lastTop == 0 && row.isSameFlag) ||
        (row.isTop == 0 && pageInfo.pageIndex != 1)
      );
    },
    getChangeDownStatus(row) {
      //下移
      const { pageInfo, tableList } = this;

      return (
        (row.isTop == 1 && (tableList[row.$totalIndex - ((pageInfo.pageIndex - 1) * pageInfo.pageSize)] && tableList[row.$totalIndex - ((pageInfo.pageIndex - 1) * pageInfo.pageSize)].isTop != 0)) ||
        (row.isTop == 0 &&
          (row.$totalIndex) != pageInfo.totalNum &&
          (tableList[(row.$totalIndex - 1) - ((pageInfo.pageIndex - 1) * pageInfo.pageSize)]))
      );
    },
    getJumpStatus(row) {
      return (
        this.channel.status == '1' &&
        row.newsStatus == 1 &&
        (row.contentType == '1' ||
          row.contentType == '2' ||
          row.contentType == '3' ||
          row.contentType == '4' ||
          row.contentType == '7' ||
          row.contentType == '8' ||
          row.contentType == '10')
      );
    },
    getContentCellTypeItem(contentType) {
      return Constant.getItemByValue(this.contentCellTypes, contentType);
    },
    getCornerBG(contentType) {
      return 'corner cornerBG' + contentType;
    },
    getContentTypeName(val) {
      const item = this.getContentCellTypeItem(val);
      return item.contentName || item.name;
    },
    getImg(row) {
      let temp = row.isBigImg == 2 ? row.contentCover.split(';http')[0] : row.contentCover;
      return temp + '?' + Math.random();
    },
    changeStyle(val) {
      this.ruleForm.style = val;
      this.imgGroupFlag = false;
      let curCover = this.ruleForm.img;
      if (val !== 2 && curCover) {
        this.ruleForm.img = curCover.split(';')[0];
      }
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    changeJumpStyle(val) {
      this.ruleForm.jumpUrl = '';
      this.ruleForm.jumpStyle = val;
    },
    clearVal() {
      //重置插入弹窗中的小组和赛事内容
      // this.sportList = this.$parent.$refs.add.$refs.tags.$refs.labels.sportList;
      this.$parent.$refs.add.$refs.tags.$refs.labels.getSportList().then(res => {
        this.sportList = res;
      });
      this.sportItemId = '';
      this.competitionId = '';
      this.competitionList = [];
      this.seasonId = '';
      this.seasonList = [];
      this.groupId = '';
      this.groupName = '';
      this.groupList = [];
      this.roundId = '';
      this.roundList = [];
      this.matchId = '';
      this.matchList = [];
      this.showNumColumn = 1;
      this.dialogSelected = [];

      this.ruleForm = {
        colType: '',
        type: '0',
        cid: '',
        id: '',
        Oid: '',
        newsName: '',
        title: '',
        img: '',
        imgList: {
          img1: '',
          img2: '',
          img3: ''
        },
        style: 0,
        jumpStyle: 1,
        comefrom: '',
        contentAttachment: '',
        jumpUrl: '',
        showLabel: '',
        listGroup: [],
        matchName: '',
        sportItemId: '', // 运动
        sportItemName: '',
        competitionId: '',// 赛事
        competitionName: '',
        seasonId: '', //赛季
        groupId: '', //小组
        roundId: '', //阶段/轮次
        matchId: '', //比赛,
        groupName: '',
        program_column_id: '',
      };
      this.dialogSelected = [];
      this.imgGroupFlag = false;
      this.flag_error = this.flag_error2 = this.flag_error_cid = false;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.$refs.insertIndexForm && this.$refs.insertIndexForm.resetFields();
      if (this.$refs.autoComplete) {
        $('.programColumnInput').val('');
        this.$refs.autoComplete.setInput('');
        this.ruleForm.program_column_id = '';
      }

      this.flag_error_id = false; //插入-id
      this.flag_error_matchId = false;
      // this.changeStyle(2);
    },
    sure(formName) {
      //插入内容---确定
      let ruleForm = this.ruleForm;
      let matchList = this.matchList;
      if (ruleForm.style == 2 && (ruleForm.imgList.img1 == '' || ruleForm.imgList.img2 == '' || ruleForm.imgList.img3 == '')) {
        this.imgGroupFlag = true;
      } else {
        this.imgGroupFlag = false;
      }

      let contentType = ruleForm.type;
      // 帖子类型信息是否为视频贴
      if (contentType == 7 && ruleForm.isVideoTopic) {
        contentType = 12;
      }

      if (contentType != 11) {
        //通用类型无需校验
        if (ruleForm.type == '15') {
          //插入比赛-校验是否选择比赛
          if (ruleForm.matchId == '') {
            this.flag_error_matchId = true;
            return
          }else{
            this.flag_error_matchId = false;
          }
        }
        else if (ruleForm.type != '14' && ruleForm.type != '15') {
          if (ruleForm.id == '') {
            //插入-校验id
            this.flag_error_id = true;
            return
          }else{
            this.flag_error_id = false;
          }
        }
      }

      this.$refs[formName].validate(valid => {
        if (valid && !this.imgGroupFlag) {
          if (ruleForm.title == '' && ruleForm.type == '11') return;
          if (ruleForm.jumpStyle == 1 && !ruleForm.jumpUrl.startsWith('pptvsports://') && ruleForm.type == '11') return;
          let params = {};
          let getImgWidthPromises = [];
          let { coverArr } = this;

          //不是专题或视频合集
          if (ruleForm.type != '6' && ruleForm.type != '5' && ruleForm.type != '13' && ruleForm.type != '14' && ruleForm.type != '15' && ruleForm.type != '16') {
            //三图模式
            if (ruleForm.style == 2) {
              coverArr.map(coverItem => {
                getImgWidthPromises.push(getImgPixelSize(coverItem, false));
              });
            }
            //大图或小图模式
            else {
              getImgWidthPromises.push(getImgPixelSize(ruleForm.img, false));
            }
          }

          Promise.all(getImgWidthPromises).then(arr => {
            let imageWidths = arr.reduce((str, item) => {
              if (str) {
                str += `,${item.width}`;
              } else {
                str = `${item.width}`;
              }
              return str;
            }, '');
            params.imageWidths = imageWidths;
            params.channelId = this.channel.infoFlowId; // 频道ID
            params.collectionId = ruleForm.cid == '请选择' ? '' : ruleForm.cid; // 内容合集ID
            params.contentAttachment = ruleForm.type == '11' ? ruleForm.jumpUrl : ''; // 频道附属信息非必填
            params.commonType = ruleForm.jumpStyle;
            params.contentCover = ruleForm.style == 2 ? this.handleImgList(ruleForm.imgList) : ruleForm.img; // 封面
            params.contentId = ruleForm.Oid == '' ? ruleForm.id : ruleForm.Oid + ',' + ruleForm.id; // 内容ID
            params.contentTitle = ruleForm.title; // 内容标题
            params.contentType = parseInt(contentType); // 内容类型
            params.isBigImg = ruleForm.style; // 展示样式（是否大图）非必填
            params.showLabel = ruleForm.showLabel;
            params.specialChannelColumn = ruleForm.colType; //所属栏目
            if (ruleForm.type == '7') {
              //帖子 附属信息单独设置
              params.contentAttachment = ruleForm.contentAttachment;
            }else{
              params.tips = ruleForm.contentAttachment; //引导
            }

            if (ruleForm.type == '13') {  //插入栏目
              params.isBigImg = '';
            }
            if (ruleForm.type == '14') {  //插入小组
              params.contentAttachment = {
                matchInfoList: this.dialogSelected,
                infoCount: this.showNumColumn + 1,
                groupInfo: {
                  sportItemId: this.ruleForm.sportItemId,
                  competitionId: this.ruleForm.competitionId,
                  seasonId: this.ruleForm.seasonId,
                  stageRoundId: this.ruleForm.roundId,
                  groupId: this.ruleForm.groupId,
                  groupName: this.groupName
                },
                labelList: [
                  {  //运动
                    labelId: this.ruleForm.sportItemId,
                    labelName: this.sportItemName,
                    labelType: 3
                  },
                  {  //赛事
                    labelId: this.ruleForm.competitionId,
                    labelName: this.competitionName,
                    labelType: 4
                  },
                  {  //赛季
                    labelId: this.ruleForm.seasonId,
                    labelName: this.seasonName,
                    labelType: 5
                  },
                  { //阶段
                    labelId: this.ruleForm.roundId,
                    labelName: this.roundName,
                    labelType: 6
                  },
                  { //小组
                    labelId: this.ruleForm.groupId,
                    labelName: this.groupName,
                    labelType: 12
                  }
                ],  //标签相关信息
                allMatchList: this.matchList
              };
              params.contentAttachment = JSON.stringify(params.contentAttachment);
              params.isBigImg = '';
              params.contentId = ruleForm.groupId;
              params.contentTitle = ruleForm.groupName;
              params.showLabel = '小组'; //小组类型设置默认标签
              //新增relationId
              params.sportItemId = ruleForm.sportItemId;
              params.competitionId = ruleForm.competitionId;
              params.seasonId = ruleForm.seasonId;
              params.stageRoundId = ruleForm.roundId;
              params.relationId = ruleForm.groupId;
            }
            if (ruleForm.type == '15') {  //插入比赛
              params.contentAttachment = {
                "infoCount": 1,
                labelList: [
                  {  //运动
                    labelId: this.ruleForm.sportItemId,
                    labelName: this.sportItemName,
                    labelType: 3
                  },
                  {  //赛事
                    labelId: this.ruleForm.competitionId,
                    labelName: this.competitionName,
                    labelType: 4
                  },
                  {  //赛季
                    labelId: this.ruleForm.seasonId,
                    labelName: this.seasonName,
                    labelType: 5
                  },
                  { //阶段
                    labelId: this.ruleForm.roundId,
                    labelName: this.roundName,
                    labelType: 6
                  },
                  { //比赛场次
                    labelId: this.ruleForm.matchId,
                    labelName: this.matchName,
                    labelType: 7
                  }
                ]  //标签相关信息
              };
              params.contentAttachment = JSON.stringify(params.contentAttachment);
              params.isBigImg = '';
              params.contentId = ruleForm.matchId;
              params.contentTitle = matchList.filter(match => {return match.matchId == ruleForm.matchId})[0].matchName;
              //新增relationId
              params.relationId = ruleForm.matchId;
            }
            if (ruleForm.type == '16') {  //插入节目
              params.isBigImg = '';
            }
            this.params = params;
            this.checkLimitWords(ruleForm.title, params);
          });
        } else {
          return false;
        }
      });
    },
    handleImgList(imgList) {
      return imgList.img1 + ';' + imgList.img2 + ';' + imgList.img3;
    },
    close() {
      this.insertFlag = false;
      this.clearVal();
      this.$nextTick(() => {
        this.$refs.typeSelect.init();
      });
    },
    addContent() {
      //插入内容弹框
      this.queryColumnList();
      this.insertFlag = true;
      if (this.ruleForm.type == '0' || this.ruleForm.type == '9') this.changeStyle(2);
    },
    goto(num) {
      this.pageInfo.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    editPit(item) {
      item.channelId = this.channel.infoFlowId;
      this.$emit('input', item);
      this.$emit('change-view', 'topicEditContent');
    },
    showDelConfirm(relation) {
      //显示删除确认框
      this.delConFlag = true;
      this.delContentObj = relation;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    delContent(content) {
      this.delConFlag = false;
      this.$ajax({
        url: DI.infoFlow.batchDelContent,
        data: JSON.stringify({
          channelContents: [content]
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            setTimeout(() => {
              this.queryList(this.pageInfo.pageIndex);
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
    exchange(flag, row) {
      // 内容上移下移
      let params = {};
      params.channelId = this.channel.infoFlowId;
      params.contentTitle = this.contentTitle;
      params.contentType = this.contentType;
      params.moveLogo = flag;
      params.newsType = this.newsType;
      params.relationId = row.relationId;
      params.isTop = row.isTop;
      params.columnId = row.columnId ? row.columnId : ''; // id不为空---栏目内;为空---栏目外
      params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.topic.updateIndex,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.queryList(this.pageInfo.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showInsertIndexConfirm(row) {
      //插入到
      this.insertIndexFlag = true;
      this.insertIndexItem = row;
    },
    hideInsertIndexConfirm() {
      this.insertIndexFlag = false;
      this.clearVal();
    },
    hideTopConfirm() {
      this.topConfirmFlag = false;
      this.topConfirmAttrs.form.positionInput = '';
    },
    beforeInsertIndexSure(formName) {
      //插入到弹框
      const { tableList, insertIndexItem, insertIndexForm, channel, pageInfo } = this;
      const { insertIndex } = insertIndexForm;
      let relContentItem = null;

      const pageNum = (pageInfo.pageIndex - 1) * pageInfo.pageSize;
      let reg = /^[0-9]+$/;
      if (!reg.test(insertIndex) || insertIndex == 0 || insertIndex > 100) return;

      this.$refs[formName].validate(valid => {
        if (valid) {
          if (insertIndex < pageNum + 1 || insertIndex > pageNum + pageInfo.pageSize) {
            this.queryRelContentItem(insertIndex - 1).then(item => {
              relContentItem = { ...item };

              this.insertIndexSure(formName, relContentItem);
            });
          } else {
            let listIndex = insertIndex % pageInfo.pageSize;
            if (listIndex == 0) {
              listIndex = pageInfo.pageSize
            }
            relContentItem = tableList[listIndex - 1];
            this.insertIndexSure(formName, relContentItem);
          }
        } else {
          return false;
        }
      });
    },
    insertIndexSure(formName, relContentItem) {
      //插入到弹框
      const { pageInfo, insertIndexItem, insertIndexForm, channel } = this;
      const { insertIndex } = insertIndexForm;

      let params = {
        channelId: channel.infoFlowId,
        removeContentId: insertIndexItem.relationId, //记录id
        // contentPosition: (pageInfo.pageIndex != 1 ? (pageInfo.pageIndex - 1) * pageInfo.pageSize : 0) + insertIndexItem.$index + 1, //当前位置
        contentPosition: (pageInfo.pageIndex != 1 ? (pageInfo.pageIndex - 1) * pageInfo.pageSize : 0) + (insertIndexItem.$index || (insertIndexItem.$totalIndex - 1)) + 1,
        contentTitle: this.contentTitle,
        contentType: this.contentType == '' ? this.contentType : parseInt(this.contentType),
        newsType: this.newsType,
        insertId: insertIndexForm.insertIndex, //被插入的位置
        columnId: relContentItem.columnId || '', //被插入内容的栏目id
        columnIndexs: insertIndexItem.columnIndexs ? insertIndexItem.columnIndexs : '', //被插入栏目的index
        indexs: insertIndexItem.indexs, //被插入位置的index
        removeColumnId: insertIndexItem.columnId ? insertIndexItem.columnId : '', //插入内容的栏目id
        targetContentId: relContentItem.relationId || ''
      };

      params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.topic.insertAppointIndex,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('插入成功');
            this.insertIndexFlag = false;
            this.clearVal();
            setTimeout(() => {
              let num = Math.ceil(parseInt(params.insertId - 1) / 20) || 1;
              this.goto(num);
              this.$bus.$emit('syncCurPage', num);
            }, 1300);
          } else {
            this.flag_error = true;
            this.errorTips = res.retMsg;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    beforeSubmitAjax() {
      let { selectedContentItem, tableList, channel, topConfirmAttrs, pageInfo, lastTopPosition } = this;
      let isTopAction = !(selectedContentItem.isTop == 1);
      let insertId = topConfirmAttrs.form.positionInput;
      let pageNum = (pageInfo.pageIndex - 1) * pageInfo.pageSize;

      if (isTopAction && insertId === '0') {
        insertId = '';
      }
      let params = {
        isTop: isTopAction,
        channelId: channel.infoFlowId,
        contentPosition: selectedContentItem.$totalIndex,
        removeContentId: selectedContentItem.relationId
      };

      if (selectedContentItem.columnId) {
        // 栏目外---弹框置顶
        this.submitAjax(params);
      } else {
        params.insertId = insertId;
        let toPositionPrevItem;
        if (!isTopAction && lastTopPosition === pageInfo.totalNum) {
          toPositionPrevItem = tableList[pageInfo.totalNum - 2];
        }
        insertId = insertId || 1;
        if (insertId < pageNum + 1 || insertId > pageNum + pageInfo.pageSize) {
          this.queryRelContentItem(insertId - 1).then(item => {
            toPositionPrevItem = item;
            params.targetContentId = toPositionPrevItem.relationId || '';
            params.removeColumnId = selectedContentItem.columnId || '';
            params.columnId = toPositionPrevItem.columnId || '';
            this.submitAjax(params);
          });
        } else {
          toPositionPrevItem = tableList[insertId - 1];
          params.targetContentId = toPositionPrevItem.relationId || '';
          params.removeColumnId = selectedContentItem.columnId || '';
          params.columnId = toPositionPrevItem.columnId || '';
          this.submitAjax(params);
        }
      }
    },
    queryRelContentItem(selectedIndex) {
      const { pageSize } = this.pageInfo;
      let pageNum = pageSize * Math.floor(selectedIndex / pageSize);
      let params = {
        channelId: this.channel.infoFlowId,
        pageNum,
        pageSize
      };
      return new Promise((resolve, reject) => {
        this.$ajax({
          url: DI.topic.queryContentList,
          data: JSON.stringify(params),
          context: this,
          success: res => {
            let data = res.data || {};
            if (res.retCode == '0') {
              let list = data.list || [];
              resolve(list[selectedIndex - pageNum]);
            } else {
              reject('failed');
            }
          },
          error: () => {
            reject('error');
          }
        });
      });
    },
    submitAjax(params) {
      // 置顶或取消置顶
      let { selectedContentItem, topConfirmAttrs, pageInfo } = this;
      let isTopAction = !(selectedContentItem.isTop == 1);
      let insertId = topConfirmAttrs.form.positionInput;
      this.$ajax({
        url: DI.topic.changeTop,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('操作成功');
            this.hideTopConfirm();
            setTimeout(() => {
              let jumpPageIndex = 1;
              if (!isTopAction && insertId) {
                jumpPageIndex = Math.ceil((insertId - 1) / pageInfo.pageSize);
              }
              this.queryList(jumpPageIndex);
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
    changeTop() {
      //是否置顶接口
      this.$refs.topConfirmForm.validate(valid => {
        if (valid) {
          this.beforeSubmitAjax();
        }
      });
    },
    handleContentType(val) {
      this.contentType = val;
      this.newsType = '';
      let $disabled = false;
      if (val == '0') {
        $disabled = false;
      } else {
        $disabled = true;
      }
      for (let i = 0; i < this.newsTypeList.length; i++) {
        this.newsTypeList[i].disabled = $disabled;
      }
      this.queryList(this.pageInfo.pageIndex);
    },
    handleNewsType(val) {
      this.newsType = val;
      this.queryList(this.pageInfo.pageIndex);
    },
    reset() {
      this.contentType = this.newsType = this.contentTitle = this.contentId = '';
      // this.queryList(1);
    },
    changeID(type, id) {
      let ruleForm = this.ruleForm;
      if (id == '') return;
      let url,
        params = {};
      if (type == '7') {
        //帖子ID
        if (ruleForm.id == '' || ruleForm.Oid == '') {
          return false;
        }
        url = DI.channel.getTopicInfo;
        params.topicId = ruleForm.Oid + ',' + ruleForm.id;
      } else if (type == '4' || type == '5') {
        //视频 || 视频合集
        url = DI.channel.queryVideoDetail + '?videoId=' + id;
        // params.videoId = id;
      } else if (type == '0' || type == '9') {
        //资讯
        url = DI.channel.getNewsInfo;
        params.newsId = parseInt(id);
      } else if (type == '6') {
        //专题
        url = DI.channel.querySpecialById;
        params.channelId = parseInt(id);
      } else if (type == '13') {
        //栏目
      } else if (type == '16') {
        //节目
      }
      this.$ajax({
        url: url,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          let result = res.data || {};
          if (res.retCode == '0') {
            if (type == '0' || type == '9') {
              if (result && result.title) {
                this.flag_error = false;
                ruleForm.title = result.title;
                const newsTypeItem = Constant.getItemByValue(this.newsTypeList, result.newsType);
                ruleForm.newsName = newsTypeItem.name;
                this.$refs.img && (this.$refs.img.validateMessage = '');
                ruleForm.listGroup = result.imgList || [];

                this.setCoverRelData(result);

                if (result.newsType == 1) {
                  // 图文资讯 默认小图
                  this.changeStyle(0).then(() => {
                    this.setCoverRelData(result);
                  });
                }
                if (result.newsType == 2) {
                  // 图集资讯 默认大图
                  this.changeStyle(1).then(() => {
                    this.setCoverRelData(result);
                  });
                }
                if (result.newsType == 3 || result.newsType == 10) {
                  // 视频资讯 PGC视频
                  let val = ruleForm.style == 2 ? 0 : ruleForm.style;
                  this.changeStyle(val).then(() => {
                    this.setCoverRelData(result);
                  });
                }
              } else {
                this.flag_error = true;
                ruleForm.title = ruleForm.img = ruleForm.newsName = '';
              }
            } else if (type == '4' || type == '5') {
              if ((type == '4' && result.vt == '22') || (type == '5' && result.vt == '3')) {
                this.flag_error = true;
                return;
              }
              if (result && result.title) {
                this.flag_error = false;
                this.getContentList(id);
                ruleForm.title = result.title;
                ruleForm.img = type == '4' ? this.handelCover(result.sloturl) : result.sloturl;
              } else {
                this.flag_error = true;
                ruleForm.title = ruleForm.img = '';
              }
            } else if (type == '6') {
              if (result && result.channelName) {
                this.flag_error = false;
                ruleForm.title = result.channelName;
              } else {
                this.flag_error = true;
                ruleForm.title = '';
              }
            } else if (type == '7') {
              ruleForm.isVideoTopic = result.isVideoTopic;
              if (result && result.title) {
                this.flag_error = false;
                this.flag_error2 = false;
                ruleForm.title = result.title;
                ruleForm.img = result.contentCover;
                ruleForm.comefrom = result.clubName;
                ruleForm.contentAttachment = result.contentAttachment;
              } else {
                this.flag_error = true;
                this.flag_error2 = true;
                ruleForm.title = ruleForm.img = ruleForm.comefrom = '';
              }
            }
          } else {
            this.flag_error = true;
            this.flag_error2 = type == '7' ? true : false;
            ruleForm.cid = ruleForm.newsName = ruleForm.title = ruleForm.img = ruleForm.comefrom = '';
            this.curNewsId = '';
          }
        },
        error: () => {}
      });
    },
    handelCover(url) {
      if (url.indexOf('cp120') != -1) {
        return (url = url.replace('cp120/', ''));
      } else {
        return url;
      }
    },
    setCoverRelData(result) {
      let tempList = result.imgList || [];
      this.ruleForm.img = result.cover.split(';')[0];
      this.ruleForm.imgList = {
        img1: tempList[0] || '',
        img2: tempList[1] || '',
        img3: tempList[2] || ''
      };
    },
    showPreview(row) {
      if (row.newsStatus != 1) {
        this.$message.warning(`该资讯不支持预览！`);
        return;
      }
      let infoTypeItem = this.getItemArticle(row.contentType);

      const url = getInfoPreviewUrl({
        type: infoTypeItem.key,
        newsId: row.contentId,
        videoId: row.contentId
      });

      this.$bus.openPreview(url);
    },
    getItemArticle(val) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, val);
    },
    getContentList(id) {
      $.ajax({
        url: `${VIDEOSET_URL}/bppchannel.api?id=${parseInt(id)}&showset=1&format=jsonp`,
        dataFilter: function(data) {
          return data;
        },
        dataType: 'jsonp',
        type: 'GET',
        context: this,
        success: res => {
          if (res.channels.length == 0) return;
          this.contentList = res.channels[0].setRelates;
          if (this.contentList.length) {
            this.flag_error_cid = true;
          } else {
            this.flag_error_cid = false;
          }
        },
        error: () => {}
      });
    },
    checkLimitWords(param, params) {
      let _this = this;
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: param,
          name: ''
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            if (_this.ruleForm.showLabel && _this.isChannelDes) {
              _this.isChannelDes = false;
              _this.checkLimitWords(_this.ruleForm.showLabel, params);
            } else {
              this.saveAjax(params);
            }
          } else {
            let sensitiveMsg = reg.exec(res.retMsg)[0];
            this.sensitiveMsgList = JSON.parse(sensitiveMsg);
            this.checkWordConfirm = true;
            this.isChannelDes = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    saveAjax(params) {
      this.$ajax({
        url: DI.topic.addContent,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('插入成功');
            this.$nextTick(() => {
              this.$refs.typeSelect.init();
            });
            this.insertFlag = false;
            this.clearVal();
            setTimeout(() => {
              this.queryList(this.pageInfo.pageIndex);
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
    closeCheck() {
      this.checkWordConfirm = false;
    },
    sureCheck() {
      this.saveAjax(this.params);
      this.checkWordConfirm = false;
    },


    showBatchDelConfirm() {
      if (!this.contentListSelected.length) {
        this.$message.error('请选择删除内容');
      }else{
        //显示删除确认框
        this.batchDelConFlag = true;
      }
    },
    /**
     * 批量删除内容
     */
    batchDel() {
      this.batchDelConFlag = false;
      this.$ajax({
        url: DI.infoFlow.batchDelContent,
        data: JSON.stringify({
          channelContents: this.contentListSelected
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.$message.success('删除成功！');
            setTimeout(() => {
              this.queryList(this.pageInfo.pageIndex);
            }, 1300);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    hideBatchDelConfirm() {
      this.batchDelConFlag = false;
    },
    /**内容列表全选**/
    handleCheckAllChange(event) {
      if (event.target.checked) {
        this.contentListSelected = this.tableList;
      } else {
        this.contentListSelected = [];
      }
    },

    /**
     * 根据选择的ruleForm.Type 返回对应的中文名称
     * @param type
     * @returns {string}
     */
    getRuleFormTypeName(type) {
      return Constant.getItemByValue(this.contentTypeList, type).name || '';
    },

    /**运动下拉相关**/
    selectSport(sportItemId) {
      this.sportItemId = this.ruleForm.sportItemId = sportItemId;
      this.competitionId = this.ruleForm.competitionId = '';
      this.competitionList = [];
      this.seasonId = this.ruleForm.seasonId = '';
      this.seasonList = [];
      this.roundId = this.ruleForm.roundId = '';
      this.roundList = [];
      this.groupId = this.ruleForm.groupId =  this.ruleForm.groupName = '';
      this.groupList = [];
      this.matchId = this.ruleForm.matchId = '';
      this.matchList = [];
      if (sportItemId) {
        this.sportItemName = this.getName(sportItemId, 'sportItemId', 'sportItemName', this.sportList);
        this.getCompetitionList();
      }
    },
    selectCompetition(competitionId) {  //赛事
      this.competitionId = this.ruleForm.competitionId = competitionId;
      this.competitionName = this.getName(competitionId, 'competitionId', 'competitionName', this.competitionList);
      this.seasonId = this.ruleForm.seasonId = '';
      this.seasonList = [];
      this.roundId = this.ruleForm.roundId = '';
      this.roundList = [];
      this.groupId = this.ruleForm.groupId = this.ruleForm.groupName = '';
      this.groupList = [];
      this.matchId = this.ruleForm.matchId = '';
      this.matchList = [];
      if (competitionId) {
        this.competitionName = this.$parent.$refs.add.$refs.tags.$refs.labels.getName(competitionId, 'competitionId', 'competitionName', this.competitionList);
      }
      if (competitionId && (this.ruleForm.type == 14 || this.ruleForm.type == 15)) {
        this.getSeasonList();
      }
    },
    selectSeason(seasonId) {  //赛季
      this.seasonId = this.ruleForm.seasonId = seasonId;
      this.seasonName = this.getName(seasonId, 'seasonId', 'seasonName', this.seasonList);
      this.roundId = this.ruleForm.roundId = '';
      this.roundList = [];
      this.groupId = this.ruleForm.groupId = this.ruleForm.groupName = '';
      this.groupList = [];
      this.matchId = this.ruleForm.matchId = '';
      this.matchList = [];
      if (seasonId && (this.ruleForm.type == 14 || this.ruleForm.type == 15)) {
        this.getRoundList();
      }
    },
    selectRound(roundId) { // 阶段/轮次
      this.roundId = this.ruleForm.roundId = roundId;
      this.roundName = this.getName(roundId, 'stageRoundId', 'stageRoundName', this.roundList);
      this.groupId = this.ruleForm.groupId = this.ruleForm.groupName = '';
      this.groupList = [];
      this.matchId = this.ruleForm.matchId = '';
      this.matchList = [];
      if (roundId && this.ruleForm.type == 14) {
        this.getGroupList();
      } else if (roundId && this.ruleForm.type == 15) {
        this.getMatchList();
      }
    },
    selectGroup(groupId) { // 小组
      this.groupId = this.ruleForm.groupId = groupId;
      this.ruleForm.groupName = '';
      if (groupId) {
        this.groupName = this.getName(groupId, 'groupId', 'groupName', this.groupList);
        this.ruleForm.groupName = this.competitionName + ' - ' + this.groupName;

        this.matchList = [];
        this.getGroupMatchList();
      }
    },
    selectMatch(matchId) {  //比赛场次
      this.matchId = this.ruleForm.matchId = matchId;
      this.matchName = this.getName(matchId, 'matchId', 'matchName', this.matchList);
    },
    getCompetitionList() {
      this.duringAjaxCompetition = true;
      this.$ajax({
        url: DI.infoLibrary.getGameList,
        type: 'get',
        data: {
          sportItemId: this.sportItemId
        },
        context: this,
        success: (res) => {
          this.duringAjaxCompetition = false;
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
      this.duringAjaxSeason = true;
      this.$ajax({
        url: DI.infoLibrary.getSeasonList,
        type: 'get',
        data: {
          sportItemId: this.sportItemId,
          competitionId: this.competitionId
        },
        context: this,
        success: (res) => {
          this.duringAjaxSeason = false;
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
    getRoundList() {
      this.duringAjaxRound = true;
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
          this.duringAjaxRound = false;
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
    getGroupList() {
      this.duringAjaxGroup = true;
      this.$ajax({
        url: DI.infoFlow.getGroupInfo,// 小组
        type: 'get',
        data: {
          // sportItemId: this.sportItemId,
          // competitionId: this.competitionId,
          // seasonId: this.seasonId,
          //
          stageId: this.roundId
        },
        context: this,
        success: (res) => {
          this.duringAjaxGroup = false;
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
    getMatchList() {
      this.duringAjaxMatch = true;
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
          this.duringAjaxMatch = false;
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
    //查询小组下的比赛
    getGroupMatchList() {
      this.duringAjaxMatch = true;
      this.$ajax({
        url: DI.infoFlow.getGroupMatchInfo,// 小组
        type: 'get',
        data: {
          sportItemId: this.sportItemId,
          competitionId: this.competitionId,
          seasonId: this.seasonId,
          groupId: this.groupId
        },
        context: this,
        success: (res) => {
          this.duringAjaxMatch = false;
          if (res.retCode == "0") {
            const data = res.data;
           if (data != undefined) {
               this.matchList = data.list || [];
            }else{
              this.matchList = [];
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },


    /**插入弹窗-比赛 搜索输入框相关**/
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
    selectItem(item) {
      this.sportItemId = this.ruleForm.sportItemId = parseInt(item.sportItemId);
      this.competitionId = this.ruleForm.competitionId = parseInt(item.competitionId);
      this.getCompetitionList();
      this.seasonId = this.ruleForm.seasonId = parseInt(item.seasonId);
      this.getSeasonList();
      this.roundId = this.ruleForm.roundId = item.stageRoundId;
      this.getRoundList();
      this.matchId = this.ruleForm.matchId = parseInt(item.matchId);
      this.getMatchList();
    },
    quickAddToContainer(item) {
      let { labelsContainer } = this;
      if (item) {
        if (item.sportItemId) {
          labelsContainer.SportsTypeTag = {
            sportItemId: item.sportItemId,
            sportItemName: item.sportItemName
          };
        }
        if (item.competitionId) {
          labelsContainer.MatchTypeTag = {
            competitionId: item.competitionId,
            competitionName: item.competitionName
          };
        }
        if (item.seasonId) {
          labelsContainer.MatchSeasonTag = {
            seasonId: item.seasonId,
            seasonName: item.seasonName
          };
        }
        if (item.stageRoundId) {
          labelsContainer.MatchRoundTag = {
            stageRoundId: item.stageRoundId,
            stageRoundName: item.stageRoundName
          };
        }
        if (item.matchId) {
          labelsContainer.MatchScheduleTag = {
            matchId: item.matchId,
            matchName: item.matchName,
            matchDateTime: item.matchDateTime,
            guestTeamId: item.guestTeamId,
            guestTeamLogo: item.guestTeamLogo,
            guestTeamName: item.guestTeamName,
            homeTeamId: item.homeTeamId,
            homeTeamLogo: item.homeTeamLogo,
            homeTeamName: item.homeTeamName
          };
        }
      }
      this.labelsContainer = { ...labelsContainer };
      this.$nextTick().then(() => {
        // this.addLabels(true);
      });
    },


    /**插入弹窗-小组 表格相关**/
    /**
     * 表格checkBox校验
     */
    checkListDisabled(row) {
      if (this.dialogSelected.length < 2) {
        return false
      }else{
        let tempArray = this.dialogSelected.filter(item => {return item.matchId == row.matchId});
        if (tempArray.length) {
          return false
        }else{
          return true
        }
      }
    },


    /**插入弹窗-节目/栏目 搜索输入框相关**/
    queryProgramAndColumnAsync(options, cb) {
      //屏蔽分页
      if (options.pageIndex != 1) {
        cb([]);
        return
      }
      //无搜索值时不进行查询
      if (!options.queryString) {
        return
      }
      let params = {};
      //栏目
      if (this.ruleForm.type == '13') {
        params.subjectType = 1;
        //判断id查询或者名称模糊查询
        if (options.queryString == parseInt(options.queryString)) {
          params.subjectId = options.queryString;
        }else{
          params.subjectName = options.queryString;
        }
        this.$ajax({
          url: DI.infoFlow.queryColumnSubject,
          context: this,
          loadingText: 'false',
          data: JSON.stringify(params),
          success: res => {
            const list = res.data || [];
            cb(list);
          },
          error: () => {
            console.log('error');
          }
        });
      }
      //节目
      else{
        //判断id查询或者名称模糊查询
        if (options.queryString == parseInt(options.queryString)) {
          params.programId = options.queryString;
        }else{
          params.programName = options.queryString;
        }
        params.status = 1;
        this.$ajax({
          url: DI.programMana.queryProgramList,
          context: this,
          loadingText: 'false',
          data: JSON.stringify(params),
          success: res => {
            const list = (res.data || {}).programList || [];
            cb(list);
          },
          error: () => {
            console.log('error');
          }
        });
      }
    },
    resetFun() {
      this.ruleForm.id = '';
      $('.programColumnInput').val('');
    },
    selectProgramAndColumn(item) {
      //栏目
      if (this.ruleForm.type == '13') {
        this.$refs.autoComplete.setInput(item.subjectId);
        this.ruleForm.program_column_id = item.subjectId;
        this.ruleForm.id = item.subjectId.toString();
        $('.programColumnInput').val(item.subjectId.toString());
        this.ruleForm.title = item.subjectName;
      }
      //节目
      else {
        this.$refs.autoComplete.setInput(item.programId);
        this.ruleForm.program_column_id = item.programId;
        this.ruleForm.id = item.programId.toString();
        $('.programColumnInput').val(item.programId.toString());
        this.ruleForm.title = item.name;
      }
    },
    getName(ID, id, name, list) {
      if (!ID || !id || !name || !list) return '';
      let arr = list.filter(item => {
        return item[id] == ID;
      });
      return arr[0][name];
    },
    goback() {
      this.$parent.viewType = 'list';
      this.$parent.themeIndex = parseInt(this.channel.subjectType) - 1;
      this.$parent.subjectType = parseInt(this.channel.subjectType);
    }
  }
};
</script>

<style scoped>
  .container {
  .goback {
    font-size: 20px;
    color: #000;
    position: absolute;
    top: 23px;
    left: 20px;
  }
  .title {
    padding-left: 32px;
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
  .search-box-topic {
    width: 500px;
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
    margin-top: 20px;
    margin-right: 20px;
    float: left;
  }
  .select-box {
    display: flex;
    height: 30px;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 20px;
    color: #999;
    float: left;
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
  .btn-query {
    text-align: right;
  }
  .btn-query-second {
    margin-top: 12px;
  }
  .btn-query-third {
    margin-top: 12px;
    text-align: right;
  }
  .btn-reset {
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000000;
    margin-left: 20px;
  }
  .btf-batchDel {
    margin-right: 20px;
  }
  }
  }
  .ibox-empty {
    margin-bottom: 10px;
  }
  .indexTop {
    padding: 5px 18px;
    border-radius: 15px;
    color: #fff;
    background: #ffa488;
  }
  a {
    color: #1684c2;
    margin-bottom: 5px;
  & + a {
      margin-left: 0;
    }
  &:hover {
     text-decoration: underline;
   }
  }
  p {
    margin-bottom: 5px;
  }
  .adv-info {
    display: flex;
    align-items: center;
    height: 100%;
  .img-wrap {
    position: relative;
    height: 100%;
  .id-info {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0;
    width: 100%;
    height: auto;
    line-height: 22px;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    word-wrap: break-word;
    text-align: center;
  }
  .adv-img {
    display: inline-block;
    width: 120px;
    height: 80px;
  }
  .corner {
    position: absolute;
    padding: 5px;
    color: #fff;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .cornerBG1 {
    background: #09bbfe;
  }
  .cornerBG2 {
    background: #8074c8;
  }
  .cornerBG3 {
    background: #cd0000;
  }
  .cornerBG4 {
    background: #ee82ee;
  }
  .cornerBG5 {
    background: #d02090;
  }
  .cornerBG6 {
    background: #cd6600;
  }
  .cornerBG7 {
    background: #5d478b;
  }
  .cornerBG8 {
    background: #a9d86e;
  }
  .cornerBG10 {
    background: #f86f6f;
  }
  .cornerBG11 {
    background: #4169e1;
  }
  .cornerBG12 {
    background: #551a8b;
  }
  }
  .adv-title {
    padding-left: 8px;
    line-height: 1.3;
  }
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
  .insertText {
    float: right;
    margin-top: -22px;
    margin-right: 10px;
  }
  }
  .modal__body--top {
    display: flex;
    align-items: center;
    justify-content: center;
  .modal__form--top {
    margin-top: 10px;
    margin-left: -29px;
  }
  .modal-input__append--top {
    float: right;
    margin-top: -22px;
    margin-right: -7px;
    color: #999;
  }
  }
  .modal-body {
    width: 480px;
  .words {
    height: 128px;
    overflow: auto;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #f4f6fb;
  .title {
    color: #6e7690;
    font-weight: bold;
  }
  .word {
    display: inline-block;
    padding-right: 15px;
    padding-bottom: 15px;
    color: #f47b77;
  }
  }
  }
  .marginRight {
    margin-right: 5px;
  }
</style>
