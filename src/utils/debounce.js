import { debounce } from 'lodash'

export function createDebouncer(fn, wait = 300) {
  return debounce(fn, wait)
}
