

/**
 * @param element {HTMLElement}
 * @return {{top: number, left: number}}
 */
function getOffsetRect (element) {
  let box = element.getBoundingClientRect()

  let scrollTop = window.pageYOffset
  let scrollLeft = window.pageXOffset

  let top = box.top + scrollTop
  let left = box.left + scrollLeft

  return {top: Math.round(top), left: Math.round(left)}
}
/**
 * @param event {MouseEvent}
 * @param element {HTMLElement}
 * @return {{x: number, y: number}}
 */
function getMousePosition (element, event) {
  let mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft
  let mouseY = event.pageY || event.clientY + document.documentElement.scrollTop

  let offset = getOffsetRect(element)
  let x = mouseX - offset.left
  let y = mouseY - offset.top
 
  return [x, y];
}

export {
  getMousePosition, getOffsetRect
}
