<template>
  <sn-form-item label="资讯作者" prop="authorId" :rules="authorRules">
    <sn-select v-model="value"
      :name="name"
      width="521"
      ref="roundSelect"
      placeholder="请选择"
      @change="authorSelectChange"
    >
      <template v-if="!duringAjax && authorList.length!==0">
        <sn-option value= "" name="请选择"></sn-option>
        <sn-option
          v-for="item in authorList"
          :key="item.authorId"
          :name="item.authorName"
          :value="''+item.authorId"
        >
        </sn-option>
      </template>
      <div v-if="authorList.length==0" class="text-center">暂无数据</div>
    </sn-select>
  </sn-form-item>
</template>
<script>
import DI from 'interface'
export default {
  name: 'InfoAuthor',
  componentName: 'InfoAuthor',
  props: ['ruleForm', 'value'],
  data () {
    return {
      authorList: this.ruleForm.authorList,
      authorRules: [{
        required: true,
        message: `请选择资讯作者`,
        trigger: 'change'
      }]
    }
  },
  methods: {
    authorSelectChange(val) {
      this.$emit('input', val);
    }
  }
}
</script>

<style scoped>

</style>
