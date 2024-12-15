export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy data: ', err)
  }
}


export const copyImageToClipboard = async (url: string, alt = '') => {
  try {
    const resp = await fetch(url)
    const blob = await resp.blob()
    const data = [new ClipboardItem({
      // "text/plain": new Blob([url], { type: "text/plain" }),
      [blob.type]: blob,
      "text/html": new Blob([`<img src="${url}" alt="${alt}/>`], { type: "text/html" }),
      "text/plain": new Blob([`![${alt}](${url})`], { type: "text/plain" }),
    })]
    await navigator.clipboard.write(data)
    // await navigator.clipboard.writeText(url)
  } catch (err) {
    console.error('Failed to copy data: ', err)
  }
}
