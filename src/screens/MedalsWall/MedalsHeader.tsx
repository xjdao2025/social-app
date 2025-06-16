import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { atoms as a, useTheme } from "#/alf";
import { Text } from "#/components/Typography";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useRef } from "react";
import { useGoBack } from "#/lib/hooks/useGoBack";

const defaultDataWith6Colors = [
  require('#/assets/medals/mdal1.png'),
  require('#/assets/medals/mdal2.png'),
];

// const SCREEN_WIDTH = Dimensions.get("window").width;
const SCALE_RATIO = 240 / 750
const SCROLL_OFFSET_RATIO = 465 / 750
const SCREEN_WIDTH = Math.min(600, Dimensions.get("window").width)

const MedalsHeader = () => {
  const t = useTheme()
  const goBack = useGoBack()
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  return <>
    <View style={[
      a.fixed,
      a.top_0,
      a.left_0,
      a.right_0,
      a.z_10,
      { height: 44, overflow: 'hidden' },
    ]}>
      <View style={[styles.container, styles.bgColor, a.pl_lg, { paddingTop: 18 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityIgnoresInvertColors
          onPress={goBack}
        >
          <Image
            accessibilityIgnoresInvertColors
            style={{ width: 14, height: 12 }}
            source={require('#/assets/arrow-left-white.svg')}
          />
        </Pressable>
      </View>
      <Image
        accessibilityIgnoresInvertColors
        style={[{ width: 263, height: 253, top: 0 }, styles.topBg]}
        source={require('#/assets/medals/light.png')}
      />
    </View>
    <View style={[styles.container, styles.bgColor, a.fixed]}>
      <Image
        accessibilityIgnoresInvertColors
        style={[{ width: 263, height: 253 }, styles.topBg]}
        source={require('#/assets/medals/light.png')}
      />
      <Image
        accessibilityIgnoresInvertColors
        style={[{ width: 209, height: 165, bottom: 11 + 48 }, styles.topBg]}
        source={require('#/assets/medals/medal.png')}
      />
      <View style={[styles.header, a.gap_sm]}>
        <Image
          accessibilityIgnoresInvertColors
          style={[styles.wing]}
          source={require('#/assets/medals/wing.svg')}
        />
        <Text style={[a.text_xl, a.font_bold, t.atoms.text_inverted]}>
          总成就<Text style={[a.text_xl, a.font_bold, a.mx_sm, { color: '#1083FE' }]}>102</Text>枚
        </Text>
        <Image
          accessibilityIgnoresInvertColors
          style={[styles.wing, { transform: 'scaleX(-1)' }]}
          source={require('#/assets/medals/wing.svg')}
        />
      </View>
      <Text style={[styles.new_get, a.text_xs, a.mt_md, a.mb_sm]}>最新获得</Text>
      <View style={styles.empty}>
        <Image
          accessibilityIgnoresInvertColors
          style={{ width: 60, aspectRatio: 1 }}
          source={require('#/assets/medals/question.svg')}
        />
        <Text style={styles.emptyText}>待获得</Text>
      </View>

        {/*<Carousel*/}
        {/*  ref={ref}*/}
        {/*  data={defaultDataWith6Colors}*/}
        {/*  height={165}*/}
        {/*  loop={false}*/}
        {/*  pagingEnabled={true}*/}
        {/*  snapEnabled={true}*/}
        {/*  width={SCREEN_WIDTH}*/}
        {/*  mode="parallax"*/}
        {/*  onProgressChange={progress}*/}
        {/*  modeConfig={{*/}
        {/*    parallaxScrollingOffset: SCROLL_OFFSET_RATIO * SCREEN_WIDTH,*/}
        {/*    parallaxAdjacentItemScale: 0.15,*/}
        {/*    parallaxScrollingScale: SCALE_RATIO*/}
        {/*  }}*/}
        {/*  renderItem={({ item, index }) => {*/}
        {/*    const currentIndex = ref.current?.getCurrentIndex()*/}
        {/*    return <View*/}
        {/*      style={[styles.swiper]}>*/}
        {/*      <Image*/}
        {/*        accessibilityIgnoresInvertColors*/}
        {/*        style={{ width: '100%', aspectRatio: 1 }}*/}
        {/*        source={item}*/}
        {/*      />*/}
        {/*      {index === currentIndex && <Text style={styles.swiper_text}>珍爱地球</Text>}*/}
        {/*    </View>*/}
        {/*  }}*/}
        {/*/>*/}
    </View>
  </>;
}

export default MedalsHeader;

const styles = StyleSheet.create({
  bgColor: {
    backgroundImage: 'linear-gradient(180deg, #3A394A 0%, #1E1F23 100%)',
  },
  container: {
    height: 285 + 48,
    left: 0,
    right: 0,
    top: 0,
  },
  topBg: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  header: {
    marginTop: 59,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wing: {
    width: 23,
    height: 14,
  },
  new_get: {
    color: '#959399',
    textAlign: 'center',
  },
  swiper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper_text: {
    fontSize: 14 / SCALE_RATIO,
    fontWeight: 500,
    color: '#fff',
    marginTop: 23
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 34,
    paddingTop: 45,
  },
  emptyText: {
    color: '#6F869F',
    fontSize: 14,
    fontWeight: 500,
  }
})