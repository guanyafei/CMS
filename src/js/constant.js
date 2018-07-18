import createConstantArr from 'utils/constant-array';
import quickList from './constants/quick-select';
import {
    regionChannelList,
    securityTypes,
    cityPolicyTypes,
    reasonTypes,
    strengthTypes,
    allCityList,
    mainlanCityList,
    foreignCountryList,
    specialCityList
} from './constants/region-setting';

export const QUICK_SELECT_POLICY_LIST = createConstantArr(quickList);
export const CHANNEL_LIST = createConstantArr(regionChannelList);
export const SECURITY_POLICIES = createConstantArr(securityTypes);
export const BLOCK_REASONS = createConstantArr(reasonTypes);
export const BLOCK_STRENGTH_TYPES = createConstantArr(strengthTypes);
export const QUICK_SELECT_CITY_POLICIES = createConstantArr(cityPolicyTypes);
export const CITY_LIST = createConstantArr(allCityList);
export const MAINLAND_CITY_LIST = createConstantArr(mainlanCityList);
export const FOREIGN_COUNTRY_LIST = createConstantArr(foreignCountryList);
export const SPECIAL_AREA_CITY_LIST = createConstantArr(specialCityList);

export const COVER_WIDTH_SCOPE = {
    max: 1500,
    min: 500
};
export const NAV_TYPE_LIST = createConstantArr([
    { key: 'news', value: 1, name: '资讯' },
    { key: 'live', value: 2, name: '直播' },
    { key: 'community', value: 3, name: '社区' },
    { key: 'data', value: 4, name: '数据' },
    { key: 'mine', value: 5, name: '我的' },
    { key: 'shortV', value: 6, name: '短视频' },
    { key: 'url', value: 7, name: 'URL' }
]);
export const CONFIG_MENU_LIST = createConstantArr([
    { key: 'floorTab', value: 0, name: '底部导航配置' },
    { key: 'faceAChannel', value: 1, name: 'A面频道管理' },
    { key: 'faceBChannel', value: 2, name: 'B面配置' },
    { key: 'searchBar', value: 3, name: '搜索栏展示配置' }
]);

export const CHANNEL_TYPE_LIST = createConstantArr([
    { key: 'home', value: 1, name: '首页' },
    { key: 'theme', value: 2, name: '主题' },
    { key: 'shortV', value: 3, name: '短视频' },
    { key: 'url', value: 4, name: 'URL' }
]);

export const PCCHANNEL_TYPE_LIST = createConstantArr([
    { key: 'home', value: 1, name: '首页' },
    { key: 'theme', value: 2, name: '主题' },
    { key: 'url', value: 4, name: 'URL' }
]);

export const CHANNELB_TYPE_LIST = createConstantArr([
    { key: 'shortV', value: 3, name: '短视频' },
    { key: 'theme', value: 2, name: '主题' },
    { key: 'url', value: 4, name: 'URL' },
    { key: 'matchScedule', value: 6, name: '赛事赛程' },
    { key: 'matchScore', value: 7, name: '赛事积分榜' }
]);
//前台展示搜索栏配置跳转类型
export const JUMP_TYPE_LIST = createConstantArr([{
        key: 'inner',
        name: '内部地址',
        value: 1,
        placeholder: '请输入pptvsports://开头的原生页面路由地址',
        errMsg: '格式不正确，请输入pptvsports://开头的原生页面路由地址',
        reg: /^pptvsports:\/\/[^\s]+$/
    },
    {
        key: 'h5',
        name: '内链url',
        value: 2,
        placeholder: '请输入http://或https://开头的内链H5页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    },
    {
        key: 'outer',
        name: '外链url',
        value: 3,
        placeholder: '请输入http://或https://开头的外链页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    }
]);
//前台展示主题类型
export const SUBJECT_TYPE_LIST = createConstantArr([
    { key: 'column', value: 1, name: '栏目' },
    { key: 'match', value: 2, name: '赛事' },
    { key: 'programSet', value: 4, name: '节目集' },
    { key: 'group', value: 5, name: '小组' }
]);

// 禁言查询状态
export const BANNED_OPTION_STATUS = createConstantArr([{
        key: 'normal',
        value: 0,
        name: '正常'
    },
    {
        key: 'banning',
        value: 1,
        name: '禁言中'
    }
]);

// 禁言状态
export const BANNED_STATUS = createConstantArr([{
        key: 'normal',
        value: 0,
        name: '正常'
    },
    {
        key: 'banning',
        value: 1,
        name: '禁言中'
    },
    {
        key: 'forever',
        value: 2,
        name: '永久禁言'
    }
]);
// 上架状态
export const ONSHELF_STATUS = createConstantArr([{
        key: 'examine',
        value: 1,
        name: '待审核'
    },
    {
        key: 'onshelf',
        value: 2,
        name: '已上架'
    },
    {
        key: 'reject',
        value: 3,
        name: '已驳回'
    }
]);

// 评论状态
export const COMMENT_STATUS = createConstantArr([{
        key: 'normal',
        value: 1,
        name: '正常'
    },
    {
        key: 'hide',
        value: 2,
        name: '隐藏'
    }
]);

//爬虫评论管理使用情况
export const COMMENT_USE = createConstantArr([{
        key: 'already',
        value: 1,
        name: '已使用'
    },
    {
        key: 'noAlready',
        value: -1,
        name: '未使用'
    }
]);

// 内容状态
export const COMMENT_CONTENT_TYPE = createConstantArr([{
        key: 'info',
        value: 1,
        name: '资讯',
        idLabel: '内容ID'
    },
    {
        key: 'video',
        value: 2,
        name: 'MIP视频',
        idLabel: '内容ID'
    },
    {
        key: 'match',
        value: 3,
        name: '比赛',
        idLabel: '内容ID'
    },
    {
        key: 'program',
        value: 4,
        name: '节目',
        idLabel: '内容ID'
    },
    {
        key: 'comment',
        value: 100,
        name: '评论',
        idLabel: '评论ID'
    }
]);

export const COMMENT_CONTENT_TYPECOM = createConstantArr([{
        key: 'info',
        value: 1,
        name: '资讯'
    },
    {
        key: 'video',
        value: 2,
        name: 'MIP视频'
    },
    {
        key: 'match',
        value: 3,
        name: '比赛'
    },
    {
        key: 'program',
        value: 4,
        name: '节目'
    }
]);
// 标签tab类型
export const LABEL_TAB_TYPE = createConstantArr([{
        key: 'type',
        value: '1',
        name: '资讯分类',
        resListName: 'CategoryLabelList'
    },
    {
        key: 'columnLabel',
        value: '2',
        name: '资讯栏目',
        resListName: 'columnLabelList'
    },
    {
        key: 'match',
        value: '3',
        name: '赛事管理',
        paging: true,
        resListName: 'matchList'
    },
    {
        key: 'team',
        value: '4',
        name: '推荐球队',
        paging: true,
        resListName: 'teamList'
    },
    {
        key: 'player',
        value: '5',
        name: '推荐球员',
        paging: true,
        resListName: 'playerList'
    }
]);

// 资讯频道类型
export const INFO_CHANNEL_TYPE = createConstantArr([{
        key: 'index',
        value: '1',
        name: '首页'
    },
    {
        key: 'channel',
        value: '2',
        name: '频道'
    },
    {
        key: 'topic',
        value: '3',
        name: '专题页'
    }
]);
// 资讯新频道类型

export const INFO_NEW_CHANNEL_TYPE = createConstantArr([{
        key: 'column',
        value: 1,
        name: '栏目'
    },
    {
        key: 'match',
        value: 2,
        name: '赛事'
    },
    {
        key: 'topic',
        value: 3,
        name: '专题'
    },
    {
        key: 'programSet',
        value: 4,
        name: '节目集'
    },
    {
        key: 'group',
        value: 5,
        name: '小组'
    },
    {
        key: 'schedule',
        value: 6,
        name: '比赛场次'
    }
]);

// 资讯上下架方式
export const SALE_TYPE = createConstantArr([{
        key: 'auto',
        value: 1,
        name: '自动上架'
    },
    {
        key: 'examination',
        value: 2,
        name: '审核上架'
    }
]);

// 资讯来源
export const INFO_SOURCE = createConstantArr([{
        key: 'signup',
        value: 1,
        name: '报名'
    },
    {
        key: 'tag',
        value: 2,
        name: '标签匹配'
    },
    {
        key: 'handwork',
        value: 3,
        name: '人工维护'
    }
]);

// 通用信息流来源
export const COMMON_INFOFLOW_SOURCE = createConstantArr([{
        key: 'tag',
        value: 2,
        name: '标签匹配'
    },
    {
        key: 'handwork',
        value: 3,
        name: '人工维护'
    }
]);

// 信息流类型
export const INFOFLOW_TYPE = createConstantArr([{
        value: 1,
        name: '主题信息流'
    },
    {
        value: 2,
        name: '通用'
    }
]);

//信息流主题类型
export const INFOFLOW_SUBJECT_TYPE = createConstantArr([{
        value: 1,
        id: 1,
        key: 1,
        name: '栏目'
    },
    {
        value: 2,
        id: 2,
        key: 2,
        name: '赛事'
    },
    {
        value: 3,
        id: 3,
        key: 3,
        name: '专题'
    },
    {
        value: 4,
        id: 4,
        key: 4,
        name: '节目集'
    },
    {
        value: 5,
        id: 5,
        key: 5,
        name: '小组'
    },
    {
        value: 6,
        id: 6,
        key: 6,
        name: '比赛场次'
    }
]);

// 文章类型1.图文 2图集 3 视频 8日报
export const ARTICLE_TYPE = createConstantArr([{
        key: 'text',
        value: 1,
        name: '图文',
        previewName: 'news',
        allowImgTypeList: [0, 1, 2]
    },
    {
        key: 'picture',
        value: 2,
        name: '图集',
        previewName: 'images',
        allowImgTypeList: [1, 2]
    },
    {
        key: 'video',
        value: 3,
        name: '视频',
        previewName: 'videonews',
        allowImgTypeList: [0, 1]
    },
    {
        key: 'daily',
        value: 8,
        name: '日报',
        disCooper: true,
        allowImgTypeList: [0, 1, 2]
    },
    {
        key: 'shortV',
        value: 10,
        name: 'PGC视频',
        allowImgTypeList: [0, 1]
    }
]);
// 文档啊
export const VIDEO_TYPE = createConstantArr([{
        key: 'broadcast',
        value: 3,
        name: '点播'
    },
    {
        key: 'direct',
        value: 4,
        name: '二代直播'
    },
    {
        key: 'puppet',
        value: 5,
        name: '伪点播'
    },
    {
        key: 'episode',
        value: 21,
        name: '剧集'
    },
    {
        key: 'collection',
        value: 22,
        name: '合集'
    }
]);
//资讯发布文章类型
export const PUBLISH_ARTICLE_TYPE = createConstantArr([{
        key: 'text',
        value: 1,
        name: '图文'
    },
    {
        key: 'picture',
        value: 2,
        name: '图集'
    },
    {
        key: 'daily',
        value: 8,
        name: '日报'
    }
]);

// 文章来源
export const SOURCE_TYPE = createConstantArr([{
        key: 'public',
        value: '1',
        name: '公众平台'
    },
    {
        key: 'crawler',
        value: '2',
        name: '网络爬虫'
    },
    {
        key: 'videoLick',
        value: '3',
        name: '视频入库'
    }
]);
export const INFO_SOURCE_TYPES = createConstantArr([{
        key: 'origin',
        value: 1,
        name: '原创资讯',
        videoName: '原创视频',
        valid: {
            isRequired: false,
            min: 1,
            max: 30
        }
    },
    {
        key: 'copy',
        value: 2,
        name: '转载资讯',
        videoName: '转载视频',
        placeholder: '请输入转载来源（2-16个字）',
        valid: {
            isRequired: true,
            min: 2,
            max: 16
        }
    },
    {
        key: 'fake',
        value: 3,
        name: '外约稿件',
        videoName: '外约视频',
        placeholder: '请输入外约作者（2-10个字）',
        valid: {
            isRequired: true,
            min: 2,
            max: 10
        }
    }
]);
export const COMMENT_FROM = createConstantArr([{
        key: 'stage',
        value: 1,
        name: '前台评论'
    },
    {
        key: 'guide',
        value: 2,
        name: '引导评论'
    },
    {
        key: 'flow',
        value: 3,
        name: '灌水评论'
    }
]);
// 星级
export const STAR_LEVEL = createConstantArr([{
        key: 'one-star',
        value: 1,
        name: '一星'
    },
    {
        key: 'two-star',
        value: 2,
        name: '二星'
    },
    {
        key: 'three-star',
        value: 3,
        name: '三星'
    }
]);
// 视频状态
export const VIDEO_STATUS = createConstantArr([{
        key: 'untreated',
        value: 0,
        name: '未处理'
    },
    {
        key: 'online',
        value: 1,
        name: '上线'
    },
    {
        key: 'offline',
        value: 3,
        name: '下线'
    },
    {
        key: 'delete',
        value: 4,
        name: '已删除'
    }
]);
// 视频语言
export const VIDEO_LANGUAGE = createConstantArr([{
        key: 'untreated',
        value: 0,
        name: '国语'
    },
    {
        key: 'online',
        value: 1,
        name: '粤语'
    },
    {
        key: 'online',
        value: 2,
        name: '英语'
    },
    {
        key: 'online',
        value: 3,
        name: '韩语'
    },
    {
        key: 'online',
        value: 4,
        name: '日语'
    },
    {
        key: 'online',
        value: 5,
        name: '其它'
    },
    {
        key: 'online',
        value: 6,
        name: '多语种'
    },
    {
        key: 'online',
        value: 7,
        name: '法语'
    },
    {
        key: 'offline',
        value: 8,
        name: '泰语'
    }
]);
// 字幕

export const VIDEO_CAPTION = createConstantArr([{
        key: 'untreated',
        value: 0,
        name: '国语'
    },
    {
        key: 'online',
        value: 1,
        name: '粤语'
    },
    {
        key: 'online',
        value: 2,
        name: '英语'
    },
    {
        key: 'online',
        value: 3,
        name: '韩语'
    },
    {
        key: 'online',
        value: 4,
        name: '日语'
    },
    {
        key: 'online',
        value: 5,
        name: '其它'
    },
    {
        key: 'online',
        value: 6,
        name: '字幕'
    },
    {
        key: 'online',
        value: 7,
        name: '无字幕'
    }
]);

// 端状态
export const TERMINAL_STATUS = createConstantArr([{
        key: 'online',
        value: 1,
        name: '上线'
    },
    {
        key: 'off',
        value: 3,
        name: '下线'
    }
]);
// 端状态名称
export const TERMINAL_NAME = createConstantArr([{
        key: 'androidpad',
        value: 'androidpad',
        name: 'APAD'
    },
    {
        key: 'androidphone',
        value: 'androidphone',
        name: 'APHONE'
    },
    {
        key: 'client',
        value: 'client',
        name: '客户端'
    },
    {
        key: 'ikan',
        value: 'ikan',
        name: '网站端'
    },
    {
        key: 'pad',
        value: 'pad',
        name: 'IPAD'
    },
    {
        key: 'phone',
        value: 'phone',
        name: 'IPHONE'
    },
    {
        key: 'tvbox',
        value: 'tvbox',
        name: 'TV'
    },
    {
        key: 'win8',
        value: 'win8',
        name: 'WIN8'
    },
    {
        key: 'winphone',
        value: 'winphone',
        name: 'winphone'
    }
]);

// 签约作者内容发布月份
export const MONTH_LIST = createConstantArr([{
        value: 1,
        name: '1月'
    },
    {
        value: 2,
        name: '2月'
    },
    {
        value: 3,
        name: '3月'
    },
    {
        value: 4,
        name: '4月'
    },
    {
        value: 5,
        name: '5月'
    },
    {
        value: 6,
        name: '6月'
    },
    {
        value: 7,
        name: '7月'
    },
    {
        value: 8,
        name: '8月'
    },
    {
        value: 9,
        name: '9月'
    },
    {
        value: 10,
        name: '10月'
    },
    {
        value: 11,
        name: '11月'
    },
    {
        value: 12,
        name: '12月'
    }
]);

// 驳回理由
export const REFUSE_REASONS = createConstantArr([{
        key: 'notstandard',
        value: '1',
        name: '内容不符合规范'
    },
    {
        key: 'wrong',
        value: '2',
        name: '错别字'
    },
    {
        key: 'notchannel',
        value: '3',
        name: '不符合频道内容标准'
    },
    {
        key: 'sensitive',
        value: '4',
        name: '敏感话题'
    },
    {
        key: 'others',
        value: '5',
        name: '其他'
    }
]);

// 审批动作
export const APPROVE_ACTION = createConstantArr([{
        key: 'access',
        value: 2,
        name: '上架'
    },
    {
        key: 'refuse',
        value: 3,
        name: '驳回'
    }
]);

// 审批状态
export const APPROVE_STATUS = createConstantArr([{
        key: 'approving',
        value: '1',
        name: '待审批'
    },
    {
        key: 'accessed',
        value: '2',
        name: '已上架'
    },
    {
        key: 'refused',
        value: '3',
        name: '驳回'
    }
]);
// 上架状态
export const GROUNDING_STATUS = createConstantArr([{
        key: 'approving',
        value: '1',
        name: '频道'
    },
    {
        key: 'accessed',
        value: '2',
        name: '频道'
    },
    {
        key: 'refused',
        value: '3',
        name: '专题'
    }
]);
// 资讯状态
export const INFOR_STATUS = createConstantArr([{
        key: 'published',
        value: 1,
        name: '已发布'
    },
    {
        key: 'hidden',
        value: 2,
        name: '已隐藏'
    },
    {
        key: 'deleted',
        value: 3,
        name: '已删除'
    }
]);
//资讯发布状态
export const PUBLISH_INFOR_STATUS = createConstantArr([{
        key: 'published',
        value: 1,
        name: '已发布'
    },
    {
        key: 'hidden',
        value: 2,
        name: '隐藏'
    },
    {
        key: 'approving',
        value: 4,
        name: '待审核'
    },
    {
        key: 'refuse',
        value: 5,
        name: '驳回'
    }
]);

//  资讯推送状态
export const INFOR_PUSHSTATUS = createConstantArr([{
        key: 'pushedToNews',
        value: 1,
        name: '已发布至今日头条'
    },
    {
        key: 'unpushToNews',
        value: 0,
        name: '未发布至今日头条'
    },
    {
        key: 'pushedToEasyBuy',
        value: 3,
        name: '已发布至苏宁易购'
    },
    {
        key: 'unpushToEasyBuy',
        value: 2,
        name: '未发布至苏宁易购'
    }
]);

//  资讯推送动作
export const INFOR_PUSH_ACTION = createConstantArr([{
        key: 'unpush',
        value: 0,
        name: '取消推送'
    },
    {
        key: 'push',
        value: 1,
        name: '推送'
    }
]);

// 用户来源
export const USER_SOURCE = createConstantArr([{
    key: 'pptv',
    value: 1,
    name: 'PPTV'
}]);

// 资讯元素
export const INFOR_ELEMENT = createConstantArr([{
        key: 'read',
        value: '1',
        name: '阅读数'
    },
    {
        key: 'comment',
        value: '2',
        name: '评论数'
    },
    {
        key: 'like',
        value: '3',
        name: '点赞数'
    },
    {
        key: 'collect',
        value: '4',
        name: '收藏数'
    }
]);

// 用户元素
export const USER_ELEMENT = createConstantArr([{
        key: 'comment',
        value: '1',
        name: '评论数'
    },
    {
        key: 'like',
        value: '2',
        name: '点赞数'
    },
    {
        key: 'follow',
        value: '3',
        name: '关注数'
    }
]);

// 账号类型
export const ACCOUNT_TYPE = createConstantArr([{
        key: 'yigou',
        value: '1',
        name: '易购账号'
    },
    {
        key: 'main',
        value: '2',
        name: '企业账号'
    }
]);

// 账号状态
export const ACC_STATUS = createConstantArr([
    // {
    //   key: 'approving',
    //   value: 1,
    //   name: '待审核'
    // },
    {
        key: 'accessed',
        value: 2,
        name: '审核通过'
    },
    {
        key: 'deaded',
        value: 3,
        name: '已停用'
    }
]);

// 作者库--作者类型
export const LIBRARY_AUTHOR_TYPE = createConstantArr([{
        key: 'inter',
        value: 1,
        name: '内部作者'
    },
    {
        key: 'outer',
        value: 2,
        name: '外部作者'
    }
]);
// 作者类型
export const AUTHOR_TYPE = createConstantArr([{
        key: 'inter',
        value: '1',
        name: '内部作者'
    },
    {
        key: 'outer',
        value: '2',
        name: '外部作者'
    }
]);
// 内部作者角色类型
export const ROLE_TYPE = createConstantArr([{
        key: 'insideEditor',
        value: 5,
        name: '内部编辑'
    },
    {
        key: 'insideOther',
        value: 6,
        name: '内部其他'
    }
]);

// 作者类型
export const TAUTHOR_TYPE = createConstantArr([{
        key: 'inter',
        value: 1,
        name: '内部作者'
    },
    {
        key: 'outer',
        value: 0,
        name: '全部'
    }
]);

// 频道上下架状态
export const CHANNEL_STATUS = createConstantArr([{
        key: 'up',
        value: '1',
        name: '上架'
    },
    {
        key: 'down',
        value: '0',
        name: '下架'
    }
]);

// 信息流上下线状态
export const INFOFLOW_STATUS = createConstantArr([{
        key: 'up',
        value: '1',
        name: '上线'
    },
    {
        key: 'down',
        value: '0',
        name: '下线'
    }
]);

// 主题上下线状态
export const THEME_STATUS = createConstantArr([{
        key: 'up',
        value: '1',
        name: '上线'
    },
    {
        key: 'down',
        value: '0',
        name: '下线'
    }
]);

// 赛事TAB状态
export const TAB_STATUS = createConstantArr([{
        key: 'up',
        value: 1,
        name: '上架'
    },
    {
        key: 'down',
        value: 0,
        name: '下架'
    }
]);

export const ACC_BALANCE = createConstantArr([{
        key: 'approving',
        value: 1,
        name: '签约作者'
    },
    {
        key: 'accessed',
        value: 2,
        name: '申请作者'
    },
    {
        key: 'deaded',
        value: 3,
        name: '其他'
    }
]);

export const ACC_SHOW = createConstantArr([{
        key: 'start',
        value: 1,
        name: '明星大咖'
    },
    {
        key: 'outfit',
        value: 2,
        name: '机构号'
    },
    {
        key: 'media',
        value: 3,
        name: '资深媒体人、记者'
    },
    {
        key: 'reporter',
        value: 4,
        name: '普通作者'
    }
]);
// 增加频道--标签匹配--选择标签--标签类型
export const TAG_TYPE = createConstantArr([{
        value: '3',
        name: '运动'
    },
    {
        value: '4',
        name: '赛事'
    },
    {
        value: '8',
        name: '球队'
    },
    {
        value: '9',
        name: '球员'
    }
]);

// 频道类型
export const CHANNELS_TYPE = createConstantArr([{
        value: 1,
        name: '预设频道'
    },
    {
        value: 2,
        name: '定制频道'
    }
]);

export const NAUTHOR_TYPE = createConstantArr([{
        value: 0,
        name: '全部'
    },
    {
        value: 1,
        name: '内部作者'
    }
]);

// 资讯标签类型
export const INFO_TAB_TYPE = createConstantArr([{
        key: 'type',
        value: 1,
        name: '分类标签'
    },
    {
        key: 'column',
        value: 2,
        name: '栏目标签'
    },
    {
        key: 'program',
        value: 3,
        name: '项目',
        belongTag: 'match'
    },
    {
        key: 'game',
        value: 4,
        name: '赛事',
        belongTag: 'match'
    },
    {
        key: 'season',
        value: 5,
        name: '赛季',
        belongTag: 'match'
    },
    {
        key: 'round',
        value: 6,
        name: '轮次',
        belongTag: 'match'
    },
    {
        key: 'schedule',
        value: 7,
        name: '赛程',
        belongTag: 'match'
    },
    {
        key: 'team',
        value: 8,
        name: '球队'
    },
    {
        key: 'player',
        value: 9,
        name: '球员'
    },
    {
        key: 'bu',
        value: 10,
        name: 'bu标签'
    },
    {
        key: 'custom',
        value: 11,
        name: '自定义标签'
    },
    {
        key: 'group',
        value: 12,
        name: '小组',
        belongTag: 'match'
    }
]);
export const INFO_IMAGE_TYPE = createConstantArr([{
        key: 'small',
        value: 0,
        name: '小图',
        aspectRatio: 4 / 3
    },
    {
        key: 'big',
        value: 1,
        name: '大图',
        aspectRatio: 16 / 9
    },
    {
        key: 'tri',
        value: 2,
        name: '三图',
        aspectRatio: 339 / 255
    }
]);

// 评论元素
export const COMMENT_ELEMENT = createConstantArr([{
        key: 'report',
        value: '1',
        name: '举报数'
    },
    {
        key: 'reply',
        value: '2',
        name: '回复数'
    },
    {
        key: 'like',
        value: '3',
        name: '点赞数'
    }
]);

//功能位管理--跳转类型
export const FUN_JUMP_TYPE = createConstantArr([{
        value: 1,
        name: '内部页面'
    },
    {
        value: 2,
        name: 'H5页面'
    }
]);

export const FUN_LABEL = createConstantArr([{
        value: 1,
        label: '内部地址',
        placeholder: 'pptvsports://开头的页面路由地址'
    },
    {
        value: 2,
        label: 'H5地址',
        placeholder: 'http或https开头的H5地址'
    }
]);

// 频道连版管理--跳转类型
export const JUMP_TYPE = createConstantArr([{
        value: 1,
        name: '比赛节目'
    },
    {
        value: 2,
        name: '资讯'
    },
    {
        value: 3,
        name: '帖子'
    },
    {
        value: 4,
        name: '圈子'
    },
    {
        value: 5,
        name: 'MIP视频'
    },
    {
        value: 6,
        name: '专题'
    },
    {
        value: 7,
        name: '内链URL'
    },
    {
        value: 8,
        name: '外链URL'
    },
    {
        value: 9,
        name: '合集'
    }
]);

/*
	1、球队 ，2、球员 ，3、节目 ，4、作者 ，5、主题-赛事 ，6、主题-栏目 ，7主题-小组，8、主题-专题 ，9、主题-比赛 ，10、URL：须输入地址；）
*/
// PC 推荐标签-- 跳转类型
export const PC_REC_TYPE = createConstantArr([{
        value: 1,
        name: '球队'
    },
    {
        value: 2,
        name: '球员'
    },
    {
        value: 3,
        name: '节目'
    },
    {
        value: 4,
        name: '作者'
    },
    {
        value: 5,
        name: '主题-赛事'
    },
    {
        value: 6,
        name: '主题-栏目'
    },
    {
        value: 7,
        name: '主题-小组'
    },
    {
        value: 8,
        name: '主题-专题'
    },
    {
        value: 9,
        name: '主题-比赛'
    },
    {
        value: 10,
        name: 'URl'
    }
]);

export const PC_REC_content = createConstantArr([{
        value: 1,
        label: '球队查询',
        placeholder: '请输入球队名称/id快速查询'
    },
    {
        value: 2,
        label: '球员查询',
        placeholder: '请输入球员名称/id快速查询'
    },
    {
        value: 3,
        label: '节目查询',
        placeholder: '请输入节目名称/id快速查询'
    },
    {
        value: 4,
        label: '作者查询',
        placeholder: '请输入作者名称/id快速查询'
    },
    {
        value: 5,
        label: '赛事查询',
        placeholder: '请输入赛事主题名称/id快速查询'
    },
    {
        value: 6,
        label: '栏目查询',
        placeholder: '请输入栏目名称/id快速查询'
    },
    {
        value: 7,
        label: '小组查询',
        placeholder: '请输入小组名称/id快速查询'
    },
    {
        value: 8,
        label: '专题查询',
        placeholder: '请输入专题名称/id快速查询'
    },
    {
        value: 9,
        label: '比赛查询',
        placeholder: '请输入比赛关键词快速添加'
    },
    {
        value: 10,
        label: 'URL',
        placeholder: '请输入链接'
    }
]);

// 频道连版管理--列表展示跳转类型
export const LIST_JUMP_TYPE = createConstantArr([
    ...JUMP_TYPE,
    {
        value: 10,
        name: '视频贴'
    }
]);

// 冠名广告跳转类型
export const G_JUMP_TYPE = createConstantArr([{
        value: 9,
        name: '无跳转'
    },
    {
        value: 7,
        name: '应用内打开URL'
    },
    {
        value: 8,
        name: '浏览器打开'
    }
]);
// 频道类型
export const CHANNEL_TYPE = createConstantArr([{
        value: 1,
        name: '热门'
    },
    {
        value: 2,
        name: '普通'
    },
    {
        value: 3,
        name: '专题'
    }
]);
// 冠名广告所属模块
export const G_ADVBLONGLIST = createConstantArr([{
        name: '数据频道',
        id: 2,
        value: 2
    },
    {
        name: '比赛推荐',
        id: 3,
        value: 3
    },
    {
        name: '热门比赛',
        id: 4,
        value: 4
    },
    {
        name: '资讯专题',
        id: 5,
        value: 5
    },
    {
        name: '直播赛事',
        id: 6,
        value: 6
    },
    {
        name: '关注频道',
        id: 9,
        value: 9
    },
    {
        name: '直播间浮层',
        id: 7,
        value: 7
    },
    {
        name: '直播间对阵',
        id: 8,
        value: 8
    },
    {
        name: '资讯连版',
        id: 10,
        value: 10
    },
    {
        name: '资讯连版(专题)',
        id: 11,
        value: 11
    },
    {
        name: '球队主页(横图)',
        id: 13,
        value: 13
    },
    {
        name: '球队主页(小图)',
        id: 12,
        value: 12
    }
]);
// 频道连版管理--广告状态
export const ADV_STATUS = createConstantArr([{
        value: '1',
        name: '开始'
    },
    {
        value: '2',
        name: '未开始'
    },
    {
        value: '3',
        name: '已结束'
    }
]);

// 推荐比赛--是否推到连版
export const PUSH_ADV = createConstantArr([{
        value: '0',
        name: '否'
    },
    {
        value: '1',
        name: '是'
    }
]);

// 视频合集管理--视频类型
export const VIDEO_DIS_TYPE = createConstantArr([{
        value: '1',
        name: '轮播'
    },
    {
        value: '2',
        name: '栏目'
    }
]);

// 坑位管理--展示样式
export const FLOOR_TYPE = createConstantArr([{
        value: '2',
        name: '通用'
    }
    // {
    //     value: '1',
    //     name: '作者专栏'
    // }
]);

// 坑位管理--坑位序号
export const FLOOR_INDEX = createConstantArr([{
        value: 1,
        name: '1'
    },
    {
        value: 2,
        name: '2'
    },
    {
        value: 3,
        name: '3'
    },
    {
        value: 4,
        name: '4'
    }
]);

// 坑位管理--广告状态
export const ENABLE_FLAG = createConstantArr([{
        value: '1',
        name: '启用'
    },
    {
        value: '2',
        name: '停用'
    }
]);

// 阈值管理--阈值类型
export const SYSTYPE = createConstantArr([{
        value: '1',
        name: 'system'
    },
    {
        value: '2',
        name: 'minos'
    },
    {
        value: '3',
        name: 'colourType'
    },
    {
        value: '4',
        name: 'cacheExpireTime'
    },
    {
        value: '5',
        name: 'asyncFlagType'
    },
    {
        value: '6',
        name: 'refreshIntervalType'
    },
    {
        value: '7',
        name: 'channelContentListCountType'
    },
    {
        value: '8',
        name: 'channelContentUpListCountType'
    },
    {
        value: '9',
        name: 'channelContentUpListTimeType'
    },
    {
        value: '10',
        name: 'contentDetailsTimeType'
    },
    {
        value: '11',
        name: 'channel'
    }
]);
//通用展示位 目标类型相应的跳转地址
export const DISPLAY_LABEL = createConstantArr([{
        value: 1,
        label: '球队',
        placeholder: '请输入球队名称关键词快速查询'
    },
    {
        value: 2,
        label: '球员',
        placeholder: '请输入球员名称关键词快速查询'
    },
    {
        value: 3,
        label: '节目',
        placeholder: '请输入节目名称关键词快速查询'
    },
    {
        value: 4,
        label: '作者',
        placeholder: '请输入作者名称关键词快速查询'
    },
    {
        value: 5,
        label: '赛事',
        placeholder: '请输入赛事名称关键词快速查询'
    },
    {
        value: 6,
        label: '栏目',
        placeholder: '请输入栏目名称关键词快速查询'
    },
    {
        value: 7,
        label: '小组',
        placeholder: '请输入小组名称关键词快速查询'
    },
    {
        value: 8,
        label: '专题',
        placeholder: '请输入专题名称关键词快速查询'
    },
    {
        value: 9,
        label: '比赛',
        placeholder: '请输入比赛名称关键词快速查询'
    },
    {
        value: 10,
        label: 'URL',
        placeholder: '请输入URL地址'
    }
]);
// 通用展示位--目标类型
export const DISPLAY_JUMP_TYPE = createConstantArr([{
        value: 1,
        name: '球队'
    },
    {
        value: 2,
        name: '球员'
    },
    {
        value: 3,
        name: '节目'
    },
    {
        value: 4,
        name: '作者'
    },
    {
        value: 5,
        name: '主题-赛事'
    },
    {
        value: 6,
        name: '主题-栏目'
    },
    {
        value: 7,
        name: '主题-小组'
    },
    {
        value: 8,
        name: '主题-专题'
    },
    {
        value: 9,
        name: '主题-比赛'
    },
    {
        value: 10,
        name: 'URL'
    }
]);
//通用展示位状态
export const DISPLAY_STATUS = createConstantArr([{
        value: 1,
        status: '停用'
    },
    {
        value: 2,
        status: '启用'
    }
]);
// 广告位设置-创建-跳转类型相应的跳转地址
export const ADVMENT_LABEL = createConstantArr([{
        value: 1,
        label: '节目ID',
        placeholder: '请输入节目ID'
    },
    {
        value: 2,
        label: '资讯ID',
        placeholder: '请输入资讯ID'
    },
    {
        value: 3,
        label: '帖子ID',
        placeholder: '请输入帖子ID（圈子ID，帖子ID）'
    },
    {
        value: 4,
        label: '圈子ID',
        placeholder: '请输入圈子ID'
    },
    {
        value: 5,
        label: '视频ID',
        placeholder: '请输入视频ID'
    },
    {
        value: 6,
        label: '专题ID',
        placeholder: '请输入专题ID'
    },
    {
        value: 7,
        label: '内链地址',
        placeholder: '请输入内链地址'
    },
    {
        value: 8,
        label: '外链地址',
        placeholder: '请输入外链地址'
    },
    {
        value: 9,
        label: '合集ID',
        placeholder: '请输入合集ID'
    }
]);

export const ADV_TYPE_LIST = createConstantArr([{
        value: '1',
        name: '资讯'
    },
    {
        value: '2',
        name: '视频'
    },
    {
        value: '3',
        name: '专题'
    },
    {
        value: '4',
        name: '帖子'
    },
    {
        value: '5',
        name: '视频合集'
    }
]);

// 专题和频道内容类型
export const CONTENT_LIST_TYPES = createConstantArr([{
        name: '资讯',
        id: '0',
        value: '0'
    },
    {
        name: 'mip视频',
        id: '4',
        value: '4'
    },
    {
        name: 'mip视频合集',
        id: '5',
        value: '5'
    },
    {
        name: '专题',
        id: '6',
        value: '6'
    },
    {
        name: '帖子',
        id: '7',
        value: '7'
    },
    {
        name: 'PP号',
        id: '9',
        value: '9'
    },
    {
        name: '通用',
        value: '11',
        id: '11'
    },
    {
        name: '栏目',
        value: '13',
        id: '13'
    },
    {
        name: '小组',
        value: '14',
        id: '14'
    },
    {
        name: '比赛',
        value: '15',
        id: '15'
    },
    {
        name: '节目',
        value: '16',
        id: '16'
    }
]);

// 爬虫评论管理内容类型
export const REPTILE_CONTENTTYPE_LIST = createConstantArr([{
        name: '资讯',
        id: '0'
    },
    {
        name: 'mip视频',
        id: '4'
    },
    {
        name: '直播节目',
        id: '10'
    }
]);

//频道展示管理--推荐比赛--比赛状态
export const MATCH_STATUS = createConstantArr([{
        value: 0,
        name: '未开始'
    },
    {
        value: 1,
        name: '进行中'
    },
    {
        value: 2,
        name: '已结束'
    }, {
        value: 3,
        name: '时间未定'
    }, {
        value: 4,
        name: '延期'
    }, {
        value: 5,
        name: '未中止'
    }, {
        value: 6,
        name: '取消'
    }
]);

// 爬虫资讯状态
export const REPTILE_STATUS = createConstantArr([{
        value: 2,
        name: '未编辑'
    },
    {
        value: 1,
        name: '已使用'
    }
]);

// 资讯库--链接类型
export const LIBRARY_LINK_TYPES = createConstantArr([{
        value: 0,
        key: 'inter',
        name: '内部页面',
        placeholder: '请输入pptvsports://开头的原生页面路由地址',
        errMsg: '格式不正确，请输入pptvsports://开头的原生页面路由地址',
        reg: /^pptvsports:\/\/[^\s]+$/
    },
    {
        value: 7,
        key: 'hs',
        name: '内链H5',
        placeholder: '请输入http://或https://开头的内链H5页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的内链H5页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    },
    {
        value: 8,
        key: 'outer',
        name: '外链',
        placeholder: '请输入http://或https://开头的外链页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的外链页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    }
]);
export const COMMON_JUMP_LINK_TYPES = createConstantArr([{
        value: 1,
        key: 'inter',
        name: '内部页面',
        placeholder: '请输入pptvsports://开头的原生页面路由地址',
        errMsg: '格式不正确，请输入pptvsports://开头的原生页面路由地址',
        reg: /^pptvsports:\/\/[^\s]+$/
    },
    {
        value: 2,
        key: 'hs',
        name: '内链H5',
        placeholder: '请输入http://或https://开头的内链H5页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的内链H5页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    },
    {
        value: 3,
        key: 'outer',
        name: '外链',
        placeholder: '请输入http://或https://开头的外链页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的外链页面地址',
        reg: /^(http|https):\/\/[^\s]+$/
    }
]);
// 楼层跳转链接类型
export const FLOOR_LINK_TYPES = createConstantArr([{
        key: 'inter',
        value: '1',
        name: '内部页面',
        placeholder: '请输入pptvsports://开头的原生页面路由地址',
        errMsg: '格式不正确，请输入pptvsports://开头的原生页面路由地址',
        reg: /^pptvsports:\/\//
    },
    {
        key: 'h5',
        value: '2',
        name: '内链H5',
        placeholder: '请输入http://或https://开头的内链H5页面地址',
        errMsg: '格式不正确，请输入http://或https://开头的内链H5页面地址',
        reg: /^(http|https):\/\//
    }
]);
// 关联内容资讯类型条件查询
export const QUERY_INFO_TYPES = createConstantArr([{
        value: true,
        key: 'my',
        name: '我的资讯'
    },
    {
        value: false,
        key: 'all',
        name: '全部资讯'
    }
]);

// mip视频查询条件
export const MIP_VIDEO_QUERYS = createConstantArr([{
        value: 1,
        key: 'title',
        name: '视频标题',
        placeholder: '请输入视频标题',
        maxlength: 30
    },
    {
        value: 2,
        key: 'id',
        name: '视频ID',
        placeholder: '请输入视频ID',
        maxlength: 11
    }
]);

// 灌水评论状态 1、未开始 2、进行中 3、已完成 4、失败
export const IMPORT_COMMENT_STATUS = createConstantArr([{
        value: 1,
        key: 'before',
        name: '未开始'
    },
    {
        value: 2,
        key: 'doing',
        name: '进行中'
    },
    {
        value: 3,
        key: 'done',
        name: '已完成'
    },
    {
        value: 4,
        key: 'failed',
        name: '失败'
    }
]);

// 评论库-评论来源
export const COMMENT_SOURCE_TYPE = createConstantArr([{
        value: 1,
        key: 'front',
        name: '前台评论'
    },
    {
        value: 2,
        key: 'guide',
        name: '引导评论'
    },
    {
        value: 3,
        key: 'import',
        name: '灌水评论'
    }
]);

export const COMMENT_TYPE = createConstantArr([{
        value: '',
        name: '全部'
    },
    {
        value: 1,
        name: '资讯'
    },
    {
        value: 2,
        name: '视频'
    },
    {
        value: 4,
        name: '节目'
    }
]);

// 推荐库内容类型 1.图文资讯 2.图集资讯 3视频资讯 4 mip视频 5mip视频合集6 专题 7帖子
export const RECOMM_CONTENT_TYPE = createConstantArr([{
        key: 'text',
        value: 1,
        name: '图文',
        contentName: '资讯'
    },
    {
        key: 'picture',
        value: 2,
        name: '图集',
        contentName: '资讯'
    },
    {
        key: 'video',
        value: 3,
        name: '视频',
        contentName: '资讯'
    },
    {
        key: 'mip',
        value: 4,
        name: 'mip视频'
    },
    {
        key: 'set',
        value: 5,
        name: 'mip视频合集',
        disValidCoverPixel: true
    },
    {
        key: 'topic',
        value: 6,
        name: '专题'
    },
    {
        key: 'post',
        value: 7,
        name: '帖子',
        contentName: '帖子',
        disValidCoverPixel: true
    },
    {
        key: 'daily',
        value: 8,
        name: '日报',
        contentName: '资讯'
    },
    {
        key: 'pp',
        value: 9,
        name: 'PP号'
    },
    {
        key: 'shortV',
        value: 10,
        name: 'PGC视频',
        contentName: '资讯'
    },
    {
        key: 'common',
        value: 11,
        name: '通用'
    },
    {
        name: '栏目',
        value: 13,
        key: 'column'
    },

    {
        name: '小组',
        value: 14,
        key: 'group'
    },
    {
        name: '比赛',
        value: 15,
        key: 'match'
    },
    {
        name: '节目',
        value: 16,
        key: 'program'
    }
]);

export const CONTENT_CELL_TYPES = createConstantArr([
    ...RECOMM_CONTENT_TYPE,
    {
        value: '12',
        name: '视频贴',
        contentName: '帖子'
    }
]);

export const LIST_RECOMM_CONTENT_TYPE = createConstantArr([
    ...RECOMM_CONTENT_TYPE,
    {
        key: 'vpost',
        value: 12,
        name: '视频贴',
        contentName: '帖子'
    }
]);

// 灌水任务立即开始时间列表
export const IMPORT_INTERVAL_LIST = createConstantArr([{
        key: '5',
        value: 5,
        name: '5分钟'
    },
    {
        key: '15',
        value: 15,
        name: '15分钟'
    },
    {
        key: '30',
        value: 30,
        name: '30分钟'
    },
    {
        key: '60',
        value: 60,
        name: '1小时'
    },
    {
        key: '180',
        value: 180,
        name: '3小时'
    },
    {
        key: '360',
        value: 360,
        name: '6小时'
    }
]);

// 所属BU
export const BU_TYPE = createConstantArr([{
        key: 'demestic',
        value: '03',
        name: '国内足球'
    },
    {
        key: 'comm',
        value: '04',
        name: '综合'
    },
    {
        key: 'plat',
        value: '05',
        name: '平台'
    },
    {
        key: 'inter',
        value: '06',
        name: '国际足球'
    },
    {
        key: 'england',
        value: '07',
        name: '英超'
    },
    {
        key: 'basket',
        value: '08',
        name: '篮球'
    },
    {
        key: 'finght',
        value: '09',
        name: '格斗'
    }
]);
// 结算类型
export const SETTLE_TYPE = createConstantArr([{
        key: 'demestic',
        value: 1,
        name: '签约作者'
    },
    {
        key: 'inter',
        value: 2,
        name: '申请作者'
    },
    {
        key: 'comm',
        value: 3,
        name: '其他'
    }
]);
// 展示类型
export const SHOW_TYPE = createConstantArr([{
        key: 'star',
        value: 1,
        name: '明星大咖'
    },
    {
        key: 'org',
        value: 2,
        name: '机构号'
    },
    {
        key: 'report',
        value: 3,
        name: '资深媒体人、记者'
    },
    {
        key: 'comm',
        value: 4,
        name: '普通作者'
    }
]);
// 自媒体资讯状态
export const MEDIA_INFO_STATUS = createConstantArr([{
        key: 'published',
        value: 1,
        name: '已发布'
    },
    {
        key: 'hidden',
        value: 2,
        name: '已隐藏'
    },
    {
        key: 'approving',
        value: 4,
        name: '待审核'
    },
    {
        key: 'refused',
        value: 5,
        name: '审核驳回'
    }
]);

// 商品状态
export const GOODS_STATUS = createConstantArr([{
        key: 'sell',
        value: 1,
        name: '可售'
    },
    {
        key: 'unsell',
        value: 2,
        name: '不可售'
    }
]);

// 广告状态
export const ADV_STATUS_LIST = createConstantArr([{
        name: '上架',
        id: '1'
    },
    {
        name: '下架',
        id: '0'
    }
]);

// 广告链接
export const ADV_URL_LIST = createConstantArr([{
        name: '无链接',
        id: '9'
    },
    {
        name: '页面路由',
        id: '10'
    },
    {
        name: 'h5跳转',
        id: '7'
    }
]);

// 专题上架状态
export const TOPIC_PUBLISH_STATUS_TYPES = createConstantArr([{
        key: 'unshelf',
        value: 0,
        name: '下架'
    },
    {
        key: 'shelf',
        value: 1,
        name: '上架'
    }
]);

export const TOPIC_SHELF_TYPES = createConstantArr([{
        key: 'auto',
        value: 1,
        name: '自动上架'
    },
    {
        key: 'check',
        value: 2,
        name: '审核上架'
    },
    {
        key: 'hand',
        value: 3,
        name: '手工维护'
    }
]);

// 展示主题类型
export const THEME_TYPE = createConstantArr([{
        value: 1,
        name: '栏目'
    },
    {
        value: 2,
        name: '赛事'
    },
    {
        value: 3,
        name: '专题'
    },
    {
        value: 4,
        name: '节目集'
    },
    {
        value: 5,
        name: '小组'
    },
    {
        value: 6,
        name: '比赛场次'
    }
]);

// 展示主题标签类型
export const THEME_LABEL_TYPE = createConstantArr([{
        value: 1,
        name: '运动'
    },
    {
        value: 2,
        name: '赛事'
    },
    {
        value: 3,
        name: '赛季'
    },
    {
        value: 4,
        name: '阶段'
    },
    {
        value: 5,
        name: '小组'
    },
    {
        value: 6,
        name: '比赛'
    },
    {
        value: 7,
        name: '球队'
    },
    {
        value: 8,
        name: '球员'
    },
    {
        value: 9,
        name: '自定义'
    }
]);

// 展示主题类型名称提示
export const THEME_PLACEHOLDER_TYPE = createConstantArr([{
        value: 1,
        name: '请输入栏目名称（1-10个字）',
        maxLen: 10
    },
    {
        value: 2,
        name: '请输入赛事名称',
        maxLen: null
    },
    {
        value: 3,
        name: '请输入专题名称（1-30个字）',
        maxLen: 30
    },
    {
        value: 4,
        name: '请输入节目集名称（1-10个字）',
        maxLen: 10
    },
    {
        value: 5,
        name: '请输入小组名称',
        maxLen: null
    },
    {
        value: 6,
        name: '请输入比赛场次名称',
        maxLen: null
    }
]);

export const getItemByKey = function(list, val) {
    let temp = list.find(item => {
        return item.key == val;
    });
    return temp ? temp : {};
};

export const getItemByValue = function(list, val) {
    let temp = list.find(item => {
        return item.value == val;
    });
    return temp ? temp : {};
};

export const getItemById = function(list, val) {
    let temp = list.find(item => {
        return item.competitionId == val;
    });
    return temp ? temp : {};
};