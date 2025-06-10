import { useCallback } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { Image } from "expo-image";
import { type AppBskyActorDefs } from '@atproto/api'
import { msg, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import * as Toast from '#/view/com/util/Toast'
import { atoms as a, useTheme } from '#/alf'
import * as Dialog from '#/components/Dialog'
import { Text } from '#/components/Typography'

import QRCode from 'react-native-qrcode-svg';

const SCREEN_HEIGHT = Dimensions.get('window').height

export function ReceivePointsDialog({
                                   profile,
                                   control,
                                   onUpdate,
                                 }: {
  control: Dialog.DialogControlProps
  onUpdate?: () => void
}) {
  const { _ } = useLingui()

  const onPressCancel = useCallback(() => {
    // Toast.show('接收成功', 'check', 'center')
    control.close()
  }, [control])

  return (
    <Dialog.Outer
      control={control}
      nativeOptions={{
        minHeight: SCREEN_HEIGHT,
      }}
      testID="sendPointsModal"
    >
      <DialogInner
        profile={profile}
        onUpdate={onUpdate}
        onPressCancel={onPressCancel}
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
      label={_(msg`Receive Points`)}
      style={[a.overflow_hidden, { marginTop: '50%' }]}
      header={
        <Dialog.Header
          renderRight={cancelButton}
          style={[a.border_transparent]}
        >
          <Dialog.HeaderText>
            接收积分
          </Dialog.HeaderText>
        </Dialog.Header>
      }
    >
      <View style={[a.flex_row, a.justify_center]}>
        <View style={[styles.qrcode_wrap, a.border]}>
          <View style={[styles.qrcode_inner, a.flex_row, a.align_center, a.justify_center]}>
            <QRCode
              size={110}
              value="Just some string value"
              logo={require('#/assets/close.svg')}
              logoSize={25}
              logoBackgroundColor='transparent'
            />
          </View>
        </View>
      </View>
      <Text style={[a.mt_md, a.text_center, a.font_bold, { color: '#42576C' }]}>接收码</Text>
    </Dialog.ScrollableInner>
  )
}

const styles = StyleSheet.create({
  qrcode_wrap: {
    width: 170,
    height: 170,
    borderRadius: 12,
    borderColor: '#D4DBE2',
    backgroundColor: '#F1F3F5',
    padding: 13
  },
  qrcode_inner: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
})
