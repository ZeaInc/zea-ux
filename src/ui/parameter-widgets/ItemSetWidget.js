import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';

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
    select.classList.add('itemset-items')

    const rebuild = () => {
      const items = Array.from(parameter.getValue());
      select.setAttribute('size', items.length + 1);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const option = document.createElement('option');
        option.appendChild(document.createTextNode(item.getPath()));
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
        // console.log('Start picking mode.');
        appData.selectionManager.startPickingMode(
          `Pick a new item.`,
          items => {
            // const change = new ParameterValueChange(parameter, items);
            // appData.undoRedoManager.addChange(change);
            parameter.addItems(items)
          },
          parameter.getFilterFn(),
          1
        );
      });
      const removeButton = document.createElement('button');
      removeButton.appendChild(document.createTextNode('Remove'));
      removeButton.addEventListener('click', e => {
        parameter.removeItem(select.selectedIndex)
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
