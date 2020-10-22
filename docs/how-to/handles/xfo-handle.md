# Xfo Handle
The UX library adds support fot basic transformations over the scene objects through the [XfoHandle](api/Handles/XfoHandle) class.
After it is instantiated, you can switch between three modes `Translate`, `Rotate` and `Scale`.

You would need to instantiate and attach the handle to an item. It won't show anything out of the box, you'd need to tell the handle what to display using the `showHandles` method.

```javascript
const { XfoHandle } = window.zeaUx

// Instantiate the handle
const xfoHandle = new XfoHandle()

// Add it to the item
treeItem.addChild(xfoHandle)
// Tell the handle the mode you want to display
xfoHandle.showHandles('Translate')
```

#### **XfoHandle Modes**
* **Translate:** Lets you moves the target object(s) along the X, Y, Z coordinates or a plane combination between two axes.
* **Rotate:** Lets you change the orientation of the object(s) around one or multiple axes.
* **Scale:** Lets you change the proportions of the objects.

## Demo
Please refer to the demo code for further understanding.

!> You don't need to create one XfoHandle for each mode, you can simply stitch between modes using `showHandles` method.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-xfo-handle?path=index.html&previewSize=100"
    title="zea-demo-xfo-handle on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>