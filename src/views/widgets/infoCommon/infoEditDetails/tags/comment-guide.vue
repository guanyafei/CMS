<template>
  <div>
      <ul class="comment-item" id="comment-group">
          <li class="comment-body" :data-index="index" :key="index" v-for="(commentItem,index) in commentList">
              <sn-form-item label="评论账号">
                  <sn-select v-model="commentItem.account" width="360">
                      <sn-option key="0" value="0" name="自动分配"></sn-option>
                  </sn-select>
                  <div class="del-btn" v-if="index > 2 && commentList.length > 3 && !commentItem.needNew">
                    <button class="delBtn" @click="delItem(commentItem,index)">删除</button>
                  </div>
                  <div class="del-btn" v-if="index > 2 && commentList.length > 3 && commentItem.needNew">
                    <button class="delBtn" @click="delItem(commentItem,index)">删除</button>
                  </div>
              </sn-form-item>
              <sn-form-item label="评论内容" prop="content">
                  <sn-input type="textarea" v-model="commentItem.content" placeholder="请输入评论内容500字以内" :rows="4" :maxlength="500" :totalWords="500" :showWord="true" style="height:100px;"/>
              </sn-form-item>
              <sn-form-item label="评论图片" prop="">
                  <sn-cropper :aspectRatio="1/1" v-model="commentItem.cover" size="1M" gifSize="8M" width="150" height="150"></sn-cropper>
              </sn-form-item>
              <sn-form-item label="评论点赞数">
                  <sn-input v-model="commentItem.like" :maxlength="8" inputType="number" placeholder="默认系统分配"></sn-input>
              </sn-form-item>
              <div class="comment-foot">
                <div v-if="index == 2 && commentList.length == 3 && commentItem.needNew">
                  <button class="addBtn" @click="addItem(commentItem,index)">新增一条</button>
                </div>
                <div v-if="index > 2 && commentList.length > 3 && commentItem.needNew">
                  <button class="addBtn" @click="addItem(commentItem,index)">新增一条</button>
                </div>
              </div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'CommentGuide',
  props: ['ruleForm'],
  data() {
    return {
      accountList: [],
      commentList: [
        { id: new Date().getTime() + 1, account: '0', content: '', cover: '', like: '', needNew: false },
        { id: new Date().getTime() + 2, account: '0', content: '', cover: '', like: '', needNew: false },
        { id: new Date().getTime() + 3, account: '0', content: '', cover: '', like: '', needNew: true }
      ],
      isShow: false,
      currentItem: {},
    };
  },
  methods: {
    //新增一条
    addItem(comment, index) {
      comment.needNew = false;
      this.commentList.push({ id: new Date().getTime(), account: '0', content: '', cover: '', like: '', needNew: true });
    },
    //删除一条
    delItem(comment, index) {
      let _self = this,
        $index;
      this.$confirm('您确定删除此评论引导吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $index = _self.commentList.findIndex(item => {
          return item.id == comment.id;
        });
        _self.commentList.splice($index, 1);
        if(_self.commentList.length > 2){
          _self.commentList[_self.commentList.length-1]['needNew'] = true
        }
      }).catch(er=>{})
    },
    //获取已经填写评论内容的数据
    getData() {
      let _self = this,
        i = 0,
        temp = [];
      for (; i < _self.commentList.length; i++) {
        if (_self.commentList[i].content) {
          temp.push(_self.commentList[i]);
        }
      }
      return temp;
    }
  }
};
</script>
<style scoped>
ul#comment-group li {
  position: relative;
  margin-bottom: 20px;
}
ul#comment-group li:after {
  position: absolute;
  right: 0px;
  bottom: 0;
  left: 30px;
  content: '';
  height: 1px;
  background: #eee;
}
ul#comment-group li:last-child {
  margin-bottom: 0px;
}
ul#comment-group li:last-child:after {
  height: 0px !important;
}
.del-btn{
  position: absolute;
  top:0;
  left: 400px;
}
.comment-foot {
  margin-left: 110px;
  padding-top: 10px;
  padding-bottom: 15px;
  button {
    font-size: inherit;
  }
  button.addBtn {
    margin-right: 20px;
    color: #09bbfe;
  }
}
button.delBtn {
  width: 80px;
  height: 30px;
  color: #F47B77;
  border: 1px solid #F47B77;
  border-radius: 16px;
}
</style>
<style>
.sn-message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
}
.sn-message-box__wrapper::after {
  position: absolute;
  right: 0;
  left: 0;
  z-index: -1;
  width: 100% !important;
  background: rgba(0, 0, 0, 0.4);
}
</style>


