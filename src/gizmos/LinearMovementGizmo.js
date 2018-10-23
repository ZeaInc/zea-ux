import { Gizmo } from './Gizmo.js';

export default class LinearMovementGizmo extends Gizmo {
    constructor(gl, context, name, color, xfo) {
        super(color);

    };

    getManipulationPlane(viewport){
        return new Ray(this.getGlobalXfo().tr, this.getGlobalXfo().ori.getZaxis());
    }

    onDragStart(event, grabPos) {
        this.manipRay = new Ray(this.getGlobalXfo().tr, this.getGlobalXfo().ori.getZaxis());
        this.mouseDownDist = this.manipRay.intersectRayVector(event.ray)[0];
        this.__context.beginManipulation();
    };

    onDrag(event, holdPos) {
        const dist = this.manipRay.intersectRayVector(event.ray)[0];
        const delta = (dist - this.mouseDownDist);
        this.__context.translate(this.manipRay.dir.scale(delta));
    };

    onDragEnd(event, releasePos) {
        this.__context.endManipulation();
    };

};
