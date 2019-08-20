/** Class representing a signal. */
class Signal {
  /**
   * Create a signal.
   */
  constructor() {
    this.__slots = [];
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.emit = this.emit.bind(this);
  }

  connect(fn) {
    if (fn == undefined)
      throw 'a function callback must be passed to Signal.connect';
    if (this.__slots.indexOf(fn) != -1) {
      console.warn('fn ' + fn.name + ' already connected to Signal.');
      return;
    }
    const id = this.__slots.length;
    this.__slots[id] = fn;

    if (this.__toggledSignal && this.__toggled) {
      // This signal has already been toggled, so we should emit immedietly.
      if (this.__data) fn(...this.__data);
      else fn();
    }
    return id;
  }

  disconnect(fn) {
    const ids = [];
    this.__slots.forEach(function(item, index) {
      if (item === fn) {
        ids.push(index);
      }
    });
    if (ids.length == 0) {
      console.warn(
        'callback :' +
          fn.name +
          ' was not connected to this signal:' +
          this.__name
      );
      return;
    }
    for (let id of ids) {
      this.__slots[id] = undefined;
    }
  }

  disconnectID(id) {
    if (!this.__slots[id]) throw 'Invalid ID';
    this.__slots[id] = undefined;
  }

  // emit the signal to all slots(observers)
  emit(...data) {
    const len = this.__slots.length;
    for (let i = 0; i < len; i++) {
      const fn = this.__slots[i];
      // Skip disconnected slots.
      if (fn) {
        fn(...data);
      }
    }
  }
}

export { Signal };
