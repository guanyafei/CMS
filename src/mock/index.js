import app from './app'
import user from './user'
import label from './label'
import author from './author'
import library from './library'
import channel from './channel'
import publish from './publish';
import cooperation from './cooperation'
import information from './information'
import commentLibrary from './comment-library'
import commentImport from './comment-import'
//import authority from './authority'

export default {
  ...app,
  ...user,
  ...label,
  ...author,
  ...channel,
  ...library,
  ...publish,
  ...cooperation,
  ...information,
  ...commentLibrary, //评论库
  ...commentImport
//...authority
}
