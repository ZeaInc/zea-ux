import { Session } from '@zeainc/zea-collab';
import UndoRedoManager from './undoredo/UndoRedoManager.js';
import SelectionManager from './SelectionManager.js';
import Avatar from './Avatar.js';

const convertValuesToJSON = value => {
  if (value == undefined) {
    return undefined;
  } else if (value instanceof ZeaEngine.BaseItem) {
    return '::' + value.getPath();
  } else if (value.toJSON) {
    const result = value.toJSON();
    result.typeName = ZeaEngine.typeRegistry.getTypeName(value.constructor);
    return result;
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value) arr.push(convertValuesToJSON(element));
    return arr;
  } else if (typeof value === 'object') {
    const dict = {};
    for (const key in value) dict[key] = convertValuesToJSON(value[key]);
    return dict;
  } else {
    return value;
  }
};

const convertValuesFromJSON = (value, scene) => {
  if (value == undefined) {
    return undefined;
  } else if (typeof value === 'string' && value.startsWith('::')) {
    return scene.getRoot().resolvePath(value, 1);
  } else if (value.typeName) {
    const newval = ZeaEngine.typeRegistry.getType(value.typeName).create();
    newval.fromJSON(value);
    return newval;
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value)
      arr.push(convertValuesFromJSON(element, scene));
    return arr;
  } else if (typeof value === 'object') {
    const dict = {};
    for (const key in value)
      dict[key] = convertValuesFromJSON(value[key], scene);
    return dict;
  } else {
    return value;
  }
};

/** Class representing a session sync. */
class SessionSync {
  /**
   * Create a session sync.
   * @param {any} session - The session value.
   * @param {any} appData - The appData value.
   * @param {any} currentUser - The currentUser value.
   */
  constructor(session, appData, currentUser, options) {
    // const currentUserAvatar = new Avatar(appData, currentUser, true);

    const userDatas = {};

    session.sub(Session.actions.USER_JOINED, userData => {
      if (!(userData.id in userDatas)) {
        userDatas[userData.id] = {
          undoRedoManager: new UndoRedoManager(),
          avatar: new Avatar(appData, userData),
          selectionManager: new SelectionManager(appData, {
            ...options,
            enableXfoHandles: false,
            setItemsSelected: false
          }),
        };
      }
    });
    session.sub(Session.actions.USER_LEFT, userData => {
      if (!userDatas[userData.id]) {
        console.warn('User id not in session:', userData.id);
        return;
      }
      userDatas[userData.id].avatar.destroy();
      delete userDatas[userData.id];
    });

    // ///////////////////////////////////////////
    // Video Streams
    session.sub(Session.actions.USER_VIDEO_STARTED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return;
      }
      const video = session.getVideoStream(userId);
      if (video) userDatas[userId].avatar.attachRTCStream(video);
    });

    session.sub(Session.actions.USER_VIDEO_STOPPED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return;
      }
      console.log('USER_VIDEO_STOPPED:', userId, ' us:', currentUser.id);
      if (userDatas[userId].avatar)
        userDatas[userId].avatar.detachRTCStream(
          session.getVideoStream(userId)
        );
    });

    // ///////////////////////////////////////////
    // Pose Changes
    appData.toolManager.movePointer.connect(event => {
      const intersectionData = event.viewport.getGeomDataAtPos(
        event.mousePos,
        event.mouseRay
      );
      const rayLength = intersectionData ? intersectionData.dist : 5.0;
      const data = {
        interfaceType: 'CameraAndPointer',
        movePointer: {
          start: event.mouseRay.start,
          dir: event.mouseRay.dir,
          length: rayLength,
        },
      };
      session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
    });
    appData.toolManager.hidePointer.connect(event => {
      const data = {
        interfaceType: 'CameraAndPointer',
        hidePointer: {},
      };
      session.pub(Session.actions.POSE_CHANGED, data);
    });
    appData.toolManager.hilightPointer.connect(event => {
      const data = {
        interfaceType: 'CameraAndPointer',
        hilightPointer: {},
      };
      session.pub(Session.actions.POSE_CHANGED, data);
    });
    appData.toolManager.unhilightPointer.connect(event => {
      const data = {
        interfaceType: 'CameraAndPointer',
        unhilightPointer: {},
      };
      session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
    });

    let tick = 0;

    appData.renderer.viewChanged.connect(event => {
      tick++;
      if (event.vrviewport) {
        // only push every second pose of a vr stream.
        if (tick % 2 != 0) return;
      }

      const data = {
        interfaceType: event.interfaceType,
        viewXfo: event.viewXfo,
      };
      if (event.focalDistance) {
        data.focalDistance = event.focalDistance;
      } else if (event.hmd) {
        data.hmd = event.hmd;
        data.controllers = [];
        for (const controller of event.controllers) {
          data.controllers.push({
            xfo: controller.getTreeItem().getGlobalXfo(),
          });
        }
      }

      // currentUserAvatar.updatePose(data);

      session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
    });

    session.sub(Session.actions.POSE_CHANGED, (jsonData, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return;
      }
      const data = convertValuesFromJSON(jsonData, appData.scene);
      const avatar = userDatas[userId].avatar;
      avatar.updatePose(data);
    });

    // Emit a signal to configure remote avatars to the current camera transform.
    session.pub(
      Session.actions.POSE_CHANGED,
      convertValuesToJSON({
        interfaceType: 'CameraAndPointer',
        viewXfo: appData.renderer
          .getViewport()
          .getCamera()
          .getGlobalXfo(),
      })
    );

    // ///////////////////////////////////////////
    // Scene Changes
    // const otherUndoStack = new UndoRedoManager();

    const root = appData.scene.getRoot();
    appData.undoRedoManager.changeAdded.connect(change => {
      const context = {
        appData,
        makeRelative: path => path,
        resolvePath: (path, cb) => {
          // Note: Why not return a Promise here?
          // Promise evaluation is always async, so
          // all promisses will be resolved after the current call stack
          // has terminated. In our case, we want all paths
          // to be resolved before the end of the function, which
          // we can handle easily with callback functions. 
          if (!path) throw 'Path not spcecified';
          const item = root.resolvePath(path);
          if (item) {
            cb(item);
          } else {
            console.warn("Path unable to be resolved:" + path);
          }
        }
      };
      const data = {
        changeData: change.toJSON(context),
        changeClass: UndoRedoManager.getChangeClassName(change),
      };
      session.pub(Session.actions.COMMAND_ADDED, data);

      // const otherChange = otherUndoStack.constructChange(data.changeClass);
      // otherChange.fromJSON(data.changeData, { appData })
      // otherUndoStack.addChange(otherChange);
    });

    appData.undoRedoManager.changeUpdated.connect(data => {
      const jsonData = convertValuesToJSON(data);
      session.pub(Session.actions.COMMAND_UPDATED, jsonData);

      // const changeData2 = convertValuesFromJSON(jsonData, appData.scene);
      // otherUndoStack.getCurrentChange().update(changeData2);
    });

    session.sub(Session.actions.COMMAND_ADDED, (data, userId) => {
      // console.log("Remote Command added:", data.changeClass, userId)
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const change = undoRedoManager.constructChange(data.changeClass);

      const context = {
        appData: {
          selectionManager: userDatas[userId].selectionManager,
          scene: appData.scene,
        },
      };
      change.fromJSON(data.changeData, context);
      undoRedoManager.addChange(change);
    });

    session.sub(Session.actions.COMMAND_UPDATED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const changeData = convertValuesFromJSON(data, appData.scene);
      undoRedoManager.getCurrentChange().update(changeData);
    });

    // ///////////////////////////////////////////
    // Undostack Changes.
    // Synchronize undo stacks between users.

    appData.undoRedoManager.changeUndone.connect(() => {
      session.pub('UndoRedoManager_changeUndone', {});
    });

    session.sub('UndoRedoManager_changeUndone', (data, userId) => {
      const undoRedoManager = userDatas[userId].undoRedoManager;
      undoRedoManager.undo();
    });

    appData.undoRedoManager.changeRedone.connect(() => {
      session.pub('UndoRedoManager_changeRedone', {});
    });

    session.sub('UndoRedoManager_changeRedone', (data, userId) => {
      const undoRedoManager = userDatas[userId].undoRedoManager;
      undoRedoManager.redo();
    });

    // ///////////////////////////////////////////
    // State Machine Changes.
    // Synchronize State Machine changes between users.

    ZeaEngine.sgFactory.registerCallback('StateMachine', stateMachine => {
      stateMachine.stateChanged.connect(name => {
        session.pub('StateMachine_stateChanged', {
          stateMachine: stateMachine.getPath(),
          stateName: name,
        });
      });
    });

    session.sub('StateMachine_stateChanged', (data, userId) => {
      const stateMachine = appData.scene
        .getRoot()
        .resolvePath(data.stateMachine, 1);
      stateMachine.activateState(data.stateName);
    });
  }
}

export { SessionSync };
