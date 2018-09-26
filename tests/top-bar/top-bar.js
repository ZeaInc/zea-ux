import {
  TopMenuBar,
  CommandRegistry,
  undoRedoManager,
} from '@Visualive/ux';

const commandRegistry = new CommandRegistry();

commandRegistry.registerCommand({
  pathOnMenu: ['Edit'],
  name: 'Undo',
  callback: () => {
    console.log('call undo');
    undoRedoManager.undo();
  },
  metaKeys: {
    control: true,
  },
  key: 'z',
});

commandRegistry.registerCommand({
  pathOnMenu: ['Edit'],
  name: 'Redo',
  callback: () => {
    console.log('call redo');
    undoRedoManager.redo();
  },
  metaKeys: {
    control: true,
    shift: true,
  },
  key: 'z',
});

const topMenuBar = new TopMenuBar(
  commandRegistry,
  document.getElementById('TopMenuWrapper')
);
