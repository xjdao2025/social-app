import {type AppBskyFeedDefs, BlobRef, type BskyAgent} from '@atproto/api'

import proxyRequest from '#/lib/proxyRequest'
import server from '#/server'
import {defineProxyAPI} from '#/server/dao/defineAPI'
import {type ProposalStatus} from '#/server/dao/enums'
import {type FeedAPI, type FeedAPIResponse} from './types'

type RequestParams = {
  tag?: string
}

type FetchPostsParams = {
  pageNum: number
  pageSize: number
  params?: any
  useAuth?: boolean
}

async function fetchPosts({
  pageNum,
  pageSize,
  params,
  useAuth,
}: FetchPostsParams) {
  const result = await proxyRequest(
    '/post/api/posts',
    'POST',
    {
      page: pageNum,
      per_page: pageSize,
      ...(params || {}),
    },
    useAuth,
  )
  return {
    ...result,
    items: (result?.posts || []).map(restructFeedItem),
  }
}

export class PostsFeedAPI implements FeedAPI {
  agent: BskyAgent
  params: RequestParams
  constructor({agent, params}: {agent: BskyAgent; params: RequestParams}) {
    this.agent = agent
    this.params = params
  }

  async peekLatest() {
    // if (did) {
    //   const items = await fetchMyProposal(+state)
    //   return items?.[0] ?? null
    // }
    const res = await fetchPosts({
      pageNum: 1,
      pageSize: 1,
      params: this.params,
      useAuth: false,
    })
    return res?.items?.[0] || null
  }

  async fetch({cursor, limit}: {cursor: string | undefined; limit: number}) {
    const page = cursor ? +cursor : 1
    const res = await fetchPosts({
      pageNum: page,
      pageSize: limit,
      params: this.params,
      useAuth: false,
    })
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
  item: AppBskyFeedDefs.FeedViewPost,
): AppBskyFeedDefs.FeedViewPost {
  const newItem = {...item}
  const post = {...newItem.post}
  const reply = newItem.reply
  if (reply) {
    reply.parent.$type = 'app.bsky.feed.defs#postView'
    reply.root.$type = 'app.bsky.feed.defs#postView'
    post.record.reply = {
      parent: {
        cid: reply.parent.cid,
        uri: reply.parent.uri,
      },
      root: {
        cid: reply.root.cid,
        uri: reply.root.uri,
      },
    }

    newItem.reply = reply
  }

  if (post.record.embed?.images) {
    post.record.embed?.images.forEach(item => {
      item.image = new BlobRef(
        item.image.ref,
        item.image.mimeType,
        item.image.size,
        item.image,
      )
    })
  }

  newItem.post = post
  return newItem
}
