import Quill from 'quill';
import { getImgStyle } from 'src/utils/image-operate';
const Parchment = Quill.import('parchment');
const Delta = Quill.import('delta');
const Block = Quill.import('blots/block');
const Container = Quill.import('blots/container');
const BlockEmbed = Quill.import('blots/block/embed');
const Embed = Quill.import('blots/embed');
const Break = Quill.import('blots/break');
const Inline = Quill.import('blots/inline');
const Scroll = Quill.import('blots/scroll');
const TextBlot = Quill.import('blots/text');
const MAX_IMAGE_WIDTH = 602;

class Caption extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-placeholder', '请输入图片描述');
    node.setAttribute('contenteditable', true);
    return node;
  }
  constructor(domNode) {
    super(domNode);
    const listEventHandler = e => {
      if (e.target !== domNode) return;
      domNode.setAttribute('contenteditable', true);
    };
    if (domNode.getAttribute('contenteditable') === 'false') {
      domNode.addEventListener('mousedown', listEventHandler);
    }
  }
  remove() {
    if (this.parent && this.parent.statics.blotName === 'layout-row') {
      let captionNode = this.parent.domNode.querySelectorAll(
        '.pgc-img-caption'
      );
      if (captionNode.length > 1) {
        super.remove();
      }
    }
    if (this.parent && this.parent.statics.blotName !== 'layout-row') {
      super.remove();
    }
  }
  insertAt(index, value, def) {
    if (def != null) return super.insertAt(index, value, def);
  }
  position(index) {
    return [index];
  }
  optimize() {
    // wrap cols in rows
    super.optimize();
    let prev = this.prev;
    if (prev == null && this.parent.statics.blotName === 'layout-row') {
      this.parent.remove();
      return;
    }

    let next = this.next;
    if (
      next != null &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      next.domNode.tagName === this.domNode.tagName
    ) {
      next.moveChildren(this);
      next.remove();
    }
    if (this.parent && this.parent.statics.blotName !== 'layout-row') {
      this.remove();
    }
  }
}
Caption.blotName = 'caption';
Caption.tagName = 'div';
Caption.className = 'pgc-img-caption';
class ImgWithCaption extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value);

    return node;
  }
  constructor(domNode) {
    super(domNode);
    let imgSrc = domNode.getAttribute('src');
    if (imgSrc) {
      const imgStyle = getImgStyle(imgSrc);
      let percent = 1;
      if (imgStyle.width) {
        if (imgStyle.width > MAX_IMAGE_WIDTH) {
          domNode.style.width = MAX_IMAGE_WIDTH + 'px';
          percent = MAX_IMAGE_WIDTH / imgStyle.width;
        } else {
          domNode.style.width = imgStyle.width + 'px';
        }
      }
      if (imgStyle.height) {
        domNode.style.height = imgStyle.height * percent + 'px';
      }
    }
    const errorEventHandler = () => {
      console.log('img failed');
      this.remove();
    };
    const loadEventHandler = () => {
      console.log('load');
    };
    domNode.addEventListener('error', errorEventHandler);
    domNode.addEventListener('load', loadEventHandler);
  }
  remove() {
    if (this.parent && this.parent.statics.blotName === 'layout-row') {
      let imgNode = this.parent.domNode.querySelectorAll('img');
      if (imgNode.length > 1) {
        super.remove();
      } else {
        this.parent.remove();
      }
    }
    if (this.parent && this.parent.statics.blotName !== 'layout-row') {
      super.remove();
    }
  }
  insertAt(index, value, def) {
    if (def != null) return super.insertAt(index, value, def);
  }
  optimize() {
    // wrap cols in rows
    super.optimize();
    let prev = this.prev;
    if (
      prev != null &&
      prev.next === this &&
      prev.statics.blotName === this.statics.blotName &&
      prev.domNode.tagName === this.domNode.tagName
    ) {
      prev.remove();
    }
    let next = this.next;
    if (
      next != null &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      next.domNode.tagName === this.domNode.tagName
    ) {
      next.remove();
    }
    if (this.parent && this.parent.statics.blotName !== 'layout-row') {
      const row = Parchment.create(
        'layout-row',
        this.statics.formats(this.domNode)
      );
      if (this.parent.statics.blotName !== 'scroll') {
        if (this.parent.next) {
          this.parent.parent.insertBefore(row, this.parent.next);
        } else {
          this.parent.parent.appendChild(row);
        }
      } else {
        this.parent.insertBefore(row, this);
      }
      row.appendChild(this);
    }
    if (!this.next || this.next.statics.blotName !== 'caption') {
      const caption = Parchment.create(
        'caption',
        this.statics.formats(this.domNode)
      );
      this.parent.appendChild(caption);
    }
  }
}
ImgWithCaption.blotName = 'img-with-caption';
ImgWithCaption.tagName = 'img';

class LayoutRow extends Container {
  static create(value) {
    const node = super.create();
    return node;
  }
  constructor(domNode) {
    super(domNode);
  }
  insertBefore(blot, ref) {
    let blotName = blot.statics.blotName;
    if (blotName === 'img-with-caption' || blotName === 'caption') {
      super.insertBefore(blot, ref);
    } else {
      blot.remove();
    }
  }
  insertAt(index, value, def) {
    // if (def != null) return super.insertAt(index, value, def);
    if (value.length === 0) return;
    if (typeof value === 'string') {
      if (value.endsWith('\n')) {
        let block = Parchment.create(Block.blotName);
        this.parent.insertBefore(block, index === 0 ? this : this.next);
        block.insertAt(0, value.slice(0, -1));
      } else {
        // alert('图片内部不允许插入其它组件');
        self.$message.warning('图片内部不允许插入其它组件');
      }
    }
  }
  optimize() {
    super.optimize();
  }
}

LayoutRow.blotName = 'layout-row';
LayoutRow.scope = Parchment.Scope.BLOCK_BLOT;
LayoutRow.tagName = 'div';
LayoutRow.className = 'layoutRow';
LayoutRow.defaultChild = 'img-with-caption';
LayoutRow.allowedChildren = [ImgWithCaption, Caption, TextBlot];

export { LayoutRow, ImgWithCaption, Caption };
