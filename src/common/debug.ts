
export const isDebug = false

export function debug(...args: any[]) {
  if (isDebug)
    console.log(...args)
}
