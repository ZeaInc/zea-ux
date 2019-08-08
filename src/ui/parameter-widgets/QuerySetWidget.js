// import * as Visualive from '@visualive/engine';

import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

const addQueryWidget = (parameter, parentDomElem, appData) => {

    // const container = document.createElement('div');
    // container.className = 'container';

    const ul = document.createElement('ul');
    ul.className = 'flex-editvalues';
    // container.appendChild(ul);

    ///////////////////////////////////
    // QueryType
    {
      const selectQueryType = document.createElement('select');
      selectQueryType.setAttribute('size', 1);
      const addQueryTypeOption = (name, value)=>{
        const option = document.createElement('option');
        option.appendChild(document.createTextNode(name));
        selectQueryType.appendChild(option);
      }
      const qt = Visualive.QueryParameter.QUERY_TYPES
      const map = {}
      Object.keys(qt).forEach((key,  index) => {
        addQueryTypeOption(key, qt[key])
        map[qt[key]] = index;
      });

      selectQueryType.selectedIndex = map[parameter.getQueryType()];
      selectQueryType.style.width='100%';


      let changing = false;
      parameter.valueChanged.connect(() => {
        if (!changing){
          selectQueryType.selectedIndex = map[parameter.getQueryType()];
        } 
      });

      const valueChange = (event) => {
        changing = true;
        // const change = new ParameterValueChange(parameter, selectQueryType.selectedIndex);
        // appData.undoRedoManager.addChange(change);
        parameter.setQueryType(selectQueryType.selectedIndex)
        changing = false;
      };
      selectQueryType.addEventListener('change', valueChange);

      const li = document.createElement('li');
      li.appendChild(selectQueryType);
      ul.appendChild(li);
    }


    ///////////////////////////////////
    // QueryType
    {
      const selectMatchType = document.createElement('select');
      selectMatchType.setAttribute('size', 1);
      const addMathTypeOption = (name, value)=>{
        const option = document.createElement('option');
        option.appendChild(document.createTextNode(name));
        selectMatchType.appendChild(option);
      }
      const mt = Visualive.QueryParameter.QUERY_MATCH_TYPE
      const map = {}
      Object.keys(mt).forEach((key,  index) => {
        addMathTypeOption(key, mt[key])
        map[mt[key]] = index;
      });

      selectMatchType.selectedIndex = map[parameter.getMatchType()];
      selectMatchType.style.width='100%';


      let changing = false;
      parameter.valueChanged.connect(() => {
        if (!changing){
          selectMatchType.selectedIndex = map[parameter.getMatchType()];
        } 
      });

      const valueChange = (event) => {
        changing = true;
        // const change = new ParameterValueChange(parameter, selectMatchType.selectedIndex);
        // appData.undoRedoManager.addChange(change);
        parameter.setMatchType(selectMatchType.selectedIndex)
        changing = false;
      };
      selectMatchType.addEventListener('change', valueChange);

      const li = document.createElement('li');
      li.appendChild(selectMatchType);
      ul.appendChild(li);
    }

    ///////////////////////////////////
    // Logic
    {
      const selectLogicType = document.createElement('select');
      selectLogicType.setAttribute('size', 1);
      const addMathTypeOption = (name, value)=>{
        const option = document.createElement('option');
        option.appendChild(document.createTextNode(name));
        selectLogicType.appendChild(option);
      }
      const ql = Visualive.QueryParameter.QUERY_LOGIC
      const map = {}
      Object.keys(ql).forEach((key,  index) => {
        addMathTypeOption(key, ql[key])
        map[ql[key]] = index;
      });

      selectLogicType.selectedIndex = map[parameter.getLocicalOperator()];
      selectLogicType.style.width='100%';

      let changing = false;
      parameter.valueChanged.connect(() => {
        if (!changing){
          selectLogicType.selectedIndex = map[parameter.getLocicalOperator()];
        } 
      });

      const valueChange = (event) => {
        changing = true;
        // const change = new ParameterValueChange(parameter, selectLogicType.selectedIndex);
        // appData.undoRedoManager.addChange(change);
        parameter.setMatchType(selectLogicType.selectedIndex)
        changing = false;
      };
      selectLogicType.addEventListener('change', valueChange);

      const li = document.createElement('li');
      li.appendChild(selectLogicType);
      ul.appendChild(li);
    }

    ///////////////////////////////////
    // Input
    {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('value', parameter.getValue());
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
      
      parameter.valueChanged.connect(() => {
        input.value = parameter.getValue();
      });

      input.addEventListener('change', () => {
        const value = input.value
        const change = new ParameterValueChange(parameter, value);
        appData.undoRedoManager.addChange(change);
      });
    }


    ///////////////////////////////////
    // Prop Name

    {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('value', parameter.getPropertyName());
      // input.setAttribute('tabindex', tabindex);
      input.style.width = '100%';

      const li = document.createElement('li');
      li.appendChild(input);
      ul.appendChild(li);

      parameter.valueChanged.connect(() => {
        input.value = parameter.getPropertyName();
      });

      input.addEventListener('change', () => {
        const value = input.value
        const change = new ParameterValueChange(parameter, value);
        appData.undoRedoManager.addChange(change);
      });
    }

    // return container;
    return ul;
  }

export default class QuerySetWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const container = document.createElement('div');
    container.className = 'container';

    const ul = document.createElement('ul');
    ul.className = 'flex-editvalues';
    container.appendChild(ul);

    const xfo = parameter.getValue();

    /////////////////////////////
    // SceneWidget Changes.

    let change = undefined;

    const updateDisplayedValue = () => {
      // if (!change) {
      //   const xfo = parameter.getValue();
      //   tr_xField.value = xfo.tr.x;
      //   tr_yField.value = xfo.tr.y;
      //   tr_zField.value = xfo.tr.z;
      //   ori_xField.value = xfo.ori.x;
      //   ori_yField.value = xfo.ori.y;
      //   ori_zField.value = xfo.ori.z;
      //   ori_wField.value = xfo.ori.w;
      //   sc_xField.value = xfo.sc.x;
      //   sc_yField.value = xfo.sc.y;
      //   sc_zField.value = xfo.sc.z;
      // }
    }

    parameter.valueChanged.connect(updateDisplayedValue);

    const queries = parameter.getValue();
    Array.from(queries).forEach((item, index) => {
      ul.appendChild(addQueryWidget(item, index, appData));
    })

    const pickButton = document.createElement('button');
    pickButton.appendChild(document.createTextNode("Pick Geom"));
    pickButton.addEventListener('click', (e) =>{
      console.log("Start picking mode.")
    });
    const addButton = document.createElement('button');
    addButton.appendChild(document.createTextNode("Add"));
    // addButton.addEventListener('click', (e) =>{
    //   console.log("Start picking mode.")
    // });
    const removeButton = document.createElement('button');
    removeButton.appendChild(document.createTextNode("Remove"));
    // removeButton.addEventListener('click', (e) =>{
    //   console.log("Start picking mode.")
    // });
    const li = document.createElement('li');
    li.style.display='block';
    addButton.style.margin = '2px';
    removeButton.style.margin = '2px';
    li.appendChild(addButton);
    li.appendChild(removeButton);
    ul.appendChild(li);

    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(
  QuerySetWidget,
  p => p instanceof Visualive.QuerySet
);
