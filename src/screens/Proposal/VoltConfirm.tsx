import {forwardRef, useImperativeHandle, useLayoutEffect, useState} from 'react'
import {StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {View} from 'react-native'
import {Image} from 'expo-image'
import {RemoveScrollBar} from 'react-remove-scroll-bar'

import {colors} from '#/lib/styles'
import {select, useTheme} from '#/alf'
import {atoms as a} from '#/alf'
import {Button} from '#/components/Button'
import {Portal} from '#/components/Portal'
import {Text} from '#/components/Typography'

type VoltType = 'agree' | 'disagree'

type VoltConfirmProps = {
  // controls
  zIndex?: number
  onConfirm: (voltFor: VoltType) => Promise<void>
}

export type VoltConfirmRef = {
  open(nextVoltFor: VoltType): void
}

const VoltConfirm = forwardRef<VoltConfirmRef, VoltConfirmProps>(
  function VoltConfirm(props, ref) {
    const {zIndex = 1000, onConfirm} = props
    const [popupVisible, setPopupVisible] = useState(false)
    const [showPopupDelayedExit, setShowPopupDelayedExit] =
      useState(popupVisible)
    const [voltFor, setVoltFor] = useState<VoltType>('agree')
    const t = useTheme()

    useImperativeHandle(
      ref,
      () => {
        return {
          open(nextVoltFor: VoltType) {
            setVoltFor(nextVoltFor)
            setPopupVisible(true)
          },
        }
      },
      [],
    )

    useLayoutEffect(() => {
      if (popupVisible !== showPopupDelayedExit) {
        if (popupVisible) {
          setShowPopupDelayedExit(true)
        } else {
          const timeout = setTimeout(() => {
            setShowPopupDelayedExit(false)
          }, 160)
          return () => clearTimeout(timeout)
        }
      }
    }, [popupVisible, showPopupDelayedExit])

    // useComposerKeyboardShortcut()
    // useIntentHandler()

    if (!showPopupDelayedExit) return null

    return (
      <Portal>
        <RemoveScrollBar />
        <View
          style={[
            styles.drawerMask,
            {
              backgroundColor: popupVisible
                ? select(t.name, {
                    light: 'rgba(0, 0, 0, 0.7)',
                    dark: 'rgba(1, 82, 168, 0.1)',
                    dim: 'rgba(10, 13, 16, 0.8)',
                  })
                : 'transparent',
            },
            a.transition_color,
            {zIndex},
          ]}>
          <View
            style={[
              styles.drawerContainer,
              popupVisible ? a.fade_in : a.fade_out,
            ]}>
            <Image
              accessibilityIgnoresInvertColors
              style={[styles.voltIcon]}
              source={require('#/assets/proposal/volt.png')}
            />
            <TouchableWithoutFeedback
              accessibilityRole="button"
              onPress={() => setPopupVisible(false)}>
              <Image
                accessibilityIgnoresInvertColors
                style={[styles.closeIcon]}
                source={require('#/assets/close.svg')}
              />
            </TouchableWithoutFeedback>
            <View style={[a.py_xs, a.mb_md]}>
              <Text style={[a.text_md, a.font_bold]}>你确认选择？</Text>
            </View>
            <View style={[a.py_sm, a.mb_2xl]}>
              <Text
                style={[
                  a.text_4xl,
                  a.font_bold,
                  {color: voltFor === 'agree' ? '#1083FE' : '#FD615B'},
                ]}>
                {voltFor === 'agree' ? '同意' : '反对'}
              </Text>
            </View>
            <Button
              style={[
                a.w_full,
                a.py_md,
                a.rounded_sm,
                {backgroundColor: '#1083FE'},
              ]}
              label="volt"
              onPress={async () => {
                await onConfirm(voltFor)
                setPopupVisible(false)
              }}>
              <Text style={[a.text_md, {color: colors.white}]}>确认</Text>
            </Button>

            {/* {props.children} */}
          </View>
        </View>
      </Portal>
    )
  },
)
export default VoltConfirm

const styles = StyleSheet.create({
  bgLight: {
    backgroundColor: colors.white,
  },
  bgDark: {
    backgroundColor: colors.black, // TODO
  },
  drawerMask: {
    ...a.fixed,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  drawerContainer: {
    display: 'flex',
    ...a.fixed,
    top: '50%',
    transform: 'translateY(-50%)',
    left: 0,
    right: 0,
    marginInline: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: 333,
    paddingTop: 56,
    // bottom: 0,
    // left: 0,
    // height: '100%',
    // width: '100%',
    borderRadius: 10,
    paddingInline: 46,
    paddingBottom: 30,
    backgroundColor: '#fff',
    // overflow: 'scroll',
  },
  voltIcon: {
    position: 'absolute',
    top: -120,
    right: 84,
    width: 141,
    height: 148,
  },
  closeIcon: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 16,
    height: 16,
    zIndex: 10,
  },
})
