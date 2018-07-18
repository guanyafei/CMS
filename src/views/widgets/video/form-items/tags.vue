<template>
  <edit-item title="分类和标签" :labelWidth="20">
    <quick-select :ruleForm="ruleForm"></quick-select>
    <base-classify-item :ruleForm="ruleForm"></base-classify-item>
    <video-type :ruleForm="ruleForm"></video-type>
    <match-tag :ruleForm="ruleForm"></match-tag>
    <team-tag :ruleForm="ruleForm"></team-tag>
    <player-tag :ruleForm="ruleForm"></player-tag>
    <custom-tag :ruleForm="ruleForm"></custom-tag>
  </edit-item>
</template>

<script>
import BaseClassifyItem from 'widgets/video/form-items/base-classify-item';
import CustomTag from 'widgets/infoCommon/infoEditDetails/tags/custom';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import MatchTag from 'widgets/infoCommon/infoEditDetails/tags/match';
import QuickSelect from 'widgets/video/form-items/quick-select';
import PlayerTag from 'widgets/infoCommon/infoEditDetails/tags/player';
import TeamTag from 'widgets/infoCommon/infoEditDetails/tags/team';
import VideoType from 'widgets/video/form-items/video-type';

export default {
  name: 'videoTags',
  componentName: 'videoTags',
  components: {
    BaseClassifyItem,
    CustomTag,
    EditItem,
    MatchTag,
    QuickSelect,
    TeamTag,
    PlayerTag,
    VideoType,
  },
  props: ['ruleForm']
};
</script>

