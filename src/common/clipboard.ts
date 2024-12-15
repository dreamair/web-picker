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
    let blob = await resp.blob()
    if (blob.type === "image/webp")
      blob = await convertImgBlob(blob)
    const data = [new ClipboardItem({
      [blob.type]: blob,
      "text/html": new Blob([`<img src="${url}" alt="${alt}"/>`], { type: "text/html" }),
      "text/plain": new Blob([`![${alt}](${url})`], { type: "text/plain" }),
    })]
    await navigator.clipboard.write(data)
  } catch (err) {
    console.error('Failed to copy data: ', err)
    throw err
  }
}

async function convertImgBlob(imgBlob: Blob) {
  return new Promise<Blob>((resolve, reject) => {
    // Create an image element
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Convert the Blob to an Object URL
    const url = URL.createObjectURL(imgBlob)

    img.onload = () => {
      // Create a canvas and set its dimensions to the image dimensions
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      // Draw the WebP image onto the canvas
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)

      // Convert the canvas content to a PNG Blob
      canvas.toBlob((pngBlob) => {
        // Cleanup the object URL
        URL.revokeObjectURL(url)

        if (pngBlob) {
          resolve(pngBlob)
        } else {
          reject(new Error("Failed to convert WebP to PNG"))
        }
      }, "image/png")
    }

    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }

    // Set the image source to the Object URL
    img.src = url
  })
}
