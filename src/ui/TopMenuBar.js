
class TopMenuBar {
  constructor(actionRegistry, domElement) {
    this.actionRegistry = actionRegistry;
    this.domElement = domElement;
    this.__rootLevelItems = {};

    this._buildTopBar();
  }

  _buildTopBar() {
    this.domElement.innerHTML = '';

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    const actions = this.actionRegistry.getActions();
    actions.forEach(action => {
      this._addMenuItemTo(ul, action);
    });

    this.actionRegistry.actionAdded.connect((action)=>{

      this._addMenuItemTo(ul, action);
    })
  }

  _addMenuItemTo(domElement, action) {
    let parentElement = domElement;
    for(let i=0; i<action.path.length; i++) {
      const pathItem = action.path[i];
      if(!this.__rootLevelItems[pathItem]) {
        if(i==0) {
          
        }
        const li = this._addLiTo(parentElement, 'pure-menu-item');
        li.classList.add('pure-menu-has-children', 'pure-menu-allow-hover');
        this._addSpanTo(li, 'ActionTitle', pathItem);
        this.__rootLevelItems[pathItem] = li;
      }
      parentElement = this.__rootLevelItems[pathItem]
    }
    const a = this._addATo(parentElement, 'pure-menu-link', null, action.callback);
    this._addSpanTo(a, 'ActionTitle', action.name);
    this._addSpanTo(a, 'ActionShortcut', this._keyComboAsText(action));

    // const { children } = action;

    // if (children && children.length) {
    //   li.classList.add('pure-menu-has-children', 'pure-menu-allow-hover');
    //   const ul = this._addUlTo(li, 'pure-menu-children shadow-3');

    //   children.forEach(child => {
    //     this._addMenuItemTo(ul, child, child.name);
    //   });
    // }
  }

  _addKeyListener(action) {
    document.addEventListener('keydown', e => {
      const metaKeys = action.metaKeys || {};

      const keyComboExpected =
        this._comboFragment(metaKeys.alt, 'A') +
        this._comboFragment(metaKeys.control, 'C') +
        this._comboFragment(metaKeys.shift, 'S') +
        action.key;

      const keyComboPressed =
        this._comboFragment(e.altKey, 'A') +
        this._comboFragment(e.metaKey || e.ctrlKey, 'C') +
        this._comboFragment(e.shiftKey, 'S') +
        e.key;

      if (keyComboExpected.toLowerCase() === keyComboPressed.toLowerCase()) {
        this._invokeCallback(action.callback, e);
      }
    });
  }

  _invokeCallback(callback, event) {
    event.preventDefault();
    callback();
  }

  // _registerActions() {
  //   const ActionRegistry = new ActionRegistry();

  //   const registerChildren = action => {
  //     action.children.forEach(child => {
  //       if (child.children) {
  //         registerChildren(child);
  //       } else {
  //         if (child.key) {
  //           ActionRegistry.registerAction(child);
  //         }
  //       }
  //     });
  //   };

  //   this.menuItems.forEach(rootMenuItem => {
  //     if (rootMenuItem.children) {
  //       registerChildren(rootMenuItem);
  //     }
  //   });
  // }

  _addSpanTo(domElement, className, innerHTML) {
    const span = document.createElement('span');
    span.className = className;
    if (innerHTML) {
      span.innerHTML = innerHTML;
    }
    domElement.appendChild(span);
    return span;
  }

  _addATo(domElement, className, innerHTML, onClick) {
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
    if (!key) {
      return '';
    }
    const keyComboExpected =
      this._comboFragment(metaKeys.shift, 'Shift') +
      this._comboFragment(metaKeys.alt, 'Alt') +
      this._comboFragment(metaKeys.control, 'Ctrl') +
      key;
    return keyComboExpected;
  }
}

export default TopMenuBar;
