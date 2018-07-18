
<template>
  <div class="container">
      <sn-table :data='list' ref='table1' v-show="$parent.subjectType==1">
        <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
        <sn-table-column label='LOGO' width="12%" align="center" sloted>
          <template slot-scope="row">
            <img v-if="row.logo" class="logo-img" alt="" :src="row.logo" />
          </template>
        </sn-table-column>
        <sn-table-column label='名称' width="15%" prop='subjectName' align='center'></sn-table-column>
        <sn-table-column label='信息' width="12%" align="center" sloted>
          <template slot-scope="row">
            <div class="info">
              <p>{{getInfoSource(row.resource)}}</p>
              <span class="labels" :title="row.labelNames">{{row.labelNames}}</span>
              <span v-if="row.resource != '3'">{{getSaleType(row.onSaleType)}}</span>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label='状态' sloted>
          <template slot-scope="row">
            <span>{{getChannelStatus(row.status)}}</span>
          </template>
        </sn-table-column>
        <sn-table-column label='内容维护' width="12%" align="center" sloted>
          <template slot-scope="row">
            <div>
              <p class="operate-par">
                <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
                <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
              </p>
              <p class="operate-par">
                <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
                <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
              </p>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label='展示维护' width="12%" align="center" prop='waitShelvesNum' sloted>
          <template slot-scope="row">
            <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">展示管理</a>
            <a v-else href="javascript:;" @click="showManage(row)">展示管理</a>
          </template>
        </sn-table-column>
        <sn-table-column label='操作' width="10%" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <p class="operate-par">
                <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
                <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
                <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
                <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
              </p>
              <p class="operate-par">
                <template>
                  <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                  <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
                </template>

                <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
                <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
              </p>
              <p class="operate-par">
                <a v-if="row.authorityBase == 1 && row.onSaleType == 2" href="javascript:;" @click="showFree(row)">免审设定</a>
                <a v-else class="disable-link" href="javascript:;">免审设定</a>
              </p>
            </div>
          </template>
        </sn-table-column>
      </sn-table>

    <sn-table :data='list' ref='table2' v-show="$parent.subjectType==2">
      <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
      <sn-table-column label='赛事ID' width="10%" prop='relationId' align='center'></sn-table-column>
      <sn-table-column label='LOGO' width="12%" align="center" sloted>
        <template slot-scope="row">
          <img v-if="row.logo" class="logo-img" alt="" :src="row.logo" />
        </template>
      </sn-table-column>
      <sn-table-column label='名称' width="15%" prop='subjectName' align='center'></sn-table-column>
      <sn-table-column label='信息' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div class="info">
            <span class="labels" :title="row.labelNames">{{row.labelNames}}</span>
            <span>{{getSaleType(row.onSaleType)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='内容维护' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
              <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
              <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
            </p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='展示维护' width="12%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">展示管理</a>
          <a v-else href="javascript:;" @click="showManage(row)">展示管理</a>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="10%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
              <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
              <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
              </template>

              <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
              <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityBase == 1 && row.onSaleType == 2" href="javascript:;" @click="showFree(row)">免审设定</a>
              <a v-else class="disable-link" href="javascript:;">免审设定</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>

    <sn-table :data='list' ref='table3' v-show="$parent.subjectType==3">
      <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
      <sn-table-column label='基本信息' width="34%" align="center" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <div class="img-wrap">
              <img alt="" class="adv-img" :src="row.cover" />
            </div>
            <span class="adv-title">
              <p class="adv-name">{{row.subjectName}}</p>
              <p class="adv-des" :title="row.description">{{row.description}}</p>
            </span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='信息' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div class="info">
            <p>{{getInfoSource(row.resource)}}</p>
            <span class="labels" :title="row.labelNames">{{row.labelNames}}</span>
            <span v-if="row.resource != '3'">{{getSaleType(row.onSaleType)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='内容维护' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
              <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
              <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
            </p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='展示维护' width="12%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">展示管理</a>
          <a v-else href="javascript:;" @click="showManage(row)">展示管理</a>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="10%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
              <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
              <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
              </template>

              <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
              <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityBase == 1 && row.resource == 1" href="javascript:;" @click="showFree(row)">免审设定</a>
              <a v-else class="disable-link" href="javascript:;">免审设定</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>

    <sn-table :data='list' ref='table4' v-show="$parent.subjectType==4">
      <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
      <sn-table-column label='名称' width="12%" prop='subjectName' align='center'></sn-table-column>
      <sn-table-column label='信息' width="20%" align="center" sloted>
        <template slot-scope="row">
          <div class="info">
            <p>{{getInfoSource(row.resource)}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='内容维护' width="15%" align="center" sloted>
        <template slot-scope="row">
          <div>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
              <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
              <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
            </p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='展示维护' width="15%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">展示管理</a>
          <a v-else href="javascript:;" @click="showManage(row)">展示管理</a>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
              <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
              <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
              </template>

              <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
              <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>

    <sn-table :data='list' ref='table5' v-show="$parent.subjectType==5">
      <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
      <sn-table-column label='小组ID' width="10%" prop='relationId' align='center'></sn-table-column>
      <sn-table-column label='名称' width="15%" prop='subjectName' align='center'></sn-table-column>
      <sn-table-column label='信息' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div class="info">
            <span class="labels" :title="row.labelNames">{{row.labelNames}}</span>
            <span>{{getSaleType(row.onSaleType)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='内容维护' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
              <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
              <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
            </p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='展示维护' width="12%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">展示管理</a>
          <a v-else href="javascript:;" @click="showManage(row)">展示管理</a>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="10%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
              <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
              <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
              </template>

              <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
              <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityBase == 1 && row.onSaleType == 2" href="javascript:;" @click="showFree(row)">免审设定</a>
              <a v-else class="disable-link" href="javascript:;">免审设定</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>

    <sn-table :data='list' ref='table6' v-show="$parent.subjectType==6">
      <sn-table-column label='主题ID' width="12%" prop='subjectId' align='center'></sn-table-column>
      <sn-table-column label='比赛ID' width="12%" prop='relationId' align='center'></sn-table-column>
      <sn-table-column label='名称' width="20%" prop='subjectName' align='center'></sn-table-column>
      <sn-table-column label='信息' width="20%" align="center" sloted>
        <template slot-scope="row">
          <div class="info">
            <span class="labels" :title="row.labelNames">{{row.labelNames}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='内容维护' width="15%" align="center" sloted>
        <template slot-scope="row">
          <div>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'待审核：' + row.waitShelvesNum}}</a>
              <a v-else href="javascript:;" @click="showReview(row)">{{'待审核：' + row.waitShelvesNum}}</a>
            </p>
            <p class="operate-par">
              <a v-if="row.authorityContent == 0" class="disable-link" href="javascript:;">{{'已上架：' + row.shelvesNum}}</a>
              <a v-else href="javascript:;" @click="showContent(row)">{{'已上架：' + row.shelvesNum}}</a>
            </p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="12%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">下线</a>
              <a v-if="row.status == '0' && row.authorityBase == 1" href="javascript:;" @click="showOnOff(row)">上线</a>
              <a v-else-if="row.status == '0' || row.authorityBase == 0" class="disable-link" href="javascript:;">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1' || row.authorityBase == 0" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.subjectId)">删除</a>
              </template>
              <a v-if="row.authorityBase == 0" class="disable-link" href="javascript:;">编辑</a>
              <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>

    <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delChannel(delSubjectId)" @close="hideDelConfirm">
      确定要删除吗？
    </sn-confirm>
    <sn-confirm txt ref="shelveConfirm" :flag="onOffFlag" @sure="setOnOff(onOffChannel)" @close="hideOnOff">
      确定要{{onOffStr}}吗？
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import { getThemeList, shelveTheme, deleteTheme } from './fetch'
export default {
  props: ['index'],
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 20,
      dataTotal: 0,
      delConFlag: false,
      delSubjectId: '',
      onOffFlag: false,
      onOffChannel: {},
      onOffStr: '',
      hotChannelId: ''
    };
  },
  watch: {
    index(newVal, oldVal) {
      this.pageIndex = 1;
      this.$bus.$emit('syncCurPage', 1);
      this.getList(1);
    }
  },
  methods: {
    getSaleType(val) { // 资讯上下线方式
      return Constant.getItemByValue(Constant.SALE_TYPE, val).name;
    },
    getInfoSource(val) { // 资讯来源
      return Constant.getItemByValue(Constant.INFO_SOURCE, val).name;
    },
    getChannelStatus(val) { // 上下架状态
      return Constant.getItemByValue(Constant.THEME_STATUS, val).name;
    },
    goto(num) {
      this.pageIndex = num;
      this.getList(num);
    },
    getList(pageIndex) {
      let params = {
        pageIndex: (pageIndex - 1) * this.pageSize,
        pageSize: this.pageSize,
        subjectType: parseInt(this.$parent.subjectType),
        subjectName: this.$parent.subjectName,
        subjectId: this.$parent.subjectId
      };
      getThemeList(this, params).then(res => {
        this.list = res.subjectList || [];
        this.hotChannelId = res.hotChannelId || '';
        this.dataTotal = res.subjectNum || 0;
      });
    },
    showContent(channel) {
      this.$emit('input', channel);
      if (channel.subjectType == '3') {
        //专题类型
        this.$emit('change-view', 'topicContentList');
      } else {
        this.$emit('change-view', 'contentList');
      }
    },
    showReview(item) {
      this.$emit('input', item);
      this.$emit('change-view', 'review');
    },
    showManage(item) {
      item.hotChannelId = this.hotChannelId;
      this.$emit('input', item);
      this.$emit('change-view', 'rdisplay');
      /*let channelFlag = item.channelFlag;
      if (channelFlag == '1') { // 视频频道
        this.$emit('change-view', 'vdisplay');
        return false;
      }
      if (channelFlag == '2' || channelFlag == '3') { // 推荐频道 定制频道
        this.$emit('change-view', 'rdisplay');
        return false;
      }*/
    },
    showFree(item) {
      this.$emit('input', item);
      this.$emit('change-view', 'exreview');
    },
    showEdit(channelItem) {
      this.$emit('input', channelItem);
      this.$emit('change-view', 'edit');
    },
    showDelConfirm(subjectId) {
      this.delConFlag = true;
      this.delSubjectId = subjectId;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    delChannel(subjectId) {
      deleteTheme(this, {
        subjectId: subjectId
      }).then(() => {
        this.$message.success('删除成功');
        this.delConFlag = false;
        this.getList(this.pageIndex);
      });
    },
    showOnOff(channelItem) {
      this.onOffFlag = true;
      this.onOffChannel = channelItem;
      if (this.onOffChannel.status == '1') {
        this.onOffStr = '下线';
      } else {
        this.onOffStr = '上线';
      }
    },
    setOnOff(channelItem) {
      let params = {
        subjectId: channelItem.subjectId,
        status: channelItem.status == '1' ? '0' : '1'
      };
      shelveTheme(this, params).then(() => {
        this.$message.success(`${this.onOffStr}成功`);
        this.onOffFlag = false;
        this.getList(this.pageIndex);
      });
    },
    hideOnOff() {
      this.onOffFlag = false;
    }
  },
  mounted() {
    this.getList(1);
  }
}
</script>
<style scoped>
.container {
  .adv-info {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
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
    }
    .adv-title {
      padding-left: 8px;
      line-height: 1.3;
      .adv-name {
        text-align: left;
        line-height: 1.3;
        letter-spacing: 2px;
      }
      .adv-des {
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        box-orient: vertical;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        line-clamp: 3;
        -webkit-line-clamp: 3;
        letter-spacing: 3px;
        line-height: 1.3;
        font-size: 12px;
        color: #999999;
        margin-top: 2px;
        text-align: left;
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    .labels {
      overflow: hidden;
      text-overflow: ellipsis;
      display: box;
      display: -webkit-box;
      box-orient: vertical;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      line-clamp: 3;
      -webkit-line-clamp: 3;
      letter-spacing: 0;
    }
    span {
      padding: 2px 0;
      line-height: 1.3;
    }
  }
  .info p {
    margin-bottom: 3px;
  }
  a {
    color: #1684c2;
    & + a {
      margin-left: 10px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .logo-img {
    width: 60px;
    height: 60px;
  }
  .operate-par,
  .info-par {
    padding: 3px 0;
    line-height: 17px;
  }
  .mark-popup {
    display: flex;
    width: 350px;
    label {
      line-height: 32px;
    }
    .input-box {
      margin-left: 12px;
    }
  }
  .disable-link {
    color: #ccc;
    &:hover {
      text-decoration: none;
      cursor: default;
    }
  }
  .align-end {
    text-align: right;
  }
  .label-info {
    line-height: 1.4;
  }
}
</style>
