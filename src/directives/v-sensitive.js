import DI from 'interface'
import SensitiveModal from './SensitiveModal'

const addPluginAttributes = (el, binding, options) => {
  // Defaults
  let openOn
  let context
  let nextStep
  let getParams
  let prevStep
  const events = {}

  openOn = options.openOn // eslint-disable-line prefer-destructuring

  // Overriding options if they're provided in binding.value
  if (typeof binding.value !== 'undefined') {
    getParams = binding.value.getParams
    context = binding.value.context
    if (typeof binding.value.nextStep !== 'function') {
      nextStep = function(event) {}
    } else {
      nextStep = binding.value.nextStep
    }
    if (typeof binding.value.prevStep !== 'function') {
      prevStep = () => {
        return Promise.resolve()
      }
    } else {
      prevStep = binding.value.prevStep
    }
    openOn = binding.value.openOn || openOn
    events.opened = binding.value.opened
    events.ok = nextStep.bind(context || null)
    events.closed = binding.value.closed
    events.changed = binding.value.changed
  }

  return {
    events,
    openOn,
    context,
    nextStep,
    getParams,
    prevStep,
  }
}
export default (Vue, options) => {
  const Screen = Vue.extend(SensitiveModal)
  const defaultOptions = {
    openOn: 'click'
  }

  // eslint-disable-next-line no-param-reassign
  options = Object.assign(defaultOptions, options)
  return {
    bind(el, binding, vnode) {
      const { getParams, nextStep, prevStep, events, openOn, context } = addPluginAttributes(el, binding, options)

      let vm = window.vueSensitive
      if (!vm) {
        const element = document.createElement('div')
        element.setAttribute('id', 'sensitiveModal')
        document.querySelector('body').appendChild(element)
        // eslint-disable-next-line no-multi-assign
        vm = window.vueSensitive = new Screen().$mount('#sensitiveModal')
      }

      // Updating vm's data
      el.addEventListener(openOn, (e) => {
        prevStep.call(context).then(value => {
          let reg = /\[.*\]/g
          globalBus.$ajax({
            url: DI.common.checkLimitWords,
            data: JSON.stringify(getParams.call(context)),
            context: context,
            success: res => {
              if (res.retCode == '0') {
                nextStep.call(context, e)
              } else {
                let sensitiveMsg = reg.exec(res.retMsg)[0]
                Vue.set(
                  vm,
                  'sensitiveMsgList',
                  JSON.parse(sensitiveMsg)
                )
                Vue.set(vm, 'handlers', events)
                Vue.set(vm, 'closed', false)
              }
            },
            error: () => {
              console.error('error')
            }
          })
        })
      }, false)
    }
  }
}
