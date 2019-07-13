
class TopMenuBar {
  constructor(actionRegistry, domElement) {
    this.actionRegistry = actionRegistry;
    this.domElement = domElement;
    this.__existingItems = {};
    this.__hotkeysToActions = {};

    this._buildTopBar();
    this._addKeyListener();
  }

  _buildTopBar() {
    this.domElement.innerHTML = '';

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    const actions = this.actionRegistry.getActions();
    actions.forEach(action => {
      this._addMenuItem(ul, action);
    });

    this.actionRegistry.actionAdded.connect((action)=>{
      this._addMenuItem(ul, action);
    })
  }

  _addMenuItem(domElement, action) {
    let parentElement = domElement;
    for(let i=0; i<action.path.length; i++) {
      const pathItem = action.path[i];
      if(!this.__existingItems[pathItem]) {
        const li = this._addLiTo(parentElement, 'pure-menu-item');
        li.classList.add('pure-menu-has-children', 'pure-menu-allow-hover');
        const a = this._addATo(li, 'pure-menu-link', pathItem);

        const ul = this._addUlTo(li, 'pure-menu-children shadow-3');

        this.__existingItems[pathItem] = ul;
      }
      parentElement = this.__existingItems[pathItem]
    }

    const a = this._addATo(parentElement, 'pure-menu-link', null, action.callback);
    this._addSpanTo(a, 'ActionTitle', action.name);
    this._addSpanTo(a, 'ActionShortcut', this._keyComboAsText(action));

    if(action.key || action.metaKeys) {
      const metaKeys = action.metaKeys || {};
      const keyComboExpected = (
        this._comboFragment(metaKeys.alt, 'A') +
        this._comboFragment(metaKeys.control, 'C') +
        this._comboFragment(metaKeys.shift, 'S') +
        (action.key || '')).toLowerCase();
      this.__hotkeysToActions[keyComboExpected] = action;
    }

    if (action.callback) {
      a.addEventListener('click', e => {
        e.preventDefault();
        action.callback.call(action);
      });
    }
    if (action.activatedChanged) {
      action.activatedChanged.connect((state)=>{
        if(state)
          a.className = "pure-menu-link ActionedMenu";
        else
          a.className = "pure-menu-link";
      })
    }
  }

  _addKeyListener() {
    let keyComboPressed;
    
    document.addEventListener('keypress', e => {
      console.log("keypress")
    });
    document.addEventListener('keydown', e => {
      if(keyComboPressed)
        return;
      // Ignore events intended for input elements.
      if(e.target instanceof HTMLInputElement)
        return;
      let keys = (
        this._comboFragment(e.altKey, 'A') +
        this._comboFragment(e.metaKey || e.ctrlKey, 'C') +
        this._comboFragment(e.shiftKey, 'S') +
        (((e.key != 'Alt') && (e.key != 'Ctrl')) ? e.key : '')).toLowerCase();
      if(keys in this.__hotkeysToActions){
        const action = this.__hotkeysToActions[keys];
        action.callback(event);
        keyComboPressed = keys;
        event.preventDefault();
      }
    });
    document.addEventListener('keyup', e => {
      if(!keyComboPressed)
        return;
      if(keyComboPressed in this.__hotkeysToActions){
        const action = this.__hotkeysToActions[keyComboPressed];
        if(action.hotkeyReleaseCallback){
          action.hotkeyReleaseCallback(event);
          event.preventDefault();
        }
        keyComboPressed = undefined;
      }
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

  _addATo(domElement, className, innerHTML) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = className;
    if (innerHTML) {
      a.innerHTML = innerHTML;
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

  _comboFragment(condition, fragment) {
    return condition ? fragment + '+' : '';
  }

  _keyComboAsText(action) {
    const { metaKeys, key } = action;
    if (!key && !metaKeys) {
      return '';
    }
    if(metaKeys){
      return 
        (metaKeys.shift ? this._comboFragment(metaKeys.shift, 'Shift') : '') +
        (metaKeys.alt ? this._comboFragment(metaKeys.alt, 'Alt') : '') +
        (metaKeys.control ? this._comboFragment(metaKeys.control, 'Ctrl') : '') +
        key;
    }
    else {
      return key
    }
  }
}

export {
  TopMenuBar
};
