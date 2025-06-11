import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { useGoBack } from "#/lib/hooks/useGoBack";
import MedalsHeader from "#/screens/MedalsWall/MedalsHeader";
import {atoms as a, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'
import { Text } from "#/components/Typography";


const MedalsWallScreen = () => {
  const t = useTheme()
  const goBack = useGoBack()

  return <Layout.Screen testID="MedalsWallScreen">
    <Pressable
      accessibilityRole="button"
      accessibilityIgnoresInvertColors
      style={{position: 'absolute', left: 16, top: 18, zIndex: 1}}
      onPress={goBack}>
      <Image
        accessibilityIgnoresInvertColors
        style={{width: 14, height: 12}}
        source={require('#/assets/arrow-left-white.svg')}
      />
    </Pressable>
    <MedalsHeader />
    <View style={styles.content}>
      <Text style={[styles.content_title, t.atoms.text_contrast_high]}>勋章</Text>
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
  </Layout.Screen>
}

export default MedalsWallScreen;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#F1F3F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -48,
    minHeight: 'calc(100vh - 285px)',
    paddingInline: 16,
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