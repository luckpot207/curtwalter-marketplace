export const requestIdleCallback = function (cb: IdleRequestCallback): number {
  let start = Date.now()
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start))
      },
    })
  }, 1) as unknown as number
}

export const cancelIdleCallback = function (id: number) {
  return clearTimeout(id)
}
