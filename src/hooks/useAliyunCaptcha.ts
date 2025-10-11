import {useRef} from 'react'

import promiseWithResolver from '#/lib/promiseWithResolver'

export const ALIYUN_CAPTCHA_SCENE_ID = {
  REGISTER: '14nzch7b',
  LOGIN: '14nzch7b',
}

export const ALIYUN_CAPTCHA_ERROR = {
  USER_CANCELED: new Error('User canceled captcha'),
}

type Captcha = {
  show: () => void
  hide: () => void
}

export default function useAliyunCaptcha() {
  const captchaRef = useRef<Captcha | null>(null)

  const showCaptcha = (SceneId: string) => {
    const {promise, resolve, reject} = promiseWithResolver<string>()

    // @ts-ignore
    window.initAliyunCaptcha({
      SceneId,
      mode: 'popup',
      onError: reject,
      success: resolve,
      onClose: () => reject(ALIYUN_CAPTCHA_ERROR.USER_CANCELED),
      getInstance: (captcha: Captcha) => {
        captchaRef.current = captcha
        captcha.show()
      },
      slideStyle: {
        width: 360,
        height: 40,
      },
      language: 'cn',
    })

    return promise
  }

  const hideCaptcha = () => {
    captchaRef.current?.hide()
  }

  return {showCaptcha, hideCaptcha}
}
