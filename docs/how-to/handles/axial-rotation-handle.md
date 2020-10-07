# Axial Rotation Handle
The [AxialRotationHandle](api/Handles/AxialRotationHandle) is a basic transformation that rotates objects over the specified axis.
This is implemented for rotation in the [Xfo Handle](how-to/handles/xfo-handle), but it is created as a separate class for reusability.

The implementation is easy:

```javascript
const { AxialRotationHandle } = window.zeaUx

...
// Create the TreeItem that hosts the handle
const treeItem = new TreeItem('TranslateTarget')

// Instantiate the handle
const axialRotationHandle = new AxialRotationHandle('axial1', 0.2, 0.007, new Color('#6600FF'))
// Specify the axis you want to rotate the object with the handle.
const xfo1 = new Xfo()
// This is rotation over `Y` axis
xfo1.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
axialRotationHandle.getParameter('LocalXfo').setValue(xfo1)

// Add the object that will be affected by the handle
const geometry = new Cuboid(0.5, 0.5, 0.5)
const material1 = new Material('handle', 'SimpleSurfaceShader')
material1.getParameter('BaseColor').setValue(new Color(89 / 255, 182 / 255, 92 / 255))
const geometryItem = new GeomItem('handle', geometry, material1)

axialRotationHandle.addChild(geometryItem)
treeItem.addChild(axialRotationHandle)
scene.getRoot().addChild(treeItem)
```

## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-axial-rotation-handle?path=index.html&previewSize=100"
    title="zea-demo-axial-rotation-handle on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>