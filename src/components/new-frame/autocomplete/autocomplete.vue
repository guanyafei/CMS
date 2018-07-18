<template>
  <div class="sn-autocomplete" :style="containerStyle" v-clickoutside="handleClose" @keydown="handleKeydown">
    <div class="sn-autocomplete__search">
      <sn-input
        v-model="searchInput"
        :placeholder="placeholder"
        @compositionstart="handleCompostion"
        @compositionend="handleCompostion"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleChange"
        width="100%"
        ref="input"
      />
    </div>
    <history-list :historyKey="historyKey">
      <span
        class="history-tag"
        v-for="(item,index) in historyList"
        :key="index"
        @click="select(item)"
      >
      <slot :item="item" name="history">
        {{ item[historyKey]}}
      </slot>
      </span>
    </history-list>
    <Suggestions :isSuggestionsPages="isSuggestionsPages">
      <slot name="new" v-if="isNewTagDomShow">
        <li class="sn-suggestions__add">
          <div class="sn-suggestions__btn--add" @click="add">新增标签</div>
          <div>{{`\"${value}\"`}}</div>
        </li>
      </slot>
      <li
        class="sn-suggestions-item"
        v-for="(item, index) in suggestions"
        :key="index"
        @click="select(item)"
      >
        <div style="width:100%;" :class="{'active': activeIndex == index}">
          <slot :item="item">
            {{ item[valueKey] }}
          </slot>
        </div>
      </li>
    </Suggestions>
  </div>
</template>
<script>
import { getHistoryArrData } from 'utils/util';
import emitter from 'mixins/emitter';
import Clickoutside from 'directives/clickoutside';
import debounce from 'src/utils/debounce';
import Suggestions from './suggestions';
import HistoryList from './history-list';

export default {
  name: 'SnAutocomplete',
  componentName: 'SnAutocomplete',
  mixins: [emitter],
  directives: { Clickoutside },
  components: {
    Suggestions,
    HistoryList
  },
  props: {
    historyKey: {
      type: String
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    popperClass: String,
    value: String,
    placeholder: String,
    fetchSuggestions: Function,
    resetFun: {
      type: Function, //搜索栏清空回调
      default: function () {

      }
    },
    addSuggestionsOptions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    isSuggestionsPages: {
      type: Boolean,
      default: false
    },
    isSupportSuggestionsNew: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 300
    },
    pageSize: {
      type: Number,
      default: 10
    },
    immediate: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 350
    },
    resetFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchInput: '',
      activated: false,
      isOnComposition: false,
      suggestions: [],
      scrollLoading: false,
      isFinished: false,
      loading: false,
      pageIndex: 1,
      historyList: [],
      activeIndex: -1
    };
  },
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions;
      let isValidData = Array.isArray(suggestions);
      return (isValidData || this.loading) && this.activated && !this.historyVisible;
    },
    historyVisible() {
      return !this.searchInput && this.activated && this.historyKey;
    },
    containerStyle() {
      return {
        width: `${this.width}px`
      };
    },
    isNewTagDomShow() {
      if (!this.isSupportSuggestionsNew || !this.value) {
        return false;
      }

      let suggestions = this.suggestions;

      for (let i = 0; i < suggestions.length; i++) {
        const suggest = suggestions[i];
        if (suggest[this.valueKey] == this.value) {
          return false;
        }
      }

      return true;
    }
  },
  watch: {
    suggestionVisible(val) {
      this.broadcast('AutocompleteSuggestions', 'visible', [val]);
    },
    historyVisible(val) {
      if (val) {
        this.historyList = getHistoryArrData(this.historyKey);
      }
      this.broadcast('AutocompleteHistoryList', 'visible', [val]);
    }
  },
  mounted() {
    this.debouncedGetData = debounce(val => {
      this.suggestions = [];
      this.getData(val);
    }, this.debounce);
  },
  methods: {
    handleKeydown(e) {
      if (e.keyCode == 38 && this.activeIndex == -1) return;
      if (e.keyCode == 38) {
        this.activeIndex--;
        if (this.activeIndex <= -1) this.activeIndex = 0;
      }
      if (e.keyCode == 40) {
        this.activeIndex++;
        if (this.activeIndex >= this.suggestions.length - 1) this.activeIndex = this.suggestions.length - 1;
      }
      if (e.keyCode == 13 && this.activeIndex >= 0) {
        this.select(this.suggestions[this.activeIndex]);
        this.handleClose();
      }
      let _top = this.suggestions.length && ($('.sn-suggestions-item').eq(this.activeIndex).position().top);
      if (_top <= -5) {
        $('.sn-suggestions-item').eq(this.activeIndex).parent().scrollTop(this.activeIndex * 22);
      }
      if (_top >= 203) {
        $('.sn-suggestions-item').eq(this.activeIndex).parent().scrollTop(this.activeIndex * 22);
      }
    },
    add() {
      this.addSuggestionsOptions(this.value, options => {
        this.suggestions = [...this.suggestions, options];
      });
    },
    handleClose() {
      this.$refs.input && this.$refs.input.$refs.input.blur();
      this.reset();
      this.activeIndex = -1;
    },
    getData(queryString) {
      if (!this.searchInput && this.resetFun) {
        this.resetFun() ;
      }
      if (!queryString && !this.immediate) {
        return;
      }
      let { pageSize, pageIndex } = this;
      this.loading = true;
      this.fetchSuggestions(
        {
          queryString,
          pageSize,
          pageIndex
        },
        suggestions => {
          this.loading = false;
          if (Array.isArray(suggestions)) {
            this.suggestions = [...suggestions];
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        }
      );
    },
    infiniteScrollLoad() {
      if (!this.isSuggestionsPages || !this.activated) {
        return;
      }
      this.loadMore(this.value);
    },
    loadMore(queryString) {
      this.scrollLoading = true;
      if (this.isFinished) {
        setTimeout(() => {
          this.scrollLoading = false;
        }, 300);
        return;
      }
      this.pageIndex += 1;
      let { pageSize, pageIndex } = this;
      this.fetchSuggestions(
        {
          queryString,
          pageSize,
          pageIndex
        },
        suggestions => {
          if (Array.isArray(suggestions)) {
            this.suggestions = [...this.suggestions, ...suggestions];
            if (suggestions.length < this.pageSize) {
              this.isFinished = true;
            }
            if (suggestions.length === 0) {
              this.pageIndex -= 1;
              setTimeout(() => {
                this.scrollLoading = false;
              }, 300);
            } else {
              this.scrollLoading = false;
            }
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        }
      );
    },
    handleCompostion(event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
      } else {
        this.isOnComposition = true;
      }
    },
    handleChange(value) {
      this.activeIndex = -1;
      this.$emit('input', value);
      if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
        this.suggestions = [];
        return;
      }
      this.pageIndex = 1;
      this.isFinished = false;
      this.debouncedGetData(value);
    },
    handleFocus(event) {
      this.activated = true;
      this.$emit('focus', event);
      // if (this.triggerOnFocus) {
      //   this.pageIndex = 1;
      //   this.isFinished = false;
      //   this.debouncedGetData(this.value);
      // }
    },
    handleBlur(event) {
      this.$emit('blur', event);
    },
    select(item) {
      this.$emit('select', item);
      this.reset();
    },
    reset() {
      this.$emit('input', '');
      this.pageIndex = 1;
      this.isFinished = false;
      this.activated = false;
      if (this.resetFlag) {
        this.searchInput = '';
      }
      this.$nextTick(_ => {
        this.suggestions = [];
      });
    },
    setInput(val) {
      this.searchInput = val;
    }
  }
};
</script>

<style>
.sn-autocomplete {
  .active {
    background: #09bbfe;
    padding: 4px 0;
  }
  position: relative;
  .sn-suggestions__add {
    display: flex;
    align-items: center;
    .sn-suggestions__btn--add {
      background: url(../../../assets/icon-add-mini.png) no-repeat;
      padding: 0 10px 0 15px;
      color: #09bbfe;
    }
  }
  .history-tag {
    &:not(:last-child) {
      margin-right: 5px;
    }
    /*background-color: rgba(64, 158, 255, 0.1);*/
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    color: #666;
    border-radius: 50px;
    box-sizing: border-box;
    border: 1px solid #09bbfe;
    white-space: nowrap;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .dropdown-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 35px;
    width: 100%;
    padding: 5px 0;
    margin: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 200px;
    overflow: auto;
    z-index: 88;
  }

  .dropdown-list li {
    height: 22px;
    font-size: 12px;
    color: #242600;
    line-height: 22px;
    padding-left: 10px;
    text-align: left;
    display: flex;
    align-items: center;
  }

  .dropdown-list li:hover {
    background: #f6fdff;
    cursor: pointer;
  }
}
</style>

