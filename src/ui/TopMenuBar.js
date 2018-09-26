class TopMenuBar {
  constructor(commandRegistry, domElement) {
    this.commandRegistry = commandRegistry;
    this.domElement = domElement;

    this._buildTopBar();
  }

  _buildTopBar() {
    const { commandsTree } = this.commandRegistry;

    this.domElement.innerHTML = '';

    const ul = this._addUlTo(this.domElement, 'pure-menu-list');

    Object.keys(commandsTree).forEach(k => {
      const command = commandsTree[k];
      this._addMenuItemTo(ul, command, k);
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

  _addMenuItemTo(domElement, command, key) {
    const li = this._addLiTo(domElement, 'pure-menu-item');
    const a = this._addATo(
      li,
      'pure-menu-link',
      `${key} ${this._keyComboAsText(command)}`,
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
}

export default TopMenuBar;
