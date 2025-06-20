import {type ImagePickerAsset} from 'expo-image-picker'
import {$Typed, AppBskyEmbedImages} from '@atproto/api'

import {DAO_SERVICE, PUBLIC_BSKY_SERVICE} from '#/lib/constants'
import server from '#/server'
import {type ProposalBlockType} from './state'

export function renderBlockToHTML(
  block: ProposalBlockType,
  uploadedEmbed: Awaited<ReturnType<typeof uploadEmbeds>>,
  uploaderDid: string,
) {
  let mediaDom = ''
  if (uploadedEmbed) {
    if (uploadedEmbed.images) {
      mediaDom = uploadedEmbed.images
        .map((embed, index) => {
          return `<img src="${embed.url}" alt="image" />`
        })
        .join('')
    }
    if (uploadedEmbed.video) {
      mediaDom = `<video controls autoPlay loop muted playsInline style="width: 100%; height: 100%; object-fit: cover;"><source src="${uploadedEmbed.video}" type="${uploadedEmbed.mime}" /></video>`
    }

    mediaDom = `<div>${mediaDom}</div>`
  }

  if (block.type === 'content') {
    return `<p>${block.richtext.unicodeText}</p>${mediaDom}`
  }
  if (block.type === 'module-title') {
    return `<h2>${block.richtext.unicodeText}</h2>`
  }
  return `<p>unknwon block type: ${block.type}</p>`
}

export async function uploadEmbeds(block: ProposalBlockType) {
  if (block.embed.media?.type === 'images') {
    const resList = await Promise.all(
      block.embed.media.images.map(image =>
        server.dao('POST /file/upload', {
          file: image.source.file!,
          fileType: 1,
        }),
      ),
    )
    const images = resList.map(res => ({
      url: `${DAO_SERVICE}/api/v1/file/download?fileId=${
        res?.fileId.split('-')[1]
      }&fileType=1`,
    }))
    return {
      images,
    }
  }

  if (
    block.embed.media?.type === 'video' &&
    block.embed.media.video.status === 'done'
  ) {
    return {
      mime: block.embed.media.video.asset.mimeType,
      video: `${DAO_SERVICE}/api/v1/file/download?fileId=${
        block.embed.media.video?.fileId.split('-')[1]
      }&fileType=2`,
    }
  }

  return undefined
}

export function videoInfoToFile(asset: ImagePickerAsset): File {
  var arr = asset.uri.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], 'video.mp4', {type: mime})
}
