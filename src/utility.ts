import { Ray, XRControllerEvent, ZeaMouseEvent, ZeaPointerEvent, ZeaTouchEvent } from '@zeainc/zea-engine'


function getPointerRay(event: ZeaPointerEvent): Ray {
  if (typeof event === 'undefined') {
    console.warn('undefined event')
    return
  }
  if (event instanceof ZeaMouseEvent) {
    return event.pointerRay
  } else if (event instanceof ZeaTouchEvent) {
    return event.touches[0].touchRay
  } else if (event instanceof XRControllerEvent) {
    const pointerXfo = event.controller.getTipXfo()
    const pointerVec = pointerXfo.ori.getZaxis().negate()
    const ray = new Ray(pointerXfo.tr, pointerVec)
    return ray
  } else {
    console.warn('unhandled pointer event')
    return new Ray()
  }
}

export { getPointerRay }
