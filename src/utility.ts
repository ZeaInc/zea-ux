import { Ray, XRControllerEvent, ZeaMouseEvent, ZeaPointerEvent, ZeaTouchEvent } from '@zeainc/zea-engine'

function getPointerRay(event: ZeaPointerEvent): Ray {
  if (event instanceof ZeaMouseEvent || ZeaTouchEvent) {
    return event.pointerRay
  } else if (event instanceof XRControllerEvent) {
    return event.controller.pointerRay
  } else {
    console.warn('unhandled pointer event')
    return new Ray()
  }
}

export { getPointerRay }
