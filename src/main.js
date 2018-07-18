'use strict';
import 'src/css/common.css';
import 'src/css/_reset.css';
import * as filters from 'js/filters';
import components from 'components';
import directives from 'directives';
import Message from 'components/new-frame/message';
import Modal from 'components/new-frame/message-box';
import Loading from 'components/new-frame/loading';
import Bus from 'utils/bus';
import Http from 'utils/http';

const propsMaps = {
  $bus: Bus,
  $message: Message,
  $ajax: Http.ajax,
  $alert: Modal.alert,
  $confirm: Modal.confirm,
  $loading: Loading.service
};
directives.loading = Loading.directive;

function registerComponents(Vue) {
  for (let component in components) {
    let definition = components[component];

    Vue.component(component, definition);
  }
}

function registerDirectives(Vue, options) {
  for (let directive in directives) {
    let definition = directives[directive];
    if (typeof definition === 'function') {
      definition = definition(Vue, options);
    }
    Vue.directive(directive, definition);
  }
}

function registerFilters(Vue) {
  for (let filter in filters) {
    let definition = filters[filter];

    Vue.filter(filter, definition);
  }
}

function defineVueProperties(Vue, props) {
  let container = {};
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const prop = props[key];
      container[key] = {
        get() {
          return prop;
        }
      };
    }
  }

  Object.defineProperties(Vue.prototype, container);
}

export default {
  install(Vue, options) {
    registerComponents(Vue);
    registerFilters(Vue);
    registerDirectives(Vue, options);
    defineVueProperties(Vue, propsMaps);
  }
};
