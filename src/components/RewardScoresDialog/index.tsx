import { useReducer, useRef, useState } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { useRequest } from 'ahooks'
import { isNaN, isNumber } from 'lodash'

import { colors } from '#/lib/styles'
import * as Toast from '#/view/com/util/Toast'
import { atoms as a, web } from '#/alf'
import * as Dialog from '#/components/Dialog'
import * as Prompt from '#/components/Prompt'
import * as TextField from '#/components/forms/TextField'
import server from '#/server'
import { Admonition } from '../Admonition'
import { Button, ButtonIcon, ButtonText } from '../Button'
import { Loader } from '../Loader'
import { Text } from '../Typography'

type RewardScoresDialogProps = {
  toUserDid: string
  extendInfo?: string
  control: Dialog.DialogControlProps
}

export default function RewardScoresDialog(props: RewardScoresDialogProps) {
  const { toUserDid, control, extendInfo } = props

  const confirmPromptControl = Prompt.usePromptControl()
  const resultPromptControl = Prompt.usePromptControl()
  const duplicatePromptControl = Prompt.usePromptControl()
  const [resultMessage, setResultMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const [state, dispatch] = useReducer(reducer, {
    mutationStatus: 'default',
    error: '',
    score: '',
  })

  const { data: userInfo, refresh: refreshUser } = useRequest(
    async () => {
      const res = await server.dao('POST /user/login-user-detail')
      return res
    },
    { refreshDeps: [control.isOpen] },
  )

  const onCheckAndOpenConfirm = async () => {
    try {
      const score = +state.score
      const isValidNumber = !isNaN(score) && score > 0

      if (!isValidNumber) {
        throw new Error('请输入有效的数字')
      }

      if (score > (userInfo?.score ?? 0)) {
        throw new Error('输入的稻米不能超过当前稻米')
      }

      dispatch({ type: 'setMutationStatus', status: 'default' })

      try {
        const historyStr = localStorage.getItem('reward_history')
        if (historyStr) {
          const history = JSON.parse(historyStr)
          const now = Date.now()
          const isDuplicate = history.some(
            (tx: any) =>
              tx.recipient === toUserDid &&
              tx.amount === score &&
              now - tx.timestamp < 300000 // 5 minutes in ms
          )
          if (isDuplicate) {
            duplicatePromptControl.open()
            return
          }
        }
      } catch (err) {
        console.error('Failed to parse reward history', err)
      }

      confirmPromptControl.open()
    } catch (e: any) {
      dispatch({
        type: 'setError',
        error: e.message || '输入无效',
      })
    }
  }

  const handleReward = async () => {
    try {
      dispatch({
        type: 'setMutationStatus',
        status: 'pending',
      })
      const submitRes = await server.dao(
        'POST /score/reward',
        {
          toUserDid,
          extendInfo: extendInfo || '',
          score: +state.score,
        },
        { getWholeBizData: true },
      )
      if (!submitRes.data) {
        throw new Error(submitRes.message)
      }
      
      setIsSuccess(true)
      setResultMessage(`成功打赏该用户 ${state.score} 稻米！`)
      
      try {
        const amount = Number(state.score)
        const historyStr = localStorage.getItem('reward_history')
        const history = historyStr ? JSON.parse(historyStr) : []
        history.push({ recipient: toUserDid, amount, timestamp: Date.now() })
        localStorage.setItem('reward_history', JSON.stringify(history))
      } catch (e) {
        console.error('Failed to save reward history', e)
      }
      
      dispatch({
        type: 'setMutationStatus',
        status: 'success',
      })
      dispatch({
        type: 'setScore',
        value: '',
      })
      refreshUser()
      resultPromptControl.open()
    } catch (e: any) {
      dispatch({
        type: 'setMutationStatus',
        status: 'error',
      })
      setIsSuccess(false)
      setResultMessage(e.message || '打赏失败')
      resultPromptControl.open()
    }
  }

  const handleResultClose = () => {
    if (isSuccess) {
      control.close()
    }
  }

  const onConfirmDuplicate = () => {
    confirmPromptControl.open()
  }

  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <Dialog.ScrollableInner
        label="打赏稻米"
        style={web({ maxWidth: 400, marginTop: '25vh' })}>
        <Dialog.Close />

        <View style={[a.gap_lg]}>
          <Text style={[a.text_xl, a.font_heavy]}>赞赏</Text>
          <View style={[a.gap_md]}>
            <TextField.Root>
              {/* <TextField.Icon icon={Shield} /> */}
              <TextField.Input
                label="captcha code"
                placeholder="请输入打赏稻米"
                defaultValue=""
                onChangeText={
                  false
                    ? undefined
                    : value => dispatch({ type: 'setScore', value })
                }
                keyboardType="number-pad"
                // autoComplete="email"
                autoCapitalize="none"
              />
            </TextField.Root>
            <Text>当前稻米: {userInfo?.score}</Text>
            {state.error && <Admonition type="error">{state.error}</Admonition>}
          </View>
          <Button
            label="打赏稻米"
            size="large"
            variant="solid"
            color="primary"
            onPress={onCheckAndOpenConfirm}
            style={[a.mt_xl]}
            disabled={!state.score || state.mutationStatus === 'pending'}>
            <ButtonText>确认</ButtonText>
            {state.mutationStatus === 'pending' && <ButtonIcon icon={Loader} />}
          </Button>
        </View>
      </Dialog.ScrollableInner>

      <Prompt.Basic
        control={duplicatePromptControl}
        title="重复操作提醒"
        description="系统检测到您在5分钟内向该用户打赏过同等金额的稻米。您确定要再次打赏吗？"
        onConfirm={onConfirmDuplicate}
        confirmButtonCta="继续打赏"
        cancelButtonCta="取消"
        confirmButtonColor="primary"
      />

      <Prompt.Basic
        control={confirmPromptControl}
        title="确认打赏"
        description={`是否确认打赏该用户 ${state.score} 稻米？`}
        onConfirm={handleReward}
        confirmButtonCta="确认"
        cancelButtonCta="取消"
      />

      <Prompt.Basic
        control={resultPromptControl}
        title={isSuccess ? '打赏成功' : '打赏失败'}
        description={resultMessage}
        onConfirm={handleResultClose}
        confirmButtonCta="确认"
        showCancel={false}
      />
    </Dialog.Outer>
  )
}

type State = {
  mutationStatus: 'pending' | 'success' | 'error' | 'default'
  error: string
  score: string
  // email: string
  // token: string
}

type Action =
  | {
    type: 'setError'
    error: string
  }
  | {
    type: 'setMutationStatus'
    status: State['mutationStatus']
  }
  | {
    type: 'setScore'
    value: string
  }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setError': {
      return {
        ...state,
        error: action.error,
        mutationStatus: 'error',
      }
    }
    case 'setMutationStatus': {
      return {
        ...state,
        error: '',
        mutationStatus: action.status,
      }
    }
    case 'setScore': {
      return {
        ...state,
        score: action.value,
      }
    }
  }
}
