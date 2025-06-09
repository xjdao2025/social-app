import {useEffect, useState} from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import {useAnimatedRef} from 'react-native-reanimated'
import {Image} from 'expo-image'
import {useNavigation} from '@react-navigation/native'

import {type NavigationProp} from '#/lib/routes/types'
import {HomeHeaderLayoutMobile} from '#/view/com/home/HomeHeaderLayoutMobile'
import {type ListRef} from '#/view/com/util/List'
import {atoms as a, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {ProfileFeedSection} from '../Profile/Sections/Feed'
import NodeInfo from './components/NodeInfo'

const proposalStageOptions = [
  {key: 'all', label: '全部'},
  {key: 'inprogress', label: '审核中'},
  {key: 'pass', label: '通过'},
  {key: 'fail', label: '未通过'},
]

export default function HallScreen() {
  const t = useTheme()
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [currentTabKey, setTabKey] = useState(proposalStageOptions[0].key)
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    const f = () => {
      const scrollY = window.scrollY
      const offset = 100
      const opacity =
        scrollY < offset
          ? 0
          : Math.max(
              0,
              Math.min(+((scrollY - offset) / (220 - offset)).toFixed(2), 1),
            )
      setHeaderOpacity(opacity)
    }
    window.addEventListener('scroll', f)
    return () => {
      window.removeEventListener('scroll', f)
    }
  }, [])

  const scrollElRef = useAnimatedRef()

  return (
    <Layout.Screen testID="hallScreen">
      <HomeHeaderLayoutMobile
        tabBarAnchor={null}
        transparent
        style={[{backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`}]}
      />
      <View style={styles.linearBg} />
      <View style={[a.flex_col, a.px_lg, a.flex_0, styles.topInfo]}>
        <View style={[a.flex_row, a.align_baseline, a.justify_between]}>
          <Text style={[t.atoms.text, a.text_2xl, a.font_bold]}>基金会</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityIgnoresInvertColors
            style={[a.flex_row]}
            onPress={() => {
              navigation.push('HallDocList')
            }}>
            <Text style={[t.atoms.text_contrast_medium, a.text_sm]}>更多</Text>
            <Image
              style={{width: 14, height: 14}}
              source={require('#/assets/expand-right.svg')}
            />
          </Pressable>
        </View>
        <View style={[a.flex_row, a.gap_md, a.mt_xl]}>
          <View style={[a.flex_1, styles.foundCard, styles.foundScale]}>
            <Image
              accessibilityIgnoresInvertColors
              style={[styles.foundScaleBG]}
              source={require('#/assets/hall.cash.svg')}
            />
            <Text style={[t.atoms.text_inverted, a.text_md]}>基金规模</Text>
            <View style={[a.flex_row, a.gap_sm, a.align_baseline]}>
              <Text style={[t.atoms.text_inverted, a.text_2xl]}>¥</Text>
              <Text
                style={[
                  t.atoms.text_inverted,
                  a.text_3xl,
                  a.text_family_ddin,
                  a.font_bold,
                ]}>
                000,000
              </Text>
            </View>
          </View>
          <View style={[a.flex_1, styles.foundCard, styles.foundToken]}>
            <Image
              accessibilityIgnoresInvertColors
              style={[styles.foundTokenBG]}
              source={require('#/assets/hall.token.svg')}
            />
            <Text style={[t.atoms.text_inverted, a.text_md]}>已发行积分</Text>
            <Text
              style={[
                t.atoms.text_inverted,
                a.text_3xl,
                a.text_family_ddin,
                a.font_bold,
              ]}>
              000,000
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.cardWrapper]}>
        <View style={[styles.card, a.pt_lg]}>
          <View
            style={[a.flex_row, a.align_baseline, a.justify_between, a.px_lg]}>
            <Text style={[t.atoms.text, a.text_lg, a.font_bold]}>节点</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityIgnoresInvertColors
              style={[a.flex_row]}
              onPress={() => {
                navigation.push('HallNodeList')
              }}>
              <Text style={[t.atoms.text_contrast_medium, a.text_sm]}>
                更多
              </Text>
              <Image
                style={{width: 14, height: 14}}
                source={require('#/assets/expand-right.svg')}
              />
            </Pressable>
          </View>

          <View
            style={[
              a.flex_row,
              a.align_center,
              a.px_4xl,
              a.mt_lg,
              a.justify_between,
            ]}>
            {Array.from({length: 4}, (_, idx) => {
              return (
                <NodeInfo
                  key={idx}
                  trigger={
                    <View
                      style={[
                        a.flex_0,
                        {
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          backgroundColor: '#ff0',
                        },
                      ]}
                    />
                  }
                />
              )
            })}
          </View>

          <View
            style={[
              a.sticky,
              a.pb_md,
              a.border_b,
              a.px_lg,
              t.atoms.border_contrast_low,
              {top: 22, zIndex: 9, backgroundColor: '#fff'},
            ]}>
            <View style={[{paddingTop: 30}]}>
              <Text style={[t.atoms.text, a.text_lg, a.font_bold]}>提案</Text>
            </View>
            <View style={[a.flex_row, a.mt_md, a.gap_md]}>
              {proposalStageOptions.map(({label, key}, idx) => {
                return (
                  <View
                    key={key}
                    style={[
                      a.flex_0,
                      a.flex_col,
                      a.align_center,
                      a.justify_center,
                      styles.tab,
                      currentTabKey === key ? styles.activeTab : undefined,
                    ]}
                    onClick={() => {
                      setTabKey(key)
                    }}>
                    <Text
                      style={[
                        styles.tabText,
                        currentTabKey === key
                          ? styles.activeTabText
                          : undefined,
                      ]}>
                      {label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          <ProfileFeedSection
            // ref={postsSectionRef}
            // feed={`author|did:plc:pc5gxd5my6uooild5drcixdm|posts_and_author_threads`}
            feed={`proposal|all`}
            headerHeight={0}
            isFocused={true}
            contentContainerStyle={{
              minHeight: 'calc(100vh - 52px - 58px - 64px)',
            }}
            desktopFixedHeight={false}
            scrollElRef={scrollElRef as ListRef}
            ignoreFilterFor={'did:plc:pc5gxd5my6uooild5drcixdm'}
            setScrollViewTag={() => null}
          />
          {/* <View style={[{ height: 2000, backgroundColor: '#f00' }]} /> */}

          {/* <Text>sdfagjlasjfal</Text> */}
          {/* <View style={[{ minHeight: 'calc(100vh - 52px - 58px - 20px)' }]}>
            <View style={[{ height: 2000 }]} />
          </View> */}
        </View>
      </View>
      {/* <View style={[a.flex_col, a.h_full, { paddingTop: 52 + 20, zIndex: 1, gap: 25, paddingBottom: 58 }]}>
        <View style={[styles.card, a.flex_1]}>
          <Text>sdfagjlasjfal</Text>
        </View>
      </View> */}
    </Layout.Screen>
  )
}

const styles = StyleSheet.create({
  linearBg: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    // height: '100%',
    paddingBottom: '78.8%',

    opacity: 0.6,
    backgroundImage:
      'linear-gradient(71deg, #DEF2FE 10.27%, #B5D3FF 28.82%, #D9D7FA 96.02%)',
  },
  topInfo: {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    top: 52 + 20,
  },
  foundCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 19,
    borderRadius: 16,
    paddingTop: 30,
    paddingBottom: 40,
    paddingInline: 16,
  },
  foundScale: {
    backgroundImage: 'linear-gradient(126deg, #154FFF 16.58%, #68C3FD 93.61%)',
  },
  foundScaleBG: {
    position: 'absolute',
    width: 51,
    height: 61,
    right: 0,
    bottom: 0,
  },
  foundToken: {
    backgroundImage: 'linear-gradient(126deg, #6685FB 16.58%, #B2BEFF 93.61%)',
  },
  foundTokenBG: {
    position: 'absolute',
    width: 52,
    height: 60,
    right: 0,
    bottom: 0,
  },
  cardWrapper: {
    position: 'relative',
    marginTop: 52,
    bottom: 0,
    width: '100%',
    // height: '100%',
    paddingTop: 220,
    paddingBottom: 58,
    zIndex: 2,
    pointerEvents: 'none',
    // overflow: 'auto'
  },
  cardHeader: {
    backgroundColor: '#f00',
    width: '100%',
    height: 20,
    top: 52,
    zIndex: 9,
    overflow: 'hidden',
  },
  card: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginTop: 25,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    backgroundColor: '#fff',
    // overflow: 'hidden',
    pointerEvents: 'auto',
  },
  tab: {
    paddingBlock: 6,
    paddingInline: 12,
    // backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#D4DBE2',
    borderRadius: 15,
  },
  tabText: {color: '#42576C'},
  activeTab: {backgroundColor: '#0B0F14', borderColor: '#0B0F14'},
  activeTabText: {color: '#fff'},
})
