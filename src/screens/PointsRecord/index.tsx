import {Pressable, StyleSheet, View} from 'react-native'
import {Image} from 'expo-image'
import {atoms as a, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import { useGoBack } from "#/lib/hooks/useGoBack";

const PointsRecordScreen = () => {
  const t = useTheme()
  const goBack = useGoBack()

  return (
    <Layout.Screen testID="PointsRecordScreen">
      <Pressable
        accessibilityRole="button"
        accessibilityIgnoresInvertColors
        style={{position: 'absolute', left: 16, top: 18, zIndex: 1}}
        onPress={goBack}>
        <Image
          accessibilityIgnoresInvertColors
          style={{width: 14, height: 12}}
          source={require('#/assets/arrow-left.svg')}
        />
      </Pressable>
      <View style={[styles.headContainer, a.pb_lg]}>
        <View style={styles.linearBg}>
          <View style={styles.headImage}>
            <Image
              accessibilityIgnoresInvertColors
              style={{width: 224, height: 224}}
              source={require('#/assets/hall/node-list.bg.png')}
            />
          </View>
        </View>
        <View style={[styles.headPlaceholder, a.mb_lg]} />
        <View style={[a.px_lg]}>
          <Text style={[t.atoms.text_contrast_low, a.text_sm]}>我的积分</Text>
        </View>
        <View style={[a.px_lg, a.mt_md]}>
          <Text
            style={[t.atoms.text, a.text_4xl, a.text_family_ddin, a.font_bold]}>
            1,820
          </Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={[{fontWeight: 500, color: '#0B0F14'}]}>明细</Text>
        <View
          style={[
            a.flex_row,
            a.justify_between,
            a.px_lg,
            a.align_center,
            styles.item,
          ]}>
          <View style={[a.flex_col, a.justify_between, a.gap_sm]}>
            <Text style={[a.text_md, a.font_bold, t.atoms.text_contrast_high]}>
              发帖名字
            </Text>
            <Text style={[t.atoms.text_contrast_high]}>发帖奖励</Text>
            <Text style={[t.atoms.text_contrast_low]}>2024-10-18 12:00:00</Text>
          </View>
          <Text
            style={[
              a.text_md,
              a.text_family_ddin,
              a.font_bold,
              {color: '#F66455'},
            ]}>
            +10
          </Text>
        </View>
        <View
          style={[
            a.flex_row,
            a.justify_between,
            a.px_lg,
            a.align_center,
            styles.item,
          ]}>
          <View style={[a.flex_col, a.justify_between, a.gap_sm]}>
            <Text style={[a.text_md, a.font_bold, t.atoms.text_contrast_high]}>
              发帖名字
            </Text>
            <Text style={[t.atoms.text_contrast_high]}>发帖奖励</Text>
            <Text style={[t.atoms.text_contrast_low]}>2024-10-18 12:00:00</Text>
          </View>
          <Text
            style={[
              a.text_md,
              a.text_family_ddin,
              a.font_bold,
              {color: '#F66455'},
            ]}>
            +10
          </Text>
        </View>
      </View>
    </Layout.Screen>
  )
}

export default PointsRecordScreen

const styles = StyleSheet.create({
  headContainer: {
    position: 'relative',
  },
  headImage: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  linearBg: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    // height: '100%',
    paddingBottom: '66.5%',

    opacity: 0.6,
    backgroundImage:
      'linear-gradient(71deg, #DEF2FE 10.27%, #B5D3FF 28.82%, #D9D7FA 96.02%)',
  },

  headPlaceholder: {
    height: 52,
  },

  card: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    // backgroundImage: "linear-gradient(180deg, #F3F9FE 0%, #FBFDFF 100%)",
    backgroundColor: '#F3F9FE',
    paddingBlock: 18,
    paddingInline: 16,
  },
  item: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    paddingBlock: 10,
  },
  button: {
    backgroundColor: '#F1F3F5',
    borderRadius: 15,
    paddingInline: 12,
    paddingBlock: 6,
  },
})
