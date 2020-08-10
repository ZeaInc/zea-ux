### Functions

<dl>
<dt><a href="#toSvg">toSvg(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#toPixelData">toPixelData(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#toCanvas">toCanvas(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#toPng">toPng(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#toJpeg">toJpeg(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#toBlob">toBlob(node, options)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
</dl>

<a name="toSvg"></a>

### toSvg

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a SVG image data URL  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options |
| options.filter | <code>function</code> | Should return true if passed node should be included in the output          (excluding node means excluding it's children as well). Not called on the root node. |
| options.bgcolor | <code>string</code> | color for the background, any valid CSS color value. |
| options.width | <code>number</code> | width to be applied to node before rendering. |
| options.height | <code>number</code> | height to be applied to node before rendering. |
| options.style | <code>Object</code> | an object whose properties to be copied to node's style before rendering. |
| options.quality | <code>number</code> | a Number between 0 and 1 indicating image quality (applicable to JPEG only),                 defaults to 1.0. |
| options.imagePlaceholder | <code>string</code> | dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch |
| options.cacheBust | <code>boolean</code> | set to true to cache bust by appending the time to the request url |

<a name="toPixelData"></a>

### toPixelData

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options, @see [toSvg](#toSvg) |

<a name="toCanvas"></a>

### toCanvas

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options, @see [toSvg](#toSvg) |

<a name="toPng"></a>

### toPng

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a PNG image data URL  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options, @see [toSvg](#toSvg) |

<a name="toJpeg"></a>

### toJpeg

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a JPEG image data URL  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options, @see [toSvg](#toSvg) |

<a name="toBlob"></a>

### toBlob

**Returns**: <code>Promise</code> - - A promise that is fulfilled with a PNG image blob  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | The DOM Node object to render |
| options | <code>Object</code> | Rendering options, @see [toSvg](#toSvg) |

