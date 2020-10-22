# Linear Movement Handle
The [LinearMovementHandle](api/Handles/LinearMovementHandle) is another basic transformation that moves objects over along the specified axis.
This is implemented for translation in the [Xfo Handle](how-to/handles/xfo-handle), but it is created as a separate class for reusability.

Implementation:
```javascript
const { LinearMovementHandle } = window.zeaUx

...
// Create the TreeItem that hosts the object you want to have the handle
const treeItem = new TreeItem('TranslateTarget')


const linearMovementHandle = new LinearMovementHandle('linear1', 0.2, 0.002, new Color('#6600FF'))
// Specify the axes in what you want to translate children objects
const xfo = new Xfo()
// The movement of this handle is on `X` axis.
xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
linearMovementHandle.getParameter('LocalXfo').setValue(xfo)

treeItem.addChild(linearMovementHandle)
scene.getRoot().addChild(treeItem)
...
```

## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-linear-movement-handle-?path=index.html&previewSize=100"
    title="zea-demo-linear-movement-handle- on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>