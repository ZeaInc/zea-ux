import visualiveUxFactory from './VisualiveUxFactory.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class ActionTreeView {
  constructor(domElement, actionRegistry) {
    this.domElement = domElement;
    this.actionRegistry = actionRegistry;

    this.__existingItems = {};

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    const actions = this.actionRegistry.getActions();
    actions.forEach(action => {
      if(action.availableInVR == true)
        this._addMenuItem(ul, action);
    });
    this.actionRegistry.actionAdded.connect((action)=>{
      if(action.availableInVR == true)
        this._addMenuItem(ul, action);
    })
  }

  _addMenuItem(domElement, action) {
    const parentElement = domElement;
    const a = this._addActionTo(parentElement, 'pure-menu-link', null, action.callback);
    this._addSpanTo(a, 'ActionTitle', action.name);
  }

  _addSpanTo(domElement, className, innerHTML) {
    const span = document.createElement('span');
    span.className = className;
    if (innerHTML) {
      span.innerHTML = innerHTML;
    }
    domElement.appendChild(span);
    return span;
  }

  _addActionTo(domElement, className, innerHTML, onClick) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = className;
    if (innerHTML) {
      a.innerHTML = innerHTML;
    }
    if (onClick) {
      a.addEventListener('click', e => {
        e.preventDefault();
        onClick();
      });

      let classes;
      a.addEventListener('mouseenter', e => {
        classes = a.className;
        a.className += " HighlightedMenu";
      });
      a.addEventListener('mouseleave', e => {
        a.className = classes;
      });
    }
    domElement.appendChild(a);
    return a;
  }

  _addUlTo(domElement, className, innerHTML) {
    const ul = document.createElement('ul');
    ul.className = className;
    if (innerHTML) {
      ul.innerHTML = innerHTML;
    }
    domElement.appendChild(ul);
    return ul;
  }

  _addLiTo(domElement, className, innerHTML) {
    const li = document.createElement('li');
    li.className = className;
    if (innerHTML) {
      li.innerHTML = innerHTML;
    }
    domElement.appendChild(li);
    return li;
  }
}

export default ActionTreeView;
