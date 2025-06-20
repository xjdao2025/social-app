import {isNil} from 'lodash'

export default function displayNumber(val?: number | string, defaultVal = '-') {
  if (isNil(val)) return defaultVal
  if (+val < 999) return val + ''
  return (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
