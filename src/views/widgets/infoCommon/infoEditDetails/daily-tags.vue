<template>
  <edit-item title="添加标签">
    <team-tag :ruleForm="ruleForm"></team-tag>
    <player-tag :ruleForm="ruleForm"></player-tag>
    <info-rate :ruleForm="ruleForm" title="日报星级"></info-rate>
  </edit-item>
</template>

<script>
import CommonMethods from './mixin';
import EditItem from './editItem';
import PlayerTag from './tags/player';
import TeamTag from './tags/team';
import InfoRate from './elements/infoRate';

export default {
  mixins: [CommonMethods],
  name: 'EditDailyTags',
  componentName: 'EditDailyTags',
  components: {
    EditItem,
    TeamTag,
    PlayerTag,
    InfoRate
    
  },
  props: ['data', 'ruleForm']
}
</script>

