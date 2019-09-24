import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

const addQueryWidget = (querySet, query, parentDomElem, appData) => {
  // const container = document.createElement('div');
  // container.className = 'container';

  const ul = document.createElement('ul');
  ul.className = 'flex-editvalues';
  // container.appendChild(ul);

  // /////////////////////////////////
  // Enabled
  {
    const input = document.createElement('input');
    input.setAttribute('id', 'Enabled');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('tabindex', 0);
    input.checked = query.getEnabled();

    const li = document.createElement('li');
    li.textContent = 'Enabled: ';
    li.appendChild(input);
    ul.appendChild(li);

    // ///////////////////////////
    // Handle Changes.

    let change;
    query.valueChanged.connect(() => {
      if (!change) input.checked = query.getEnabled();
    });
    input.addEventListener('input', () => {
      // change = new ParameterValueChange(query, input.checked);
      // appData.undoRedoManager.addChange(change);
      // change = undefined;
      query.setEnabled(input.checked);
    });
  }
  // /////////////////////////////////
  // QueryType
  {
    const selectQueryType = document.createElement('select');
    selectQueryType.setAttribute('size', 1);
    const addQueryTypeOption = (name, value) => {
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(name));
      selectQueryType.appendChild(option);
    };
    const qt = ZeaEngine.QueryParameter.QUERY_TYPES;
    const map = {};
    Object.keys(qt).forEach((key, index) => {
      addQueryTypeOption(key, qt[key]);
      map[qt[key]] = index;
    });

    selectQueryType.selectedIndex = map[query.getQueryType()];
    selectQueryType.style.width = '100%';

    let changing = false;
    query.valueChanged.connect(() => {
      if (!changing) {
        selectQueryType.selectedIndex = map[query.getQueryType()];
      }
    });

    const valueChange = event => {
      changing = true;
      // const change = new ParameterValueChange(query, selectQueryType.selectedIndex);
      // appData.undoRedoManager.addChange(change);
      query.setQueryType(selectQueryType.selectedIndex);
      changing = false;
    };
    selectQueryType.addEventListener('change', valueChange);

    const li = document.createElement('li');
    li.appendChild(selectQueryType);
    ul.appendChild(li);
  }

  // /////////////////////////////////
  // QueryType
  {
    const selectMatchType = document.createElement('select');
    selectMatchType.setAttribute('size', 1);
    const addMathTypeOption = (name, value) => {
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(name));
      selectMatchType.appendChild(option);
    };
    const mt = ZeaEngine.QueryParameter.QUERY_MATCH_TYPE;
    const map = {};
    Object.keys(mt).forEach((key, index) => {
      addMathTypeOption(key, mt[key]);
      map[mt[key]] = index;
    });

    selectMatchType.selectedIndex = map[query.getMatchType()];
    selectMatchType.style.width = '100%';

    let changing = false;
    query.valueChanged.connect(() => {
      if (!changing) {
        selectMatchType.selectedIndex = map[query.getMatchType()];
      }
    });

    const valueChange = event => {
      changing = true;
      // const change = new ParameterValueChange(query, selectMatchType.selectedIndex);
      // appData.undoRedoManager.addChange(change);
      query.setMatchType(selectMatchType.selectedIndex);
      changing = false;
    };
    selectMatchType.addEventListener('change', valueChange);

    const li = document.createElement('li');
    li.appendChild(selectMatchType);
    ul.appendChild(li);
  }

  // /////////////////////////////////
  // Logic
  {
    const selectLogicType = document.createElement('select');
    selectLogicType.setAttribute('size', 1);
    const addMathTypeOption = (name, value) => {
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(name));
      selectLogicType.appendChild(option);
    };
    const ql = ZeaEngine.QueryParameter.QUERY_LOGIC;
    const map = {};
    Object.keys(ql).forEach((key, index) => {
      addMathTypeOption(key, ql[key]);
      map[ql[key]] = index;
    });

    selectLogicType.selectedIndex = map[query.getLocicalOperator()];
    selectLogicType.style.width = '100%';

    let changing = false;
    query.valueChanged.connect(() => {
      if (!changing) {
        selectLogicType.selectedIndex = map[query.getLocicalOperator()];
      }
    });

    const valueChange = event => {
      changing = true;
      // const change = new ParameterValueChange(query, selectLogicType.selectedIndex);
      // appData.undoRedoManager.addChange(change);
      query.setLocicalOperator(selectLogicType.selectedIndex);
      changing = false;
    };
    selectLogicType.addEventListener('change', valueChange);

    const li = document.createElement('li');
    li.appendChild(selectLogicType);
    ul.appendChild(li);
  }

  // /////////////////////////////////
  // Negate
  {
    const input = document.createElement('input');
    input.setAttribute('id', 'Negate');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('tabindex', 0);
    input.checked = query.getNegate();

    const li = document.createElement('li');
    li.textContent = 'Negate: ';
    li.appendChild(input);
    ul.appendChild(li);

    // ///////////////////////////
    // Handle Changes.

    let change;
    query.valueChanged.connect(() => {
      if (!change) input.checked = query.getNegate();
    });
    input.addEventListener('input', () => {
      // change = new ParameterValueChange(query, input.checked);
      // appData.undoRedoManager.addChange(change);
      // change = undefined;
      query.setNegate(input.checked);
    });
  }
  // /////////////////////////////////
  // Input
  {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', query.getValue());
    // input.setAttribute('tabindex', tabindex);
    input.style.width = '100%';

    // TODO: Please put these into a CSS file.
    input.style['background-color'] = '#EFEFEF';
    input.style['border-color'] = 'darkgrey';
    input.style['border-style'] = 'solid';
    input.style['border-width'] = 'thin';
    input.style['padding'] = '2px';

    const li = document.createElement('li');
    li.appendChild(input);
    ul.appendChild(li);
    query.valueChanged.connect(() => {
      input.value = query.getValue();
    });

    input.addEventListener('change', () => {
      const value = input.value;
      const change = new ParameterValueChange(query, value);
      appData.undoRedoManager.addChange(change);
    });
  }

  // /////////////////////////////////
  // Prop Name

  {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', query.getPropertyName());
    // input.setAttribute('tabindex', tabindex);
    input.style.width = '100%';

    // TODO: Please put these into a CSS file.
    input.style['background-color'] = '#EFEFEF';
    input.style['border-color'] = 'darkgrey';
    input.style['border-style'] = 'solid';
    input.style['border-width'] = 'thin';
    input.style['padding'] = '2px';
    input.disabled =
      query.getQueryType() != ZeaEngine.QueryParameter.QUERY_TYPES.PROPERTY;

    const li = document.createElement('li');
    li.appendChild(input);
    ul.appendChild(li);

    query.valueChanged.connect(() => {
      input.value = query.getPropertyName();
      input.disabled =
        query.getQueryType() != ZeaEngine.QueryParameter.QUERY_TYPES.PROPERTY;
    });

    input.addEventListener('change', () => {
      const value = input.value;
      const change = new ParameterValueChange(query, value);
      appData.undoRedoManager.addChange(change);
    });
  }

  const removeButton = document.createElement('button');
  removeButton.appendChild(document.createTextNode('Remove'));
  removeButton.addEventListener('click', e => {
    querySet.removeItem(query);
  });
  removeButton.style.margin = '2px';
  ul.appendChild(removeButton);

  // return container;
  return ul;
};

/**
 * Class representing a query set widget.
 * @extends BaseWidget
 */
export default class QuerySetWidget extends BaseWidget {
  /**
   * Create a query set widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const container = document.createElement('div');
    container.className = 'container';

    const ul0 = document.createElement('ul');
    container.appendChild(ul0);

    const queryList = document.createElement('ul');
    queryList.className = 'flex-editvalues';
    ul0.appendChild(queryList);

    // ///////////////////////////
    // Handle Changes.

    const updateDisplayedValue = () => {
      while (queryList.firstChild) {
        queryList.removeChild(queryList.firstChild);
      }

      const queries = parameter.getValue();
      Array.from(queries).forEach((item, index) => {
        queryList.appendChild(addQueryWidget(parameter, item, index, appData));
      });
    };

    parameter.valueChanged.connect(updateDisplayedValue);

    const queries = parameter.getValue();
    Array.from(queries).forEach((item, index) => {
      queryList.appendChild(addQueryWidget(parameter, item, index, appData));
    });

    const pickButton = document.createElement('button');
    pickButton.appendChild(document.createTextNode('Pick Geom'));
    pickButton.addEventListener('click', e => {
      console.log('Start picking mode.');
    });
    const addButton = document.createElement('button');
    addButton.appendChild(document.createTextNode('Add'));
    addButton.addEventListener('click', e => {
      parameter.addItem(new ZeaEngine.QueryParameter());
    });

    const li = document.createElement('li');
    li.style.display = 'block';
    addButton.style.margin = '2px';
    li.appendChild(addButton);
    ul0.appendChild(li);

    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(QuerySetWidget, p => p instanceof ZeaEngine.QuerySet);
