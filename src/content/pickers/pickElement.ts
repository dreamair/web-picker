import { createOverlay } from '../../common/dom.js'

let callback: (node: HTMLElement | null) => void
let getElement: (elements: HTMLElement[]) => HTMLElement | null

export function pickElement<T extends HTMLElement = HTMLElement>(
  getElementFromStack: (elements: HTMLElement[]) => HTMLElement | null) {
  getElement = getElementFromStack
  return new Promise<T | null>((resolve) => {
    callback = (node: HTMLElement | null) => {
      cleanup()
      resolve(node as T)
    }
    document.body.addEventListener('click', onClick, true)
    document.body.addEventListener('mousemove', onMouseMove)
    document.addEventListener('selectionchange', onSelectionChange)
  })
}

export function cancelElementPicker() {
  cleanup()
}

let overlay: HTMLElement | null = null
let element: HTMLElement | null = null

function cleanup() {
  overlay?.remove()
  overlay = null
  document.body.removeEventListener('click', onClick, true)
  document.body.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('selectionchange', onSelectionChange)
  document.getSelection()?.removeAllRanges()
}

function onClick(event: MouseEvent) {
  event.preventDefault()
  event.stopImmediatePropagation()
  event.stopPropagation()
  callback(element)
}

function onMouseMove(event: MouseEvent) {
  const elem = getElementForPoint(event.clientX, event.clientY)
  if (!elem) return
  const r = elem.getBoundingClientRect()
  console.log(elem.nodeName, elem.childNodes.length, elem.children.length)
  element = elem
  if (overlay) overlay.remove()
  overlay = createOverlay(r)
}

function onSelectionMouseUp() {
  const selection = document.getSelection()
  if (selection && selection.toString())
    callback(getSelectedElements(selection))
  document.removeEventListener('mouseup', onSelectionMouseUp, true)
}

function onSelectionChange() {
  document.addEventListener('mouseup', onSelectionMouseUp, true)
}

function getSelectedElements(selection: Selection | null) {
  if (!selection?.rangeCount) return null
  const container = document.createElement('div')
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i)
    container.appendChild(range.cloneContents())
  }
  return container
}

function getElementForPoint(x: number, y: number) {
  const element = document.elementFromPoint(x, y) as HTMLElement
  if (element && getElement([element])) return element
  const elements = document.elementsFromPoint(x, y) as HTMLElement[]
  return getElement(elements)
}
