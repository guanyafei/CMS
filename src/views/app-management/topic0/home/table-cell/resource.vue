<template>
  <div>
    {{resourceName}}
    <br>
    {{joinName}}
  </div>
</template>
<script>
import * as Constant from 'js/constant';

export default {
  name: 'CellResource',
  componentName: 'CellResource',
  props: ['row'],
  data () {
    return {
      resourceTypes: Constant.INFO_SOURCE
    }
  },
  computed: {
    resourceName () {
      const resourceValue = this.row.resource
      return Constant.getItemByValue(this.resourceTypes, resourceValue).name
    },
    joinName () {
      const { labelNames, authorType, resource } = this.row;
      let author = '';
      if (resource == '1') {
        if (authorType == '1') {
          author = '内部作者';
        }
        if (authorType == '0') {
          author = '全部';
        }
      }

      return `${labelNames || ''}${author}`;
    }
  }
}
</script>
