# Arc Slider
The [ArcSlider](api/Handles/ArcSlider) is a widget for the scene that moves over a range of values and emits events when it changes.

Its implementation is very straight forward:
```javascript
const { ArcSlider } = window.zeaUx

...

// Instantiate the widget
const arcSlider = new ArcSlider('BrakePedalSlider')
// Add widget configuration
arcSlider.getParameter('Handle Radius').setValue(0.013)
arcSlider.getParameter('Arc Radius').setValue(0.7)
arcSlider.getParameter('Arc Angle').setValue(0.9)

// Append it to the scene/item
scene.getRoot().addChild(arcSlider)

...
```


## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-arc-slider?path=index.html&previewSize=100"
    title="zea-demo-arc-slider on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>