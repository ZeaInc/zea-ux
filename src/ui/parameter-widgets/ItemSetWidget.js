import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';


// class ItemSetSelectionChange extends Change {
//   constructor(param, newValue) {
//     if(param) {
//       super(param ? (param.getName()+ ' Changed') : 'ParameterValueChange');
//       this.__prevValue = param.getValue();
//       this.__param = param;
//       if(newValue != undefined) {
//         this.__nextValue = newValue;
//         this.__param.setValue(this.__nextValue, Visualive.ValueSetMode.USER_SETVALUE);
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
//     this.__param.setValue(this.__prevValue, Visualive.ValueSetMode.USER_SETVALUE);
//   }

//   redo() {
//     if(!this.__param)
//       return;
//     this.__param.setValue(this.__nextValue, Visualive.ValueSetMode.USER_SETVALUE);
//   }

//   update(updateData) {
//     if(!this.__param)
//       return;
//     this.__nextValue = updateData.value;
//     this.__param.setValue(this.__nextValue, Visualive.ValueSetMode.USER_SETVALUE);
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
//     if(!param || !(param instanceof Visualive.Parameter)) {
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
//     this.__param.setValue(this.__nextValue, Visualive.ValueSetMode.USER_SETVALUE);
//   }
// }


export default class ItemSetWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);
    const items = Array.from(parameter.getValue());
    const select = document.createElement('select');
    select.setAttribute('size', items.length);
    for (let i=0; i < items.length; i++) {
      const item = items[i];
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(item.getName()));
      select.appendChild(option);
    }
    select.selectedIndex = -1;
    select.style.width='100%';

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.style.display='block';
    ul.appendChild(li);
    li.appendChild(select);

    parentDomElem.appendChild(ul);

    /////////////////////////////
    // SceneWidget Changes.
    this.selectionChanged = new Visualive.Signal();
    this.selectionDoubleClicked = new Visualive.Signal();

    let prevSelection = -1;
    parameter.valueChanged.connect(() => {
      if (!changing){
        select.selectedIndex = parameter.getValue()
      } 
    });

    select.addEventListener('change', (event) => {
      console.log("valueChange", select.selectedIndex)
      this.selectionChanged.emit(select.selectedIndex, prevSelection)
      prevSelection = select.selectedIndex;
    }); 
    select.addEventListener('dblclick', (event) => {
      console.log("dblclick", select.selectedIndex)
      const item = parameter.getItem(select.selectedIndex);
      appData.selectionManager.setSelection(new Set([item]));
      this.selectionDoubleClicked.emit(select.selectedIndex)
    }); 


    /////////////////////////////////
    // Add/Remove buttons.
    if(parameter.getFilterFn() != undefined) {
      const addButton = document.createElement('button');
      addButton.appendChild(document.createTextNode("Add"));
      addButton.addEventListener('click', (e) =>{
        console.log("Start picking mode.")
      });
      const removeButton = document.createElement('button');
      removeButton.appendChild(document.createTextNode("Remove"));
      removeButton.addEventListener('click', (e) =>{
        console.log("Start picking mode.")
      });
      const li = document.createElement('li');
      li.style.display='block';
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
  p => p instanceof Visualive.ItemSetParameter
);
