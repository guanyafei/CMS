import Quill from 'quill';
let Inline = Quill.import('blots/inline');

class Link extends Inline {
  static create(value) {
    let node = super.create(value);
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var element = value[key];
        node.setAttribute(key, element);
      }
    }
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(domNode) {
    let opt = {};
    for (let i = 0; i < Link.attrs.length; i++) {
      let attr = Link.attrs[i];
      if (domNode.getAttribute(attr)) {
        opt[attr] = domNode.getAttribute(attr);
        break;
      }
    }

    return opt;
  }

  format(name, value) {
    console.log(name, value);
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        var element = value[key];
        this.domNode.setAttribute(key, element);
      }
    }
  }
}
Link.blotName = 'link';
Link.attrs = ['href', 'data-url', 'data-router'];
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel', 'pptvsports'];

function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

export { Link as default, sanitize };
