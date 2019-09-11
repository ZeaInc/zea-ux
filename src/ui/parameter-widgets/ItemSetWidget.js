import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';

// class ItemSetSelectionChange extends Change {
//   constructor(param, newValue) {
//     if(param) {
//       super(param ? (param.getName()+ ' Changed') : 'ParameterValueChange');
//       this.__prevValue = param.getValue();
//       this.__param = param;
//       if(newValue != undefined) {
//         this.__nextValue = newValue;
//         this.__param.setValue(this.__nextValue, ZeaEngine.ValueSetMode.USER_SETVALUE);
//       }
//     }
//     else {
//       super();
//     }
//   }

//   getPrevValue() {
//     return this.__prevValue;
//   }
//   getNextValue() {
//     return this.__nextValue;
//   }

//   undo() {
//     if(!this.__param)
//       return;
//     this.__param.setValue(this.__prevValue, ZeaEngine.ValueSetMode.USER_SETVALUE);
//   }

//   redo() {
//     if(!this.__param)
//       return;
//     this.__param.setValue(this.__nextValue, ZeaEngine.ValueSetMode.USER_SETVALUE);
//   }

//   update(updateData) {
//     if(!this.__param)
//       return;
//     this.__nextValue = updateData.value;
//     this.__param.setValue(this.__nextValue, ZeaEngine.ValueSetMode.USER_SETVALUE);
//     this.updated.emit(updateData);
//   }

//   toJSON(appData) {
//     const j = {
//       name: this.name,
//       paramPath: this.__param.getPath()
//     }
//     if(this.__nextValue != undefined) {
//       if (this.__nextValue.toJSON) {
//         j.value = this.__nextValue.toJSON();
//       } else {
//         j.value = this.__nextValue;
//       }
//     }
//     return j;
//   }

//   fromJSON(j, appData) {
//     let param = appData.scene.getRoot().resolvePath(j.paramPath, 1);
//     if(!param || !(param instanceof ZeaEngine.Parameter)) {
//       console.warn("resolvePath is unable to resolve", j.paramPath);
//       return;
//     }
//     this.__param = param;
//     this.__prevValue = this.__param.getValue();
//     if (this.__prevValue.clone)
//       this.__nextValue = this.__prevValue.clone();
//     else
//       this.__nextValue = this.__prevValue;

//     this.name = this.__param.getName() + ' Changed';
//     if(j.value != undefined)
//       this.changeFromJSON(j);
//   }

//   changeFromJSON(j) {
//     if(!this.__param)
//       return;
//     if (this.__nextValue.fromJSON)
//       this.__nextValue.fromJSON(j.value);
//     else
//       this.__nextValue = j.value;
//     this.__param.setValue(this.__nextValue, ZeaEngine.ValueSetMode.USER_SETVALUE);
//   }
// }

/**
 * Class representing an item set widget.
 * @extends BaseWidget
 */
export default class ItemSetWidget extends BaseWidget {
  /**
   * Create an item set widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);
    const select = document.createElement('select');

    const rebuild = () => {
      const items = Array.from(parameter.getValue());
      select.setAttribute('size', items.length + 1);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const option = document.createElement('option');
        option.appendChild(document.createTextNode(item.getName()));
        select.appendChild(option);
      }
    };
    parameter.valueChanged.connect(() => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
      rebuild();
    });
    rebuild();

    select.selectedIndex = -1;
    select.style.width = '100%';

    const ul = document.createElement('ul');
    ul.style.width = '100%';
    ul.style['padding-inline-start'] = '0px';
    const li = document.createElement('li');
    li.style.display = 'block';
    ul.appendChild(li);
    li.appendChild(select);

    parentDomElem.appendChild(ul);

    // ///////////////////////////
    // Handle Changes.
    this.selectionChanged = new ZeaEngine.Signal();
    this.selectionDoubleClicked = new ZeaEngine.Signal();

    let prevSelection = -1;

    select.addEventListener('change', event => {
      console.log('valueChange', select.selectedIndex);
      this.selectionChanged.emit(select.selectedIndex, prevSelection);
      prevSelection = select.selectedIndex;
    });
    select.addEventListener('dblclick', event => {
      console.log('dblclick', select.selectedIndex);
      const item = parameter.getItem(select.selectedIndex);
      appData.selectionManager.setSelection(new Set([item]));
      this.selectionDoubleClicked.emit(select.selectedIndex);
    });

    // ///////////////////////////////
    // Add/Remove buttons.
    if (parameter.getFilterFn() != undefined) {
      const addButton = document.createElement('button');
      addButton.appendChild(document.createTextNode('Add'));
      addButton.addEventListener('click', e => {
        console.log('Start picking mode.');
      });
      const removeButton = document.createElement('button');
      removeButton.appendChild(document.createTextNode('Remove'));
      removeButton.addEventListener('click', e => {
        console.log('Start picking mode.');
      });
      const li = document.createElement('li');
      li.style.display = 'block';
      addButton.style.margin = '2px';
      removeButton.style.margin = '2px';
      li.appendChild(addButton);
      li.appendChild(removeButton);
      ul.appendChild(li);
    }
  }
}

uxFactory.registerWidget(
  ItemSetWidget,
  p => p instanceof ZeaEngine.ItemSetParameter
);
