<template>
  <sn-input
    v-model="contentId"
    :placeholder="`请输入${typeConstantItem.name}`"
    @focus="handleFocus"
    width="430"
  >
  </sn-input>
</template>

<script>
import debounce from 'src/utils/debounce'
import DI from 'interface'

export default {
  name: 'IdInput',
  props: ['row', 'id', 'typeConstantItem'],
  computed: {
    contentId: {
      get () {
        return this.id;
      },
      set (newValue) {
        this.$emit('update:id', newValue);
      }
    },
    typeKey () {
      return this.typeConstantItem.key;
    },
    queryContentKey () {
      const maps = {
        'info': 'title',
        'video': 'title',
        'program': 'matchitemShowName',
        'comment': 'commContent',
      }
      return maps[this.typeKey];
    }
  },
  watch: {
    contentId (newValue) {
      this.queryInfo(newValue);
    }
  },
  methods: {
    handleFocus (event) {
      this.queryInfo(event.target.value);
    },
    queryInfo: debounce(function (val) {
      this.queryInfoByContentId(val);
    }, 500),
    queryInfoByContentId (id) {
      if (!id) {
        return;
      }
      const { typeKey } = this;
      let url, params, ajaxType = "post";

      switch (typeKey) {
        case 'info':
          url = DI.channel.getNewsInfo;
          params = {
            newsId: parseInt(id)
          };
          break;

        case 'video':
          url = DI.channel.queryVideoDetail + '?videoId=' + id;
          params = {
            videoId: id
          };
          ajaxType = "get";
          break;

        case 'program':
          url = DI.reptileCommentManagement.queryProgramInfo;
          params = {
            matchitemShowId: parseInt(id)
          };
          break;

        case 'comment':
          url = DI.reptileCommentManagement.queryCommentById;
          params = {
            commId: id
          };
          break;
        default:
          break;
      }

      this.$ajax({
        url: url,
        data: JSON.stringify(params),
        type: ajaxType,
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            const data = res.data || {};

            let queryContent = data[this.queryContentKey];

            if (queryContent) {
              this.row[this.typeKey === 'comment' ? 'content' : 'contentTitle'] = queryContent;
              if (this.typeKey === 'comment') {
                this.row.contentTitle = data.commTitle;
                this.row.commTitleType = data.commTitleType;
                this.row.commTitleId = data.commTitleId;
              }
            } else {
              this.$parent.vaildTrigger(false, '未查询到相关内容');
            }
          } else {
            this.row.commTitle = '';
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
</script>
