# Screen Space Movement Handle
The [ScreenSpaceMovementHandle](api/Handles/ScreenSpaceMovementHandle) is a basic transformation that moves objects parallel to the camera view.

Implementation:
```javascript
const { ScreenSpaceMovementHandle } = window.zeaUx

...
// Create the TreeItem that hosts the object you want to have the handle
const treeItem = new TreeItem('TranslateTarget')

// Instantiate the handle
const screenSpaceMovementHandle = new ScreenSpaceMovementHandle('FooScreenSpaceMovementHandle')

// Create the object that is going to be modified by the handler
const geometry = new Sphere(0.03, 64)
const geomItem = new GeomItem('handle', geometry, new Material('handle', 'FlatSurfaceShader'))

screenSpaceMovementHandle.addChild(geomItem)
treeItem.addChild(screenSpaceMovementHandle)
scene.getRoot().addChild(treeItem)
...
```

## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-screen-space-movement-handle?path=index.html&previewSize=100"
    title="zea-demo-screen-space-movement-handle on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>