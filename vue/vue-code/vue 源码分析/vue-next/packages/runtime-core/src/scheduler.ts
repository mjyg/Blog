import { ErrorCodes, callWithErrorHandling } from './errorHandling'
import { isArray } from '@vue/shared'

const queue: Function[] = []
const postFlushCbs: Function[] = []
const p = Promise.resolve()

let isFlushing = false
let isFlushPending = false

export function nextTick(fn?: () => void): Promise<void> {
  return fn ? p.then(fn) : p
}

export function queueJob(job: () => void) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

export function queuePostFlushCb(cb: Function | Function[]) {
  if (!isArray(cb)) {
    postFlushCbs.push(cb)
  } else {
    postFlushCbs.push(...cb)
  }
  queueFlush()
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    nextTick(flushJobs)
  }
}

const dedupe = (cbs: Function[]): Function[] => [...new Set(cbs)]

export function flushPostFlushCbs() {
  if (postFlushCbs.length) {
    const cbs = dedupe(postFlushCbs)
    postFlushCbs.length = 0
    for (let i = 0; i < cbs.length; i++) {
      cbs[i]()
    }
  }
}

const RECURSION_LIMIT = 100
type JobCountMap = Map<Function, number>

function flushJobs(seenJobs?: JobCountMap) {
  isFlushPending = false
  isFlushing = true
  let job
  if (__DEV__) {
    seenJobs = seenJobs || new Map()
  }
  while ((job = queue.shift())) {
    if (__DEV__) {
      const seen = seenJobs!
      if (!seen.has(job)) {
        seen.set(job, 1)
      } else {
        const count = seen.get(job)!
        if (count > RECURSION_LIMIT) {
          throw new Error(
            'Maximum recursive updates exceeded. ' +
            "You may have code that is mutating state in your component's " +
            'render function or updated hook.'
          )
        } else {
          seen.set(job, count + 1)
        }
      }
    }
    callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
  }
  flushPostFlushCbs()
  isFlushing = false
  // some postFlushCb queued jobs!
  // keep flushing until it drains.
  if (queue.length || postFlushCbs.length) {
    flushJobs(seenJobs)
  }
}
