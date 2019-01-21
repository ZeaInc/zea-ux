import {
  VisualiveSession
} from '@visualive/collab';
import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Avatar from './Avatar.js';

const convertValuesToJSON = (value) => {
  if (value == undefined) {
    return undefined;
  } else if (value instanceof Visualive.BaseItem) {
    return '::' + value.getPath();
  } else if (value.toJSON) {
    const result = value.toJSON();
    result.typeName = Visualive.typeRegistry.getTypeName(value.constructor);
    return result;
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value)
      arr.push(convertValuesToJSON(element));
    return arr;
  } else if (typeof value === "object") {
    const dict = {};
    for (let key in value)
      dict[key] = convertValuesToJSON(value[key]);
    return dict;
  } else {
    return value;
  }
}

const convertValuesFromJSON = (value, scene) => {
  if (value == undefined) {
    return undefined;
  } else if (typeof value === 'string' && value.startsWith('::')) {
    return scene.getRoot().resolvePath(value, 1);
  } else if (value.typeName) {
    const newval = Visualive.typeRegistry.getType(value.typeName).create();
    newval.fromJSON(value);
    return newval;
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value)
      arr.push(convertValuesFromJSON(element, scene));
    return arr;
  } else if (typeof value === "object") {
    const dict = {};
    for (let key in value)
      dict[key] = convertValuesFromJSON(value[key], scene);
    return dict;
  } else {
    return value;
  }
}
export default class SessionSync {
  constructor(visualiveSession, appData, currentUser) {

    // const currentUserAvatar = new Avatar(appData, currentUser, true);

    const userDatas = {};

    visualiveSession.sub(VisualiveSession.actions.USER_JOINED, userData => {
      if (!(userData.id in userDatas)) {
        userDatas[userData.id] = {
          undoRedoManager: new UndoRedoManager(),
          avatar: new Avatar(appData, userData)
        }
      }
    })
    visualiveSession.sub(VisualiveSession.actions.USER_LEFT, userData => {
      if (!userDatas[userData.id]) {
        console.warn("User id not in session:", userData.id);
        return;
      }
      userDatas[userData.id].avatar.destroy();
      delete userDatas[userData.id];
    })

    /////////////////////////////////////////////
    // Video Streams
    visualiveSession.sub(VisualiveSession.actions.USER_VIDEO_STARTED, (data, userId)  => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const video = visualiveSession.getVideoStream(userId);
      if(video)
        userDatas[userId].avatar.attachRTCStream(video);
      
    })

    visualiveSession.sub(VisualiveSession.actions.USER_VIDEO_STOPPED, (data, userId)  => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      console.log("USER_VIDEO_STOPPED:", userId, " us:", currentUser.id)
      if(userDatas[userId].avatar)
        userDatas[userId].avatar.detachRTCStream(visualiveSession.getVideoStream(userId))
    })

    /////////////////////////////////////////////
    // Pose Changes
    appData.toolManager.movePointer.connect((event) => {
      const intersectionData = event.viewport.getGeomDataAtPos(event.mousePos, event.mouseRay);
      const rayLength = intersectionData ? intersectionData.dist : 5.0;
      const data = {
        interfaceType: 'CameraAndPointer',
        movePointer: {
          start: event.mouseRay.start,
          dir: event.mouseRay.dir,
          length: rayLength
        }
      }
      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, convertValuesToJSON(data));
    });
    appData.toolManager.hidePointer.connect((event) => {
      const data = {
        interfaceType: 'CameraAndPointer',
        hidePointer: {}
      }
      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, data);
    });
    appData.toolManager.hilightPointer.connect((event) => {
      const data = {
        interfaceType: 'CameraAndPointer',
        hilightPointer: {}
      };
      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, data);
    });
    appData.toolManager.unhilightPointer.connect((event) => {
      const data = {
        interfaceType: 'CameraAndPointer',
        unhilightPointer: {}
      }
      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, convertValuesToJSON(data));
    });

    let tick = 0;

    appData.renderer.viewChanged.connect((event) => {

      tick++;
      if (event.vrviewport) {
        // only push every second pose of a vr stream. 
        if (tick % 2 != 0)
          return;
      }
      
      const data = {
        interfaceType: event.interfaceType,
        viewXfo: event.viewXfo
      };
      if (event.focalDistance) {
        data.focalDistance = event.focalDistance;
      }
      else if (event.controllers) {
        data.controllers = [];
        for (let controller of event.controllers) {
          data.controllers.push({
            xfo: controller.getTreeItem().getGlobalXfo()
          });
        }
      }

      // currentUserAvatar.updatePose(data);


      visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, convertValuesToJSON(data));
    });

    visualiveSession.sub(VisualiveSession.actions.POSE_CHANGED, (jsonData, userId) => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const data = convertValuesFromJSON(jsonData, appData.scene);
      const avatar = userDatas[userId].avatar;
      avatar.updatePose(data);
    });

    // Emit a signal to configure remote avatars to the current camera transform.
    visualiveSession.pub(VisualiveSession.actions.POSE_CHANGED, convertValuesToJSON({
        interfaceType: 'CameraAndPointer',
        viewXfo: appData.renderer.getViewport().getCamera().getGlobalXfo()
    }));

    /////////////////////////////////////////////
    // Scene Changes
    // const otherUndoStack = new UndoRedoManager();

    appData.undoRedoManager.changeAdded.connect((change) => {
      const data = {
        changeData: change.toJSON(appData),
        changeClass: UndoRedoManager.getChangeClassName(change)
      };
      visualiveSession.pub(VisualiveSession.actions.COMMAND_ADDED, data)

      // const otherChange = otherUndoStack.constructChange(data.changeClass);
      // otherChange.fromJSON(data.changeData, appData)
      // otherUndoStack.addChange(otherChange);
    })

    appData.undoRedoManager.changeUpdated.connect((data) => {
      const jsonData = convertValuesToJSON(data)
      visualiveSession.pub(VisualiveSession.actions.COMMAND_UPDATED, jsonData)


      // const changeData2 = convertValuesFromJSON(jsonData, appData.scene);
      // otherUndoStack.getCurrentChange().update(changeData2);
    })

    visualiveSession.sub(VisualiveSession.actions.COMMAND_ADDED, (data, userId) => {
      console.log("Remote Command added:", data.changeClass, userId)
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const change = undoRedoManager.constructChange(data.changeClass);
      change.fromJSON(data.changeData, appData)
      undoRedoManager.addChange(change);
    })

    visualiveSession.sub(VisualiveSession.actions.COMMAND_UPDATED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn("User id not in session:", userId);
        return;
      }
      const undoRedoManager = userDatas[userId].undoRedoManager;
      const changeData = convertValuesFromJSON(data, appData.scene);
      undoRedoManager.getCurrentChange().update(changeData);
    })

    /////////////////////////////////////////////
    // Undostack Changes.
    // Synchronize undo stacks between users.

    appData.undoRedoManager.changeUndone.connect(() => {
      visualiveSession.pub("UndoRedoManager_changeUndone", {})
    })

    visualiveSession.sub("UndoRedoManager_changeUndone", (data, userId) => {
      const undoRedoManager = userDatas[userId].undoRedoManager;
      undoRedoManager.undo();
    })

    appData.undoRedoManager.changeRedone.connect(() => {
      visualiveSession.pub("UndoRedoManager_changeRedone", {})
    })

    visualiveSession.sub("UndoRedoManager_changeRedone", (data, userId) => {
      const undoRedoManager = userDatas[userId].undoRedoManager;
      undoRedoManager.redo();
    })

    /////////////////////////////////////////////
    // State Machine Changes.
    // Synchronize State Machine changes between users.

    Visualive.sgFactory.registerCallback('StateMachine', (stateMachine) => {
      stateMachine.stateChanged.connect(name => {

        visualiveSession.pub("StateMachine_stateChanged", {
          stateMachine: stateMachine.getPath(),
          stateName: name
        })
      })
    })

    visualiveSession.sub("StateMachine_stateChanged", (data, userId) => {
      const stateMachine = appData.scene.getRoot().resolvePath(data.stateMachine, 1);
      stateMachine.activateState(data.stateName)
    })

  }
}