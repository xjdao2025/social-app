import React from 'react'
import {useNavigation} from '@react-navigation/native'

import {NavigationProp} from '#/lib/routes/types'
import {FeedSourceInfo} from '#/state/queries/feed'
import {useSession} from '#/state/session'
import {RenderTabBarFnProps} from '#/view/com/pager/Pager'
import {TabBar} from '../pager/TabBar'
import {HomeHeaderLayout} from './HomeHeaderLayout'
import { Text } from "#/components/Typography";
import { Dimensions, Linking, TouchableWithoutFeedback, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { atoms as a, useBreakpoints, useTheme } from '#/alf'
import { useRequest } from "ahooks";
import server from "#/server";
import OssImage from "#/components/OssImage";

const validateLink = (url: string) => {
  const link = url.match(/https?:\/\/(.*)/);
}

export function HomeHeader(
  props: RenderTabBarFnProps & {
    testID?: string
    onPressSelected: () => void
    feeds: FeedSourceInfo[]
  },
) {
  const {feeds} = props
  const {hasSession} = useSession()
  const navigation = useNavigation<NavigationProp>()
  const {gtMobile} = useBreakpoints()

  const { data: bannerList } = useRequest(() => server.dao('POST /banner/list'))

  const hasPinnedCustom = React.useMemo<boolean>(() => {
    if (!hasSession) return false
    return feeds.some(tab => {
      const isFollowing = tab.uri === 'following'
      return !isFollowing
    })
  }, [feeds, hasSession])

  const items = React.useMemo(() => {
    const pinnedNames = feeds.map(f => f.displayName)
    if (!hasPinnedCustom) {
      return pinnedNames.concat('Feeds ✨')
    }
    return pinnedNames
  }, [hasPinnedCustom, feeds])

  const onPressFeedsLink = React.useCallback(() => {
    navigation.navigate('Feeds')
  }, [navigation])

  const onSelect = React.useCallback(
    (index: number) => {
      // if (!hasPinnedCustom && index === items.length - 1) {
      //   onPressFeedsLink()
      // } else if (props.onSelect) {
      //   props.onSelect(index)
      // }
      props.onSelect?.(index)
    },
    [items.length, props, hasPinnedCustom],
  )

  const screenWidth = gtMobile ? 600 : Dimensions.get('window').width

  return (
    <HomeHeaderLayout tabBarAnchor={props.tabBarAnchor}>
      <Carousel
        testID={"banner"}
        loop={false}
        width={screenWidth}
        height={200}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={1000}
        autoPlay
        data={bannerList || []}
        style={{ width: screenWidth }}
        onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
          "worklet";
          g.enabled(false);
        }}
        renderItem={({item, index}) => {
          return <TouchableWithoutFeedback
            accessibilityRole={'link'}
            onPress={() => {
              if (!item.linkAddress) return
              const url = /https?:\/\/(.*)/.test(item.linkAddress)
              ? item.linkAddress
                : `//${item.linkAddress}`
              Linking.openURL(url)
            }}
          >
            <OssImage attachId={item.bannerFileId} style={{ height: '100%' }} />
          </TouchableWithoutFeedback>
        }}
      />
      <TabBar
        key={'home-tab-bar'}
        onPressSelected={props.onPressSelected}
        selectedPage={props.selectedPage}
        onSelect={onSelect}
        testID={props.testID}
        items={['全部', '任务', '商品', '活动']}
        dragProgress={props.dragProgress}
        dragState={props.dragState}
      />
    </HomeHeaderLayout>
  )
}
