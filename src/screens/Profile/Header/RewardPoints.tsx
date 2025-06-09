import React from 'react'
import { Image as RNImage, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import {Image} from 'expo-image'

import {atoms as a, useTheme} from '#/alf'
import {ArrowRight_Angle} from '#/components/icons/Arrow'
import {QrCode_Icon, QrCode_Scan} from '#/components/icons/QrCode'
import {Text} from '#/components/Typography'
import { useDialogControl } from "#/components/Dialog";
import { SendPointsDialog } from "#/screens/Profile/Header/SendPointsDialog";
// const splashImageUri = RNImage.resolveAssetSource(pointsBg).uri

export function ProfileHeaderRewardPoints() {
  const t = useTheme()
  const sendPointsControl = useDialogControl()

  return (
    <View style={[styles.container, [a.mt_md, a.px_lg, a.py_xl]]}>
      <Image
        accessibilityIgnoresInvertColors
        source={require('./assets/points_bg.png')}
        style={[StyleSheet.absoluteFillObject, {left: -5, right: -5}]}
        contentFit={'fill'}
      />
      <View>
        <Text style={[t.atoms.text_inverted]}>积分</Text>
        <View style={[a.mt_md, a.flex_row, a.align_center]}>
          <Text
            style={[
              a.text_family_ddin,
              a.font_bold,
              a.text_2xl,
              t.atoms.text_inverted,
            ]}>
            1,800
          </Text>
          <Pressable accessibilityRole="button" onPress={() => {}}>
            <View style={[a.flex_row, a.align_center, a.ml_md]}>
              <Text style={[{opacity: 0.7}, [t.atoms.text_inverted]]}>
                明细
              </Text>
              <ArrowRight_Angle
                fill={'#6F869F'}
                style={[a.ml_xs]}
                size={'xs'}
              />
            </View>
          </Pressable>
        </View>
      </View>
      <View style={[a.flex_row, a.align_center, a.gap_lg]}>
        <TouchableWithoutFeedback accessibilityRole="button" onPress={() => sendPointsControl.open()}>
          <View style={[a.flex_col, a.align_center]}>
            <View style={[styles.circle, a.mb_sm]}>
              <QrCode_Scan size={'md'} fill={'#fff'} />
            </View>
            <Text style={[{opacity: 0.7}, [t.atoms.text_inverted, a.user_select_none]]}>
              发送积分
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <SendPointsDialog control={sendPointsControl} />
        <TouchableWithoutFeedback accessibilityRole="button" onPress={() => {}}>
          <View style={[a.flex_col, a.align_center]}>
            <View style={[styles.circle, a.mb_sm]}>
              <QrCode_Icon size={'md'} />
            </View>
            <Text style={[{opacity: 0.7}, [t.atoms.text_inverted]]}>
              接收积分
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
