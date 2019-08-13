import uxFactory from './UxFactory.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class ActionTreeView {
  constructor(domElement, actionRegistry) {
    this.domElement = domElement;
    this.actionRegistry = actionRegistry;

    this.__existingItems = {};

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    const actions = this.actionRegistry.getActions();
    actions.forEach(action => {
      if (action.availableInVR == true) this._addMenuItem(ul, action);
    });
    this.actionRegistry.actionAdded.connect(action => {
      if (action.availableInVR == true) this._addMenuItem(ul, action);
    });
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

  _addMenuItem(domElement, action) {
    const a = document.createElement('a');
    a.href = '#';

    let classes = 'pure-menu-link VRUIElement';
    let hilighted = false;
    let activated = false;
    a.className = classes;

    a.addEventListener('mouseenter', e => {
      if (!activated) a.className = classes + ' HighlightedMenu';
    });
    a.addEventListener('mouseleave', e => {
      if (activated) a.className = classes + ' ActionedMenu';
      else a.className = classes;
    });

    if (action.activatedChanged) {
      action.activatedChanged.connect(state => {
        if (state) a.className = classes + ' ActionedMenu';
        else a.className = classes;
        activated = state;
      });
    } else {
      a.addEventListener('mousedown', e => {
        a.className = classes + ' ActionedMenu';
      });
      a.addEventListener('mouseup', e => {
        a.className = classes + ' HighlightedMenu';
      });
    }

    if (action.callback) {
      a.addEventListener('click', e => {
        e.preventDefault();
        action.callback();
      });
    }

    domElement.appendChild(a);
    this._addSpanTo(a, 'ActionTitle', action.name);
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

export { ActionTreeView };
