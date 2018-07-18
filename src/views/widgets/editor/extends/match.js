import Quill from 'quill';
const Parchment = Quill.import('parchment');
const BlockEmbed = Quill.import('blots/block/embed');
const Container = Quill.import('blots/container');
import { formatDate } from 'utils/util';

class Match extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', false);
    node.setAttribute('data-router', `pptvsports://page/live/detail/?section_id=${value.matchitemShowId}`);
    node.innerHTML = renderChildren(value);
    return node;
  }

  optimize() {
    // wrap cols in rows
    super.optimize();
    let childNodes = this.domNode.childNodes;
    Array.from(childNodes).map(child => {
      if (child.nodeType === 3) {
        this.domNode.removeChild(child);
      }
    });
  }
}
Match.blotName = 'match';
Match.className = 'match';
Match.tagName = 'div';

function renderChildren(attrs) {
  const { startTime, matchDes, homeLogo, homeTeam, awayLogo, awayTeam, matchLogo, matchitemShowName } = attrs;
  let domStr = '';
  if (awayTeam) {
    domStr = `
    <div class="match-info">
      <div class="match-time">
        <p class="time">${formatDate(startTime, 'MM月dd日hh:mm')}</p>
        <span class="round">${matchDes}</span>
      </div>
      <div class="match-teams">
        <div class="home-team">
          <span class="logo home" style="background-image: url(${homeLogo});"></span>
          <span class="text">${homeTeam}</span>
        </div>
        <div class="guest-team" >
          <span class="logo guest" style="background-image: url(${awayLogo});"></span>
          <span class="text">${awayTeam}</span>
        </div>
      </div>
    </div>
    <div class="match-link"></div>
    `;
  } else {
    domStr = `
    <div class="match-info">
      <div class="match-time">
        <p class="time">${formatDate(startTime, 'MM月dd日hh:mm')}</p>
        <span class="round">${matchDes}</span>
      </div>
      <div class="match-teams">
        <div class="clash">
          <span class="logo" style="background-image: url(${matchLogo});"></span>
          <span class="clash-text">${matchitemShowName}</span>
        </div>
      </div>
    </div>
    <div class="match-link"></div>
    `;
  }
  return domStr;
}

export { Match };
