import Quill from 'quill';
let Parchment = Quill.import("parchment");

const DataURLAttribute = new Parchment.Attributor.Attribute('data-url', 'data-url', {
  scope: Parchment.Scope.Inline,
});
const DataRouterAttribute = new Parchment.Attributor.Attribute('data-router', 'data-router', {
  scope: Parchment.Scope.Inline,
});
export { DataURLAttribute, DataRouterAttribute };
