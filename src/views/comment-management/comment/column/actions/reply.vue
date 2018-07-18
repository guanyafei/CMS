<template>
    <!-- 回复操作-->
    <div id="reply">
        <button class="mt-5" @click.stop="showDialog = true">{{title  || '回复'}}</button>
        <sn-confirm :flag="showDialog" :title="title || '回复'" @close="closed" @sure="doReply">
            <div class="form-content">
                <sn-form :model="formData" ref="replyForm" formWidth="480" label-width="80">
                    <sn-form-item label="发布账号">
                        <sn-select v-model="formData.account" @change="accountChange" width="360">
                            <sn-option key="0" value="0" name="自动分配"></sn-option>
                            <sn-option v-if="formData.accountList.length" v-for="virtualUser in formData.accountList" :key="virtualUser.virtualUserId" :value="virtualUser.virtualUserId" :name="virtualUser.virtualUserName"></sn-option>
                        </sn-select>
                    </sn-form-item>
                    <sn-form-item label="评论内容" prop="content" :rules="replyRules">
                        <sn-input type="textarea" :placeholder="`回复${row.userId}:`" v-model="formData.content" showWord maxlength="500" totalWords="500" />
                    </sn-form-item>
                    <sn-form-item label="评论图片" prop="cover">
                        <sn-cropper v-model="formData.cover" :aspectRatio="1/1" size="1M" gifSize="8M" ref="cropper" label="配图" width="250" height="140" />
                    </sn-form-item>
                    <sn-form-item label="设置点赞数" prop="like">
                        <sn-input v-model="formData.like" placeholder="请输入" inputType="number" maxlength="8"/>
                    </sn-form-item>
                </sn-form>
            </div>
        </sn-confirm>
    </div>
</template>
<script>
import DI from 'interface';
import { setTimeout } from 'timers';
export default {
    name:'Reply',
    props:['row', 'title'],
    data(){
        return{
            showDialog:false,//对话框
            formData:{
                account:'0',//默认自动分配
                accountList:[],//马甲库
                content:'',//回复内容
                cover:'',//图片
                like:''//赞
            }
        }
    },
    computed:{
        replyRules(){
            return [
                {
                    required: true,
                    message: '请输入评论内容',
                    trigger: 'change'
                }
            ];
        }
    },
    methods:{
        accountChange(val){
            this.formData.account = val;
        },
        doReply(){
            //校验
            this.$refs.replyForm.validate((isValid,res) =>{
                if(isValid){
                    this.submit();
                }
            })
        },
        submit(){
            let { contentId, contentTitle, contentType, parentCommId } = { contentId: this.row.commTitleId,contentTitle: this.row.commTitle,contentType: this.row.commTitleType,parentCommId:this.row.parentCommId};
            let params = {contentId, contentTitle, contentType, parentCommId };
            if(!parentCommId){//父级评论id为null
                params.parentCommId = this.row.commId;
            }else{
                params.replyCommId = this.row.commId;
                params.replyUserId = this.row.userId;
            }
            params.commContent = this.formData.content;
            if(this.formData.account == 0){//自动分配账号
                params.releaseType = 2;
            }else{//马甲库中的账号
                params.releaseType = 1;
                params.virtualUserId = this.formData.account;
            }
            //父评论id有值时带参,回复id为评论id
            if(this.row.parentCommId){
                params.replyCommId = this.row.commId;
                params.replyUserId = this.row.userId;
            }
            //父评论空时用评论id
            params.parentCommId = this.row.parentCommId == undefined ? this.row.commId : this.row.parentCommId;
            if(this.formData.cover){//有上传图片
                params.commImgList = [];
                let temp = {//图片尺寸及地址
                    imgHeight:this.$refs.cropper.getCropped().height,
                    imgWidth:this.$refs.cropper.getCropped().width,
                    imgUrl:this.formData.cover
                }
                params.commImgList.push(temp);
            }
            this.$ajax({
                url: DI.g_comment.publish,
                context: this,
                loadingText: '',
                data: JSON.stringify(params),
                success: res => {
                    if (res.retCode == "0") {
                        this.$message.success('操作成功');
                        this.closed();
                        setTimeout(()=>{
                        this.$bus.$emit("reload");
                        },1000)
                    } else {
                        this.$message.warning(res.retMsg);
                    }
                },
                error: () => {
                    console.log("error");
                }
            });
        },
        closed(){
            this.showDialog = false;
            this.$refs.replyForm.resetFields();
        },
    },
    mounted(){
        setTimeout(()=>{
            //获取马甲库用户列表
            this.formData.accountList = this.$parent.$parent.$parent.virtualUserList;
        },500);
    }
}
</script>
<style scoped>
#reply {
    button {
        color: #0abbfe;
    }
  .form-content {
    padding: 10px 10px 10px 30px;
  }
}
</style>
<style>
#reply{
    .sn-popup .sn-popup-modal .sn-popup-title{
        font-weight: bolder;
    }
}
</style>

