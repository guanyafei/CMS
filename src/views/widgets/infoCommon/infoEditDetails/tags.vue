<template>
  <edit-item title="添加标签">
    <type-tag :ruleForm="ruleForm"></type-tag>
    <match-tag :ruleForm="ruleForm"></match-tag>
    <team-tag :ruleForm="ruleForm"></team-tag>
    <player-tag :ruleForm="ruleForm"></player-tag>
    <custom-tag :ruleForm="ruleForm"></custom-tag>
    <info-rate :ruleForm="ruleForm" title="资讯星级"></info-rate>
  </edit-item>
</template>

<script>
import EditItem from './editItem'
import TypeTag from './tags/info-type'
import MatchTag from './tags/match'
import TeamTag from './tags/team'
import PlayerTag from './tags/player'
import CustomTag from './tags/custom'
import InfoRate from './elements/infoRate'

export default {
  name: 'EditCommonTags',
  componentName: 'EditCommonTags',
  components: {
    EditItem,
    TypeTag,
    MatchTag,
    TeamTag,
    PlayerTag,
    CustomTag,
    InfoRate
  },
  props: ['ruleForm']
}
</script>

