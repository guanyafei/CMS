import Quill from 'quill';
const Parchment = Quill.import('parchment');
const Block = Quill.import('blots/block');
const Container = Quill.import('blots/container');
const BlockEmbed = Quill.import('blots/block/embed');
const Embed = Quill.import('blots/embed');
const Break = Quill.import('blots/break');
const Inline = Quill.import('blots/inline');
const TextBlot = Quill.import('blots/text');
import { LayoutRow, ImgWithCaption, Caption } from './custom-img';
Block.allowedChildren = [Inline, Embed, Parchment.Embed, TextBlot, LayoutRow, ImgWithCaption, Caption];;

export default Block;
