import appManagement from './app-mana';
import advManagement from './adv-mana';
import authorManagement from './author-mana';
import commentManagement from './comment-mana';
import common from './common';
import components from './components';
import contentManagement from './content-mana';
import cooperationManagement from './cooperation-mana';
import dataChannel from './data-channel';
import matchAtmo from './match-atmo';
import infoPublishManagement from './publish-mana';
import reptileManagement from './reptile-mana';
import searchManagement from './search-mana';
import userManagement from './user-mana';
import configManagement from './config-mana';
import systemManagement from './system-mana';
import frontShowConfigManagement from './frontShow-mana';
import theme from './theme';
import infoFlow from './info-flow';
import commDisplay from './comm-display';
import program from './program';


export default {
    ...frontShowConfigManagement,
    ...configManagement,
    ...advManagement,
    ...appManagement,
    ...authorManagement,
    ...commentManagement,
    ...common,
    ...components,
    ...contentManagement,
    ...cooperationManagement,
    ...dataChannel,
    ...matchAtmo,
    ...infoPublishManagement,
    ...reptileManagement,
    ...searchManagement,
    ...userManagement,
    ...systemManagement,
    ...theme,
    ...infoFlow,
    ...commDisplay,
    ...program
};
