import 'antd-mobile/es/global'
import '@ant-design/v5-patch-for-react-19'

import {StyleSheet, View} from 'react-native'

import {isNative} from '#/platform/detection'
import {DateRange} from './fields/DateRange'
import {Nodes} from './fields/Nodes'

type Props = {
  feed: string
}

const titleMap: Record<string, string> = {
  tasks: '任务',
  products: '商品',
}

export function PostFeedFilterInner(props: Props) {
  if (isNative) return null

  const {feed} = props

  const title = titleMap[feed.split('|')[1]] ?? ''

  return (
    <View style={S.container}>
      <DateRange title={title} />
      <Nodes title={title} />
    </View>
  )
}

const S = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D4DBE2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
