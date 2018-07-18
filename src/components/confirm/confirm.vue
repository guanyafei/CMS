<template>
  <section class="sn-popup" v-show="flag">
    <div class="sn-popup-modal">
      <div class="sn-popup-close" v-if="closeIcon" @click="hide"></div>
      <p class="sn-popup-title">
        {{ title }}
      </p>
      <div :class="['sn-popup-content',{'is-scroll':isContentScrolled}]" ref="content">
        <p class="sn-popup-txt" v-if="txt">
          <slot></slot>
        </p>
        <slot v-else></slot>
      </div>
      <div class="confirm-body" v-if="type">
        <span :class="['confirm-icon', `confirm-${type}-icon`]"></span>
        <span>
          <slot name="confirm-txt">确定删除该条数据~</slot>
        </span>
      </div>
      <slot name='btn-group'>
        <div class="sn-popup-btns">
          <sn-button size="mini" v-if="sureBtnIsShow" type="primary" @click="sure">{{ confirmButtonText }}</sn-button>
          <sn-button size="mini" @click="hide" v-show="!hideCancelButton">{{ cancelButtonText }}</sn-button>
        </div>
      </slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    flag: {
      type: Boolean,
      default: true
    },
    noflag: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    sureBtnIsShow: {
      type: Boolean,
      default: true
    },
    closeIcon: Boolean,
    txt: Boolean,
    type: String,
    hideCancelButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isContentScrolled: false
    }
  },
  watch: {
    flag (val) {
      $('body').css('overflow', val ? 'hidden' : 'visible');
    }
  },
  mounted () {
    this.setContentScroll();
    this.delScroll();
  },
  beforeUpdate () {
    this.delScroll();
  },
  updated () {
    this.setContentScroll();
  },
  beforeDestroy () {
    this.delScroll();
  },
  methods: {
    sure () {
      this.$emit('sure')
    },
    hide () {
      this.$emit('close')
    },
    setContentScroll () {
      if (!this.$refs.content) {
        return ;
      }
      const contentHeight = this.$refs.content.offsetHeight;
      if (contentHeight > 400 && !this.isContentScrolled) {
        this.isContentScrolled = true;
      }
      if (contentHeight < 400 && this.isContentScrolled) {
        this.isContentScrolled = false;
      }
    },
    delScroll () {
      const $this = $(".sn-popup");
      if (!$this) {
        return ;
      }
      let bodyStyle = document.querySelector('body').style;

      if (this.noflag) {
        if ($this && $this.is(':visible') && bodyStyle.overflow != 'hidden') {
          this.$bus.bodyScrollTop = document.body.scrollTop;
          bodyStyle.overflow = 'hidden';
        }
        if ((!$this || ($this && !$this.is(':visible'))) && bodyStyle.overflow == 'hidden') {
          bodyStyle.overflow = '';
          document.body.scrollTop = this.$bus.bodyScrollTop;
        }
      } else {
        if (this.flag && $this.is(':visible')) {
          $('body').css('overflow', 'hidden');
        }
        if (!(this.flag || $this.is(':visible'))) {
          $('body').css('overflow', '');
        }
      }
    }
  }
}
</script>

<style scoped>
.sn-popup {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);

  .sn-popup-modal {
    position: relative;
    min-width: 300px;
    max-height: 680px;
    padding-bottom: 20px;
    border-radius: 4px;
    overflow-y: visible;
    font-size: 16px;
    background-color: #fff;
    .sn-popup-close {
      right: 12px;
      top: 14px;
      position: absolute;
      width: 30px;
      height: 20px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: 59%;
      background-position: center;
      background-image: url(../../assets/icon-close.png);
    }
    .sn-popup-title {
      height: 50px;
      border-bottom: 1px solid #f0f1f5;
      text-align: center;
      font-size: 16px;
      line-height: 50px;
      color: #4a515b;
    }
    .sn-popup-content {
      &.is-scroll {
        max-height: 400px;
        overflow: auto;
      }
    }
    .sn-popup-txt {
      padding: 20px 40px 0;
      text-align: center;
    }
    .sn-popup-btns {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      button {
        margin: 0 20px;
      }
    }
    .confirm-body {
      width: 384px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0px 30px;
      .confirm-icon {
        width: 100%;
        height: 56px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 15%;
        margin-bottom: 16px;
        &.confirm-del-icon {
          background-image: url(../../assets/icon-trash.png);
        }
      }
    }
  }
}
</style>
