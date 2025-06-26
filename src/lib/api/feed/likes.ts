import {
  AppBskyFeedDefs,
  AppBskyFeedGetActorLikes as GetActorLikes,
  BskyAgent,
} from '@atproto/api'

import {FeedAPI, FeedAPIResponse} from './types'
import proxyRequest from "#/lib/proxyRequest";

async function fetchLikes({ pageNum, pageSize, params }: any) {
  const result = await proxyRequest('/post/api/posts', 'POST', {
    page: pageNum,
    per_page: pageSize,
    ...(params || {})
  })
  return {
    ...result,
    items: result?.posts,
  }
}

export class LikesFeedAPI implements FeedAPI {
  agent: BskyAgent
  params: GetActorLikes.QueryParams

  constructor({
    agent,
    feedParams,
  }: {
    agent: BskyAgent
    feedParams: GetActorLikes.QueryParams
  }) {
    this.agent = agent
    this.params = feedParams
  }

  async peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost> {
    const res = await this.agent.getActorLikes({
      ...this.params,
      limit: 1,
    })
    return res.data.feed[0]
  }

  async fetch({
    cursor,
    limit,
  }: {
    cursor: string | undefined
    limit: number
  }): Promise<FeedAPIResponse> {
    const res = await this.agent.getActorLikes({
      ...this.params,
      cursor,
      limit,
    })
    if (res.success) {
      // HACKFIX: the API incorrectly returns a cursor when there are no items -sfn
      const isEmptyPage = res.data.feed.length === 0
      return {
        cursor: isEmptyPage ? undefined : res.data.cursor,
        feed: res.data.feed,
      }
    }
    return {
      feed: [],
    }
  }
}
