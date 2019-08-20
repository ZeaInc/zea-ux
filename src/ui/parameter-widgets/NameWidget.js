import Change from '../../undoredo/Change.js';
import UndoRedoManager from '../../undoredo/UndoRedoManager.js';

import uxFactory from '../UxFactory.js';

/**
 * Class representing a name value change.
 * @extends Change
 */
class NameValueChange extends Change {
  /**
   * Create a name value change.
   * @param {any} item - The item value.
   * @param {any} newValue - The newValue value.
   */
  constructor(item, newValue) {
    if (item) {
      super(item ? item.getName() + ' Name Changed' : 'NameValueChange');
      this.__prevName = item.getName();
      this.__item = item;
      if (newValue != undefined) {
        this.__nextName = newValue;
        this.__item.setName(this.__nextName);
      }
    } else {
      super();
    }
  }

  getPrevValue() {
    return this.__prevName;
  }

  getNextValue() {
    return this.__nextName;
  }

  undo() {
    if (!this.__item) return;
    this.__item.setName(this.__prevName);
  }

  redo() {
    if (!this.__item) return;
    this.__item.setName(this.__nextName);
  }

  update(updateData) {
    if (!this.__item) return;
    this.__nextName = updateData.value;
    this.__item.setName(this.__nextName);
    this.updated.emit(updateData);
  }

  toJSON(appData) {
    const j = {
      name: this.name,
      itemPath: this.__item.getPath(),
    };
    if (this.__nextName != undefined) {
      if (this.__nextName.toJSON) {
        j.value = this.__nextName.toJSON();
      } else {
        j.value = this.__nextName;
      }
    }
    return j;
  }

  fromJSON(j, appData) {
    let item = appData.scene.getRoot().resolvePath(j.itemPath, 1);
    if (!item || !(item instanceof Visualive.itemeter)) {
      console.warn('resolvePath is unable to resolve', j.itemPath);
      return;
    }
    this.__item = item;
    this.__prevName = this.__item.getName();
    if (this.__prevName.clone) this.__nextName = this.__prevName.clone();
    else this.__nextName = this.__prevName;

    this.name = this.__item.getName() + ' Changed';
    if (j.value != undefined) this.changeFromJSON(j);
  }

  changeFromJSON(j) {
    if (!this.__item) return;
    if (this.__nextName.fromJSON) this.__nextName.fromJSON(j.value);
    else this.__nextName = j.value;
    this.__item.setName(this.__nextName);
  }
}

UndoRedoManager.registerChange('NameValueChange', NameValueChange);

export default class NameWidget {
  constructor(item, parentDomElem, appData) {
    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('type', 'text');
    input.setAttribute('value', item.getName());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    /////////////////////////////
    // SceneWidget Changes.

    let change;
    item.nameChanged.connect(() => {
      if (!change) {
        input.value = item.getName();
      }
    });

    const valueChange = () => {
      const value = input.value;
      if (!change) {
        change = new NameValueChange(item, value);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value });
      }
    };

    const valueChangeEnd = () => {
      valueChange();
      change = undefined;
    };

    input.addEventListener('input', valueChange);
    input.addEventListener('change', valueChangeEnd);
  }
}
