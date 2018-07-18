<template>
  <sn-confirm 
    ref="typeLink"
    title="添加链接"
    @sure="doAddTypeLink"
    @close="close"
    close-icon
    v-show="viewType==='typeLink'"
    confirmButtonText="添加"
    noflag>
    <div class="modal-body" :style="{ width: '500px'}">
      <sn-form :model='linkRuleForm' ref='linkRuleForm' label-width='90px'>
        <link-text :ruleForm='linkRuleForm' ref="linkText" title="展示文字"></link-text>
        <link-jump :ruleForm='linkRuleForm' ref="linkJump"></link-jump>
      </sn-form>
    </div>
  </sn-confirm>
</template>

<script>
import LinkText from 'widgets/infoCommon/infoEditDetails/elements/linkText';
import LinkJump from 'widgets/infoCommon/infoEditDetails/elements/linkJump';
export default {
  name: 'typeLink',
  components: {
    LinkText,
    LinkJump
  },
  props: {
    'viewType': [String, Object]
  },
  data () {
    return {
      linkRuleForm: {
        linkText: '',
        link: '',
        linkType: 'inter' // defaut 内部页面
      }
    }
  },
  watch: {
    viewType (newValue) {
      if (newValue === 'typeLink') {
        this.reset();
      }
    }
  },
  methods: {
    doAddTypeLink() {
      let self = this;
      this.$refs.linkRuleForm.validate(valid => {
        if (valid) {
          let { linkText, link } = self.linkRuleForm;
          self.$emit('sure', linkText, self.addTypeInLink(link));
          self.close();
        }
      });
    },
    addTypeInLink(url) {
      let linkType = this.$refs.linkJump.typeItem.value;
      if (/\?/g.test(url)) {
        url += '&snsisLinkType=' + linkType;
      } else {
        url += '?snsisLinkType=' + linkType;
      }
      return url;
    },
    close () {
      this.$emit('close');
    },
    reset () {
      this.linkRuleForm = {
        linkText: '',
        link: '',
        linkType: 'inter' // defaut 内部页面
      };
      this.$refs.linkText.vaildTrigger(true);
      this.$refs.linkJump.vaildTrigger(true);
    }
  }
}
</script>

<style scoped>

</style>
