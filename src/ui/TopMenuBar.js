import CommandRegistry from '../CommandRegistry';

class TopMenuBar {
  constructor(menuItems, domElement) {
    this.menuItems = menuItems;
    this.domElement = domElement;

    this._registerCommands();
    this._buildTopBar();
  }

  _buildTopBar() {
    this.domElement.innerHTML = '';

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    this.menuItems.forEach(rootMenuItem => {
      this._addMenuItemTo(ul, rootMenuItem);
    });
  }

  _addMenuItemTo(domElement, command) {
    const li = this._addLiTo(domElement, 'pure-menu-item');
    const a = this._addATo(
      li,
      'pure-menu-link',
      `${command.title} ${this._keyComboAsText(command)}`,
      command.callback
    );

    const { children } = command;

    if (children && children.length) {
      li.classList.add('pure-menu-has-children', 'pure-menu-allow-hover');
      const ul = this._addUlTo(li, 'pure-menu-children shadow-3');

      children.forEach(child => {
        this._addMenuItemTo(ul, child, child.name);
      });
    }
  }

  _registerCommands() {
    const commandRegistry = new CommandRegistry();

    const registerChildren = command => {
      command.children.forEach(child => {
        if (child.children) {
          registerChildren(child);
        } else {
          if (child.key) {
            commandRegistry.registerCommand(child);
          }
        }
      });
    };

    this.menuItems.forEach(rootMenuItem => {
      if (rootMenuItem.children) {
        registerChildren(rootMenuItem);
      }
    });
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

  _keyComboAsText(command) {
    const { metaKeys, key } = command;
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
