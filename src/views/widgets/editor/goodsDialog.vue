<template>
  <sn-confirm title="添加商品" @sure="sure" @close="close" close-icon v-show="viewType==='goods'" confirmButtonText="添加" noflag>
    <div class="modal-body">
      <sn-input
        placeholder="请输入易购商品链接"
        v-model="link"
        ref="searchInput"
        width="431"
        :reg='inputReg'
        required
        autoValid>
        <sn-button slot="append" type="primary" :circle="false" @click="getGoodsMeta">查询</sn-button>
      </sn-input>
      <div class="goods-input__caption">
        <div class="goods-caption__title">支持格式：</div>
        <div class="goods-caption__txt">
          <p>http://product.suning.com/商品编码/商品编码.html的PC端链接</p>
          <p>http://m.suning.com/product/商品编码/商品编码.html的WAP端链接</p>
        </div>
      </div>
      <div class="goods-meta__wrapper">
        <div class="goods-meta--null" v-if="isNullmeta">
          <img class="goods-meta__inner--null" src="../../../assets/icon-blank01.png"/>
          <div class="goods-meta__txt--null">未查询到相关商品</div>
        </div>
        <div class="goods-meta__container" v-if="meta.title && !isNullmeta">
          <div class="goods-meta__item goods-meta__title">
            <div class="goods-item__label">商品名称：</div>
            <div class="goods-item__inner">{{ meta.title }}</div>
          </div>
          <div class="goods-meta__item goods-meta__price">
            <div class="goods-item__label">商品价格：</div>
            <div :class="['goods-item__inner', 'goods-price__txt', {
              'is-color':isColorPrice
            }]">{{ meta.price }}</div>
          </div>
          <div class="goods-meta__item goods-img__wrapper" v-if="!disImg">
            <div class="goods-item__label">商品图片：</div>
            <div class="goods-item__inner">
              <sn-radio-group v-model="isLocalImg" class="goods-radio-group">
                <sn-radio :label="false">默认图片</sn-radio>
                <sn-radio :label="true">本地图片</sn-radio>
              </sn-radio-group>
            </div>
          </div>
          <div class="goods-meta__item" v-if="!disImg">
            <div class="goods-img__local" v-if="isLocalImg">
              <sn-cropper
                v-model="selectedImg.url"
                ref="cropper"
                label="商品图片"
                size="1M"
                :aspectRatio="4 / 3"
                noGif>
                <div class="goods-img__loaded" v-if="selectedImg.url">
                  <div class="goods-img__inner">
                    <img :src="selectedImg.url" alt="">
                    <sn-button type="text" class="goods-img__reload" @click="addUploadHandler">重新上传</sn-button>
                  </div>
                </div>
                <div class="goods-img__upload" @click="addUploadHandler" v-else>
                  <span class="goods-upload__txt">点击上传文件</span>
                  <i class="goods-upload__icon"></i>
                </div>
              </sn-cropper>
            </div>
            <ul class="goods-img__list" v-else>
              <template v-if="meta.imgList && meta.imgList.length !== this.countErrorImg">
                <li :class="['goods-img__item', {'is-selectd':img===selectedImg}]"
                  v-for="(img, index) in (meta.imgList ? meta.imgList : [])"
                  :key="index"
                  @click="selectedImg=img">
                  <img :src="img.url" alt="" @error="imgError">
                </li>
              </template>
              <li v-else class="goods-img--null">
                <div class="goods-img__inner--null"></div>
                <div class="goods-img__txt--null">暂无默认图片</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </sn-confirm>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { getProductPriceUrl, getProductImgsUrl } from 'src/utils/envUrl';

const LASTCODE_LENGTH = 18;
const TEN_ZERO = '0000000000';
const ACCESS_URL = 'http://m.suning.com/product/';
const defaults = {
  link: '',
  meta: {
    title: '',
    price: '',
    bizCode: '',
    cmmdtyCode: '',
    imgList: null
  },
  isColorPrice: false,
  isNullmeta: false,
  isLocalImg: false,
  selectedImg: {
    url: null
  }
};

export default {
  name: 'GoodsDialog',
  props: {
    'viewType': [String, Object],
    'disImg': {
      type: Boolean,
      default: false
    },
    countErrorImg: 0
  },
  data () {
    return {
      inputReg: /^(https?:\/\/(product\.suning\.com|m\.suning\.com\/product))?\/(\d+)\/(\d+)(\.html?(\?.+)?)?$/,
      ...defaults
    };
  },
  watch: {
    isLocalImg () {
      this.selectedImg = {
        url: null
      };
    }
  },
  methods: {
    getGoodsMeta () {
      this.meta = { ...defaults.meta };
      this.countErrorImg = 0;
      if (this.link == '') {
        this.$refs.searchInput && this.$refs.searchInput.setMsg('不能为空');
        return;
      }
      if (!this.$refs.searchInput.check()) {
        return;
      }
      let self = this;
      let { bizCode, cmmdtyCode, originLastCode } = this.getGoodsCodes();
      let priceUrl = getProductPriceUrl(bizCode, cmmdtyCode);
      let imgUrl = getProductImgsUrl(bizCode, cmmdtyCode);
      this.fetchGoodsImgList(cmmdtyCode, imgUrl).then((content) => {
        self.isNullmeta = false;
        self.meta.linkUrl = self.link;
        if (cmmdtyCode !== originLastCode) {
          self.meta.linkUrl = self.meta.linkUrl.replace(this.inputReg, function (re, $1, $2, $3, $4, $5) {
            return $1 + '/' + $3 + '/' + cmmdtyCode + $5;
          })
        }
        self.meta.title = content.itemName;
        self.meta.bizCode = bizCode;
        self.meta.cmmdtyCode = cmmdtyCode;
        self.setImgList(imgUrl, content.imageCount);
        self.setPrice(priceUrl, bizCode, cmmdtyCode);
      }).catch((err) => {
        if (typeof err === "boolean") {
          this.meta = { ...defaults.meta };
          this.isNullmeta = true;
        } else {
          this.meta = defaults.meta;
          this.isNullmeta = false;
          this.$message.error(err);
        }
      })
    },
    setPrice (priceUrl, bizCode, cmmdtyCode) {
      let self = this;
      this.fetchGoodsPrice(priceUrl, bizCode).then((value) => {
        self.meta.price = value;
      }).catch((err) => {
        if (err === 'refetch') {
          priceUrl = getProductPriceUrl(TEN_ZERO, cmmdtyCode);
          self.setPrice(priceUrl, TEN_ZERO);
        } else {
          this.$message.error(err);
        }
      })
    },
    fetchGoodsImgList (cmmdtyCode, imgUrl) {
      // https://product.suning.com/0000000000/000000000140028078.html
      return new Promise((resolve, reject) => {
        this.$ajax({
          url: DI.common.queryGoodsInfo,
          loadingText: '正在查询商品信息，请稍候！',
          context: this,
          contentType: 'application/json',
          data: JSON.stringify({ productCode: cmmdtyCode }),
          success: (data) => {
            if (data.retCode == 0 && data.data.errCode == 0) {
              let result = data.data;
              resolve(result);
            } else {
              if (data.retCode == 0) {
                reject(true);
              } else {
                reject('查询商品信息失败');
              }
            };
          },
          error: (err) => {
            reject('网络错误');
          }
        });
      })
    },
    setImgList (baseUrl, num) {
      let self = this;
      this.meta.imgList = [];
      while (num) {
        let imgSrc = `${baseUrl}_${num}.jpg`;
        self.meta.imgList.unshift({
          url: imgSrc
        });
        num--;
      }
    },
    fetchGoodsPrice (priceUrl, bizCode) {
      let self = this;
      return new Promise((resolve, reject) => {
        this.$ajax({
          url: priceUrl,
          context: this,
          noBaseUrl: true,
          dataType: 'jsonp',
          loadingText: '正在查询商品价格，请稍候！',
          type: 'GET',
          jsonp: 'callback',
          jsonpCallback: 'callback',
          success: (data) => {
            if (data.length) {
              let price = '';
              if (Constant.getItemByValue(Constant.GOODS_STATUS, data[0].status).key === 'unsell') {
                if (bizCode !== TEN_ZERO) {
                  reject('refetch');
                } else {
                  this.isColorPrice = false;
                  price = '暂不销售';
                  resolve(price);
                }
              } else {
                this.isColorPrice = true;
                price = `￥${data[0].price || '暂不销售'}`;
                resolve(price);
              }
            } else {
              reject('查询商品价格失败');
            }
          },
          error: (err) => {
            reject('网络错误');
          }
        })
      });
    },
    getGoodsCodes () {
      let bizCode = '', cmmdtyCode = '', originLastCode = '';
      if (this.inputReg.test(this.link)) {
        originLastCode = RegExp.$4;
        bizCode = RegExp.$3;
        cmmdtyCode = originLastCode.padStart(LASTCODE_LENGTH, '0');
      }
      return { bizCode, cmmdtyCode, originLastCode };
    },
    replaceLinkUrl (url) {
      return url.replace('product.suning.com', 'm.suning.com/product');
    },
    addUploadHandler () {
      this.$refs.cropper.addClickHandler();
    },
    imgError () {
      this.countErrorImg++;
    },
    sure () {
      if (!this.meta.title) {
        this.$message.error('未查询出要添加商品信息');
        return;
      }
      if (!this.meta.price) {
        this.$message.error('商品价格有误');
        return;
      }
      if (!this.disImg) {
        if (!this.selectedImg || !this.selectedImg.url) {
          if (!this.meta.imgList || this.meta.imgList.length === this.countErrorImg) {
            this.$message.error('暂无默认图片，请上传本地图片');
            return;
          }
          this.$message.error('图片未选中');
          return;
        }
      }
      const symbol = this.link.indexOf('?') > -1 ? '&' : '?';
      let transData = {};
      let finalUrl = this.replaceLinkUrl(this.meta.linkUrl);
      if (!this.disImg) {
        transData = {
          url: finalUrl + symbol + 'snsisLinkType=8',
          src: this.selectedImg.url,
          title: this.meta.title,
          price: this.meta.price
        }
      } else {
        transData = {
          proName: this.meta.title,
          proPrice: this.meta.price,
          proUrl: finalUrl,
          bizCode: this.meta.bizCode,
          cmmdtyCode: this.meta.cmmdtyCode
        }
      }
      this.close();
      this.$emit('sure', transData);
    },
    close () {
      this.reset();
      this.$emit('close');
    },
    reset () {
      this.link = defaults.link;
      this.meta = { ...defaults.meta };
      this.isNullmeta = defaults.isNullmeta;
      this.isLocalImg = defaults.isLocalImg;
      this.selectedImg = defaults.selectedImg;
      this.$nextTick(() => {
        this.$refs.searchInput && this.$refs.searchInput.setMsg();
      })
    }
  }
}
</script>

<style scoped>
.goods-input__caption {
  display: flex;
  margin-top: 20px;
  font-size: 12px;
  .goods-caption__title {
    color: #a8adbc;
  }
  .goods-caption__txt {
    color: #bbbbbb;
    p:last-child {
      margin-top: 3px;
    }
  }
}
.goods-meta__wrapper {
  min-height: 100px;
  margin-top: 30px;
  border-radius: 4px;
  font-size: 12px;
  color: #999999;
  .goods-meta--null {
    display: flex;
    height: 160px;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .goods-meta__inner--null {
      width: 100px;
      height: 90px;
      margin-bottom: 3px;
    }
    .goods-meta__txt--null {
      color: #666;
    }
  }
  .goods-meta__container {
    padding: 20px;
    background: #f6fcff;
  }
  .goods-meta__item {
    display: flex;
    margin-bottom: 10px;
    .goods-item__inner {
      display: flex;
      .goods-radio-group {
        margin-top: -5px;
      }
    }
    .goods-img__list {
      display: flex;
      width: 100%;
      .goods-img__item {
        position: relative;
        &:not(:last-child) {
          margin-right: 3px;
        }
        &.is-selectd {
          img {
            border-color: #09bbfe;
          }
          &::after {
            content: '';
            width: 20px;
            height: 20px;
            position: absolute;
            bottom: 0;
            right: 0;
            background: url(../../../assets/icon-item-selected.png) no-repeat;
          }
        }
        img {
          width: 96px;
          height: 72px;
          border: 2px solid transparent;
        }
      }
    }
    .goods-img__upload {
      height: 92px;
      border: 1px dashed #a1a1a1;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .goods-upload__txt {
        position: absolute;
        bottom: 50%;
        transform: translateY(33px);
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
      .goods-upload__icon {
        background-image: url(../../../assets/icon-plus.png);
        display: inline-block;
        width: 100%;
        height: 100%;
        background-position-x: 50%;
        background-position-y: 30%;
        background-size: 60px 60px;
        background-repeat: no-repeat;
      }
    }
    .goods-img__local {
      width: 100%;
    }
    .goods-img__loaded {
      display: flex;
      justify-content: center;
      img {
        width: 96px;
        height: 72px;
      }
    }
    .goods-img__inner {
      transform: translateX(15px);
    }
    .goods-price__txt {
      font-size: 14px;
      color: #bbbbbb;
      &.is-color {
        color: #f47b77;
      }
    }
    .goods-img__reload {
      margin-left: 20px;
    }
    .goods-img--null {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .goods-img__inner--null {
      width: 69px;
      height: 51px;
      margin-bottom: 3px;
      background: url(../../../assets/icon-img-null.png) no-repeat;
    }
  }
}
</style>
