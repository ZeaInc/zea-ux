import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class ItemSetWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
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
    select.selectedIndex = parameter.getValue();
    select.style.width='100%';

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.style.display='block';
    ul.appendChild(li);
    li.appendChild(select);

    parentDomElem.appendChild(ul);

    /////////////////////////////
    // SceneWidget Changes.

    let changing = false;

    parameter.valueChanged.connect(() => {
      if (!changing){
        select.selectedIndex = parameter.getValue()
      } 
    });

    select.addEventListener('change', (event) => {
      console.log("valueChange")
      changing = true;
      // const change = new ParameterValueChange(parameter, select.selectedIndex);
      // undoRedoManager.addChange(change);
      changing = false;
    }); 
    select.addEventListener('dblclick', (event) => {
      console.log("dblclick")
      changing = true;
      // const change = new ParameterValueChange(parameter, select.selectedIndex);
      // undoRedoManager.addChange(change);
      changing = false;
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

visualiveUxFactory.registerWidget(
  ItemSetWidget,
  p => p instanceof Visualive.ItemSetParameter
);
