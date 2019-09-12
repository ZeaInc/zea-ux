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
export default class ListWidget extends BaseWidget {
  /**
   * Create an item set widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);
    const listitemWidgets = [];

    const rebuild = () => {
      const items = Array.from(parameter.getValue());
      items.forEach((item, index) => {
        const reg = uxFactory.findWidgetReg(item);
        if (!reg) {
          console.warn(
            `ListWidget Unable to display list item '${item.getNam()}'`
          );
          return;
        }
        const li = document.createElement('li');
        
        // const labelElem = document.createElement('label');
        // labelElem.setAttribute('for', parameterName);
        // labelElem.appendChild(document.createTextNode(parameterName));
        // li.appendChild(labelElem);
        
        const widget = new reg.widget(item, li, this.appData);
        listitemWidgets[index] = widget;


        const removeButton = document.createElement('button');
        removeButton.appendChild(document.createTextNode('Remove'));
        removeButton.addEventListener('click', e => {
          parameter.removeElement(index);
        });
        removeButton.style.margin = '2px';
        li.appendChild(removeButton);

        ul_listitems.appendChild(li);
      });
    };
    parameter.valueChanged.connect(() => {
      while (ul_listitems.firstChild) {
        ul_listitems.removeChild(ul_listitems.firstChild);
      }
      rebuild();
    });

    const ul = document.createElement('ul');
    ul.style.width = '100%';
    ul.style['padding-inline-start'] = '0px';
    const li = document.createElement('li');
    li.style.display = 'block';
    ul.appendChild(li);
    
    const ul_listitems = document.createElement('ul');
    ul_listitems.style.display = 'block';
    ul.appendChild(ul_listitems);

    rebuild();

    parentDomElem.appendChild(ul);


    // ///////////////////////////////
    // Add/Remove buttons.
    // if (parameter.getFilterFn() != undefined) 
    {
      const li = document.createElement('li');
      li.style.display = 'block';

      const addButton = document.createElement('button');
      addButton.appendChild(document.createTextNode('Add'));
      addButton.addEventListener('click', e => {
        // console.log('Start picking mode.');
        parameter.addElement();
      });
      addButton.style.margin = '2px';
      li.appendChild(addButton);
      ul.appendChild(li);
    }
  }
}

uxFactory.registerWidget(
  ListWidget,
  p => p instanceof ZeaEngine.ListParameter
);
