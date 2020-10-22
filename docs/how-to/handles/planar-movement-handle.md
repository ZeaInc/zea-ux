# Planar Movement Handle
The [PlanarMovementHandle](api/Handles/PlanarMovementHandle) is a basic transformation that moves objects over a plane(combination of two axes).
This is implemented for translation in the [Xfo Handle](how-to/handles/xfo-handle), but it is created as a separate class for reusability.

Implementation:
```javascript
const { PlanarMovementHandle } = window.zeaUx

...
// Create the TreeItem that hosts the object you want to have the handle
const treeItem = new TreeItem('TranslateTarget')

// Create the object that is affected by the translation
const geometry = new Cuboid(0.5, 0.5, 0.5)
const geomItem = new GeomItem('handle', geometry, new Material('handle', 'FlatSurfaceShader'))

// Instantiate the handler, by default it is `XY` axes translation
const planarMovementHandle = new PlanarMovementHandle('planar1')
// Add the object as a child.
planarMovementHandle.addChild(geomItem)
treeItem.addChild(planarMovementHandle)
scene.getRoot().addChild(treeItem)
...
```

## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-planar-movement-handle?path=index.html&previewSize=100"
    title="zea-demo-planar-movement-handle on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>