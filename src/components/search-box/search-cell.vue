
<script>
export default {
  render (h) {
    const { fields, cell, row, inputEvent } = this;
    return (
      <div class="sn-search__cell">
        {
          cell.type === 'input' ?
          <div class="sn-search__input">
            <label v-if="cell.label">{cell.label}</label>
            <sn-input
              value={fields[cell.prop]}
              on-input={(value)=>inputEvent(value, cell.prop)}
              hint={cell.hint}
              reg={cell.reg}
              width="194"
              radius="16"
              inputType={cell.inputType}
              autoValid={cell.autoValid}
              maxlength={cell.maxlength}
              placeholder={cell.placeholder}>
            </sn-input>
          </div>
          :null
        }
        {
          cell.type === 'select' ?
          <div class="sn-search__select">
            <label>{cell.label}</label>
            <sn-select
              value={fields[cell.prop]}
              on-input={(value)=>inputEvent(value, cell.prop)}
              placeholder={cell.placeholder||"请选择"}
              radius="16"
              width="135"
              on-change={(value)=>cell.triggerEvent(value, cell.prop, this.$parent.$parent)}>
              <sn-option key='all' name='全部' value={-1}></sn-option>
              {
                this._l(cell.list, option =>
                  <sn-option key={option.key} name={option.name} value={option.value} disabled={option.disabled}>
                  </sn-option>
                )
              }
            </sn-select>
          </div>
          : null
        }
        {
          cell.type === 'button' ?
          <sn-button
            disabled={cell.disabled}
            type={cell.buttonType}
            gutter={cell.gutter}
            on-click={()=>cell.triggerEvent(this.$parent.$parent)}>
            {cell.text}
          </sn-button>
          :null
        }
        {
          cell.type === 'slot' ?
          row.$slots[cell.prop]
          : null
        }
        {
          cell.type === 'duration' ?
          <div class="sn-search__duration">
            <label class="label">{cell.label?cell.label:'发表时间'}</label>
            <sn-timer
              value={fields[cell.prop[0]]}
              on-input={(value)=>inputEvent(value, cell.prop[0])}
              ref="startTime"
              placeholder="起始时间"
              maxDate={fields[cell.prop[1]]}
              timeFormat={cell.timeFormat}
              width={cell.width}
              showTimepicker={cell.showTimepicker}
            ></sn-timer>
            <label></label>
            <label>至</label>
            <sn-timer
              value={fields[cell.prop[1]]}
              on-input={(value)=>inputEvent(value, cell.prop[1])}
              ref="endTime"
              placeholder="结束时间"
              minDate={fields[cell.prop[0]]}
              timeFormat={cell.timeFormat}
              width={cell.width}
              showTimepicker={cell.showTimepicker}
            ></sn-timer>
          </div>: null
        }
      </div>
    )
  },
  methods: {
    inputEvent (value, prop) {
      this.fields[prop] = value;
    }
  },
  name: 'SnSearchCell',
  props: ['parents', 'fields', 'cell', 'row'],
  created () {
    let _this = this;
    if (this.cell.type === 'duration') {
      this.$bus.$on('start-error-info', () => {
        _this.$refs.startTime && _this.$refs.startTime.showErr('请选择起始时间');
      })
      this.$bus.$on('end-error-info', () => {
        _this.$refs.endTime && _this.$refs.endTime.showErr('请选择结束时间');
      })
      this.$bus.$on('clear-start-error', () => {
        _this.$refs.startTime && _this.$refs.startTime.hideErr();
      })
      this.$bus.$on('clear-end-error', () => {
        _this.$refs.endTime && _this.$refs.endTime.hideErr();
      })
    }
  }
}
</script>

<style scoped>
.sn-search__cell:not(:last-child) {
  margin-right: 30px;
}
.sn-search__duration,
.sn-search__input,
.sn-search__select {
  display: flex;
  align-items: center;
  label {
    margin-right: 10px;
  }
}
</style>
