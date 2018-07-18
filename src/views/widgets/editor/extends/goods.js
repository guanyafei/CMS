import Quill from 'quill';
const Parchment = Quill.import('parchment');
const BlockEmbed = Quill.import('blots/block/embed');
const Container = Quill.import('blots/container');

class Goods extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', true);
    node.setAttribute('data-url', value.url);
    node.innerHTML = renderChildren(value);
    return node;
  }

  static formats(node) {
    let opt = {};
    let imgNode = node.querySelector('img');
    let titleNode = node.querySelector('.goods-info__name');
    let priceNode = node.querySelector('.goods-info__self--price');
    opt.url = node.hasAttribute('data-url')
      ? node.getAttribute('data-url')
      : null;
    opt.src = imgNode.hasAttribute('src') ? imgNode.getAttribute('src') : null;
    opt.title = titleNode.innerText;
    opt.price = priceNode.innerText;
    return opt;
  }
  optimize() {
    // wrap cols in rows
    super.optimize();
    let childNodes = this.domNode.childNodes;
    Array.from(childNodes).map(child => {
      if (child.nodeType === 3) {
        this.domNode.removeChild(child);
      }
    });
  }
}
Goods.blotName = 'goods';
Goods.className = 'editor-goods';
Goods.tagName = 'div';

function renderChildren (attrs) {
  const { src, title, price} = attrs;
  let priceCls = 'goods-info__self--price';
  if (price.indexOf('￥') === -1) {
    priceCls += ' no-price';
  }
  return `<img src=${src} class="goods-img" contenteditable="false">
    <div class="goods-info" contenteditable="false">
      <div class="goods-info__name">${title}</div>
      <div class="goods-info__self">
        <div class=\"${priceCls}\">${price}</div>
        <div class="goods-info__self--btn">去看看</div>
      </div>
    </div>`;
}

export { Goods };
