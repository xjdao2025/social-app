import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import MedalsHeader from "#/screens/MedalsWall/MedalsHeader";
import { atoms as a, useBreakpoints, useTheme } from '#/alf'
import * as Layout from '#/components/Layout'
import { Text } from "#/components/Typography";
import { useEffect, useRef, useState } from "react";


const MedalsWallScreen = () => {
  const t = useTheme()
  const {gtMobile} = useBreakpoints()
  const contentRef = useRef<HTMLDivElement | undefined>(undefined);
  const [headerOpacity, setHeaderOpacity] = useState(0)

  useEffect(() => {
    const f = () => {
      const top = contentRef.current?.getBoundingClientRect().top
      setHeaderOpacity(top === 44 ? 1 : 0)
    }
    window.addEventListener('scroll', f)
    return () => {
      window.removeEventListener('scroll', f)
    }

  }, []);

  return <Layout.Screen testID="MedalsWallScreen">
    <View
      style={[
        a.w_full,
        a.mx_auto,
        gtMobile && {
          maxWidth: 600,
        },
      ]}
    >
      <View style={{height: 285 + 48}} />
      <MedalsHeader />
      <View style={styles.content}>
        <View
          style={[
            styles.content_top_wrap,
            a.sticky,
            { backgroundColor: `rgba(53,53,68, ${headerOpacity})` },
          ]}
          ref={contentRef}
        >
          <View style={[styles.content_top]}>
            <Text style={[styles.content_title, t.atoms.text_contrast_high]}>勋章</Text>
          </View>
        </View>
        <View style={styles.content_inner}>
          <View style={styles.inner}>
            {new Array(5).fill(2).map(() => {
              return <View style={styles.medal_item}>
                <Image
                  accessibilityIgnoresInvertColors
                  style={{ width: 80, aspectRatio: 1 }}
                  source={require('#/assets/medals/mdal1.png')}
                />
                <Text style={[styles.medal_item_title, t.atoms.text_contrast_high]}>珍爱地球</Text>
                <Text style={[styles.medal_item_time, t.atoms.text_contrast_low]}>2023.08.01 获得</Text>
              </View>
            })}
          </View>
        </View>
      </View>
    </View>
  </Layout.Screen>
}

export default MedalsWallScreen;

const styles = StyleSheet.create({
  content: {
    marginTop: -48,
  },
  content_top_wrap: {
    top: 44,
    zIndex: 100,
  },
  content_top: {
    backgroundColor: '#F1F3F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content_inner: {
    backgroundColor: '#F1F3F5',
    paddingInline: 16,
    position: 'relative',
    // minHeight: 'calc(100vh - 285px - 48px)',
    minHeight: '100vh'
  },
  content_title: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 20,
    textAlign: 'center',
    marginBlock: 14,
  },
  inner: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBlock: 20,
    paddingInline: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20
  },
  medal_item: {
    width: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medal_item_title: {
    fontSize: 14,
    lineHeight: 17,
    marginTop: 6,
    marginBottom: 3,
  },
  medal_item_time: {
    fontSize: 10,
    lineHeight: 14,
  }
})