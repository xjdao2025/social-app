import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from "expo-image";
import {Portal} from '#/components/Portal'
import { useBoolean } from "ahooks";
import useScanWebQr from "#/lib/qr-code-scanner/useScanWebQr";

export type QrScannerRefProps = {
  scan: () => Promise<string>
  close(): void
}

const QrScanner =  React.forwardRef<
  QrScannerRefProps,
  {}
>(function QrScanner(props, ref){
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, { setTrue, setFalse }] = useBoolean(false)

  const { scanQR, destroy } = useScanWebQr()

  useImperativeHandle(ref, () => ({
    scan: async () => {
      setTrue()
      const result = await scanQR(videoRef.current)
      setFalse()
      return result
    },
    close: setFalse,
  }))

  useEffect(() => {
    if (!show) {
      destroy()
      return
    }
  }, [show]);

  return <Portal>
    <View style={[styles.container, { zIndex: show ? 100 : -1 }]}>
      <View style={styles.back}>
        <Pressable
          accessibilityRole="button"
          accessibilityIgnoresInvertColors
          onPress={setFalse}>
          <Image
            accessibilityIgnoresInvertColors
            style={{width: 14, height: 12}}
            source={require('#/assets/arrow-left-white.svg')}
          />
        </Pressable>
      </View>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'black',
        }}
      />
    </View>
  </Portal>
})

export default QrScanner;

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    width: '100vw',
    height: '100%',
    zIndex: 100,
    top: 0,
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: 16,
    paddingTop: 18,
    zIndex: 10
  }
})