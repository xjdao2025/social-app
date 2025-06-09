import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { type AppBskyActorDefs } from '@atproto/api'
import { msg, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { emailRegExp, phoneNumberRegExp } from "#/lib/tools";
import { logger } from '#/logger'
import { isWeb } from '#/platform/detection'
import * as Toast from '#/view/com/util/Toast'
import { atoms as a, useTheme } from '#/alf'
import { Button, ButtonText } from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as TextField from '#/components/forms/TextField'
import { QrCode_Scan } from "#/components/icons/QrCode";
import * as Prompt from '#/components/Prompt'
import { Text } from '#/components/Typography'
import { Image } from "expo-image";

const SCREEN_HEIGHT = Dimensions.get('window').height

export function SendPointsDialog({
                                   profile,
                                   control,
                                   onUpdate,
                                 }: {
  control: Dialog.DialogControlProps
  onUpdate?: () => void
}) {
  const { _ } = useLingui()
  const cancelControl = Dialog.useDialogControl()
  const [dirty, setDirty] = useState(false)

  // 'You might lose unsaved changes' warning
  useEffect(() => {
    if (isWeb && dirty) {
      const abortController = new AbortController()
      const { signal } = abortController
      window.addEventListener('beforeunload', evt => evt.preventDefault(), {
        signal,
      })
      return () => {
        abortController.abort()
      }
    }
  }, [dirty])

  const onPressCancel = useCallback(() => {
    if (dirty) {
      cancelControl.open()
    } else {
      control.close()
    }
  }, [dirty, control, cancelControl])

  return (
    <Dialog.Outer
      control={control}
      nativeOptions={{
        preventDismiss: dirty,
        minHeight: SCREEN_HEIGHT,
      }}
      testID="sendPointsModal"
    >
      <DialogInner
        profile={profile}
        onUpdate={onUpdate}
        onPressCancel={onPressCancel}
      />

      <Prompt.Basic
        control={cancelControl}
        title={_(msg`Discard changes?`)}
        description={_(msg`Are you sure you want to discard your changes?`)}
        onConfirm={() => control.close()}
        confirmButtonCta={_(msg`Discard`)}
        confirmButtonColor="negative"
      />
    </Dialog.Outer>
  )
}

function DialogInner({
   profile = {},
   onUpdate,
   onPressCancel,
 }: {
  profile: AppBskyActorDefs.ProfileViewDetailed
  onUpdate?: () => void
  onPressCancel: () => void
}) {
  const { _ } = useLingui()
  const t = useTheme()
  const control = Dialog.useDialogContext()
  const [giftAccount, setGiftAccount] = useState('')
  const [giftPoints, setGiftPoints] = useState('')

  const onPressSave = useCallback(async () => {
    try {
      // await updateProfileMutation({
      //   profile,
      //   updates: {
      //     displayName: displayName.trimEnd(),
      //     description: description.trimEnd(),
      //   },
      // })
      onUpdate?.()
      control.close()
      Toast.show(_(msg({ message: 'Profile updated', context: 'toast' })))
    } catch (e: any) {
      logger.error('Failed to update user profile', { message: String(e) })
    }
  }, [
    profile,
    onUpdate,
    control,
    giftAccount,
    giftPoints,
    _,
  ])

  const displayNameInvalid = useMemo(() => {
    if (!giftAccount) return false

    const regs = [
      emailRegExp,
      phoneNumberRegExp,
    ];
    for (const reg of regs) {
      if (reg.test(giftAccount)) return false
    }

    return true
  }, [giftAccount])

  const giftPointsInvalid = useMemo(() => {
    if (!giftPoints) return false

    return !/^[1-9]\d*$/.test(giftPoints);

  }, [giftPoints])

  const cancelButton = useCallback(
    () => (
      <Pressable
        accessibilityRole={'button'}
        style={[{ marginRight: 15 }]}
        onPress={onPressCancel}
      >
        <Image
          accessibilityIgnoresInvertColors
          source={require('#/assets/close.svg')}
          alt="close"
          style={[{ width: 16, height: 16 }]}
        />
      </Pressable>
    ),
    [onPressCancel, _],
  )

  return (
    <Dialog.ScrollableInner
      label={_(msg`Edit profile`)}
      style={[a.overflow_hidden, { marginTop: '50%' }]}
      header={
        <Dialog.Header
          renderRight={cancelButton}
          style={[a.border_transparent]}
        >
          <Dialog.HeaderText>
            发送积分
          </Dialog.HeaderText>
        </Dialog.Header>
      }
    >
      <View style={[a.gap_xl]}>
        <View style={styles.account}>
          <TextField.LabelText>
            手机号/邮箱
          </TextField.LabelText>
          <TextField.Root isInvalid={displayNameInvalid}>
            <Dialog.Input
              defaultValue={giftAccount}
              onChangeText={setGiftAccount}
              label={_(msg`Display name`)}
              placeholder={'请输入手机号/邮箱'}
              testID="editProfileDisplayNameInput"
            />
          </TextField.Root>
          <Pressable
            accessibilityHint=""
            accessibilityLabel={_(msg`Display name`)}
            style={styles.scan}
            onPress={() => {
              console.log('scan>>>>>')
            }}
          >
            <QrCode_Scan
              fill={'#6F869F'}
              size={'md'}
              style={[a.z_10]}
            />
          </Pressable>
          {displayNameInvalid && (
            <TextField.SuffixText
              style={[
                a.text_sm,
                a.mt_xs,
                a.font_bold,
                { color: t.palette.negative_400 },
              ]}
              label={_(msg`Display name is too long`)}
            >
              <Trans>
                请输入正确格式
              </Trans>
            </TextField.SuffixText>
          )}
        </View>

        <View>
          <TextField.LabelText>
            <Trans>积分</Trans>
          </TextField.LabelText>
          <TextField.Root isInvalid={giftPointsInvalid}>
            <Dialog.Input
              defaultValue={giftPoints}
              onChangeText={setGiftPoints}
              label={_(msg`Display name`)}
              placeholder={_(msg`请输入赠送积分`)}
              testID="editProfileDescriptionInput"
              inputMode={'numeric'}
            />
          </TextField.Root>
          {giftPointsInvalid && (
            <TextField.SuffixText
              style={[
                a.text_sm,
                a.mt_xs,
                a.font_bold,
                { color: t.palette.negative_400 },
              ]}
              label={_(msg`Description is too long`)}
            >
              <Trans>
                请输入正确格式
              </Trans>
            </TextField.SuffixText>
          )}
        </View>
        <View style={[a.flex_row]}>
          <Text style={styles.cur_pints_label}>当前积分：</Text>
          <Text style={styles.cur_pints_value}>1000</Text>
        </View>
        <Button
          label={_(msg`Save`)}
          onPress={onPressSave}
          disabled={
            !giftAccount ||
            !giftPoints ||
            displayNameInvalid ||
            giftPointsInvalid
          }
          size="small"
          color="primary"
          variant="solid"
          style={[styles.confirm, a.rounded_sm]}
          testID="editProfileSaveBtn"
        >
          <ButtonText style={[a.text_md]}>
            <Trans>确认</Trans>
          </ButtonText>
        </Button>
      </View>
    </Dialog.ScrollableInner>
  )
}

const styles = StyleSheet.create({
  account: {
    position: 'relative'
  },
  scan: {
    position: 'absolute',
    right: 12,
    top: 31,
    zIndex: 10
  },
  cur_pints_label: {
    color: '#6F869F'
  },
  cur_pints_value: {
    color: '#42576C',
    fontWeight: 500
  },
  confirm: {
    width: 76,
    margin: 'auto'
  }
})
