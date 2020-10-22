# Undo-Redo Manager
The [UndoRedoManager](api/UndoRedo/UndoRedoManager) is a system in charge of operating the **change** history in your apps, but not only that, it also includes persistence support.

Every movement in the manager is considered a [Change](api/UndoRedo/Change), so you would need to implement the specific behavior by extending that class.

### Basic Demo
Here we create a specific implementation of the [Change](api/UndoRedo/Change) class that removes the last color generated on `undo` and adds it back on `redo`.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/zea-demo-undo-redo-manager?path=index.html&previewSize=100"
    title="zea-demo-undo-redo-manager on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>