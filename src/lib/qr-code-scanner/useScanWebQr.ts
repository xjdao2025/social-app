import {useEffect} from 'react'
import jsQR from 'jsqr'

import promiseWithResolver from '#/lib/promiseWithResolver'

function createVideoEl() {
  const video = document.createElement('video')
  video.autoplay = true
  video.muted = true
  video.style.width = '100vw'
  video.style.height = '100%'
  video.style.position = 'fixed'
  video.style.top = '0'
  video.style.background = 'black'
  return video
}

let animationId: number
let mediaStream: MediaStream

export default function useScanWebQr() {
  async function scanQR(video: HTMLVideoElement = createVideoEl()) {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      throw new Error('您的浏览器不支持摄像头访问功能。请升级到最新版浏览器！')
    }

    if (navigator.permissions?.query) {
      const status = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      })

      if (status.state === 'denied') {
        throw new Error('您已拒绝摄像头权限，请在浏览器设置中手动开启。')
      }
    }

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {facingMode: 'environment'},
      })
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          throw new Error(
            '获取摄像头权限失败，请在浏览器中允许摄像头访问后重新尝试。',
          )
        }

        if (error.name === 'NotFoundError') {
          throw new Error('未检测到可用摄像头，请确认设备已连接摄像头后重试。')
        }
      }

      throw error
    }
    video.srcObject = mediaStream
    video.setAttribute('playsinline', 'true') // for iOS
    video.play()
    // document.body.appendChild(video)

    const {promise, resolve, reject} = promiseWithResolver<string>()

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    try {
      function scan() {
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          animationId = requestAnimationFrame(scan)
          return
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

        if (qrCode && qrCode.data) {
          resolve(qrCode.data)
          mediaStream.getTracks().forEach(t => t.stop())
          video.srcObject = null
          // document.body.removeChild(video)
        } else {
          animationId = requestAnimationFrame(scan)
        }
      }

      animationId = requestAnimationFrame(scan)
    } catch (e) {
      reject(e)
    }

    return promise
  }

  useEffect(() => {
    return () => {
      destroy()
    }
  }, [])

  const destroy = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop())
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  return {
    scanQR,
    destroy,
  }
}
