<template>
  <div class="container">
    <sn-topbar title="内容管理">
      <span slot="subtitle">{{channel.isFrom=='topic'?'专题':'频道'}}名称: {{channel.channelName}},{{channel.isFrom=='topic'?'专题':'频道'}}ID: {{channel.channelId}}</span>
      <span slot="link">
        <a href="javascript:;" @click="handleColumn">栏目管理</a>
      </span>
    </sn-topbar>
    <div>
      <section class="ibox between">
        <div class="search-box-topic">
          <div class="input-box">
            <sn-input
              width="178"
              radius="16"
              :maxlength="30"
              placeholder="请输入内容标题"
              v-model="contentTitle"
            ></sn-input>
          </div>
          <div class="input-box">
            <sn-input width="178" radius="16" placeholder="请输入内容ID" v-model="contentId"></sn-input>
          </div>
          <br/>
          <div class="select-box">
            <span class="text">内容类型</span>
            <sn-select
              v-model="contentType"
              placeholder="全部"
              radius="16"
              width="120"
              @change="handleContentType"
            >
              <sn-option name="全部" value=""></sn-option>
              <sn-option
                v-for="item in contentTypeList"
                :key="item.id"
                :name="item.name"
                :value="item.id"
                :disabled="item.disabled"
              >
              </sn-option>
            </sn-select>
          </div>
          <div class="select-box" v-if="contentType == '0'">
            <span class="text">资讯类型</span>
            <sn-select
              v-model="newsType"
              placeholder="全部"
              radius="16"
              width="120"
              @change="handleNewsType"
            >
              <sn-option name="全部" value=""></sn-option>
              <sn-option
                v-for="item in newsTypeList"
                :key="item.key"
                :name="item.name"
                :value="item.value"
                :disabled="item.disabled"
              ></sn-option>
            </sn-select>
          </div>
        </div>
        <div class="btns">
          <p class="btn-query">
            <sn-button type="primary" @click="queryList(1)">查询</sn-button>
          </p>
          <p>
            <sn-button class="btn-reset" type="outline" @click="reset">重置</sn-button>
            <sn-button type="outline" @click="addContent">插入</sn-button>
          </p>
        </div>
      </section>
      <div>
        <div class="ibox-empty"></div>
        <sn-table :data='tableList' ref='table'>
          <sn-table-column label='序号' width='8%' sloted>
            <template slot-scope='row'>
              <span class="indexTop" v-if="row.isTop == 1">{{row.$totalIndex+' 置顶'}}</span>
              <span v-else>{{row.$totalIndex}}</span>
            </template>
          </sn-table-column>
          <sn-table-column label='内容基本信息' align="left" width='30%' prop='info' sloted>
            <template slot-scope="row">
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
          </sn-table-column>
          <sn-table-column label='内容类型' prop='contentType' width='10%' sloted>
            <template slot-scope="row">
              {{getContentTypeName(row.contentType)}}
            </template>
          </sn-table-column>
          <sn-table-column label='展示样式' prop='isBigImg' width='6%' sloted>
            <template slot-scope="row">
              {{getStyle(row)}}
            </template>
          </sn-table-column>
          <sn-table-column label='展示标签' prop='showLabel' width='6%'></sn-table-column>
          <sn-table-column label="所属栏目" prop="columnName" width="16%" sloted>
            <template slot-scope="row">
              <div>
                <p>{{ row.columnName }}</p>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label='状态' prop='newsStatus' width='8%' sloted>
            <template slot-scope="row">
              {{getNewsStatus(row)}}
            </template>
          </sn-table-column>
          <sn-table-column label='操作' width='25%' sloted>
            <template slot-scope='row'>
              <div class="is-column">
                <p>
                  <a href="javascript:;" @click="showDelConfirm(row.relationId)">删除</a>
                  <a href="javascript:;" @click="editPit(row)">编辑</a>
                </p>
                <p>
                  <a v-if="getChangeUpStatus(row)" href="javascript:;" @click="exchange(1,row)">上移</a>
                  <a v-if="getChangeDownStatus(row)" href="javascript:;" @click="exchange(2,row)">下移</a>
                </p>
                <a v-if="insertBtnFlag && row.isTop == 0" href="javascript:;" @click="showTopConfirm(row)">置顶</a>
                <a v-if="insertBtnFlag && row.isTop == 1" href="javascript:;" @click="showTopConfirm(row)">取消置顶</a>
                <a href="javascript:;" v-if="!row.columnName" @click="addToColumn(row)">添加到栏目</a>
                <a href="javascript:;" v-else @click="removeColumn(row)">撤销栏目</a>
                <a v-if="insertBtnFlag" href="javascript:;" @click="showInsertIndexConfirm(row)">插入到</a>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
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
      @sure="delContent(delContentId)"
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
        <div v-if="ruleForm.type == '0' || ruleForm.type == '9'">
          <sn-form-item label="内容ID" prop="id">
            <sn-input
              width="100%"
              placeholder="请输入资讯ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="资讯类型" prop="newsName">
            <sn-input width="100%" v-model="ruleForm.newsName" :disabled="true"></sn-input>
          </sn-form-item>
          <sn-form-item label="资讯标题" prop="title">
            <sn-input
              width="100%"
              v-model="ruleForm.title"
              placeholder="请输入资讯标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
            ></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" prop="colType">
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
          <sn-form-item label="封面样式" prop="style" class="coverStyle">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio v-if="ruleForm.newsName!='图集'" :label="0">小图</sn-radio>
              <sn-radio v-if="ruleForm.newsName!='图集'" :label="1">大图</sn-radio>
              <sn-radio v-if="ruleForm.newsName!='视频' && ruleForm.newsName!='PGC视频'" :label="2">三图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.style!==2" label="资讯封面" prop="img" ref="img">
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
          <sn-form-item v-show="ruleForm.style==2" label="资讯封面" prop="imgList" ref="imgList">
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
        </div>
        <div>
          <sn-form-item label="视频ID" v-if="ruleForm.type == '4'" prop="id">
            <sn-input
              width="100%"
              placeholder="请输入视频ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
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
          <sn-form-item label="视频标题" v-if="ruleForm.type == '4'" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入视频标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" v-if="ruleForm.type == '4'" prop="colType">
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
          <sn-form-item label="视频样式" v-if="ruleForm.type == '4'" prop="style">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio :label="0">小图</sn-radio>
              <sn-radio :label="1">大图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item label="视频封面" v-if="ruleForm.type == '4'" prop="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
            ></sn-cropper>
          </sn-form-item>
        </div>
        <div v-if="ruleForm.type == '5'">
          <sn-form-item label="合集ID" prop="id">
            <sn-input
              width="100%"
              placeholder="请输入合集ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="合集标题" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入合集标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" prop="colType">
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
        </div>
        <div v-if="ruleForm.type == '6'">
          <sn-form-item label="专题ID" prop="id">
            <sn-input
              width="100%"
              placeholder="请输入专题ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="专题标题" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入专题标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" prop="colType">
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
          <sn-form-item label="引导语" prop="contentAttachment" :rules="guideLanguageRules">
            <sn-input
              width="100%"
              placeholder="请输入引导语"
              :maxlength="25"
              :totalWords="25"
              :showWord="true"
              v-model="ruleForm.contentAttachment"
            ></sn-input>
          </sn-form-item>
        </div>
        <div>
          <sn-form-item label="圈子ID" v-if="ruleForm.type == '7'" prop="Oid">
            <sn-input
              width="100%"
              placeholder="请输入圈子ID"
              v-model="ruleForm.Oid"
              @blur="changeID(ruleForm.type, ruleForm.Oid)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error2 && ruleForm.Oid != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="帖子ID" v-if="ruleForm.type == '7'" prop="id">
            <sn-input
              width="100%"
              placeholder="请输入帖子ID"
              v-model="ruleForm.id"
              @blur="changeID(ruleForm.type, ruleForm.id)"
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <sn-form-item label="帖子标题" v-if="ruleForm.type == '7'" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入帖子标题"
              :maxlength="30"
              :totalWords="30"
              :showWord="true"
              v-model="ruleForm.title"
            ></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" v-if="ruleForm.type == '7'" prop="colType">
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
          <sn-form-item label="来自圈子" v-if="ruleForm.type == '7'" prop="comefrom">
            <sn-input width="100%" v-model="ruleForm.comefrom" :disabled="true"></sn-input>
          </sn-form-item>
          <sn-form-item label="帖子封面" v-if="ruleForm.type == '7'" prop="img">
            <sn-cropper
              v-model="ruleForm.img"
              height="131"
              :width="aspectRatioWidth"
              :aspectRatio="aspectRatio"
              ref="cropper"
              label="封面"
            ></sn-cropper>
          </sn-form-item>
        </div>
        <!-- 通用类型 -->
        <template v-if="ruleForm.type == '11'">
          <sn-form-item label="展示文字" prop="title">
            <sn-input
              width="100%"
              placeholder="请输入链接展示文字，5-30个字"
              :maxlength="30"
              :totalWords="30"
              v-model="ruleForm.title"
              :showWord="true"
            ></sn-input>
          </sn-form-item>
          <sn-form-item label="所属栏目" prop="colType">
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
          <sn-form-item label="展示标签">
            <sn-input width="100%" v-model="ruleForm.showLabel" :maxlength="2"></sn-input>
          </sn-form-item>
          <sn-form-item label="封面样式" prop="style" class="coverStyle">
            <sn-radio-group v-model="ruleForm.style" @change="changeStyle">
              <sn-radio :label="0">小图</sn-radio>
              <sn-radio :label="1">大图</sn-radio>
              <sn-radio :label="2">三图</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item v-if="ruleForm.style!==2" label="资讯封面" prop="img" ref="img">
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
          <sn-form-item v-show="ruleForm.style==2" label="资讯封面" prop="imgList" ref="imgList">
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
        </template>
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
        listGroup: []
      },
      insertFlag: false,
      delConFlag: false, //删除弹框显示开关
      delContentId: '', //删除内容Id
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
      params: {}
    };
  },
  created() {
    $('body').css('overflow', 'visible');
  },
  watch: {
    insertFlag(val) {
      $('body, html').css('overflow', val ? 'hidden' : 'visible');
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
      let ruleForm = this.ruleForm;
      if (ruleForm.type == '6') {
        return [
          {
            required: true,
            message: '请输入引导语',
            trigger: 'change'
          },
          {
            min: 5,
            max: 25,
            message: '长度在 5 到 25 个字符',
            trigger: 'blur'
          }
        ];
      }
    },
    rules() {
      let singleCoverValidator = (rule, value, callback) => {
        if (this.ruleForm.type == '5' || this.ruleForm.type == '7' || this.isGifUrl(value) || this.ruleForm.style == 2 || this.ruleForm.style == 0) {
          callback();
        } else {
          getImgPixelSize(value, true, { max: null, min: 500 })
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
        id: [
          {
            required: true,
            message: '请输入ID',
            trigger: 'change'
          }
        ],
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
        ]
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
    }
  },
  mounted() {
    if (this.channel.isFrom == 'topic' && Constant.getItemByValue(Constant.CONTENT_LIST_TYPES, 9).id == '9') {
      this.contentTypeList.splice(5, 1); // 专题暂时隐藏pp号
    }
    this.changeStyle(2);
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
        channelId: this.channel.channelId,
        pageNum: (pageIndex - 1) * this.pageInfo.pageSize,
        pageSize: this.pageInfo.pageSize, // 20
        contentTitle: this.contentTitle,
        contentId: this.contentId || '',
        contentType: parseInt(this.contentType) || '',
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
          channelId: this.channel.channelId
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
            channelId: this.channel.channelId, //频道id
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
                jumpPage = Math.ceil((this.curItem.$index + 1) / this.pageInfo.pageSize);
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
          channelId: this.channel.channelId,
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
      if (row.contentType == '5' || row.contentType == '6' || row.contentType == '7') {
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
      this.ruleForm = {
        colType: '',
        type: val,
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
        listGroup: []
      };
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
        (row.isTop == 1 && (tableList[row.$index + 1] && tableList[row.$index + 1].isTop != 0)) ||
        (row.isTop == 0 &&
          (pageInfo.pageIndex != 1 ? (pageInfo.pageIndex - 1) * pageInfo.pageSize : 0) + row.$index + 1 != pageInfo.totalNum &&
          (tableList[row.$index] && tableList[row.$index + 1] && tableList[row.$index + 1].columnId == tableList[row.$index].columnId))
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
        listGroup: []
      };
      this.imgGroupFlag = false;
      this.flag_error = this.flag_error2 = this.flag_error_cid = false;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.$refs.insertIndexForm && this.$refs.insertIndexForm.resetFields();

      this.changeStyle(2);
    },
    sure(formName) {
      //插入内容---确定
      let ruleForm = this.ruleForm;
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
      this.$refs[formName].validate(valid => {
        if (valid && !this.imgGroupFlag) {
          if (ruleForm.title == '' && ruleForm.type == '11') return;
          if (ruleForm.jumpStyle == 1 && !ruleForm.jumpUrl.startsWith('pptvsports://') && ruleForm.type == '11') return;
          let params = {};
          let getImgWidthPromises = [];
          let { coverArr } = this;

          //不是专题或视频合集
          if (ruleForm.type != '6' && ruleForm.type != '5') {
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
                str += `;${item.width}`;
              } else {
                str = `${item.width}`;
              }
              return str;
            }, '');
            params.imageWidths = imageWidths;
            params.channelId = this.channel.channelId; // 频道ID
            params.collectionId = ruleForm.cid == '请选择' ? '' : ruleForm.cid; // 内容合集ID
            params.contentAttachment = ruleForm.type == '11' ? ruleForm.jumpUrl : ruleForm.contentAttachment; // 频道附属信息非必填
            params.commonType = ruleForm.jumpStyle;
            params.contentCover = ruleForm.style == 2 ? this.handleImgList(ruleForm.imgList) : ruleForm.img; // 封面
            params.contentId = ruleForm.Oid == '' ? ruleForm.id : ruleForm.Oid + ',' + ruleForm.id; // 内容ID
            params.contentTitle = ruleForm.title; // 内容标题
            params.contentType = parseInt(contentType); // 内容类型
            params.isBigImg = ruleForm.style; // 展示样式（是否大图）非必填
            params.showLabel = ruleForm.showLabel;
            params.specialChannelColumn = ruleForm.colType; //所属栏目
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
    },
    goto(num) {
      this.pageInfo.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    editPit(item) {
      item.channelId = this.channel.channelId;
      this.$emit('input', item);
      this.$emit('change-view', 'editContent');
    },
    showDelConfirm(relationId) {
      //显示删除确认框
      this.delConFlag = true;
      this.delContentId = relationId;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    delContent(contentId) {
      this.$ajax({
        url: DI.topic.deleteChannelContentRel,
        data: JSON.stringify({
          relationId: contentId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功');
            this.delConFlag = false;
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
      params.channelId = this.channel.channelId;
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
        channelId: channel.channelId,
        removeContentId: insertIndexItem.relationId, //记录id
        contentPosition: (pageInfo.pageIndex != 1 ? (pageInfo.pageIndex - 1) * pageInfo.pageSize : 0) + insertIndexItem.$index + 1, //当前位置
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
              let num = Math.ceil(parseInt(params.insertId - 1) / 20);
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
        channelId: channel.channelId,
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
        channelId: this.channel.channelId,
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
      this.contentTitle = this.contentId = '';
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
        url = DI.topic.getTopicInfo;
        params.topicId = ruleForm.Oid + ',' + ruleForm.id;
      } else if (type == '4' || type == '5') {
        //视频 || 视频合集
        url = DI.topic.queryVideoDetail + '?videoId=' + id;
      } else if (type == '0' || type == '9') {
        //资讯
        url = DI.topic.getNewsInfo;
        params.newsId = parseInt(id);
      } else if (type == '6') {
        //专题
        url = DI.topic.querySpecialById;
        params.channelId = parseInt(id);
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

                if (result.newsType == 2) {
                  // 图集资讯
                  this.changeStyle(2).then(() => {
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
      this.ruleForm.img = result.cover;
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
    }
  }
};
</script>
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
    .search-box-topic {
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
      .btn-reset {
        border: 1px solid #ddd;
        background-color: #fff;
        color: #000000;
        margin-right: 20px;
      }
    }
  }
  .ibox-empty {
    margin-bottom: 10px;
  }
  .indexTop {
    padding: 5px 10px;
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
</style>
