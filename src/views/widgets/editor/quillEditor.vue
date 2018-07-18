<template>
  <div class="quill-editor" ref="wrapper">
    <div class="quill-editor__text" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <div :class="['quill-editor__container', {'is-fixed':isBarFixed}]" ref="container">
      <div :class="['quill-editor__toolbar', `quill-editor-toolbar__${editorCount}`]" ref="toolbar" :style="barStyle">
        <span class="ql-formats">
          <button class="ql-bold" title="加粗">Bold</button>
          <select class="ql-color" title="颜色"></select>
          <button class="ql-header" value="1" title="段落标题"></button>
          <button class="ql-blockquote" title="引用"></button>
          <button class="ql-divider" title="分割线"></button>
          <button class="ql-list" value="bullet" title="无序列表"></button>
          <button class="ql-list" value="ordered" title="有序列表"></button>
        </span>
        <span class="ql-formats ql-align__groups">
          <button class="ql-align" value="" title="左对齐"></button>
          <button class="ql-align" value="center" title="居中对齐"></button>
        </span>
        <slot name="toolbar"></slot>
      </div>
      <div ref="editor" :style="contentStyle"></div>
    </div>
    <slot name="vote"></slot>
  </div>
</template>

<script>
import Quill from 'quill';
import emitter from 'mixins/emitter';
import throttle from 'src/utils/throttle';

import Link from './extends/link';
import BlockBlot from './extends/block';
import { DataURLAttribute, DataRouterAttribute } from './extends/custom-attrs';
import { Goods } from './extends/goods';
import { Match } from './extends/match';
import DividerBlot from './extends/divider';
import { LayoutRow, ImgWithCaption, Caption } from './extends/custom-img';

Quill.register(
  {
    'attributors/attribute/data-url': DataURLAttribute,
    'attributors/attribute/data-router': DataRouterAttribute,
    'blots/block': BlockBlot,
    'blots/Caption': Caption,
    'blots/ImgWithCaption': ImgWithCaption,
    'blots/LayoutRow': LayoutRow,
    'formats/link': Link,
    'formats/divider': DividerBlot,
    'formats/goods': Goods,
    'formats/match': Match
  },
  true
);

export default {
  name: 'QuillEditor',
  componentName: 'QuillEditor',
  mixins: [emitter],
  props: {
    value: String,
    disabled: Boolean,
    validateEvent: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 400
    },
    options: {
      type: Object,
      required: false,
      default: function() {
        return {};
      }
    }
  },
  data() {
    if (window.editorCount) {
      window.editorCount++;
    } else {
      window.editorCount = 1;
    }
    return {
      editorCount: window.editorCount,
      _content: this.value,
      defaultModules: {
        toolbar: `.quill-editor-toolbar__${window.editorCount}`
      },
      editorStyle: {
        height: '400px'
      },
      isBarFixed: false,
      imgList: []
    };
  },
  computed: {
    contentHeight() {
      if (this.fullScreen) {
        return document.documentElement.clientHeight - 42;
      }
      return this.height;
    },
    contentStyle() {
      return {
        height: this.contentHeight + 'px'
      };
    },
    tarTop() {
      if (this.scrollEventTarget && this.scrollEventTarget.getBoundingClientRect) {
        return this.scrollEventTarget.getBoundingClientRect().top;
      }
      return 0;
    },
    barStyle() {
      if (this.isBarFixed) {
        let containerWidth = this.$refs.wrapper.clientWidth;
        return {
          position: 'fixed',
          top: this.tarTop ? `${this.tarTop}px` : 0,
          width: `${containerWidth}px`,
          zIndex: 2
        };
      } else {
        return null;
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this._content) {
          this._content = newVal;
          this.quill.root.innerHTML = this._content;
        } else if (!newVal) {
          this.quill.setText('');
        }
      }
    },
    disabled: function(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal);
      }
    }
  },
  mounted() {
    this.initialize();
  },
  beforeDestroy() {
    this.unmounted = true;
    this.quill = null;
  },
  methods: {
    initialize() {
      if (this.$el) {
        // options and instance
        let self = this;
        self.options.theme = self.options.theme || 'snow';
        self.options.boundary = self.options.boundary || document.body;
        self.options.modules = self.options.modules || self.defaultModules;
        self.options.modules.toolbar =
          self.options.modules.toolbar !== undefined ? self.options.modules.toolbar : self.defaultModules.toolbar;
        self.options.placeholder = self.options.placeholder || 'Insert text here ...';
        self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false;
        self.quill = new Quill(self.$refs.editor, self.options);
        // self coustom format
        self.addCustomFormat();
        // set editor content
        if (self.value || self.content) {
          let value = (self.value || self.content).replace(/'/g, '"');
          self.quill.root.innerHTML = value;
          // self.quill.clipboard.dangerouslyPasteHTML(value);
        }
        // console.log(Quill.imports)
        // mark model as touched if editor lost focus
        self.quill.on('selection-change', (range, oldRange, source) => {
          if (!range) {
            self.$emit('blur', self.quill);
          } else {
            self.$emit('focus', self.quill);
          }
        });

        // update model if text changes
        self.quill.on('text-change', (delta, oldDelta, source) => {
          this.bindImageEvent(oldDelta);
          let html = self.quill.root.innerHTML;
          let text = self.quill.getText();
          if (html === '<p><br></p>') html = '';
          self._content = html;
          self.$emit('input', html);
          self.$emit('change', {
            editor: self.quill,
            html: html,
            text: text
          });
          this.$nextTick(() => {
            if (this.validateEvent) {
              this.dispatch('FormItem', 'form.change', [html]);
            }
          });
        });

        // disabled
        if (this.disabled) {
          this.quill.enable(false);
        }

        // 监听滑动
        self.bindWindowScroll();

        // emit ready
        self.$emit('ready', self.quill);
      }
    },
    addCustomFormat() {
      let toolbar = this.quill.getModule('toolbar');
      toolbar.addHandler('divider', this.handleDividerClick);
    },
    handleDividerClick() {
      let { quill } = this;
      let range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'divider', true);
      quill.setSelection(range.index + 1, Quill.sources.SILENT);
    },
    bindWindowScroll() {
      let self = this;
      let $container = self.$refs.container;
      this.scrollEventTarget = this.getScrollEventTarget($container);
      this.scrollEventTarget.addEventListener(
        'scroll',
        throttle(event => {
          if (this.unmounted) {
            return;
          }

          let barTop = $container.getBoundingClientRect().top - self.tarTop;
          let editorBottom = $container.getBoundingClientRect().bottom - self.tarTop;
          let barHeight = this.$refs.toolbar.clientHeight;

          if (self.isBarFixed) {
            if (editorBottom < barHeight) {
              self.isBarFixed = false;
              self.$nextTick(() => {
                if (self.scrollEventTarget.getBoundingClientRect) {
                  self.scrollEventTarget.scrollTop += barHeight;
                } else {
                  document.body.scrollTop += barHeight;
                }
              });
            }
            if (barTop === 0 || barTop > 0) {
              self.isBarFixed = false;
            }
          } else {
            if (barTop < 0 && editorBottom > barHeight) {
              if (editorBottom > barHeight) {
                if (self.scrollEventTarget.getBoundingClientRect) {
                  self.scrollEventTarget.scrollTop -= barHeight;
                } else {
                  document.body.scrollTop -= barHeight;
                }
              }
              self.$nextTick(() => {
                self.isBarFixed = true;
              });
            }
          }
        }, 200),
        false
      );
    },
    getScrollEventTarget(element) {
      let currentNode = element.parentNode;
      // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
      while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        let overflowY = getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    },
    bindImageEvent(oldDelta) {
      let imgList = [];
      let prevImgsNum = 0;
      const imgNodes = this.quill.root.querySelectorAll('img:not(.goods-img)');

      Array.from(imgNodes).forEach((img, index) => {
        let imgSrc = img.getAttribute('src');
        imgSrc && imgList.push(imgSrc);
      });

      oldDelta.map(item => {
        if (item.insert['img-with-caption']) {
          prevImgsNum++;
        }
      });
      console.log(prevImgsNum, imgNodes.length);
      if (imgNodes.length !== prevImgsNum) {
        this.$bus.$emit('editor-imgList-change', imgList, this.editorCount);
      }
    }
  }
};
</script>

<style>
@import url(quill/dist/quill.snow.css);
.quill-editor {
  max-width: 772px;
}

.quill-editor {
  margin-top: 6px;
  .quill-editor__text {
    margin-bottom: 15px;
    font-size: 14px;
    color: #a8adbc;
    line-height: 16px;
  }
  .quill-editor__container {
    border: 1px solid #c9d0e1;
    border-radius: 4px;
    background: #ffffff;
    .ql-toolbar.ql-snow {
      display: flex;
      align-items: center;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: none;
      background-color: #eceef4;

      .ql-formats {
        padding: 0 7px;
        margin: 0;

        &.ql-align__groups {
          border-left: 1px solid #a1a1a1;
          border-right: 1px solid #a1a1a1;
        }
      }
      .ql-divider {
        transform: translateY(9%);
        background-size: 65%;
        background-repeat: no-repeat;
        background-position-x: 5px;
        background-image: url('../../../assets/icon-divider.png');
        &:hover {
          background-image: url('../../../assets/icon-divider-hover.png');
        }
      }
      .ql-goods {
        transform: translateY(9%);
        background-size: 65%;
        background-repeat: no-repeat;
        background-position-x: 5px;
        background-image: url('../../../assets/icon-goods.png');
        &:hover {
          background-image: url('../../../assets/icon-goods-hover.png');
        }
      }
      .ql_vote {
        transform: translateY(9%);
        background-size: 65%;
        background-repeat: no-repeat;
        background-position-x: 5px;
        background-image: url('../../../assets/icon-vote.png');
        &:hover {
          background-image: url('../../../assets/icon-vote-hover.png');
        }
      }
      .editor__button {
        background-position: 7px;
        background-repeat: no-repeat;
        &.editor__button--link {
          background-image: url('../../../assets/icon-article.png');
          &:hover {
            background-image: url('../../../assets/icon-article-hover.png');
          }
        }
        &.editor__button--match {
          background-image: url('../../../assets/icon-match.png');
          &:hover {
            background-image: url('../../../assets/icon-match-hover.png');
          }
        }
      }
    }
    .ql-container.ql-snow {
      height: 500px;
      border: 0;
      h1 {
        padding-left: 12px;
        font-weight: 700;
        line-height: 24px;
        font-size: 18px;
        border-left: 4px solid #0398ff;
      }
      img {
        max-width: 100%;
        display: block;
        clear: both;
        margin: 0 auto;
        margin-bottom: 10px;
      }
      p {
        margin: 8px 0;
        line-height: 16px;
      }
      hr {
        margin: 1.5em 0;
        border: 1px solid #e9e9e9;
        border-width: 1px 0 0;
      }
      blockquote {
        margin: 10px 0;
        border-left: 0;
        padding: 12px 8px;
        line-height: 1.4;
        color: #999;
        background-color: #f3f4f5;
      }
      .sn-divider {
        overflow: hidden;
        &:hover {
          cursor: default;
          -webkit-box-shadow: 0 0 0 2px rgba(15, 136, 235, 0.3);
          box-shadow: 0 0 0 2px rgba(15, 136, 235, 0.3);
        }
      }
      .match,
      .match .match-info,
      .match .match-time,
      .match .match-teams,
      .match .home-team,
      .match .guest-team {
        display: flex;
      }
      .match {
        align-items: center;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        &:last-of-type {
          box-shadow: 0 2px 4px 0 rgba(212, 212, 212, 0.5);
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          margin-bottom: 16px;
        }
        .match-info {
          width: 100%;
        }
        .match-time {
          flex-direction: column;
          justify-content: center;
          padding: 10px 20px;
        }
        .match-teams {
          flex-direction: column;
          justify-content: center;
          margin-left: 120px;
          .home-team,
          .guest-team {
            align-items: center;
          }
          .text {
            font-size: 20px;
          }
          .clash {
            display: flex;
            align-items: center;
          }
          .clash .clash-text {
            font-size: 20px;
            color: #333333;
            letter-spacing: 0;
            overflow: hidden;
            margin-left: 3px;
            max-width: 220px;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .time {
          margin: 0;
          color: #303030;
          font-size: 16px;
          font-weight: 100;
          letter-spacing: 0;
        }
        .round {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: #999;
          text-align: left;
        }
        .logo {
          width: 40px;
          height: 40px;
          display: inline-block;
          margin-right: 10px;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .match-link {
          width: 17px;
          height: 17px;
          border-top: 2px solid #726f6f;
          border-right: 2px solid #726f6f;
          transform: rotate(45deg);
          margin-right: 20px;
        }
      }
      .editor-goods {
        height: 120px;
        margin: 10px 40px;
        display: flex;
        align-items: center;
        font-size: 16px;
        background-color: #f6fcff;
        text-decoration: none;
        &:hover {
          cursor: default;
          -webkit-box-shadow: 0 0 0 2px rgba(15, 136, 235, 0.3);
          box-shadow: 0 0 0 2px rgba(15, 136, 235, 0.3);
        }
        img {
          width: 130px;
          height: 100px;
          margin: 0;
        }
        .goods-info {
          width: 80%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          .goods-info__name {
            color: #333;
            font-weight: 700;
          }
          .goods-info__self {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .goods-info__self--price {
              &.no-price {
                color: #bbbbbb;
              }
              color: #f47b77;
              font-size: 16px;
              font-weight: 700;
            }
            .goods-info__self--btn {
              padding: 10px 20px;
              color: #fff;
              font-size: 16px;
              border-radius: 4px;
              background: #f47b77;
            }
          }
        }
      }
      .pgc-img-caption {
        min-height: 16px;
        margin-top: -6px;
        text-align: center;
        outline: none;
        color: #999;
        font-size: 9px;
      }
      .pgc-img-caption:not(.has-caption)::before {
        color: rgba(0, 0, 0, 0.6);
        content: attr(data-placeholder);
        font-style: italic;
        pointer-events: none;
      }
      .layoutRow {
        img {
          width: 200px;
          height: 100px;
          display: block;
          background: #ccc;
        }
      }
    }
  }
}
</style>
