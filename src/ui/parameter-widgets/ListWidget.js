import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';

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
        
        const widget = new reg.widget(item, li, appData);
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
