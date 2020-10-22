# Slider Handle
The [SliderHandle](api/Handles/SliderHandle) is another widget for the scene, similar to the [Arc Slider](how-to/handles/arc-slider).
Its movement is linear and also varies between a range of values, allowing event capturing from its parameters.

This is how you can implement it:
```javascript
const { SliderHandle } = window.zeaUx

...
// By default it comes with values, so you don't need to add any extra information.
// If you want to customize it, check SliderHandle's parameters in the API documentation.
const sliderHandle = new SliderHandle('SliderHandleFoo')
scene.getRoot().addChild(sliderHandle)
...
```

## Demo
Please refer to the demo code for further understanding.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-slider-handle?path=index.html&previewSize=100"
    title="zea-demo-slider-handle on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>