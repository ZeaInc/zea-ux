import visualiveUxFactory from './VisualiveUxFactory.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';


// class ActionElement {
//   constructor(treeItem, parentDomElement, appData, expanded = false) {
//     this.treeItem = treeItem;
//     this.parentDomElement = parentDomElement;
//     this.appData = appData;

//     this.li = document.createElement('li');
//     this.li.className = 'TreeNodesListItem';

//     this.expandBtn = document.createElement('button');
//     this.expandBtn.className = 'TreeNodesListItem__ToggleExpanded';
//     this.li.appendChild(this.expandBtn);

//     // Visibility toggle.
//     this.toggleVisibilityBtn = document.createElement('button');
//     this.toggleVisibilityBtn.className = 'TreeNodesListItem__ToggleVisibility';
//     this.li.appendChild(this.toggleVisibilityBtn);
//     this.toggleVisibilityBtn.innerHTML =
//       '<i class="material-icons md-15">visibility</i>';


//     this.toggleVisibilityBtn.addEventListener('click', () => {
//       const visibleParam = this.treeItem.getParameter('Visible');
//       const change = new ParameterValueChange(visibleParam, !visibleParam.getValue());
//       this.appData.undoRedoManager.addChange(change);
//     });

//     const updateVisibility = () => {
//       const visible = this.treeItem.getVisible();
//       visible
//         ? this.li.classList.remove('TreeNodesListItem--isHidden')
//         : this.li.classList.add('TreeNodesListItem--isHidden');
//     }
//     this.treeItem.visibilityChanged.connect(updateVisibility);
//     updateVisibility();



//     // Title element.
//     this.titleElement = document.createElement('span');
//     this.titleElement.className = 'TreeNodesListItem__Title';
//     this.titleElement.textContent = treeItem.getName();
//     this.li.appendChild(this.titleElement);

//     const selectedParam = this.treeItem.getParameter('Selected');

//     this.titleElement.addEventListener('click', (e) => {
//       appData.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey);
//     });

//     const updateSelected = ()=>{
//       const selected = selectedParam.getValue();
//       selected
//         ? this.li.classList.add('TreeNodesListItem--isSelected')
//         : this.li.classList.remove('TreeNodesListItem--isSelected');
//     }
//     selectedParam.valueChanged.connect(updateSelected);
//     updateSelected()

//     this.parentDomElement.appendChild(this.li);

//     this.ul = document.createElement('ul');
//     this.ul.className = 'TreeNodesList';
//     this.li.appendChild(this.ul);

//     this.childElements = [];
//     this._expanded = false;

//     if (expanded) {
//       this.expand();
//     } else {
//       const children = this.treeItem.getChildren();
//       if (children.length > 0)
//         this.collapse();
//     }

//     this.expandBtn.addEventListener('click', () => {
//       if (this.treeItem.numChildren() > 0) {
//         this._expanded ? this.collapse() : this.expand();
//       }
//     });

//     this.treeItem.childAdded.connect((childItem, index) => {
//       this.addChild(childItem);
//     });

//     this.treeItem.childRemoved.connect((childItem, index) => {
//       this.childElements[index].destroy();
//       this.childElements.splice(index, 1);
//     });

//   }

//   addComponent(component) {

//     if(!this.subul) {
//       this.subul = document.createElement('ul');
//       // this.subul.className = 'TreeNodesList';
//       this.titleElement.appendChild(this.subul);
//     }

//     // Title element.
//     const li = document.createElement('li');
//     li.className = 'TreeNodesListItem';
//     const nameElement = document.createElement('span');
//     nameElement.className = 'TreeNodesListItem__Title';
//     nameElement.textContent = component;
//     li.appendChild(nameElement);
//     this.subul.appendChild(li);
//   }

//   addChild(treeItem, expanded = false) {
//     if(this._expanded) {
//       const childAction = visualiveUxFactory.constructActionElement(
//         treeItem,
//         this.ul,
//         this.appData,
//         expanded
//       );
//       this.childElements.push(childAction);
//     }
//     else {
//       this.collapse();
//     }
//   }

//   expand() {
//     this._expanded = true;
//     this.ul.classList.remove('TreeNodesList--collapsed');
//     this.expandBtn.innerHTML =
//       '<i class="material-icons md-24">arrow_drop_down</i>';

//     if (!this.childrenAlreadyCreated) {
//       const children = this.treeItem.getChildren();
//       for (let child of children) {
//         this.addChild(child);
//       }
//       this.childrenAlreadyCreated = true;
//     }
//   }

//   collapse() {
//     this.ul.classList.add('TreeNodesList--collapsed');
//     this.expandBtn.innerHTML =
//       '<i class="material-icons md-24">arrow_right</i>';
//     this._expanded = false;
//   }

//   destroy() {
//     this.parentDomElement.removeChild(this.li);
//   }
// }


class ActionTreeView {
  constructor(domElement, actionRegistry) {
    this.domElement = domElement;
    this.actionRegistry = actionRegistry;

    // this.ul = document.createElement('ul');
    // this.ul.className = 'TreeNodesList TreeNodesList--root';

    // this.domElement.appendChild(this.ul);

    // this.rootElement = new ActionElement(rootAction, this.ul, actionRegistry, true);

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
      // parentElement = this.__existingItems[pathItem]
    }

    const a = this._addATo(parentElement, 'pure-menu-link', null, action.callback);
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
}

export default ActionTreeView;
