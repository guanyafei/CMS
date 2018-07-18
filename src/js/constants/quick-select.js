import { regionChannelList, foreignCountryList, specialCityList } from './region-setting';

const joinCityListStr = list =>
  list.reduce((str, city) => {
    if (str) {
      str += `,${city.value}`;
    } else {
      str = city.value;
    }
    return str;
  }, '');

const getTerminal = cityStr =>
  regionChannelList.reduce((obj, channel) => {
    if (channel.key !== 'all') {
      obj[channel.key] = {
        cataId: '',
        forbidden: cityStr,
        forbiddenReason: '1',
        forceForbidden: cityStr,
        ottSafe: '10',
        status: 1
      };
    }
    return obj;
  }, {});

let foreignBlockedStr = joinCityListStr(foreignCountryList);
let specialBlockedStr = joinCityListStr(specialCityList);
let foreignBlockedStrTeminal = getTerminal(foreignBlockedStr);
let exceptMainBlockedTeminal = getTerminal(`${foreignBlockedStr},${specialBlockedStr}`);

export default [
  {
    key: 'ch-super',
    value: 1,
    name: '中超',
    details: {
      baseClassifySelectedItem: {
        id: '519',
        title: '足球中超'
      },
      infoColumnVal: '3',
      infoBuVal: '03',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '1',
          labelName: '中超',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/1.png?v=20180420'
        },
        {
          labelId: '1215',
          labelName: '2018赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210329',
          title: '中超'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'en-super',
    value: 2,
    name: '英超',
    details: {
      baseClassifySelectedItem: {
        id: '42',
        title: '足球英超'
      },
      infoColumnVal: '2',
      infoBuVal: '07',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '5',
          labelName: '英超',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/5.png?v=20180420'
        },
        {
          labelId: '109',
          labelName: '2017/18赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210514',
          title: '英超'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'la-liga',
    value: 3,
    name: '西甲',
    details: {
      baseClassifySelectedItem: {
        id: '45',
        title: '足球西甲'
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '4',
          labelName: '西甲',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/4.png?v=20180420'
        },
        {
          labelId: '107',
          labelName: '2018赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210291',
          title: '西甲'
        }
      ],
      status: 1,
      terminal: foreignBlockedStrTeminal
    }
  },
  {
    key: 'bundes-liga',
    value: 4,
    name: '德甲',
    details: {
      baseClassifySelectedItem: {
        id: '509',
        title: '足球德甲'
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '6',
          labelName: '德甲',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/6.png?v=20180420'
        },
        {
          labelId: '111',
          labelName: '2018赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210292',
          title: '德甲'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'serie-a',
    value: 5,
    name: '意甲',
    details: {
      baseClassifySelectedItem: {
        id: '44',
        title: '足球意甲'
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '7',
          labelName: '意甲',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/7.png?v=20180420'
        },
        {
          labelId: '186',
          labelName: '2017/18赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210290',
          title: '意甲'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'hand',
    value: 6,
    name: '法甲',
    details: {
      baseClassifySelectedItem: {
        id: '527',
        title: '足球法甲'
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '9',
          labelName: '法甲',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/9.png?v=20180420'
        },
        {
          labelId: '117',
          labelName: '2017/18赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210521',
          title: '法甲'
        }
      ],
      status: 1,
      terminal: foreignBlockedStrTeminal
    }
  },
  {
    key: 'world-cup',
    value: 7,
    name: '世界杯',
    details: {
      baseClassifySelectedItem: {
        id: '517',
        title: '足球世界杯'
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '13',
          labelName: '世界杯',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/13.png?v=20180420'
        },
        {
          labelId: '126',
          labelName: '2018俄罗斯世界杯',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210297',
          title: '世界杯'
        }
      ],
      status: 1,
      terminal: {}
    }
  },
  {
    key: 'wwe',
    value: 8,
    name: 'WWE',
    details: {
      baseClassifySelectedItem: {
        id: '574',
        title: '格斗WWE'
      },
      infoColumnVal: '1',
      infoBuVal: '09',
      matchLabels: [
        {
          labelId: '5',
          labelName: '格斗',
          labelType: 3
        },
        {
          labelId: '874',
          labelName: 'WWE',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/874.png?v=1514532202803'
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210359',
          title: 'WWE'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'ufc',
    value: 9,
    name: 'UFC',
    details: {
      baseClassifySelectedItem: {
        id: '573',
        title: '格斗UFC'
      },
      infoColumnVal: '1',
      infoBuVal: '09',
      matchLabels: [
        {
          labelId: '5',
          labelName: '格斗',
          labelType: 3
        },
        {
          labelId: '875',
          labelName: 'UFC',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/875.png?v=1514532197594'
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210358',
          title: 'UFC'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'internal',
    value: 10,
    name: '国际足球',
    details: {
      baseClassifySelectedItem: {
        id: '',
        title: ''
      },
      infoColumnVal: '2',
      infoBuVal: '06',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'ch-league-one',
    value: 11,
    name: '中甲',
    details: {
      baseClassifySelectedItem: {
        id: '529',
        title: '足球中甲'
      },
      infoColumnVal: '3',
      infoBuVal: '03',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '10',
          labelName: '中甲',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/10.png?v=20180420'
        },
        {
          labelId: '1218',
          labelName: '2018赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: {}
    }
  },
  {
    key: 'ch-team',
    value: 12,
    name: '中国之队',
    details: {
      baseClassifySelectedItem: {
        id: '117',
        title: '中国足球'
      },
      infoColumnVal: '3',
      infoBuVal: '03',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        }
      ],
      teamLabels: [
        {
          labelId: '581',
          labelName: '中国',
          labelType: 8,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/team/581.png?v=1498717894155'
        }
      ],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: {}
    }
  },
  {
    key: 'acl',
    value: 13,
    name: '亚冠',
    details: {
      baseClassifySelectedItem: {
        id: '520',
        title: '足球亚冠'
      },
      infoColumnVal: '3',
      infoBuVal: '03',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '3',
          labelName: '亚冠',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/3.png?v=20180420'
        },
        {
          labelId: '1214',
          labelName: '2018赛季',
          labelType: 5
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'voll-super',
    value: 14,
    name: '排超',
    details: {
      baseClassifySelectedItem: {
        id: '1074',
        title: '排球排超联赛'
      },
      infoColumnVal: '1',
      infoBuVal: '04',
      matchLabels: [
        {
          labelId: '17',
          labelName: '排球',
          labelType: 3
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'ch-baseket',
    value: 15,
    name: '中国篮球',
    details: {
      baseClassifySelectedItem: {
        id: '532',
        title: '篮球CBA'
      },
      infoColumnVal: '4',
      infoBuVal: '08',
      matchLabels: [
        {
          labelId: '2',
          labelName: '篮球',
          labelType: 3
        },
        {
          labelId: '836',
          labelName: 'CBA',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/836.png?v=1501052698517'
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'nba',
    value: 16,
    name: 'NBA',
    details: {
      baseClassifySelectedItem: {
        id: '536',
        title: '篮球NBA'
      },
      infoColumnVal: '5',
      infoBuVal: '08',
      matchLabels: [
        {
          labelId: '2',
          labelName: '篮球',
          labelType: 3
        },
        {
          labelId: '840',
          labelName: 'NBA',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/840.png?v=1501052923685'
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  },
  {
    key: 'race-car',
    value: 17,
    name: '赛车',
    details: {
      baseClassifySelectedItem: {
        id: '570',
        title: '竞速其他'
      },
      infoColumnVal: '1',
      infoBuVal: '04',
      matchLabels: [
        {
          labelId: '21',
          labelName: '综合',
          labelType: 3
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [],
      status: 1,
      terminal: {}
    }
  },
  {
    key: 'ch-fa-cup',
    value: 18,
    name: '中国足协杯',
    details: {
      baseClassifySelectedItem: {
        id: '521',
        title: '足球中国足协杯'
      },
      infoColumnVal: '3',
      infoBuVal: '03',
      matchLabels: [
        {
          labelId: '1',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '2',
          labelName: '足协杯',
          labelType: 4,
          labelLogo: 'http://image.suning.cn/uimg/SDSP/competition/2.png?v=20180420'
        }
      ],
      teamLabels: [],
      frontClassifySelectedLabels: [
        {
          id: '210300',
          title: '足协杯'
        }
      ],
      status: 1,
      terminal: exceptMainBlockedTeminal
    }
  }
];
