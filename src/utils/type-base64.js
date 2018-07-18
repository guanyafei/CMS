export function dataURLtoMimeType(dataURL) {
  const BASE64_MARKER = ';base64,'
  let data, mimeType

  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    let parts = dataURL.split(',')
    let contentType = parts[0].split(':')[1]
    data = decodeURIComponent(parts[1])
  } else {
    let parts = dataURL.split(BASE64_MARKER)
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length

    data = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      data[i] = raw.charCodeAt(i)
    }
  }

  let arr = data.subarray(0, 4)
  let header = ''
  for (let i = 0; i < arr.length; i++) {
    header += arr[i].toString(16)
  }
  switch (header) {
    case '89504e47':
      mimeType = 'image/png'
      break
    case '47494638':
      mimeType = 'image/gif'
      break
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
      mimeType = 'image/jpeg'
      break
    default:
      mimeType = '' // Or you can use the blob.type as fallback
      break
  }

  return mimeType
}
