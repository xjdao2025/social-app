import {PostFeedFilterInner} from './FilterInner'
import {PostFeedFilterLayout} from './Layout'

type Props = {
  feed: string
}

const hasFilter = (feed: string) => {
  return ['tasks', 'products'].includes(feed.split('|')[1])
}

export function PostFeedFilter(props: Props) {
  const {feed} = props

  return (
    <PostFeedFilterLayout hasFilter={hasFilter(feed)}>
      <PostFeedFilterInner {...props} />
    </PostFeedFilterLayout>
  )
}
