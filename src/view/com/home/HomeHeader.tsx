import React from 'react'
import {useNavigation} from '@react-navigation/native'

import {NavigationProp} from '#/lib/routes/types'
import {FeedSourceInfo} from '#/state/queries/feed'
import {useSession} from '#/state/session'
import {RenderTabBarFnProps} from '#/view/com/pager/Pager'
import {TabBar} from '../pager/TabBar'
import {HomeHeaderLayout} from './HomeHeaderLayout'
import { Text } from "#/components/Typography";
import { Dimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {atoms as a, useTheme} from '#/alf'

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

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

  return (
    <HomeHeaderLayout tabBarAnchor={props.tabBarAnchor}>
      <Carousel
        testID={"banner"}
        loop={true}
        width={Dimensions.get("window").width}
        height={200}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={1000}
        autoPlay={false}
        data={defaultDataWith6Colors}
        style={{ width: "100%" }}
        onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
          "worklet";
          g.enabled(false);
        }}
        renderItem={({index}) => {
          return <View style={[{backgroundColor: ''}, a.h_full]}>
            <Text>{index}</Text>
          </View>
        }}
      />
      <TabBar
        key={items.join(',')}
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
