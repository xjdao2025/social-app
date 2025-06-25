import {type AppBskyFeedDefs, type BskyAgent} from '@atproto/api'

import proxyRequest from '#/lib/proxyRequest'
import server from '#/server'
import {defineProxyAPI} from '#/server/dao/defineAPI'
import {type ProposalStatus} from '#/server/dao/enums'
import {type FeedAPI, type FeedAPIResponse} from './types'

type RequestParams = {
  tag?: string
}

async function fetchPosts(pageNum: number, pageSize: number, params?: any) {
  const result = await proxyRequest('/post/api/posts', 'POST', {
    page: pageNum,
    per_page: pageSize,
    ...(params || {})
  })
  return {
    ...result,
    items: result?.posts?.map(restructFeedItem),
  }
}

export class PostsFeedAPI implements FeedAPI {
  agent: BskyAgent
  params: RequestParams
  constructor({agent, params}: {agent: BskyAgent, params: RequestParams}) {
    this.agent = agent
    this.params = params
  }

  async peekLatest() {
    // if (did) {
    //   const items = await fetchMyProposal(+state)
    //   return items?.[0] ?? null
    // }
    const res = await fetchPosts(1, 1, this.params)
    return res?.items?.[0] || null
  }

  async fetch({cursor, limit}: {cursor: string | undefined; limit: number}) {
    const page = cursor ? +cursor : 1

    const res = await fetchPosts(page, limit, this.params)
    if (res?.items) {
      return {
        cursor: `${res.page * res.per_page > res.total ? '' : res.page + 1}`,
        feed: res.items,
      }
    }
    return {
      feed: [],
    }
  }
}

function restructFeedItem(
  item: AppBskyFeedDefs.PostView,
): AppBskyFeedDefs.FeedViewPost {
  return {
    post: {
      ...item,
    },
  }
}
