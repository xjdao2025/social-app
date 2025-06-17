import {type AppBskyFeedDefs, type BskyAgent} from '@atproto/api'

import {type ProposalStatus} from '#/state/queries/post-feed'
import {type FeedAPI, type FeedAPIResponse} from './types'

type RequestParams = {
  state: ProposalStatus
  did?: string
}

export class ProposalFeedAPI implements FeedAPI {
  agent: BskyAgent
  params: RequestParams = {state: 'all'}
  constructor({params, agent}: {params: RequestParams; agent: BskyAgent}) {
    this.agent = agent
    this.params = params
  }

  async peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost> {
    // todo 提案接口
    const res = await this.agent.getTimeline({
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
    const {state, did} = this.params
    const page = cursor || 1
    // todo 提案接口
    console.log('proposal request params:', {state, did, page})
    const res = await this.agent.getTimeline({
      cursor,
      limit,
    })

    if (res.success) {
      return {
        cursor: res.data.cursor,
        feed: res.data.feed,
      }
    }
    return {
      feed: [],
    }
  }
}
