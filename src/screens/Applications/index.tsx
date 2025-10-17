import React from 'react'
import {Pressable, View} from 'react-native'
import {Image} from 'expo-image'
import {Trans} from '@lingui/macro'
import {useRequest} from 'ahooks'

import {extractAssetUrl} from '#/lib/extractAssetUrl'
import {HomeHeaderLayoutMobile} from '#/view/com/home/HomeHeaderLayoutMobile'
import {atoms as a} from '#/alf'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import server from '#/server'

export default function ApplicationsScreen() {
  const {data: apps} = useRequest(async () => server.dao('POST /app/list'))

  const hasApp = Array.isArray(apps) && apps.length > 0

  return (
    <Layout.Screen testID="ApplicationsScreen">
      <HomeHeaderLayoutMobile tabBarAnchor={null} transparent noBottomBorder />
      <Layout.Center style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            position: 'relative',
            top: 52,
            padding: 16,
            gap: 24,
            paddingBottom: 58 + 12,
          }}>
          {apps?.map(app => {
            return (
              <View
                key={app.appId}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Image
                  source={{uri: extractAssetUrl(app.logo)}}
                  style={{width: 60, height: 60, borderRadius: 12}}
                />
                <View style={{flex: 1, gap: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 500}}>
                    {app.name}
                  </Text>
                  <Text style={{fontSize: 12, color: '#6F869F'}}>
                    {app.desc}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#F1F3F5',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    window.open(app.link, '_blank')
                  }}>
                  <Text style={{fontSize: 14, color: '#42576C'}}>前往</Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        {!hasApp && (
          <View
            style={[
              a.flex_col,
              a.justify_center,
              a.align_center,
              {paddingTop: '40vh', gap: 14},
            ]}>
            <Image
              accessibilityIgnoresInvertColors
              style={{width: 100, height: 100}}
              source={require('#/assets/in-process.svg')}
            />
            <Text style={[a.text_sm, {color: '#42576C'}]}>敬请期待</Text>
          </View>
        )}
      </Layout.Center>
    </Layout.Screen>
  )
}
