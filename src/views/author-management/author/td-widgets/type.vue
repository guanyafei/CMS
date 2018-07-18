<template>
  <div class='td'>
    <div class="name is-line is-column" @click.stop='toggleDropMenu' v-clickoutside="handleClose">
      <span>
        {{name}}
      </span>
    </div>
    <div v-show="showDropDown">
      <ul class="dropdown-list">
        <li v-for='author in authorList' :key='author.key' :title="author.name" @click.stop='activeType(author.value)'>{{author.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import Clickoutside from 'directives/clickoutside';
export default {
  name: 'td-author-type',
  directives: { Clickoutside },
  props: ['data','typeFlag','types'],
  data() {
    return {
      authorList: this.typeFlag,
      showDropDown: false
    };
  },
  computed: {
    name() {
      if (this.data) {
        let _name = this.getAuthorItem(this.data.authorType).name;
        return _name;
      } else {
        let _name = this.getAuthorItem(this.types).name;
        return _name;
      }
    }
  },
  methods: {
    getAuthorItem(val) {
      return Constant.getItemByValue(this.authorList, val);
    },
    toggleDropMenu() {
      this.showDropDown = !this.showDropDown;
    },
    handleClose() {
      this.showDropDown = false;
    },
    activeType(val) {
      if (this.data && this.data.authorType) {
        this.data.authorType = val;
      } else {
        this.types = val;
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style scoped>
.name:hover {
  cursor: pointer;
  span {
    position: relative;
    &:after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-width: 8px 5px 0px;
      border-style: solid;
      border-color: #09bbfe transparent transparent;
      position: absolute;
      top: 3px;
      right: -14px;
    }
  }
}

.td,
.name{
  width: 100%;
  height: 100%;
}

.is-line {
  justify-content: center;
}

.dropdown-list {
  position: absolute;
  top: 48px;
  left: 0px;
  right: 18px;
  box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  z-index: 99999;
  padding: 5px 0;
  li {
    &:hover{
      background-color: #e4e8f1;
    }
    &+li:before {
      content: '';
      display: inline-block;
      width: 80%;
      position: absolute;
      top: 0px;
      left: 10px;
      border-top: 1px solid #f5f5f5;
    }
    font-size: 14px;
    padding: 10px 15px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #48576a;
    line-height: 1;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
