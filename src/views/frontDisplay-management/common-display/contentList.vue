<template>
  <div id="list">
    <sn-topbar :title="title">
      <span slot="back" class="goBack" @click="goBack">
        <a href="javascript:;">←</a>
      </span>
    </sn-topbar>
    <div class="ibox">
      <div class="ibox-btns clearfix">
        <p class="clearfix">
          <sn-button class="delBtn" type="extra1" @click="showBatchDel()">批量删除</sn-button>
          <sn-button class="addBtn" type="outline" @click="showParentAdd()">添加数据</sn-button>
        </p>
      </div>
    </div>
     <sn-datatable :data="displayContentList" ref="table">
      <sn-datacolumn label="自定义" prop="checkbox" :width="40" :column-border="false">
        <sn-checkbox type="checkbox"  v-model="isCheckedAll"   @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="序号" prop="$index" width="8%" sloted></sn-datacolumn>
      <sn-datacolumn label="图片" prop="contentCover" width="20%" sloted></sn-datacolumn>
      <sn-datacolumn label="标题" prop="title" width="20%" sloted></sn-datacolumn> 
      <sn-datacolumn label="目标" prop="type" width="20%" sloted></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" sloted>
      </sn-datacolumn>
      <template slot-scope="{row}"  slot="title">
        <ul class="indexBox">
          <li class="childItem" >
              {{row.title}}
          </li>
           <li class="childItem" v-for = "item of row.listChild" :key="item.id">
              {{item.title}}
          </li> 
        </ul>
      </template>
      <template slot-scope="{row}" slot="type">
        <ul class="indexBox operate">
          <li class="childItem" >
              <p class="operate-par">{{ row | getDisplayStatus}}</p>
          </li>
           <li class="childItem" v-for = "item of row.listChild" :key="item.id">
              <p class="operate-par">{{item | getDisplayStatus}}</p>
          </li> 
        </ul>
      </template>
      <template slot-scope="{row}" slot="contentCover">
        <ul class="indexBox">
           <li class="childItem">
            <img v-img="{src:getItemCover(row.imgUrl)}" :src="getItemCover(row.imgUrl)|smallImage" class="cover">
          </li>
          <li class="childItem" v-for = "item of row.listChild" :key="item.id">
            <img v-img="{src:getItemCover(item.imgUrl)}" :src="getItemCover(item.imgUrl)|smallImage" class="cover">
          </li>
        </ul>
      </template>
      <template slot-scope="cell" slot="opt">
        <ul class="indexBox operate">
           <li class="childItem" >
              <p class="operate-par">
                <a href="javascript:;" @click="showParentDel(cell.row)">删除</a>
                <a href="javascript:;" @click="showEdit(cell.row)">编辑</a> 
              </p>
              <p class="operate-par">
                <a v-if="(cell.index > 0 || pageIndex > 1)" href="javascript:;" @click="exchange(1,cell,item,parentFlag)">上移</a>
                <a v-if="(listParentTotal-1) > ((pageIndex-1)*pageSize+cell.index)" href="javascript:;" @click="exchange(2,cell,item,parentFlag)">下移</a>
              </p>
              <p class="operate-par">
                <a href="javascript:;" @click="showChildAdd(cell.row)">添加下级数据</a>
              </p>
           </li>
          <li class="childItem" v-for = "(item,idx) of cell.row.listChild" :key="item.id">
              <p class="operate-par">
                <a href="javascript:;" @click="showChildDel(item)">删除</a>
                <a href="javascript:;" @click="showEdit(item)">编辑</a>
              </p>
              <p class="operate-par">
                <a v-if="(idx > 0 || pageIndex > 1)" href="javascript:;" @click="exchange(1,cell,item,childFlag)">上移</a>
                <a v-if="(cell.row.listChild.length-1) > ((pageIndex-1)*pageSize+idx)" href="javascript:;" @click="exchange(2,cell,item,childFlag)">下移</a>
              </p>
          </li> 
        </ul> 
      </template>
      <template slot="checkbox" slot-scope="cell">
          <ul class="indexBox">
             <li class="childItem">
               <sn-checkbox type="checkbox" :label="cell.row.id" v-model="selectedIds" @change="handleChange(cell.row)"></sn-checkbox>
             </li>
         </ul>
      </template>
      <template slot-scope="cell" slot="$index">
         <ul class="indexBox">
           <li class="childItem">
                {{cell.index+1}}
           </li>
         </ul>
      </template>
    </sn-datatable>
    <!-- 分页 -->
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm  title="删除内容" @close='hideAddFloor' @sure='doBatchDel' txt :flag="delConFlag">
      确认将删除当前选中内容？
    </sn-confirm>
    <!-- 添加数据 展示样式-通用-->
    <sn-confirm ref="confirm" @close="hideAddFloor" txt :flag="addFloorFlag" :title="confirmTitle"  @sure="saveDisplayFloor" confirmButtonText="保存">
      <div>
        <sn-form ref="displayFloor"
          :model="displayFloorInfo"
          :rules="rules"
          label-width="80px"
          formWidth="480">
          <sn-form-item label="展示标题" prop="displayTitle" ref="displayTitle">
            <sn-input v-model="displayFloorInfo.displayTitle" placeholder="请输入标题" width="400" :maxlength="50"></sn-input>
          </sn-form-item>
          <sn-form-item label="展示封面"
            prop="displayImgUrl"
            ref="displayImgUrl">
            <sn-cropper :aspectRatio="aspectRatio"
              v-model="displayFloorInfo.displayImgUrl"
              ref="cropper"
              label="封面"
              width="360"
              :height="aspectRatioHeight"
              isScoped></sn-cropper>
          </sn-form-item>
          <sn-form-item label="目标类型"
            prop="displayJumpType"
            ref="displayJumpType">
            <sn-select v-model="displayFloorInfo.displayJumpType"
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
          <!-- URL -->
          <sn-form-item :label="JumpName" prop="displayJumpUrl"  ref="displayJumpUrl"  v-if="showType==='URL'">
            <sn-input v-model="displayFloorInfo.displayJumpUrl" :placeholder="JumpPlaceholder" width="400"    :maxlength="400" @blur="isUrl"></sn-input>
          </sn-form-item>
          <div class="errTips" v-if="urlErrTips">请输入正确的url</div>
          <!-- 球队 球员 节目 作者 赛事 栏目 专题 小组 专题 比赛-->
          <sn-form-item :label="JumpName+'查询'" prop="matchLabels"  ref="matchLabels" v-if="showType==='rests'">
            <sn-autocomplete
              v-model="searchInput"
              valueKey="matchName"
              :fetchSuggestions="querySearchAsync"
              :isSuggestionsPages="true"
              :placeholder="JumpPlaceholder"
              @select="selectItem"
              radius="6"
              width="400"
            >
              <!-- <template slot-scope="{item}" slot="history">
                {{item.matchName || item.name}}
              </template> -->
              <template slot-scope="{item}">
                <div class="match-suggestions__item">
                  <template v-if="item.matchName">
                    <span>{{item.id}}</span>
                    <span>{{item.name}}</span>
                    <span>{{item.logo}}</span>
                  </template>
                  <span v-else>
                    {{item.id}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.teamName}}
                  </span>
                </div>
              </template>
            </sn-autocomplete>
          </sn-form-item>
          <!-- 球队 -->
           <div v-if=" jumpTypeVal === 1">
              <sn-form-item  label="球队名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="球队ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400" />
              </sn-form-item>
              <div class="errTips" v-if="errTips">球队ID不能为空</div>
              <sn-form-item label="球队logo" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpImgUrl" alt="">
              </sn-form-item>
           </div>
          <!-- 球员 -->
           <div v-if=" jumpTypeVal === 2">
              <sn-form-item  label="球员名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled  style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="球员ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400" />
              </sn-form-item>
              <div class="errTips" v-if="errTips">球员ID不能为空</div>
              <sn-form-item label="球员头像" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpImgUrl" alt="">
              </sn-form-item>
           </div>
            <!-- 节目 -->
           <div v-if=" jumpTypeVal ===3">
              <sn-form-item  label="节目名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled  style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="节目ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400" />
              </sn-form-item>
              <div class="errTips" v-if="errTips">节目ID不能为空</div>
           </div>
            <!-- 作者 -->
           <div v-if=" jumpTypeVal === 4">
              <sn-form-item  label="作者名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="作者ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400" />
              </sn-form-item>
              <div class="errTips" v-if="errTips">作者ID不能为空</div>
              <sn-form-item label="作者头像" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpImgUrl" alt="">
              </sn-form-item>
           </div>
           <!-- 赛事 -->
           <div v-if=" jumpTypeVal === 5">
              <sn-form-item label="主题ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <div class="errTips" v-if="errTips">主题ID不能为空</div>
              <sn-form-item  label="赛事名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <!-- <sn-form-item label="赛事ID">
                <sn-input v-model="jumpInfo.jumpMatchId" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="赛事logo" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpMatchLogo" alt="">
              </sn-form-item> -->
           </div>
           <!-- 栏目 -->
           <div v-if=" jumpTypeVal === 6">
              <sn-form-item label="栏目ID">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <div class="errTips" v-if="errTips">栏目ID不能为空</div>
              <sn-form-item  label="栏目名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
           </div>
           <!-- 小组 -->
           <div v-if=" jumpTypeVal === 7">
              <sn-form-item label="主题ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <div class="errTips" v-if="errTips">主题ID不能为空</div>
              <!-- <sn-form-item label="小组ID">
                <sn-input v-model="jumpInfo.jumpTeamId" disabled style="color: #333;"  width="400"/>
              </sn-form-item> -->
              <sn-form-item  label="赛事名称">
                <sn-input v-model="jumpInfo.jumpMatchName" disabled  style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item  label="小组名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled  style="color: #333;"  width="400"/>
              </sn-form-item>
              <!-- <sn-form-item label="赛事ID">
                <sn-input v-model="jumpInfo.jumpMatchId" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="赛事logo" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpMatchLogo" alt="">
              </sn-form-item> -->
           </div>
           <!-- 主题专题 -->
           <div v-if=" jumpTypeVal === 8">
              <sn-form-item label="主题ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400" />
              </sn-form-item>
              <div class="errTips" v-if="errTips">主题ID不能为空</div>
              <sn-form-item label="专题名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400" />
              </sn-form-item>
           </div>
           <!-- 主题比赛 -->
           <div v-if=" jumpTypeVal === 9">
              <sn-form-item label="主题ID" prop="displayJumpUrl"  ref="displayJumpUrl">
                <sn-input v-model="displayFloorInfo.displayJumpUrl" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <div class="errTips" v-if="errTips">主题ID不能为空</div>
              <sn-form-item  label="赛事名称">
                <sn-input v-model="jumpInfo.jumpMatchName" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
               <sn-form-item  label="比赛名称">
                <sn-input v-model="jumpInfo.jumpTitle" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <!-- <sn-form-item label="赛事ID">
                <sn-input v-model="jumpInfo.jumpMatchId" disabled style="color: #333;"  width="400"/>
              </sn-form-item>
              <sn-form-item label="赛事logo" style="overflow: hidden;">
                <img  style="width:80px;height:80px;float: left;" :src="jumpInfo.jumpMatchLogo" alt="">
              </sn-form-item> -->
           </div>
        </sn-form>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { setHistoryArrData } from 'utils/util';
export default {
  name: 'List',
  components: {

  },
  props: {
     displayItem:{
      type:[String, Object],
      default:function(){
        return {};
      }
    }
  },
  data() {
    return {
      urlErrTips:false,//url错误提示标志
      errTips: false,//展示位创建框错误提示标志
      selectedLablesItem:null,
      searchInput: '',
      addFloorFlag:false,//创建、编辑标志
      pageIndex: 1,//当前页码
      pageSize: 20,//每页数据条数
      dataTotal:0,//数据总数
      displayContentList:[], //展示位列表
      displayFloorInfo: {
        displayTitle: '',//展示标题
        displayJumpType: '',//目标类型
        displayImgUrl: '',//展示封面
        displayParentId:null, // 父节点 无为null
        displayJumpUrl:''// url类型是url 其他类型是对应id
      },
      jumpInfo:{
        jumpTitle:'',//目标名称
        jumpId:'',//球队、球员、节目、作者、主题、栏目ID 
        jumpImgUrl:'',//目标logo或头像
        jumpTeamName:'',//球队名称	
        jumpMatchName:''//赛事名称
      },
      title:'',
      // width="260" height="260" :aspectRatio="1/1"
      // aspectRatioHeight: 360 * 360 / 750 + '',//封面高度
      // aspectRatio: 750 / 400,
      aspectRatio:'1/1',
      aspectRatioHeight:'150',
      jumpTypeList: Constant.DISPLAY_JUMP_TYPE, //目标类型
      JumpName: '跳转目标',
      JumpPlaceholder: '请输入跳转名称关键词快速查询',
      displayData:{},//父展示位数据
      parentId:'',//父展示位ID
      editId:'',//编辑展示位ID
      displayUrl:'',//添加、编辑接口
      delConFlag:false,//删除标志
      selectedIds:[],//被选中数据
      isCheckedAll: Boolean,
      parentFlag:0,
      jumpTypeVal:0,//类型跳转val值 
      showType:'',//查询框切换标志
      childFlag:"child",//父子移动标志
      parentFlag:"parent",
      listParentTotal:0,//父节点长度
      listNum:0,//节点总数
      rules: {
        displayTitle:[{
           required: true,
           type:'string',
           message:'请输入展示标题',
           trigger:'change'
        }],
        //2018/6/2取消必填
        // displayJumpUrl: [{
        //   required: true,
        //   type: 'number',
        //   message: '请选输入目标地址',
        //   trigger: 'change'
        // }],
        // displayJumpType:[{
        //   required: true,
        //   type:'number',
        //   message:'请选择目标类型',
        //   trigger:'change'
        // }],
        // displayImgUrl: [{
        //   required: true,
        //   type: 'string',
        //   message: '请上传图片',
        //   trigger: 'change'
        // }]
      }
    }
  },
  watch:{
    'displayFloorInfo.displayJumpUrl':function(newVal,oldVal){
     if(newVal != ''){
       this.errTips = false;
     }
    },
    'selectedIds':function(newVal,oldVal){
      if(newVal.length < this.dataTotal){
        this.isCheckedAll = false;
      }else if(newVal.length == this.dataTotal){
        this.isCheckedAll = true;
      }
    }
  },
  filters:{
    //获取展示位状态
    getDisplayStatus(item) {
      let index = item.type;
      if(Constant.DISPLAY_JUMP_TYPE[index-1]){
        return Constant.DISPLAY_JUMP_TYPE[index-1].name + ':'+ item.targetName;
      }else{
        return '-'
      }
    }
  },
  //初始化列表
  mounted() {
    this.title = this.displayItem.title;
    this.queryDisplayList(1);
  },
  methods: {
    //返回上一页
    goBack(){
      this.$emit("change-view","list");
    },
    isUrl(){
      let url = this.displayFloorInfo.displayJumpUrl;
      if(this.displayFloorInfo.displayJumpType == 10 && url != ''){
         let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
          if(!reg.test(url)){ 
            this.urlErrTips = true; 
          } else {
            this.urlErrTips = false; 
        }
      }
    },
    //查询
    querySearchAsync(options, cb) {
      this.$ajax({
        url: DI.displayContent.displayTargetQuery,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          // name: options.queryString,
          // pageIndex: options.pageIndex,
          // pageSize: options.pageSize
          tagSearch:this.searchInput,
          tagType:this.displayFloorInfo.displayJumpType
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
    selectItem(item) {
      setHistoryArrData('matchTag', [item], ['matchId', 'competitionId']);
      this.selectedLablesItem = { ...item };
      if(this.selectedLablesItem){
        this.jumpTypeVal = this.displayFloorInfo.displayJumpType;
        this.selectedOneItem(this.selectedLablesItem);
      }
    },
    //单击模糊查询结果列表---信息展示
    selectedOneItem(selectedItem){
      this.jumpInfo.jumpTitle = selectedItem.name;//目标名称
      this.jumpInfo.jumpImgUrl = selectedItem.logo;//目标logo或头像
      this.jumpInfo.jumpId = selectedItem.id;//球队、球员、节目、作者、主题、栏目ID
      this.jumpInfo.jumpTeamName =  selectedItem.teamName;//球队名称	
      this.jumpInfo.jumpMatchName = selectedItem.matchName;//赛事名称
      this.displayFloorInfo.displayJumpUrl = this.jumpInfo.jumpId;
    },
    //弹窗 目标类型-跳转ID联动
    handleFJumpType (val) { //编辑楼层--选择跳转类型
    this.urlErrTips = false;
      this.jumpTypeVal = 0;
      this.displayFloorInfo.displayJumpType = val;
      this.JumpName = Constant.DISPLAY_LABEL[val - 1] == undefined ? '' : Constant.DISPLAY_LABEL[val - 1].label;
      this.JumpPlaceholder = Constant.DISPLAY_LABEL[val - 1] == undefined ? '' : Constant.DISPLAY_LABEL[val - 1].placeholder;;
      this.jumpInfo={
        jumpTitle:'',//目标名称
        jumpId:'',//球队、球员、节目、作者、主题、栏目ID 
        jumpImgUrl:'',//目标logo或头像
        jumpTeamName:'',//球队名称	
        jumpMatchName:''//赛事名称
      };
      
      if(val ===10){
        this.showType = "URL";
      }else{
        if(val == 11){
          this.showType = "";
        }else{
        this.showType = "rests";
        }
        this.displayFloorInfo.displayJumpUrl = '';
      }
    },
    //父节点--添加
    showParentAdd(){
      this.addFloorFlag = true;
      this.confirmTitle = "添加数据";
      this.displayFloorInfo.displayParentId = null;
      this.displayUrl =  DI.displayContent.displayContentAdd;
    },
    //子节点--添加
    showChildAdd(row){
      this.addFloorFlag = true;
      this.confirmTitle = "添加下级数据";
      this.displayFloorInfo.displayParentId = row.id;
      this.displayUrl =  DI.displayContent.displayContentAdd;
    },
    //父、子节点-修改
    showEdit(row){
        this.addFloorFlag = true;
        this.confirmTitle = "编辑数据";
        this.displayFloorInfo.displayImgUrl = row.imgUrl;
        this.displayFloorInfo.displayJumpUrl = row.jumpUrl;
        this.displayFloorInfo.displayTitle = row.title;
        this.displayFloorInfo.displayJumpType = row.type;
        this.editId = row.id;
        this.handleFJumpType(row.type);
        this.jumpTypeVal = row.type;
        if(row.parentId != ''){
          this.displayFloorInfo.displayParentId = row.parentId;
        }
        if(row.type!= 10){
          this.searchTargetInfo(row);
        }
       this.displayUrl =  DI.displayContent.displayContentEdit;
    },
    //编辑/新增目标类型下拉列表
    searchTargetInfo(item){
      this.displayFloorInfo.displayJumpUrl = item.jumpUrl;
      this.displayFloorInfo.displayJumpType = item.type;
      this.$ajax({
        url: DI.displayContent.displayTargetQueryById,
        context: this,
        loadingText: "查询中,请稍后",
        data: JSON.stringify({
          tagSearchId:this.displayFloorInfo.displayJumpUrl,
          tagType:this.displayFloorInfo.displayJumpType
        }),
        success: (res) => {
          if (res.retCode == "0") {
            if(!res.data.list.length){
              return
            }
            let list = res.data.list[0];
            this.jumpInfo.jumpTitle = list.name;//目标名称
            this.jumpInfo.jumpId = list.id;//球队、球员、节目、作者、主题、栏目ID
            this.jumpInfo.jumpImgUrl = list.logo;//目标logo或头像
            if(list.matchName == null){
              this.jumpInfo.jumpTeamName = "";
            }else{
              this.jumpInfo.jumpMatchName = list.matchName;//赛事名称
            }
            if(list.teamName == null){
              this.jumpInfo.jumpTeamName = "";
            }else{
              this.jumpInfo.jumpTeamName = list.teamName;//球队名称
            }
            this.displayFloorInfo.displayJumpUrl = this.jumpInfo.jumpId;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    //隐藏添加、编辑弹窗
    hideAddFloor(){
      this.addFloorFlag = false;
      this.delConFlag = false;
      this.displayData = {};
      this.urlErrTips = false;
      this.displayUrl="";
      this.displayFloorInfo ={
        displayTitle: '',
        displayJumpType: '',
        displayImgUrl: '',
        displayParentId:null
      };
      this.jumpInfo={
        jumpTitle:'',//目标名称
        jumpId:'',//球队、球员、节目、作者、主题、栏目ID 
        jumpImgUrl:'',//目标logo或头像
        jumpTeamName:'',//球队名称	
        jumpMatchName:''//赛事名称
      };
      this.$refs.displayJumpType && this.$refs.displayJumpType.resetField();
      this.$refs.displayJumpUrl && this.$refs.displayJumpUrl.resetField();
      this.$refs.displayTitle && this.$refs.displayTitle.resetField();
      this.$refs.displayImgUrl && this.$refs.displayImgUrl.resetField();
      this.$refs.displayJumpType && this.$refs.displayJumpType.resetField();
      this.showType = '';
      this.jumpTypeVal = 0;
      this.JumpName = '跳转ID';
      this.JumpPlaceholder = '请输入跳转ID';
      this.selectedIds = [];
      this.isCheckedAll = false;
      this.listNum = 0;
    },
    //验证添加、编辑展示位内容数据
    saveDisplayFloor(){
        this.$refs.displayFloor.validate((valid)=>{
          if(valid){
             this.submitFloorFun();
          }
        });
    },
    //提交添加、编辑展示位内容数据
    submitFloorFun(){
      //2018/6/2 wuxa 修改 目标类型展示封面为 非必填项目
      if(!this.displayFloorInfo.displayJumpType){
        this.displayFloorInfo.displayJumpType = 11;
        }
      this.displayData = {
        displayLocationId:this.displayItem.id,
        imgUrl:this.displayFloorInfo.displayImgUrl,
        jumpUrl:this.displayFloorInfo.displayJumpUrl,
        title:this.displayFloorInfo.displayTitle,
        type:this.displayFloorInfo.displayJumpType,
        parentId: this.displayFloorInfo.displayParentId,
        id:this.editId
      };
      this.$ajax({
        url:this.displayUrl,
        data:JSON.stringify(this.displayData),
         context: this,
         success:(res)=>{
            if(res.retCode == 0){
              this.$message.success("提交成功！");
              this.queryDisplayList(this.pageIndex);
            } else {
            this.$message.error(res.retMsg);
          }
          this.hideAddFloor();
         },
         error: () => {
          console.error('error');
        }
      });
    },  
    //分页
    goto(num) {
      this.pageIndex = num;
      this.queryDisplayList(this.pageIndex);
    },
    //查询展示位列表
    queryDisplayList(pageIndex) {
      let ajaxData = {
        displayLocationId: this.displayItem.id,
        pageNum: pageIndex ? (pageIndex - 1) * this.pageSize : 0,
        pageSize: this.pageSize,
      };
      this.$ajax({
        url: DI.displayContent.displayContentList,
        data: JSON.stringify(ajaxData),
        asyns:false,
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.listParentTotal = resData.listParent.length;
            let itemList = resData.listParent || [];
            this.dataTotal = resData.totolCount || 0;
            this.displayContentList = itemList;
            if(this.dataTotal == 0){
              this.displayContentList = [];
            }else{
             itemList.forEach((item)=>{
            if(item.type == 10){
              item.targetName = item.jumpUrl;
            }
             if(item.listChild.length!=0){
               item.listChild.forEach((childItem)=>{
                if(childItem.type == 10){
                  childItem.targetName = childItem.jumpUrl;
                }
               })
              }
            });
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
    //展位上移下移
    exchange(state, rowItem,item,flag) {
      if(rowItem.row.id !== '' && rowItem.row.listChild.length ==0){
        this.displayData={
          id:rowItem.row.id,
          movingState:state,
          parentId:null
        };
      }
      if(rowItem.row.id != '' && rowItem.row.listChild.length !=0 && flag =="child"){
        this.displayData={
          id:item.id,
          movingState:state,
          parentId:item.parentId
        };
      }else if(rowItem.row.id != '' && rowItem.row.listChild.length !=0 && flag =="parent"){
          this.displayData={
          id:rowItem.row.id,
          movingState:state,
          parentId:null
        };
      }
      this.$ajax({
        url: DI.displayContent.displayContentExchange,
        data: JSON.stringify(this.displayData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.queryDisplayList(this.pageIndex);
            this.$message.success('移动成功！');
          } else {
            this.$message.error(res.retMsg);
          }
          this.hideAddFloor();
        },
        error: () => {
          this.$message.error('移动失败！');
        }
      });
    },
    getItemCover (url) {
      url = url ? url.split(';')[0] : '';
      return url
    },
    batchDelHandle () {
      this.viewType = 'batchDel';
    },
    //父节点-删除
    showParentDel(item){
      this.selectedIds = [];
      this.delConFlag = true;
      this.selectedIds.push(item.id);
      let childList = item.listChild;
      if(childList.length != 0){
          childList.forEach((childItem)=>{
          this.selectedIds.push(childItem.id);    
        });
      }
    },
    //子节点-删除
    showChildDel(item){
      this.selectedIds = [];
      this.delConFlag = true;
      this.selectedIds.push(item.id);
    },
    //批量删除
    showBatchDel(){
      if (this.selectedIds.length === 0) {
        this.$message.warning("请至少选中一条内容！");
        return;
      }
      this.delConFlag = true;
    },
    //批量删除全选
    handleCheckAllChange() {
     if(this.isCheckedAll){
       this.selectedIds = [];
       this.displayContentList.forEach((item) => {
         this.selectedIds.push(item.id);
         let childList = item.listChild;
         if(childList.length != 0){
           childList.forEach((childItem)=>{
           this.selectedIds.push(childItem.id);    
           });
         }
       });
     }else{
       this.selectedIds = [];
     }
    },
    //批量删除点选
    handleChange(item){
      let childList = item.listChild;
      if(childList.length != 0){
           childList.forEach((childItem)=>{
           this.selectedIds.push(childItem.id);    
           });
        }
    },
    //批量删除
    doBatchDel () {
      this.$ajax({
        url: DI.displayContent.displayContentDel,
        context: this,
        asyns:false,
        loadingText: '正在删除，请稍候！',
        data: JSON.stringify({
          ids:this.selectedIds
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.queryDisplayList(this.pageIndex);
            this.$message.success("删除成功！");
            this.hideAddFloor();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    close () {
      this.viewType = null;
    }
  }
}
</script>

<style scoped>
.goBack{
  position: relative;
  display: inline-block;
  width:26px;
  height:26px;
  a{
     color:black;
     font-size:26px;
     position: absolute;
     top:50%;
     left:0;
     margin-top:-4px;
  }
}
  .operate-par
  {
    padding: 3px 0;
    line-height: 17px;
    a{
      color: #1684c2;
    }
  }
.cover {
  width: 120px;
  height: 80px;
}
  .nav-box{
    margin-bottom:7px;
  }
.ibox{
  .ibox-btns{
    background:#fff;
    p{
      margin:14px 0;
      .delBtn{
        float:left
      }
       .addBtn{
        float:right;
      }
    }
  }
}
.childItem{
  height:80px;
  line-height: 80px;
  margin:5px 0;
  img{
    vertical-align:middle;
  }
}
.operate{
  .childItem{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
.indexBox{
  height:100%;
}
.pagination {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .cur {
    margin: 0 5px;
    cursor: auto;
    color: #0abbfe;
  }
  span,
  a {
    color: #666;
    display: block;
    padding: 8px 10px;
    border: 1px solid #ccc;
  }
  span {
    margin-right: 5px;
    cursor: pointer;
  }
}
.selectWrap {
    display: flex;
    justify-content: space-between;
  }
  .form-item{
    margin-bottom:20px;
  }
  .errTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -100px;
  }
</style>
<style>
.sn-popup{
  overflow:auto;
}
</style>
