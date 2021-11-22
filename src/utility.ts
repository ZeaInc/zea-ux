import { Ray } from "@zeainc/zea-engine"
import { XRControllerEvent } from "@zeainc/zea-engine/dist/Utilities/Events/XRControllerEvent"
import { ZeaMouseEvent } from "@zeainc/zea-engine/dist/Utilities/Events/ZeaMouseEvent"
import { ZeaPointerEvent } from "@zeainc/zea-engine/dist/Utilities/Events/ZeaPointerEvent"
import { ZeaTouchEvent } from "@zeainc/zea-engine/dist/Utilities/Events/ZeaTouchEvent"

function getPointerRay(event: ZeaPointerEvent)  {
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


export {getPointerRay}