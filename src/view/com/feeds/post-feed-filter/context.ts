import {createContext} from 'react'
import type dayjs from 'dayjs'

export type ContextState = {
  date?: {
    label?: string
    value?: [dayjs.Dayjs, dayjs.Dayjs]
  }
  node?: {
    label?: string
    value?: APIDao.WebEndpointsNodeNodeListVo
  }
}

export type PostFeedFilterContext = [
  ContextState,
  (state: Partial<ContextState>) => void,
]

const defaultState: PostFeedFilterContext = [{}, () => {}]

export const PostFeedFilterContext =
  createContext<PostFeedFilterContext>(defaultState)
