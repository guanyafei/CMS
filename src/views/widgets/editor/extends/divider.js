import Quill from 'quill';
const Parchment = Quill.import('parchment');
const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', false);
    node.innerHTML = '<hr>';
    return node;
  }
}

DividerBlot.tagName = 'div';
DividerBlot.className = 'sn-divider';

DividerBlot.blotName = 'divider';
export default DividerBlot;
