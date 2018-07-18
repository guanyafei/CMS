<template>
    <div class="comment-cell">
        <p @click="showComment(row)">真实评论：{{row.realCommentNum || '0' }}</p>
        <p @click="showComment(row)">填充评论：{{row.guideCommentNum || '0'}}</p>
    </div>
</template>
<script>
export default {
    name:'commentCell',
    props:{
        row:{
            type:Object
        }
    },
    data(){
        return {

        }
    },
    methods:{
        //跳转至评论列表
        showComment(row){
            row.contentId = row.newsId + '';
            row.contentType = 1;
            row.authId = row.authorId;
            this.$parent.$parent.$parent.rowContent = row;//传递评论引导
            this.$parent.$parent.$parent.commentShow = true;//展示评论
            this.$parent.$parent.$parent.ListShow = false;//隐藏列表
        }
    }
}
</script>
<style scoped>
div.comment-cell{
    padding: 5px;
    p{
        color:#09bbfe;
        text-align:left;
        cursor: pointer;
    }
    p:first-child{
        margin-bottom: 10px;
    }
}
</style>

